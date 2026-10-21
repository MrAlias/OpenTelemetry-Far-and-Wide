#!/usr/bin/env python3
"""Record real requests, rollouts, process ownership, and unmodified OTLP JSON."""
import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import json
import os
from io import BytesIO
import zipfile
from pathlib import Path
import re
import secrets
import subprocess
import time
import urllib.error
import urllib.request

from analyze import read_telemetry, report, verify_metric_counts
from verify_rollout import verify

ROOT = Path(__file__).resolve().parents[1]
KUBE = ["kubectl", "--kubeconfig", str(ROOT / ".artifacts/kubeconfig"), "--context", "kind-far-wide-proof", "--request-timeout=10s", "-n", "far-wide-proof"]


def read_url(url):
    with urllib.request.urlopen(url, timeout=10) as response:
        return response.read()


def telemetry_snapshot(url, directory):
    # The file exporter appends while the HTTP sidecar reads. A snapshot can
    # end mid-write. Preserve incomplete attempts and retry the whole snapshot;
    # never silently discard a partial JSON record or a failed trace.
    deadline = time.monotonic() + 10
    attempt = 0
    while True:
        attempt += 1
        data = read_url(url)
        target = directory / "telemetry.jsonl"
        target.write_bytes(data)
        try:
            if not data.endswith(b"\n"):
                raise ValueError("Snapshot ends inside an append")
            parsed = read_telemetry(target)
            return parsed, attempt
        except (json.JSONDecodeError, UnicodeDecodeError, ValueError):
            target.rename(directory / f"telemetry-incomplete-attempt-{attempt}.jsonl")
            if time.monotonic() >= deadline:
                raise RuntimeError("Could not obtain a complete raw telemetry snapshot")
            time.sleep(0.25)


def stable_telemetry_snapshot(url, directory):
    data = read_url(url + "/snapshot")
    (directory / "snapshot.zip").write_bytes(data)
    with zipfile.ZipFile(BytesIO(data)) as archive:
        for name in ["telemetry.jsonl", "telemetry-pending-tail.bin", "snapshot.json"]:
            (directory / name).write_bytes(archive.read(name))
    metadata = json.loads((directory / "snapshot.json").read_text())
    complete = (directory / "telemetry.jsonl").read_bytes()
    tail = (directory / "telemetry-pending-tail.bin").read_bytes()
    if len(complete) != metadata["complete_bytes"] or len(tail) != metadata["pending_bytes"] or hashlib.sha256(complete + tail).hexdigest() != metadata["sha256"]:
        raise ValueError("Frozen snapshot integrity mismatch")
    return read_telemetry(directory / "telemetry.jsonl"), 1


def snapshot(directory, label):
    for resource in ["pods", "deployments", "instrumentations"]:
        data = subprocess.check_output(KUBE + ["get", resource, "-o", "json"])
        (directory / f"{label}-{resource}.json").write_bytes(data)


def forward(service, remote, directory, processes):
    return forward_resource("service/" + service, remote, directory, processes)


def forward_resource(resource, remote, directory, processes):
    # Ask kubectl to allocate a free loopback port; inspect its bounded startup.
    log_path = directory / f"port-forward-{resource.replace(chr(47), chr(45))}.txt"
    with log_path.open("w") as log:
        process = subprocess.Popen(KUBE + ["port-forward", "--address", "127.0.0.1", resource, ":" + str(remote)], stdout=log, stderr=subprocess.STDOUT)
    processes.append(process)
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        text = log_path.read_text()
        match = re.search(r"Forwarding from 127\.0\.0\.1:(\d+) ->", text)
        if match:
            return "http://127.0.0.1:" + match[1]
        if process.poll() is not None:
            raise RuntimeError(text)
        time.sleep(0.1)
    raise TimeoutError("Port forward did not start: " + resource)


