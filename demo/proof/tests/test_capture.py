from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from capture import telemetry_snapshot


class SnapshotTests(unittest.TestCase):
    def test_incomplete_append_is_preserved_and_complete_snapshot_retried(self):
        partial = b'{"resourceSpans":'
        complete = b'{"resourceSpans":[]}\n'
        with tempfile.TemporaryDirectory() as directory, patch("capture.read_url", side_effect=[partial,complete]), patch("capture.time.sleep"):
            (_, _), attempts = telemetry_snapshot("unused", Path(directory))
            self.assertEqual(attempts, 2)
            self.assertEqual((Path(directory)/"telemetry-incomplete-attempt-1.jsonl").read_bytes(), partial)
            self.assertEqual((Path(directory)/"telemetry.jsonl").read_bytes(), complete)

    def test_malformed_evidence_is_not_silently_dropped(self):
        partial = b'{"resourceSpans":\n'
        with tempfile.TemporaryDirectory() as directory, patch("capture.read_url", return_value=partial), patch("capture.time.monotonic", side_effect=[0,11]):
            with self.assertRaises(RuntimeError):
                telemetry_snapshot("unused", Path(directory))
            self.assertEqual((Path(directory)/"telemetry-incomplete-attempt-1.jsonl").read_bytes(), partial)


if __name__ == "__main__":
    unittest.main()
