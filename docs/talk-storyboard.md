# Presentation scene plan

The editable visual review is [storyboard.html](../public/storyboard.html). The 25-minute live slot allocates 21 minutes to content, one minute to flex and three minutes to questions. The synthetic narrated review follows natural speech pace and may be shorter.

Follow the customer's wait through a justified service choice, a named local method, an actual application fix and a measured return to the request. Then resolve the repetition problem: give the other teams the same investigative detail through one namespace selection. Keep the upstream opt-in comparison, custom controller/Injector, fleet detail, lifecycle and dollar content. Close with both the customer outcome and readiness for the next service.

The historical opening request and the fresh matched before/after experiment are different observations. The local seeded-fault latency result is measured; the engineering-capacity dollar model remains hypothetical. Details and evidence: [customer-resolution.md](customer-resolution.md).

## 01 · OpenTelemetry Far and Wide

Open a customer problem and promise a measured resolution, then make that investigation capability repeatable across the namespace.

Live budget: 60 seconds.

**Tyler:** You know the application is slow. The hard part is knowing where to look.

**Tyler:** Today we'll follow this request with OBI, find the work behind the wait, and fix it. Then we'll come back to the customer's request and check the result. We'll also stop repeating the instrumentation setup across the other services by leveraging the OpenTelemetry Injector and its Kubernetes Operator.

**Nikola:** I'm Nikola. Tyler gets the first service. I'll keep an eye on the rest.

**Tyler:** I'm Tyler. That sounds suspiciously like you've given me the homework. Let's get straight to the system.

## 02 · One application, many places to look

Orient in the actual application without selecting a culprit.

Live budget: 40 seconds.

**Tyler:** Here is our checkout application: eighteen services, with PostgreSQL and Redis. The Gateway hands the request to Checkout, which calls Inventory and four commerce branches. The map shows what can talk to what; the duration tells us the whole request is slow.

**Nikola:** Every team can have a different definition of healthy. Following the request gives us one shared starting point.

## 03 · Start with OBI

Show the real OBI installation, then move to its result.

Live budget: 45 seconds.

**Tyler:** First, OpenTelemetry eBPF Instrumentation, or OBI. We deploy it and let it discover the running applications.

**Nikola:** That gives us service and dependency observations without setting up a language SDK in each application. We can start investigating while the applications keep running.

**Tyler:** OBI is ready. Let's open a checkout request.

## 04 · One request across the application

Give the connected-trace statement its own actual waterfall exemplar.

Live budget: 55 seconds.

**Nikola:** The useful result is a connected trace. This is the request behind the duration we started with.

**Tyler:** Now we can see service calls, database work, and how their timings fit together. But a connected trace is not a faster checkout. The customer is still waiting. We need to find the part we can change.

## 05 · Follow the cart branch of this request

Transform orientation into an observed path, using the captured request.

Live budget: 35 seconds.

**Tyler:** Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went.

**Nikola:** Here we're following the Cart branch through Catalog, Recommendations, and Promotions. This is one branch of the same request moving through the system.

## 06 · Find the time before the downstream calls

Earn Checkout selection from the measured 151.8 ms local interval, not inclusive duration.

Live budget: 80 seconds.

**Tyler:** Start with the waterfall. The Gateway span is long, but almost all of that time is spent waiting for Checkout. Checkout's total also contains its downstream calls.

**Nikola:** So choosing the longest bar would send us back to the beginning. Look instead at the gap before Checkout makes its first downstream call.

**Tyler:** That interval is about a hundred and fifty milliseconds. The downstream services haven't started yet, so they can't explain it. Nearly half of this request is spent before that first call. That is our first useful discovery: look inside Checkout, not at its dependencies.

**Nikola:** Now we have a specific question for language-level detail: what is Checkout doing during that wait?

## 07 · Add Java zero-code instrumentation

Show actual source-informed configuration and the real direct-agent installation.

Live budget: 120 seconds.

**Tyler:** We have source access here. The pricing calculation happens before the Inventory call. We'll use the Java agent to time that method and expose the library work around it.

**Nikola:** This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes.

**Tyler:** Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout.

**Nikola:** Zero code is useful. It hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change.

