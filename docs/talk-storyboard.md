# Presentation scene plan

The editable visual review is [storyboard.html](../public/storyboard.html).
Live content is 21 minutes, plus one minute flex and three minutes Q&A.
The narrated review uses natural speech pace and can run shorter.
Say **RIO** “rhee-o,” as in Spanish río, and **OTelX** “oh-tell-X.”

Begin with a customer waiting. OBI reveals a failed connection; Java detail
identifies the pricing method, timeout and working fallback. Remove the obsolete
backend attempt, deploy the fix, and immediately return to an actual waterfall.
Show aggregate timings afterward. Then equip the remaining teams through the
central namespace policy of the RIO precursor and Injector. Close with customer
impact, collaborative fixes and less repeated setup/monthly upkeep.

The recorded component is the bundled prototype that led to the independent
OTelX RIO project, not an upstream Operator release. The upstream configuration
comparison acknowledges workload and namespace opt-in. The measured request
result and hypothetical labor-capacity scenarios are separate evidence.



## 01 · OpenTelemetry Far and Wide

Open a customer problem and promise a measured resolution, then make that investigation capability repeatable across the namespace.

Live budget: 60 seconds.

**Tyler:** Welcome everyone. I'm Tyler Yahn.

**Nikola:** And I'm Nikola Grcevski. Today we're following a slow customer checkout, from the first symptom to a fix.

**Tyler:** The application completes the request, but the customer is waiting. We'll follow that request across the system, add language detail, and change the code responsible. Then we'll make that visibility available across the application with the OpenTelemetry Injector and RIO, a namespace-driven operator.

**Nikola:** One customer problem, then a way for each of the teams in the organization to investigate theirs. Let's open the system.

## 02 · One application, many places to look

Orient in the actual application without selecting a culprit.

Live budget: 40 seconds.

**Tyler:** Here is our checkout application: eighteen services, with PostgreSQL and Redis. The Gateway hands the request to Checkout, which calls Inventory and four commerce branches. The map shows what can talk to what; the duration tells us the whole request is slow.

**Nikola:** Every team can have a different definition of healthy. Following the request gives us one shared starting point.

## 03 · Meet OBI

Introduce OBI before its acronym is used: eBPF observations of running Linux applications, zero app changes/restarts, traces and metrics. Show deployment only after explaining its value.

Live budget: 70 seconds.

**Tyler:** First, OpenTelemetry eBPF Instrumentation, or OBI. It's a zero-code way to observe running Linux applications. It uses eBPF to watch application and network activity, then exports OpenTelemetry traces and metrics.

**Nikola:** We're getting a starting point across the application without asking each team to add a library or restart its service. That's a lot of visibility before the first instrumentation ticket. We showed you this last year at Kubecon in Atlanta. One tool, 
single command shows all of this visibility. Except, now the tool is GA.

**Tyler:** And this is more than a service map. OBI follows supported calls across service boundaries, including our HTTP, PostgreSQL, and Redis traffic. Let's deploy it on the nodes and let it discover the running applications.

**Nikola:** One deployment. Eighteen services to investigate. Much better odds than guessing which team to call. Let's open a request.

## 04 · One request across the application

Give the connected-trace statement its own actual waterfall exemplar.

Live budget: 55 seconds.

**Nikola:** Look what that one OBI deployment gave us. This is the slow request behind the opening number, followed across the application. Here are the HTTP calls and the PostgreSQL price query, before we've added a language agent to any service.

**Tyler:** Different languages, one request we can follow. We've gone from a customer waiting for seconds to a specific set of service calls and durations. That's a huge head start for such a small setup. The customer is still waiting, though. Let's find the part we can change.

## 05 · Follow the cart branch of this request

Transform orientation into an observed path, using the captured request.

Live budget: 35 seconds.

**Tyler:** Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went.

**Nikola:** Here we're following the Cart branch through Catalog, Recommendations, and Promotions. This is one branch of the same request moving through the system.

## 06 · Find the failed connection on the request path

Select Checkout from the actual failed CONNECT span; use language detail to identify the calling method, timeout exception and working fallback.

Live budget: 70 seconds.

**Tyler:** Start with the waterfall. Gateway's long span includes its wait for Checkout, and Checkout's span includes its downstream work. The longest parent span doesn't tell us what to fix.

**Nikola:** Look at this failed connection from Checkout instead. It consumes about two seconds before the successful product lookup and the other service calls.

**Tyler:** Now we have somewhere specific to investigate: why is Checkout spending time on a connection that fails? OBI has exposed the failed attempt; language detail can connect it to the method and fallback in our code.

**Nikola:** Let's open Checkout and follow that connection.

## 07 · Add Java zero-code instrumentation

Show actual source-informed configuration and the real direct-agent installation.

