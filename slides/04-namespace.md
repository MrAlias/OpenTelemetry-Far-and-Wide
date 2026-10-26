---
kicker: The scaling question
---

# One configured. Thirteen to go.

<ServiceTopology phase="one" />

<p class="caption">Four Go services keep OBI. How do we share the remaining setup?</p>

<!--
Nikola · 45 seconds. “That's one service. How do we get this kind of detail into the rest without asking each team to repeat the setup?”
Tyler: Fourteen runtimes in this demo are supported by the payload. Checkout has the direct agent; thirteen remain. Four Go services keep OBI. The database dependencies are outside the language-agent target count.

[Sources]
- presentation/data/topology.json
- components/otel-injector-images/versions.json
[/Sources]
-->

---
kicker: The upstream Operator
---

# Injection still needs a selection

<div class="code-focus">

```yaml
annotations:
  instrumentation.opentelemetry.io/inject-java: "true"
```

</div>

<p class="lead">Language-specific opt-in.<br>On a workload <em>or a namespace</em>.</p>

<p class="caption">Can one shared choice also carry runtime selection and rollout?</p>

<!--
Tyler · 45 seconds. Upstream already supplies language-agent injection and supports namespace annotations. Do not claim every service must always be annotated individually.
Nikola: For this mixed-language application, we want one shared namespace choice, with runtime handling and managed rollout. This creates the need for the custom integration; do not present it as the first implementation of namespace opt-in.

This is an illustrative upstream configuration excerpt, not a claim that we installed the upstream Operator during this recorded sequence.

[Sources]
- https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/
- docs/technical-findings.md#identified-implementation
[/Sources]
-->

---
kicker: Live demo · custom Injector integration
---

# Move the choice to the namespace

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
Tyler · 75 seconds. Install the repository's merged component once with make -C components/otel-injector-operator install. The controller selects Kubernetes workloads and manages rolling replacement; the OpenTelemetry Injector detects supported runtimes and loads their agents.
Nikola: Payload, exporter and exclusions are shared settings. Prepare demo/k8s/fleet-instrumentation-base.yaml before the next action. The actual application choice comes next.

Credit Jack Berg's prototype implementation and Nikola's participation. The merged demo uses demo.opentelemetry.io, independently from upstream APIs. A standalone official repository is future work; do not invent a release URL.

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
Nikola · 30 seconds. “Here is the whole selection rule: instrument demo-apps. No list of service names. No language-specific annotations on each application.”

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

<TraceEvidence image="fleet-catalog.png" label="Actual namespace-enrolled request showing Catalog JDBC product lookup and downstream calls" />

<p class="caption">Catalog's database work is visible too.</p>

<!--
Tyler · 85 seconds. Open the fresh namespace-enrolled request in the live backend.
Nikola: Follow Catalog and its Java-agent database spans. The same enrollment covers supported Node, Python, Ruby and .NET services. The checked-in fleet-detail.mp4 fallback shows the native Grafana navigation.
Tyler: No separate instrumentation change from each application team. The platform carries shared setup; application teams retain their services.

Do not claim the latency was fixed, or that this demo promises support for every framework/version.

[Sources]
- public/demo-capture/capture-summary.json
- components/otel-injector-images/versions.json
[/Sources]
-->