## 08 · The missing interval has a name

Show the actual 150.4 ms method span and Hibernate/JDBC observations.

Live budget: 60 seconds.

**Tyler:** Here's a fresh request with the Java agent running. The missing interval now has a name: PricingEngine.calculate.

**Nikola:** There it is: about a hundred and fifty milliseconds. Below it, Hibernate and JDBC show the product lookup, the order insert, and the transaction commit.

**Tyler:** OBI got us to the right service. The language agent named the work inside it. But naming the wait does not remove it. Let's open that pricing method.

## 09 · There's our 150 milliseconds

Reveal the exact seeded wait, show its removal without changing the price, and record deployment of the real application fix.

Live budget: 90 seconds.

**Tyler:** There is our hundred and fifty milliseconds. This demo deliberately puts a wait inside the pricing method. It is local work, before the first downstream call, exactly where the trace sent us.

**Nikola:** So the fix is small: remove that wait and keep the same price. The instrumentation did not make the application faster. It showed us where to act.

**Tyler:** Here we deploy the fixed application image. The Java agent, its settings, and the rest of the request path stay the same.

**Nikola:** The deployment is ready. A completed rollout is not the customer result. Let's send the request again.

## 10 · The customer gets the time back

Deliver the measured customer payoff before raising the fleet-scale setup challenge; distinguish fresh matched samples from the historical opening exemplar.

Live budget: 60 seconds.

**Tyler:** Back to the customer request. In a fresh matched run, the median goes from about three hundred and sixty milliseconds to two hundred and twenty-six. The pricing method goes from a hundred and fifty milliseconds to less than one.

**Nikola:** Same price. An order still gets created, and the request still visits all eighteen services. We removed the deliberate wait, not the work needed to finish checkout.

**Tyler:** These are medians of thirty warmed requests on each version, with the same instrumentation. It is a measured demo result, not a production benchmark.

**Nikola:** Now that is a useful trace. It helped us change the customer experience. The next question is how to make this kind of investigation available to the rest of the teams.

## 11 · One fixed. Thirteen to equip.

Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.

Live budget: 45 seconds.

**Nikola:** We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?

**Tyler:** In this demo, thirteen more services use runtimes in the Injector payload. The Go services keep their OBI coverage. Our next step is to share the setup across those thirteen.

**Nikola:** And share the routine work around it. Not every team has our access, our runtime knowledge, or an empty release queue.

## 12 · Injection still needs a selection

Credit upstream injection and namespace opt-in, then set up the custom component’s combined namespace selection, runtime handling and rollout value.

Live budget: 45 seconds.

**Tyler:** The upstream OpenTelemetry Operator can supply the agent. You opt in using language-specific annotations, on workloads or namespaces. That already removes much of the agent setup.

**Nikola:** For this mixed-language application, we want one shared choice: instrument the namespace. Then let the system choose the agents and manage the rollout.

## 13 · Let the namespace be the selection

Install the merged custom component as a distinct step after upstream opt-in; earn the namespace-wide payoff.

Live budget: 60 seconds.

**Tyler:** This demo uses the custom namespace-driven controller and the OpenTelemetry Injector. The controller selects workloads and manages their rollout. The Injector detects the supported runtime and loads its language agent.

**Nikola:** Here we install the controller once. The agent payload, exporter, and exclusions are shared settings. Next comes the application choice: instrument this namespace.

## 14 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 105 seconds.

**Nikola:** Here is the whole selection rule: instrument demo-apps. No list of service names. No language-specific annotations on each application.

**Tyler:** Apply that rule, and the controller rolls the selected workloads. The Injector supplies their agents. The shared rule replaces thirteen deployment edits and manual restarts.

**Nikola:** Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. One namespace choice carries the setup across the application.

## 15 · Open language detail in more services

Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.

Live budget: 60 seconds.

**Tyler:** Back in the application view, we're looking at a new request through the instrumented fleet. We still have the system view, and now we can open language-level observations in more services.

**Nikola:** Let's follow Catalog. These are the Java agent's database spans from that service. The same enrollment also covers the Node, Python, Ruby, and dot net services in this application.

