# Presentation scene plan

The editable visual review is [storyboard.html](../public/storyboard.html).
Live content is 20 minutes 45 seconds, with 75 seconds of live flexibility
and three minutes for recovery/questions.
The script uses natural speech. Silent fallback recordings support the live
sequence. The local narrated review is regenerated from this same script.
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

Live budget: 45 seconds.

**Tyler:** Welcome everyone. I'm Tyler Yahn.

**Nikola:** And I'm Nikola Grcevski.

**Tyler:** Imagine you've clicked Place Order. Now you're waiting. Did it work? Should you click again? Our checkout succeeds, but the customer waits more than two seconds. We're going to find that wait and remove it.

**Nikola:** Then we'll make the same diagnostic detail available to the other teams, without repeating the agent setup for every service. First, let's follow the order.

## 02 · 18 services. One customer request.

Orient in the actual application without selecting a culprit.

Live budget: 30 seconds.

**Tyler:** The request enters through Gateway, reaches Checkout and Inventory, then fans out through the commerce services. Eighteen applications, plus PostgreSQL and Redis. We know the route; we don't yet know which part is making the customer wait.

**Nikola:** And the customer shouldn't need to know. Let's see the request before we choose a service to investigate.

## 03 · OBI

Introduce OBI before its acronym is used: eBPF observations of running Linux applications, zero app changes/restarts, traces and metrics. Show deployment only after explaining its value.

Live budget: 85 seconds.

**Tyler:** We'll start with OpenTelemetry eBPF Instrumentation, or OBI. Deploy it on the Linux nodes and it generates OpenTelemetry traces and metrics for supported applications. No application code changes and no application restarts. That's a pretty good way to meet eighteen services you haven't instrumented yet.

**Nikola:** If you joined us in Atlanta last year, you'll recognize the idea. OBI is now version one and generally available. The previous talk is linked here. Today, we're using that broad view as the starting point for an investigation.

**Tyler:** Let's deploy OBI and send an order. The application keeps running while we add visibility.

**Nikola:** One deployment on the nodes. Let's open the request we just sent.

## 04 · Find the two-second wait

In live Grafana, find the failed two-second Checkout connection and ask why a successful order makes that attempt. Keep one actual waterfall as fallback; skip trace anatomy and the topology detour.

Live budget: 50 seconds.

**Nikola:** Here's that order in Grafana. We can follow the service calls and database work without changing those applications.

**Tyler:** Now look inside Checkout. Where does most of the customer's wait go?

**Nikola:** This failed connection takes about two seconds. The order still completes, but the customer waits for a failed attempt first.

**Tyler:** Why is Checkout making that call? OBI has shown us where to look. Let's add the Java agent to connect the failed call to the work inside the service.

## 05 · Add Java detail to Checkout

Inspect deployment configuration, attach the Java agent and restart the same application image. The named pricing method comes from the prepared demo configuration, not from OBI or a source-code inspection.

Live budget: 120 seconds.

**Tyler:** Here's the direct setup. Supply the Java agent, tell Java to load it, set the service name and choose the exporter. We also configure a span around the pricing method. The agent supplies the HTTP and database detail; it doesn't invent a span for every method.

**Nikola:** We know this service and have access to its deployment. Even then, somebody has to arrange the agent and startup settings. Java loads the agent when it starts, so this requires a rollout.

**Tyler:** Let's apply the prepared patch. The payload image is already available; this step changes the Deployment, not the application image.

**Nikola:** Now we send fresh traffic. Adding instrumentation hasn't fixed the delay. It should explain it.

## 06 · The failed call timed out

Show the actual HTTP span error.type and exception event before calling the failure a timeout; return to the successful price lookup.

Live budget: 65 seconds.

**Tyler:** The new trace has PricingEngine.calculate, the method we configured. Inside it: the failed HTTP call, then the successful product-price query. We can now name the operation and see its fallback.

**Nikola:** The span says SocketTimeoutException. Its exception event says Connect timed out. Two seconds trying the wrong address, then the fallback gets the price.

**Tyler:** So the order works. We just make the customer wait for a backend that isn't answering. Let's look at the setting behind that address.

## 07 · Remove the stale endpoint setting

