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

Think about your last investigation that needed more instrumentation. How long was it between, I know what I need to see, and actually being able to see it?

**Nikola:**

There's the owner to find, access to arrange, a review, and a release. People are fitting that work around something else. While those conversations happen, the customer still has the slow checkout.

**Tyler:**

That's the work this namespace choice can remove from the next investigation. Agree on the shared setup once, and maintain it together. Each service doesn't need to reopen the whole conversation.

**Nikola:**

Count both the people doing that work and the time they spend waiting. We usually remember the few minutes spent typing the change. The rest is where a small instrumentation task can turn into a long interruption.
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

Now an agent release arrives next month. Do all thirteen service owners need another task and another rollout? And what happens when a new service appears?

**Nikola:**

The shared approach gives us a place to handle that work together. Compatible new services inherit the policy. Agent updates use the shared rollout path. Settings and recovery instructions have one place to improve.

**Tyler:**

A service can still change runtimes, or need an exception. OBI can keep the baseline for supported traffic, while the available language detail depends on the runtime. Someone still has to look after those cases.

**Nikola:**

Yes. The platform owns compatibility checks, updates, and recovery. We include that work in the cost. The saving comes from avoiding the same job being repeated across teams.
-->

---
kicker: Adoption across the organization
---

# Make coverage the default

<RolloutComparison mode="adoption" />

<!--
**Nikola:**

This is a sketch of what that can mean for coverage. One team gets instrumentation done. Another has a release freeze. A third is busy with something else. Months can pass with the application only partly covered.

**Tyler:**

And the application doesn't wait for the project to finish. Add a service, or rewrite one from Java to Python, and coverage can fall again. The finish line moves while the teams are still catching up.

**Nikola:**

With the namespace policy, one rollout covers the eligible services in scope, and compatible new workloads inherit it. We still test and maintain that shared path. But each team doesn't have to find room for another onboarding project before its service is covered.
-->

---
kicker: The cost of repeated setup and upkeep
---

# The cost of team-by-team ownership

<RolloutComparison mode="cost" />

<p class="caption">18-service demo · setup + monthly updates · $100/hour</p>

<!--
**Tyler:**

Here's what repeating the work can cost in our eighteen-service example. After Checkout, thirteen services still need language instrumentation. These steps cover their setup and two years of monthly agent updates. Every jump is another release to handle.

**Nikola:**

On the distributed path, the service owners arrange that work separately. On the centralized path, we set up the namespace once and share each update. That lower line still includes maintaining the shared approach.

**Tyler:**

The difference is two hundred and forty-seven engineering hours over two years. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. That's time people could spend on the next customer problem, rather than repeating this setup and upkeep.

**Nikola:**

Those are assumed hours for this example, not measured cash savings. Put in your own setup and support costs. We haven't put a dollar value on the calendar time spent waiting for another team's release.
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

Remember the customer waiting at the start? OBI helped us find the failed connection. The Java agent showed the pricing call and its fallback. The resource attributes exposed the retired endpoint setting. Remove that setting, roll the same image, and the next trace shows the wait has gone.

**Nikola:**

Then one namespace choice made language detail available across the supported services. RIO demonstrates the shared workflow we'd like to bring upstream. The next team should be able to open a trace and start investigating, without repeating our setup first.

**Tyler:**

OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service, or across a cluster, and use to find what's keeping a customer waiting. That's what makes all this setup worthwhile: we can get from their problem to something we can fix.

**Nikola:**

Find the wait, fix the cause, and make the next investigation easier. Thank you. Let's take your questions.
-->
