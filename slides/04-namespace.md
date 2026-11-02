---
kicker: The scaling question
---

# What about the other 13?

<ServiceTopology phase="one" />

<!--
**Nikola:**

We got our answer, but we had to arrange the Java setup before we could get that detail. Could you do the same for the thirteen other supported services?

**Tyler:**

I was hoping you wouldn't ask. Each of those thirteen services can use the OpenTelemetry Injector. The four Go services keep OBI. We need a way to share the setup, so this doesn't become thirteen more jobs for the service owners.
-->

---
kicker: Configuration context · upstream comparison
---

# From languages to a namespace

<OperatorChoice />

<!--
**Tyler:**

The upstream OpenTelemetry Operator already saves some of that work. Here's its opt-in configuration: different injection annotations for Java and Python, with an Instrumentation resource supplying the settings. Those annotations can go on a workload or a namespace.

**Nikola:**

But suppose I own the application and want its supported services instrumented. I'd like to make that choice once, and have the controller handle the runtimes and the rollouts.

**Tyler:**

That's the workflow we're demonstrating with RIO, the Runtime Instrumentation Operator, in OTelX. It's a demo operator built for this talk, using the OpenTelemetry Injector. This next installation is RIO, rather than the upstream Operator.

**Nikola:**

We'd like this capability to find an upstream home, in the Operator or another form. That needs community design and agreement. Here's the experience we'd like people to be able to have.
-->

---
kicker: Live demo · centralized control
evidence: true
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
**Tyler:**

Install the demo controller once. It builds on Jack Berg's prototype. The controller selects the workloads and manages their rollout. The Injector recognizes supported runtimes and loads the agents. Those are the pieces we otherwise had to arrange for each service.

**Nikola:**

We prepare the shared payload, exporter, and exclusions here. Then the application owner gets a simpler decision: instrument this namespace. They can ask for coverage without first turning it into a separate project with every service owner.
-->

---
kicker: Choose the application boundary
codeHero: true
---

# Instrument this namespace

<div class="code-focus">

```yaml
selector:
  namespaces: [demo-apps]
action: Inject
```

</div>

<!--
**Nikola:**

Here's the decision: instrument demo-apps. One namespace rule. We haven't named thirteen services or sorted them into language-specific lists.
-->

---
kicker: Live demo · namespace selection
evidence: true
---

# Apply once. Let the controller roll it out.

<DemoClip src="instrument-namespace-edited.mp4" poster="namespace-rule.png" label="Actual namespace selection patch, automatic rollout and ready deployments" />

<!--
**Tyler:**

Apply it, and the controller rolls the selected workloads. The Injector supplies the agents for supported runtimes. If another compatible service is deployed here later, it inherits the policy. That team doesn't need to arrange its own instrumentation rollout first.
-->

---
kicker: The namespace result
clicks: 1
---

# Ready for the next investigation

<ServiceTopology :phase="$clicks > 0 ? 'complete' : 'one'" />
<div v-if="$clicks > 0" class="coverage-key"><span class="agent-key">14 language agents</span><span class="obi-key">4 with OBI</span></div>

<!--
[click]

**Nikola:**

There they are. Checkout keeps its direct agent. Thirteen more services gain language detail. And the four Go services keep OBI. We didn't have to visit each service to make that happen.

**Tyler:**

OBI is still running alongside them. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI service by service as those agents arrived.

**Nikola:**

So when the next team has a slow request, the detail can already be there. The platform maintains the shared setup. The application team can start with its question.
-->

---
kicker: The useful fleet result
---

# Across the whole application

<TraceEvidence image="fixed-fleet-overview.png" label="Actual post-fix request waterfall after namespace enrollment, including all supported language agents and OBI-covered services" />

<!--
**Tyler:**

Let's check a fresh order. We can still follow it across the application. Now more of those services have the detail we had to set up by hand for Checkout.
-->

---
kicker: The useful fleet result
evidence: true
---

# Open language detail in Catalog

<DemoClip src="fixed-fleet-detail.mp4" poster="fixed-fleet-catalog.png" label="Actual namespace-wide trace inspection, opening Catalog JDBC product lookup and downstream calls" />

<!--
**Nikola:**

Open Catalog. These are database spans from its Java agent. The same enrollment covers the Node, Python, Ruby, and dot net services. If a team needs to understand a database call, it can open that detail instead of first asking how to install an agent.

**Tyler:**

We haven't fixed a problem in every service. We've given the other teams a way to start looking. Checkout keeps its fix, and the next investigation can begin closer to the answer.
-->
