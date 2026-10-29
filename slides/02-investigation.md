---
kicker: The application
---

# One application. Eighteen services.

<ServiceTopology />

<p class="caption">A map tells us what can talk to what. We need to follow a request.</p>

<!--
**Tyler**

- 18 services; PostgreSQL and Redis.
- Gateway → Checkout → Inventory and four commerce branches.
- Topology shows possible calls; tracing shows what happened.
-->

---
kicker: The starting point
clicks: 1
---

# Meet OBI

<OBIIntro v-if="$clicks === 0" />
<DemoClip v-else src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Actual OBI installation and readiness recording" />

<!--
**Tyler**

- OpenTelemetry eBPF Instrumentation: running Linux applications, traces and metrics.
- No code changes, libraries or application restarts.
- HTTP, PostgreSQL, Redis — one deployment.
- Atlanta last year; now v1.0 / GA.
-->

---
kicker: The observed request
---

# One request across the application

<TraceEvidence image="connected-trace.png" label="Actual OBI trace: Gateway, Checkout, Inventory and the Cart branch" />

<p class="caption">2.17 s · service calls and database work in one waterfall</p>

<!--
**Nikola**

- One OBI deployment; no language agents yet.
- HTTP calls and the price query, across languages.
- We can follow the request. The customer is still waiting.
-->

---
kicker: The observed request
clicks: 1
---

# Follow the request through the map

<ServiceTopology :phase="$clicks > 0 ? 'observed' : 'plain'" />

<p class="caption">Cart branch · observed server durations</p>

<!--
**Tyler**

- Cart branch of the same request.
- Observed calls, not just possible connections.
- Durations include downstream work.
-->

---
kicker: Choose the investigation
clicks: 1
---

# Find the failed connection on the request path

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI waterfall with a failed Checkout CONNECT span near two seconds" />

<p class="caption">Follow the slow failed attempt, rather than the longest parent span.</p>

<!--
**Tyler**

- Parent spans include their children’s time.
- Failed CONNECT happens before the successful price query.
- Which method makes this call? Why? What happens after failure?
-->
