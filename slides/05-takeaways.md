---
kicker: After day one
---

# Maintain once. Roll out together.

<OwnershipFlow mode="maintenance" />

<!--
**Tyler:**

An agent update next month shouldn't mean another setup project for thirteen teams. The platform can update the shared bundle and use the same rollout path. Eligible new services inherit the namespace policy.

**Nikola:**

Compatibility tests, exceptions and recovery remain real work. We centralize ownership of that shared path. The saving is avoiding the routine setup and updates being arranged independently over and over.
-->

---
kicker: Adoption across the organization
---

# Make coverage the default

<RolloutComparison mode="adoption" />

<!--
**Nikola:**

This is a sketch of language-agent adoption across eligible services. With team-by-team work, one team finishes; another has a release freeze. Add a service or rewrite one in another language, and the gap can open again.

**Tyler:**

The centralized path covers the eligible services in one rollout, before that first team-by-team increment. New compatible services inherit it. We still maintain the shared path, but routine enrollment doesn't wait for a separate project in every team.
-->

---
kicker: The cost of repeated setup and upkeep
titleHidden: true
---

# The cost of repeated setup and upkeep

<RolloutComparison mode="cost" />

<p class="chart-context">18 services · monthly updates</p>

<!--
**Tyler:**

Here's an example for this same eighteen-service application: the thirteen remaining agent setups and two years of monthly updates. Each step is another release to handle. Distributed owners repeat that work; the centralized path shares the setup and update rollouts.

**Nikola:**

The modeled difference is two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. Time for the next customer problem.

**Tyler:**

These are assumed setup and rollout hours, not measured cash savings or a complete platform budget. Put your own support and testing costs into the worksheet. We haven't priced the calendar time waiting for other teams.
-->

---
kicker: Make the next investigation easier
---

# OpenTelemetry. Ready to install.

<CustomerResult compact />

<div class="closing-resources">
  <a href="https://github.com/MrAlias/OpenTelemetry-Far-and-Wide"><img src="/presentation/qr-demo-source.svg" alt="QR code for the demo and presentation source" /><span><strong>Demo + slides</strong></span></a>
  <a href="https://github.com/otelx/rio"><img src="/presentation/qr-rio.svg" alt="QR code for the RIO repository" /><span><strong>RIO</strong></span></a>
</div>

<!--
**Tyler:**

We started with a customer waiting for an order. OBI showed the failed connection. Java detail named the pricing operation. We found the old endpoint setting, removed it, and opened a new trace to see the wait disappear.

**Nikola:**

Then one namespace choice added language detail across the supported fleet. The next team shouldn't have to repeat our setup before investigating. RIO demonstrates the shared workflow we'd like to bring upstream.

**Tyler:**

OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service or across a cluster, then use to find what's keeping a customer waiting—and do something about it.

**Nikola:**

Find the wait. Fix the cause. Make the next investigation easier. Thank you.
-->
