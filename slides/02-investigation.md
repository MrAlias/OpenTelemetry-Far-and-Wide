---
kicker: The application
---

# 18 services. One customer request.

<ServiceTopology />

<!--
**Tyler:**

Here's an overview of where the order goes. Our application starts at Gateway, and continues to Checkout, Inventory, and then the commerce branches. Eighteen services, plus PostgreSQL and Redis. Our customer's frustration is being caused by something in this chaos.

**Nikola:**

The person placing the order doesn't care which service owns the delay. They just want their order to go through. Let's get a view of the whole request before we choose where to look.
-->

---
kicker: The starting point
clicks: 1
mediaAt: 1
---

# OBI

<OBIIntro v-if="$clicks === 0" />
<DemoClip v-else src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Actual OBI installation and readiness recording" />

<!--
**Tyler:**

To start the investigation, we'll install OpenTelemetry eBPF Instrumentation, or OBI, on our nodes. OBI instruments applications running on Linux using eBPF. It will automatically generate OpenTelemetry traces and metrics for those applications. OBI is zero-code instrumentation. No application code changes, and no application restarts are required.

**Nikola:**

That changes how quickly we can start helping. We don't have to get an instrumentation change through every service first. If you joined us in Atlanta last year, you'll remember this idea. OBI is now v1.0.0 and generally available.

[click]

**Tyler:**

Let's deploy it to the nodes. Once running, OBI discovers the services running on the node, and starts generating telemetry about the services operation and the calls between them. For the customer order request, that includes HTTP calls and the PostgreSQL and Redis traffic.

**Nikola:**

Just a single deployment. Now let's see how much of the customer's wait we can explain.
-->

---
kicker: Live demo · find the wait
clicks: 1
---

# Find the two-second wait

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI waterfall with a failed Checkout CONNECT span near two seconds" />

<!--
**Nikola:**

Here's the order the customer has been waiting for. We can follow its service calls and its PostgreSQL price query in one trace. Nobody had to edit those applications to get us this starting point.

**Tyler:**

Look how the question we are investigating changed now that we have data. We are no longer asking "Why is our application slow?". Now we can focus specifically where this particular request was slow and ask "Why is this one service slow?" Let's find out.

[click]

**Nikola:**

Look at this failed connection from Checkout. About two seconds go here. Then the price lookup succeeds and the rest of the order carries on. The request is successful, but the customer had to wait because of that failed attempt.

**Tyler:**

Our investigation question can now be even more specific. Why does Checkout try a connection that fails before it does the work that succeeds? We need to connect this call to what Checkout is doing.
-->
