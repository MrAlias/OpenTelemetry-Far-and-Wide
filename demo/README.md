# Full demo guide: OBI first, Java detail next

Start with three uninstrumented services and PostgreSQL, see their HTTP and SQL
traffic through OBI, then use the Injector operator to reveal what happens inside
Java checkout.

```text
curl > gateway (Go) > checkout (Java) > inventory (Node.js)
                         │
                         ├─ PricingEngine.calculate(): about 150 ms
                         └─ Hibernate > PostgreSQL: save the checkout order

OBI + injected Java agent > Collector > Tempo / Prometheus / Loki > Grafana
```

Run commands from the repository root. You need Docker, kind, kubectl, Make,
Python 3, OpenSSL, and curl. Use a Linux Docker host with a kernel supported by
[OBI](https://opentelemetry.io/docs/zero-code/obi/#compatibility), including BTF at
`/sys/kernel/btf/vmlinux`. On Docker Desktop, it is the Docker VM's kernel that
matters. Allow roughly 4 CPUs and 8 GiB of memory for the demo and builds.

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

Build the three application images. Checkout adds Hibernate and PostgreSQL access
while sharing the original pricing-method example:

```bash
docker build --target gateway -t far-wide-demo-gateway:local \
  -f demo/proof/apps/Dockerfile demo/proof/apps
docker build -t far-wide-demo-checkout:local \
  -f demo/apps/checkout/Dockerfile demo
docker build --target inventory -t far-wide-demo-inventory:local \
  -f demo/proof/apps/Dockerfile demo/proof/apps
```

Load them into kind, start PostgreSQL, then start the applications in `demo-apps`:

```bash
kind load docker-image --name far-wide-demo \
  far-wide-demo-gateway:local far-wide-demo-checkout:local far-wide-demo-inventory:local
kubectl apply -f demo/k8s/postgres.yaml
kubectl rollout status deployment/postgres -n demo-apps --timeout=180s
kubectl apply -f demo/k8s/applications.yaml
kubectl rollout status deployment/gateway deployment/checkout deployment/inventory \
  -n demo-apps --timeout=180s
```

In a **second terminal**, expose the gateway and leave this running:

```bash
kubectl port-forward -n demo-apps service/gateway 8080:8080
```

Back in the main terminal, make a request:

```bash
curl -fsS http://localhost:8080/checkout
```

Expected response (`orderId` increases with each successful checkout):

```json
{"price":42,"inventory":{"available":true},"orderId":1}
```

These applications have no OpenTelemetry SDK dependencies. The Java service's
pricing method still deliberately takes about 150 ms. Each request also loads
the seeded product and saves an order through Hibernate, using a HikariCP
connection pool and the PostgreSQL JDBC driver.

You can check the saved orders directly:

```bash
kubectl exec -n demo-apps deployment/postgres -- \
  psql -U checkout -d checkout -c 'SELECT id, product_id, total FROM checkout_orders ORDER BY id DESC LIMIT 5;'
```

The [database manifest](k8s/postgres.yaml) creates the schema, a sample product,
local-demo credentials, and a 1 GiB persistent volume. Orders survive application
and PostgreSQL Pod replacement. Checkout validates the existing schema at startup;
it does not recreate it during instrumentation rollouts.

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
`inventory`. The checkout request takes roughly 150 ms or more, but there is no
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

You should see an HTTP request count for each of the three services. Allow a few
seconds for export and refresh if the first query is empty.

This baseline produces **traces and metrics**. Loki is available, but these apps
do not yet produce OTLP logs, and the stack does not collect container stdout.

## 5. Build and deploy the operator and Injector

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
The Deployment keeps the old Pod until the new one is ready. Gateway and
inventory stay running. A separate `kubectl rollout restart` would cause an
unnecessary second restart.

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
takes about 150 ms**, explaining the delay you saw with OBI. The application
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
150 ms delay, and the default Hibernate/JDBC spans expose the order-persistence
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
- For all supported workloads in `demo-apps`, remove the `workloads` selector
  and the checkout-specific `env` block.
- For checkout Deployments in several namespaces, use
  `namespaces: [demo-apps, payments]`. They share the rule's `service.namespace`
  value in Grafana; use separate rules if you want distinct telemetry groups.

For all application namespaces, replace the rules with exclusions followed by a
wildcard rule:

```yaml
rules:
  - name: skip-database
    selector:
      namespaces: [demo-apps]
      workloads:
        - kind: Deployment
          name: postgres
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
Keep PostgreSQL excluded when broadening selection: it is the database backend
and its Deployment uses `Recreate`, rather than an application rolling update.
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

This also deletes the telemetry and PostgreSQL orders stored in the cluster.

## If a step does not work

| Symptom | Check |
| --- | --- |
| Application `ImagePullBackOff` | Repeat the `kind load docker-image` command in step 2 for this cluster. |
| Checkout fails to start or returns 502 | Check `kubectl logs -n demo-apps deployment/checkout` and `kubectl rollout status deployment/postgres -n demo-apps`. PostgreSQL must be ready with its seeded schema. |
| LGTM is pending | `kubectl describe pod -n observability -l app=demo-lgtm` and `kubectl get pvc -n observability`. It needs the default storage class and enough memory. |
| OBI is running but Tempo is empty | Generate traffic, refresh the time range, and inspect `kubectl logs -n obi-system daemonset/obi`. Check the host kernel's BTF/eBPF support. A running Pod alone does not prove probes attached. |
| Policy never reaches `Ready` | Inspect `kubectl get demoinstr cluster -o yaml` and `kubectl logs -n otel-injector-system deployment/otel-injector`. A failed candidate is rolled back; status records the reason. |
| Java is ready but the method span is missing | Send new traffic and inspect checkout's log for agent/export errors. Check that `OTEL_INSTRUMENTATION_METHODS_INCLUDE` matches the policy. |
| Hibernate spans are missing | Confirm you built checkout with `demo/apps/checkout/Dockerfile`, generate new requests, and inspect a recent trace after the Java rollout. The original proof image has no database access. |

For more detail, see the [operator reference](../components/otel-injector-operator/README.md)
and [observability stack guide](observability/README.md). The older
[proof harness](proof/README.md) remains a separate experiment. This walkthrough
shares its gateway, inventory, and pricing-method sources, and adds the
[Hibernate checkout application](apps/checkout/) with ordinary readiness probes
and direct Services.
