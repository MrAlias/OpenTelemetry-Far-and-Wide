# Presentation scene plan

The editable visual review is [storyboard.html](../public/storyboard.html).
Live content is 21 minutes 35 seconds, plus two minutes Q&A.
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

**Tyler:** Imagine, you've clicked "Place Order". Now you're waiting. Did it work? Should you click again? Our checkout completes the order, but it makes the customer wait more than two seconds. In this presentation, we'll first show you how install OpenTelemetry eBPF Instrumentation to identify the issue source.

**Nikola:** Then we'll tackle the other problem: getting eighteen services ready for that investigation. We'll use the OpenTelemetry Injector and our demo Kubernetes operator so every team doesn't have to repeat the setup. First, let's follow that order.

## 02 · One application, many places to look

Orient in the actual application without selecting a culprit.

Live budget: 40 seconds.

**Tyler:** Here's an overview of where the order goes. Our application starts at Gateway, and continues to Checkout, Inventory, and then the commerce branches. Eighteen services, plus PostgreSQL and Redis. Our customer's frustration is being caused by something in this chaos.

**Nikola:** The person placing the order doesn't care which service owns the delay. They just want their order to go through. Let's get a view of the whole request before we choose where to look.

## 03 · Meet OBI

Introduce OBI before its acronym is used: eBPF observations of running Linux applications, zero app changes/restarts, traces and metrics. Show deployment only after explaining its value.

Live budget: 70 seconds.

**Tyler:** To start the investigation, we'll install OpenTelemetry eBPF Instrumentation, or OBI, on our nodes. OBI instruments applications running on Linux using eBPF. It will automatically generate OpenTelemetry traces and metrics for those applications. OBI is zero-code instrumentation. No application code changes, and no application restarts are required.

**Nikola:** That changes how quickly we can start helping. We don't have to get an instrumentation change through every service first. If you joined us in Atlanta last year, you'll remember this idea. OBI is now v1.0.0 and generally available.

**Tyler:** Let's deploy it to the nodes. Once running, OBI discovers the services running on the node, and starts generating telemetry about the services operation and the calls between them. For the customer order request, that includes HTTP calls and the PostgreSQL and Redis traffic.

**Nikola:** Just a single deployment. Now let's see how much of the customer's wait we can explain.

## 04 · Find the two-second wait

In live Grafana, find the failed two-second Checkout connection and ask why it precedes a successful price lookup. Keep one actual waterfall as the slide fallback; skip trace anatomy and the topology detour.

Live budget: 85 seconds.

**Nikola:** Here's the order the customer has been waiting for. We can follow its service calls and its PostgreSQL price query in one trace. Nobody had to edit those applications to get us this starting point.

**Tyler:** Look how the question we are investigating changed now that we have data. We are no longer asking "Why is our application slow?". Now we can focus specifically where this particular request was slow and ask "Why is this one service slow?" Let's find out.

**Nikola:** Look at this failed connection from Checkout. About two seconds go here. Then the price lookup succeeds and the rest of the order carries on. The request is successful, but the customer had to wait because of that failed attempt.

**Tyler:** Our investigation question can now be even more specific. Why does Checkout try a connection that fails before it does the work that succeeds? We need to connect this call to what Checkout is doing.

## 05 · Add Java zero-code instrumentation

Inspect deployment configuration, attach the Java agent and restart the same application image. The named pricing method comes from the prepared demo configuration, not from OBI or a source-code inspection.

Live budget: 120 seconds.

**Tyler:** To do that, we'll first show how this looks using the traditional OpenTelemetry's Java agent to get HTTP and database spans from inside the service. Here we can see the update needed for Checkout's Deployment configuration. The agent loads when Java starts, so this is a deployment change and a restart.

**Nikola:** We do still have to get the agent into the workload, tell Java to load it, and set up where the data goes. Those are the steps required, I need to understand this service, and actually having enough information to do it.

**Tyler:** Let's roll out the patch. The patch supplies the agent, sets the service name and exporter, and adds a span around the pricing method named in our demo configuration. Checkout is restarted with the same application image. Now let's see what that failed connection was doing.

