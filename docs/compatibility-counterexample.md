# Preserved Java HttpClient trace counterexample

The original uninstrumented JDK 21 fixture used java.net.http.HttpClient.send.
The application made blocking calls; the reference JDK implementation internally
[delegates send to sendAsync](https://github.com/openjdk/jdk21u/blob/master/src/java.net.http/share/classes/jdk/internal/net/http/HttpClientImpl.java).
This is an implementation distinction to investigate, not an established cause.
Its exact [application source](evidence/reliability-2026-10-06/async-fixture/Checkout.java)
is preserved with SHA-256
`ade28e8527f70a21e2e8d763db8a5ee88ab73c0960a8f88a6da0ed553a5fca51`.

The test uses released OBI v0.14.0, Operator 0.160.0, Java agent 2.30.0,
Collector 0.160.0, Kubernetes v1.33.2 and host kernel 7.2.8-arch1-1.
The integration assigns OBI metrics to every enrolled process and switches
checkout trace ownership according to actual agent presence. No upstream source
was patched. See [the reliability report](reliability-results.md) for the routing
and retirement mechanism.

## A serial request attached to a retired JVM's trace

Capture:
`rehearsal-20261006t185603z-c332c2-breadth-1-20261006T190049Z-f12b92`.
Load: one caller, interval 0.4s. A preceding breadth → SDK transition passed
109/109 requests. The SDK → breadth transition returned HTTP 200 for all 146
requests but produced complete, correctly parented traces for only 132.

A request recorded with trace ID `40eae4335b2a4067e122b0e7e941ad98`
started at `1791313291401578518` Unix nanoseconds. In `telemetry.jsonl`
line 835, the gateway CLIENT span `94f056cd21a28c64` correctly parents
checkout SERVER `9edba3afe6f311f6` on new pod
`checkout-5544db7569-g4cnw`.

Its outbound checkout CLIENT span `74bf3dffd0ee58d1` appears in that same
raw record with a different trace ID, `2fb8c1ce9973eea2316a637d979feb85`,
and parent `21181c0f50c59078`. Inventory SERVER `b94abe3797afa0a6`
parents that client and carries the same wrong trace ID.

Parent `21181c0f50c59078` is an OBI `processing` span exported on line 329
for an earlier checkout pod, `checkout-5544db7569-gsghn`, starting at
`1791313209380786346`. Its server parent is `635501489356f443`.
That pod belongs to the initial breadth generation, before the intermediate SDK
pod. Additional outbound calls from the replacement breadth process reuse this
old parent throughout the capture. Fourteen recorded requests lack their expected
checkout CLIENT and inventory SERVER roles under their external trace IDs.

The handoff's candidate probe had already passed. Metric accounting and rollout
ordering also passed. Those checks cannot substitute for validating every
measured request's trace identity and parent chain. The final capture gate
correctly reports failure.

## Related concurrent failures

A four-caller add-depth repeat produced complete traces for 996/1,000 requests:
two duplicate checkout CLIENT span IDs and two missing checkout CLIENT roles.
The retirement gate blocked completion.

A fresh-cluster four-caller test with `ebpf.high_request_volume: true`
produced 995/1,000 complete traces. Failures included wrong parents, duplicated
server roles and missing roles. The runner restored the old route and retained
both checkout pods. The supported completion setting therefore did not resolve
this counterexample.

The archives and machine-readable reports for these captures are listed in
[the evidence index](evidence/reliability-2026-10-06/index.json). They contain
unfiltered raw telemetry, request IDs, routing/admission journals and Kubernetes
snapshots. The first concurrent failure used an earlier capture runner that hit
its traffic ceiling before normal finalization; its separately saved
`failure-report.json`, raw snapshot and failure snapshots are explicitly retained.
It lacks a normal `capture.json` and must not be presented as a complete passing
capture or as an observed automatic rollback.

## Next investigation

The exact cause remains unminimized. The next diagnostic should reproduce the
cross-process parent mismatch in the smallest HttpClient workload and record
OBI's raw decoded events alongside the emitted OTLP spans. That can separate
capture/export effects from instrumentation and context tracking. Neither an
upstream issue nor a patch is asserted here.

The separate HttpURLConnection fixture also failed a four-caller test. After five
passing profile changes, its third SDK removal produced only 378/380 complete
traces: one duplicated checkout CLIENT span ID and one missing checkout CLIENT.
That capture is
`rehearsal-20261006t190737z-c8614b-breadth-3-20261006T191413Z-63d12e`.
The trace IDs are `1d3982b74500d307b7164ebf8c1b42d5` (duplicate) and
`f6bc0765bf48ab18ce760a73017b9c27` (missing). The original client implementation
alone therefore cannot explain all observed failures.

The final rehearsal bounds this separate fixture to serial measured traffic.
Any passing result establishes that fixture and load only. Selecting it does not
repair java.net.http.HttpClient or establish arbitrary Java or concurrent coverage.
