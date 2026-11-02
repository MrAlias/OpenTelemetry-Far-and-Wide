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

**Nikola:** And I'm Nikola Grcevski.

**Tyler:** You've clicked Place order. Now you're waiting. Did it work? Should you click again? Our checkout completes the order, but it makes the customer wait more than two seconds. We're going to find that wait, remove it, and show you what changed for the customer.

**Nikola:** Then we'll tackle the other problem: getting eighteen services ready for that investigation. We'll use the OpenTelemetry Injector and our demo Kubernetes operator so every team doesn't have to repeat the setup. First, let's follow that order.

## 02 · One application, many places to look

Orient in the actual application without selecting a culprit.

Live budget: 40 seconds.

**Tyler:** This is where the order goes. Gateway, Checkout, Inventory, then the commerce branches. Eighteen services, plus PostgreSQL and Redis. Somewhere along that route, we're losing the customer's time.

**Nikola:** The person placing the order doesn't care which service owns the delay. They just want their order to go through. Let's get a view of the whole request before we choose where to look.

## 03 · Meet OBI

Introduce OBI before its acronym is used: eBPF observations of running Linux applications, zero app changes/restarts, traces and metrics. Show deployment only after explaining its value.

Live budget: 70 seconds.

**Tyler:** We'll use OpenTelemetry eBPF Instrumentation, or OBI. It watches supported application traffic from Linux using eBPF, then gives us OpenTelemetry traces and metrics. We can start with the applications that are already running. No application code changes, and no application restarts.

**Nikola:** That changes how quickly we can start helping. We don't have to get an instrumentation change through every service first. If you joined us in Atlanta last year, you'll remember this idea. OBI is now version one and generally available.

**Tyler:** Let's deploy it on the nodes. It discovers the running applications and follows supported calls between them. For this order, that includes HTTP calls and the PostgreSQL and Redis traffic.

**Nikola:** A single deployment. Now let's see how much of the customer's wait we can explain.

## 04 · One request across the application

Give the connected-trace statement its own actual waterfall exemplar.

Live budget: 55 seconds.

**Nikola:** Here's the order we've been waiting for. We can follow its service calls and its PostgreSQL price query in one trace. Nobody had to edit those applications to get us this starting point.

**Tyler:** And look how the question changes. We came in knowing that checkout felt slow. Now we can follow where this particular request spent its time. Let's find the wait we can do something about.

## 05 · Follow the cart branch of this request

Transform orientation into an observed path, using the captured request.

Live budget: 35 seconds.

**Tyler:** These highlighted calls actually happened in our request. Follow this branch from Cart through Catalog, Recommendations, and Promotions. Now we can see the route the order took, instead of relying on the architecture diagram.

**Nikola:** That's useful when the first team you call says, we don't call that service. Maybe not directly. The request still went there, and now both teams can look at the same evidence.

## 06 · Find the failed connection on the request path

Select Checkout from the actual failed CONNECT span; use language detail to identify the calling method, timeout exception and working fallback.

Live budget: 70 seconds.

**Tyler:** Gateway has a long span. So does Checkout. But both include time spent waiting on other services. If we just hand the longest span to a team, we're handing them the same mystery we started with.

**Nikola:** Look at this failed connection from Checkout. About two seconds go here. Then the price lookup succeeds and the rest of the order carries on. The request is successful, but the customer had to wait for that failed attempt.

**Tyler:** That's our lead. Why does Checkout try a connection that fails before it does the work that succeeds? We need to connect this call to what Checkout is doing in its code.

**Nikola:** Let's open Checkout's code. We have a specific question for it now.

## 07 · Add Java zero-code instrumentation

Show actual source-informed configuration and the real direct-agent installation.

Live budget: 120 seconds.

**Tyler:** We can inspect the source here. Pricing runs before Inventory. We'll use OpenTelemetry's Java agent to add detail around that method and see the library calls inside it. The agent loads when Java starts, so we don't have to add instrumentation code to the method.

**Nikola:** We do still have to get the agent into the workload, tell Java to load it, and set up where the data goes. Those are the steps between, I need to understand this service, and actually having the detail to do it.

**Tyler:** Here's the deployment change. Same application image. Supply the agent, set the service name and exporter, select the pricing method, and roll Checkout. Let's see whether that work answers our question.

**Nikola:** Keep those steps in mind. We managed them for one service we know. We'll come back to what happens when the other teams need the same thing.

## 08 · A failed attempt before a working fallback

Show the actual HTTP span error.type and exception event before calling the failure a timeout; return to the successful price lookup.

Live budget: 60 seconds.

**Tyler:** Open PricingEngine.calculate. There's the failed HTTP call, followed by the successful product-price lookup. The Java detail puts the wait inside the pricing method, and shows the fallback that lets the order finish.

**Nikola:** And here's why we can call it a timeout. The error type is SocketTimeoutException. The exception event says, "Connect timed out". Checkout spends two seconds trying to connect, then finds the price another way. The customer gets an order, with two seconds of unnecessary waiting attached.

