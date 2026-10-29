# Resolve the customer’s waiting time

The talk begins “Welcome everyone” and introduces Tyler Yahn and Nikola
Grcevski by full name. Short natural speaker handoffs replace the authored
intro holds. The live plan remains 21 minutes plus one minute flex and three
minutes of questions. Synthetic narration stays at native speech pace.

## Follow evidence to a change

1. Start with an actual opaque single-request duration in Grafana.
2. Use OBI’s connected waterfall to locate the failed Checkout **CONNECT** span
   around two seconds, before the successful product lookup and service calls. A
   parent span includes child time; don’t choose the longest span. The current
   OBI capture sees the failed TCP attempt, so the old no-I/O gap explanation
   is no longer used.
3. Add the Java zero-code agent. The actual fresh trace shows
   `PricingEngine.calculate`, a failed HTTP client span, its
   `error.type = java.net.SocketTimeoutException`, an exception event with
   `exception.message = Connect timed out`, and a successful
   Hibernate/JDBC query for the product price.
   Show those literal fields before saying the connection timed out; the bar
   duration alone does not establish the cause. The deck reflows the captured
   values for legibility; the original Grafana attribute/event screenshots and
   raw span are retained under `public/demo-capture/`. These keys follow the
   [HTTP span](https://opentelemetry.io/docs/specs/semconv/http/http-spans/) and
   [exception event](https://opentelemetry.io/docs/specs/semconv/exceptions/exceptions-spans/) conventions.
4. Open the actual Java file in the recorded Vim editor: a stale legacy backend
   is attempted on every checkout.
   Connection/read timeouts are 2000 ms. The backend is absent at the demo’s
   TEST-NET-1 address, `192.0.2.42:8080`. No sleep simulates the delay. The
   application falls back to the current PostgreSQL product-price store.
5. The editor recording removes the whole obsolete HTTP attempt and retains
   `orders.currentPrice()`. Its saved working copy is checked byte-for-byte
   against `demo/apps/checkout/fixes/PricingEngine.java`. The demo fixtures
   themselves are preserved during this recording.
   This is a code fix, not a claim that installing instrumentation speeds up
   the application. Where cross-team access permits, offer the owning team a
   PR containing customer impact, trace evidence and the proposed fix.
6. Deploy the fixed image. **Immediately show the actual new request’s Grafana
   waterfall**, before any aggregate chart. The price query remains, the failed
   legacy call is absent, and the successful downstream checkout work follows.
7. Only then show matched repeated-request medians. The trace proves what
   changed; the summary shows how the observed timings behaved across samples.
8. Share diagnostic detail with thirteen more services through the bundled
   talk-specific namespace-controller demo, [RIO](https://github.com/otelx/rio).
   The fresh fleet trace uses the fixed application and shows Catalog JDBC work.

## Measured evidence and limits

Canonical timings, all 60 measured request rows and trace IDs are in
[presentation/data/resolution.json](../presentation/data/resolution.json).
The opening OBI request, Java-detail request, post-fix waterfall and full-fleet
request are separate authentic requests, identified in their public evidence
JSON. They are not edited versions of one trace. The aggregate comparison has
its own matched samples; don’t substitute selected screenshot values for it.

For each version: 20 successful warmups, then 30 sequential successful requests,
100 ms apart, concurrency one. Measure Gateway server-span duration. Both
batches have the same direct Checkout agent, method setting, exporter and
Pod template except the application image. The full-flow checker validates
price 42, Inventory success, a new order, all 18 application services, product
reads/order writes in PostgreSQL and Redis work. No failed measured request is
discarded. Build, recording and narration processes stop during measurement.

Matched raw exemplars are versioned as `timeout-before-trace.json` and
`timeout-after-trace.json` in `public/demo-capture/`. Raw capture sessions and
private deployment snapshots stay in `.artifacts/story-refinement/`; no
kubeconfig, voice profile or synthetic media is versioned.

This is a local seeded missing-dependency demonstration, not a production
benchmark. JVM, database and scheduling variation remain: the change in total
request medians need not equal the configured two-second timeout. Pricing after the
fix still performs real PostgreSQL work; do not describe it as zero work or
promise a sub-millisecond span. No outage, revenue or engineering savings are
inferred from these timings. The separate
[labor-capacity model](instrumentation-savings.md) credits no investigation-time
saving once both instrumentation approaches provide equivalent visibility.

## Reproduce

The standard demo image now builds the real timeout baseline from
`demo/apps/checkout/baseline/PricingEngine.java`. The original historical proof
fixture remains in `demo/proof/` for those earlier reports.

For an existing disposable database volume, first add the price column:

```sh
kubectl exec -i -n demo-apps deployment/postgres -- \
  psql -U checkout -d checkout < demo/k8s/upgrade-product-price.sql
```

Fresh deployments seed the column automatically. Verify that the reserved absent
endpoint really times out in your demo network; some networks reject missing
addresses immediately. `LEGACY_PRICING_URL` can point at another known unavailable
endpoint in the disposable environment. It must never point to a real third
party merely to manufacture latency. The recorded cluster produced genuine
`SocketTimeoutException` events at roughly two seconds.

Prebuild both images; reveal the code, deploy, send a new request, then open it:

```sh
make -C demo images load CLUSTER=<demo-cluster>
make -C demo pricing-fixed-image pricing-fixed-load CLUSTER=<demo-cluster>
kubectl patch deployment/checkout -n demo-apps --type=strategic \
  --patch-file demo/k8s/checkout-pricing-fixed.patch.yaml
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
```

Recording comparison (private kubeconfig, Gateway 18080, Tempo 13200):

```sh
python3 scripts/presentation/measure_resolution.py before
# Apply fixed image, await readiness, stop recording before measuring.
python3 scripts/presentation/measure_resolution.py after
```

Keep the Java agent identical across these batches. Then enroll the namespace,
wait for the controller’s **current generation** to be Ready, and capture a
fresh fixed-fleet trace. Reset to a newly built `far-wide-demo-checkout:local`
for the slow example. `npm run resolution:build` publishes canonical values;
`npm run resolution:verify` independently checks arithmetic, real timeout/error
spans, successful fallback, post-fix waterfall ordering and unchanged settings.

The latency cohort keeps all successful responses. A few OBI application
observations are independently rooted, so the comparison requires the actual
Gateway server and pricing-method spans, and records other coverage separately.
It does not discard a fast request because another service’s span is unlinked.
If an incoming trace identity is replaced, the collector accepts only a unique
exported Gateway span inside that request’s client window; ambiguous matches
are rejected. Original requested identities remain in the local measurement
record. These are collection details, not stage material.

## Capture boundary

The exported OBI trace groups the complete exercised application request, but
some .NET observations appear as additional roots; database-protocol spans can
also have unexported parents. The public raw evidence retains those details.
This is not a claim of a perfectly nested parent tree for every runtime and
protocol. The demonstrated Checkout connection, Java pricing method/fallback,
and Catalog SDK database spans are the observations used in the story. Keep
correlation diagnostics in preparation rather than turning delivery into a
trace-validation exercise.
