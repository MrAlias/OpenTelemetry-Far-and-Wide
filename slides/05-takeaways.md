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
Tyler · 55 seconds. We had runtime expertise, full access and control of the release. What happens before an engineer in a real organization can even begin?
Nikola: Owner discovery, scope agreement, tickets, meetings, access requests, review, release scheduling and switching away from feature work.
Tyler: One namespace enrollment can remove repeated application-team changes and keep agent/exporter settings consistent. Establish the mechanism before the explicitly hypothetical dollar model.
Nikola: Less repeated arrangement of routine work, and less waiting between people.

[Sources]
- docs/instrumentation-savings.md
- https://sre.google/workbook/eliminating-toil/
[/Sources]
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
Tyler · 50 seconds. Setup is only the first bill. Include onboarding, updates, configuration changes, turning instrumentation off and failures.
Nikola: A new compatible workload in the selected namespace inherits selection. Shared version/exporter settings can reduce copy/paste drift and repeated training, documentation and debugging. This inheritance is a benefit of the workflow, not a claim that upstream namespace opt-in lacks it.
The platform still prepares and maintains the shared path, tests compatibility and owns its blast radius. Include those costs.

[Sources]
- components/otel-injector-operator/README.md
- docs/instrumentation-savings.md
[/Sources]
-->

---
kicker: An illustrative first year · 18 services
---

# Put a price on the repetition

<SavingsExample mode="demo" />

<p class="savings-context">13 remaining eligible services · $100 per person-hour · hypothetical inputs</p>
<p class="savings-context">One namespace setup · 13 updates/month → 1 · no investigation-time credit</p>

<!--
Tyler · 70 seconds. Explicit hypothetical annual labor model. Compare distributed responsibility for instrumentation with centralized RIO + Injector, not “Before” versus “With tools.” One common pilot is excluded, leaving 13 compatible services.
Nikola: Distributed initial setup = 13 × 2.5 = 32.5 hours. Centralized setup = 1 hour controller/policy + 0.5 hour OBI deployment = 1.5 hours once for the namespace. No residual per-service setup charge. The 30-minute OBI budget is presenter-supplied; other durations are authored assumptions.
Tyler: One agent release each month. Distributed 13 × 12 = 156 update operations; centralized 1 × 12 = 12. At an assumed 0.75 person-hour each, distributed annual upkeep is 117 hours and centralized upkeep is 9. Recurring saving 108 hours = $10,800.
Nikola: Equivalent installed telemetry implies equal investigation capability; no investigation credit. Initial OBI coverage is counted once, not per incident. No claim of telemetry-bill savings from enabling/disabling collection.
Tyler: Initial saving 31 hours plus upkeep saving 108 = 139 hours × $100 = $13,900 in year one. These are capacity values, not measured results or guaranteed spending reductions. Additional compatibility, service exceptions, development/hardening and support must be estimated explicitly. Shared qualification common to both workflows cancels. Already centralized? Use that capable baseline, which can yield zero saving.

[Sources]
- presentation/data/savings-assumptions.json
- presentation/savings-model.js
- docs/instrumentation-savings.md
- https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm
- https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm
- https://sre.google/workbook/eliminating-toil/
[/Sources]
-->

---
kicker: The same assumptions · larger fleets
---

# Repetition changes the economics

<SavingsExample mode="fleet" />

<p class="savings-context">Illustrative USD capacity saved · $100 per person-hour</p>
<p class="savings-context">12 agent releases/year · shared setup and updates once per rollout domain</p>

<!--
Tyler · 40 seconds. The same hypothetical inputs produce first-year values of $85,300 / $439,800 / $881,900 for 100 / 500 / 1,000 services. Recurring values $66,600 / $343,800 / $689,400. The demo is $13,900 first year, $10,800 recurring.
Nikola: Preserve the 14/18 supported-runtime mix, rounded down, and exclude one pilot per fleet. Independent rollout domains are explicit scenario inputs: 1 / 2 / 5 / 10. Each receives one shared setup and twelve shared update operations. No central work is charged per routine service. Default service exceptions are zero; add known extra compatibility/exception work rather than inventing a blanket charge.
Tyler: These are scenarios, not observed scaling laws. Lower distributed effort, existing centralization or extra platform work can shrink or reverse the result. The editable calculator includes those cases. No incident-response, waiting-time, revenue or telemetry-bill saving is priced.

[Sources]
- presentation/data/savings-assumptions.json
- presentation/savings-model.js
- public/presentation/savings.html
- docs/instrumentation-savings.md
[/Sources]
-->

---
kicker: Make the next investigation easier
---

# Less waiting. More services ready.

<CustomerResult compact />

<div class="closing-link">Demo and source · github.com/MrAlias/OpenTelemetry-Far-and-Wide</div>

<!--
Tyler · 50 seconds. We began with a customer waiting. OBI exposed the two-second failed connection; the Java agent named the pricing method; removing the obsolete backend attempt improved the measured request; use the current medians shown on the slide. Point back to the opening customer problem.
Nikola: One namespace choice carried setup across supported services using the custom controller and Injector.
Tyler: The customer gets a faster checkout; the next team gets useful diagnostic detail without repeating the setup project. The dollar figures describe hypothetical engineering capacity, distinct from the measured request result. Invite questions with both outcomes visible.

Live content totals 21 minutes, with one minute flex and three minutes questions in the 25-minute slot. RIO is available at github.com/otelx/rio; the talk repository retains the tested bundled prototype and demo.

[Sources]
- presentation/data/resolution.json
- docs/customer-resolution.md
- docs/talk-brief.md
- docs/fleet-demo-handoff.md
- docs/instrumentation-savings.md
[/Sources]
-->
