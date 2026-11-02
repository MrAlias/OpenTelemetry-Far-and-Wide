# Presentation scene plan

The editable visual review is [storyboard.html](../public/storyboard.html).
Live content is 21 minutes, plus one minute flex and three minutes Q&A.
The narrated review uses natural speech pace and can run shorter.
Say **RIO** “rhee-o,” as in Spanish río, and **OTelX** “oh-tell-X.”

Begin with a customer waiting. OBI reveals a failed connection; Java detail
identifies the pricing method, timeout and working fallback. Remove the obsolete
endpoint setting, roll the same image, and immediately return to an actual waterfall.
Show aggregate timings afterward. Then equip the remaining teams through the
central namespace policy of the talk-specific RIO demo and Injector. Close with customer
impact, collaborative fixes and less repeated setup/monthly upkeep.

RIO is a demo operator purpose-built for this talk. We want this functionality
to find an upstream home, in the Operator or another form; the implementation
and upstream path remain open. The upstream configuration comparison
acknowledges workload and namespace opt-in. The measured request
result and hypothetical labor-capacity scenarios are separate evidence.

## 01 · OpenTelemetry Far and Wide

Open a customer problem and promise a measured resolution, then make that investigation capability repeatable across the namespace.

Live budget: 60 seconds.

**Tyler:** Welcome everyone. I'm Tyler Yahn.

**Nikola:** And I'm Nikola Grcevski. Today we're following a slow customer checkout, from the first symptom to a fix.

**Tyler:** The application completes the request, but the customer is waiting. We'll follow that request across the system, add language detail, and remove the stale setting behind the delay. Then we'll use the OpenTelemetry Injector and a small demo operator to share that setup across the application.

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

**Nikola:** We're getting a starting point across the application without asking each team to add a library or restart its service. That's a lot of visibility before the first instrumentation ticket. We showed this idea last year in Atlanta. Now OBI is version one and generally available.

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

**Tyler:** OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now let's find out why this instance is still calling that old address.

## 09 · Remove the stale endpoint setting

Show the real Checkout resource attribute identifying the stale endpoint. Remove that environment variable and roll the same image; bring the owning team a configuration PR backed by the customer trace.

Live budget: 90 seconds.

**Tyler:** Checkout's resource attributes show LEGACY_PRICING_URL. Its value matches the failing URL. This instance is still configured to try a retired backend before it uses the working product store.

**Nikola:** Instrumentation didn't remove that setting. It gave us the evidence to act. If we can collaborate with the owning team, we can bring a configuration pull request: here is the customer impact, here is the timeout, and here is the stale setting to remove. We can fix this without rebuilding the application.

**Tyler:** Remove LEGACY_PRICING_URL from the Deployment. Kubernetes rolls Checkout with the same application image, Java agent, and exporter settings. Only the legacy endpoint setting changes.

**Nikola:** The rollout is ready. Let's send another customer request and look at its trace.

## 10 · The next checkout skips the failed call

Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.

Live budget: 50 seconds.

**Tyler:** Here is the new request's waterfall. Expand Checkout and PricingEngine.calculate. The product-price query is still here. The failed legacy call is gone, and the rest of the request starts sooner.

**Nikola:** Follow it through Inventory, the commerce branches, and the order write. We kept the useful work. The customer gets a faster checkout because we're no longer waiting for a backend that isn't there.

**Tyler:** This is the payoff: a customer symptom, an observed cause, one configuration change, and a fresh trace showing the failed call has disappeared.

## 11 · The improvement across repeated requests

Summarize matched measured request durations only after the audience has seen the actual post-fix waterfall.

Live budget: 35 seconds.

**Tyler:** Across matched requests, checkout falls from seconds to a fraction of a second. Pricing no longer spends two seconds waiting for the retired backend. The graph summarizes the same change we just followed in the waterfall: keep the useful work, remove the unnecessary wait.

**Nikola:** That summary supports the trace we just saw. It is a local demo comparison, not a production benchmark. Next, how do we make the same diagnostic detail available to the other teams?

## 12 · One fixed. Thirteen to equip.

Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.

Live budget: 40 seconds.

**Nikola:** We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?

**Tyler:** In this demo, thirteen more services use runtimes supported by the OTel Injector. The Go services will keep their OBI coverage. Our next step is to share the setup across those thirteen.

## 13 · From language opt-in to a shared namespace policy

Put upstream opt-in in context, then explain RIO as a talk-specific demonstration of functionality we want upstream; no agreed implementation or roadmap.

