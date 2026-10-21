# Reliability evidence, 2026-10-06

Read [the reliability report](../../reliability-results.md) for the final measured
scope, results and remaining failures. The
[compatibility counterexample](../../compatibility-counterexample.md) identifies
specific spans and raw file lines from failed trials.

`index.json` lists every archived capture, fixture, pass/fail outcome and measured
request count. Each named `.tar.gz` contains its original capture directory,
including unfiltered telemetry and requests. Corresponding JSON reports are also
available beside the archive for quick inspection. `rehearsals/` retains the
stage logs and runner summaries, including failed and interrupted rehearsals.

`offline-replay.json` records the independent re-evaluation of complete captures.
The first concurrent failure and one deliberately interrupted serial start lack
normal capture metadata; their partial/manual evidence is preserved explicitly.
Their absence from replay does not convert them into successful trials.

`proof-sources.tar.gz` freezes the final harness sources and uninstrumented
application sources. `async-fixture/Checkout.java` preserves the earlier Java
client source. `build-image-identities.json`, `tool-versions.json`, `nodes.json`,
`operator-pods.json`, `webhooks.json`, `helm-values.json`, and
`source-artifact.json` establish the runtime, admission configuration and inputs.
Captured pod snapshots record the actual application and injected image IDs.
`high-request-volume-breadth.yaml` reconstructs the earlier experimental manifest
and matches its recorded source SHA-256 exactly; the final manifest uses the
default setting. `trace-examples.json` provides derived inspection examples with
exact raw line references. Tags in the executable manifests are not a portable digest lock for every
remote dependency.

Verify all durable files against the manifest from the repository root:

```bash
python3 - <<'PY'
import hashlib, json
from pathlib import Path
root = Path('docs/evidence/reliability-2026-10-06')
manifest = json.loads((root / 'manifest.json').read_text())
for name, expected in manifest['files'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, name
print('Evidence hashes verified')
PY
```

To replay an archive, extract it into a separate directory, then use its recorded
capture directory with the validator. For example:

```bash
mkdir -p /tmp/far-wide-evidence
tar -xzf docs/evidence/reliability-2026-10-06/CAPTURE.tar.gz -C /tmp/far-wide-evidence
python3 demo/proof/scripts/replay.py /tmp/far-wide-evidence/CAPTURE
```

Replace `CAPTURE` with an exact name from `index.json`. Replay exits nonzero for
failed captures and writes a separate `replay-report.json`, preserving the
original `report.json`. No cluster or backend is required for replay.