**Nikola:** Keep those steps in mind. We made this happen for one service we know. We'll come back to what happens when the other teams need the same thing.

## 06 · A failed attempt before a working fallback

Show the actual HTTP span error.type and exception event before calling the failure a timeout; return to the successful price lookup.

Live budget: 60 seconds.

**Tyler:** Back in Grafana, we can look at the details of a problematic Checkout span for PricingEngine.calculate. It contains the failed HTTP call, followed by the successful product-price lookup. Now we can see which operation is making the call, and the fallback that lets the order finish.

**Nikola:** And here's why we can call it a timeout. The error type is SocketTimeoutException. The exception event says, "Connect timed out". Checkout spends two seconds trying to connect, then finds the price another way. The customer gets an order, with two seconds of unnecessary waiting attached.

**Tyler:** Perfect, our telemetry is already providing value. Now we have something better than, Checkout is slow. We have the call, the reason it failed, and the path that worked. Let's find out why this instance is still trying that old address.

## 07 · Remove the stale endpoint setting

Show the real Checkout resource attribute identifying the stale endpoint. Remove that environment variable and roll the same image; bring the owning team a configuration PR backed by the customer trace.

Live budget: 90 seconds.

**Tyler:** There it is: LEGACY_PRICING_URL, in Checkout's resource attributes. Its value matches the failing call. This instance is still configured to try a retired backend before it uses the working product store. An old setting is adding a wait to every order.

**Nikola:** Think about the conversation we can have with the owning team now. Customers are losing two seconds here. This connection times out. Here's a configuration PR that removes the unused endpoint. The instrumentation gave us enough context to help with a fix, instead of just sending another team a slow-service alert.

**Tyler:** Let's make that change. Remove LEGACY_PRICING_URL from the Deployment and roll Checkout. Same application image, same Java agent, same exporter. We don't need an application rebuild to stop calling the retired backend.

**Nikola:** The rollout is ready. Let's go back to the customer. What does the next order look like?

## 08 · The next checkout skips the failed call

Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.

Live budget: 50 seconds.

**Tyler:** Here's the new trace. The product-price query is still there. The failed legacy call is gone. Pricing can get on with finding the price, without waiting for that old connection to time out first.

**Nikola:** If we follow the request through Inventory, the commerce branches, and the order write. We can see that the customer gets a faster checkout because we're no longer waiting for a backend that isn't there. Nothing else changed.

**Tyler:** That's the moment we wanted. The same checkout has a shorter path through it, and we can show exactly why. Let's see whether that improvement holds across more requests.

## 09 · The wait is gone

Show actual Grafana screenshots of OBI mean Gateway GET /checkout duration before and after the fix, using equal 120-second windows. These metric means are distinct from the matched-request trace medians retained for the closing callback.

Live budget: 35 seconds.

**Tyler:** OBI's request-duration metrics show the average checkout falling from about two-point-two seconds to a hundred and sixty-five milliseconds. This validates the fix. The customer is no longer waiting for a retired backend to time out. The instrumentation gave us enough context to find the problem, and to validate the fix.

**Nikola:** That summary supports the trace we just saw, this was quite useful. Now, how do we make the same diagnostic detail available to the other teams?

## 10 · One fixed. Thirteen to equip.

Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.

Live budget: 40 seconds.

**Nikola:** We have our fix, but we had to arrange the Java agent setup before we could get those details. Could you do the same for the thirteen other supported services?

**Tyler:** I was hoping you would ask. We know how to do this one service at a time. Now we need a way to make that useful across the application, without thirteen separate instrumentation projects.

## 11 · OpenTelemetry Injector

Preview the Injector as the shared runtime-loading mechanism, then explicitly introduce the upstream Operator as the established Kubernetes approach to compare before the RIO demo.

Live budget: 45 seconds.

**Tyler:** To help scale this work, we'll use the OpenTelemetry Injector. It's a shared library that runs when a compatible process starts, detects the runtime, and loads the matching language agent. We prepare the library and agents together so teams can use a shared setup.

That's the mechanism for the thirteen supported services; the four Go services keep OBI.