Live budget: 45 seconds.

**Tyler:** To see what we're centralizing, here's the upstream Operator's opt-in configuration. Java and Python have different injection annotations, with an Instrumentation resource supplying their settings. You can put those annotations on workloads or a namespace.

**Nikola:** That already saves work. For this talk, we built RIO, the Runtime Instrumentation Operator, in OTelX. It's a demo operator that combines central namespace selection, the OpenTelemetry Injector, and managed rollouts. We want to bring this capability upstream, whether in the existing Operator or another form. That path still needs design and agreement.

## 14 · Install the namespace-driven controller

Install the talk-specific controller and shared Injector settings once; demonstrate the workflow rather than recommend RIO as a production dependency.

Live budget: 60 seconds.

**Tyler:** Here we install the demo controller once. It builds on Jack Berg's prototype. The controller selects workloads and manages their rollout. The OpenTelemetry Injector handles supported runtimes and loads their agents.

**Nikola:** The payload, exporter, and exclusions are shared settings. Application owners don't each choose a language annotation and arrange a separate instrumentation rollout. Next comes the application choice: instrument this namespace.

## 15 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 105 seconds.

**Nikola:** Here is the selection rule: instrument demo-apps. We select the application boundary once. Unlike the language opt-in we just showed, this rule doesn't list languages or individual services.

**Tyler:** Apply that rule, and the controller rolls the selected workloads. The Injector injects and supplies the OTel agents. Compatible services deployed into the namespace later inherit the same policy.

**Nikola:** Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it. OBI is still running here. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI for every service.

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

**Nikola:** Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve. A runtime change doesn't automatically mean a new onboarding project: OBI can keep the baseline for supported traffic, while language-level detail depends on the runtime.

**Tyler:** That can reduce drift and repeated troubleshooting. But the platform does not maintain itself.

**Nikola:** Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too.

## 19 · Make coverage the default

Compare one central enrollment and inherited coverage with a team-by-team long tail; explain aloud that the paths are conceptual, not observed adoption data.

Live budget: 50 seconds.

**Nikola:** This is a sketch of adoption, not measured rollout data. Team-by-team ownership advances in steps: one service, then another. Busy teams create a long tail that may never reach full coverage.

**Tyler:** And the finish line moves. New services arrive. Someone rewrites a service from Java to Python, and the old instrumentation setup no longer fits. Coverage can drop while other teams are still catching up.

**Nikola:** Central policy makes coverage the default. One rollout reaches the eligible services in scope, and new compatible workloads inherit it. The platform still tests and maintains that shared path.

## 20 · The cost of team-by-team ownership

Keep the cumulative setup/upkeep comparison in the same 18-service demo. Step up at each monthly release: 9.75 distributed hours versus 0.75 central hours. Over two years, show 266.5 versus 19.5 hours and emphasize 247 engineering hours freed, with their $24,700 assumed labor value secondary.

Live budget: 60 seconds.

**Tyler:** Let's keep the cost comparison in this demo. Eighteen services, thirteen of them still needing language instrumentation after our first example. These steps show setup and two years of monthly agent updates. Each jump is another release.

**Nikola:** With distributed ownership, each service owner arranges the work. With centralized control, we set up the namespace once and share each update. Both lines include upkeep; the centralized path still costs engineering time.

**Tyler:** Over two years, that frees two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars. From setup and monthly updates, in the same small application we've been investigating.

**Nikola:** These are assumed person-hours valued at a hundred dollars an hour, not a measured cash saving. Include your own compatibility and support costs. We haven't priced the calendar time spent waiting for other teams.

## 21 · OpenTelemetry. Ready to install.

Close with the measured customer improvement and namespace coverage: OpenTelemetry has grown beyond APIs and SDKs into instrumentation users can install for services and clusters. Leave the demo and RIO QR codes visible.

Live budget: 50 seconds.

**Tyler:** We started with a customer waiting. OBI showed the failed connection. The Java agent tied it to pricing, and the resource attributes exposed a stale endpoint setting. We removed that setting, rolled the same image, and checked the next request's trace.

**Nikola:** Then one namespace choice carried language instrumentation across the supported services. RIO demonstrates that shared workflow; we want an upstream home for the idea. The next team should start with useful detail, instead of another setup project.

**Tyler:** OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install: on a service, across a cluster. From a customer waiting to a cause you can act on. Less setup. More answers.

**Nikola:** Find the wait. Fix the cause. Make the next investigation easier. Thank you. Let's take your questions.
