# Presentation scene plan

The editable visual review is [storyboard.html](../public/storyboard.html). The 25-minute live slot allocates 21 minutes to content, one minute to flex and three minutes to questions. The synthetic narrated review follows natural speech pace and may be shorter.

The final arc distinguishes upstream language-specific opt-in, which also supports namespaces, from this custom controller/Injector integration: choose a namespace, detect supported runtimes and manage rollout. Exporter settings, payload and exclusions are prepared once; the captured selection adds no positive service list or per-service annotations.

## 01 · OpenTelemetry Far and Wide

Make the slow request visible before introducing the investigation.

Live budget: 60 seconds.

**Tyler:** You know the application is slow. The hard part is knowing where to look.

**Tyler:** Today we'll follow a request across our application with OBI, find where the time goes, and add detail where we need it. Then we'll show how to stop repeating the setup for the rest of the services by leveraging the OpenTelemetry Injector and its Kubernetes Operator.

**Nikola:** I'm Nikola. Tyler gets the first service. I'll keep an eye on the rest.

**Tyler:** I'm Tyler. That sounds suspiciously like you've given me the homework. Let's get straight to the system.

## 02 · One application, many places to look

Orient in the actual application without selecting a culprit.

Live budget: 50 seconds.

**Tyler:** Here is our checkout application: eighteen services, with PostgreSQL and Redis. The Gateway hands the request to Checkout, which calls Inventory and four commerce branches. The map shows what can talk to what; the duration tells us the whole request is slow.

**Nikola:** Every team can have a different definition of healthy. Following the request gives us one shared starting point.

## 03 · Start with OBI

Show the real OBI installation, then move to its result.

Live budget: 60 seconds.

**Tyler:** First, OpenTelemetry eBPF Instrumentation, or OBI. We deploy it and let it discover the running applications.

**Nikola:** That gives us service and dependency observations without setting up a language SDK in each application. We can start investigating while the applications keep running.

**Tyler:** OBI is ready. Let's open a checkout request.

## 04 · One request across the application

Give the connected-trace statement its own actual waterfall exemplar.

Live budget: 55 seconds.

**Nikola:** The useful result is a connected trace. This is the request behind the duration we started with.

**Tyler:** Now we can see service calls, database work, and how their timings fit together. We can move from the application is slow to a place worth investigating.

## 05 · Follow the cart branch of this request

Transform orientation into an observed path, using the captured request.

Live budget: 45 seconds.

**Tyler:** Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went.

**Nikola:** Here we're following the Cart branch through Catalog, Recommendations, and Promotions. This is one branch of the same request moving through the system.

## 06 · Find the time before the downstream calls

Earn Checkout selection from the measured 151.8 ms local interval, not inclusive duration.

Live budget: 95 seconds.

**Tyler:** Start with the waterfall. The Gateway span is long, but almost all of that time is spent waiting for Checkout. Checkout's total also contains its downstream calls.

**Nikola:** So choosing the longest bar would send us back to the beginning. Look instead at the gap before Checkout makes its first downstream call.

**Tyler:** That interval is about a hundred and fifty milliseconds. The downstream services haven't started yet, so they can't explain it. This is the part we want to understand inside Checkout.

**Nikola:** Now we've got a reason to add language-level detail.

## 07 · Add Java zero-code instrumentation

Show actual source-informed configuration and the real direct-agent installation.

Live budget: 150 seconds.

**Tyler:** We have source access here. The pricing calculation happens before the Inventory call. We'll use the Java agent to time that method and expose the library work around it.

**Nikola:** This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes.

**Tyler:** Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout.

**Nikola:** Zero code is useful. It hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change.

## 08 · The missing interval has a name

Show the actual 150.4 ms method span and Hibernate/JDBC observations.

Live budget: 75 seconds.

**Tyler:** Here's a fresh request with the Java agent running. The missing interval now has a name: PricingEngine.calculate.

**Nikola:** There it is: about a hundred and fifty milliseconds. Below it, Hibernate and JDBC show the product lookup, the order insert, and the transaction commit.

**Tyler:** OBI got us to the right service. The language agent gave us a way to describe the work inside it.

## 09 · What about the rest of the application?

Make the repeated workflow create the need for the operator.

Live budget: 45 seconds.

**Nikola:** That's one service. How do we get this kind of detail into the rest without asking each team to repeat the setup?

**Tyler:** In this demo, thirteen more services use runtimes in the Injector payload. The Go services keep their OBI coverage. Our next step is to share the setup across those thirteen.

**Nikola:** And share the routine work around it. Not every team has our access, our runtime knowledge, or an empty release queue.

## 10 · Injection still needs a selection

Credit upstream injection and namespace opt-in, then set up the custom component’s combined namespace selection, runtime handling and rollout value.

Live budget: 45 seconds.

**Tyler:** The upstream OpenTelemetry Operator can supply the agent. You opt in using language-specific annotations, on workloads or namespaces. That already removes much of the agent setup.