Live budget: 120 seconds.

**Tyler:** We have source access here. Pricing runs before Inventory. We'll use the Java agent to time that method and expose the library calls inside it.

**Nikola:** This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes.

**Tyler:** Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout.

**Nikola:** Zero code is useful, but hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change.

## 08 · A failed attempt before a working fallback

Show the actual HTTP span error.type and exception event before calling the failure a timeout; return to the successful price lookup.

Live budget: 60 seconds.

**Tyler:** Here's a fresh request with the Java agent. Open PricingEngine.calculate. The long interval contains a failed HTTP connection, then a successful product-price lookup.

**Nikola:** Open the failed HTTP span. Its error type is Java's SocketTimeoutException. The exception event says, Connect timed out. That is a connection timeout. The product-price lookup after it succeeds, so Checkout completes, but the customer pays for the failed attempt first.

**Tyler:** OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now we have a code change to investigate.

## 09 · Stop calling the retired backend

Show the actual Java source edit in Vim, retaining the working price lookup; offer a PR backed by the trace, then deploy the same fix.

Live budget: 90 seconds.

**Tyler:** There it is. Pricing still calls a legacy backend that no longer exists. The connection times out after two seconds, then we read the price from the current product store. The fix is to use that store directly.

**Nikola:** Instrumentation didn't fix the code. It enabled us to act. If we can collaborate with the owning team, we can bring a pull request instead of a vague report that their service is slow. Here is the customer impact, this is the trace showing the timeout, and now we have a change that removes it while keeping the price lookup.

**Tyler:** We're deploying that application change now. The Java agent and exporter settings stay the same.

**Nikola:** The rollout is ready. Let's send another customer request and look at its trace.

## 10 · The next checkout skips the failed call

Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.

Live budget: 50 seconds.

**Tyler:** Here is the new request's waterfall. Expand Checkout and PricingEngine.calculate. The product-price query is still here. The failed legacy call is gone, and the rest of the request starts sooner.

**Nikola:** Follow it through Inventory, the commerce branches, and the order write. We kept the useful work. The customer gets a faster checkout because we're no longer waiting for a backend that isn't there.

**Tyler:** This is the payoff: a customer symptom, an observed cause, a code change, and a fresh trace showing what changed.

## 11 · The improvement across repeated requests

Summarize matched measured request durations only after the audience has seen the actual post-fix waterfall.

Live budget: 35 seconds.

**Tyler:** Across matched requests, the median checkout went from about two point two seconds to two hundred and twenty milliseconds. Pricing dropped from about two seconds to under four milliseconds. That supports the change we just followed in the waterfall: stop making the customer wait for a backend that is gone.

**Nikola:** That summary supports the trace we just saw. It is a local demo comparison, not a production benchmark. Next, how do we make the same diagnostic detail available to the other teams?

## 12 · One fixed. Thirteen to equip.

Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.

Live budget: 40 seconds.

**Nikola:** We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?

**Tyler:** In this demo, thirteen more services use runtimes supported by the OTel Injector. The Go services will keep their OBI coverage. Our next step is to share the setup across those thirteen.

**Nikola:** And share the routine work around it. Not every team has our access, our runtime knowledge, or an empty release queue.

## 13 · From language opt-in to a shared namespace policy

Show real upstream configuration for context, credit namespace opt-in, and name the independent RIO project and bundled prototype accurately.

Live budget: 45 seconds.

**Tyler:** To see what we're centralizing, here's the upstream Operator's opt-in configuration. Java and Python have different injection annotations, with an Instrumentation resource supplying their settings. You can put those annotations on workloads or a namespace.

**Nikola:** That already saves work. RIO, the Runtime Instrumentation Operator from our OTelX org, takes a different route: select the namespace centrally, let the Injector do the work for supported runtimes, and let the controller manage existing workloads. This demo uses the bundled prototype that led to RIO, not an upstream Operator installation.

## 14 · Install the namespace-driven controller

Install the merged custom component as a distinct step after upstream opt-in; earn the namespace-wide payoff.

Live budget: 60 seconds.

**Tyler:** Here we install the namespace-driven controller once. This is the demo's RIO precursor, working with the OpenTelemetry Injector. The controller selects workloads and manages rollout; the Injector injects into supported runtimes and loads their agents.

**Nikola:** The payload, exporter, and exclusions are shared settings. Application owners don't each choose a language annotation and arrange a separate instrumentation rollout. Next comes the application choice: instrument this namespace.

## 15 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 105 seconds.

**Nikola:** Here is the selection rule: instrument demo-apps. We select the application boundary once. Unlike the language opt-in we just showed, this rule doesn't list languages or individual services.

