---
kicker: One service, directly
---

# Add Java detail to Checkout

<div class="code-focus">

```yaml
JAVA_TOOL_OPTIONS: >-
  -javaagent:/java-agent/opentelemetry-javaagent.jar
OTEL_SERVICE_NAME: checkout
OTEL_EXPORTER_OTLP_ENDPOINT: >-
  http://lgtm.observability.svc.cluster.local:4318
```

</div>

<!--
**Tyler:**

OBI found the failed connection. To explain what Checkout is doing, we'll add the Java agent: load it at startup, set the service name and choose the exporter. We also configure a span around the pricing method. The agent supplies the HTTP and database detail; it doesn't invent a span for every method.

**Nikola:**

We know this service and have access to its deployment. Even then, somebody has to arrange the agent and startup settings. Java loads the agent when it starts, so this requires a rollout.
-->

---
kicker: Add language detail
evidence: true
---

# Roll Checkout with the Java agent

<DemoClip src="install-java-agent-edited.mp4" poster="install-java-agent-edited-poster.png" label="Actual direct Java agent patch and Checkout rollout; application image retained" />

<!--
**Tyler:**

Let's apply the prepared patch. The payload image is already available; this step changes the Deployment, not the application image.

**Nikola:**

Now we send fresh traffic. Adding instrumentation hasn't fixed the delay. It should explain it.
-->

---
kicker: Explain the wait
---

# The failed call timed out

<TimeoutEvidence />

<!--
**Tyler:**

The new trace has PricingEngine.calculate, the method we configured. Inside it: the failed HTTP call, then the successful product-price query. We can now name the operation and see its fallback.

**Nikola:**

The span says SocketTimeoutException. Its exception event says Connect timed out. Two seconds trying the wrong address, then the fallback gets the price.

**Tyler:**

So the order works. We just make the customer wait for a backend that isn't answering. Let's look at the setting behind that address.
-->

---
kicker: The cause
---

# A retired endpoint, still configured

<ConfigEvidence />

<!--
**Tyler:**

We expose this deployment setting as a resource attribute: LEGACY_PRICING_URL. Its value matches the failed call. We know this backend was retired; this instance still tries it before the working product store.

**Nikola:**

Now we can help the owning team with more than a slow-service alert. Customers are losing two seconds here; here's the trace and a configuration PR that removes the old setting. We can bring them a fix based on what the application is actually doing.
-->

---
kicker: Resolve the customer problem
evidence: true
---

# Remove the setting. Roll the same image.

<DemoClip src="fix-pricing-edited.mp4" poster="fix-pricing-edited-poster.png" label="Actual removal of LEGACY_PRICING_URL and rollout of the same image" />

<!--
**Tyler:**

Let's remove the setting and roll Checkout. Same application image, same Java agent, same exporter. No rebuild.

**Nikola:**

The rollout is ready. Back to the customer: let's send a new order and open its trace.
-->

---
kicker: Back to the customer
---

# The next checkout skips the failed call

<DemoClip class="trace-clip" src="fixed-request-detail.mp4" poster="fixed-request-trace.png" label="Actual new post-fix request waterfall: failed attempt absent, successful price lookup and order path retained" />

<!--
**Tyler:**

Here's the new waterfall. The failed legacy call is gone. The product-price query is still there, and the order continues through the application.

**Nikola:**

That's better. The customer gets their order without waiting for a backend we've already turned off.

**Tyler:**

We didn't make the timeout less visible. We removed the unnecessary call. Let's compare the request-duration metrics too.
-->

---
kicker: The repeated-request result
---

# The wait is gone

<CustomerResult />

<!--
**Tyler:**

The new trace shows the failed call is gone. These captured Grafana windows show the repeated-request result: average checkout dropping from about two-point-two seconds to a hundred and sixty-five milliseconds.

**Nikola:**

And we did it by changing configuration, not rebuilding Checkout.
-->
