window.TIMEOUT_EVIDENCE = {
  "source": "public/demo-capture/java-trace-evidence.json",
  "traceId": "03f92a74331b453ab16e5e86ce2cdd5b",
  "spanId": "4b22aa0f2da30e4d",
  "name": "GET",
  "durationMs": 2002.591729,
  "errorType": "java.net.SocketTimeoutException",
  "url": "http://192.0.2.42:8080/price",
  "exceptionType": "java.net.SocketTimeoutException",
  "exceptionMessage": "Connect timed out",
  "environmentKey": "process.environment_variable.LEGACY_PRICING_URL",
  "environmentValue": "http://192.0.2.42:8080/price",
  "provenance": "Literal fields from the captured HTTP client span and its exception event. The screenshot shows the same span."
};
window.ATTRIBUTE_CAPTURES = {
  "traceId": "03f92a74331b453ab16e5e86ce2cdd5b",
  "spanId": "4b22aa0f2da30e4d",
  "captured": "2026-11-04",
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
      116
    ],
    "sha256": "05a01f41e61eddc206172f9d9a579f47a7863713adc5cf2a11989a12416c03c3",
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
      690,
      626,
      38
    ],
    "sha256": "80b065dd263406222eb94a8606472408f8696a1a1c2bb119fdc5cc11dee45b58",
    "deviceScaleFactor": 2
  }
};
