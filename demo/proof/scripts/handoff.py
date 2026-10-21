#!/usr/bin/env python3
"""Proof-scoped telemetry admission, per-request routing, and export drain.

This is orchestration for the experiment, not an upstream Operator feature.
"""
import argparse
from datetime import datetime, timezone
import fcntl
import json
import os
from pathlib import Path
import secrets
import signal
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

from analyze import attributes, has_parent, kind, owner, server_counts
from capture import forward, forward_resource, KUBE, read_url, ROOT

GATE = "proof.opentelemetry.io/telemetry-ready"


def interrupted(signum, _frame):
    raise InterruptedError(f"Handoff interrupted by signal {signum}")


def checkout_errors(record, spans, depth, pod=None):
    errors = []
    roles = [("checkout", 2), ("checkout", 3), ("inventory", 2)]
    chain = []
    for service, span_kind in roles:
        found = [span for span in spans if span["resource"].get("service.name") == service and kind(span) == span_kind]
        if len(found) != 1:
            errors.append(f"{service}/{span_kind}: {len(found)} spans")
        else:
            chain.append(found[0])
    methods = [span for span in spans if span.get("name") == "PricingEngine.calculate"]
    if len(methods) != int(depth):
        errors.append("Wrong method-span count")
    by_id = {span["spanId"].lower():span for span in spans}
    if len(by_id) != len(spans):
        errors.append("Duplicate span IDs")
    if len(chain) == 3:
        parent = record["parent_span_id"].lower()
        for span in chain:
            if not has_parent(span, parent, by_id, allow_processing=kind(span) == 3):
                errors.append("Wrong parent chain")
            parent = span["spanId"].lower()
        for span in chain[:2]:
            if owner(span) != ("sdk" if depth else "obi"):
                errors.append("Wrong checkout trace owner")
            if pod and span["resource"].get("proof.pod", span["resource"].get("k8s.pod.name")) != pod:
                errors.append("Trace does not belong to candidate pod")
        if owner(chain[2]) != "obi":
            errors.append("Wrong inventory trace owner")
        for span in methods:
            if owner(span) != "sdk" or not has_parent(span, chain[0]["spanId"].lower(), by_id):
                errors.append("Wrong method-span owner/parent")
    if record.get("status") != 200:
        errors.append("HTTP request failed")
    return errors


def candidate_metrics(metrics, pod, after_ns):
    for item in metrics:
        if item["resource"].get("service.name") != "checkout" or item["resource"].get("proof.pod") != pod:
            continue
        if item["scope"].get("name") != "go.opentelemetry.io/obi":
            continue
        if item["metric"].get("name") not in {"http.server.request.duration", "http.server.duration"}:
            continue
        for point in item["metric"].get("histogram", {}).get("dataPoints", []):
            attrs = attributes(point.get("attributes", []))
            if str(attrs.get("http.response.status_code", attrs.get("http.status_code"))) == "200" and int(point.get("count", 0)) > 0 and int(point.get("timeUnixNano", 0)) >= after_ns:
                return True
    return False


def lookup(url, records):
    query = urllib.parse.urlencode([("trace_id", item["trace_id"]) for item in records])
    return json.loads(read_url(url + "/lookup?" + query))


def poll(check, timeout, description):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        result = check()
        if result:
            return result
        time.sleep(0.5)
    raise TimeoutError(description)


def pod_list():
    return json.loads(subprocess.check_output(KUBE + ["get", "pods", "-l", "app=checkout", "-o", "json"]))["items"]


def injected(pod):
    return any(item["name"] == "opentelemetry-auto-instrumentation-java" for item in pod["spec"].get("initContainers", []))


def containers_ready(pod):
    return any(item["type"] == "ContainersReady" and item["status"] == "True" for item in pod.get("status", {}).get("conditions", []))


