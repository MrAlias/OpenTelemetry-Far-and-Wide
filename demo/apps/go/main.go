package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

func main() {
	name := os.Getenv("SERVICE_NAME")
	domains := map[string]any{
		"shipping":  map[string]any{"carrier": "Demo Parcel", "deliveryDays": 2},
		"warehouse": map[string]any{"location": "Toronto", "aisle": "B-12"},
		"currency":  map[string]any{"currency": "CAD", "usdRate": 0.73},
	}
	details, ok := domains[name]
	if !ok {
		log.Fatalf("unknown SERVICE_NAME: %q", name)
	}
	client := &http.Client{Timeout: 3 * time.Second}
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})
	http.HandleFunc("/work", func(w http.ResponseWriter, r *http.Request) {
		dependencies := []json.RawMessage{}
		for _, downstream := range strings.FieldsFunc(os.Getenv("DOWNSTREAM_SERVICES"), func(c rune) bool { return c == ',' }) {
			request, err := http.NewRequestWithContext(r.Context(), http.MethodGet, "http://"+downstream+":8080/work", nil)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadGateway)
				return
			}
			response, err := client.Do(request)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadGateway)
				return
			}
			var body json.RawMessage
			err = json.NewDecoder(response.Body).Decode(&body)
			response.Body.Close()
			if err != nil || response.StatusCode != http.StatusOK {
				http.Error(w, "dependency failed: "+downstream, http.StatusBadGateway)
				return
			}
			dependencies = append(dependencies, body)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]any{
			"service": name, "language": "Go", "details": details, "dependencies": dependencies,
		})
	})
	log.Printf("%s listening on 8080", name)
	log.Fatal((&http.Server{Addr: ":8080", ReadHeaderTimeout: 5 * time.Second}).ListenAndServe())
}
