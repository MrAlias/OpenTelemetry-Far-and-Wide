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
Tyler · 45 seconds. We have source access: PricingEngine.calculate attempts the retired backend and then reads the current price store before Inventory. The method-inclusion setting explicitly names that method; the agent does not magically infer business meaning. Library instrumentation adds Hibernate/JDBC detail.
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

# A failed attempt before a working fallback

<TraceEvidence image="java-detail-poster.png" label="Actual Checkout Java trace: failed HTTP call, timeout, and successful product-price query" />

<p class="caption">A failed legacy call comes before the successful price lookup.</p>

<!--
Tyler · 60 seconds. Open PricingEngine.calculate in the actual fresh trace. The failed HTTP client span consumes roughly the configured 150 ms connection timeout; inspect its SocketTimeoutException. The successful Hibernate/JDBC product-price query follows inside the same method.
Nikola: The fallback succeeds, so the customer sees a successful but delayed checkout. The order insert and remaining dependencies still run. OBI located the service; the Java agent explains the failure and fallback.

[Sources]
- public/demo-capture/java-trace-evidence.json
- demo/apps/checkout/baseline/PricingEngine.java
[/Sources]
-->

---
kicker: The cause
---

# Stop calling the retired backend

<div class="code-focus">

```java
// Remove: legacy HTTP attempt (excerpt)
connection.setConnectTimeout(150);
connection.getResponseCode();

// Keep: authoritative product-price lookup
return orders.currentPrice();
```

</div>

<p class="lead">Go straight to the working price store.</p>
<p class="fix-caption">Source excerpts · remove the legacy attempt and its error handling.</p>

<!--
Tyler · 35 seconds. The seeded failure is a real HTTP connection attempt to the retired backend, bounded by a 150 ms connect timeout. If it fails, the baseline queries the authoritative PostgreSQL product store. The fixed version uses that same store directly. These are literal source excerpts; remove the whole legacy try/catch/finally block, retaining the current-store lookup.
Nikola: Instrumentation enables collaboration as well as diagnosis. When access and ownership permit, bring the owning team a PR: “Your service is having customer impact. Here is the trace, here is the failing dependency, and here is a fix grounded in that observed request.” Review the change with the owners; don’t just hand them a vague latency ticket.

[Sources]
- demo/apps/checkout/baseline/PricingEngine.java
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
The standard demo build now uses the timeout baseline. The historical proof harness retains its original fixture. Live reset uses the newly built far-wide-demo-checkout:local; the recording baseline is tagged :timeout.

[Sources]
- demo/k8s/checkout-pricing-fixed.patch.yaml
- demo/apps/checkout/Dockerfile
- docs/customer-resolution.md
[/Sources]
-->

---
kicker: Back to the customer
---

# The next checkout skips the failed call

<TraceEvidence image="fixed-request-trace.png" label="Actual post-fix Grafana waterfall: current product-price lookup retained, failed legacy call removed, full checkout completes" />

<p class="caption">The failed call is gone. The successful checkout path remains.</p>

<!--
Tyler · 50 seconds. This is the FIRST visual after deploying the application fix: the real post-fix waterfall. Expand Checkout → PricingEngine.calculate. Point to the successful product-price query and the absence of the failed legacy HTTP span; follow Inventory and the commerce calls. Use fixed-request-detail.mp4 or the live backend to scroll to the order insert and retained downstream work.
Nikola: The useful work remains. The customer stops paying for the obsolete backend attempt. Say what the trace demonstrates before introducing any aggregate metric. No abstract timing graphic is a substitute for this evidence.

[Sources]
- public/demo-capture/fixed-request-evidence.json
- public/demo-capture/fixed-request-trace.png
- presentation/data/resolution.json
[/Sources]
-->

---
kicker: The repeated-request result
---

# The improvement holds across requests

<CustomerResult />

<!--
Tyler · 35 seconds. After the actual waterfall, show the measured request medians from presentation/data/resolution.json. Same instrumentation, same successful application flow; the obsolete backend attempt is the application change. Pricing retains real PostgreSQL work, so do not promise a zero-duration method.
Nikola: This summary supports the trace, rather than replacing it. Local demo timings are not a production benchmark. Transition: how do other teams get this detail without repeating setup?

[Sources]
- presentation/data/resolution.json
- scripts/presentation/measure_resolution.py
- docs/customer-resolution.md
[/Sources]
-->
