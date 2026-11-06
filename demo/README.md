# Presenting OpenTelemetry Far and Wide

The 25-minute session follows one customer order: find its two-second wait with
OBI, use direct Java instrumentation to explain it, remove the stale deployment
setting, and show the new waterfall. Then share language-agent setup across the
namespace. The slide deck has 23 slides; the primary delivery budget is 20:45,
with 1:15 for live-action variation and three minutes for recovery/questions.

**Run from the repository root.** Commands below target a dedicated
`kind-far-wide-*` cluster. The helper rejects other cluster contexts. Use the
same context in all terminals. All working files stay in `.artifacts/`.

## Prepare before starting the clock

Create the local cluster using [the cluster configuration](k8s/kind.yaml), if it
does not exist:

```bash
kind create cluster --name far-wide-demo --config demo/k8s/kind.yaml
kubectl config use-context kind-far-wide-demo
```

Build and load **all** images, including the direct Java agent payload and
controller. This can take several minutes. It is preparation, not live content:

```bash
python3 demo/scripts/present.py prepare --build
python3 demo/scripts/present.py reset
```

`prepare` pins the official OBI v1.0.0 image, loads the application, controller
and payload images into this kind cluster, and records their IDs in
`.artifacts/presentation-demo/prepared-images.json`. Subsequent preparations can
omit `--build` when the local images match the source. There is no stage-time
build, branch switch or image loading. The bundled controller/payload are the
reproducible prototype behind the RIO workflow, using the
`demo.opentelemetry.io` API. They are not a released RIO installation manifest or
the upstream OpenTelemetry Operator. [RIO project](https://github.com/otelx/rio).

If Nikola supplies a fixed OBI build, build or pull that image before preparation,
then set `DEMO_OBI_IMAGE` to its exact tag/digest in every demo terminal and run
`prepare` again. The helper loads that image, deploys it during `obi`, and records
the actual running image with each selected request. It does not silently call a
custom build the stock release.

**Outstanding preflight:** the November 4 official v1.0.0 captures observe all
18 applications, but some .NET server observations have no parent span before
language-agent enrollment. Header-only and network propagation both preserved a
parent in a small isolated .NET test; that does not resolve the full-topology
case. Nikola’s local fixes were not available to pin. Do not claim every .NET
edge is connected by this baseline. The Checkout investigation is captured, and
the final 14-agent/four-OBI result has one connected application trace. Recheck
all branches when the fixed build is supplied, before promising that stronger
baseline. Keep this preparation issue out of the audience’s narration.

`reset` removes agent enrollment and the controller, restores the original
application Pod templates and stale endpoint setting, and removes OBI. It keeps
the PostgreSQL volume and order data. Do this **before** the presentation; never
reset halfway through the story. Wait for all 20 Pods in `demo-apps` and the
observability stack to be ready:

```bash
kubectl rollout status deployment -n demo-apps --timeout=300s
kubectl rollout status deployment/lgtm -n observability --timeout=300s
```

Keep these in separate, already-open terminals:

```bash
kubectl port-forward -n demo-apps service/gateway 8080:8080
kubectl port-forward -n observability deployment/lgtm 3000:3000 3200:3200
```

Open Grafana at **http://localhost:3000**, the slides at
**http://localhost:3030**, and the presenter view at
**http://localhost:3030/presenter/1**. Use a dedicated desktop with only the
needed terminal, Grafana and presenter view. Set readable terminal/Grafana zoom
and close spare windows. A root request is known as Checkout; the trace, not
that search name, establishes which operation to investigate.

If using other forwarded ports, set `DEMO_GATEWAY`, `DEMO_TEMPO` and
`DEMO_GRAFANA` once before the run. `DEMO_CONTEXT` can pin the dedicated context.
The same settings apply to every helper step. Do not change contexts on stage.

Before the audience arrives, run the complete sequence once, including a switch
to a silent fallback. Then run `reset` again and leave port-forwards running.
Check the initial request succeeds and waits about two seconds:

```bash
make -C demo smoke
```

Stop image builds, narration/ASR generation and video export before this preflight.
Competing work can starve the local cluster and interrupt port-forwards; after
any stack restart, check readiness and recreate the forwards.

No agent images, command discovery or source changes should be needed during the
next timed run. The fault is `LEGACY_PRICING_URL`, not a sleep in application
code. The same app image will run before and after its removal.

## Live run sheet

The helper does the real `kubectl` work. `request` generates traffic, waits for
export/SDK handoff, selects a **fresh** request from that stage, checks its
expected instrumentation and updates one Grafana dashboard. It prints the
request duration, trace ID and view URL. Refresh the same dashboard after each
request; do not hunt among traces from earlier configurations.

| By elapsed time | Slide / action | Command or view | Result to explain |
|---|---|---|---|
| 01:15 | 1–3: customer and application | Introductions, slow request, 18-service map | A successful order still makes the customer wait. |
| 03:30 | 4–5: OBI | `python3 demo/scripts/present.py obi`, then `python3 demo/scripts/present.py request obi` | Open the printed dashboard; show the two-second failed CONNECT, then choose Checkout. |
| 05:30 | 6–7: direct Java setup | `python3 demo/scripts/present.py java`, then `python3 demo/scripts/present.py request java` | Same image, newly configured method span and HTTP/database detail. |
| 09:15 | 8–11: explain and fix | Open PricingEngine.calculate, the failed HTTP span, its exception event and resource attributes. Then run `python3 demo/scripts/present.py fix`, followed by `python3 demo/scripts/present.py request fixed`. | SocketTimeoutException / Connect timed out; matching legacy setting; fresh waterfall without the failed attempt, successful price lookup retained. |
| 09:45 | 12: repeated result | Return to the captured metric comparison | Captured mean 2.21 s → 165 ms. Not the exact measurement of the latest live request. |
| 11:45 | 13–14: scale and upstream Operator | Two grouped configuration examples | Namespace annotations exist already; image/runtime/container/startup facts still require owners. |
| 12:45 | 15: Injector | In-process workflow and upstream project QR | Matching agents from a prepared bundle; Kubernetes lifecycle remains a controller's job. |
| 14:15 | 16: RIO demo controller | `python3 demo/scripts/present.py controller` | Shared defaults prepared; no namespace enrolled yet. |
| 15:45 | 17–18: namespace selection | Show the rule, then `python3 demo/scripts/present.py namespace` | One rule; controller performs the rolling restarts for 13 more services. |
| 17:15 | 19: fleet result | `python3 demo/scripts/present.py request fleet` | Open Cart's Ruby scope/detail, then Currency's retained OBI observation. 14 language agents including Checkout; four Go services with OBI. |
| 20:45 | 20–23: upkeep, adoption, hours and close | Return directly to slides | Shared update ownership, eligible language-agent adoption, hypothetical 247 hours over two years, customer callback. Leave QR codes up. |

Tyler resumes on every return to slides. The normal return points are slide 6
after the OBI investigation, slide 12 after the fix and fresh trace, slide 17
after controller installation, and slide 20 after the fleet result. Use the
evidence slides as fallbacks; after showing the proof live, skip its replay and
resume at the next explanation.

These are rehearsal targets, not measured automation runtimes. Request selection
uses small warmup traffic and accepts a new request only after the expected
stage has exported. The first SDK export can precede OBI's SDK detection; that
transition request is not the steady-state example. Do not claim no overlap can
occur at any instant. Detailed checks are preparation, not a trace-identity
lecture for the audience.

## Keep the proof visible

- **Java stage:** the method span is explicitly configured with
  `OTEL_INSTRUMENTATION_METHODS_INCLUDE`. HTTP and database detail come from the
  agent. Installing instrumentation does not fix the application's timeout.
- **Setting:** the demo's launcher deliberately exports only
  `process.environment_variable.LEGACY_PRICING_URL`; the standard Java agent is
  not claimed to discover arbitrary environment variables. Retirement of the
  backend is known deployment context. The matching URL and timeout are data.
- **Fix:** remove the setting and roll the same image. Show the **new waterfall
  before the aggregate**. The failed attempt disappears; the product lookup and
  working order path remain. Offer the owning team a configuration PR and the
  evidence, without blame.
- **Fleet:** show one Ruby agent example and one Go/OBI example in the same fresh
  request. Do not repeat separate topology, full-waterfall and Catalog slides
  after the live result succeeds. Useful detail is the payoff, not Pod count.
- **Scope:** OBI excludes PostgreSQL/Redis server processes by Pod label. Their
  application-side client spans remain. Datastores stay in the topology. This
  avoids presenting unlinked server observations as part of a continuous SDK
  request; it does not invent universal database context propagation.
- **Adoption:** the curve is language-agent adoption among eligible workloads;
  OBI has already provided broad visibility. “100%” is scoped to eligible
  services, and new compatible workloads inherit the namespace rule.
- **Numbers:** slide 12 and the closing use the same captured mean. The separate
  matched-request medians remain evidence in `presentation/data/resolution.json`,
  not an interchangeable statistic. The labor chart models setup and routine
  monthly updates, not a full platform budget or measured telemetry-bill saving.

## Failure and time recovery

Preload the fallback views before the session. Commands and trace captures play
at native speed; long readiness waits are explicitly cut. The clips have **no
audio streams**, so either presenter can continue live narration.

| Live step | Slidev fallback | What to point at |
|---|---|---|
| OBI installation | `/4?clicks=1` | Versioned deployment command and ready DaemonSet |
| OBI trace | `/5` then click | Failed two-second connection |
| Direct Java rollout | `/7` | Patch and ready Checkout |
| Timeout / setting | `/8`, `/9` | Actual Grafana attributes and exception event |
| Remove stale setting | `/10` | Configuration-only rollout |
| Fixed request | `/11` | Failed attempt gone; successful work retained |
| Controller installation | `/16` | Actual bundled demo-controller installation |
| Namespace enrollment | `/18` | One namespace selection and managed restarts |
| Mixed fleet result | `/19?clicks=1` | Ruby agent detail and Go/OBI in one request |

If an error needs diagnosis, switch to the matching clip within about 15–20
seconds instead of debugging publicly. Normal rollouts get their rehearsed
allowance. Agree who switches the display before the session and practice the
transition. Keep the clip and spoken line at the same stage of the story.

If late, cut extra Operator cases, repeated success commentary and secondary
fleet inspection. **Protect the post-fix waterfall and fleet payoff.** Do not
speak faster. Close by 22:00 and leave the resource QR codes visible during the
remaining recovery/questions time. The slot ends at 25:00.

## Upgrades and instrumentation scope

The shared payload is `spec.image` in the demo Instrumentation resource. A new
qualified bundle reuses the same selected workloads and managed rollout:

```bash
kubectl patch demoinstr cluster --type=merge \
  -p '{"spec":{"image":"your-registry/qualified-instrumentation:next"}}'
```

That is the interface, **not** a runnable image we publish here. Build/test the
replacement bundle for the supported runtime matrix, wait for its observed
policy generation, and verify fresh observations before accepting the upgrade.
Agent and application compatibility, staged rollout and rollback still need
owners. The project is not promising that every future runtime or language
rewrite will be compatible.

Rules can skip selected workloads and the prepared configuration chooses signals.
That controls instrumentation scope; this talk does not measure an ingestion or
storage-bill reduction. Engineering effort savings and telemetry resource costs
are different claims. The submitted abstract mentions upgrades and dynamic cost
control; the primary live sequence demonstrates initial enrollment and shared
ownership. Do not announce a live upgrade or telemetry-bill result that is not
shown. Detailed release and scope experiments belong after the core rehearsal.

## Independent setup and technical reference

Requirements: Docker, kind, kubectl, Make, Python 3, OpenSSL and curl; a Linux
Docker host with BTF and an [OBI-compatible kernel](https://opentelemetry.io/docs/zero-code/obi/#compatibility).
The supplied kind configuration uses Kubernetes 1.35 and image volumes. Allow
roughly 8 CPUs and 16 GiB for the applications and builds. On Docker Desktop,
the VM's Linux kernel is the relevant kernel.

### Application and observability layout

The [service catalog](apps/README.md) lists the eighteen applications and their
languages. Gateway calls Checkout and Inventory; Checkout reaches the cart,
shipping, payments and notifications branches. PostgreSQL serves checkout,
catalog, stock-planner, loyalty and receipts. Redis serves cart, recommendations
and promotions. These shared stores are dependencies, not agent-eligible
application services.

`demo/k8s/applications.yaml` supplies the seeded product price, persistent order
storage and disposable Redis cache. Payments and notifications are simulations;
no payment provider or email service is contacted. Checkout's missing optional
backend times out after two seconds, then its fallback queries the current
product price. This is real network I/O, not an artificial sleep.

`demo/observability/lgtm.yaml` runs the Collector, Tempo, Prometheus, Loki and
Grafana. Its bundled OBI is disabled because the demo installs OBI separately.
The in-cluster OTLP HTTP endpoint is
`http://lgtm.observability.svc.cluster.local:4318`. Anonymous Grafana access is
enabled for this local demonstration. Use a deployment port-forward for Tempo:
the Service does not expose port 3200.

### Commands behind the presentation helper

The helper prints real mutating `kubectl` commands and fails on unsuccessful
operations. It also checks the expected current policy generation and selects
new request evidence. The following are the underlying deployment operations,
in story order. Image builds and loading belong in `prepare`, before this list.

**OBI:**

```bash
kubectl apply -f demo/k8s/obi.yaml
kubectl rollout status daemonset/obi -n obi-system --timeout=90s
```

The manifest pins `otel/ebpf-instrument:v1.0.0`. Discovery includes `demo-apps`
and excludes Pod labels `app=postgres` and `app=redis`. Application-side SQL and
Redis observations remain. No application restarts or namespace annotations are
required for this layer. Header context propagation is configured; do not claim
arbitrary non-HTTP database traffic carries SDK context into datastore-server
spans. [OBI discovery and exclusions](https://opentelemetry.io/docs/zero-code/obi/configure/service-discovery/).

**Direct Java agent, before the controller is installed:**

```bash
for request in $(seq 1 30); do
  curl -fsS http://localhost:8080/checkout
  sleep 1
done
```

In Grafana, open **Explore**, select **Tempo**, choose **TraceQL**, set the time
range to **Last 15 minutes**, and run:

```traceql
{ resource.service.name = "checkout" }
```

Open a recent trace. Look for HTTP spans involving `gateway`, `checkout`, and
`inventory`, followed by the cart, shipping, payments, and notifications branches.
Search by another service name, such as `recommendations` or `loyalty`, to explore
that part of the flow. The checkout request takes roughly two seconds or more, but there is no
`PricingEngine.calculate` span yet. The pricing method and Hibernate operations
are not named in this baseline. Keep a trace open for comparison.

OBI also captures PostgreSQL calls. Search for those separately:

```traceql
{ resource.service.name = "checkout" && span.db.system.name = "postgresql" }
```

Query text may be absent for statements prepared before OBI started; see
[OBI's database support](https://opentelemetry.io/docs/zero-code/obi/configure/export-data/#instrumentation-compatibility).

Switch Explore to **Prometheus**, choose the **Code** query editor, and run:

```promql
sum by (service_name) (
  http_server_request_duration_seconds_count{service_namespace="demo-apps"}
)
```

You should see HTTP request counts across the 18 application services. Allow a
few seconds for export and refresh if the first query is empty. The new services'
`/healthz` probes also contribute traffic; use `/work` spans to inspect commerce
requests.

For example, this Tempo query finds cart requests from the checkout flow:

```traceql
{ resource.service.name = "cart" && name = "GET /work" }
```

For the Redis side of the flow, search in Tempo for `cart`, `recommendations`, or
`promotions` and inspect their database spans. For additional PostgreSQL traffic,
search for `catalog`, `stock-planner`, `loyalty`, or `receipts`. OBI's available
query text and trace correlation depend on protocol and runtime support.

This baseline produces **traces and metrics**. Loki is available, but these apps
do not yet produce OTLP logs, and the stack does not collect container stdout.

### Debug with a local OBI branch

To investigate SDK/OBI coexistence using `~/work/obi`, build a local image and
load it into the existing kind cluster. This needs Go (with the toolchain
requested by OBI), LLVM 21, rsync, and Docker. The script snapshots the current
checkout, including local edits, and runs OBI's eBPF generation and Go compilation.
Build files and caches stay in ignored `.artifacts/obi-redis/`.

```bash
OBI_SOURCE="$HOME/work/obi" bash demo/scripts/build-local-obi.sh
kind load docker-image --name far-wide-demo far-wide-demo-obi:local
kubectl --context kind-far-wide-demo patch daemonset/obi -n obi-system \
  --type=strategic --patch-file demo/k8s/obi-local.patch.yaml
kubectl --context kind-far-wide-demo rollout status daemonset/obi -n obi-system --timeout=180s
kubectl --context kind-far-wide-demo logs -n obi-system daemonset/obi -f
```

## 5. Build SDK images to be used manually and with the Injector
Build the operator and the payload containing the Injector and language agents:

```bash
make -C components/otel-injector-operator image
make -C components/otel-injector-images image
```

Load both images into kind, then install the operator:

```bash
kind load docker-image --name far-wide-demo \
  otel-injector-operator:demo otel-injector-images:demo
```

## 6. Deploy the JVM agent patches to the checkout service

First add additional JVM instrumentation through the OpenTelemetry Java agent

```bash
kubectl patch deployment/checkout -n demo-apps --type=strategic --patch-file demo/k8s/checkout-direct-agent.patch.yaml
```

Next, fix the environment variables to remove the legacy service:

```bash
kubectl patch deployment/checkout -n demo-apps --type=strategic --patch-file demo/k8s/checkout-pricing-fixed.patch.yaml
```

The init container copies the Java JAR from the prepared payload image. The
patch supplies `JAVA_TOOL_OPTIONS`, service identity and exporter settings. It
also configures `demo.checkout.PricingEngine[calculate]` explicitly with
`OTEL_INSTRUMENTATION_METHODS_INCLUDE`. The agent's regular HTTP/JDBC/Hibernate
instrumentation supplies the related client and persistence observations.
Agent metrics/logs are disabled here; OBI supplies the broad HTTP metrics.
This is direct startup configuration, not the later namespace controller.

## 7. Build and deploy the operator and Injector

[RIO](https://github.com/otelx/rio) is the demo operator purpose-built for this talk; we want this capability to find an upstream home. The following steps reproduce the presentation’s bundled demo snapshot and use its `demo.opentelemetry.io` API; RIO has its own API and release artifacts.

Build the operator and the payload containing the Injector and language agents:

```bash
kubectl patch deployment/checkout -n demo-apps --type=strategic \
  --patch-file demo/k8s/checkout-pricing-fixed.patch.yaml
kubectl rollout status deployment/checkout -n demo-apps --timeout=90s
```

Only `LEGACY_PRICING_URL` is removed. Preserve its removal in a real deployment's
GitOps/configuration source too. The helper checks that no other Pod-template
field changed. The application image, agent and exporter remain identical.

**Bundled RIO prototype and prepared defaults:**

```bash
make -C components/otel-injector-operator install
```

The installer creates the CRD, permissions, TLS certificates, and admission
webhook, and waits for the operator. The Injector payload will be mounted into
selected application Pods; it has no separate Deployment.

At this point, the apps still use OBI alone. We apply the instrumentation policy
in the next step so the Java restart is a distinct part of the demo.

## 8. Instrument all services with the RIO operator

### Create the shared configuration and exclusions, like the OTEL exporter URL
```sh
kubectl apply -f demo/k8s/fleet-instrumentation-base.yaml
```

The installer prepares the CRD, permissions, TLS and webhook. Set `DEMO_CONTEXT`
if pinning a context; the installer honors it. The Injector is a shared library
mounted into selected Pods; it is not a separate Kubernetes Deployment. The
controller uses native image volumes when its capability probe succeeds,
otherwise an init container copies the payload.

The base configuration retains Checkout's direct setup and leaves the four Go
services and two datastore processes outside language-agent enrollment. It
prepares the shared endpoint, signals and exclusions without selecting the
remaining application workloads yet.

**Namespace selection:**

```bash
kubectl patch demoinstr cluster --type=json \
  --patch-file demo/k8s/instrument-demo-namespace.patch.yaml
```

### Wait for managed workload rollouts.
kubectl wait --for=jsonpath='{.status.workloads[0].phase}'=Ready \
  demoinstr/cluster --timeout=300s

