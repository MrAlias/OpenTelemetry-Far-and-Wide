---
kicker: The scaling question
---

# One fixed. Thirteen to equip.

<ServiceTopology phase="one" />

<p class="caption">How do the other teams get this detail without repeating the setup?</p>

<!--
**Nikola**

- One service required expertise, access, configuration and a rollout.
- Thirteen more services need language detail; four Go services retain OBI.
- Other teams have different access and release queues.
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
**Tyler**

- Upstream supports workload OR namespace annotations.
- RIO: Runtime Instrumentation Operator, from OTelX.
- Namespace selection, runtime injection and managed rollout together.
- This demo uses RIO’s precursor, not the upstream Operator.
-->

---
kicker: Live demo · RIO’s namespace-driven approach
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
**Tyler**

- Controller selects workloads and manages rollout; Injector supplies agents.
- Payload, exporter and exclusions configured centrally.
- Jack Berg’s prototype; Nikola’s participation; precursor to RIO.
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
**Nikola**

- Namespace selection, not a list of services or languages.
- Shared settings and exclusions already configured.
- Thirteen additional services; retain direct Checkout and Go/OBI coverage.
-->

---
kicker: Live demo · namespace selection
---

# Apply once. Let the controller roll it out.

<DemoClip src="instrument-namespace-edited.mp4" poster="namespace-rule.png" label="Actual namespace selection patch, automatic rollout and ready deployments" />

<!--
**Tyler**

- Controller rolls existing workloads; Injector supplies their agents.
- Compatible future workloads inherit the policy.
- No separate instrumentation change from each application team.
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
**Nikola**

- Checkout keeps its direct agent; thirteen more gain language detail.
- Four Go services retain OBI.
- Platform owns the shared instrumentation setup.
-->

---
kicker: The useful fleet result
---

# Open language detail in Catalog

<TraceEvidence image="fixed-fleet-catalog.png" label="Actual fixed Checkout request after namespace enrollment, showing Catalog JDBC product lookup and downstream calls" />

<p class="caption">Catalog's database work is visible too. Checkout keeps its fix.</p>

<!--
**Tyler**

- Catalog’s Java-agent database spans.
- Same enrollment covers Node, Python, Ruby and .NET.
- OBI detects SDK-exported traces and avoids duplicate tracing.
- Checkout retains its application fix.
-->
