#!/usr/bin/env python3
"""Validate recorded requests against raw OTLP JSON, without backend inference."""
import argparse
from collections import Counter, defaultdict
import json
from pathlib import Path


def attributes(items):
    return {item["key"]: next(iter(item.get("value", {}).values()), None) for item in items}


def read_telemetry(path):
    traces = defaultdict(list)
    metrics = []
    for number, line in enumerate(Path(path).read_text().splitlines(), 1):
        if not line.strip():
            continue
        batch = json.loads(line)  # Malformed/truncated evidence is an error.
        for resource in batch.get("resourceSpans", []):
            attrs = attributes(resource.get("resource", {}).get("attributes", []))
            for scope in resource.get("scopeSpans", []):
                for span in scope.get("spans", []):
                    item = dict(span)
                    item["resource"] = attrs
                    item["scope"] = scope.get("scope", {})
                    item["evidence_line"] = number
                    traces[span["traceId"].lower()].append(item)
        for resource in batch.get("resourceMetrics", []):
            attrs = attributes(resource.get("resource", {}).get("attributes", []))
            for scope in resource.get("scopeMetrics", []):
                for metric in scope.get("metrics", []):
                    metrics.append({"resource": attrs, "scope": scope.get("scope", {}), "metric": metric, "evidence_line": number})
    return traces, metrics


def kind(span):
    value = span.get("kind")
    return {"SPAN_KIND_SERVER": 2, "SPAN_KIND_CLIENT": 3, "SPAN_KIND_INTERNAL": 1}.get(value, value)


def owner(span):
    resource = span["resource"]
    scope = span.get("scope", {}).get("name", resource.get("otel.scope.name", ""))
    if resource.get("telemetry.distro.name") == "opentelemetry-ebpf-instrumentation" or scope == "go.opentelemetry.io/obi":
        return "obi"
    if resource.get("telemetry.distro.name") == "opentelemetry-java-instrumentation" or scope.startswith("io.opentelemetry."):
        return "sdk"
    return "unknown"


def has_parent(span, expected_parent, by_id, allow_processing=False):
    parent = span.get("parentSpanId", "").lower()
    visited = set()
    while parent and parent != expected_parent:
        if not allow_processing or parent in visited:
            return False
        visited.add(parent)
        middle = by_id.get(parent)
        if not middle or kind(middle) != 1 or middle.get("name") != "processing" or owner(middle) != "obi":
            return False
        if middle["resource"].get("service.name") != span["resource"].get("service.name"):
            return False
        parent = middle.get("parentSpanId", "").lower()
    return parent == expected_parent


def check_request(request, spans, mode):
    errors = []
    roles = defaultdict(list)
    for span in spans:
        roles[(span["resource"].get("service.name"), kind(span))].append(span)
    expected = [("gateway", 2), ("gateway", 3), ("checkout", 2), ("checkout", 3), ("inventory", 2)]
    for role in expected:
        if len(roles[role]) != 1:
            errors.append(f"{role}: expected one span, observed {len(roles[role])}")
    method = [span for span in spans if span.get("name") == "PricingEngine.calculate"]
    expected_methods = 1 if mode == "depth" else 0 if mode == "breadth" else None
    if expected_methods is not None and len(method) != expected_methods:
        errors.append(f"expected {expected_methods} method spans, observed {len(method)}")
    if len(method) > 1:
        errors.append("duplicate method spans")
    by_id = {span["spanId"].lower():span for span in spans}
    if len(by_id) != len(spans):
        errors.append("duplicate span IDs")
    if all(len(roles[role]) == 1 for role in expected):
        chain = [roles[role][0] for role in expected]
        parent = request["external_parent_span_id"]
        for span in chain:
            if not has_parent(span, parent, by_id, allow_processing=kind(span) == 3):
                errors.append(f"wrong parent for {span['resource']['service.name']} {kind(span)}")
            parent = span["spanId"].lower()
        sdk_checkout = owner(chain[2]) == "sdk"
        for span in chain:
            observed = owner(span)
            if observed == "unknown":
                errors.append("unknown request trace producer")
            if span["resource"].get("service.name") != "checkout" and observed != "obi":
                errors.append("gateway/inventory request trace is not owned by OBI")
        if owner(chain[2]) != owner(chain[3]):
            errors.append("checkout server/client have different trace owners")
        if mode == "transition" and len(method) != int(sdk_checkout):
            errors.append("method span count does not match checkout trace owner")
        if mode == "breadth" and sdk_checkout:
            errors.append("checkout request trace still owned by SDK")
        if mode == "depth" and not sdk_checkout:
            errors.append("checkout request trace still owned by OBI")
        for span in method:
            if kind(span) != 1 or span["resource"].get("service.name") != "checkout":
                errors.append("method span has the wrong kind or service")
            if not has_parent(span, chain[2]["spanId"].lower(), by_id):
                errors.append("method span is not a child of checkout server")
            if owner(span) != "sdk":
                errors.append("method span not owned by Java SDK")
            duration = (int(span["endTimeUnixNano"]) - int(span["startTimeUnixNano"])) / 1e6
            if duration < 100:
                errors.append(f"method does not expose the fault: {duration:.1f}ms")
    if request.get("status") != 200:
        errors.append(f"request status {request.get('status')}")
    return {"trace_id": request["trace_id"], "passed": not errors, "errors": errors, "spans": len(spans), "method_spans": len(method)}


