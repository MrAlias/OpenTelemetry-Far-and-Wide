# Demo OpenTelemetry injection operator

For standalone installation and ongoing development, use **[RIO](https://github.com/otelx/rio)** and its [quickstart](https://github.com/otelx/rio/blob/main/docs/quickstart.md). This directory preserves the presentation’s demo snapshot; its `demo.opentelemetry.io` API differs from RIO’s `rio.otelx.github.io` API.

A small, single-process Go operator for the Far and Wide demo. It uses one
cluster-scoped `Instrumentation` CR named `cluster`, a Pod admission webhook,
and Kubernetes rolling updates. OBI is installed and configured separately.

The payload comes from [the image component](../otel-injector-images/README.md).
Application images do not need an SDK, an Injector, or instrumentation annotations.
The operator owns a few bookkeeping annotations on workload templates and Pods.

Start with the [full demo guide](../../demo/README.md) for cluster creation,
applications, the observability stack, OBI, and the Java instrumentation rollout.
For this component's setup, see [Build and install](#build-and-install) below.

## Configuration

Install [the CRD](config/crd.yaml) and use [the example policy](config/example.yaml).
The API group is `demo.opentelemetry.io/v1alpha1`, deliberately separate from the
upstream OpenTelemetry Operator APIs already used elsewhere in this repository.

```yaml
apiVersion: demo.opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: cluster
spec:
  image: otel-injector-images:demo
  endpoint: http://lgtm.observability.svc.cluster.local:4318
  signals:
    traces: true
    metrics: true
    logs: true
  timeoutSeconds: 300
  rules:
    - name: application-namespaces
      selector:
        namespaces: [checkout, inventory] # ['*'] selects all namespaces
      action: Inject
```

Rules run in order; the first match wins. No match means no injection. Namespaces
are exact names or `'*'`; no namespace labels are required. An optional
`selector.workloads` list narrows selection by workload `kind` and `name` (`'*'`
matches all names of that kind). Namespace and workload selections are combined
with AND. Entries within either list are combined with OR.

`action: Skip` provides exclusions. A rule can override `image`, `endpoint`, any
individual `signals` switch, and `env`. Environment overrides merge by name.
All unspecified settings inherit the CR defaults. The operator's own namespace
is always excluded to keep admission and capability probes independent of the
injection policy. Other namespaces, including system namespaces, are controlled
by your rules; the example explicitly excludes the observability and system
namespaces before its catch-all rule.

Signal switches set `OTEL_TRACES_EXPORTER`, `OTEL_METRICS_EXPORTER`, and
`OTEL_LOGS_EXPORTER` to `otlp` or `none`. OTLP HTTP/protobuf is used across the five
runtimes. These switches configure the agents' exporters: actual signals depend
on the language agent and the application's supported libraries. The logs switch
does not install container stdout collection. `env` accepts additional `OTEL_*`
variables, including sampler configuration and per-signal endpoints, with
Kubernetes `valueFrom` references resolved in each application's namespace.
Typed settings and Injector bootstrap variables cannot be overridden through
`env`. Application init containers are left untouched.

## Rollout and recovery

The reconciliation loop runs every three seconds. For Deployments, StatefulSets,
and DaemonSets using `RollingUpdate`, a change in effective configuration changes
the Pod-template revision annotation. Kubernetes performs replacement using the
workload's existing readiness checks, minimum-ready duration, rollout settings,
and termination grace periods. The operator does not replace application images,
commands, environment, or rollout strategies in the workload template. For demo
Deployments, use `maxUnavailable: 0` and `maxSurge: 1` to retain an available old
replica while a replacement starts.

The operator reports paused Deployments, `Recreate`, `OnDelete`, and partitioned
StatefulSet updates as unsupported rather than changing those strategies. Other
Pod-producing resources can receive injection at admission, but automatic
restarts/removal of existing Pods are limited to the three rollout controllers.

Each workload records its current and last successful instrumentation revisions.
The same resolved configuration is carried in its Pod template. Admission uses
that snapshot, including during rollback, so an updated central policy cannot
reinject a broken revision into recovery Pods. State survives operator restarts.

During an instrumentation rollout, three candidate-container crashes in
`CrashLoopBackOff`, or expiration of `timeoutSeconds`, restores the last successful
instrumentation configuration. On first-install failure, that is uninstrumented.
Rollback affects the failed workload and the operator's settings; application
changes made concurrently remain intact. Failed, unready StatefulSet candidate
Pods are deleted with UID preconditions and ordinary grace periods after the
previous template is restored, allowing `OrderedReady` recovery to proceed.

Failed configuration hashes stay blocked for that workload. Correct the effective
configuration, or change `spec.retryToken` to explicitly retry. The retry token is
global and requests a new revision for selected workloads. A recovery that itself
fails is reported as `RecoveryFailed`; it is not retried forever. Workload health,
not telemetry arrival, determines rollout success and rollback. Subsequent,
unrelated application failures outside an instrumentation rollout are not treated
as evidence that injection caused the failure.

Removing selection or deleting the CR rolls managed workloads back to
uninstrumented Pods. A finalizer keeps the operator and webhook involved until
managed-workload cleanup finishes. If cleanup fails or a workload's strategy has
become unsupported, its status explains why deletion is still pending. Harmless
revision/state annotations remain for bookkeeping; injected volumes, init
containers, and environment settings disappear from replacement Pods.

Inspect progress with:

```bash
kubectl get instrumentations.demo.opentelemetry.io cluster
kubectl get instrumentations.demo.opentelemetry.io cluster -o yaml
kubectl logs -n otel-injector-system deployment/otel-injector
```

The webhook uses `failurePolicy: Ignore`. If it is unavailable, Kubernetes may
create healthy uninstrumented Pods. The operator reports `InjectionMissing`
instead of claiming that instrumentation succeeded or rolling back a healthy
application. Correct the webhook and request a new revision to retry.

## Automatic payload delivery

Delivery is automatic and never changes application scheduling:

1. Read Kubernetes and node kubelet/container-runtime versions. Known minimum
   runtimes are containerd 2.1 and CRI-O 1.31; older or unknown runtimes fall back.
2. On potentially compatible clusters, create an isolated probe Pod on each
   registered Linux node. It mounts the actual payload image and checks that the
   Injector library can be loaded. This verifies API/kubelet feature gates and
   runtime mounting, not just version numbers.
3. Use a native read-only image volume only after all those nodes pass. Otherwise,
   use the same image as an init container copying into an `emptyDir`, mounted
   read-only in application containers.

Checks are deliberately cluster-wide, including nodes that a particular workload
might not use. Mixed, unknown, or unavailable nodes therefore cause conservative
fallback. New nodes are considered on the next reconciliation; already admitted
Pods cannot be changed retroactively. Completed probe Pods cache results by node
identity, runtime/kubelet versions, and payload image reference. They live in the
operator namespace and are removed when it is uninstalled. Use immutable image
tags or digests rather than changing bytes behind an existing reference.

The payload is Linux-only. The copy init container uses UID 0, drops all Linux
capabilities, and copies readable files into its own volume; namespaces requiring
every container to run nonroot need a compatible volume-permissions adaptation.
Native image-volume injection does not add an init container.

## Build and install

Go 1.25+, Docker, kubectl, Python 3, and OpenSSL are required. Builds and generated
certificates use the repository's ignored `.artifacts/injector-components/`.

```bash
make -C components/otel-injector-operator test build
make -C components/otel-injector-operator image
make -C components/otel-injector-images image

# Select the demo context and load its images before installation.
kubectl config use-context kind-MY_DEMO_CLUSTER
kind load docker-image --name MY_DEMO_CLUSTER otel-injector-operator:demo otel-injector-images:demo
make -C components/otel-injector-operator install

# Edit endpoint, image, and rules before applying: this starts automatic rollouts.
kubectl apply -f components/otel-injector-operator/config/example.yaml
```

Install and uninstall use your current kubectl context and default kubeconfig.
An existing `KUBECONFIG` override is also respected. Each script prints and uses
the context selected when it starts.

The install script creates/reuses a demo TLS Secret and supplies its CA to the
webhook; cert-manager is not required. Certificates last one year. The operator
runs as one replica, with `Recreate` for its own upgrades; it has no leader-election
or certificate-rotation subsystem. These are deliberate demo boundaries.

To uninstall, keep the operator running until CR cleanup completes:

```bash
make -C components/otel-injector-operator uninstall
```

## Component validation

`make test` runs race-enabled Go tests covering selection, signal overrides,
mutation, admission during rollback, persistent state, retry, and StatefulSet
recovery. The image component has actual loader smoke tests for all five agents.

After building images with the test tags, run the isolated lifecycle integration
checks. The fixtures are simple shell processes, not the talk's application demo.

```bash
docker build -t far-wide-demo-injector-operator:dev components/otel-injector-operator
docker build -t far-wide-demo-injector-payload:dev components/otel-injector-images
EXPECT_DELIVERY=imageVolume components/otel-injector-operator/scripts/e2e.sh
CLUSTER_NAME=far-wide-components-fallback IMAGE_VOLUME_ENABLED=false EXPECT_DELIVERY=initContainer \
  components/otel-injector-operator/scripts/e2e.sh
```

Each run creates its own kind cluster and private kubeconfig, verifies all three
workload types through injection, failing configuration, rollback, operator
restart, correction, and CR deletion, and archives evidence inside `.artifacts/`.
Successful runs delete their own cluster; failures preserve it for inspection.
The script refuses to overwrite an existing cluster. To rerun a retained test,
set `REUSE_CLUSTER=true` with the same `CLUSTER_NAME`; its saved private kubeconfig
is required. Run clusters sequentially to limit local resource use.
`KEEP_CLUSTER=true` retains a successful run as well.

The operator follows the admission/payload separation illustrated by
[Grafana's injection controller](https://github.com/grafana/k8s-injection-controller).
This is an independent demo implementation, not that project's configuration API.