**Tyler:** Now we have something better than, Checkout is slow. We have the call, the reason it failed, and the path that worked. Let's find out why this instance is still trying that old address.

## 09 · Remove the stale endpoint setting

Show the real Checkout resource attribute identifying the stale endpoint. Remove that environment variable and roll the same image; bring the owning team a configuration PR backed by the customer trace.

Live budget: 90 seconds.

**Tyler:** There it is: LEGACY_PRICING_URL, in Checkout's resource attributes. Its value matches the failing call. This instance is still configured to try a retired backend before it uses the working product store. An old setting is adding a wait to every order.

**Nikola:** Think about the conversation we can have with the owning team now. Customers are losing two seconds here. This connection times out. Here's a configuration PR that removes the unused endpoint. The instrumentation gave us enough context to help with a fix, instead of just sending another team a slow-service alert.

**Tyler:** Let's make that change. Remove LEGACY_PRICING_URL from the Deployment and roll Checkout. Same application image, same Java agent, same exporter. We don't need an application rebuild to stop calling the retired backend.

**Nikola:** The rollout is ready. Let's go back to the customer. What does the next order look like?

## 10 · The next checkout skips the failed call

Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.

Live budget: 50 seconds.

**Tyler:** Here's the new trace. The product-price query is still there. The failed legacy call is gone. Pricing can get on with finding the price, without waiting for that old connection to time out first.

**Nikola:** If we follow the request through Inventory, the commerce branches, and the order write. We can see that the customer gets a faster checkout because we're no longer waiting for a backend that isn't there.

**Tyler:** That's the moment we wanted. The same checkout has a shorter path through it, and we can show exactly why. Let's see whether that improvement holds across more requests.

## 11 · The improvement across repeated requests

Summarize matched measured request durations only after the audience has seen the actual post-fix waterfall.

Live budget: 35 seconds.

**Tyler:** Across the matched requests, checkout goes from just over two seconds to about a hundred and eighty-five milliseconds. That's the wait we started with, gone from the customer's experience. The chart summarizes the change we just followed in the waterfall.

**Nikola:** That summary supports the trace we just saw, this was quite useful. Now, how do we make the same diagnostic detail available to the other teams?

## 12 · One fixed. Thirteen to equip.

Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.

Live budget: 40 seconds.

**Nikola:** We got our answer, but we had to arrange the Java setup before we could get that detail. Could you do the same for the thirteen other supported services?

**Tyler:** I was hoping you wouldn't ask. Each of those thirteen services can use the OpenTelemetry Injector. The four Go services keep OBI. We need a way to share the setup, so this doesn't become thirteen more jobs for the service owners.

## 13 · From language opt-in to a shared namespace policy

Put upstream opt-in in context, then explain RIO as a talk-specific demonstration of functionality we want upstream; no agreed implementation or roadmap.

Live budget: 45 seconds.

**Tyler:** The upstream OpenTelemetry Operator already saves some of that work. Here's its opt-in configuration: different injection annotations for Java and Python, with an Instrumentation resource supplying the settings. Those annotations can go on a workload or a namespace.

**Nikola:** But suppose I own the application and want its supported services instrumented. I'd like to make that choice once, and have the controller handle the runtimes and the rollouts.

**Tyler:** That's the workflow we're demonstrating with RIO, the Runtime Instrumentation Operator, in OTelX. It's a demo operator built for this talk, using the OpenTelemetry Injector. This next installation is RIO, rather than the upstream Operator.

**Nikola:** We'd like this capability to find an upstream home, in the Operator or another form. That needs community design and agreement. Here's the experience we'd like people to be able to have.

## 14 · Install the namespace-driven controller

Install the talk-specific controller and shared Injector settings once; demonstrate the workflow rather than recommend RIO as a production dependency.

Live budget: 60 seconds.

**Tyler:** Install the demo controller once. It builds on Jack Berg's prototype. The controller selects the workloads and manages their rollout. The Injector recognizes supported runtimes and loads the agents. Those are the pieces we otherwise had to arrange for each service.

**Nikola:** We prepare the shared payload, exporter, and exclusions here. Then the application owner gets a simpler decision: instrument this namespace. They can ask for coverage without first turning it into a separate project with every service owner.

## 15 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 105 seconds.

**Nikola:** The selection rule is simple: instrument demo-apps in a declarative way. Unlike the language opt-in we just showed, this rule doesn't list languages or individual services.

**Tyler:** Apply it, and the controller rolls the selected workloads. The Injector supplies the agents for supported runtimes. If another compatible service is deployed here later, it inherits the policy. That team doesn't need to arrange its own instrumentation rollout first.

**Nikola:** There they are. Checkout keeps its direct agent. Thirteen more services gain language detail. And the four Go services keep OBI. We didn't have to visit each service to make that happen.

**Tyler:** OBI is still running alongside them. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI service by service as those agents arrived.

