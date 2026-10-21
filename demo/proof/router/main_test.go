package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

type roundTripper func(*http.Request) (*http.Response, error)

func (fn roundTripper) RoundTrip(req *http.Request) (*http.Response, error) { return fn(req) }

func TestHandoffDrainsOldRequestAndRoutesNewOnExistingConnection(t *testing.T) {
	r := newRouter()
	r.route = target{Pod: "old", IP: "10.0.0.1"}
	started, release, done := make(chan struct{}), make(chan struct{}), make(chan struct{})
	r.transport = roundTripper(func(req *http.Request) (*http.Response, error) {
		if req.URL.Host == "10.0.0.1:8080" {
			close(started)
			<-release
		}
		if req.Header.Get("traceparent") != "00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01" {
			t.Error("Trace context changed")
		}
		return &http.Response{StatusCode: 200, Header: http.Header{}, Body: io.NopCloser(strings.NewReader("ok"))}, nil
	})
	request := func() *http.Request {
		req := httptest.NewRequest("GET", "http://checkout/checkout", nil)
		req.Header.Set("traceparent", "00-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-bbbbbbbbbbbbbbbb-01")
		return req
	}
	go func() { r.serve(httptest.NewRecorder(), request()); close(done) }()
	<-started
	change := httptest.NewRequest("PUT", "/route", strings.NewReader(`{"pod":"new","ip":"10.0.0.2","expected_pod":"old"}`))
	response := httptest.NewRecorder()
	r.admin().ServeHTTP(response, change)
	if response.Code != 200 {
		t.Fatal(response.Body.String())
	}
	r.mu.Lock()
	active := r.active["old"]
	r.mu.Unlock()
	if active != 1 {
		t.Fatal("Old request disappeared during handoff")
	}
	result := httptest.NewRecorder()
	r.serve(result, request())
	if result.Code != 200 {
		t.Fatal("New route failed")
	}
	close(release)
	<-done
	if r.active["old"] != 0 || len(r.ledger) != 2 || r.ledger[0].Pod != "new" || r.ledger[1].Pod != "old" {
		t.Fatal("Incorrect drain ledger", r.ledger)
	}
}

func TestConcurrentRouteChangeRejected(t *testing.T) {
	r := newRouter()
	r.route = target{Pod: "current", IP: "10.0.0.1"}
	response := httptest.NewRecorder()
	r.admin().ServeHTTP(response, httptest.NewRequest("PUT", "/route", strings.NewReader(`{"pod":"new","ip":"10.0.0.2","expected_pod":"stale"}`)))
	if response.Code != 409 || r.route.Pod != "current" {
		t.Fatal("Stale writer changed route")
	}
}