**Tyler:** Apply that rule, and the controller rolls the selected workloads. The Injector injects and supplies the OTel agents. Compatible services deployed into the namespace later inherit the same policy.

**Nikola:** Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it. Notice how there is no trace duplication even as OBI is running in the bacground for the same namespace. OBI detects
OTel instrumented services and stands down, no action required from the operator.

## 16 · Open language detail in more services

Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.

Live budget: 60 seconds.

**Tyler:** Back in the application view, we're looking at a new request through the instrumented fleet. We still have the system view, and now we can open language-level observations in more services.

**Nikola:** Let's follow Catalog. These are the Java agent's database spans from that service. The same enrollment also covers the Node, Python, Ruby, and dot net services in this application.

**Tyler:** The namespace rule got us here without a separate instrumentation change from each application team. Checkout keeps its fix. Now the other teams have the language detail ready for their next investigation too.

## 17 · The work around a deployment adds up

Connect the demonstrated workflow to people, coordination and waiting.

Live budget: 55 seconds.

**Tyler:** Think about the direct setup we watched. We knew the runtime, had access, and controlled the release. How much happens before someone in a real organization can even begin?

**Nikola:** Find an owner. Explain the request. A ticket, a meeting, access, review, and a release slot. Then somebody switches away from their feature work.

**Tyler:** One namespace choice can remove repeated enrollment changes and keep shared settings consistent. The saving is more than typing fewer commands.

**Nikola:** It is fewer people arranging the same work. Count their active effort separately from the time spent waiting.

## 18 · Reuse the workflow after day one

Cover onboarding, updates, consistency, recovery, training and shared upkeep.

Live budget: 50 seconds.

**Tyler:** And setup is only the first bill. A new service arrives. An agent needs an update. A team needs to turn instrumentation off.

**Nikola:** Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve.

**Tyler:** That can reduce drift and repeated troubleshooting. But the platform does not maintain itself.

**Nikola:** Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too.

## 19 · Put a price on the repetition

Compare distributed ownership against one centralized namespace setup and twelve monthly shared agent updates; show operations before dollars, with zero investigation-time credit.

Live budget: 70 seconds.

**Tyler:** Let's price that difference in ownership. This is a hypothetical year, at a hundred dollars per person-hour. Thirteen compatible services remain after our common pilot.

**Nikola:** With distributed ownership, allow two and a half hours per team to arrange and deploy its instrumentation. Thirteen teams means thirty-two and a half hours. RIO centralizes the setup. Allow one hour for the controller and namespace policy, plus thirty minutes to deploy OBI. Once for the namespace. There is no additional setup allowance for each service.

**Tyler:** Now assume an agent release every month. Thirteen separately owned updates versus one shared update: a hundred and fifty-six operations versus twelve in a year. At an assumed forty-five minutes each, that's a hundred and seventeen hours versus nine. A hundred and eight hours saved every year.

**Nikola:** We give neither side a faster-investigation credit once both have equivalent telemetry. OBI gives us broad initial visibility; we count its deployment once, not once per incident.

**Tyler:** Setup plus monthly upkeep saves a hundred and thirty-nine person-hours in this scenario: thirteen thousand nine hundred dollars of engineering capacity in year one. Ten thousand eight hundred in following years. Replace the assumed hours with your own; this is not a measured customer saving.

## 20 · Repetition changes the economics

Extrapolate explicit ownership and monthly-update assumptions, with no invented per-investigation or telemetry-bill saving.

Live budget: 40 seconds.

**Tyler:** The same assumptions give about eighty-five thousand dollars of capacity for a hundred services in year one, four hundred and forty thousand for five hundred, and eight hundred and eighty-two thousand for a thousand.

**Nikola:** These are scenarios, not a scaling law. We retain the demo's supported-runtime mix and allow more independent rollout domains as the fleet grows. Each domain pays for its shared setup and monthly updates once.

**Tyler:** Already centralized? Compare against that workflow. Equivalent work should give zero saving. Extra compatibility testing, exceptions, hardening, and support need their own estimates. We haven't priced incident response, waiting time, or a smaller telemetry bill.

## 21 · Less waiting. More services ready.

Close the customer-latency loop and the shared-workflow loop together; leave both outcomes visible during questions.

Live budget: 50 seconds.

**Tyler:** We started with a customer waiting for checkout. OBI showed the failed connection. The Java agent connected it to pricing and its fallback. We removed the stale backend attempt, then returned to the actual request trace to see the change.

**Nikola:** Then one namespace choice carried language instrumentation across the supported services. The next team can start with useful detail instead of starting another setup project.

**Tyler:** The customer gets a faster checkout. The teams get a shared way to investigate the next slow request. That is what the traces and the automation were for.

**Nikola:** Find the wait. Fix the cause. Make the next investigation easier. Let's take your questions.