**Nikola:** So when the next team has a slow request, the details will already be there. The platform maintains the shared setup. The application team can start with its question.

## 16 · Open language detail in more services

Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.

Live budget: 60 seconds.

**Tyler:** Let's check a fresh order. We can still follow it across the application. Now more of those services have the detail we had to set up by hand for Checkout.

**Nikola:** Open Catalog. These are database spans from its Java agent. The same enrollment covers the Node, Python, Ruby, and dot net services. If a team needs to understand a database call, it can open that detail instead of first asking how to install an agent.

**Tyler:** We haven't fixed a problem in every service. We've given the other teams a way to start looking. Checkout keeps its fix, and the next investigation can begin closer to the answer.

## 17 · The work around a deployment adds up

Connect the demonstrated workflow to people, coordination and waiting.

Live budget: 55 seconds.

**Tyler:** Think about your last investigation that needed more instrumentation. How long was it between, I know what I need to see, and actually being able to see it?

**Nikola:** There's the owner to find, access to arrange, a review, and a release. People are fitting that work around something else. While those conversations happen, the customer still has the slow checkout.

**Tyler:** That's the work this namespace choice can remove from the next investigation. Agree on the shared setup once, and maintain it together. Each service doesn't need to reopen the whole conversation.

**Nikola:** Count both the people doing that work and the time they spend waiting. We usually remember the few minutes spent typing the change. The rest is where a small instrumentation task can turn into a long interruption.

## 18 · Reuse the workflow after day one

Cover onboarding, updates, consistency, recovery, training and shared upkeep.

Live budget: 50 seconds.

**Tyler:** Now an agent release arrives next month. Do all thirteen service owners need another task and another rollout? And what happens when a new service appears?

**Nikola:** The shared approach gives us a place to handle that work together. Compatible new services inherit the policy. Agent updates use the shared rollout path. Settings and recovery instructions have one place to improve.

**Tyler:** A service can still change runtimes, or need an exception. OBI can keep the baseline for supported traffic, while the available language detail depends on the runtime. Someone still has to look after those cases.

**Nikola:** Yes. The platform owns compatibility checks, updates, and recovery. We include that work in the cost. The saving comes from avoiding the same job being repeated across teams.

## 19 · Make coverage the default

Compare one central enrollment and inherited coverage with a team-by-team long tail; explain aloud that the paths are conceptual, not observed adoption data.

Live budget: 50 seconds.

**Nikola:** This is a sketch of what that can mean for coverage. One team gets instrumentation done. Another has a release freeze. A third is busy with something else. Months can pass with the application only partly covered.

**Tyler:** And the application doesn't wait for the project to finish. Add a service, or rewrite one from Java to Python, and coverage can fall again. The finish line moves while the teams are still catching up.

**Nikola:** With the namespace policy, one rollout covers the eligible services in scope, and compatible new workloads inherit it. We still test and maintain that shared path. But each team doesn't have to find room for another onboarding project before its service is covered.

## 20 · The cost of team-by-team ownership

Keep the cumulative setup/upkeep comparison in the same 18-service demo. Step up at each monthly release: 9.75 distributed hours versus 0.75 central hours. Over two years, show 266.5 versus 19.5 hours and emphasize 247 engineering hours freed, with their $24,700 assumed labor value secondary.

Live budget: 60 seconds.

**Tyler:** Here's what repeating the work can cost in our eighteen-service example. After Checkout, thirteen services still need language instrumentation. These steps cover their setup and two years of monthly agent updates. Every jump is another release to handle.

**Nikola:** On the distributed path, the service owners arrange that work separately. On the centralized path, we set up the namespace once and share each update. That lower line still includes maintaining the shared approach.

**Tyler:** The difference is two hundred and forty-seven engineering hours over two years. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. That's time people could spend on the next customer problem, rather than repeating this setup and upkeep.

**Nikola:** Those are assumed hours for this example, not measured cash savings. Put in your own setup and support costs. We haven't put a dollar value on the calendar time spent waiting for another team's release.

## 21 · OpenTelemetry. Ready to install.

Close with the measured customer improvement and namespace coverage: OpenTelemetry has grown beyond APIs and SDKs into instrumentation users can install for services and clusters. Leave the demo and RIO QR codes visible.

Live budget: 50 seconds.

**Tyler:** Remember the customer waiting at the start? OBI helped us find the failed connection. The Java agent showed the pricing call and its fallback. The resource attributes exposed the retired endpoint setting. Remove that setting, roll the same image, and the next trace shows the wait has gone.

**Nikola:** Then one namespace choice made language detail available across the supported services. RIO demonstrates the shared workflow we'd like to bring upstream. The next team should be able to open a trace and start investigating, without repeating our setup first.

**Tyler:** OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service, or across a cluster, and use to find what's keeping a customer waiting. That's what makes all this setup worthwhile: we can get from their problem to something we can fix.

**Nikola:** Find the wait, fix the cause, and make the next investigation easier. Thank you. Let's take your questions.