**Nikola:** For this mixed-language application, we want one shared choice: instrument the namespace. Then let the system choose the agents and manage the rollout.

## 11 · Let the namespace be the selection

Install the merged custom component as a distinct step after upstream opt-in; earn the namespace-wide payoff.

Live budget: 75 seconds.

**Tyler:** This demo uses the custom namespace-driven controller and the OpenTelemetry Injector. The controller selects workloads and manages their rollout. The Injector detects the supported runtime and loads its language agent.

**Nikola:** Here we install the controller once. The agent payload, exporter, and exclusions are shared settings. Next comes the application choice: instrument this namespace.

## 12 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 105 seconds.

**Nikola:** Here is the whole selection rule: instrument demo-apps. No list of service names. No language-specific annotations on each application.

**Tyler:** Apply that rule, and the controller rolls the selected workloads. The Injector supplies their agents. We aren't visiting thirteen deployment files or restarting each service by hand.

**Nikola:** Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. One namespace choice carries the setup across the application.

## 13 · Open language detail in more services

Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.

Live budget: 85 seconds.

**Tyler:** Back in the application view, we're looking at a new request through the instrumented fleet. We still have the system view, and now we can open language-level observations in more services.

**Nikola:** Let's follow Catalog. These are the Java agent's database spans from that service. The same enrollment also covers the Node, Python, Ruby, and dot net services in this application.

**Tyler:** The namespace rule got us here. We didn't need a separate instrumentation change from each application team. They keep their services; the platform carries the shared setup.

## 14 · The work around a deployment adds up

Connect the demonstrated workflow to people, coordination and waiting.

Live budget: 60 seconds.

**Tyler:** Think about the direct setup we watched. We knew the runtime, had access, and controlled the release. How much happens before someone in a real organization can even begin?

**Nikola:** Find an owner. Explain the request. A ticket, a meeting, access, review, and a release slot. Then somebody switches away from their feature work.

**Tyler:** One namespace choice can remove repeated enrollment changes and keep shared settings consistent. The saving is more than typing fewer commands.

**Nikola:** It is fewer people arranging the same work. Count their active effort separately from the time spent waiting.

## 15 · Reuse the workflow after day one

Cover onboarding, updates, consistency, recovery, training and shared upkeep.

Live budget: 60 seconds.

**Tyler:** And setup is only the first bill. A new service arrives. An agent needs an update. A team needs to turn instrumentation off.

**Nikola:** Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve.

**Tyler:** That can reduce drift and repeated troubleshooting. But the platform does not maintain itself.

**Nikola:** Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too.

## 16 · Put a price on the repetition

Work through one explicitly hypothetical first-year labor-capacity calculation, including platform costs and a conditional OBI credit.

Live budget: 80 seconds.

**Tyler:** Let us put dollars on the repetition. This is a hypothetical first year for our eighteen-service system, at a hundred dollars per person-hour.

**Nikola:** Thirteen compatible services remain after the Checkout pilot. Assume two hours saved setting up each, then half an hour on each of four later changes. That is fifty-two person-hours.

**Tyler:** Add twelve investigations where OBI fills a gap in our tracing. Three people spending thirty minutes becomes one person: an hour saved per case. Already have equally useful traces? Set that credit to zero.

**Nikola:** Then subtract twenty-four hours adopting the shared tools and twenty-four for annual upkeep. Sixteen hours remain: sixteen hundred dollars of engineering capacity, before extra telemetry, support, or prototype-hardening costs.

## 17 · Repetition changes the economics

Extrapolate with explicit runtime eligibility, qualifying investigation counts and growing platform costs; distinguish first-year and recurring capacity value.

Live budget: 60 seconds.

**Tyler:** Keep the same runtime mix, and allow more rollout domains and upkeep as the fleet grows. At a hundred services, the first-year value is about twenty-seven thousand dollars. At five hundred services, about a hundred and fifty-three thousand dollars. At a thousand services, about three hundred and ten thousand dollars.

**Nikola:** The following-year figures are lower. Initial setup savings happen once. Ongoing changes and qualifying investigations still save time, and platform upkeep stays in the bill.

**Tyler:** These are replaceable assumptions, not average customer results. If existing namespace templates already remove this work, lower the per-service saving. Less repetition means a smaller return.

**Nikola:** And capacity is not automatically cash in the bank. We have not priced outages, waiting time, or a smaller telemetry bill.

## 18 · Make the next investigation easier

Resolve the opening and leave a practical next step.

Live budget: 55 seconds.

**Tyler:** We began with a slow request and no chosen culprit. OBI showed us where its time went. Java zero-code instrumentation named the local work we wanted to understand.

**Nikola:** Then we chose one namespace. The custom controller and Injector carried the repeated setup across the supported services.

**Tyler:** Try one service. Measure the whole path to useful detail. Then ask which repeated steps your platform can take off the next team's plate.

**Nikola:** Keep the engineering. Lose the repetition. Let's take your questions.
