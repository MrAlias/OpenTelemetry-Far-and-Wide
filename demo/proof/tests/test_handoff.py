from io import BytesIO
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from capture import stable_telemetry_snapshot
from analyze import server_counts, verify_metric_counts
from evidence_server import frozen_bytes
from handoff import checkout_errors, candidate_metrics
import test_analyze


class AdmissionTests(unittest.TestCase):
    def setUp(self):
        fixture = test_analyze.TraceEvidenceTests()
        fixture.setUp()
        self.spans = fixture.spans[2:]
        for span in self.spans[:2]:
            span["resource"]["proof.pod"] = "candidate"
        self.record = {"parent_span_id":fixture.spans[1]["spanId"], "status":200}

    def test_complete_candidate_chain_admitted(self):
        self.assertEqual(checkout_errors(self.record, self.spans, False, "candidate"), [])

    def test_old_pod_telemetry_cannot_admit_candidate(self):
        self.assertTrue(checkout_errors(self.record, self.spans, False, "different"))

    def test_missing_export_keeps_gate_closed(self):
        self.assertTrue(checkout_errors(self.record, self.spans[:1], False, "candidate"))

    def test_breadth_cannot_satisfy_depth_admission(self):
        self.assertTrue(checkout_errors(self.record, self.spans, True, "candidate"))

    def test_stale_metrics_cannot_admit_candidate(self):
        item = {"resource":{"service.name":"checkout","proof.pod":"candidate"},"scope":{"name":"go.opentelemetry.io/obi"},"metric":{"name":"http.server.request.duration","histogram":{"dataPoints":[{"count":"1","timeUnixNano":"10","attributes":[{"key":"http.response.status_code","value":{"intValue":"200"}}]}]}}}
        self.assertTrue(candidate_metrics([item], "candidate", 10))
        self.assertFalse(candidate_metrics([item], "candidate", 11))
        self.assertFalse(candidate_metrics([item], "different", 10))


class FrozenSnapshotTests(unittest.TestCase):
    def test_snapshot_preserves_partial_tail_separately(self):
        complete = b'{"resourceSpans":[]}\n'
        tail = b'{"resourceSpans":'
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "source"
            path.write_bytes(complete + tail)
            self.assertEqual(frozen_bytes(path), (complete, tail))
            output = BytesIO()
            with zipfile.ZipFile(output, "w") as archive:
                archive.writestr("telemetry.jsonl", complete)
                archive.writestr("telemetry-pending-tail.bin", tail)
                archive.writestr("snapshot.json", json.dumps({"complete_bytes":len(complete),"pending_bytes":len(tail),"sha256":hashlib.sha256(complete+tail).hexdigest()}))
            with patch("capture.read_url", return_value=output.getvalue()):
                stable_telemetry_snapshot("unused", Path(folder))
            self.assertEqual((Path(folder)/"telemetry-pending-tail.bin").read_bytes(), tail)

    def test_complete_malformed_record_fails_validation(self):
        complete = b'{broken}\n'
        output = BytesIO()
        with zipfile.ZipFile(output, "w") as archive:
            archive.writestr("telemetry.jsonl", complete)
            archive.writestr("telemetry-pending-tail.bin", b"")
            archive.writestr("snapshot.json", json.dumps({"complete_bytes":len(complete),"pending_bytes":0,"sha256":hashlib.sha256(complete).hexdigest()}))
        with tempfile.TemporaryDirectory() as folder, patch("capture.read_url", return_value=output.getvalue()):
            with self.assertRaises(json.JSONDecodeError):
                stable_telemetry_snapshot("unused", Path(folder))


class MetricCountTests(unittest.TestCase):
    def metric(self, count):
        return {"resource":{"service.name":"checkout","proof.pod":"pod"},"scope":{"name":"go.opentelemetry.io/obi"},"metric":{"name":"http.server.request.duration","histogram":{"dataPoints":[{"count":str(count),"timeUnixNano":"10","attributes":[{"key":"http.response.status_code","value":{"intValue":"200"}}]}]}}}

    def test_repeated_exports_are_not_added_as_new_requests(self):
        self.assertEqual(server_counts([self.metric(5),self.metric(6),self.metric(6)]), {"pod":6})

    def test_trace_presence_does_not_hide_missing_request_metric(self):
        request = {"trace_id":"a"}
        traces = {"a":[{"kind":2,"resource":{"service.name":"checkout","proof.pod":"pod"}}]}
        with tempfile.TemporaryDirectory() as folder:
            (Path(folder)/"metric-baseline.json").write_text(json.dumps({"metrics":[self.metric(5)]}))
            self.assertFalse(verify_metric_counts(folder,[request],traces,[self.metric(5)])["passed"])
            self.assertTrue(verify_metric_counts(folder,[request],traces,[self.metric(6)])["passed"])