def request_one(gateway):
    record = {"trace_id":secrets.token_hex(16), "external_parent_span_id":secrets.token_hex(8), "start_ns":time.time_ns()}
    req = urllib.request.Request(gateway + "/checkout", headers={"traceparent":"00-" + record["trace_id"] + "-" + record["external_parent_span_id"] + "-01"})
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            record["status"] = response.status
            record["body"] = response.read().decode()
    except urllib.error.HTTPError as error:
        record["status"] = error.code
        record["body"] = error.read().decode(errors="replace")
        record["error"] = str(error)
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        record["status"] = getattr(error, "code", 0)
        record["error"] = str(error)
    record["end_ns"] = time.time_ns()
    record["latency_ms"] = (record["end_ns"] - record["start_ns"]) / 1e6
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("label")
    parser.add_argument("--mode", choices=["breadth", "depth", "transition"], required=True)
    parser.add_argument("--count", type=int, default=20)
    parser.add_argument("--interval", type=float, default=0.4)
    parser.add_argument("--concurrency", type=int, default=1)
    parser.add_argument("--transition", choices=["depth", "breadth"])
    parser.add_argument("--reject-candidate", action="store_true", help="Negative control: retain the current profile and reject the candidate")
    args = parser.parse_args()
    if not re.fullmatch(r"[a-z0-9-]+", args.label):
        parser.error("label must use lowercase letters, digits, or hyphens")
    if args.count < 10 or args.count > 1000 or args.interval < 0.2 or args.concurrency not in range(1, 9):
        parser.error("use 10..1000 requests, concurrency 1..8, and interval >= 0.2 seconds")
    if args.reject_candidate and (not args.transition or args.mode == "transition"):
        parser.error("Rejected-candidate capture needs a transition target and the retained steady-state mode")
    if not args.reject_candidate and bool(args.transition) != (args.mode == "transition"):
        parser.error("transition mode requires --transition, and vice versa")
    directory = ROOT / ".artifacts/runs" / (args.label + "-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + secrets.token_hex(3))
    directory.mkdir(parents=True)
    print("Evidence directory:", directory, flush=True)
    harness_hashes = {str(path.relative_to(ROOT)):hashlib.sha256(path.read_bytes()).hexdigest() for folder in ["scripts", "agent", "router", "k8s"] for path in sorted((ROOT / folder).rglob("*")) if path.is_file() and "__pycache__" not in path.parts}
    processes = []
    transition = None
    transition_log = None
    transition_error = None
    traffic_error = None
    requests = []
    try:
        gateway = forward("gateway", 8080, directory, processes)
        evidence = forward("collector", 8080, directory, processes)
        agent = forward("proof-agent", 7777, directory, processes)
        snapshot(directory, "before")
        router = forward("checkout-router", 7778, directory, processes)
        (directory / "router-before.json").write_bytes(read_url(router + "/state"))
        (directory / "metric-baseline.json").write_bytes(read_url(evidence + "/lookup"))
        (directory / "ownership-before.json").write_bytes(read_url(agent + "/state"))
        post_transition = 0
        traffic_deadline = time.monotonic() + 300
        with ThreadPoolExecutor(max_workers=args.concurrency) as pool, (directory / "requests.jsonl").open("w") as request_file, (directory / "ownership.jsonl").open("w") as ownership_file:
            while len(requests) < args.count or (transition and (transition.poll() is None or post_transition < 20)):
                if len(requests) >= 1000 or time.monotonic() >= traffic_deadline:
                    traffic_error = "Traffic ceiling/deadline reached before sufficient post-handoff requests"
                    break
                if len(requests) >= 5 and args.transition and transition is None:
                    transition_log = (directory / "transition.txt").open("w")
                    command = ["python3", str(ROOT / "scripts/handoff.py"), args.transition, "--reject-candidate"] if args.reject_candidate else [str(ROOT / "scripts/proof.sh"), args.transition]
                    transition = subprocess.Popen(command, stdout=transition_log, stderr=subprocess.STDOUT, env=dict(os.environ, PROOF_HANDOFF_LOG=str(directory / "handoff.json")))
                started = time.monotonic()
                remaining = args.count - len(requests)
                batch_size = min(args.concurrency, remaining) if remaining > 0 else args.concurrency
                records = list(pool.map(request_one, [gateway] * batch_size))
                for record in records:
                    request_file.write(json.dumps(record) + "\n")
                    requests.append(record)
                request_file.flush()
                ownership_file.write(json.dumps({"time_ns":time.time_ns(), "processes":json.loads(read_url(agent + "/state"))}) + "\n")
                ownership_file.flush()
                if transition and transition.poll() is not None:
                    post_transition += len(records)
                time.sleep(max(0, args.interval - (time.monotonic() - started)))
        if transition:
            return_code = transition.wait(timeout=420)
            rejected = json.loads((directory / "handoff.json").read_text()).get("error") == "Deliberate candidate rejection before routing" if args.reject_candidate else False
            if (args.reject_candidate and (return_code == 0 or not rejected)) or (not args.reject_candidate and return_code != 0):
                transition_error = "Rollout failed; see transition.txt and handoff.json"
        # Generic OBI HTTP finalization has a 10s inactivity fallback polled
        # every 2s, in addition to the configured 1s OTLP batch and file flush.
        # Preserve that collection latency instead of declaring pending spans lost.
        time.sleep(20)
        snapshot(directory, "after")
        (directory / "router-after.json").write_bytes(read_url(router + "/state"))
        (directory / "ownership-after.json").write_bytes(read_url(agent + "/state"))
        (traces, metrics), snapshot_attempts = stable_telemetry_snapshot(evidence, directory)
        for resource, container in [("daemonset/proof-agent", "agent"), ("deployment/collector", "collector"), ("deployment/checkout", "checkout")]:
            output = subprocess.check_output(KUBE + ["logs", resource, "-c", container, "--timestamps"])
            (directory / (container + ".txt")).write_bytes(output)
        metadata = {"label":args.label, "mode":args.mode, "count":len(requests), "requested_count":args.count, "concurrency":args.concurrency, "interval":args.interval, "transition":args.transition, "reject_candidate":args.reject_candidate,
                    "drain_seconds":20,
                    "capture_errors":[error for error in [transition_error, traffic_error] if error],
                    "telemetry_snapshot_attempts":snapshot_attempts,
                    "captured_at":datetime.now(timezone.utc).isoformat(), "harness_source_sha256":harness_hashes, "application_source_sha256":{}}
        for path in sorted((ROOT / "apps").rglob("*")):
            if path.is_file():
                metadata["application_source_sha256"][str(path.relative_to(ROOT))] = hashlib.sha256(path.read_bytes()).hexdigest()
        metadata["telemetry_sha256"] = hashlib.sha256((directory / "telemetry.jsonl").read_bytes()).hexdigest()
        metadata["verifier_sha256"] = hashlib.sha256((ROOT / "scripts/analyze.py").read_bytes()).hexdigest()
        (directory / "capture.json").write_text(json.dumps(metadata, indent=2) + "\n")
        result = report(requests, traces, metrics, args.mode)
        if transition_error or traffic_error:
            result["errors"].extend(error for error in [transition_error, traffic_error] if error)
            result["passed"] = False
        metric_counts = verify_metric_counts(directory, requests, traces, metrics)
        (directory / "metric-count-report.json").write_text(json.dumps(metric_counts, indent=2) + "\n")
        result["metric_counts_passed"] = metric_counts["passed"]
        result["errors"].extend(metric_counts["errors"])
        result["passed"] = result["passed"] and metric_counts["passed"]
        rollout = verify(directory)
        result["rollout_passed"] = rollout["passed"]
        result["errors"].extend(rollout["errors"])
        result["passed"] = result["passed"] and rollout["passed"]
        (directory / "report.json").write_text(json.dumps(result, indent=2) + "\n")
        print(json.dumps({key:value for key,value in result.items() if key != "checks"}, indent=2), flush=True)
        return 0 if result["passed"] else 1
    finally:
        if transition and transition.poll() is None:
            transition.terminate()
            transition.wait(timeout=10)
        if transition_log:
            transition_log.close()
        for process in processes:
            process.terminate()
        for process in processes:
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == "__main__":
    raise SystemExit(main())
