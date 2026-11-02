---
kicker: The application
---

# 18 services. One customer request.

<ServiceTopology />

<!--
**Tyler:**

This is where the order goes. Gateway, Checkout, Inventory, then the commerce branches. Eighteen services, plus PostgreSQL and Redis. Somewhere along that route, we're losing the customer's time.

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

We'll use OpenTelemetry eBPF Instrumentation, or OBI. It watches supported application traffic from Linux using eBPF, then gives us OpenTelemetry traces and metrics. We can start with the applications that are already running. No application code changes, and no application restarts.

**Nikola:**

That changes how quickly we can start helping. We don't have to get an instrumentation change through every service first. If you joined us in Atlanta last year, you'll remember this idea. OBI is now version one and generally available.

[click]

**Tyler:**

Let's deploy it on the nodes. It discovers the running applications and follows supported calls between them. For this order, that includes HTTP calls and the PostgreSQL and Redis traffic.

**Nikola:**

One deployment. Now let's see how much of the customer's wait we can explain.
-->

---
kicker: The observed request
---

# Follow one request

<TraceEvidence image="connected-trace.png" label="Actual OBI trace: Gateway, Checkout, Inventory and the Cart branch" />

<!--
**Nikola:**

Here's the order we've been waiting for. We can follow its service calls and its PostgreSQL price query in one trace. Nobody had to edit those applications to get us this starting point.

**Tyler:**

And look how the question changes. We came in knowing that checkout felt slow. Now we can follow where this particular request spent its time. Let's find the wait we can do something about.
-->

---
kicker: The observed request
clicks: 1
---

# The path it actually took

<ServiceTopology :phase="$clicks > 0 ? 'observed' : 'plain'" />

<!--
[click]

**Tyler:**

These highlighted calls actually happened in our request. Follow this branch from Cart through Catalog, Recommendations, and Promotions. Now we can see the route the order took, instead of relying on the architecture diagram.

**Nikola:**

That's useful when the first team you call says, we don't call that service. Maybe not directly. The request still went there, and now both teams can look at the same evidence.
-->

---
kicker: Choose the investigation
clicks: 1
---

# Where is the wait?

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI waterfall with a failed Checkout CONNECT span near two seconds" />

<!--
**Tyler:**

Gateway has a long span. So does Checkout. But both include time spent waiting on other services. If we just hand the longest span to a team, we're handing them the same mystery we started with.

[click]

**Nikola:**

Look at this failed connection from Checkout. About two seconds go here. Then the price lookup succeeds and the rest of the order carries on. The request is successful, but the customer has already paid for that failed attempt with their time.

**Tyler:**

That's our lead. Why does Checkout try a connection that fails before it does the work that succeeds? We need to connect this call to what Checkout is doing in its code.

**Nikola:**

Let's open Checkout. We have a specific question for it now.
-->
