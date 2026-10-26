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
<p class="savings-context">After platform labor; before extra telemetry, support or prototype hardening.</p>

<!--
Tyler · 80 seconds. This is a theoretical capacity model, not measured savings or an average customer result. Use the competent direct/upstream workflow, including templates and namespace opt-in, as the baseline.
Nikola: Of 18 services, 14 support the language payload; exclude the common Checkout pilot, leaving 13. Assume 2.5 vs 0.5 person-hours for initial team setup, coordination, review, rollout and checks: 2 hours saved each. Four later changes at 0.75 vs 0.25 hours save 2 more hours each. 13 × (2 + 4 × 0.5) = 52 hours.
Tyler: Only count investigations where OBI gives useful visibility the baseline lacks. Twelve such cases, with three people for 30 minutes vs one person for 30 minutes, save 12 person-hours. If equally useful tracing already exists, enter zero: OBI does not uniquely own connected tracing. These events are investigation work, not the enrollment meetings counted above, and not repair time or all incidents.
Nikola: Subtract 24 hours adopting the shared tools and 24 hours annual upkeep: 52 + 12 − 48 = 16 hours. At the illustrative $100 rate, that is $1,600 of capacity. The central budget is incremental to common prerequisites, and is an assumption for adopting maintained tooling. Additional prototype hardening, support and telemetry must be deducted separately.
Rate context: BLS May 2025 median developer wage $135,980 ÷ 2,080 ÷ broad private-industry wage share 0.70 ≈ $93.39; $100 is our rounded planning input, not a BLS rate. Benefits ratio is not developer-specific; do not add paid leave twice. Capacity becomes cash savings only if spending falls. Calendar waiting and outage revenue are unpriced.

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

<p class="savings-context">Illustrative USD capacity after platform labor · $100 per person-hour</p>
<p class="savings-context">More rollout domains and upkeep at scale. Initial setup savings happen once.</p>

<!--
Tyler · 60 seconds. Read rounded figures naturally: $27,000 for 100 services, $153,000 for 500 and $310,000 for 1,000 in the illustrative first year.
Nikola: This preserves the demo's 14/18 supported-runtime mix, rounded down, and excludes one common pilot per fleet. Larger fleets use explicit assumptions of 2/5/10 rollout domains and 24/60/120 qualifying investigations, respectively. These counts are not observed company averages or incident frequencies inferred from service count.
Central costs rise by 4 setup hours plus 4 annual maintenance hours per additional domain. Runtime exceptions retain per-service effort and unsupported services receive no injector saving. The same four annual changes apply to every remaining eligible service.
The recurring column excludes initial per-service setup savings AND initial platform adoption. It assumes a stable fleet, the same recurring changes and qualifying investigations, and ongoing platform upkeep. It does not repeat first-year savings or assume continuous fleet growth.
Tyler: Already have effective namespace templates or equally useful traces? Lower the corresponding savings inputs, potentially to zero. A negative result is valid. The demo falls to −$2,300 if only one hour per eligible service is avoided across the whole first year; the base assumes four. An extra 40 hours of hardening costs $4,000 at this rate. Do not hide those effects.
Nikola: These are capacity values, not promised spending reductions. Telemetry, support, prototype hardening, waiting and outage value have the same scope as the preceding slide. The calculator accepts extra costs; compare equivalent useful coverage.

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
