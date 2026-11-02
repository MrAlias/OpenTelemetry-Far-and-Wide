window.TIMEOUT_EVIDENCE = {
  "source": "public/demo-capture/java-trace-evidence.json",
  "traceId": "26abea5ca66f7e87389d931bfecdf3d0",
  "spanId": "db4cc8d8ad24054a",
  "name": "GET",
  "durationMs": 2002.943857,
  "errorType": "java.net.SocketTimeoutException",
  "url": "http://192.0.2.42:8080/price",
  "exceptionType": "java.net.SocketTimeoutException",
  "exceptionMessage": "Connect timed out",
  "environmentKey": "process.environment_variable.LEGACY_PRICING_URL",
  "environmentValue": "http://192.0.2.42:8080/price",
  "provenance": "Literal fields from the captured HTTP client span and its exception event. The screenshot shows the same span."
};
window.ATTRIBUTE_CAPTURES = {
  "traceId": "26abea5ca66f7e87389d931bfecdf3d0",
  "spanId": "db4cc8d8ad24054a",
  "captured": "2026-11-02",
  "provenance": "Actual Grafana dashboard screenshots. Native panels were expanded/collapsed and scrolled; no field text was reconstructed. View boxes enlarge the recorded pixels.",
  "timeout": {
    "image": "java-timeout-proof.png",
    "width": 1440,
    "height": 1100,
    "attributes": [
      103,
      355,
      642,
      192
    ],
    "event": [
      103,
      626,
      642,
      120
    ],
    "sha256": "1897d19ad6e1e0a69b30f1888e54a37ea85500345244a3dbd0fa51e5f6d461b6",
    "deviceScaleFactor": 2
  },
  "configuration": {
    "image": "checkout-resource-proof.png",
    "width": 1440,
    "height": 1400,
    "context": [
      764,
      355,
      634,
      187
    ],
    "setting": [
      768,
      694,
      626,
      30
    ],
    "sha256": "1083880de251558660150b61426005983a7e2791c056e75ac9e7f8b699f244cc",
    "deviceScaleFactor": 2
  }
};
