# Demo observability stack

For the complete sequence from cluster creation through OBI and Java injection,
follow the [full demo walkthrough](../README.md).

This runs [grafana/otel-lgtm](https://github.com/grafana/docker-otel-lgtm/tree/v0.37.0)
as one Pod in Kubernetes, with its Collector and Grafana data sources already
connected:

| Component | Role |
| --- | --- |
| OpenTelemetry Collector | Receives OTLP from application agents and OBI |
| Tempo | Stores and queries traces |
| Prometheus | Stores and queries metrics |
| Loki | Stores and queries logs |
| Grafana | Displays all three signals |

The upstream image also includes Pyroscope for profiles. Bundled OBI is disabled;
the demo's OBI deployment remains separate.

## 1. Start the stack

Use your demo's current kubectl context. From the repository root:

```bash
kubectl apply -f demo/observability/lgtm.yaml
kubectl rollout status deployment/lgtm -n observability --timeout=300s
```

The manifest includes a 10 GiB persistent volume claim, using the cluster's
default storage class. kind provides one. Data survives replacement of the Pod;
deleting the volume or the kind cluster removes it.

## 2. Open Grafana

```bash
kubectl port-forward -n observability service/lgtm 3000:3000
```

Leave that terminal running and open **http://localhost:3000**. The image enables
anonymous access for demos. If you choose to sign in, the initial credentials
are `admin` / `admin`. Access is through the local port-forward; the Service stays
inside the cluster.

## 3. Send telemetry to it

In the Injector operator's `Instrumentation` policy, set:

```yaml
spec:
  endpoint: http://lgtm.observability.svc.cluster.local:4318
  signals:
    traces: true
    metrics: true
    logs: true
```

Reapply your policy to roll out the change. The
[full demo guide](../README.md)
uses this endpoint already. Keep `observability` excluded when selecting all
namespaces for instrumentation.

Configure the separately deployed OBI to send traces and metrics to the same
OTLP HTTP endpoint. OTLP gRPC is also available at `lgtm.observability.svc.cluster.local:4317`.

## 4. View the application's signals

Generate requests through your application, then open **Explore** in Grafana and
choose a data source:

| Data source | Example query for a service named `checkout` |
| --- | --- |
| Tempo | `{ resource.service.name = "checkout" }` |
| Prometheus | `{service_name="checkout"}` |
| Loki | `{service_name="checkout"}` |

Replace `checkout` with your application's service name. The image also provides
dashboards; their panels populate when the corresponding metrics are available.

Enabling the logs exporter requires application logging supported by the injected
agent. This stack receives OTLP logs; it does not tail Kubernetes container stdout.

## Stop or remove it

To stop the stack and keep its stored data:

```bash
kubectl scale deployment/lgtm -n observability --replicas=0
```

Reapply `lgtm.yaml` to start it again. To remove the stack **and its stored data**:

```bash
kubectl delete deployment/lgtm service/lgtm pvc/lgtm-data -n observability
```

## What the repository had before this

The [proof harness](../proof/README.md) has a Collector in `far-wide-proof` that
receives traces and metrics and writes a JSON evidence file. It has no logs
pipeline, telemetry databases, or Grafana. Its evidence server and validators
depend on that file output, so this stack is added for the new demo without
replacing the proof harness's Collector.
