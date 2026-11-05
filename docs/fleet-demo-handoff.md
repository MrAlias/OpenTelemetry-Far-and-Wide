# Live sequence and capture handoff

The current operational guide is [the presentation run sheet](../demo/README.md).
It covers prebuilding/loading every image, resetting the application, the ordered
live commands, fresh trace selection, elapsed-time gates and fallback routes.
Do not combine it with commands from earlier prototype notes.

The live budget is **20:45**, with 1:15 flexibility and three minutes for recovery
and questions inside the 25-minute session. The deck has 23 slides. Full dialogue
is in the speaker notes; the Operator comparison has three grouped states.

## Protect the two results

Follow the customer order with OBI, choose Checkout from the failed connection,
then add the direct Java agent. Show the configured method, actual timeout fields
and the explicitly exported stale setting. Remove that setting, roll the same
image and open a new waterfall before showing the captured metric comparison.

After the upstream Operator comparison and Injector explanation, install the
bundled RIO demo controller, then enroll `demo-apps` with one namespace rule.
Open Cart’s Ruby-agent observations and Currency’s Go/OBI resource attributes in
one fresh order. Fourteen language-agent services include direct Checkout;
thirteen were enrolled by the controller. The four Go services retain OBI.
After successful live proof, return directly to slide 20 instead of replaying
separate fleet overview/detail slides.

## What the components do

- The upstream Operator already supports workload **or namespace** language-specific
  opt-in. Application image, runtime, container and startup facts remain necessary.
- The Injector shared library loads the matching supported agent **inside the
  process at startup**. The prepared payload supplies its agents. This mechanism
  works in compatible containers too; it is not restricted to non-Kubernetes hosts.
- The bundled demo controller selects workloads and performs rolling restarts.
  It retains the `demo.opentelemetry.io` API snapshot. [RIO](https://github.com/otelx/rio)
  is the talk-specific workflow demonstration, not the upstream Operator or a
  promised upstream release. We want this capability to find an upstream home;
  implementation and agreement remain open.

The base configuration prepares payload, export and exclusions. The live change
is `demo/k8s/instrument-demo-namespace.patch.yaml`, not a positive service list.
Compatible future workloads inherit selection. Compatibility checks, unusual
startup behavior, release qualification and recovery still need owners.

The Ruby baseline uses `Bundler.require(*Rails.groups)` after loading Rails
components, allowing the upstream bootstrap hooks to observe normal framework
initialization. No custom Ruby protocol probes were added for the talk.

## November 4 capture set

The recorded sequence used the official **OBI v1.0.0** image on the dedicated
`kind-far-wide-recording` cluster. OBI excludes PostgreSQL/Redis server processes;
application-side database observations remain and the stores stay on the map.
Selected traces contain all eighteen applications. Selection rejects old stages,
partial exports, datastore-server resources and transitional SDK/OBI overlap.
The initial SDK-export transition is not claimed to be overlap-free at every
instant. These are preparation checks, not audience narration.

Actual terminal and Grafana recordings supply the seven active silent fallbacks
listed in `public/presentation/manifest.json`. Long readiness waits are cut with
an explicit card; commands and results remain at 1×. Media contains no audio
stream. Full generated narration and voiced films remain local and ignored.

Sources live in `public/demo-capture/`; curated portable deck assets live in
`public/presentation/`. Raw traces, terminal events, frames, browser profiles,
logs and the private kubeconfig stay in ignored `.artifacts/`. Use
`scripts/presentation/capture_terminal.py`, `capture_browser.mjs`,
`edit_terminal_captures.py` and `sync_assets.py` for the same capture pipeline.
Never put assets or working files in a system temporary directory.

The recording cluster uses its own kubeconfig at
`.artifacts/demo-capture/kubeconfig`, with forwards Gateway 18080, Grafana 13000,
Tempo 13200 and Prometheus 19090. It does not change the default user context.
Normal live-demo ports and instructions are in the run sheet. The disposable
recording control-plane may be stopped after capture to free resources for media
work. Restart it with `docker start far-wide-recording-control-plane`, wait for
readiness using its private kubeconfig, then recreate those port-forwards.
Other local clusters are unaffected.

## OBI parent-link qualification

The official v1.0.0 baseline captures all eighteen applications, but some .NET
server observations have no parent before language agents are added. An isolated
.NET parent test passed in both header-only and network modes; it does not prove
the full-topology case fixed. Nikola may have the fixes in a local branch; no
such commit/image was available during this revision. Use `DEMO_OBI_IMAGE` with
an explicitly built/pulled image when it is supplied, prepare it, and recheck all
branches. The helper records the actual deployed image rather than assuming the
default. Do not announce this limitation as repaired.

The actual Checkout failed-call/fix evidence remains valid. Its post-fix clip is
a crop of the native waterfall, enlarged around Checkout and the successful
product-price query. Full source frames remain in the local capture archive.
The final language-agent/Go-OBI trace has one connected application graph.

## Keep the numbers separate

The fresh recorded post-fix waterfall retains the product lookup and order path,
without the failed attempt. `configuration-fix` provenance verifies that only
`LEGACY_PRICING_URL` changed and the resolved image and instrumentation stayed
identical. The launcher intentionally exports this one non-secret setting;
the agent is not claimed to discover arbitrary environment variables.

The Grafana metric screenshots retain the November 2 matched two-minute windows:
**2.21 s → 165 ms mean Gateway request duration**. Slide 12 and the closing repeat
those means. The separately retained 30-request trace medians are **2.22 s →
185 ms**. Neither historical comparison is the exact measurement of the latest
live order. See [customer resolution](customer-resolution.md).

The engineering-capacity chart remains a hypothetical setup/monthly-upkeep
scenario, not a measured cost or telemetry-bill result. Agent upgrades have a
shared interface, documented in the run sheet, but the primary demo does not
claim an unshown live upgrade. See [the model](instrumentation-savings.md).
