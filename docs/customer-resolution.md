# Resolve the customer's waiting time

The talk follows one customer problem through an actual action and a measured
result. Finding a trace or naming a method is an intermediate step. The two
outcomes are a faster checkout now and a shared way to investigate the next slow
service without repeating the instrumentation setup.

## The story and its evidence

1. **The customer waits.** The historical opening exemplar is a real 306.26 ms
   request. Do not invent a production complaint, revenue loss or service target.
2. **The broad view earns the service choice.** OBI shows that Checkout spends
   its first 151.78 ms before its first outbound call. Neither a long parent bar
   nor a dependency's inclusive time is the reason to select a service.
3. **The local wait has a name.** Explicit Java-agent method inclusion exposes
   `PricingEngine.calculate` at about 150 ms. The agent also supplies the useful
   Hibernate/JDBC detail already in the talk. The customer is still waiting.
4. **The cause is actionable.** The demo deliberately seeds `Thread.sleep(150)`
   in that method. Reveal this plainly. Remove the wait in the separate fixed
   application source while retaining the price. Installing instrumentation
   does not optimize the application.
5. **Return to the customer request.** A fresh matched comparison measures a
   359.9 ms median before the application fix and 226.2 ms after it. Pricing
   falls from 150.2 ms to 0.06 ms. Let the visual result land before continuing.
6. **The next team needs the same capability.** Direct setup required runtime
   knowledge, access, configuration and a deployment. Equip thirteen more
   supported services through one namespace rule, retaining four Go OBI paths.
   Existing upstream namespace opt-in is acknowledged. The fresh fleet trace
   comes from the fixed application, so the story does not silently restore the
   slow pricing method after claiming to resolve it.
7. **Close both loops.** The customer waits less; the other teams start with
   useful diagnostic detail. Coordination, centralized upkeep and hypothetical
   dollars explain the operational value without turning the measured latency
   result into an unsupported financial claim.

The source reveal, real deployment and measured customer payoff are three new
native slides, represented by two added animation scenes. All previous OBI,
agent, upstream Operator, custom injector, fleet, lifecycle and dollar content
is retained. Shorter orientation and transition budgets keep live content at
21 minutes, plus one minute flex and three minutes questions. Narration remains
at the original voice performances' natural pace.

## What was measured

The canonical evidence is [resolution.json](../presentation/data/resolution.json).
The historical opening request and the fresh matched comparison are different
observations. Do not compare the old 306.26 ms example directly with a selected
new request and call that a controlled performance result.

For each version, first perform 20 consecutive successful warmup requests, then
30 sequential successful requests with a 100 ms pause between them. Measure
Gateway server-span duration, rather than browser/client overhead. Use medians
from all 30 requests. Both batches have the same direct Checkout Java agent,
method inclusion, exporter configuration and application dependencies. The
Kubernetes Pod template matches exactly after removing the image field. The
only deployment change is the application image carrying the pricing fix.

Every request passes the existing full-flow checker: price 42, inventory success,
new order ID, all 15 commerce services plus Gateway/Checkout/Inventory, PostgreSQL
reads/writes and Redis work. Every exported trace includes all 18 application
services, both database dependencies and exactly the Checkout SDK at this stage.
The pricing span is correlated to its own request, not selected from another
trace. Builds, recording and narration synthesis are stopped during measurement.
No failed measured requests are discarded. Warmup observations remain in the
private capture evidence.

This is a local demonstration of a deliberately seeded wait, not a production
benchmark, general latency prediction, throughput test or claim that all
remaining checkout work has disappeared. The approximately 134 ms difference
between request medians need not equal the approximately 150 ms removed method
wait: other request work varies. No outage, revenue or engineering-effort value
is inferred from these measured timings. Dollar assumptions remain separate in
[instrumentation-savings.md](instrumentation-savings.md).

Raw request rows, traces, deployment snapshots, command events and captures stay
inside ignored `.artifacts/story-resolution/` and `.artifacts/demo-capture/`.
The public JSON retains the per-request timing values and trace IDs needed to
inspect the arithmetic without exporting a kubeconfig or cluster credentials.

## Reproduce the resolution live

The default image and historical proof keep their original slow pricing source.
A build argument selects the fixed source only for the separately tagged image:

```sh
make -C demo pricing-fixed-image pricing-fixed-load CLUSTER=<demo-cluster>
kubectl patch deployment/checkout -n demo-apps --type=strategic \
  --patch-file demo/k8s/checkout-pricing-fixed.patch.yaml
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
```

Prepare the image before the talk. On stage, reveal the code change, deploy the
image, send fresh requests and revisit the trace/latency result. For the complete
local matched capture, use the isolated recording kubeconfig:

```sh
python3 scripts/presentation/measure_resolution.py before
# Apply the fixed image and wait for readiness; stop recording before sampling.
python3 scripts/presentation/measure_resolution.py after
```

These capture commands assume localhost Gateway 18080 and Tempo 13200, and the
direct-agent-only stage of the story. They validate the full response and trace
before producing a result. They do not change the user's default kubeconfig.
Afterward, perform the existing namespace enrollment and open the fixed fleet's
Catalog detail. To repeat the slow example, restore
`far-wide-demo-checkout:local` on the isolated demo's Checkout deployment.

Run `npm run resolution:build` after changing the captured evidence and
`npm run resolution:verify` before delivery. The native slides and review movie
consume the same data. Only silent curated demo clips may be versioned;
synthetic Tyler/Nikola narration and movies stay ignored and local.
