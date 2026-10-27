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
kicker: Live demo · OBI
---

# Start with OBI

<DemoClip src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Actual OBI installation and readiness recording" />

<!--
Tyler · 45 seconds. Execute live: kubectl apply -f demo/k8s/obi.yaml, then rollout status daemonset/obi in obi-system. Recording is a manual-play fallback; it has no narration and pauses when leaving this slide.

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

<p class="caption">306.26 ms · service calls and database work in one waterfall</p>

<!--
Nikola · 55 seconds. “The useful result is a connected trace. This is the request behind the duration we started with.”
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

<p class="caption">Cart branch · observed server durations in milliseconds</p>

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

# Find the time before downstream calls

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual Checkout trace; 151.8 milliseconds before its first outbound call" />

<p class="caption">A long parent bar includes time in its children.</p>

<!--
Tyler · 80 seconds. Gateway is long because it waits for Checkout; Checkout includes its own downstream work. Do not select the longest inclusive span.
Nikola: “Look instead at the gap before Checkout makes its first downstream call.” Pause four seconds, then advance once to highlight the actual interval.
Tyler: About 151.8 ms happens before any child call begins. Downstream services cannot explain that interval. Nearly half the opening request happens before the first outbound call. This is our first discovery: investigate local Checkout work instead of blaming a dependency.

[Sources]
- public/demo-capture/baseline-timing.json
- public/demo-capture/capture-summary.json
[/Sources]
-->