**Tyler:** The namespace rule got us here without a separate instrumentation change from each application team. Checkout keeps its fix. Now the other teams have the language detail ready for their next investigation too.

## 16 · The work around a deployment adds up

Connect the demonstrated workflow to people, coordination and waiting.

Live budget: 55 seconds.

**Tyler:** Think about the direct setup we watched. We knew the runtime, had access, and controlled the release. How much happens before someone in a real organization can even begin?

**Nikola:** Find an owner. Explain the request. A ticket, a meeting, access, review, and a release slot. Then somebody switches away from their feature work.

**Tyler:** One namespace choice can remove repeated enrollment changes and keep shared settings consistent. The saving is more than typing fewer commands.

**Nikola:** It is fewer people arranging the same work. Count their active effort separately from the time spent waiting.

## 17 · Reuse the workflow after day one

Cover onboarding, updates, consistency, recovery, training and shared upkeep.

Live budget: 50 seconds.

**Tyler:** And setup is only the first bill. A new service arrives. An agent needs an update. A team needs to turn instrumentation off.

**Nikola:** Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve.

**Tyler:** That can reduce drift and repeated troubleshooting. But the platform does not maintain itself.

**Nikola:** Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too.

## 18 · Put a price on the repetition

Compare baseline and shared work directly; show centralized updates once per rollout domain, service exceptions separately, and conditional OBI investigation savings.

Live budget: 80 seconds.

**Tyler:** Let us compare the actual work in each approach. This is a hypothetical year for our eighteen-service system, at a hundred dollars per person-hour.

**Nikola:** Thirteen compatible services remain after our pilot. Initial setup takes thirty-two and a half person-hours across those teams. With the shared tools, we allow two hours for deployment and policy, plus half an hour per service. Eight and a half hours altogether.

**Tyler:** Upkeep is where centralization keeps paying back. Four updates take thirty-nine hours when repeated across those services. Four shared updates take four hours. Allow another two hours for service exceptions: six hours instead of thirty-nine. That saves thirty-three hours every year.

**Nikola:** Then twelve investigations where OBI adds missing visibility: eighteen person-hours becomes six. Twelve more hours saved. Already have equally useful traces? That part is zero.

**Tyler:** Add the three rows: eighty-nine and a half hours before, twenty and a half with the tools. Sixty-nine hours saved, worth sixty-nine hundred dollars of engineering capacity. Central setup and upkeep are already included.

**Nikola:** Every time estimate is an assumption to replace with your own. Prototype development, extra telemetry, and support need separate estimates.

## 19 · Repetition changes the economics

Scale the explicit before/with-tools ledgers using declared rollout groups, exceptions and qualifying investigations; distinguish first-year and recurring capacity.

Live budget: 60 seconds.

**Tyler:** Keep the same runtime mix, and allow more rollout groups and service exceptions as the fleet grows. At a hundred services, the first-year value is about thirty-eight thousand dollars. At five hundred services, about a hundred and ninety-three thousand dollars. At a thousand services, about three hundred and eighty-six thousand dollars.

**Nikola:** The following-year figures are lower because initial setup savings happen once. Centralized upkeep keeps saving work: updates happen per rollout group, plus the service exceptions we explicitly allow for.

**Tyler:** These are replaceable assumptions, not average customer results. If existing namespace templates already centralize your updates, compare against that workflow. There may be little extra work left to save.

**Nikola:** And capacity is not automatically cash in the bank. We have not priced outages, waiting time, or a smaller telemetry bill.

## 20 · Less waiting. More services ready.

Close the customer-latency loop and the shared-workflow loop together; leave both outcomes visible during questions.

Live budget: 55 seconds.

**Tyler:** We started with a customer waiting for checkout. OBI showed where the time went. The Java agent named the pricing method. We removed the deliberate wait and came back to measure the request.

**Nikola:** Then one namespace choice carried language instrumentation across the supported services. The next team can start with useful detail instead of starting another setup project.

**Tyler:** The customer gets a faster checkout. The teams get a shared way to investigate the next slow request. That is what the traces and the automation were for.

**Nikola:** Find the wait. Fix the cause. Make the next investigation easier. Let's take your questions.
