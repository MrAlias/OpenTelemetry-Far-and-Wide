# Resolve the customer’s waiting time

The live plan is 21 minutes, one minute flex and three for questions. The opening
welcomes everyone and introduces Tyler Yahn and Nikola Grcevski. Narration uses
natural speech; the complete dialogue also appears in each slide’s speaker notes.

## Follow the request to its configuration

1. Begin with an actual opaque request duration in Grafana.
2. Deploy OBI and follow the request across the application. A failed Checkout
   CONNECT takes about two seconds before the successful price lookup. Parent
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
8. Select the namespace with the RIO demo and Injector. Show the full observed
   fleet waterfall before opening Catalog’s database detail.

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
