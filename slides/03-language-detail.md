---
kicker: Add useful detail
clicks: 1
---

# Give the local work a name

<div v-if="$clicks === 0" class="code-focus">

```yaml
JAVA_TOOL_OPTIONS: >-
  -javaagent:/java-agent/opentelemetry-javaagent.jar
OTEL_SERVICE_NAME: checkout
OTEL_INSTRUMENTATION_METHODS_INCLUDE: >-
  demo.checkout.PricingEngine[calculate]
```

</div>

<DemoClip v-else src="inspect-java-setup-edited.mp4" poster="inspect-java-setup-edited-poster.png" label="Actual inspection of the Java-agent setup and method configuration" />

<p v-if="$clicks === 0" class="lead">The agent supplies instrumentation.<br>We still supply the setup.</p>

<!--
**Tyler:**

We have source access here. Pricing runs before Inventory. We'll use the Java agent to time that method and expose the library calls inside it.

**Nikola:**

This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes.
-->

---
kicker: Live demo · Java agent
---

# Roll Checkout with the Java agent

<DemoClip src="install-java-agent-edited.mp4" poster="install-java-agent-edited-poster.png" label="Actual Java agent deployment patch, rollout and startup log" />

<!--
**Tyler:**

Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout.

**Nikola:**

Zero code is useful, but hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change.
-->

---
kicker: The useful result
---

# A failed attempt before a working fallback

<TimeoutEvidence />

<!--
**Tyler:**

Here's a fresh request with the Java agent. Open PricingEngine.calculate. The long interval contains a failed HTTP connection, then a successful product-price lookup.

**Nikola:**

Open the failed HTTP span. Its error type is Java's SocketTimeoutException. The exception event says, Connect timed out. That is a connection timeout. The product-price lookup after it succeeds, so Checkout completes, but the customer pays for the failed attempt first.

**Tyler:**

OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now let's find out why this instance is still calling that old address.
-->

---
kicker: The cause
---

# The retired endpoint is still configured

<ConfigEvidence image="pricing-config-attribute.png" />

<!--
**Tyler:**

Checkout's resource attributes show LEGACY_PRICING_URL. Its value matches the failing URL. This instance is still configured to try a retired backend before it uses the working product store.

**Nikola:**

Instrumentation didn't remove that setting. It gave us the evidence to act. If we can collaborate with the owning team, we can bring a configuration pull request: here is the customer impact, here is the timeout, and here is the stale setting to remove. We can fix this without rebuilding the application.
-->

---
kicker: Live demo · application fix
---

# Remove the setting. Roll the same image.

<DemoClip src="fix-pricing-edited.mp4" poster="fix-pricing-edited-poster.png" label="Actual removal of LEGACY_PRICING_URL, followed by Checkout rollout with the same image and instrumentation" />

<!--
**Tyler:**

Remove LEGACY_PRICING_URL from the Deployment. Kubernetes rolls Checkout with the same application image, Java agent, and exporter settings. Only the legacy endpoint setting changes.

**Nikola:**

The rollout is ready. Let's send another customer request and look at its trace.
-->

---
kicker: Back to the customer
---

# The next checkout skips the failed call

<DemoClip src="fixed-request-detail.mp4" poster="fixed-request-trace.png" label="Actual post-fix Grafana waterfall: failed legacy call gone, product lookup and complete checkout path retained" />

<!--
**Tyler:**

Here is the new request's waterfall. Expand Checkout and PricingEngine.calculate. The product-price query is still here. The failed legacy call is gone, and the rest of the request starts sooner.

**Nikola:**

Follow it through Inventory, the commerce branches, and the order write. We kept the useful work. The customer gets a faster checkout because we're no longer waiting for a backend that isn't there.

**Tyler:**

This is the payoff: a customer symptom, an observed cause, one configuration change, and a fresh trace showing the failed call has disappeared.
-->

---
kicker: The repeated-request result
---

# The improvement holds across requests

<CustomerResult />

<!--
**Tyler:**

Across matched requests, checkout falls from seconds to a fraction of a second. Pricing no longer spends two seconds waiting for the retired backend. The graph summarizes the same change we just followed in the waterfall: keep the useful work, remove the unnecessary wait.

**Nikola:**

That summary supports the trace we just saw. It is a local demo comparison, not a production benchmark. Next, how do we make the same diagnostic detail available to the other teams?
-->
