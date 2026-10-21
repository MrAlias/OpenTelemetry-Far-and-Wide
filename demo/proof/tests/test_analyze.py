import copy
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from analyze import check_request, report


class TraceEvidenceTests(unittest.TestCase):
    def setUp(self):
        self.request = {"trace_id": "a" * 32, "external_parent_span_id": "0" * 15 + "1", "status": 200, "start_ns": 1, "end_ns": 2}
        self.spans = []
        parent = self.request["external_parent_span_id"]
        for index, (service, kind) in enumerate([("gateway", 2), ("gateway", 3), ("checkout", 2), ("checkout", 3), ("inventory", 2)], 2):
            span_id = f"{index:016x}"
            self.spans.append({"spanId":span_id, "parentSpanId":parent, "name":"GET /checkout", "kind":kind,
                               "resource":{"service.name":service, "telemetry.distro.name":"opentelemetry-ebpf-instrumentation"}, "scope":{}})
            parent = span_id

    def test_complete_breadth_trace(self):
        self.assertTrue(check_request(self.request, self.spans, "breadth")["passed"])

    def test_legitimate_obi_processing_parent(self):
        processing = copy.deepcopy(self.spans[0])
        processing.update(spanId="f" * 16, parentSpanId=self.spans[0]["spanId"], kind=1, name="processing")
        self.spans[1]["parentSpanId"] = processing["spanId"]
        self.spans.append(processing)
        self.assertTrue(check_request(self.request, self.spans, "breadth")["passed"])

    def test_missing_processing_parent_fails(self):
        self.spans[1]["parentSpanId"] = "f" * 16
        self.assertFalse(check_request(self.request, self.spans, "breadth")["passed"])

    def test_processing_cycle_fails(self):
        middle = copy.deepcopy(self.spans[0])
        middle.update(spanId="f" * 16, parentSpanId="f" * 16, kind=1, name="processing")
        self.spans[1]["parentSpanId"] = middle["spanId"]
        self.spans.append(middle)
        self.assertFalse(check_request(self.request, self.spans, "breadth")["passed"])

    def test_duplicate_role_fails(self):
        duplicate = copy.deepcopy(self.spans[2])
        duplicate["spanId"] = "f" * 16
        self.spans.append(duplicate)
        self.assertFalse(check_request(self.request, self.spans, "breadth")["passed"])

    def test_missing_service_fails(self):
        self.assertFalse(check_request(self.request, self.spans[:-1], "breadth")["passed"])

    def test_http_error_with_complete_telemetry_still_fails(self):
        self.request["status"] = 502
        self.assertFalse(check_request(self.request, self.spans, "breadth")["passed"])

    def test_depth_requires_correlated_method_and_sdk_owner(self):
        for span in self.spans[2:4]:
            span["resource"]["telemetry.distro.name"] = "opentelemetry-java-instrumentation"
        self.assertFalse(check_request(self.request, self.spans, "depth")["passed"])
        method = copy.deepcopy(self.spans[2])
        method.update(spanId="f" * 16, parentSpanId=self.spans[2]["spanId"], kind=1,
                      name="PricingEngine.calculate", startTimeUnixNano="0", endTimeUnixNano="150000000")
        self.spans.append(method)
        self.assertTrue(check_request(self.request, self.spans, "depth")["passed"])
        method["parentSpanId"] = self.request["external_parent_span_id"]
        self.assertFalse(check_request(self.request, self.spans, "depth")["passed"])

    def test_stale_or_absent_metrics_fail(self):
        self.assertFalse(report([self.request], {self.request["trace_id"]:self.spans}, [], "breadth")["passed"])
        metrics = []
        for service in ["gateway", "checkout", "inventory"]:
            metrics.append({"resource":{"service.name":service},"scope":{"name":"go.opentelemetry.io/obi"},
                            "metric":{"name":"http.server.request.duration","histogram":{"dataPoints":[
                                {"timeUnixNano":str(time),"count":"100","attributes":[{"key":"http.response.status_code","value":{"intValue":"200"}}]}
                                for time in [1,2]]}}})
        self.assertFalse(report([self.request], {self.request["trace_id"]:self.spans}, metrics, "breadth")["passed"])

    def test_empty_sample_is_not_proof(self):
        with self.assertRaises(ValueError):
            report([], {}, [], "breadth")


if __name__ == "__main__":
    unittest.main()
