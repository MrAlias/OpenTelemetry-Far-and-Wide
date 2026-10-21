// SPDX-License-Identifier: Apache-2.0
// The proof router provides an explicit per-request handoff and drain ledger.
// It exports no telemetry and neither creates nor changes trace context.
package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"strings"
	"sync"
	"time"
)

type target struct {
	Pod string `json:"pod"`
	IP  string `json:"ip"`
}
type entry struct {
	Pod     string `json:"pod"`
	TraceID string `json:"trace_id"`
	Parent  string `json:"parent_span_id"`
	Start   int64  `json:"start_ns"`
	End     int64  `json:"end_ns"`
	Status  int    `json:"status"`
}
type router struct {
	mu        sync.Mutex
	route     target
	active    map[string]int
	ledger    []entry
	transport http.RoundTripper
}
type response struct {
	http.ResponseWriter
	status int
}

func (w *response) WriteHeader(code int) { w.status = code; w.ResponseWriter.WriteHeader(code) }
func (w *response) Write(b []byte) (int, error) {
	if w.status == 0 {
		w.WriteHeader(200)
	}
	return w.ResponseWriter.Write(b)
}

func newRouter() *router {
	return &router{active: map[string]int{}, transport: &http.Transport{
		DisableKeepAlives: true, DialContext: (&net.Dialer{Timeout: 2 * time.Second}).DialContext,
		ResponseHeaderTimeout: 5 * time.Second,
	}}
}
func (r *router) serve(w http.ResponseWriter, req *http.Request) {
	r.mu.Lock()
	destination := r.route
	if destination.Pod == "" {
		r.mu.Unlock()
		http.Error(w, "No admitted checkout pod", 503)
		return
	}
	r.active[destination.Pod]++
	r.mu.Unlock()
	item := entry{Pod: destination.Pod, Start: time.Now().UnixNano()}
	parts := strings.Split(req.Header.Get("traceparent"), "-")
	if len(parts) == 4 {
		item.TraceID = parts[1]
		item.Parent = parts[2]
	}
	result := &response{ResponseWriter: w}
	proxy := &httputil.ReverseProxy{Transport: r.transport, Director: func(out *http.Request) {
		out.URL.Scheme = "http"
		out.URL.Host = net.JoinHostPort(destination.IP, "8080")
	}, ErrorHandler: func(w http.ResponseWriter, _ *http.Request, err error) {
		log.Printf("checkout %s: %v", destination.Pod, err)
		http.Error(w, "Upstream failure", 502)
	}}
	proxy.ServeHTTP(result, req)
	item.End = time.Now().UnixNano()
	item.Status = result.status
	r.mu.Lock()
	r.active[destination.Pod]--
	r.ledger = append(r.ledger, item)
	r.mu.Unlock()
}
func (r *router) admin() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /state", func(w http.ResponseWriter, _ *http.Request) {
		r.mu.Lock()
		defer r.mu.Unlock()
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"route": r.route, "active": r.active, "ledger": r.ledger})
	})
	mux.HandleFunc("PUT /route", func(w http.ResponseWriter, req *http.Request) {
		var change struct {
			target
			ExpectedPod string `json:"expected_pod"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, req.Body, 4096)).Decode(&change); err != nil || change.Pod == "" || net.ParseIP(change.IP) == nil {
			http.Error(w, "Invalid route", 400)
			return
		}
		r.mu.Lock()
		defer r.mu.Unlock()
		if r.route.Pod != change.ExpectedPod {
			http.Error(w, "Route changed concurrently", 409)
			return
		}
		r.route = change.target
		_ = json.NewEncoder(w).Encode(r.route)
	})
	return mux
}
func main() {
	r := newRouter()
	go func() {
		log.Fatal((&http.Server{Addr: ":7778", Handler: r.admin(), ReadHeaderTimeout: 5 * time.Second}).ListenAndServe())
	}()
	log.Fatal((&http.Server{Addr: ":8080", Handler: http.HandlerFunc(r.serve), ReadHeaderTimeout: 5 * time.Second}).ListenAndServe())
}
