#!/usr/bin/env python3
"""Check recorded Kubernetes evidence for image-preserving SDK injection/removal."""
import argparse
import json
from pathlib import Path


def active_pods(path):
    pods = {}
    for pod in json.loads(Path(path).read_text())["items"]:
        name = pod["metadata"].get("labels", {}).get("app")
        if name not in {"gateway", "checkout", "inventory"} or pod["metadata"].get("deletionTimestamp"):
            continue
        if any(c["type"] == "Ready" and c["status"] == "True" for c in pod.get("status", {}).get("conditions", [])):
            if name in pods:
                raise ValueError("More than one active pod for " + name)
            pods[name] = pod
    if set(pods) != {"gateway", "checkout", "inventory"}:
        raise ValueError("Missing ready application pod")
    return pods


def injected(pod):
    return any(container["name"] == "opentelemetry-auto-instrumentation-java" for container in pod["spec"].get("initContainers", []))


def image_id(pod, name):
    return next(container["imageID"] for container in pod["status"]["containerStatuses"] if container["name"] == name)


def verify(directory, write=True):
    directory = Path(directory)
    metadata = json.loads((directory / "capture.json").read_text())
    before = active_pods(directory / "before-pods.json")
    after = active_pods(directory / "after-pods.json")
    errors = []
    expected_depth = metadata.get("transition") == "depth" if metadata["mode"] == "transition" else metadata["mode"] == "depth"
    if injected(after["checkout"]) != expected_depth:
        errors.append("Final checkout injection state differs from expected profile")
    if metadata["mode"] == "transition":
        if before["checkout"]["metadata"]["uid"] == after["checkout"]["metadata"]["uid"]:
            errors.append("Checkout pod was not replaced")
        if injected(before["checkout"]) == injected(after["checkout"]):
            errors.append("Injection state did not change")
    for name in before:
        if image_id(before[name], name) != image_id(after[name], name):
            errors.append("Application image changed: " + name)
        if name != "checkout" and before[name]["metadata"]["uid"] != after[name]["metadata"]["uid"]:
            errors.append("Unexpected application rollout: " + name)
    if not any(condition["type"] == "proof.opentelemetry.io/telemetry-ready" and condition["status"] == "True" for condition in after["checkout"]["status"].get("conditions", [])):
        errors.append("Checkout telemetry readiness gate is not true")
    router_after = json.loads((directory / "router-after.json").read_text())
    if router_after["route"]["pod"] != after["checkout"]["metadata"]["name"]:
        errors.append("Router does not point to the admitted checkout pod")
    if metadata.get("reject_candidate"):
        router_before = json.loads((directory / "router-before.json").read_text())
        if router_before["route"] != router_after["route"] or before["checkout"]["metadata"]["uid"] != after["checkout"]["metadata"]["uid"]:
            errors.append("Rejected candidate displaced the old application")
        handoff = json.loads((directory / "handoff.json").read_text())
        if any(event["event"] in {"route_switched", "readiness_released"} for event in handoff["events"]):
            errors.append("Rejected candidate was admitted")
        candidate = next((pod for pod in json.loads((directory / "after-pods.json").read_text())["items"] if pod["metadata"]["name"] == handoff["new_target"]["pod"]), None)
        if not candidate or any(condition["type"] == "Ready" and condition["status"] == "True" for condition in candidate["status"].get("conditions", [])):
            errors.append("Rejected candidate was not retained behind the readiness gate")
    if metadata["mode"] == "transition":
        handoff = json.loads((directory / "handoff.json").read_text())
        names = [event["event"] for event in handoff["events"]]
        sequence = ["candidate_telemetry_verified", "route_switched", "old_requests_finished", "old_telemetry_exported", "readiness_released", "handoff_complete"]
        if not handoff["passed"] or any(name not in names for name in sequence) or [names.index(name) for name in sequence if name in names] != sorted(names.index(name) for name in sequence if name in names):
            errors.append("Handoff did not follow telemetry admission and drain ordering")
    result = {"passed":not errors, "errors":errors, "application_image_ids":{name:image_id(after[name],name) for name in after},
              "checkout_before_uid":before["checkout"]["metadata"]["uid"], "checkout_after_uid":after["checkout"]["metadata"]["uid"],
              "checkout_injected_before":injected(before["checkout"]), "checkout_injected_after":injected(after["checkout"])}
    if write:
        (directory / "rollout-report.json").write_text(json.dumps(result,indent=2)+"\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    result = verify(args.directory)
    print(json.dumps(result, indent=2))
    raise SystemExit(0 if result["passed"] else 1)
