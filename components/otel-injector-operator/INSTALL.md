# Install the operator for the demo

Use an existing kind cluster with your application and an OpenTelemetry Collector
already running. OBI is installed separately.

Run these commands from the repository root. You need Docker, kind, kubectl,
Make, Python 3, and OpenSSL installed.

## 1. Build the two images

One image runs the operator. The other contains the Injector and language agents.

```bash
make -C components/otel-injector-operator image
make -C components/otel-injector-images image
```

## 2. Load the images into your demo cluster

Here the kind cluster is named `far-wide-demo`. Replace that name with yours in
this command and the next step. Typically the images would be published somewhere
in a Docker repository, so this step is only needed in our `kind` demo.

```bash
kind load docker-image --name far-wide-demo \
  otel-injector-operator:demo otel-injector-images:demo
```

## 3. Install the operator

Select the demo cluster's context, then install. These commands use your normal
kubectl configuration.

```bash
kubectl config use-context kind-far-wide-demo
make -C components/otel-injector-operator install
```

The installer creates the CRD, permissions, certificates, and webhook, then waits
for the operator to be ready. On a fresh installation, it does not instrument
anything until you apply a policy.

## 4. Choose the namespace to instrument

Create a directory for your demo policy:

```bash
mkdir -p .artifacts/injector-demo
```

Save this as **`.artifacts/injector-demo/instrumentation.yaml`**:

```yaml
apiVersion: demo.opentelemetry.io/v1alpha1
kind: Instrumentation
metadata:
  name: cluster
spec:
  image: otel-injector-images:demo
  endpoint: http://collector.observability.svc.cluster.local:4318
  signals:
    traces: true
    metrics: true
    logs: true
  timeoutSeconds: 300
  rules:
    - name: demo-application
      selector:
        namespaces: [checkout]
      action: Inject
```

Change **`checkout`** to your application's namespace. Change **`endpoint`** to
your Collector's OTLP HTTP address, reachable from application Pods. Use its base
URL, usually on port `4318`, without adding `/v1/traces`.

Set any signal to `false` to disable it. The Collector needs a pipeline for each
enabled signal; actual capture depends on the language agent and application.

There is one policy named `cluster` for the whole cluster. Namespace selection
happens in `namespaces`; you do not need namespace labels or annotations.

## 5. Apply the policy

```bash
kubectl apply -f .artifacts/injector-demo/instrumentation.yaml \
  --cache-dir=.artifacts/injector-demo/cache
```

The operator automatically rolls existing selected Deployments, StatefulSets,
and DaemonSets to instrumented Pods. They must use `RollingUpdate` and have
working readiness checks. You do not need to restart them yourself.

It also chooses native image volumes or the init-container fallback automatically.

## 6. Check the result

```bash
kubectl get demoinstr cluster -o yaml \
  --cache-dir=.artifacts/injector-demo/cache
```

`demoinstr` is the short name for this operator's `Instrumentation` resource.
Under `status.workloads`, check that your application is listed and its `phase`
becomes `Ready`.

Send requests to the application and check your telemetry backend. `Ready` means
the rollout is healthy; it does not confirm telemetry delivery.

If the rollout fails, inspect the operator logs:

```bash
kubectl logs -n otel-injector-system deployment/otel-injector --tail=50 \
  --cache-dir=.artifacts/injector-demo/cache
```

## Select more namespaces or all namespaces

Edit the same policy file. For several namespaces, change the selector to:

```yaml
selector:
  namespaces: [checkout, inventory, payments]
```

For all namespaces, including ones created later:

```yaml
selector:
  namespaces: ['*']
```

To instrument all application namespaces while excluding infrastructure, replace
the policy's `rules` section with:

```yaml
rules:
  - name: skip-infrastructure
    selector:
      namespaces: [kube-system, kube-public, kube-node-lease, local-path-storage, observability]
    action: Skip
  - name: all-applications
    selector:
      namespaces: ['*']
    action: Inject
```

The **first matching rule wins**, so exclusions come first. Add your actual
Collector and OBI namespaces to the exclusion list. The operator's own namespace
is always excluded.

Apply your changes with the command from step 5. Newly selected workloads roll
out automatically. Previously managed workloads that no longer match an `Inject`
rule roll back to uninstrumented Pods.

## Remove instrumentation and uninstall

Keep the operator running while it removes instrumentation. This command uses
your current context, waits for cleanup, then removes the operator:

```bash
make -C components/otel-injector-operator uninstall
```

For workload-specific rules, retrying failed rollouts, and compatibility details,
see the [operator reference](README.md).

The older [proof demo](../../demo/proof/README.md) needs additional integration:
its checkout workload uses a custom readiness gate and router handoff. This guide
assumes an application using ordinary Kubernetes readiness probes.
