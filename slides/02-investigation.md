---
kicker: The application
---

# One application. Eighteen services.

<ServiceTopology />

<p class="caption">A map tells us what can talk to what. We need to follow a request.</p>

<!--
**Tyler → Nikola · 0:40**

- **Tyler:** **18 services**, PostgreSQL, Redis.
- **Point:** Gateway → Checkout → Inventory + four commerce branches.
- **Tyler:** Topology = possible calls; duration = slow whole request.
- **Nikola:** Different teams, one shared request to follow.
- **Next · Tyler:** Introduce OBI before deploying it.

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/applications.yaml
- demo/apps/README.md
- demo/scripts/check-flow.py
[/Sources]

</details>
-->

---
kicker: The starting point
clicks: 1
---

# Meet OBI

<OBIIntro v-if="$clicks === 0" />
<DemoClip v-else src="install-obi-edited.mp4" poster="install-obi-edited-poster.png" label="Actual OBI installation and readiness recording" />

<!--
**Tyler → Nikola · 1:10**

- **Tyler:** **OpenTelemetry eBPF Instrumentation — OBI**; short “Oh-bee.”
- **Tyler:** Observe running Linux applications/network activity; export traces + metrics.
- **Nikola:** No app libraries or restarts; visibility before the first instrumentation ticket.
- **Nikola:** Atlanta callback — last year's demo; **now v1.0 / GA**.
- **Tyler:** Supported HTTP, PostgreSQL, Redis; deploy once on the nodes.

[click] **Deploy OBI** — live terminal, or play the silent fallback.

- **Nikola → next:** One deployment, eighteen services; open a request.

<details>
<summary>Demo commands / fallback</summary>

```sh
kubectl apply -f demo/k8s/obi.yaml
kubectl rollout status daemonset/obi -n obi-system --timeout=180s
curl -fsS http://localhost:8080/checkout
```

Silent recording: manual play, native speed; use if the live demo stalls.

</details>

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/obi.yaml
- https://opentelemetry.io/docs/zero-code/obi/
[/Sources]

</details>
-->

---
kicker: The observed request
---

# One request across the application

<TraceEvidence image="connected-trace.png" label="Actual OBI trace: Gateway, Checkout, Inventory and the Cart branch" />

<p class="caption">2.17 s · service calls and database work in one waterfall</p>

<!--
**Nikola → Tyler · 0:55**

- **Nikola:** Same **2.17 s** request as the opening panel.
- **Point:** HTTP service spans + PostgreSQL price query; shared time axis.
- **Nikola:** One OBI deployment; multiple languages; **no language agents yet**.
- **Tyler:** Much more visibility for little setup; customer still waiting.
- **Next · Tyler:** Follow the observed path, then find the time we can change.

<details>
<summary>Sources</summary>

[Sources]
- public/demo-capture/capture-summary.json
- presentation/data/request.json
[/Sources]

</details>
-->

---
kicker: The observed request
clicks: 1
---

# Follow the request through the map

<ServiceTopology :phase="$clicks > 0 ? 'observed' : 'plain'" />

<p class="caption">Cart branch · observed server durations</p>

<!--
**Tyler → Nikola · 0:35**

- **Tyler:** Possible calls → calls observed in this request.

[click] **Reveal the observed path** as you name it.

- **Nikola · point:** Cart → Catalog → Recommendations → Promotions.
- **Tyler:** One branch of this request; durations include downstream work.
- **Next · Tyler:** Return to the waterfall; which span explains the wait?

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/topology.json
- presentation/data/request.json
[/Sources]

</details>
-->

---
kicker: Choose the investigation
clicks: 1
---

# Find the failed connection on the request path

<TraceEvidence image="connected-trace.png" :highlight="$clicks > 0" label="Actual OBI waterfall with a failed Checkout CONNECT span near two seconds" />

<p class="caption">Follow the slow failed attempt, rather than the longest parent span.</p>

<!--
**Tyler → Nikola → Tyler · 1:10**

- **Tyler:** Gateway includes Checkout; Checkout includes children.
- **Reminder:** Longest parent **span** ≠ cause.

[click] **Highlight the failed CONNECT span.**

- **Nikola · point:** **~2 s**, before successful product lookup and other calls.
- **Tyler:** Why attempt this connection? Which method? What fallback?
- **Next · Nikola:** Open Checkout; add language detail.

<details>
<summary>Sources</summary>

[Sources]
- public/demo-capture/obi-trace-evidence.json
- presentation/data/request.json
[/Sources]

</details>
-->
