# Full demo guide: OBI first, Java detail next

Start with 18 uninstrumented services, PostgreSQL, and Redis. See their HTTP and
database traffic through OBI, then use the Injector operator to reveal what
happens inside Java checkout.

```text
curl > gateway (Go) > checkout (Java) > inventory (Node.js)
                         │
                         ├─ PricingEngine.calculate(): about two seconds
                         ├─ Hibernate > PostgreSQL: save the checkout order
                         ├─ cart (Rails) > catalog (Java) > recommendations (Python) > promotions (Rails)
                         │       └─ tax (.NET) > currency (Go)
                         ├─ shipping (Go) > warehouse (Go) > stock-planner (Python)
                         ├─ payments (Java) > fraud (Java) > customer-profile (.NET) > loyalty (Rails)
                         └─ notifications (.NET) > receipts (Python)

PostgreSQL: checkout, catalog, stock-planner, loyalty, receipts
Redis: cart, recommendations, promotions

OBI + injected Java agent > Collector > Tempo / Prometheus / Loki > Grafana
```

Run commands from the repository root. You need Docker, kind, kubectl, Make,
Python 3, OpenSSL, and curl. Use a Linux Docker host with a kernel supported by
[OBI](https://opentelemetry.io/docs/zero-code/obi/#compatibility), including BTF at
`/sys/kernel/btf/vmlinux`. On Docker Desktop, it is the Docker VM's kernel that
matters. Allow roughly 8 CPUs and 16 GiB of memory for the expanded demo and builds.

The commands use your **default kubeconfig**. Keep two extra terminals available
for port-forwarding the application and Grafana.

## 1. Create the test cluster

```bash
kind create cluster --name far-wide-demo --config demo/k8s/kind.yaml
kubectl config use-context kind-far-wide-demo
kubectl get nodes
```

The [cluster configuration](k8s/kind.yaml) uses Kubernetes 1.35 with image volumes
enabled. Wait for the node to show `Ready` before continuing.

## 2. Deploy the demo applications

Build and load the images. The 15 commerce services share five small images,
with three services per language; gateway, checkout, and inventory keep their
own images. You only need Docker, not the language toolchains:

```bash
make -C demo images
make -C demo load
```

Deploy all 18 applications, PostgreSQL, and Redis from one manifest, then wait
for every Deployment to be ready:

```bash
kubectl apply -f demo/k8s/applications.yaml
kubectl rollout status deployment -n demo-apps --timeout=300s
```

There should be **20 application-namespace Pods**: 18 services, PostgreSQL, and
Redis. Each request to gateway calls all 15 commerce services through the tree
above. See the [service catalog](apps/README.md) for each service's role.

In a **second terminal**, expose the gateway and leave this running:

```bash
kubectl port-forward -n demo-apps service/gateway 8080:8080
```

Back in the main terminal, make a request:

```bash
curl -fsS http://localhost:8080/checkout | python3 -m json.tool
```

The response contains `price: 42`, `inventory: {"available": true}`, and an
increasing `orderId`. The `services` array contains the four branches and their
nested responses, including product data, loyalty points, and Redis cart visits.

Check the entire flow with two more checkouts:

```bash
make -C demo smoke
```

The check verifies all 15 services, their call relationships, PostgreSQL results,
and an increasing Redis counter. Payments and notifications are simulated;
no real payment provider or email service is contacted.

These applications have no OpenTelemetry SDK dependencies. The Java service's
pricing method deliberately takes about two seconds. Each request also loads
the seeded product and saves an order through Hibernate, using a HikariCP
connection pool and the PostgreSQL JDBC driver.

You can check the saved orders directly:

```bash
kubectl exec -n demo-apps deployment/postgres -- \
  psql -U checkout -d checkout -c 'SELECT id, product_id, total FROM checkout_orders ORDER BY id DESC LIMIT 5;'
```

The PostgreSQL resources in the [applications manifest](k8s/applications.yaml)
create the schema, a sample product, local-demo credentials, and a 1 GiB
persistent volume. Orders survive application and PostgreSQL Pod replacement.
Checkout validates the existing schema at startup; it does not recreate it during
instrumentation rollouts. Catalog, stock-planner, loyalty, and receipts read
these same tables.

Inspect the Redis cache after a checkout:

```bash
kubectl exec -n demo-apps deployment/redis -- \
  redis-cli MGET cart:demo-shopper:visits recommendations:demo-shopper promotions:active
```

Redis is a disposable cache: replacing its Pod resets these keys, and the next
checkout recreates them. PostgreSQL remains the persistent order store.

## 3. Deploy the observability stack

```bash
kubectl apply -f demo/observability/lgtm.yaml
kubectl rollout status deployment/lgtm -n observability --timeout=300s
```

This runs `grafana/otel-lgtm`: an OpenTelemetry Collector, Tempo for traces,
Prometheus for metrics, Loki for logs, and Grafana. Its bundled OBI is disabled
because we deploy OBI separately in the next step.

In a **third terminal**, expose Grafana and leave this running:

```bash
kubectl port-forward -n observability service/lgtm 3000:3000
```

Open **http://localhost:3000**. Anonymous access is enabled; if you sign in,
the initial credentials are `admin` / `admin`.

The Collector receives OTLP inside the cluster at
`http://lgtm.observability.svc.cluster.local:4318`. Both instrumentation layers
are already configured to use it.

## 4. Deploy OBI and inspect the baseline

```bash
kubectl apply -f demo/k8s/obi.yaml
kubectl rollout status daemonset/obi -n obi-system --timeout=180s
kubectl logs -n obi-system daemonset/obi --tail=30
```

OBI runs as a privileged DaemonSet and discovers processes in `demo-apps`.
No application restart or namespace annotation is required. Give discovery
about 15 seconds, then generate traffic in your main terminal:

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

## 5. Build and deploy the operator and Injector

For a standalone evaluation, use [RIO](https://github.com/otelx/rio) and its [quickstart](https://github.com/otelx/rio/blob/main/docs/quickstart.md). The following steps reproduce the presentation’s bundled demo snapshot and use its `demo.opentelemetry.io` API; RIO has its own API and release artifacts.

Build the operator and the payload containing the Injector and language agents:

```bash
make -C components/otel-injector-operator image
make -C components/otel-injector-images image
```

Load both images into kind, then install the operator:

```bash
kind load docker-image --name far-wide-demo \
  otel-injector-operator:demo otel-injector-images:demo
make -C components/otel-injector-operator install
```

The installer creates the CRD, permissions, TLS certificates, and admission
webhook, and waits for the operator. The Injector payload will be mounted into
selected application Pods; it has no separate Deployment.

At this point, the apps still use OBI alone. We apply the instrumentation policy
in the next step so the Java restart is a distinct part of the demo.

## 6. Restart Java with instrumentation and compare

The [checkout policy](k8s/checkout-instrumentation.yaml) selects the namespace
and workload in one cluster-wide `Instrumentation` resource:

```yaml
selector:
  namespaces: [demo-apps]
  workloads:
    - kind: Deployment
      name: checkout
```

It enables Java traces and asks the Java agent to create a span for
`demo.checkout.PricingEngine[calculate]`. Metrics and logs are disabled for the
Java agent in this walkthrough; OBI supplies the HTTP metrics.

Hibernate and JDBC use the Java agent's default instrumentation. The policy
retains the existing pricing-method selection and needs no additional options
for the database extension.

Apply the policy to start the restart:

```bash
kubectl apply -f demo/k8s/checkout-instrumentation.yaml
kubectl wait --for=jsonpath='{.status.workloads[0].phase}'=Ready \
  demoinstr/cluster --timeout=300s
kubectl get pods -n demo-apps
```

**Applying the policy triggers the graceful rollout automatically.** The operator
replaces the Java Pod, injects its replacement, and waits for workload health.
The Deployment keeps the old Pod until the new one is ready. Gateway, inventory,
and all 15 commerce services stay running. A separate `kubectl rollout restart`
would cause an unnecessary second restart.

The operator uses native image volumes when its capability check succeeds and
otherwise copies the payload with an init container. Inspect the policy status
and Java startup log:

```bash
kubectl get demoinstr cluster -o yaml
kubectl logs -n demo-apps -l app=checkout --prefix --tail=30
```

Look for checkout's `phase: Ready` and the OpenTelemetry Java agent startup
message. `Ready` confirms workload health; the following query checks that
telemetry actually arrived.

Generate another batch of requests:

```bash
for request in $(seq 1 30); do
  curl -fsS http://localhost:8080/checkout
  sleep 1
done
```

Return to **Explore > Tempo** and run:

```traceql
{ resource.service.name = "checkout" && name = "PricingEngine.calculate" }
```

Open a recent result and expand checkout's spans. **`PricingEngine.calculate`
takes about two seconds**, explaining the delay you saw with OBI. The application
image and source have not changed; the policy added the language-level detail.

In the same trace, expand the Hibernate operations and their JDBC query spans.
Look for `Session.get demo.checkout.Product`,
`Session.persist demo.checkout.CheckoutOrder`, and `Transaction.commit`.
The `SELECT` and `INSERT` JDBC spans are nested beneath the Hibernate operations
that issued them. These spans appear automatically, alongside the existing
pricing-method span.

You can also search specifically for the Hibernate transaction span:

```traceql
{ resource.service.name = "checkout" && name = "Transaction.commit" }
```

The comparison has two parts: the configured pricing-method span explains the
two-second timeout, and the default Hibernate/JDBC spans expose the order-persistence
operations. Connection-acquisition tracing is not enabled in this demo.

OBI continues covering the other services. Its automatic SDK detection suppresses
overlapping telemetry after it observes SDK exports; initial requests can contain
overlap during that transition. Use a later trace from this batch for the demo.
See [OBI's SDK detection behavior](https://opentelemetry.io/docs/zero-code/obi/configure/service-discovery/#exclude-otel-instrumented-services).

## Choose a different namespace or more workloads

Edit `demo/k8s/checkout-instrumentation.yaml` and reapply it. Namespace names go
directly in `selector.namespaces`; no per-namespace labels are needed.

- For Java checkout in another namespace, change `demo-apps` to that namespace
  and update `service.namespace` in the rule's `OTEL_RESOURCE_ATTRIBUTES` value.
- For all supported applications in `demo-apps`, first add the database `Skip`
  rule shown below, then remove the `workloads` selector and checkout-specific
  `env` block from the application rule.
- For checkout Deployments in several namespaces, use
  `namespaces: [demo-apps, payments]`. They share the rule's `service.namespace`
  value in Grafana; use separate rules if you want distinct telemetry groups.

For all application namespaces, replace the rules with exclusions followed by a
wildcard rule:

```yaml
rules:
  - name: skip-databases
    selector:
      namespaces: [demo-apps]
      workloads:
        - kind: Deployment
          name: postgres
        - kind: Deployment
          name: redis
    action: Skip
  - name: skip-infrastructure
    selector:
      namespaces: [kube-system, kube-public, kube-node-lease, local-path-storage, observability, obi-system]
    action: Skip
  - name: all-applications
    selector:
      namespaces: ['*']
    action: Inject
```

Rules use the first match. The operator always excludes its own namespace.
Keep PostgreSQL and Redis excluded when broadening selection: they are database
backends and their Deployments use `Recreate`. Go services remain covered by OBI;
the Injector payload supplies agents for Java, .NET, Python, Ruby, and Node.js.
Keep the Java-specific `env` settings on a checkout-specific rule if you retain
them; do not give every service the name `checkout`.

The policy's `signals` fields independently enable `traces`, `metrics`, and
`logs`; actual coverage depends on the language agent and application libraries.
Changing the policy automatically rolls affected workloads. OBI has its own
namespace selection in `demo/k8s/obi.yaml`; changing the Injector policy does not
reconfigure OBI.

## Reset or remove the demo

To return to the OBI-only baseline while keeping the cluster and Grafana data:

```bash
kubectl delete demoinstr cluster --timeout=300s
```

Keep the operator running until deletion finishes: its finalizer rolls checkout
back to an uninstrumented Pod. Reapply the policy to repeat step 6.

To remove the whole demo, stop both port-forward commands with **Ctrl+C**, then:

```bash
kind delete cluster --name far-wide-demo
```

This also deletes the telemetry, PostgreSQL orders, and Redis cache in the cluster.

## If a step does not work

| Symptom | Check |
| --- | --- |
| Application `ImagePullBackOff` | Run `make -C demo load` for this cluster. |
| Checkout fails to start or returns 502 | Check `kubectl logs -n demo-apps deployment/checkout` and `kubectl rollout status deployment/postgres -n demo-apps`. PostgreSQL must be ready with its seeded schema. |
| Checkout returns 502 after adding commerce services | Run `kubectl get pods -n demo-apps`, then inspect checkout's log and the named dependency's log. All 15 services and both databases must be ready. |
| A commerce service is pending | Check node memory with `kubectl describe node`; allow roughly 16 GiB for the demo and builds. |
| LGTM is pending | `kubectl describe pod -n observability -l app=demo-lgtm` and `kubectl get pvc -n observability`. It needs the default storage class and enough memory. |
| OBI is running but Tempo is empty | Generate traffic, refresh the time range, and inspect `kubectl logs -n obi-system daemonset/obi`. Check the host kernel's BTF/eBPF support. A running Pod alone does not prove probes attached. |
| Policy never reaches `Ready` | Inspect `kubectl get demoinstr cluster -o yaml` and `kubectl logs -n otel-injector-system deployment/otel-injector`. A failed candidate is rolled back; status records the reason. |
| Java is ready but the method span is missing | Send new traffic and inspect checkout's log for agent/export errors. Check that `OTEL_INSTRUMENTATION_METHODS_INCLUDE` matches the policy. |
| Hibernate spans are missing | Confirm you built checkout with `demo/apps/checkout/Dockerfile`, generate new requests, and inspect a recent trace after the Java rollout. The original proof image has no database access. |

For more detail, see the [operator reference](../components/otel-injector-operator/README.md)
and [observability stack guide](observability/README.md). The older
[proof harness](proof/README.md) remains a separate experiment. This walkthrough
shares its gateway, inventory, and pricing-method sources, and adds the
[Hibernate checkout application](apps/checkout/) and the [polyglot commerce
services](apps/README.md), with ordinary readiness probes and direct Services.


## Presentation recording sequence

The expanded presentation uses OBI first, then a direct Java-agent setup for
Checkout, then operator enrollment for the remaining supported services. See
[the recorded demo handoff](../docs/fleet-demo-handoff.md) for captured timings,
prerequisites, source files and the live rehearsal sequence. The direct patch
is `k8s/checkout-direct-agent.patch.yaml`; shared enrollment uses
`k8s/fleet-instrumentation.yaml`. This is an alternative to the single-Checkout
operator walkthrough above; begin from a clean, isolated demo installation.


## Resolve the retired-backend timeout

The standard demo now attempts an absent legacy pricing backend with a real
two-second HTTP connection timeout, then reads the product price from PostgreSQL.
The fixed image removes that obsolete attempt and retains the same store lookup.
The original historical proof fixture is unchanged.

Existing disposable database volumes need the new price column once:

```sh
kubectl exec -i -n demo-apps deployment/postgres -- \
  psql -U checkout -d checkout < demo/k8s/upgrade-product-price.sql
```

Fresh databases seed it automatically. From the repository root, prepare the
fixed image before presenting:

```sh
make -C demo pricing-fixed-image pricing-fixed-load CLUSTER=<demo-cluster>
kubectl patch deployment/checkout -n demo-apps --type=strategic \
  --patch-file demo/k8s/checkout-pricing-fixed.patch.yaml
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
```

Show the actual fresh waterfall immediately after deployment: the successful
price query remains and the failed legacy call is absent. Then show the separate
matched warmed comparison: 2.21 s → 220 ms median request duration and
2.01 s → 3.71 ms median pricing duration, with identical instrumentation. This is a
local seeded-failure result, not an instrumentation speedup or a production
benchmark. See [the full protocol](../docs/customer-resolution.md), including how
to check that the absent address actually times out in your disposable network.

Next enroll the namespace, retaining the fixed Checkout image. Reset to a newly
built `far-wide-demo-checkout:local` for the timeout example. Keep all assets and
working files in this repository; synthetic media remains local and ignored.
