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

## 7. Build and deploy the operator and Injector

[RIO](https://github.com/otelx/rio) is the demo operator purpose-built for this talk; we want this capability to find an upstream home. The following steps reproduce the presentation’s bundled demo snapshot and use its `demo.opentelemetry.io` API; RIO has its own API and release artifacts.

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

## 8. Instrument all services with the RIO operator

### Create the shared configuration and exclusions, like the OTEL exporter URL
```sh
kubectl apply -f demo/k8s/fleet-instrumentation-base.yaml
```

### Append the demo-apps namespace rule

```sh
kubectl patch demoinstr cluster \
  --type=json \
  --patch-file demo/k8s/instrument-demo-namespace.patch.yaml
```

### Wait for managed workload rollouts.
kubectl wait --for=jsonpath='{.status.workloads[0].phase}'=Ready \
  demoinstr/cluster --timeout=300s

