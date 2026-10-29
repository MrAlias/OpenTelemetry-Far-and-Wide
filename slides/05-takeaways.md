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
**Tyler**

- Owner discovery, access, tickets, meetings, review, release queues.
- Engineering effort AND time waiting between teams.
- Central ownership removes repeated coordination and context switching.
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
**Tyler**

- Compatible new services inherit the namespace choice.
- Shared agent updates, configuration, documentation and recovery.
- Runtime changes: OBI baseline where supported; agent depth depends on compatibility.
- Platform still owns testing, maintenance and rollout risk.
-->

---
kicker: Adoption across the organization
---

# Make coverage the default

<RolloutComparison mode="adoption" />

<!--
**Nikola**

- One shared rollout covers eligible services; new compatible workloads inherit it.
- Team-by-team adoption can stall or slip as services change.
- Illustrative trajectories, not measured adoption rates or rollout durations.
-->

---
kicker: The cost of repeated setup and upkeep
---

# The cost of team-by-team ownership

<RolloutComparison mode="cost" />

<p class="caption">1,000 services · engineering time valued at $100/hour</p>

<!--
**Tyler**

- Hypothetical scenario: setup plus monthly agent updates over two years.
- Shared setup and upkeep once per rollout domain, instead of per service owner.
- Capacity freed, not guaranteed cash; include compatibility, hardening and support.
- Same supported-runtime mix as the demo; adoption delays are not priced.
-->

---
kicker: Make the next investigation easier
---

# Less waiting. More services ready.

<CustomerResult compact />

<div class="closing-link">Demo and source · github.com/MrAlias/OpenTelemetry-Far-and-Wide</div>

<!--
**Tyler**

- OBI found the failed call; Java detail tied it to pricing.
- Code fix improved checkout; instrumentation enabled the investigation.
- One namespace equips the next team without another setup project.
- RIO demonstrates the idea; we want an upstream home, with the path still open.
-->
