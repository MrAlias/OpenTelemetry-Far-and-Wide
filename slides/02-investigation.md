---
kicker: The application
---

# One application. Eighteen services.

<ServiceTopology />

<p class="caption">A map tells us what can talk to what. We need to follow a request.</p>

<!--
**Tyler:**

Here is our checkout application: eighteen services, with PostgreSQL and Redis. The Gateway hands the request to Checkout, which calls Inventory and four commerce branches. The map shows what can talk to what; the duration tells us the whole request is slow.

**Nikola:**

Every team can have a different definition of healthy. Following the request gives us one shared starting point.
-->

---
kicker: The starting point
clicks: 1
---

# Meet OBI

<OBIIntro v-if="$clicks === 0" />
<DemoClip v-else src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Actual OBI installation and readiness recording" />

<!--
**Tyler:**

First, OpenTelemetry eBPF Instrumentation, or OBI. It's a zero-code way to observe running Linux applications. It uses eBPF to watch application and network activity, then exports OpenTelemetry traces and metrics.

**Nikola:**

We're getting a starting point across the application without asking each team to add a library or restart its service. That's a lot of visibility before the first instrumentation ticket. We showed this idea last year in Atlanta. Now OBI is version one and generally available.

**Tyler:**

And this is more than a service map. OBI follows supported calls across service boundaries, including our HTTP, PostgreSQL, and Redis traffic. Let's deploy it on the nodes and let it discover the running applications.

**Nikola:**

One deployment. Eighteen services to investigate. Much better odds than guessing which team to call. Let's open a request.
-->

---
kicker: The observed request
---

# One request across the application

<TraceEvidence image="connected-trace.png" label="Actual OBI trace: Gateway, Checkout, Inventory and the Cart branch" />

<p class="caption">Service calls and database work in one waterfall</p>

<!--
**Nikola:**

Look what that one OBI deployment gave us. This is the slow request behind the opening number, followed across the application. Here are the HTTP calls and the PostgreSQL price query, before we've added a language agent to any service.

**Tyler:**

Different languages, one request we can follow. We've gone from a customer waiting for seconds to a specific set of service calls and durations. That's a huge head start for such a small setup. The customer is still waiting, though. Let's find the part we can change.
-->

---
kicker: The observed request
clicks: 1
---

# Follow the request through the map

<ServiceTopology :phase="$clicks > 0 ? 'observed' : 'plain'" />

<p class="caption">Cart branch · observed server durations</p>

<!--
**Tyler:**

Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went.

**Nikola:**

Here we're following the Cart branch through Catalog, Recommendations, and Promotions. This is one branch of the same request moving through the system.
-->

---
kicker: Choose the investigation
clicks: 1
---

# Find the failed connection on the request path

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI waterfall with a failed Checkout CONNECT span near two seconds" />

<p class="caption">Follow the slow failed attempt, rather than the longest parent span.</p>

<!--
**Tyler:**

Start with the waterfall. Gateway's long span includes its wait for Checkout, and Checkout's span includes its downstream work. The longest parent span doesn't tell us what to fix.

**Nikola:**

Look at this failed connection from Checkout instead. It consumes about two seconds before the successful product lookup and the other service calls.

**Tyler:**

Now we have somewhere specific to investigate: why is Checkout spending time on a connection that fails? OBI has exposed the failed attempt; language detail can connect it to the method and fallback in our code.

**Nikola:**

Let's open Checkout and follow that connection.
-->
