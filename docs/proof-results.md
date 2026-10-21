# Coexistence proof results

Experiment date: 2026-10-06, America/Los_Angeles. The executable
[specification](demo-spec.md) and [harness](../demo/proof/README.md) are implemented.
This report describes real requests, admitted Kubernetes pods, and recorded OTLP
output from a dedicated kind cluster.

This preserves the original rolling experiment and its counterexamples. The
[reliability follow-up](reliability-results.md) describes the revised handoff and
its independent evidence.

**Original result: the three steady states work in the tested topology. The simple rolling
handoff does not meet the continuity and availability gate.** Do not present this
original prototype as a completed integration. The follow-up records the revised
serial-load demo separately.

## What ran

The experiment used Go gateway → Java checkout → Node.js inventory over direct
plaintext HTTP/1.1. The applications have no telemetry dependencies or manual
context forwarding. Checkout's ordinary `PricingEngine.calculate` method has a
150ms local delay. The load generator supplies and records a unique trace context
for each request; the application does not forward that header itself.

The actual OpenTelemetry Operator injected Java agent 2.30.0 through pod admission.
Recorded SDK telemetry reports **SDK 1.64.0**. A custom agent embeds OBI v0.14.0's
checksum-verified release-generated source, uses per-process dynamic selectors,
and preserves OBI RED metrics while giving Java SDK processes ownership of traces.
The Collector is contrib 0.160.0. The kind node runs Kubernetes 1.33.2 on the
host's Linux 7.2.8 kernel. These versions describe the tested environment, not
a general compatibility certification.

The central runner changed checkout's live injection annotation. Neither its
application image nor its application source changed between instrumentation
states. All five original captures have identical application-source hashes and
runtime application image IDs. The Go and Node pod UIDs remained unchanged during
both rollouts. The checkout pod UID changed each time; the depth pod has the
Operator's Java init container, and the restored breadth pod does not.
See [image and rollout evidence](evidence/coexistence-2026-10-06/summary.json).

## Observed results

The table uses complete raw telemetry collected after the documented OBI HTTP
finalization interval. Every request, including failed requests, is counted.

| Stage | Requests | HTTP 200 | Requests passing all checks | Verdict |
| --- | ---: | ---: | ---: | --- |
| Initial OBI breadth | 20 | 20 | 20 | Pass |
| Roll to Java SDK depth | 80 | 80 | 71 | Fail: nine successful requests have missing checkout spans |
| Steady SDK depth | 40 | 40 | 40 | Pass |
| Roll back to OBI breadth | 80 | 78 | 65 | Fail: thirteen successful requests have missing spans; two HTTP 502s |
| Restored OBI breadth | 20 | 20 | 20 | Pass |

The three steady states have the expected end-to-end parent chain for every
measured request. Gateway and inventory request spans are owned by OBI; checkout
request spans are owned by OBI in breadth and Java SDK in depth. OBI's legitimate
`processing` spans sometimes sit between a server and its client span. The
validator follows those exported same-service parents explicitly.

All **40 depth requests** include exactly one correlated
`PricingEngine.calculate` internal span. Its measured duration ranges from
**150.123ms to 150.435ms**. All **40 original steady breadth requests** have no such
span. No duplicate application request roles were observed in these samples.
This demonstrates the chosen configuration-only depth mechanism and its removal
for this workload; it does not establish arbitrary business telemetry or other
frameworks.

OBI-owned `http.server.request.duration` histograms with HTTP 200 attributes and
increasing counts were recorded for all three services in every stage. This
establishes retained baseline metric output. It does not establish uninterrupted
metrics during a rollout: the replacement JVM's instrumentation attachment lags
its application readiness, and some observed metric counts are lower than the
attempted request count.

The corrected capture tool was also exercised on a fresh 20-request breadth sample
with a bounded **20-second drain**. It passed 20/20 trace, metric, and recorded-pod
checks. It used the fixed 20-second wait followed by snapshot retries, rather
than an exact 20-second total acquisition latency. That additional sample validates the collection correction independently
of the longer historical snapshots.

## The rollout counterexamples

Adding depth produced nine HTTP 200 requests that did not contain the required
checkout spans in the recorded request trace. One example is trace
`2fe2d18a16b9cb65e3c7a2c7d188a2fa`, request index 28 in the transition capture.
Its gateway and inventory observations exist, but the checkout SERVER and CLIENT
observations are absent. The process-ownership record at that request shows both
the old OBI-owned JVM and the new SDK-owned JVM selected. Desired annotation and
process membership therefore do not by themselves establish safe convergence.
[All add-depth failures](evidence/coexistence-2026-10-06/to-depth-report-long-drain.json)

Removing depth produced thirteen successful requests without the full application
trace chain, plus two HTTP 502 responses. For example,
`1abeabf081c0c694e328ceb418903c53` is a successful request at index 11 with no
checkout or inventory observations under the recorded trace ID. The two HTTP
failures are indices 9 and 10. Those failed requests are availability failures;
absent downstream request spans are not evidence that an operation actually
reached those downstream services.
[All removal failures](evidence/coexistence-2026-10-06/to-breadth-report-long-drain.json)

