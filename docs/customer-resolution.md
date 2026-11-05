# Resolve the customer’s waiting time

The live plan is 20 minutes 45 seconds, 75 seconds of live flexibility and three
minutes for recovery/questions. The opening
welcomes everyone and introduces Tyler Yahn and Nikola Grcevski. Narration uses
natural speech; the complete dialogue also appears in each slide’s speaker notes.

## Follow the request to its configuration

1. Begin with an actual opaque request duration in Grafana.
2. Deploy OBI and follow the request across the application. A failed Checkout
   CONNECT takes about two seconds before the order continues. Parent
   spans include children; investigate the failed attempt, not the longest parent.
3. Add Java zero-code instrumentation. `PricingEngine.calculate` contains the
   failed HTTP client span and then a successful PostgreSQL price lookup. Show
   `error.type = java.net.SocketTimeoutException` and the exception event’s
   `exception.message = Connect timed out` before calling it a timeout.
4. Open Checkout’s resource attributes. The captured
   `process.environment_variable.LEGACY_PRICING_URL` equals the failed span’s
   `url.full`: `http://192.0.2.42:8080/price`. This optional setting still points
   at a retired backend. The application falls back to the current product store.
5. Remove the setting and roll **the same application image**. No source edit,
   image build or instrumentation change is part of the live fix. Where access
   permits, bring the owning team a configuration PR with customer impact,
   the trace and the setting to remove.
6. Immediately show the actual new request’s waterfall. The failed call is gone;
   the current price lookup, order write and downstream work remain.
7. Show the repeated-request summary after that trace. It summarizes the local
   observation; installing instrumentation did not itself remove the wait.
8. Select the namespace with the RIO demo and Injector. Show a fresh fleet request with Cart’s Ruby detail and Currency’s retained
   Go/OBI observation, then return directly to the upkeep/adoption slides.

## Explicit capture of one setting

`demo/apps/checkout/launch.sh` adds this one non-secret setting to
`OTEL_RESOURCE_ATTRIBUTES` when it is present. It preserves existing attributes
and then starts the JVM. The Java agent exports the resulting resource; it is
not discovering every environment variable automatically. When the setting is
absent, the launcher adds no such attribute. The application then goes directly
to `orders.currentPrice()`.

The attribute name follows the OpenTelemetry
[process environment-variable convention](https://opentelemetry.io/docs/specs/semconv/registry/attributes/process/).
The Java agent consumes [resource attributes configured through the environment](https://opentelemetry.io/docs/languages/java/configuration/).
Full captures remain local. Published trace snapshots retain actual span IDs,
parent links, timings, service identities, timeout evidence and this setting;
unneeded host/process metadata and exception stack traces are omitted.

## Reproduce the fix

Build and load the normal demo image once. `applications.yaml` supplies the
stale setting to seed the initial problem. The reserved TEST-NET-1 address has
no backend; check that your demo network times out rather than rejects it.

```sh
kubectl set env deployment/checkout -n demo-apps LEGACY_PRICING_URL-
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
```

The equivalent strategic patch is `demo/k8s/checkout-pricing-fixed.patch.yaml`.
Persist the deletion in your deployment manifest or GitOps source as well.
To reset this disposable demonstration:

```sh
kubectl set env deployment/checkout -n demo-apps \
  LEGACY_PRICING_URL=http://192.0.2.42:8080/price
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
```

Existing disposable database volumes may first need
`demo/k8s/upgrade-product-price.sql`; fresh deployments seed the price column.

## Measured comparison

`presentation/data/resolution.json` contains 60 successful measured requests,
actual trace IDs and medians. Each configuration has 20 successful warmups and
30 sequential requests, with 100 ms between requests. Measurements run without
concurrent builds, recording or narration generation. The image digest and Pod
template are identical except for `LEGACY_PRICING_URL`.

Use `scripts/presentation/measure_resolution.py` before and after the rollout,
then `publish_resolution.py` to validate the comparison and publish reduced
snapshots. `npm run resolution:verify` independently checks the measurements,
actual timeout, resource-setting removal, unchanged image and retained price query.

JVM, database and scheduling variation remain. This is a local seeded
missing-dependency demo, not a production benchmark. No labor, revenue or outage
saving is inferred from these timings; the separate labor-capacity model makes
its own assumptions and gives no per-investigation credit.

## Grafana metric captures on slide 12

The before/after panels are actual Grafana screenshots of OBI's Prometheus
`http_server_request_duration_seconds` histogram counters for Gateway's
`GET /checkout` requests. Both use a 120-second window from the retained
November 2 runs. The query divides the increase in duration sum by the
increase in request count: **2.214 seconds before, 164.991 milliseconds after**.
The screenshots display **2.21 s** and **165 ms**.

These are metric means over their time windows, including warmup traffic.
They are distinct from the 30-request trace medians of 2.2247 seconds and
184.943 milliseconds retained as independent evidence. The closing callback now
uses the same 2.21 s / 165 ms metric means as slide 12. Neither the sample
ledger nor its measurement controls changed.

`presentation/data/metric-comparison.json` records the exact queries, windows,
Prometheus responses, native capture text and image checksums. The reproducible
Grafana dashboard is `presentation/dashboards/checkout-metrics.json`. Import it
into the demo's Grafana instance while the historical Prometheus data exists.
