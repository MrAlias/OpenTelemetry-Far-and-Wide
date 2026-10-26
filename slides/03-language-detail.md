---
kicker: Add useful detail
---

# Give the local work a name

<div class="code-focus">

```yaml
JAVA_TOOL_OPTIONS: >-
  -javaagent:/java-agent/opentelemetry-javaagent.jar
OTEL_SERVICE_NAME: checkout
OTEL_INSTRUMENTATION_METHODS_INCLUDE: >-
  demo.checkout.PricingEngine[calculate]
```

</div>

<p class="lead">The agent supplies instrumentation.<br>We still supply the setup.</p>

<!--
Tyler · 55 seconds. We have source access: PricingEngine.calculate runs before Inventory. The method-inclusion setting explicitly names that method; the agent does not magically infer business meaning. Library instrumentation adds Hibernate/JDBC detail.
Nikola: “Zero code is useful. It hasn't made the release calendar disappear.” The direct setup still needs agent delivery, startup, service identity/export settings and a deployment.

The excerpt highlights three settings; the real patch also has exporter and volume/init-container configuration. Show the actual file during the live demo.

[Sources]
- demo/k8s/checkout-direct-agent.patch.yaml
- demo/apps/checkout/src/main/java/demo/checkout/Checkout.java
- https://opentelemetry.io/docs/zero-code/java/agent/
[/Sources]
-->

---
kicker: Live demo · Java agent
---

# Roll Checkout with the Java agent

<DemoClip src="install-java-agent-edited.mp4" poster="install-java-agent-edited-poster.png" label="Actual Java agent deployment patch, rollout and startup log" />

<!--
Tyler · 95 seconds. Apply the actual strategic patch from demo/k8s/checkout-direct-agent.patch.yaml to deployment/checkout, wait for readiness, and generate fresh traffic. Application source/image stay the same during this instrumentation change.

Nikola: We know the runtime and have full access; there is still work around a competent setup. No staged mistakes or typing race. The recording cuts long unchanged readiness waits with an explicit card and keeps command/output playback at 1x.

[Sources]
- demo/k8s/checkout-direct-agent.patch.yaml
- docs/fleet-demo-handoff.md
[/Sources]
-->

---
kicker: The useful result
---

# The missing interval has a name

<TraceEvidence image="java-detail-poster.png" label="Java-agent trace with PricingEngine.calculate at 150.38 milliseconds and Hibernate/JDBC spans" />

<p class="caption"><code>PricingEngine.calculate</code> · 150.38 ms · Hibernate and JDBC below</p>

<!--
Tyler · 75 seconds. This is a fresh request, not an old trace edited to add spans. OBI earned the service selection; the Java agent names its local work.
Nikola: Inspect the 150.38 ms method span and the product lookup, order insert and transaction commit. In the live backend scroll to the latter; the checked-in fallback clip java-detail.mp4 also shows it. Do not imply instrumentation fixed the delay or compare individual request durations as a benchmark.

[Sources]
- public/demo-capture/capture-summary.json
- demo/k8s/checkout-direct-agent.patch.yaml
[/Sources]
-->
