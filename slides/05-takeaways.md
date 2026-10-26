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
Tyler · 90 seconds. We had runtime expertise, full access and control of the release. What happens before an engineer in a real organization can even begin?
Nikola: Owner discovery, scope agreement, tickets, meetings, access requests, review, release scheduling and switching away from feature work.
Tyler: One namespace enrollment can remove repeated application-team changes and keep agent/exporter settings consistent. Explain the mechanism, not an invented hours-saved figure.
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
Tyler · 95 seconds. Setup is only the first bill. Include onboarding, updates, configuration changes, turning instrumentation off and failures.
Nikola: A new compatible workload in the selected namespace inherits selection. Shared version/exporter settings can reduce copy/paste drift and repeated training, documentation and debugging. This inheritance is a benefit of the workflow, not a claim that upstream namespace opt-in lacks it.
The platform still prepares and maintains the shared path, tests compatibility and owns its blast radius. Include those costs.

[Sources]
- components/otel-injector-operator/README.md
- docs/instrumentation-savings.md
[/Sources]
-->

---
kicker: Measure the benefit
---

# Count effort and waiting separately

<table class="measurements">
  <thead><tr><th>Measure</th><th>What to count</th></tr></thead>
  <tbody>
    <tr><td>Hands-on effort</td><td>People-hours to useful coverage</td></tr>
    <tr><td>Calendar delay</td><td>Elapsed time between request and result</td></tr>
    <tr><td>Ongoing cost</td><td>Platform upkeep, runtime and telemetry</td></tr>
  </tbody>
</table>

<p class="caption">Compare the same useful coverage on both sides.</p>

<!--
Tyler · 75 seconds. Compare against a competent direct/upstream baseline, including templates and namespace opt-in. Include common preparation and maintenance, plus residual work per team.
Nikola: Person-time and elapsed delay are two clocks. Reducing one does not automatically quantify the other.
Tyler: More language detail can add runtime/export/storage cost. Engineering savings do not imply smaller telemetry bills; measure those separately. No measured ROI is claimed here.

[Sources]
- docs/instrumentation-savings.md
- https://sre.google/workbook/eliminating-toil/
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