Show the real Checkout resource attribute identifying the stale endpoint. Remove that environment variable and roll the same image; bring the owning team a configuration PR backed by the customer trace.

Live budget: 110 seconds.

**Tyler:** We expose this deployment setting as a resource attribute: LEGACY_PRICING_URL. Its value matches the failed call. We know this backend was retired; this instance still tries it before the working product store.

**Nikola:** Now we can help the owning team with more than a slow-service alert. Customers are losing two seconds here; here's the trace and a configuration PR that removes the old setting. We can bring them a fix based on what the application is actually doing.

**Tyler:** Let's remove the setting and roll Checkout. Same application image, same Java agent, same exporter. No rebuild.

**Nikola:** The rollout is ready. Back to the customer: let's send a new order and open its trace.

## 08 · The next checkout skips the failed call

Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.

Live budget: 50 seconds.

**Tyler:** Here's the new waterfall. The failed legacy call is gone. The product-price query is still there, and the order continues through the application.

**Nikola:** That's better. The customer gets their order without waiting for a backend we've already turned off.

**Tyler:** We didn't make the timeout less visible. We removed the unnecessary call. Let's compare the request-duration metrics too.

## 09 · The wait is gone

Show actual Grafana screenshots of mean Gateway GET /checkout duration over equal 120-second windows. Repeat these means in the closing; retain the separate matched-request medians as measurement evidence.

Live budget: 30 seconds.

**Tyler:** These captured Grafana windows show the average checkout dropping from about two-point-two seconds to a hundred and sixty-five milliseconds. They're a repeated-request comparison, alongside the fresh trace we just opened.

**Nikola:** A customer gets their two seconds back. Good. Now what about the other teams?

## 10 · What about the other 13?

Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.

Live budget: 30 seconds.

**Nikola:** We arranged the Java setup for Checkout because we knew the service and had access. Thirteen other services can use language agents. Who's arranging those?

**Tyler:** I'd rather not schedule thirteen versions of that meeting. We'll use the OpenTelemetry Injector. First, let's look at what the established Kubernetes Operator workflow still needs from the platform and application teams.

## 11 · The annotation is the easy part

Walk through the upstream Operator baseline, including existing namespace opt-in, to show the runtime decisions, application constraints and coordination work a shared setup must address.

Live budget: 90 seconds.

**Tyler:** The upstream OpenTelemetry Operator can inject agents, with opt-in on a workload or a namespace. But the platform still needs application facts. This Python image uses musl; its Python version and native packages must match the payload.

**Nikola:** Which image, which runtime, who has the Dockerfile? The application team usually knows. The annotation doesn't answer those questions.

**Tyler:** Add a dot net worker and we also need per-container language mappings and its runtime settings. If a container starts multiple languages, or an entrypoint ignores the injected environment, more YAML alone won't make that work.

**Nikola:** That's where a small deployment change can turn into hours of investigation and days waiting for an owner or release. The Operator helps with injection. We'd like to prepare more of the routine runtime setup once, and share it.

## 12 · OpenTelemetry Injector

After the upstream Operator comparison, explain the Injector shared library and prepared agents inside compatible application processes. Separate runtime startup from Kubernetes workload management.

Live budget: 60 seconds.

**Tyler:** The Injector is the shared library in this diagram. It runs inside a compatible process at startup and loads the matching language agent. We prepare the library and supported agents together, instead of having every service team assemble a language-specific installation.

**Nikola:** It works at process startup; it doesn't manage Kubernetes workloads. We still need a controller to select the workloads and arrange the rollout.

## 13 · Install the namespace-driven controller

Explain why this demo chooses the Injector plus RIO after the Operator comparison. Show the shared bundle, runtime selection and rollout responsibilities, retain compatibility work, and keep the upstream path open.

Live budget: 90 seconds.

**Tyler:** For this talk, that controller is RIO: the Runtime Instrumentation Operator in OTelX. This demo uses the bundled prototype of that workflow, building on Jack Berg's work. RIO selects Kubernetes workloads and handles rollout; the Injector loads agents inside the processes.

**Nikola:** The idea we'd like to bring upstream is less routine runtime configuration for each team. RIO demonstrates it; the eventual upstream home is still open. Compatibility and unusual startup behavior still need owners.

