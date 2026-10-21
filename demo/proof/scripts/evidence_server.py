#!/usr/bin/env python3
"""Read complete append records, retaining the partial tail in frozen snapshots."""
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from io import BytesIO
import json
from pathlib import Path
import threading
from urllib.parse import parse_qs, urlsplit
import zipfile

from analyze import attributes

PATH = Path("/evidence/telemetry.jsonl")
LOCK = threading.Lock()
OFFSET = 0
TRACES = {}
METRICS = {}


def frozen_bytes(path):
    with path.open("rb") as stream:
        size = path.stat().st_size
        data = stream.read(size)
    boundary = data.rfind(b"\n") + 1
    return data[:boundary], data[boundary:]


def index():
    global OFFSET
    if not PATH.exists():
        return
    with PATH.open("rb") as stream:
        stream.seek(OFFSET)
        while True:
            line = stream.readline()
            if not line.endswith(b"\n"):
                break
            batch = json.loads(line)  # Malformed complete records must fail.
            OFFSET += len(line)
            for resource in batch.get("resourceSpans", []):
                attrs = attributes(resource.get("resource", {}).get("attributes", []))
                for scope in resource.get("scopeSpans", []):
                    for span in scope.get("spans", []):
                        item = dict(span, resource=attrs, scope=scope.get("scope", {}))
                        TRACES.setdefault(span["traceId"].lower(), []).append(item)
            for resource in batch.get("resourceMetrics", []):
                attrs = attributes(resource.get("resource", {}).get("attributes", []))
                for scope in resource.get("scopeMetrics", []):
                    for metric in scope.get("metrics", []):
                        key = (json.dumps(attrs, sort_keys=True), scope.get("scope", {}).get("name", ""), metric["name"])
                        METRICS[key] = dict(resource=attrs, scope=scope.get("scope", {}), metric=metric)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        url = urlsplit(self.path)
        if url.path == "/snapshot":
            complete, tail = frozen_bytes(PATH)
            result = BytesIO()
            with zipfile.ZipFile(result, "w", zipfile.ZIP_DEFLATED) as archive:
                archive.writestr("telemetry.jsonl", complete)
                archive.writestr("telemetry-pending-tail.bin", tail)
                archive.writestr("snapshot.json", json.dumps({"complete_bytes":len(complete), "pending_bytes":len(tail), "sha256":hashlib.sha256(complete + tail).hexdigest()}))
            data = result.getvalue()
            content_type = "application/zip"
        elif url.path == "/lookup":
            with LOCK:
                index()
                ids = parse_qs(url.query).get("trace_id", [])
                data = json.dumps({"traces":{key:TRACES.get(key, []) for key in ids}, "metrics":list(METRICS.values()), "complete_bytes":OFFSET}).encode()
            content_type = "application/json"
        else:
            self.send_error(404)
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, *_):
        pass


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
