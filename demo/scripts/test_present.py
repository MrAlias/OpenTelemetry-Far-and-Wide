"""Guard the rehearsal against stale, partial, and transitional trace evidence."""
from copy import deepcopy
from pathlib import Path
import importlib.util
import json
import unittest

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('present', ROOT/'demo/scripts/present.py')
present = importlib.util.module_from_spec(spec)
spec.loader.exec_module(present)


def captured(stage):
    return json.loads((ROOT/f'public/demo-capture/{stage}-trace-evidence.json').read_text())


class EvidenceSelection(unittest.TestCase):
    def test_recorded_stages_have_complete_application_coverage(self):
        for stage in ['obi', 'java', 'fixed', 'fleet']:
            with self.subTest(stage=stage):
                summary = present.check_trace(captured(stage), stage)
                self.assertEqual(set(summary['services']), present.APPS)
        summary = present.check_trace(captured('fleet'), 'fleet')
        self.assertEqual(set(summary['obiServices']), present.GO)
        self.assertEqual(len(summary['sdkServices']), 14)
        self.assertEqual(summary['unparentedServerServices'], [])

    def test_wait_for_late_service_export(self):
        trace = captured('obi')
        trace['batches'] = [b for b in trace['batches'] if
            present.attributes(b['resource']['attributes'])['service.name'] != 'fraud']
        with self.assertRaisesRegex(ValueError, 'eighteen'):
            present.check_trace(trace, 'obi')

    def test_reject_old_stage_after_agent_rollout(self):
        with self.assertRaisesRegex(ValueError, 'agent services'):
            present.check_trace(captured('obi'), 'java')

    def test_reject_first_request_with_obi_sdk_overlap(self):
        trace = captured('java')
        old = next(b for b in captured('obi')['batches'] if
            present.attributes(b['resource']['attributes'])['service.name'] == 'checkout')
        trace['batches'].append(deepcopy(old))
        with self.assertRaisesRegex(ValueError, 'transition'):
            present.check_trace(trace, 'java')

    def test_reject_pre_fix_request_as_resolution(self):
        with self.assertRaisesRegex(ValueError, 'failed Checkout'):
            present.check_trace(captured('java'), 'fixed')

    def test_fixed_result_must_retain_successful_price_lookup(self):
        trace = captured('fixed')
        for batch in trace['batches']:
            if present.attributes(batch['resource']['attributes'])['service.name'] == 'checkout':
                for group in batch['scopeSpans']:
                    group['spans'] = [s for s in group['spans'] if not
                        ('SELECT' in s['name'] and 'products' in s['name'])]
        with self.assertRaisesRegex(ValueError, 'product-price lookup'):
            present.check_trace(trace, 'fixed')

    def test_fixed_result_must_not_export_the_removed_setting(self):
        trace = captured('fixed')
        batch = next(b for b in trace['batches'] if
            present.attributes(b['resource']['attributes'])['service.name'] == 'checkout')
        batch['resource']['attributes'].append({'key': 'process.environment_variable.LEGACY_PRICING_URL',
            'value': {'stringValue': 'http://192.0.2.42:8080/price'}})
        with self.assertRaisesRegex(ValueError, 'still exported'):
            present.check_trace(trace, 'fixed')

    def test_reject_broken_branch_as_complete_fleet_result(self):
        trace = captured('fleet')
        span = next(span for service, _, span in present.entries(trace)
                    if service == 'cart' and span['name'] == 'GET /work')
        span.pop('parentSpanId', None)
        with self.assertRaisesRegex(ValueError, 'unparented'):
            present.check_trace(trace, 'fleet')

    def test_reject_datastore_server_as_application_evidence(self):
        trace = captured('fleet')
        extra = deepcopy(next(b for b in trace['batches'] if
            present.attributes(b['resource']['attributes'])['service.name'] == 'currency'))
        next(a for a in extra['resource']['attributes'] if a['key'] == 'service.name')['value']['stringValue'] = 'postgres'
        trace['batches'].append(extra)
        with self.assertRaisesRegex(ValueError, 'Datastore-server'):
            present.check_trace(trace, 'fleet')


if __name__ == '__main__':
    unittest.main()
