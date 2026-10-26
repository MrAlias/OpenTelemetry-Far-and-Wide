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

Live budget: 90 seconds.

**Tyler:** Think about the direct setup we just watched. We knew the runtime, had access, and could deploy when we wanted. In a real organization, how much happens before the person at the keyboard can even begin?

**Nikola:** Finding an owner. Explaining the request. A ticket. A meeting to agree on scope. Access requests. A review. A place in the release schedule. Then someone switches away from their actual feature work to pick this up.

**Tyler:** With the namespace selected, the platform no longer needs a separate enrollment change from each application team. That can remove repeated tickets, reviews, and release coordination, while keeping the shared settings consistent.

**Nikola:** The saving is bigger than typing fewer commands. It's fewer people arranging the same routine work, and less waiting between them.

## 15 · Reuse the workflow after day one

Cover onboarding, updates, consistency, recovery, training and shared upkeep.

Live budget: 95 seconds.

**Tyler:** Setup is only the first bill. A new service arrives. An agent needs an update. A version is incompatible. A team needs to turn instrumentation off. Without a shared path, each of those can reopen the same chain of requests.

**Nikola:** A new compatible service in the selected namespace inherits the selection. No new opt-in ticket. Agent updates use the shared rollout path, and a tested recovery path can save teams from inventing one during an incident.

**Tyler:** That can reduce duplicated configuration, version drift, repeated debugging, and the documentation and training each team has to maintain.

**Nikola:** The platform still has a job: maintain the shared path, test compatibility, and handle failures. Central work belongs in the cost calculation too.

## 16 · Measure effort and waiting separately

Give an honest measurement approach without a trace-verification or accounting tutorial.

Live budget: 75 seconds.

**Tyler:** To measure the benefit, compare the effort needed to reach the same useful coverage. Include shared preparation and maintenance on both sides, then count the work left for each service team.

**Nikola:** There are two different clocks. Hands-on effort is the time people spend doing work. Calendar delay is how long the request sits waiting between those steps. Reducing one doesn't automatically measure the other.

**Tyler:** And adding agent detail may increase telemetry volume and runtime overhead. Engineering savings don't establish a smaller backend bill. Measure compute, export volume, storage, and sampling separately if you want to make that claim.

## 17 · Make the next investigation easier

Resolve the opening and leave a practical next step.

Live budget: 55 seconds.

**Tyler:** We began with a slow request and no chosen culprit. OBI showed us where its time went. Java zero-code instrumentation named the local work we wanted to understand.

**Nikola:** Then we chose one namespace. The custom controller and Injector carried the repeated setup across the supported services.

**Tyler:** Try one service. Measure the whole path to useful detail. Then ask which repeated steps your platform can take off the next team's plate.

**Nikola:** Keep the engineering. Lose the repetition. Let's take your questions.
