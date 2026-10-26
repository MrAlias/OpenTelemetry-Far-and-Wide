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
Tyler · 60 seconds. We had runtime expertise, full access and control of the release. What happens before an engineer in a real organization can even begin?
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
Tyler · 60 seconds. Setup is only the first bill. Include onboarding, updates, configuration changes, turning instrumentation off and failures.
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
<p class="savings-context">Shared setup, upkeep and exceptions included. Extra costs estimated separately.</p>

<!--
Tyler · 80 seconds. Compare complete work ledgers for equivalent outcomes. These are authored estimates, not measured demo results, industry averages or guaranteed cash savings. The best existing templates and upstream namespace opt-in belong in the baseline.
Nikola: 14 compatible services minus the common pilot leaves 13. Initial setup: baseline 13 × 2.5 = 32.5 hours; shared 13 × 0.5 + 2 hours deploying/configuring the shared tools = 8.5. Initial saving 24 hours. The two shared hours are a declared work estimate, not an extra adoption surcharge; production prototype development is outside this adoption scenario.
Tyler: Four updates per year: baseline 13 × 4 × 0.75 = 39 hours. Shared rollout/compatibility work 1 domain × 4 × 1 = 4 hours, plus one exception service per update × 4 × 0.5 = 2 hours. Shared annual upkeep totals 6 hours; centralizing it saves 33 hours. Do not also charge every routine service for these same shared updates.
Nikola: Twelve qualifying investigations: 3 people × 0.5 hours × 12 = 18 baseline hours, versus 1 × 0.5 × 12 = 6 with OBI. Count only missing-visibility cases; equally useful existing traces imply zero credit. Investigation work excludes setup coordination and repair time.
Tyler: Total baseline 32.5 + 39 + 18 = 89.5; shared 8.5 + 6 + 6 = 20.5. Difference 69 hours × $100 = $6,900 first year. Recurring upkeep plus investigation saving is 33 + 12 = 45 hours, or $4,500. Shared work and exceptions have already been counted once; there is no additional generic surcharge.
Rate context: BLS May 2025 median developer wage $135,980 ÷ 2,080 ÷ broad private-industry wage share 0.70 ≈ $93.39; $100 is a rounded planning input, not a BLS rate. All workflow times/frequencies are assumptions. Additional prototype development, support and telemetry require their own estimates. Capacity becomes cash savings only if spending falls. Calendar waiting and outage revenue are unpriced.

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
<p class="savings-context">Shared updates per rollout group; exceptions counted separately. Setup savings happen once.</p>

<!--
Tyler · 60 seconds. Read rounded figures naturally: about $38,000 for 100 services, $193,000 for 500 and $386,000 for 1,000 in the hypothetical first year.
Nikola: Preserve the demo's 14/18 runtime mix, rounded down, and exclude one common pilot per fleet. Rollout domains are 1/2/5/10; exception services per update are 1/4/20/40; qualifying investigations per year are 12/24/60/120. These are explicit independent scenario inputs, not averages or an observed scaling law.
Shared initial deployment/policy is two hours per domain plus half an hour residual per service. Upkeep is four annual changes × (one shared hour per domain + half an hour per exception service). Baseline initial setup is 2.5 hours per service; each update 0.75 hours per service. This directly captures centralization rather than multiplying shared routine maintenance across services.
Recurring values are $4,500 / $23,600 / $116,100 / $232,800 with a stable fleet. Initial work disappears from both sides; upkeep remains in both ledgers. Already centralized? Enter that capable baseline, including its shared work. Identical ledgers and useful visibility must produce zero benefit.
Tyler: With no qualifying OBI investigations, the demo still saves $5,700 from setup and upkeep. Another 80 hours of initial prototype development would turn its $6,900 into −$1,100; the model accepts real additional work without inventing a universal surcharge. Extra non-labor costs are separate. These are capacity values, not guaranteed spending reductions.

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

# OpenTelemetry Far and Wide

<div class="closing-lines">Find where to look.<br>Add the detail.<br><span class="accent">Instrument the namespace.</span></div>

<div class="closing-link">Demo and source · github.com/MrAlias/OpenTelemetry-Far-and-Wide</div>

<!--
Tyler · 55 seconds. We began with a slow request, without selecting a culprit. OBI located the unexplained local interval; Java zero-code instrumentation named it.
Nikola: One namespace choice carried setup across supported services using the custom controller and Injector.
Tyler: Measure what your next team can avoid. Invite questions while leaving the central message visible.

Live content totals 21 minutes, with one minute flex and three minutes questions in the 25-minute slot. The source URL is this talk repository, not an invented official release of the custom component.

[Sources]
- docs/talk-brief.md
- docs/fleet-demo-handoff.md
- docs/instrumentation-savings.md
[/Sources]
-->
