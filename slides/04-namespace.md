---
kicker: Share the capability
---

# What about the other 13?

<ServiceTopology phase="one" />

<!--
**Tyler:**

The hard part now is repeating the setup. We had access to Checkout and knew its runtime. What happens when the other thirteen services belong to different teams?

**Nikola:**

I'd rather not schedule thirteen versions of that meeting. The OpenTelemetry Injector lets us share the runtime setup. First, let's see what the established Operator workflow asks each team to supply.
-->

---
kicker: Upstream OpenTelemetry Operator
clicks: 2
---

# The annotation is the easy part

<OperatorConfiguration :step="[1, 2, 5][$clicks]" />

<!--
**Tyler:**

The upstream OpenTelemetry Operator can inject agents, with opt-in on a workload or a namespace. But the platform still needs application facts. This Python image uses musl; its Python version and native packages must match the payload.

**Nikola:**

Which image, which runtime, who has the Dockerfile? The application team usually knows. The annotation doesn't answer those questions.

[click]

**Tyler:**

Add a dot net worker and we also need per-container language mappings and its runtime settings. If a container starts multiple languages, or an entrypoint ignores the injected environment, more YAML alone won't make that work.

[click]

**Nikola:**

That's where a small deployment change can turn into hours of investigation and days waiting for an owner or release. The Operator helps with injection. We'd like to prepare more of the routine runtime setup once, and share it.
-->

---
kicker: Upstream OpenTelemetry Injector
---

# OpenTelemetry Injector

<InjectorIntro />

<!--
**Tyler:**

The Injector is the shared library in this diagram. It runs inside a compatible process at startup and loads the matching language agent. We prepare the library and supported agents together, instead of having every service team assemble a language-specific installation.

**Nikola:**

It works at process startup; it doesn't manage Kubernetes workloads. We still need a controller to select the workloads and arrange the rollout.
-->

---
kicker: RIO · demo controller
evidence: true
---

# Install the namespace-driven controller

<DemoClip src="install-operator-edited.mp4" poster="install-operator-edited-poster.png" label="Actual installation of the bundled RIO demo controller and prepared shared defaults" />

<!--
**Tyler:**

For this talk, that controller is RIO: the Runtime Instrumentation Operator in OTelX. This demo uses the bundled prototype of that workflow, building on Jack Berg's work. RIO selects Kubernetes workloads and handles rollout; the Injector loads agents inside the processes.

**Nikola:**

The idea we'd like to bring upstream is less routine runtime configuration for each team. RIO demonstrates it; the eventual upstream home is still open. Compatibility and unusual startup behavior still need owners.

**Tyler:**

Let's install the controller. We've prepared the agent bundle, exporter and exclusions. No application namespace is enrolled yet.
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
**Tyler:**

Now the controller is installed and the shared defaults are ready. We just need to choose the application namespace: demo-apps. One rule, without listing thirteen services or assigning a language to each.
-->

---
kicker: The fleet result
clicks: 1
mediaAt: 1
---

# Language detail. OBI alongside it.

<ServiceTopology v-if="$clicks === 0" phase="complete" />
<div v-if="$clicks === 0" class="coverage-key"><span class="agent-key">14 language agents</span><span class="obi-key">4 with OBI</span></div>
<DemoClip v-else src="fleet-mixed-detail.mp4" poster="fleet-mixed-detail.png" label="Actual namespace-enrolled request: Cart Ruby agent detail and Currency Go coverage from OBI" />

<!--
**Tyler:**

Here's the result across the namespace: fourteen services with language agents, and four Go services still covered by OBI.

[click]

**Nikola:**

Open Cart in this fresh request. These are Ruby-agent observations; we didn't arrange a separate Ruby installation for its team. Now open Currency: that Go service still uses OBI. Fourteen language agents, including Checkout, and four services with OBI.

**Tyler:**

As the SDKs start exporting, OBI recognizes them and steps back from tracing those processes. We leave it running for the services that still need it.

**Nikola:**

So the next team can start with its question. Useful detail is already there. That is the result of the namespace rollout.
-->

---
kicker: Namespace selection
evidence: true
---

# One policy. Controller-managed rollouts.

<DemoClip src="instrument-namespace-edited.mp4" poster="namespace-rule.png" label="Actual namespace enrollment and controller-managed rolling restarts" />

<!--
**Tyler:**

RIO handled the rolling restarts for the selected workloads. Checkout kept its direct agent, and the four Go services kept OBI. Compatible new workloads inherit the same namespace policy.
-->
