# Recorded demo and live handoff

The current presentation records the expanded demo from Nikola’s
`759cc0979909` topology. Eighteen application services plus PostgreSQL and Redis
are exercised by a successful request. Four Go services retain OBI; fourteen
services use supported Java, Python, Ruby, .NET and Node runtimes.

The presentation capture adds two reusable manifests:

- `demo/k8s/checkout-direct-agent.patch.yaml`: unchanged Checkout image, Java
  agent startup/export settings and explicit PricingEngine.calculate inclusion.
- `demo/k8s/fleet-instrumentation.yaml`: custom operator rules, skipping direct
  Checkout, four Go workloads and the database deployments; enrolls thirteen.

The Ruby demo now calls `Bundler.require(*Rails.groups)` after requiring Rails
components, following normal Rails initialization. The upstream Ruby bootstrap
hooks this call; initializing before ActionController is loaded leaves its
request instrumentation absent. This integration repair belongs in the demo
baseline and does not add instrumentation calls to the application.

## Captured observations

The October 27 two-second version opens with a 2.17 s customer request. OBI
shows a failed Checkout CONNECT spanning about two seconds, before successful
product lookup and service calls. The Java-agent exemplar connects that failed
HTTP attempt to PricingEngine.calculate and its successful PostgreSQL fallback.
The HTTP span reports java.net.SocketTimeoutException, and its exception event
says Connect timed out. The method span is explicitly configured using source
knowledge; the agent does not infer business meaning.

The operator installs and enrolls the remaining supported services. Use the
fresh fleet trace and Catalog’s JDBC spans for the result, retaining OBI for Go.
Readiness, instrumentation scopes, exports and correlation are preparation
checks; the audience does not need a lesson in trace identity verification.
No measured engineering-cost savings are claimed. The later customer-resolution
addition measures an actual application change, separately from the hypothetical
labor model; see [customer-resolution.md](customer-resolution.md).

## Capture and reproducibility

Recordings, posters and selected timings are served from `public/demo-capture/`.
Raw traces, terminal events, frame timestamps, logs, profiles and the private
kubeconfig stay under ignored `.artifacts/demo-capture/`. Terminal commands and
output are real. Readiness waits are cut with an explicit card; playback is 1×.

The isolated kind cluster is `far-wide-recording`. Always use its private
kubeconfig; do not change the user’s default context. Local forwards expose
Gateway 18080, Grafana 13000, Tempo 13200 and Prometheus 19090.

Source recordings are produced by `scripts/presentation/capture_terminal.py`
and `capture_browser.mjs`; edited wait cuts by `edit_terminal_captures.py`.
Keep all generated files and browser profiles inside this repository.

## Live preparation

Run the same sequence from a clean demo: deploy OBI, open the request, explain
the failed connection, apply the direct agent patch, inspect its timeout and fallback,
remove the obsolete backend attempt and revisit the real customer waterfall, then install
the custom operator and apply the fleet configuration. Prebuild/load
the payload and application images. The operator and Injector are a custom
prototype integration; upstream already provides Kubernetes zero-code injection.
Do not imply an upstream release commitment or a performance fix from adding
instrumentation. Keep recovery and compatibility checks in the rehearsal plan.


## Namespace-first Injector finish (October 23)

The preceding upstream Operator scene acknowledges language-specific opt-in at
workload **or namespace** level. Do not claim it always requires one annotation
per service. The custom component combines central namespace rules, runtime-aware
Injector activation, and controller-managed replacement of existing workloads.
The bundled Injector detects the supported runtime; its controller chooses the
Kubernetes scope and manages rollout. These are separate responsibilities.

Prepare shared defaults and exclusions once with
`demo/k8s/fleet-instrumentation-base.yaml`. Then the actual application choice is:

```yaml
selector:
  namespaces: [demo-apps]
action: Inject
```

The captured action appends precisely that rule using
`demo/k8s/instrument-demo-namespace.patch.yaml`. No positive workload list or
language-specific instrumentation annotations are added. Exclusions retain
Checkout's direct agent, four Go OBI baselines and the databases. Thirteen more
supported applications receive language agents, for fourteen total. Rollouts
still occur; shared automation performs them. `fleet-instrumentation.yaml` is
the equivalent complete manifest for one-file use.

The important change in ownership is that the platform chooses an application
boundary once. Individual teams do not each need an instrumentation manifest
change, review and release slot. Supported new workloads in that namespace
inherit selection on admission. Shared agent versions and export settings reduce
drift; a central scope also provides a place to change or remove enrollment.
Compatibility, platform maintenance and telemetry costs still need management.

The [earlier prototype review](technical-findings.md#identified-implementation) records Jack Berg’s implementation work and Nikola’s participation. The standalone project is now [RIO — Runtime Instrumentation Operator](https://github.com/otelx/rio), an independent otelx project using OpenTelemetry components. This recorded demo uses the bundled snapshot and its `demo.opentelemetry.io` API; RIO uses `rio.otelx.github.io`. Direct audience members to RIO’s quickstart for a fresh evaluation.


Capture runtime: the disposable `far-wide-recording-control-plane` container was
stopped after recording to free resources for narration/rendering. Its data and
private kubeconfig are retained. Restart with
`docker start far-wide-recording-control-plane`, then recreate the port forwards
using `.artifacts/demo-capture/kubeconfig`. Other local clusters are untouched.


## Customer resolution and fresh fleet evidence (October 27)

OBI shows a failed CONNECT near two seconds. The Java agent adds the pricing method,
HTTP connection timeout and successful PostgreSQL fallback. Remove the stale
legacy call, deploy `checkout-pricing-fixed.patch.yaml`, and **show the actual
post-fix waterfall first**. Follow with the aggregate request-duration summary.
Instrumentation settings and the successful price/order/commerce flow remain.

The matched 30-request warmed comparison is 2.21 s → 220 ms median Gateway
duration and 2.01 s → 3.71 ms median pricing duration. The opening 2.17 s request
is a separate OBI exemplar, not one side of that controlled comparison. The
seeded failure is a real missing-backend request, not Thread.sleep. Native
screen captures and raw public trace evidence preserve what was observed.

`presentation/data/resolution.json` contains measurements and the fresh fixed
fleet trace. After namespace enrollment, use the new fixed-fleet captures:
14 SDK services, four Go OBI baselines, Catalog JDBC detail and the retained
Checkout fix. Wait for both the controller’s current observed generation and
Ready phase before generating traffic; stale Ready status is insufficient.

This recorded component is the bundled namespace-driven prototype that led to
RIO. It uses the historical `demo.opentelemetry.io` API. Current standalone RIO
is an independent OTelX project using upstream Injector/agents, not the upstream
Operator or a distribution of it. The comparison slide explicitly shows
upstream language opt-in and acknowledges its namespace support.

Prebuild/load the fixed image with `make -C demo pricing-fixed-image
pricing-fixed-load CLUSTER=<demo-cluster>`. Existing disposable database volumes
need `demo/k8s/upgrade-product-price.sql` once. Reset to a newly built
`far-wide-demo-checkout:local` for another rehearsal. The old proof reports
retain their original fixture. Synthetic voices and narrated movies remain
untracked; all capture working files stay inside this repository.
