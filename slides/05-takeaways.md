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
kicker: An illustrative first year · 18 services
---

# Put a price on the repetition

<SavingsExample mode="demo" />

<p class="savings-context">13 remaining eligible services · $100 per person-hour · hypothetical inputs</p>
<p class="savings-context">One namespace setup · 13 updates/month → 1 · no investigation-time credit</p>

<!--
**Tyler**

- Assumptions: $100/hour, 2.5 hours/service setup, 45 minutes/update.
- Central setup once: 1 hour controller/policy + 30 minutes OBI.
- Monthly updates: thirteen owners versus one; no investigation-time saving.
- Engineering capacity, not guaranteed cash savings.
-->

---
kicker: The same assumptions · larger fleets
---

# Repetition changes the economics

<SavingsExample mode="fleet" />

<p class="savings-context">Illustrative USD capacity saved · $100 per person-hour</p>
<p class="savings-context">12 agent releases/year · shared setup and updates once per rollout domain</p>

<!--
**Tyler**

- Same runtime mix; shared work once per rollout domain.
- Use your own effort, compatibility and support costs.
- Already centralized? Equivalent work means zero additional saving.
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
-->
