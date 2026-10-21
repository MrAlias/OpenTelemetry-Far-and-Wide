// SPDX-License-Identifier: Apache-2.0
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"

	"go.opentelemetry.io/obi/pkg/appolly/discover"
	"go.opentelemetry.io/obi/pkg/instrumenter"
	"go.opentelemetry.io/obi/pkg/obi"
	"go.opentelemetry.io/obi/pkg/selection"
)

type process struct {
	PID        uint32 `json:"pid"`
	Service    string `json:"service"`
	TraceOwner string `json:"trace_owner"`
	Pod        string `json:"pod"`
	StartTime  string `json:"start_time"`
}

// Deliberately restricted proof reconciler. Only explicitly marked processes
// belong to this experiment. This is not a general language-discovery controller.
func scan() map[uint32]process {
	result := map[uint32]process{}
	entries, err := os.ReadDir("/proc")
	if err != nil {
		log.Printf("proc scan: %v", err)
		return result
	}
	for _, entry := range entries {
		pid, err := strconv.ParseUint(entry.Name(), 10, 32)
		if err != nil {
			continue
		}
		environ, err := os.ReadFile("/proc/" + entry.Name() + "/environ")
		if err != nil {
			continue
		}
		env := map[string]string{}
		for _, pair := range strings.Split(string(environ), "\x00") {
			key, value, ok := strings.Cut(pair, "=")
			if ok {
				env[key] = value
			}
		}
		if env["PROOF_NAMESPACE"] != "far-wide-proof" {
			continue
		}
		service := env["PROOF_SERVICE"]
		if service != "gateway" && service != "checkout" && service != "inventory" {
			continue
		}
		cmd, err := os.ReadFile("/proc/" + entry.Name() + "/cmdline")
		if err != nil {
			continue
		}
		command := strings.ReplaceAll(string(cmd), "\x00", " ")
		if !strings.Contains(command, "/app/gateway") && !strings.Contains(command, "demo.checkout.Checkout") && !strings.Contains(command, "/app/inventory.js") {
			continue
		}
		stat, err := os.ReadFile("/proc/" + entry.Name() + "/stat")
		if err != nil {
			continue
		}
		// comm can contain spaces or parentheses. Fields after the final ')' start
		// at field 3; starttime is field 22, hence index 19 in this suffix.
		end := strings.LastIndex(string(stat), ")")
		if end < 0 {
			continue
		}
		fields := strings.Fields(string(stat)[end+1:])
		if len(fields) < 20 {
			continue
		}
		owner := "obi"
		if service == "checkout" && strings.Contains(env["JAVA_TOOL_OPTIONS"], "-javaagent:") {
			owner = "sdk"
		}
		result[uint32(pid)] = process{uint32(pid), service, owner, env["PROOF_POD"], fields[19]}
	}
	return result
}

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()
	file, err := os.Open("/config/obi.yaml")
	if err != nil {
		log.Fatal(err)
	}
	cfg, err := obi.LoadConfig(file)
	_ = file.Close()
	if err != nil {
		log.Fatal(err)
	}
	// The library's embedding configuration API is v1. Runtime membership is
	// provided through WithDynamicSelector; no static selection is combined.
	selector := discover.NewDynamicSelector()
	var mu sync.RWMutex
	current := map[uint32]process{}
	mux := http.NewServeMux()
	mux.HandleFunc("GET /state", func(w http.ResponseWriter, _ *http.Request) {
		mu.RLock()
		defer mu.RUnlock()
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(current)
	})
	server := &http.Server{Addr: ":7777", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Print(err)
			stop()
		}
	}()
	go func() {
		ticker := time.NewTicker(200 * time.Millisecond)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				next := scan()
				mu.Lock()
				for pid, old := range current {
					if next[pid] != old {
						selector.RemovePIDs(pid)
					}
				}
				for pid, p := range next {
					if current[pid] == p {
						continue
					}
					opts := selection.DynamicOptions{ServiceName: p.Service, ServiceNamespace: "far-wide-proof", ResourceAttributes: map[string]string{"proof.pod": p.Pod}}
					selector.AppMetrics().AddPID(pid, opts)
					if p.TraceOwner == "obi" {
						selector.Traces().AddPID(pid, opts)
					}
					log.Printf("ownership pid=%d start=%s pod=%s service=%s traces=%s metrics=obi", pid, p.StartTime, p.Pod, p.Service, p.TraceOwner)
				}
				current = next
				mu.Unlock()
			}
		}
	}()
	log.Print("OBI v0.14.0 proof embedding: namespace=far-wide-proof")
	if err := instrumenter.Run(ctx, cfg, instrumenter.WithDynamicSelector(selector)); err != nil {
		fmt.Fprintln(os.Stderr, err)
		stop()
	}
	shutdown, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = server.Shutdown(shutdown)
}
