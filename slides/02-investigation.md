---
kicker: The application
---

# One application. Eighteen services.

<ServiceTopology />

<p class="caption">A map tells us what can talk to what. We need to follow a request.</p>

<!--
Tyler · 40 seconds. Orient: Gateway to Checkout, Inventory and four commerce branches. A successful checkout visits all eighteen services, plus PostgreSQL and Redis. No chosen culprit.
Nikola: “Following the request gives us one shared starting point.”

[Sources]
- demo/k8s/applications.yaml
- demo/apps/README.md
- demo/scripts/check-flow.py
[/Sources]
-->

---
kicker: The starting point
clicks: 1
---

# Meet OBI

<OBIIntro v-if="$clicks === 0" />
<DemoClip v-else src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Actual OBI installation and readiness recording" />

<!--
Tyler · 70 seconds. Explain the first view before clicking: OpenTelemetry eBPF Instrumentation observes running Linux applications, using eBPF at application/network boundaries. We get traces and metrics without each team adding a library or restarting its application. Nikola: “That’s a lot of visibility before the first instrumentation ticket.” The click has a job: move from the explanation to the actual installation.

Execute live: kubectl apply -f demo/k8s/obi.yaml, then rollout status daemonset/obi in obi-system. Recording is a manual-play fallback; it has no narration and pauses when leaving this slide.

Expand OBI once: OpenTelemetry eBPF Instrumentation. It discovers the running applications and gives service/dependency observations before language-agent setup. Open a fresh request next. Source command/event logs remain in .artifacts/demo-capture.

[Sources]
- demo/k8s/obi.yaml
- https://opentelemetry.io/docs/zero-code/obi/
[/Sources]
-->

---
kicker: The observed request
---

# One request across the application

<TraceEvidence image="connected-trace.png" label="Actual OBI trace: Gateway, Checkout, Inventory and the Cart branch" />

<p class="caption">2.17 s · service calls and database work in one waterfall</p>

<!--
Nikola · 55 seconds. “The useful result is a connected trace. This is the request behind the duration we started with.”
Nikola: Emphasize the return on deploying OBI: one deployment, multiple languages and service calls, before adding any language agent. Point to the HTTP calls and the PostgreSQL price query visible in this actual waterfall.
Tyler: A connected trace is not a faster checkout; the customer is still waiting. Move from “the application is slow” toward work we can change. Point out the nesting and shared time axis. Do not explain trace-ID or parent-link verification; those are preparation checks.

[Sources]
- public/demo-capture/capture-summary.json
- presentation/data/request.json
[/Sources]
-->

---
kicker: The observed request
clicks: 1
---

# Follow the request through the map

<ServiceTopology :phase="$clicks > 0 ? 'observed' : 'plain'" />

<p class="caption">Cart branch · observed server durations</p>

<!--
Tyler · 35 seconds. Start neutral. Advance once when saying “Watch the plain topology turn into an observed request path.” The click adds the actual captured Cart branch and measured timings, not decorative motion.
Nikola: Follow Cart → Catalog → Recommendations → Promotions. This is one branch of the same request; dimmed branches are context, not a claim they were unvisited. Durations are inclusive.

[Sources]
- presentation/data/topology.json
- presentation/data/request.json
[/Sources]
-->

---
kicker: Choose the investigation
clicks: 1
---

# Find the failed connection on the request path

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI waterfall with a failed Checkout CONNECT span near two seconds" />

<p class="caption">Follow the slow failed attempt, rather than the longest parent span.</p>

<!--
Tyler · 70 seconds. Gateway’s long parent includes waiting on Checkout; Checkout includes its downstream work. The longest parent is not a root-cause argument.
Nikola: Point to the actual red CONNECT span: roughly two seconds on a failed outbound connection before the successful price query and service calls. Advance the highlight once while naming it.
Tyler: OBI has already exposed a failed dependency attempt. The next question is which method makes it, why it is still attempted and what happens afterward. The Java agent gives the calling pricing method, HTTP endpoint, SocketTimeoutException and current-store fallback. Do not reuse the old no-I/O gap explanation.

[Sources]
- public/demo-capture/obi-trace-evidence.json
- presentation/data/request.json
[/Sources]
-->
