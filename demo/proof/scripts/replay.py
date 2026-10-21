#!/usr/bin/env python3
"""Recheck a full reliability capture offline without replacing its original report."""
import argparse
import hashlib
import json
from pathlib import Path

from analyze import read_telemetry, report, verify_metric_counts
from verify_rollout import verify


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    directory = args.directory
    metadata = json.loads((directory / "capture.json").read_text())
    raw = (directory / "telemetry.jsonl").read_bytes()
    if hashlib.sha256(raw).hexdigest() != metadata["telemetry_sha256"]:
        raise ValueError("Telemetry hash differs from the recorded capture")
    snapshot = json.loads((directory / "snapshot.json").read_text())
    tail = (directory / "telemetry-pending-tail.bin").read_bytes()
    if len(raw) != snapshot["complete_bytes"] or len(tail) != snapshot["pending_bytes"] or hashlib.sha256(raw + tail).hexdigest() != snapshot["sha256"]:
        raise ValueError("Snapshot boundary/hash mismatch")
    requests = [json.loads(line) for line in (directory / "requests.jsonl").read_text().splitlines()]
    if len(requests) != metadata["count"]:
        raise ValueError("Request count differs from the recorded capture")
    traces, metrics = read_telemetry(directory / "telemetry.jsonl")
    result = report(requests, traces, metrics, metadata["mode"])
    metric_counts = verify_metric_counts(directory, requests, traces, metrics)
    rollout = verify(directory, write=False)
    result["metric_counts_passed"] = metric_counts["passed"]
    result["rollout_passed"] = rollout["passed"]
    result["errors"].extend(metric_counts["errors"] + rollout["errors"])
    result["errors"].extend(metadata.get("capture_errors", []))
    result["passed"] = result["passed"] and metric_counts["passed"] and rollout["passed"] and not metadata.get("capture_errors")
    (directory / "replay-report.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({key:value for key,value in result.items() if key != "checks"}, indent=2))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
