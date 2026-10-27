---
kicker: The scaling question
---

# One fixed. Thirteen to equip.

<ServiceTopology phase="one" />

<p class="caption">How do the other teams get this detail without repeating the setup?</p>

<!--
Nikola · 45 seconds. “We fixed this checkout. How do the other teams get this detail without repeating the setup?”
Tyler: Fourteen runtimes in this demo are supported by the payload. Checkout has the direct agent; thirteen remain. Four Go services keep OBI. The database dependencies are outside the language-agent target count.

[Sources]
- presentation/data/topology.json
- components/otel-injector-images/versions.json
[/Sources]
-->

---
kicker: Configuration context · upstream comparison
---

# Choose languages—or share one runtime policy

<div class="code-focus">

```yaml
# Upstream Operator: Java workload opt-in
instrumentation.opentelemetry.io/inject-java: "true"
# Upstream Operator: Python workload opt-in
instrumentation.opentelemetry.io/inject-python: "true"
```

</div>

<p class="lead">RIO: select the namespace.<br>The Injector detects supported runtimes.</p>
<p class="caption">Upstream also supports namespace annotations. RIO adds its own selection and rollout workflow.</p>

<!--
Tyler · 45 seconds. These are upstream configuration examples for different runtime owners, alongside an Instrumentation resource specifying agent/export settings. Upstream supports workload OR namespace annotation opt-in; don’t imply 13 edits are inevitable for an already-centralized upstream deployment.
Nikola: RIO means Runtime Instrumentation Operator, an independent OTelX project using the upstream OpenTelemetry Injector and agents. It is not the upstream Operator or a distribution of it. This recording uses the bundled prototype that led to RIO. The value is central namespace policy, runtime detection and managed rollout together: application teams don’t each choose and maintain language injection settings or arrange the instrumentation release. Compatible new workloads inherit the selection.

[Sources]
- https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/
- https://github.com/otelx/rio
- docs/technical-findings.md#identified-implementation
[/Sources]
-->

---
kicker: Live demo · RIO’s namespace-driven approach
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
Tyler · 60 seconds. Install the repository’s bundled RIO precursor once with make -C components/otel-injector-operator install. The controller selects Kubernetes workloads and manages rolling replacement; the OpenTelemetry Injector detects supported runtimes and loads their agents.
Nikola: Payload, exporter and exclusions are shared settings. Prepare demo/k8s/fleet-instrumentation-base.yaml before the next action. The actual application choice comes next.

Credit Jack Berg's prototype implementation and Nikola's participation. The merged demo uses demo.opentelemetry.io, independently from upstream APIs. Describe the bundled recording snapshot accurately; do not present it as an upstream Operator release.

[Sources]
- components/otel-injector-operator/README.md
- components/otel-injector-images/README.md
- docs/technical-findings.md#identified-implementation
[/Sources]
-->

---
kicker: Choose the application boundary
---

# Instrument this namespace

<div class="code-focus">

```yaml
selector:
  namespaces: [demo-apps]
action: Inject
```

</div>

<p class="lead">One namespace choice.<br>No list of individual services.</p>

<p class="caption">Shared payload, exporter and exclusions are configured once.</p>

<!--
Nikola · 30 seconds. “Here is the whole selection rule: instrument demo-apps. No list of service names. The Injector chooses the runtime; application owners do not choose and maintain separate language injection settings.”

This is the actual rule appended by demo/k8s/instrument-demo-namespace.patch.yaml. Shared defaults and exclusions are prerequisites, not magically absent configuration. Retain direct Checkout, the four Go baselines and database deployments. This selection enrolls thirteen more supported services.

[Sources]
- demo/k8s/fleet-instrumentation-base.yaml
- demo/k8s/instrument-demo-namespace.patch.yaml
- public/demo-capture/capture-summary.json
[/Sources]
-->

---
kicker: Live demo · namespace selection
---

# Apply once. Let the controller roll it out.

<DemoClip src="instrument-namespace-edited.mp4" poster="namespace-rule.png" label="Actual namespace selection patch, automatic rollout and ready deployments" />

<!--
Tyler · 60 seconds. Apply the patch shown in the recording to demoinstr/cluster. The controller replaces selected workloads and the Injector supplies their agents. No per-application instrumentation annotations or positive workload names were added.

The fallback is actual terminal execution, native speed, with an explicit cut over a long readiness wait. Wait for the completed result before moving on. Do not narrate trace-identity verification.

[Sources]
- demo/k8s/instrument-demo-namespace.patch.yaml
- public/demo-capture/capture-summary.json
[/Sources]
-->

---
kicker: The namespace result
clicks: 1
---

# The supported services light up

<div class="namespace-rule">selector.namespaces: [demo-apps]</div>
<div class="namespace-topology"><ServiceTopology :phase="$clicks > 0 ? 'complete' : 'one'" /></div>

<p class="caption"><span class="agent-text">14 language agents</span> · 4 Go services with OBI</p>

<!--
Nikola · 15 seconds. Advance once after the previous terminal result. Checkout keeps its direct agent, thirteen additional services gain language detail, and the Go services keep OBI. The lighting is an explanatory view derived from verified telemetry, not a dashboard screen recording.

There were thirteen Ready operator-managed workloads, fourteen SDK services in the fresh trace, four Go services observed by OBI, and no application opt-in annotations. These are prep checks; don't turn them into a verification lecture.

[Sources]
- public/demo-capture/capture-summary.json
- presentation/data/capture.json
- presentation/data/topology.json
[/Sources]
-->

---
kicker: The useful fleet result
---

# Open language detail in Catalog

<TraceEvidence image="fixed-fleet-catalog.png" label="Actual fixed Checkout request after namespace enrollment, showing Catalog JDBC product lookup and downstream calls" />

<p class="caption">Catalog's database work is visible too. Checkout keeps its fix.</p>

<!--
Tyler · 60 seconds. Open the fresh namespace-enrolled request in the live backend.
Nikola: Follow Catalog and its Java-agent database spans. The same enrollment covers supported Node, Python, Ruby and .NET services. The fixed-fleet-detail.mp4 fallback shows the native Grafana navigation.
Tyler: No separate instrumentation change from each application team. The platform carries shared setup; application teams retain their services.

The earlier application change removed the retired backend attempt; this enrollment adds readiness for future investigations. Do not attribute the fix to instrumentation or promise support for every framework/version.

[Sources]
- presentation/data/resolution.json
- docs/customer-resolution.md
- components/otel-injector-images/versions.json
[/Sources]
-->
