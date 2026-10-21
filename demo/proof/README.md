# Coexistence proof harness

The executable [demo specification](../../docs/demo-spec.md) defines this
experiment, its expected trace graph, ownership rules, and pass/fail assertions.
The [proof results](../../docs/proof-results.md) report actual observations,
including the original transition failures. The
[reliability follow-up](../../docs/reliability-results.md) documents the revised
control path, load boundary, and repeated trials.

This is an isolated kind/Kubernetes experiment using the actual OpenTelemetry
Operator. It contains uninstrumented Go, Java, and Node.js applications, a small
OBI library embedding, Kubernetes manifests, a proof router with a request ledger,
a telemetry admission and drain runner, a raw
telemetry capture tool, and evidence validators. It is not the completed
general-purpose policy controller described in the talk proposal.

Run the complete gate from a fresh cluster:

```bash
python3 demo/proof/scripts/rehearse.py
```

It repeats three round trips at serial load, rejects a candidate,
then verifies retry and return to breadth. The current Java fixture uses
synchronous HttpURLConnection. Four-caller trials failed with both Java clients;
the earlier java.net.http.HttpClient fixture also failed a serial trial. All these
counterexamples remain preserved.
The cluster and evidence remain available for inspection. For individual stages:

```bash
demo/proof/scripts/proof.sh prepare
demo/proof/scripts/proof.sh up
python3 demo/proof/scripts/capture.py breadth --mode breadth
python3 demo/proof/scripts/capture.py to-depth --mode transition --transition depth --count 80 --concurrency 1
python3 demo/proof/scripts/capture.py depth --mode depth
python3 demo/proof/scripts/capture.py to-breadth --mode transition --transition breadth --count 80 --concurrency 1
python3 demo/proof/scripts/capture.py breadth-restored --mode breadth
```

Each capture stores a complete record in `.artifacts/runs/` and exits nonzero on
failure. Rollouts promote only telemetry-verified candidates, wait for old
requests to export, then release the Kubernetes readiness gate. The capture also
waits twenty seconds after traffic and preserves a frozen raw snapshot. Failed stages retain their evidence and the cluster. Use the
specification to inspect or reproduce a failure before continuing.

Validation:

```bash
python3 -m unittest discover -s demo/proof/tests -v
bash -n demo/proof/scripts/proof.sh
shellcheck demo/proof/scripts/proof.sh
docker run --rm -v "$PWD/demo/proof/router:/src:ro" -w /src golang:1.27.1 go test -race main.go main_test.go
python3 demo/proof/scripts/replay.py PATH_TO_CAPTURE
```

Cleanup preserves local evidence:

```bash
demo/proof/scripts/proof.sh down
```