def switch(url, target, expected):
    body = json.dumps(dict(target, expected_pod=expected)).encode()
    request = urllib.request.Request(url + "/route", data=body, method="PUT", headers={"Content-Type":"application/json"})
    with urllib.request.urlopen(request, timeout=10) as response:
        return json.load(response)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("profile", choices=["breadth", "depth"])
    parser.add_argument("--timeout", type=float, default=90)
    # A negative control: the target must remain gated and the old route intact.
    parser.add_argument("--reject-candidate", action="store_true")
    args = parser.parse_args()
    if args.timeout < 5 or args.timeout > 180:
        parser.error("timeout must be 5..180 seconds")
    lock = (ROOT / ".artifacts/handoff.lock").open("w")
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    journal = Path(os.environ.get("PROOF_HANDOFF_LOG", str(ROOT / ".artifacts/handoffs" / (datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + "-" + secrets.token_hex(3) + ".json"))))
    journal.parent.mkdir(parents=True, exist_ok=True)
    state = {"profile":args.profile, "events":[], "passed":False, "reject_candidate":args.reject_candidate}

    def event(name, **fields):
        item = dict(event=name, time_ns=time.time_ns(), **fields)
        state["events"].append(item)
        journal.write_text(json.dumps(state, indent=2) + "\n")
        print(json.dumps(item), flush=True)

    processes = []
    old_target = None
    new_target = None
    router_url = None
    switched = False
    committed = False
    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    try:
        router_url = forward("checkout-router", 7778, journal.parent, processes)
        evidence_url = forward("collector", 8080, journal.parent, processes)
        old_state = json.loads(read_url(router_url + "/state"))
        old_target = old_state["route"]
        pods_before = pod_list()
        old_pod = next((pod for pod in pods_before if pod["metadata"]["name"] == old_target["pod"]), None)
        state["old_target"] = old_target
        value = "checkout-depth" if args.profile == "depth" else "false"
        patch = {"spec":{"template":{"metadata":{"annotations":{"instrumentation.opentelemetry.io/inject-java":value}}}}}
        subprocess.run(KUBE + ["patch", "deployment", "checkout", "--type", "merge", "--patch", json.dumps(patch)], check=True)
        event("profile_requested")

        def candidate():
            matches = [pod for pod in pod_list() if not pod["metadata"].get("deletionTimestamp") and pod["metadata"].get("annotations", {}).get("instrumentation.opentelemetry.io/inject-java") == value and injected(pod) == (args.profile == "depth") and containers_ready(pod)]
            return max(matches, key=lambda pod:pod["metadata"]["creationTimestamp"]) if matches else None

        new_pod = poll(candidate, args.timeout, "Candidate application did not start; old route retained")
        new_target = {"pod":new_pod["metadata"]["name"], "ip":new_pod["status"]["podIP"]}
        state["new_target"] = new_target
        event("candidate_started", target=new_target)
        # A pod port-forward bypasses its deliberately false readiness gate.
        direct = forward_resource("pod/" + new_target["pod"], 8080, journal.parent, processes)

        def warm():
            record = {"trace_id":secrets.token_hex(16), "parent_span_id":secrets.token_hex(8), "start_ns":time.time_ns()}
            request = urllib.request.Request(direct + "/checkout", headers={"traceparent":"00-" + record["trace_id"] + "-" + record["parent_span_id"] + "-01"})
            try:
                with urllib.request.urlopen(request, timeout=10) as response:
                    record["status"] = response.status
                    record["body"] = response.read().decode(errors="replace")
            except urllib.error.HTTPError as error:
                record["status"] = error.code
                record["body"] = error.read().decode(errors="replace")
                record["error"] = str(error)
            except (urllib.error.URLError, TimeoutError, OSError) as error:
                record["status"] = 0
                record["error"] = str(error)
            record["end_ns"] = time.time_ns()
            return record

        # Attachment is asynchronous; probe until a new request yields the full
        # candidate chain and a current OBI metric. Failed probes stay in journal.
        probes = []
        state["admission_probes"] = probes
        deadline = time.monotonic() + args.timeout
        admitted = False
        while time.monotonic() < deadline:
            probes.append(warm())
            event("admission_probe", trace_id=probes[-1]["trace_id"], status=probes[-1]["status"])
            for _ in range(24):
                evidence = lookup(evidence_url, probes)
                latest = probes[-1]
                errors = checkout_errors(latest, evidence["traces"].get(latest["trace_id"], []), args.profile == "depth", new_target["pod"])
                latest["admission_errors"] = errors
                if not errors and candidate_metrics(evidence["metrics"], new_target["pod"], latest["end_ns"]):
                    admitted = True
                    break
                if time.monotonic() >= deadline:
                    break
                time.sleep(0.5)
            if admitted:
                break
        if not admitted:
            raise TimeoutError("Candidate telemetry failed admission; old route retained")
        event("candidate_telemetry_verified", trace_id=probes[-1]["trace_id"], metric_verified=True)
        state["candidate_metric_baseline"] = {pod:count for pod,count in server_counts(evidence["metrics"]).items() if pod == new_target["pod"]}
        if new_target == old_target:
            if not any(condition["type"] == GATE and condition["status"] == "True" for condition in new_pod["status"].get("conditions", [])):
                raise RuntimeError("Current route lacks a committed readiness gate")
            state["passed"] = True
            event("already_admitted")
            return 0
        if args.reject_candidate:
            raise RuntimeError("Deliberate candidate rejection before routing")
        switch(router_url, new_target, old_target["pod"])
        switched = True
        event("route_switched")

        def drained():
            router_state = json.loads(read_url(router_url + "/state"))
            if router_state["route"] != new_target:
                raise RuntimeError("Route changed during handoff")
            return router_state if router_state["active"].get(old_target["pod"], 0) == 0 else None

        drained_state = poll(drained, args.timeout, "Old requests did not finish")
        records = [record for record in drained_state["ledger"] or [] if record["pod"] == old_target["pod"]]
        state["drained_requests"] = records
        event("old_requests_finished", count=len(records))
        if records:
            def exported():
                evidence = lookup(evidence_url, records)
                failures = {record["trace_id"]:checkout_errors(record, evidence["traces"].get(record["trace_id"], []), injected(old_pod), old_target["pod"]) for record in records}
                state["drain_errors"] = {key:value for key,value in failures.items() if value}
                metric_ready = candidate_metrics(evidence["metrics"], old_target["pod"], max(record["end_ns"] for record in records))
                return not state["drain_errors"] and metric_ready
            poll(exported, args.timeout, "Old request telemetry did not drain; old pod retained")
        event("old_telemetry_exported", count=len(records))
        condition = {"type":GATE, "status":"True", "reason":"TelemetryVerifiedAndOldExportDrained", "message":"Candidate trace/metrics verified; prior route drained", "lastTransitionTime":datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")}
        subprocess.run(KUBE + ["patch", "pod", new_target["pod"], "--subresource=status", "--type=strategic", "--patch", json.dumps({"status":{"conditions":[condition]}})], check=True)
        committed = True
        event("readiness_released")
        subprocess.run(KUBE + ["rollout", "status", "deployment/checkout", "--timeout=120s"], check=True)
        state["passed"] = True
        event("handoff_complete")
        return 0
    except Exception as error:
        state["error"] = str(error)
        # Both processes remain alive until the commit/readiness release.
        # Restore old routing if an export drain fails after switching.
        if switched and not committed and old_target and old_target["pod"]:
            try:
                switch(router_url, old_target, new_target["pod"])
                event("route_restored")
            except Exception as rollback_error:
                state["rollback_error"] = str(rollback_error)
        event("handoff_failed")
        return 1
    finally:
        for process in processes:
            process.terminate()
        for process in processes:
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()
        lock.close()


if __name__ == "__main__":
    raise SystemExit(main())