def report(requests, traces, metrics, mode):
    if not requests:
        raise ValueError("No requests: refusing vacuous proof")
    checks = [check_request(request, traces.get(request["trace_id"], []), mode) for request in requests]
    start = min(request["start_ns"] for request in requests)
    end = max(request["end_ns"] for request in requests) + 10_000_000_000
    metric_services = set()
    metric_names = defaultdict(set)
    series = defaultdict(list)
    for item in metrics:
        service = item["resource"].get("service.name")
        metric = item["metric"]
        if metric.get("name") not in {"http.server.request.duration", "http.server.duration"}:
            continue
        if item["scope"].get("name") != "go.opentelemetry.io/obi":
            continue
        points = metric.get("histogram", {}).get("dataPoints", [])
        for point in points:
            timestamp = int(point.get("timeUnixNano", "0"))
            attrs = attributes(point.get("attributes", []))
            status = attrs.get("http.response.status_code", attrs.get("http.status_code"))
            if start <= timestamp <= end and str(status) == "200":
                key = (service, json.dumps(item["resource"], sort_keys=True), json.dumps(attrs, sort_keys=True))
                series[key].append((timestamp, int(point.get("count", "0"))))
                metric_names[service].add(metric["name"])
    increments = defaultdict(int)
    for key, samples in series.items():
        samples = sorted(set(samples))
        if len(samples) >= 2 and samples[-1][1] > samples[0][1]:
            metric_services.add(key[0])
            increments[key[0]] += samples[-1][1] - samples[0][1]
    missing_metrics = sorted({"gateway", "checkout", "inventory"} - metric_services)
    states = dict(Counter(check["method_spans"] for check in checks))
    errors = []
    if missing_metrics:
        errors.append("No increasing in-window OBI server histogram with HTTP 200: " + ", ".join(missing_metrics))
    if mode == "transition" and not {0, 1}.issubset(states):
        errors.append("Transition did not observe both breadth and depth requests")
    return {"passed": all(check["passed"] for check in checks) and not errors, "mode": mode, "requests": len(checks),
            "passed_requests": sum(check["passed"] for check in checks), "method_span_counts": states,
            "metric_names": {name: sorted(values) for name, values in metric_names.items()},
            "observed_metric_count_increments": dict(increments), "errors": errors, "checks": checks}


def server_counts(metrics):
    """Latest cumulative OBI HTTP-200 counts by pod, without double-counting exports."""
    series = {}
    for item in metrics:
        metric = item["metric"]
        pod = item["resource"].get("proof.pod", item["resource"].get("k8s.pod.name"))
        if not pod or item["scope"].get("name") != "go.opentelemetry.io/obi" or metric.get("name") not in {"http.server.request.duration", "http.server.duration"}:
            continue
        for point in metric.get("histogram", {}).get("dataPoints", []):
            attrs = attributes(point.get("attributes", []))
            if str(attrs.get("http.response.status_code", attrs.get("http.status_code"))) != "200":
                continue
            key = (pod, metric["name"], json.dumps(attrs, sort_keys=True))
            series[key] = max(series.get(key, 0), int(point.get("count", 0)))
    counts = defaultdict(int)
    for key, count in series.items():
        counts[key[0]] += count
    return dict(counts)


def verify_metric_counts(directory, requests, traces, metrics):
    """Require OBI counter increases to account for every recorded request per pod."""
    directory = Path(directory)
    baseline = server_counts(json.loads((directory / "metric-baseline.json").read_text())["metrics"])
    handoff_path = directory / "handoff.json"
    if handoff_path.exists():
        handoff = json.loads(handoff_path.read_text())
        for pod, count in handoff.get("candidate_metric_baseline", {}).items():
            baseline.setdefault(pod, count)
    expected = Counter()
    for request in requests:
        for span in traces.get(request["trace_id"], []):
            if kind(span) == 2 and span["resource"].get("service.name") in {"gateway", "checkout", "inventory"}:
                pod = span["resource"].get("proof.pod", span["resource"].get("k8s.pod.name"))
                if not pod:
                    return {"passed":False,"errors":["Server span has no pod identity"]}
                expected[pod] += 1
    observed = server_counts(metrics)
    errors = []
    increments = {}
    for pod, count in expected.items():
        increment = observed.get(pod, 0) - baseline.get(pod, 0)
        increments[pod] = increment
        if increment < count:
            errors.append(f"OBI HTTP-200 count for {pod}: increase {increment}, recorded requests {count}")
    return {"passed":not errors,"errors":errors,"expected_requests_by_pod":dict(expected),"observed_count_increments_by_pod":increments,"baseline":baseline}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path)
    parser.add_argument("--mode", choices=["breadth", "depth", "transition"], required=True)
    parser.add_argument("--telemetry", type=Path, help="Use a separately recorded long-drain raw snapshot")
    parser.add_argument("--output", type=Path, help="Write the result separately from the capture's original report")
    args = parser.parse_args()
    requests = [json.loads(line) for line in (args.directory / "requests.jsonl").read_text().splitlines()]
    traces, metrics = read_telemetry(args.telemetry or args.directory / "telemetry.jsonl")
    result = report(requests, traces, metrics, args.mode)
    (args.output or args.directory / "report.json").write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps({key: value for key, value in result.items() if key != "checks"}, indent=2))
    raise SystemExit(0 if result["passed"] else 1)


if __name__ == "__main__":
    main()
