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
**Tyler:**

Think about the direct setup we watched. We knew the runtime, had access, and controlled the release. How much happens before someone in a real organization can even begin?

**Nikola:**

Find an owner. Explain the request. A ticket, a meeting, access, review, and a release slot. Then somebody switches away from their feature work.

**Tyler:**

One namespace choice can remove repeated enrollment changes and keep shared settings consistent. The saving is more than typing fewer commands.

**Nikola:**

It is fewer people arranging the same work. Count their active effort separately from the time spent waiting.
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
**Tyler:**

And setup is only the first bill. A new service arrives. An agent needs an update. A team needs to turn instrumentation off.

**Nikola:**

Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve. A runtime change doesn't automatically mean a new onboarding project: OBI can keep the baseline for supported traffic, while language-level detail depends on the runtime.

**Tyler:**

That can reduce drift and repeated troubleshooting. But the platform does not maintain itself.

**Nikola:**

Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too.
-->

---
kicker: Adoption across the organization
---

# Make coverage the default

<RolloutComparison mode="adoption" />

<!--
**Nikola:**

This is a sketch of adoption, not measured rollout data. Team-by-team ownership advances in steps: one service, then another. Busy teams create a long tail that may never reach full coverage.

**Tyler:**

And the finish line moves. New services arrive. Someone rewrites a service from Java to Python, and the old instrumentation setup no longer fits. Coverage can drop while other teams are still catching up.

**Nikola:**

Central policy makes coverage the default. One rollout reaches the eligible services in scope, and new compatible workloads inherit it. The platform still tests and maintains that shared path.
-->

---
kicker: The cost of repeated setup and upkeep
---

# The cost of team-by-team ownership

<RolloutComparison mode="cost" />

<p class="caption">18-service demo · setup + monthly updates · $100/hour</p>

<!--
**Tyler:**

Let's keep the cost comparison in this demo. Eighteen services, thirteen of them still needing language instrumentation after our first example. These steps show setup and two years of monthly agent updates. Each jump is another release.

**Nikola:**

With distributed ownership, each service owner arranges the work. With centralized control, we set up the namespace once and share each update. Both lines include upkeep; the centralized path still costs engineering time.

**Tyler:**

Over two years, that frees two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars. From setup and monthly updates, in the same small application we've been investigating.

**Nikola:**

These are assumed person-hours valued at a hundred dollars an hour, not a measured cash saving. Include your own compatibility and support costs. We haven't priced the calendar time spent waiting for other teams.
-->

---
kicker: Make the next investigation easier
---

# OpenTelemetry. Ready to install.

<CustomerResult compact />

<div class="closing-resources">
  <a href="https://github.com/MrAlias/OpenTelemetry-Far-and-Wide"><img src="/presentation/qr-demo-source.svg" alt="QR code for the demo and presentation source" /><span><strong>Demo + slides</strong><small>MrAlias /<br>OpenTelemetry-Far-and-Wide</small></span></a>
  <a href="https://github.com/otelx/rio"><img src="/presentation/qr-rio.svg" alt="QR code for the RIO repository" /><span><strong>RIO</strong><small>otelx/rio</small></span></a>
</div>

<!--
**Tyler:**

We started with a customer waiting. OBI showed the failed connection. The Java agent tied it to pricing, and the resource attributes exposed a stale endpoint setting. We removed that setting, rolled the same image, and checked the next request's trace.

**Nikola:**

Then one namespace choice carried language instrumentation across the supported services. RIO demonstrates that shared workflow; we want an upstream home for the idea. The next team should start with useful detail, instead of another setup project.

**Tyler:**

OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install: on a service, across a cluster. From a customer waiting to a cause you can act on. Less setup. More answers.

**Nikola:**

Find the wait. Fix the cause. Make the next investigation easier. Thank you. Let's take your questions.
-->
