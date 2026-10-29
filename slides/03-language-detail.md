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
**Tyler**

- Agent startup, service identity, exporter.
- Explicitly include PricingEngine.calculate; business methods need configuration.
- Zero code still requires runtime knowledge and deployment work.
-->

---
kicker: Live demo · Java agent
---

# Roll Checkout with the Java agent

<DemoClip src="install-java-agent-edited.mp4" poster="install-java-agent-edited-poster.png" label="Actual Java agent deployment patch, rollout and startup log" />

<!--
**Tyler**

- Application image unchanged; only instrumentation added.
- Agent, settings, rollout — even with expertise and full access.
- Zero code hasn’t removed the release calendar.
-->

---
kicker: The useful result
---

# A failed attempt before a working fallback

<TimeoutEvidence />

<!--
**Tyler**

- PricingEngine.calculate contains the failed HTTP call.
- `error.type`: `java.net.SocketTimeoutException`.
- `exception.message`: `Connect timed out`.
- Successful price lookup follows the timeout.
-->

---
kicker: The cause
---

# Stop calling the retired backend

<DemoClip src="edit-pricing-source.mp4" poster="edit-pricing-before.png" label="Actual Java source edit in Vim: remove the retired-backend HTTP attempt and retain orders.currentPrice()" />

<!--
**Tyler**

- Retired backend attempted on every checkout.
- Remove that attempt; retain orders.currentPrice().
- Bring the owning team a PR: customer impact, trace, proposed fix.
-->

---
kicker: Live demo · application fix
---

# Deploy the pricing fix

<DemoClip src="fix-pricing-edited.mp4" poster="fix-pricing-edited-poster.png" label="Actual Checkout fix deployment and successful rollout" />

<!--
**Tyler**

- Application code changes; Java agent and exporter stay the same.
- A ready rollout doesn’t establish the customer result.
-->

---
kicker: Back to the customer
---

# The next checkout skips the failed call

<TraceEvidence image="fixed-request-trace.png" label="Actual post-fix Grafana waterfall: current product-price lookup retained, failed legacy call removed, full checkout completes" />

<p class="caption">The failed call is gone. The successful checkout path remains.</p>

<!--
**Tyler**

- Failed legacy call gone; successful price query remains.
- Inventory, commerce calls and order write still complete.
- The code change removed the wait for the retired backend.
-->

---
kicker: The repeated-request result
---

# The improvement holds across requests

<CustomerResult />

<!--
**Tyler**

- Same instrumentation and successful work before and after.
- Pricing still performs a real database query.
- Matched warmed requests; local demo, not a production benchmark.
-->