But the Injector isn't a Kubernetes rollout controller. Before we show how we're going to deploy it, let's look at the established approach with the upstream OpenTelemetry Operator. What would the platform still have to configure?

## 12 · The annotation is the easy part

Walk through the upstream Operator baseline, including existing namespace opt-in, to show the runtime decisions, application constraints and coordination work a shared setup must address.

Live budget: 135 seconds.

**Tyler:** The Operator can inject language agents, and it supports opting in a workload or an entire namespace. That's a useful starting point. Let's walk through a Python API owned by another team and see what the platform still needs to know.

**Nikola:** Which Python, which base image, and who has the Dockerfile? That's where I'd start.

**Tyler:** This image uses musl, so we add the Python platform setting. Native wheels also depend on the Python version. Dot net has a runtime identifier; Ruby has separate support and enablement checks.

**Nikola:** So the value comes from the application's image. It isn't something the platform team can safely guess.

**Tyler:** Now the pod also has a dot net worker. We name which container gets Python and which gets dot net, and choose the worker's runtime. Multi-instrumentation must be enabled in the Operator.

**Nikola:** And those are container names. They tell us nothing about the processes running inside.

**Tyler:** Suppose api starts both Python and Node. The Operator's multi-instrumentation feature doesn't support two language instrumentations inside one container. We need the application team to inspect that startup or change the packaging.

**Nikola:** Another annotation isn't going to answer that.

**Tyler:** Or Python starts in isolated mode, with site initialization disabled. The Operator sets PYTHONPATH, but this process ignores that environment and skips the startup hook. The pod can be healthy without the agent loading.

**Nikola:** Now we need the actual entrypoint. A namespace policy can't make the program honor that hook.

**Tyler:** Then check payload compatibility, permissions, existing agents and Collector access. Restart the workload, respect its release constraints, and confirm the instrumentation actually loads and exports.

**Nikola:** The typing takes minutes. Finding the owner, checking the image and arranging a release can mean hours of work and days of waiting. The Operator handles injection; we still have to supply and maintain the runtime choices. Can we prepare more of that once, instead of reopening it for every service?

## 13 · Install the namespace-driven controller

Explain why this demo chooses the Injector plus RIO after the Operator comparison. Show the shared bundle, runtime selection and rollout responsibilities, retain compatibility work, and keep the upstream path open.

Live budget: 90 seconds.

**Tyler:** That's why this demo uses the Injector with RIO, rather than the upstream Operator. We package the supported agents together, let the Injector choose at process startup, and use RIO to select workloads and manage the rollout. RIO is the Runtime Instrumentation Operator in OTelX, purpose-built for this talk.

**Nikola:** The upstream Operator already supports namespace selection. The difference we're exploring is how much runtime configuration can live in the shared setup. We'd like this workflow to find an upstream home, in the Operator or another form. RIO demonstrates that idea; its upstream path is still open.

**Tyler:** Let's install the controller. It builds on Jack Berg's prototype. The platform prepares the agent bundle, exporter and exclusions once; RIO handles selection and rollouts. The Injector loads the matching agent in each compatible process.

**Nikola:** Compatibility tests, startup constraints and exceptions still need owners. The platform maintains that shared path. Once it's ready, an application team can ask for coverage without figuring out a separate language-agent installation for every service.

## 14 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 105 seconds.

**Nikola:** Instrument demo-apps. One namespace rule. We haven't listed the thirteen services or assigned an agent to each one. The Injector handles the runtime choice within the supported bundle, and RIO handles getting it into the selected workloads.

**Tyler:** Apply it, and the controller rolls the selected workloads. The Injector supplies the agents for supported runtimes. If another compatible service is deployed here later, it inherits the policy. That team doesn't need to arrange its own instrumentation rollout first.

**Nikola:** There they are. Checkout keeps its direct agent. Thirteen more services gain language detail. And the four Go services keep OBI. We didn't have to visit each service to make that happen.

**Tyler:** OBI is still running alongside them. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI service by service as those agents arrived.

**Nikola:** So when the next team has a slow request, the details will already be there. The platform maintains the shared setup. The application team can start with its question.

## 15 · Open language detail in more services

Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.

