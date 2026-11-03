---
kicker: The scaling question
---

# What about the other 13?

<ServiceTopology phase="one" />

<!--
**Nikola:**

We got our answer, but we had to arrange the Java agent setup before we could get those details. Could you do the same for the thirteen other supported services?

**Tyler:**

I was hoping you wouldn't ask. Each of those thirteen services can use the OpenTelemetry Injector. The four Go services keep OBI. We need a way to share the setup, so this doesn't become thirteen more jobs for the service owners.
-->

---
kicker: Upstream OpenTelemetry Operator
clicks: 5
---

# The annotation is the easy part

<OperatorConfiguration :step="$clicks" />

<!--
**Tyler:**

We can opt in a workload or a namespace with the upstream OpenTelemetry Operator. It handles agent injection. Now take a Python API owned by another team. What does the platform need to know?

**Nikola:**

Which Python, which base image, and who has the Dockerfile? That's where I'd start.

[click]

**Tyler:**

This image uses musl, so we add the Python platform setting. Native wheels also depend on the Python version. Dot net has a runtime identifier; Ruby has separate support and enablement checks.

**Nikola:**

So the value comes from the application's image. It isn't something the platform team can safely guess.

[click]

**Tyler:**

Now the pod also has a dot net worker. We name which container gets Python and which gets dot net, and choose the worker's runtime. Multi-instrumentation must be enabled in the Operator.

**Nikola:**

And those are container names. They tell us nothing about the processes running inside.

[click]

**Tyler:**

Suppose api starts both Python and Node. The Operator's multi-instrumentation feature doesn't support two language instrumentations inside one container. We need the application team to inspect that startup or change the packaging.

**Nikola:**

Another annotation isn't going to answer that.

[click]

**Tyler:**

Or Python starts in isolated mode, with site initialization disabled. The Operator sets PYTHONPATH, but this process ignores that environment and skips the startup hook. The pod can be healthy without the agent loading.

**Nikola:**

Now we need the actual entrypoint. A namespace policy can't make the program honor that hook.

[click]

**Tyler:**

Then check payload compatibility, permissions, existing agents and Collector access. Restart the workload, respect its release constraints, and confirm the instrumentation actually loads and exports.

**Nikola:**

The typing takes minutes. Finding the owner, inspecting the image and arranging a release can take hours. That's engineering effort plus time spent waiting: a ten-minute change can take days to reach production when another team owns the release. The Operator handles injection; we still have to discover the right configuration.
-->

---
kicker: Live demo · centralized control
evidence: true
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
**Tyler:**

Now let's demonstrate a different way to share the repeatable work. This installation is RIO, the Runtime Instrumentation Operator in OTelX. It's a demo operator built for this talk, using the OpenTelemetry Injector. It isn't the upstream Operator.

**Nikola:**

We'd like this workflow to find an upstream home, in the Operator or another form. That needs community agreement. It also doesn't remove application compatibility or startup constraints.

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

The selection rule is simple: instrument demo-apps in a declarative way. Unlike the language opt-in we previously showed, this rule doesn't list languages or individual services.
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

So when the next team has a slow request, the details will already be there. The platform maintains the shared setup. The application team can start with its question.
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
