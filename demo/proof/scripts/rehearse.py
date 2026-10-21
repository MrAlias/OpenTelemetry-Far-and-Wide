#!/usr/bin/env python3
"""Run the repeatable reliability gate and retain every capture."""
import argparse
from datetime import datetime, timezone
import json
from pathlib import Path
import secrets
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--cycles", type=int, default=3)
    parser.add_argument("--skip-prepare", action="store_true")
    parser.add_argument("--concurrency", type=int, default=1)
    args = parser.parse_args()
    if not 1 <= args.concurrency <= 8:
        parser.error("concurrency must be 1..8")
    if not 1 <= args.cycles <= 10:
        parser.error("cycles must be 1..10")
    label = "rehearsal-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ").lower() + "-" + secrets.token_hex(3)
    runs = []
    result = {"label":label,"passed":False,"cycles":args.cycles,"concurrency":args.concurrency,"captures":runs}
    directory = ROOT / ".artifacts/rehearsals" / label
    directory.mkdir(parents=True)
    summary = directory / "summary.json"

    def capture(stage, mode, target=None, reject=False, count=40):
        command = [sys.executable, str(ROOT / "scripts/capture.py"), label + "-" + stage, "--mode", mode, "--count", str(count), "--concurrency", str(args.concurrency)]
        if target:
            command += ["--transition", target]
        if reject:
            command += ["--reject-candidate"]
        with (directory / (stage + ".txt")).open("w") as output:
            subprocess.run(command, stdout=output, stderr=subprocess.STDOUT, check=True)
        matches = list((ROOT / ".artifacts/runs").glob(label + "-" + stage + "-*"))
        if len(matches) != 1:
            raise RuntimeError("Capture identity is ambiguous")
        record = json.loads((matches[0] / "report.json").read_text())
        runs.append({"stage":stage,"directory":str(matches[0]),"passed":record["passed"],"requests":record["requests"]})
        summary.write_text(json.dumps(result, indent=2) + "\n")
        print(f"{stage}: {record['passed_requests']}/{record['requests']} requests passed", flush=True)

    try:
        if not args.skip_prepare:
            subprocess.run([str(ROOT / "scripts/proof.sh"), "prepare"], check=True)
        subprocess.run([str(ROOT / "scripts/proof.sh"), "up"], check=True)
        capture("breadth", "breadth")
        for index in range(1, args.cycles + 1):
            capture(f"depth-{index}", "transition", "depth", count=80)
            capture(f"breadth-{index}", "transition", "breadth", count=80)
        capture("rejected-depth", "breadth", "depth", reject=True, count=80)
        # Retry the same desired profile after a failed admission, then remove it.
        capture("recovered-depth", "transition", "depth", count=80)
        capture("recovered-breadth", "transition", "breadth", count=80)
        result["passed"] = all(item["passed"] for item in runs)
        return 0 if result["passed"] else 1
    except Exception as error:
        result["error"] = str(error)
        print("Rehearsal failed; inspect", directory, file=sys.stderr)
        return 1
    finally:
        summary.write_text(json.dumps(result, indent=2) + "\n")
        print("Rehearsal summary:", summary, flush=True)


if __name__ == "__main__":
    raise SystemExit(main())