Live budget: 60 seconds.

**Tyler:** Let's check a fresh order. We can still follow it across the application. Now more of those services have the detail we had to set up by hand for Checkout.

**Nikola:** Open Catalog. These are database spans from its Java agent. The same enrollment covers the Node, Python, Ruby, and dot net services. If a team needs to understand a database call, it can open that detail instead of first asking how to install an agent.

**Tyler:** We haven't fixed a problem in every service. We've given the other teams a way to start looking. Checkout keeps its fix, and the next investigation can begin closer to the answer.

## 16 · Reuse the workflow after day one

Cover onboarding, updates, consistency, recovery, training and shared upkeep.

Live budget: 50 seconds.

**Tyler:** Now an agent release arrives next month. Do all thirteen service owners need another task and another rollout? And what happens when a new service appears?

**Nikola:** The shared approach gives us a place to handle that work together. Compatible new services inherit the policy. Agent updates use the shared rollout path. Settings and recovery instructions have one place to improve.

**Tyler:** A service can still change runtimes, or need an exception. OBI can keep the baseline for supported traffic, while the available language detail depends on the runtime. Someone still has to look after those cases.

**Nikola:** Yes. The platform owns compatibility checks, updates, and recovery. We include that work in the cost. The saving comes from avoiding the same job being repeated across teams.

## 17 · Make coverage the default

Compare one central enrollment and inherited coverage with a team-by-team long tail; explain aloud that the paths are conceptual, not observed adoption data.

Live budget: 50 seconds.

**Nikola:** This is a sketch of what that can mean for coverage. One team gets instrumentation done. Another has a release freeze. A third is busy with something else. Months can pass with the application only partly covered.

**Tyler:** And the application doesn't wait for the project to finish. Add a service, or rewrite one from Java to Python, and coverage can fall again. The finish line moves while the teams are still catching up.

**Nikola:** With the namespace policy, one rollout covers the eligible services in scope, and compatible new workloads inherit it. We still test and maintain that shared path. But each team doesn't have to find room for another onboarding project before its service is covered.

## 18 · The cost of team-by-team ownership

Keep the cumulative setup/upkeep comparison in the same 18-service demo. Step up at each monthly release: 9.75 distributed hours versus 0.75 central hours. Over two years, show 266.5 versus 19.5 hours and emphasize 247 engineering hours freed, with their $24,700 assumed labor value secondary.

Live budget: 60 seconds.

**Tyler:** Here's what repeating the work can cost in our eighteen-service example. After Checkout, thirteen services still need language instrumentation. These steps cover their setup and two years of monthly agent updates. Every jump is another release to handle.

**Nikola:** On the distributed path, the service owners arrange that work separately. On the centralized path, we set up the namespace once and share each update. That lower line still includes maintaining the shared approach.

**Tyler:** The difference is two hundred and forty-seven engineering hours over two years. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. That's time people could spend on the next customer problem, rather than repeating this setup and upkeep.

**Nikola:** Those are assumed hours for this example, not measured cash savings. Put in your own setup and support costs. We haven't put a dollar value on the calendar time spent waiting for another team's release.

## 19 · OpenTelemetry. Ready to install.

Close with the measured customer improvement and namespace coverage: OpenTelemetry has grown beyond APIs and SDKs into instrumentation users can install for services and clusters. Leave the demo and RIO QR codes visible.

Live budget: 50 seconds.

**Tyler:** Remember the customer waiting at the start? OBI helped us find the failed connection. The Java agent showed the pricing call and its fallback. The resource attributes exposed the retired endpoint setting. Remove that setting, roll the same image, and the next trace shows the wait has gone.

**Nikola:** Then one namespace choice made language detail available across the supported services. RIO demonstrates the shared workflow we'd like to bring upstream. The next team should be able to open a trace and start investigating, without repeating our setup first.

**Tyler:** OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service, or across a cluster, and use to find what's keeping a customer waiting. That's what makes all this setup worthwhile: we can get from their problem to something we can fix.

**Nikola:** Find the wait, fix the cause, and make the next investigation easier. Thank you. Let's take your questions.
