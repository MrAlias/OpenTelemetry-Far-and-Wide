---
kicker: The application
---

# 18 services. One customer request.

<ServiceTopology />

<!--
**Tyler:**

The request enters through Gateway, reaches Checkout and Inventory, then fans out through the commerce services. Eighteen applications, plus PostgreSQL and Redis. We know the route; we don't yet know which part is making the customer wait.

**Nikola:**

And the customer shouldn't need to know. Let's see the request before we choose a service to investigate.
-->

---
kicker: The starting point
clicks: 1
mediaAt: 1
---

# OBI

<OBIIntro v-if="$clicks === 0" />
<DemoClip v-else src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Recorded OBI v1.0.0 deployment and readiness; normal playback speed" />

<!--
**Tyler:**

We'll start with OpenTelemetry eBPF Instrumentation, or OBI. Deploy it on the Linux nodes and it generates OpenTelemetry traces and metrics for supported applications. No application code changes and no application restarts. That's a pretty good way to meet eighteen services you haven't instrumented yet.

**Nikola:**

If you joined us in Atlanta last year, you'll recognize the idea. OBI is now version one and generally available. The previous talk is linked here. Today, we're using that broad view as the starting point for an investigation.

[click]

**Tyler:**

Let's deploy OBI and send an order. The application keeps running while we add visibility.

**Nikola:**

One deployment on the nodes. Let's open the request we just sent.
-->

---
kicker: Find the wait
clicks: 1
---

# Find the two-second wait

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI request waterfall; highlight the failed Checkout connection" />

<!--
**Nikola:**

Here's that order in Grafana. We can follow the service calls and database work without changing those applications.

**Tyler:**

Now look inside Checkout. Where does most of the customer's wait go?

[click]

**Nikola:**

This failed connection takes about two seconds. The order still completes, but the customer waits for a failed attempt first.

**Tyler:**

Why is Checkout making that call? OBI has shown us where to look. Let's add the Java agent to connect the failed call to the work inside the service.
-->
