package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

// Ordinary application code: no telemetry dependencies or context forwarding.
func main() {
	client := &http.Client{Timeout: 5 * time.Second}
	http.HandleFunc("/checkout", func(w http.ResponseWriter, r *http.Request) {
		response, err := client.Get("http://checkout:8080/checkout")
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		defer response.Body.Close()
		w.WriteHeader(response.StatusCode)
		_, _ = io.Copy(w, response.Body)
	})
	fmt.Println("gateway listening on 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
