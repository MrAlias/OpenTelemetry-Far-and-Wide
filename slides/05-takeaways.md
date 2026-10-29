---
kicker: What the shared workflow saves
---

# The work around a deployment adds up

<div class="payoff">One shared path.<br>Fewer repeated handoffs.</div>

<div class="clocks">
  <section><h2>People doing the work</h2><p>Find an owner. Get access.<br>Configure, review and deploy.</p></section>
  <section><h2>Time between the steps</h2><p>Tickets, meetings, release queues.<br>Context lost while waiting.</p></section>
</div>

<!--
**Tyler → Nikola · 0:55**

- **Tyler:** We had expertise, full access, release control. Other teams may wait.
- **Nikola:** Owner discovery, scope, tickets, meetings, access, review, release queues.
- **Tyler · distinguish:** People doing work vs **elapsed time between handoffs**.
- **Nikola:** Less context switching; fewer repeated arrangements.
- **Next · Tyler:** Benefits continue after initial installation.

<details>
<summary>Sources</summary>

[Sources]
- docs/instrumentation-savings.md
- https://sre.google/workbook/eliminating-toil/
[/Sources]

</details>
-->

---
kicker: After day one
---

# Reuse the workflow

<dl class="lifecycle">
  <dt>New service</dt><dd>Inherit the namespace selection</dd>
  <dt>Agent update</dt><dd>Use the shared rollout path</dd>
  <dt>Configuration</dt><dd>Reduce drift and repeated rework</dd>
  <dt>Recovery</dt><dd>Use a tested path</dd>
</dl>

<p class="caption">The platform maintains compatibility, rollout and recovery.</p>

<!--
**Tyler → Nikola → Tyler · 0:50**

- **Tyler:** New services, agent updates, config changes, disabling instrumentation.
- **Nikola:** Compatible workloads inherit policy; updates, docs, recovery share one path.
- **Nikola:** Runtime changes? Keep OBI's supported-traffic baseline; agent depth still depends on runtime support.
- **Tyler:** Less drift and repeated debugging; **platform still owns maintenance + compatibility**.
- **Next · Tyler:** Price repeated setup and monthly upkeep.

<details>
<summary>Sources</summary>

[Sources]
- components/otel-injector-operator/README.md
- docs/instrumentation-savings.md
[/Sources]

</details>
-->

---
kicker: An illustrative first year · 18 services
---

# Put a price on the repetition

<SavingsExample mode="demo" />

<p class="savings-context">13 remaining eligible services · $100 per person-hour · hypothetical inputs</p>
<p class="savings-context">One namespace setup · 13 updates/month → 1 · no investigation-time credit</p>

<!--
**Tyler → Nikola · 1:10**

- **Tyler:** Hypothetical capacity, **$100/person-hour**; distributed owners vs **centralized RIO + Injector**.
- **Nikola · setup:** 13 × 2.5 h = **32.5 h** vs **1.5 h once/namespace**, including 30 min OBI.
- **Tyler · monthly:** 13 × 12 = **156 updates** vs **12**; 45 min each → **117 h vs 9 h**.
- **Nikola:** Equivalent investigations; **no investigation-time credit**.
- **Tyler · land:** 31 + 108 = **139 h / $13,900 year one**; **$10,800/year upkeep saving**.
- **Next · Tyler:** Capacity, not guaranteed cash; apply assumptions to larger fleets.

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/savings-assumptions.json
- presentation/savings-model.js
- docs/instrumentation-savings.md
- https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm
- https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm
- https://sre.google/workbook/eliminating-toil/
[/Sources]

</details>
-->

---
kicker: The same assumptions · larger fleets
---

# Repetition changes the economics

<SavingsExample mode="fleet" />

<p class="savings-context">Illustrative USD capacity saved · $100 per person-hour</p>
<p class="savings-context">12 agent releases/year · shared setup and updates once per rollout domain</p>

<!--
**Tyler → Nikola → Tyler · 0:40**

- **Tyler · point:** 100 services ≈ **$85k**; 500 ≈ **$440k**; 1,000 ≈ **$882k** in year one.
- **Nikola:** Same supported-runtime mix; shared setup + monthly updates **once per rollout domain**.
- **Tyler:** Scenarios, not scaling law; use your own hours, domains, exceptions.
- **Remember:** Already centralized? Equivalent work → **zero additional saving**; include hardening/support.
- **Next · Tyler:** Return to the customer and the next team.

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/savings-assumptions.json
- presentation/savings-model.js
- public/presentation/savings.html
- docs/instrumentation-savings.md
[/Sources]

</details>
-->

---
kicker: Make the next investigation easier
---

# Less waiting. More services ready.

<CustomerResult compact />

<div class="closing-link">Demo and source · github.com/MrAlias/OpenTelemetry-Far-and-Wide</div>

<!--
**Tyler → Nikola · 0:50 · Questions next**

- **Tyler:** Waiting customer → OBI failed connection → Java pricing/fallback → code fix → fresh trace.
- **Point:** Measured checkout **2.21 s → 220 ms**.
- **Nikola:** One namespace; **14 agents + 4 services with OBI**; next team starts ready.
- **Tyler:** Faster checkout + shared investigation capability.
- **Nikola:** “Find the wait. Fix the cause. Make the next investigation easier.”
- **Do:** Invite questions; keep outcomes + repository visible. **3 min Q&A; 1 min flex.**

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/resolution.json
- docs/customer-resolution.md
- docs/talk-brief.md
- docs/fleet-demo-handoff.md
- docs/instrumentation-savings.md
[/Sources]

</details>
-->
