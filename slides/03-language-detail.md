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
Tyler · 45 seconds. We have source access: PricingEngine.calculate runs before Inventory. The method-inclusion setting explicitly names that method; the agent does not magically infer business meaning. Library instrumentation adds Hibernate/JDBC detail.
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
Tyler · 75 seconds. Apply the actual strategic patch from demo/k8s/checkout-direct-agent.patch.yaml to deployment/checkout, wait for readiness, and generate fresh traffic. Application source/image stay the same during this instrumentation change.

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
Tyler · 60 seconds. This is a fresh request, not an old trace edited to add spans. OBI earned the service selection; the Java agent names its local work.
Nikola: Inspect the 150.38 ms method span and the product lookup, order insert and transaction commit. In the live backend scroll to the latter; the checked-in fallback clip java-detail.mp4 also shows it. This identifies the work; it has not fixed it. Transition: “Naming the wait does not remove it. Let’s open that pricing method.”

[Sources]
- public/demo-capture/capture-summary.json
- demo/k8s/checkout-direct-agent.patch.yaml
[/Sources]
-->

---
kicker: The cause
---

# There's our 150 ms

<div class="code-focus">

```diff
 public int calculate() {
-  Thread.sleep(150);
   return 42;
 }
```

</div>

<p class="lead">Remove the wait.<br>Keep the price.</p>
<p class="fix-caption">The demo deliberately seeds this wait inside pricing.</p>

<!--
Tyler · 35 seconds. “There is our 150 milliseconds.” Pause so the audience can connect the code to the local interval and the method span. The diff is the relevant excerpt; the baseline also has interruption handling, shown in the source.
Nikola: The wait is deliberate in this demo, not a discovered production defect. Removing it keeps the price at 42. OBI located the service; explicitly configured Java method detail named the work. Changing the application removes the wait.
This is the first resolution: a specific cause and a specific action. Do not imply installing an agent optimized the application.

[Sources]
- demo/proof/apps/checkout/PricingEngine.java
- demo/apps/checkout/fixes/PricingEngine.java
[/Sources]
-->

---
kicker: Live demo · application fix
---

# Deploy the pricing fix

<DemoClip src="fix-pricing-edited.mp4" poster="fix-pricing-edited-poster.png" label="Actual Checkout fix deployment and successful rollout" />

<!--
Tyler · 55 seconds. Prebuild/load far-wide-demo-checkout:pricing-fixed with make -C demo pricing-fixed-image pricing-fixed-load CLUSTER=<demo-cluster>. Apply demo/k8s/checkout-pricing-fixed.patch.yaml to deployment/checkout, then rollout status. The recording is actual execution at native speed; a long unchanged readiness wait is cut only with a visible card if necessary.
Nikola: Agent, exporter and request path stay the same. A successful rollout is not the customer result. “Let’s send the request again.”
The default slow image and historical proof remain unchanged. Live reset uses far-wide-demo-checkout:local.

[Sources]
- demo/k8s/checkout-pricing-fixed.patch.yaml
- demo/apps/checkout/Dockerfile
- docs/customer-resolution.md
[/Sources]
-->

---
kicker: Back to the customer
---

# The customer gets the time back

<CustomerResult />

<!--
Tyler · 60 seconds. Let the before/after comparison land before speaking over it: roughly 360 → 226 ms in the matched recheck, with the pricing method going from 150.2 → 0.06 ms. These are measured medians of 30 warmed successful requests per version, with the same direct Checkout agent and settings. Both responses preserve price 42, order creation, all 18 application services and both database dependencies.
Nikola: We removed the deliberate wait, not the work needed to complete checkout. Other real work remains; this is a local seeded-fault result, not a production benchmark.
The historical opening 306.26 ms request remains the investigation exemplar. This is a separate fresh matched comparison, not two selected individual requests or an edited historical trace. Explain methodology only as far as needed to interpret the result; keep trace identity checks in preparation.
Transition: “We fixed this checkout. How do the other teams get this detail without repeating the setup?”

[Sources]
- presentation/data/resolution.json
- scripts/presentation/measure_resolution.py
- docs/customer-resolution.md
[/Sources]
-->
