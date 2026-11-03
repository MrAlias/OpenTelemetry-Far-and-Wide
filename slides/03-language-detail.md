---
kicker: Add useful detail
clicks: 1
mediaAt: 1
---

# Inside Checkout

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

<!--
**Tyler:**

We can inspect the source here. Pricing runs before Inventory. We'll use OpenTelemetry's Java agent to add detail around that method and see the library calls inside it. The agent loads when Java starts, so we don't have to add instrumentation code to the method.

[click]

**Nikola:**

We do still have to get the agent into the workload, tell Java to load it, and set up where the data goes. Those are the steps required, I need to understand this service, and actually having enough information to do it.
-->

---
kicker: Live demo · Java agent
evidence: true
---

# Roll Checkout with the Java agent

<DemoClip src="install-java-agent-edited.mp4" poster="install-java-agent-edited-poster.png" label="Actual Java agent deployment patch, rollout and startup log" />

<!--
**Tyler:**

Here's the deployment change. Same application image. Supply the agent, set the service name and exporter, select the pricing method, and roll Checkout. Let's see whether that work answers our question.

**Nikola:**

Keep those steps in mind. We made this happen for one service we know. We'll come back to what happens when the other teams need the same thing.
-->

---
kicker: The useful result
---

# The failed call timed out

<TimeoutEvidence />

<!--
**Tyler:**

Open PricingEngine.calculate. There's the failed HTTP call, followed by the successful product-price lookup. The Java detail puts the wait inside the pricing method, and shows the fallback that lets the order finish.

**Nikola:**

And here's why we can call it a timeout. The error type is SocketTimeoutException. The exception event says, "Connect timed out". Checkout spends two seconds trying to connect, then finds the price another way. The customer gets an order, with two seconds of unnecessary waiting attached.

**Tyler:**

Now we have something better than, Checkout is slow. We have the call, the reason it failed, and the path that worked. Let's find out why this instance is still trying that old address.
-->

---
kicker: The cause
---

# A retired endpoint, still configured

<ConfigEvidence />

<!--
**Tyler:**

There it is: LEGACY_PRICING_URL, in Checkout's resource attributes. Its value matches the failing call. This instance is still configured to try a retired backend before it uses the working product store. An old setting is adding a wait to every order.

**Nikola:**

Think about the conversation we can have with the owning team now. Customers are losing two seconds here. This connection times out. Here's a configuration PR that removes the unused endpoint. The instrumentation gave us enough context to help with a fix, instead of just sending another team a slow-service alert.
-->

---
kicker: Live demo · application fix
evidence: true
---

# Remove the setting. Roll the same image.

<DemoClip src="fix-pricing-edited.mp4" poster="fix-pricing-edited-poster.png" label="Actual removal of LEGACY_PRICING_URL, followed by Checkout rollout with the same image and instrumentation" />

<!--
**Tyler:**

Let's make that change. Remove LEGACY_PRICING_URL from the Deployment and roll Checkout. Same application image, same Java agent, same exporter. We don't need an application rebuild to stop calling the retired backend.

**Nikola:**

The rollout is ready. Let's go back to the customer. What does the next order look like?
-->

---
kicker: Back to the customer
evidence: true
---

# The next checkout skips the failed call

<DemoClip src="fixed-request-detail.mp4" poster="fixed-request-trace.png" label="Actual post-fix Grafana waterfall: failed legacy call gone, product lookup and complete checkout path retained" />

<!--
**Tyler:**

Here's the new trace. The product-price query is still there. The failed legacy call is gone. Pricing can get on with finding the price, without waiting for that old connection to time out first.

**Nikola:**

If we follow the request through Inventory, the commerce branches, and the order write. We can see that the customer gets a faster checkout because we're no longer waiting for a backend that isn't there. Nothing else changed.

**Tyler:**

That's the moment we wanted. The same checkout has a shorter path through it, and we can show exactly why. Let's see whether that improvement holds across more requests.
-->

---
kicker: The repeated-request result
---

# The wait is gone

<CustomerResult />

<!--
**Tyler:**

Across the matched requests, checkout goes from just over two seconds to about a hundred and eighty-five milliseconds. That's the wait we started with, gone from the customer's experience. The chart summarizes the change we just followed in the waterfall.

**Nikola:**

That summary supports the trace we just saw, this was quite useful. Now, how do we make the same diagnostic detail available to the other teams?
-->