Agent logs record the new breadth JVM selected at approximately 17:31:34 UTC and
OBI attaching to it at 17:31:41 UTC. Requests were already being served during
that interval. This supports adding an instrumentation-readiness condition before
Service enrollment. It does not prove that attachment lag explains every missing
span, especially in the add-depth direction.

The failures persisted in the later raw snapshot, taken at least 116 seconds
after the removal capture's last request and 249 seconds after the add-depth
capture's last request. They are not explained by the short collection deadline.
Their complete root cause has not been established. Process lifecycle, overlapping
JVM instances, export selection, attachment readiness, and draining pending
observations need separate minimization before attributing a bug to an upstream
component.

## Collection and verifier corrections

The first validator required direct client-to-server ancestry and looked only at
the OTLP scope object. The raw OBI output contains legitimate `processing` parents
and a resource-level `otel.scope.name`. The validator was corrected to accept that
documented/observed structure while still rejecting missing parents, cycles,
duplicate request roles, wrong owners, and uncorrelated method spans. The original
first report is preserved in the initial-breadth archive.

The first capture waited only five seconds after traffic. That was too short:
OBI's generic HTTP tracer can finalize a lingering completed request after ten
seconds of inactivity, with a two-second polling interval. Re-reading the complete
raw output recovered the previously absent last steady-state request spans.
The [release implementation](https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation/blob/13d9b0c3f600a060bd78820a63ebec882b10757e/pkg/internal/ebpf/generictracer/generictracer.go#L1000-L1050)
supports the updated 20-second collection drain.

A subsequent collection caught the HTTP file sidecar reading during an append,
yielding an incomplete final JSON record. That attempt is retained as a capture
error, not labeled a telemetry failure. The tool now preserves incomplete attempts
and retries the entire snapshot within a bounded deadline. It never silently
removes a partial line or drops a failed trace to obtain a pass.

## Evidence and reproduction

The [summary](evidence/coexistence-2026-10-06/summary.json) contains the counts,
failure trace IDs, image/source invariance, observed collection intervals, and
archive SHA-256 hashes. The [evidence manifest](evidence/coexistence-2026-10-06/manifest.json)
hashes every saved artifact. Original capture archives preserve requests, raw
short-drain output, ownership samples, Kubernetes snapshots, logs, and reports.
The complete [long-drain raw snapshot](evidence/coexistence-2026-10-06/telemetry-long-drain.jsonl.gz)
is separately saved; it includes all original request trace IDs without filtering.

The corrected capture encountered nineteen incomplete append snapshots before a
complete twentieth snapshot. Those earlier snapshots are exact byte prefixes of
the final file. Their lengths and SHA-256 hashes are saved in
[the prefix index](evidence/coexistence-2026-10-06/bounded-drain-snapshot-prefixes.json),
and the archive includes that index plus the full final file. Reconstruct an
attempt as `telemetry.jsonl[:bytes]` and verify its hash. This preserves the exact
evidence without archiving nineteen redundant full prefixes; the original local
attempt files also remain available.

The initial full sample has a longer actual drain than the capture tool now
requires. `drain_seconds_observed` in the summary records those intervals rather
than pretending the historical samples used the final 20-second procedure.

To independently check an original capture, extract its archive and decompress
the common snapshot, then point the validator at both:

```bash
gzip -dc docs/evidence/coexistence-2026-10-06/telemetry-long-drain.jsonl.gz \
  > /tmp/far-wide-proof-telemetry.jsonl

# Extract the desired capture archive into a scratch directory first.
python3 demo/proof/scripts/analyze.py PATH_TO_EXTRACTED_CAPTURE \
  --mode breadth --telemetry /tmp/far-wide-proof-telemetry.jsonl \
  --output /tmp/far-wide-proof-rechecked.json

python3 demo/proof/scripts/verify_rollout.py PATH_TO_EXTRACTED_CAPTURE
```

Select `depth` or `transition` for the corresponding stage. Transition validation
exits nonzero on the saved counterexamples. The original `report.json` uses its
original short-drain snapshot; `report-long-drain.json` and this table use the
complete shared snapshot. Both are retained so the change in verdict can be
reproduced.

The validator's negative cases cover missing services/parents, cycles, duplicates,
missing or wrongly parented method depth, HTTP errors, stale/absent metrics,
and empty request sets. Bash syntax/ShellCheck checks and Python checks passed.
These checks support the harness; the live request evidence supports the
coexistence conclusions.

## What changes next

The next controller iteration needs instrumentation readiness and drain-aware
handoff, not just a Deployment annotation plus a selected PID. Its acceptance
criterion remains all-request trace continuity and declared application health
during both transitions. Retain the current counterexamples as regression inputs.

Specifically, coordinate Service readiness with observed SDK export health and
OBI coverage, preserve the old process's observation/export state through its
drain interval, and inspect per-process ownership while old and new JVMs share an
executable. Each suspected cause needs a focused experiment. A fixed sleep alone
does not establish a safe general controller.

SDK upgrade/rollback, one-command public packaging, restart recovery, production
GitOps ownership, concurrency, and cost measurements remain separate gates. No
CPU, ingestion-byte, or dollar-saving claim is supported by this experiment.

The dedicated proof cluster was removed after evidence collection. The pre-existing
cluster and default Kubernetes context were left intact. The harness recreates
the isolated cluster for further experiments.