**Tyler:** Let's install the controller. We've prepared the agent bundle, exporter and exclusions. No application namespace is enrolled yet.

## 14 · Instrument this namespace

Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.

Live budget: 90 seconds.

**Nikola:** Instrument demo-apps. That's the selection: one namespace. We haven't listed thirteen services or assigned a language to each one. The prepared bundle supplies the supported runtime choices.

**Tyler:** Apply it. RIO performs the rolling restarts for the selected workloads. Checkout keeps its existing direct agent, and the four Go services keep OBI. Compatible new workloads in this namespace inherit the policy.

## 15 · Language detail. OBI alongside it.

Keep one fleet result: fourteen language agents plus four Go/OBI services. Open actual Cart Ruby-agent detail and Currency OBI resource attributes in the same fresh request; skip replay after successful live proof.

Live budget: 90 seconds.

**Tyler:** Fourteen services now have language agents. The four Go services retain OBI. Let's open the result in a fresh order.

**Nikola:** Open Cart in this fresh request. These are Ruby-agent observations; we didn't arrange a separate Ruby installation for its team. Now open Currency: that Go service still uses OBI. Fourteen language agents, including Checkout, and four services with OBI.

**Tyler:** As the SDKs start exporting, OBI recognizes them and steps back from tracing those processes. We leave it running for the services that still need it.

**Nikola:** So the next team can start with its question. Useful detail is already there. That is the result of the namespace rollout.

## 16 · Maintain once. Roll out together.

Explain shared onboarding and monthly update ownership, with compatibility, exceptions and recovery still maintained by people.

Live budget: 45 seconds.

**Tyler:** An agent update next month shouldn't mean another setup project for thirteen teams. The platform can update the shared bundle and use the same rollout path. Eligible new services inherit the namespace policy.

**Nikola:** Compatibility tests, exceptions and recovery remain real work. We centralize ownership of that shared path. The saving is avoiding the routine setup and updates being arranged independently over and over.

## 17 · Make coverage the default

Compare one central enrollment and inherited coverage with a team-by-team long tail; explain aloud that the paths are conceptual, not observed adoption data.

Live budget: 45 seconds.

**Nikola:** This is a sketch of language-agent adoption across eligible services. With team-by-team work, one team finishes; another has a release freeze. Add a service or rewrite one in another language, and the gap can open again.

**Tyler:** The centralized path covers the eligible services in one rollout, before that first team-by-team increment. New compatible services inherit it. We still maintain the shared path, but routine enrollment doesn't wait for a separate project in every team.

## 18 · The cost of repeated setup and upkeep

Keep the cumulative setup/upkeep comparison in the same 18-service demo. Step up at each monthly release: 9.75 distributed hours versus 0.75 central hours. Over two years, show 266.5 versus 19.5 hours and emphasize 247 engineering hours freed, with their $24,700 assumed labor value secondary.

Live budget: 60 seconds.

**Tyler:** Here's an example for this same eighteen-service application: the thirteen remaining agent setups and two years of monthly updates. Each step is another release to handle. Distributed owners repeat that work; the centralized path shares the setup and update rollouts.

**Nikola:** The modeled difference is two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. Time for the next customer problem.

**Tyler:** These are assumed setup and rollout hours, not measured cash savings or a complete platform budget. Put your own support and testing costs into the worksheet. We haven't priced the calendar time waiting for other teams.

## 19 · OpenTelemetry. Ready to install.

Close with the measured customer improvement and namespace coverage: OpenTelemetry has grown beyond APIs and SDKs into instrumentation users can install for services and clusters. Leave the demo and RIO QR codes visible.

Live budget: 60 seconds.

**Tyler:** We started with a customer waiting for an order. OBI showed the failed connection. Java detail named the pricing operation. We found the old endpoint setting, removed it, and opened a new trace to see the wait disappear.

**Nikola:** Then one namespace choice added language detail across the supported fleet. The next team shouldn't have to repeat our setup before investigating. RIO demonstrates the shared workflow we'd like to bring upstream.

**Tyler:** OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service or across a cluster, then use to find what's keeping a customer waiting—and do something about it.

**Nikola:** Find the wait. Fix the cause. Make the next investigation easier. Thank you.
