---
kicker: The scaling question
---

# One fixed. Thirteen to equip.

<ServiceTopology phase="one" />

<p class="caption">How do the other teams get this detail without repeating the setup?</p>

<!--
**Nikola → Tyler → Nikola · 0:40**

- **Nikola:** Fixed Checkout; getting there needed access, runtime knowledge, configuration, deployment.
- **Tyler:** **13 more** services supported by the OTel Injector; **4 Go** services keep OBI.
- **Nikola:** Other teams have different access, expertise, release queues.
- **Next · Tyler:** Share the setup and its ongoing responsibility.
- **Pronounce:** RIO “rhee-o”; OTelX “oh-tell-X.”

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/topology.json
- components/otel-injector-images/versions.json
[/Sources]

</details>
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
**Tyler → Nikola · 0:45**

- **Tyler · point:** Upstream Java/Python injection annotations + Instrumentation settings.
- **Remember:** Upstream supports **workload OR namespace** opt-in.
- **Nikola:** **RIO = Runtime Instrumentation Operator**, from our OTelX org.
- **Nikola:** Central namespace selection → Injector handles supported runtimes → controller manages rollout.
- **Context:** Demo uses RIO's bundled precursor, **not upstream Operator installation**.
- **Next · Tyler:** Install that shared controller once.

<details>
<summary>Sources</summary>

[Sources]
- https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/
- https://github.com/otelx/rio
- docs/technical-findings.md#identified-implementation
[/Sources]

</details>
-->

---
kicker: Live demo · RIO’s namespace-driven approach
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
**Tyler → Nikola · 1:00**

- **Do:** Install the bundled namespace-driven controller once.
- **Tyler:** Controller selects workloads/manages rollout; OpenTelemetry Injector supplies runtime agents.
- **Nikola:** Shared payload, exporter, exclusions; prepare defaults once.
- **Credit:** Jack Berg's prototype; Nikola's participation; precursor to RIO.
- **Next · Nikola:** Choose the application boundary — “instrument this namespace.”

<details>
<summary>Demo commands / fallback</summary>

```sh
make -C components/otel-injector-operator install
kubectl apply -f demo/k8s/fleet-instrumentation-base.yaml
```

Silent recording: manual play, native speed; use if the live demo stalls.

</details>

<details>
<summary>Sources</summary>

[Sources]
- components/otel-injector-operator/README.md
- components/otel-injector-images/README.md
- docs/technical-findings.md#identified-implementation
[/Sources]

</details>
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
**Nikola · 0:30**

- **Point:** `namespaces: [demo-apps]` + `action: Inject`.
- **Nikola:** Application boundary once; **no language list or individual service list**.
- **Remember:** Shared defaults and exclusions already prepared.
- **Nikola:** Keep direct Checkout + Go/OBI coverage; enroll **13 more** supported services.
- **Next · Tyler:** Apply the rule; let the controller roll it out.

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/fleet-instrumentation-base.yaml
- demo/k8s/instrument-demo-namespace.patch.yaml
- public/demo-capture/capture-summary.json
[/Sources]

</details>
-->

---
kicker: Live demo · namespace selection
---

# Apply once. Let the controller roll it out.

<DemoClip src="instrument-namespace-edited.mp4" poster="namespace-rule.png" label="Actual namespace selection patch, automatic rollout and ready deployments" />

<!--
**Tyler · 1:00**

- **Do:** Apply namespace-selection patch to `demoinstr/cluster`.
- **Tyler:** Controller rolls selected workloads; Injector supplies agents.
- **Land:** No application-by-application instrumentation changes; compatible future workloads inherit policy.
- **Show:** Rollout completes; then return to the fleet view.
- **Next · Nikola:** One selection, supported services lit up.

<details>
<summary>Demo commands / fallback</summary>

```sh
kubectl patch demoinstr cluster --type=json \
  --patch-file demo/k8s/instrument-demo-namespace.patch.yaml
kubectl get demoinstr cluster -o yaml
```

Wait for the current policy generation to finish its rollout before advancing.

Silent recording: manual play, native speed; use if the live demo stalls.

</details>

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/instrument-demo-namespace.patch.yaml
- public/demo-capture/capture-summary.json
[/Sources]

</details>
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
**Nikola · 0:15**

[click] **Light the supported fleet.**

- **Nikola · point:** Checkout direct + **13 added agents = 14**; **4 Go** services keep OBI.
- **Nikola:** Shared responsibility now lives with the platform.
- **Next · Tyler:** Open Catalog's actual language detail.

<details>
<summary>Sources</summary>

[Sources]
- public/demo-capture/capture-summary.json
- presentation/data/capture.json
- presentation/data/topology.json
[/Sources]

</details>
-->

---
kicker: The useful fleet result
---

# Open language detail in Catalog

<TraceEvidence image="fixed-fleet-catalog.png" label="Actual fixed Checkout request after namespace enrollment, showing Catalog JDBC product lookup and downstream calls" />

<p class="caption">Catalog's database work is visible too. Checkout keeps its fix.</p>

<!--
**Tyler → Nikola → Tyler · 1:00**

- **Tyler:** New request through the instrumented fleet; system view + language detail.
- **Nikola · show:** Catalog → Java-agent database spans.
- **Nikola:** OBI detects SDK-exported traces and stands down; avoids duplicate tracing.
- **Nikola:** Same enrollment covers Node, Python, Ruby, .NET in this application.
- **Tyler:** No separate instrumentation change from each team; Checkout keeps its fix.
- **Next · Tyler:** Return to slides — what repeated work did we remove?

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/resolution.json
- docs/customer-resolution.md
- components/otel-injector-images/versions.json
[/Sources]

</details>
-->
