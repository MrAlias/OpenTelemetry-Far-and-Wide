---
kicker: The scaling question
---

# One fixed. Thirteen to equip.

<ServiceTopology phase="one" />

<p class="caption">How do the other teams get this detail without repeating the setup?</p>

<!--
**Nikola:**

We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?

**Tyler:**

In this demo, thirteen more services use runtimes supported by the OTel Injector. The Go services will keep their OBI coverage. Our next step is to share the setup across those thirteen.
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

<p class="lead">Select the namespace.<br>Let the Injector handle supported runtimes.</p>
<p class="caption">RIO is purpose-built for this talk. We want this workflow upstream.</p>

<!--
**Tyler:**

To see what we're centralizing, here's the upstream Operator's opt-in configuration. Java and Python have different injection annotations, with an Instrumentation resource supplying their settings. You can put those annotations on workloads or a namespace.

**Nikola:**

That already saves work. For this talk, we built RIO, the Runtime Instrumentation Operator, in OTelX. It's a demo operator that combines central namespace selection, the OpenTelemetry Injector, and managed rollouts. We want to bring this capability upstream, whether in the existing Operator or another form. That path still needs design and agreement.
-->

---
kicker: Live demo · centralized control
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
**Tyler:**

Here we install the demo controller once. It builds on Jack Berg's prototype. The controller selects workloads and manages their rollout. The OpenTelemetry Injector handles supported runtimes and loads their agents.

**Nikola:**

The payload, exporter, and exclusions are shared settings. Application owners don't each choose a language annotation and arrange a separate instrumentation rollout. Next comes the application choice: instrument this namespace.
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
**Nikola:**

Here is the selection rule: instrument demo-apps. We select the application boundary once. Unlike the language opt-in we just showed, this rule doesn't list languages or individual services.
-->

---
kicker: Live demo · namespace selection
---

# Apply once. Let the controller roll it out.

<DemoClip src="instrument-namespace-edited.mp4" poster="namespace-rule.png" label="Actual namespace selection patch, automatic rollout and ready deployments" />

<!--
**Tyler:**

Apply that rule, and the controller rolls the selected workloads. The Injector injects and supplies the OTel agents. Compatible services deployed into the namespace later inherit the same policy.
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
**Nikola:**

Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it. OBI is still running here. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI for every service.
-->

---
kicker: The useful fleet result
---

# One request. The whole application.

<TraceEvidence image="fixed-fleet-overview.png" label="Actual post-fix request waterfall after namespace enrollment, including all supported language agents and OBI-covered services" />

<p class="caption">18 application services observed · 14 language agents + 4 services with OBI</p>

<!--
**Tyler:**

Back in the application view, we're looking at a new request through the instrumented fleet. We still have the system view, and now we can open language-level observations in more services.
-->

---
kicker: The useful fleet result
---

# Open language detail in Catalog

<DemoClip src="fixed-fleet-detail.mp4" poster="fixed-fleet-catalog.png" label="Actual namespace-wide trace inspection, opening Catalog JDBC product lookup and downstream calls" />

<!--
**Nikola:**

Let's follow Catalog. These are the Java agent's database spans from that service. The same enrollment also covers the Node, Python, Ruby, and dot net services in this application.

**Tyler:**

The namespace rule got us here without a separate instrumentation change from each application team. Checkout keeps its fix. Now the other teams have the language detail ready for their next investigation too.
-->
