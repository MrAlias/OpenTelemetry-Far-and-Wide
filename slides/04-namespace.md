---
kicker: The scaling question
---

# What about the other 13?

<ServiceTopology phase="one" />

<!--
**Nikola:**

We have our fix, but we had to arrange the Java agent setup before we could get those details. Could you do the same for the thirteen other supported services?

**Tyler:**

I was hoping you would ask. We know how to do this one service at a time. Now we need a way to make that useful across the application, without thirteen separate instrumentation projects.
-->

---
kicker: Upstream OpenTelemetry Injector
---

# OpenTelemetry Injector

<InjectorIntro />

<!--
**Tyler:**

To help scale this work, we'll use the OpenTelemetry Injector. It's a shared library that runs when a compatible process starts, detects the runtime, and loads the matching language agent. We prepare the library and agents together so teams can use a shared setup.

That's the mechanism for the thirteen supported services; the four Go services keep OBI.

But the Injector isn't a Kubernetes rollout controller. Before we show how we're going to deploy it, let's look at the established approach with the upstream OpenTelemetry Operator. What would the platform still have to configure?
-->

---
kicker: Upstream OpenTelemetry Operator
clicks: 5
---

# The annotation is the easy part

<OperatorConfiguration :step="$clicks" />

<!--
**Tyler:**

The Operator can inject language agents, and it supports opting in a workload or an entire namespace. That's a useful starting point. Let's walk through a Python API owned by another team and see what the platform still needs to know.

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

The typing takes minutes. Finding the owner, checking the image and arranging a release can mean hours of work and days of waiting. The Operator handles injection; we still have to supply and maintain the runtime choices. Can we prepare more of that once, instead of reopening it for every service?
-->

---
kicker: Live demo · centralized control
evidence: true
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the custom Injector controller" />

<!--
**Tyler:**

That's why this demo uses the Injector with RIO, rather than the upstream Operator. We package the supported agents together, let the Injector choose at process startup, and use RIO to select workloads and manage the rollout. RIO is the Runtime Instrumentation Operator in OTelX, purpose-built for this talk.

**Nikola:**

The upstream Operator already supports namespace selection. The difference we're exploring is how much runtime configuration can live in the shared setup. We'd like this workflow to find an upstream home, in the Operator or another form. RIO demonstrates that idea; its upstream path is still open.

**Tyler:**

Let's install the controller. It builds on Jack Berg's prototype. The platform prepares the agent bundle, exporter and exclusions once; RIO handles selection and rollouts. The Injector loads the matching agent in each compatible process.

**Nikola:**

Compatibility tests, startup constraints and exceptions still need owners. The platform maintains that shared path. Once it's ready, an application team can ask for coverage without figuring out a separate language-agent installation for every service.
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

Instrument demo-apps. One namespace rule. We haven't listed the thirteen services or assigned an agent to each one. The Injector handles the runtime choice within the supported bundle, and RIO handles getting it into the selected workloads.
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
