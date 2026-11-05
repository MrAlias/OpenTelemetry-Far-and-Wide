#!/usr/bin/env python3
"""Run the prepared conference demo, keeping state and trace selection explicit."""
from pathlib import Path
import argparse
import importlib.util
import json
import os
import shutil
import shlex
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.artifacts/presentation-demo'
OBI_IMAGE = 'otel/ebpf-instrument:v1.0.0'
PAYLOAD_IMAGE = 'otel-injector-images:demo'
CONTROLLER_IMAGE = 'otel-injector-operator:demo'
GO = {'gateway', 'shipping', 'warehouse', 'currency'}
spec = importlib.util.spec_from_file_location('flow', ROOT / 'demo/scripts/check-flow.py')
flow = importlib.util.module_from_spec(spec)
spec.loader.exec_module(flow)
APPS = set(flow.GRAPH) | {'gateway', 'checkout', 'inventory'}
AGENTS = APPS - GO


def save(name, value):
    WORK.mkdir(parents=True, exist_ok=True)
    target = WORK / name
    pending = target.with_suffix(target.suffix + '.new')
    pending.write_text(json.dumps(value, indent=2) + '\n')
    pending.replace(target)


def http(url, body=None):
    request = urllib.request.Request(url, data=json.dumps(body).encode() if body else None,
                                     headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)


def attributes(items):
    return {a['key']: next(iter(a['value'].values())) for a in items}


def entries(trace):
    for batch in trace.get('batches', []):
        resource = attributes(batch.get('resource', {}).get('attributes', []))
        for group in batch.get('scopeSpans', []):
            for span in group.get('spans', []):
                yield resource.get('service.name'), group.get('scope', {}).get('name', ''), span


def check_trace(trace, stage):
    """Reject an earlier configuration or an SDK/OBI transition as stage evidence."""
    rows = list(entries(trace))
    scopes = {}
    for service, scope, _ in rows:
        scopes.setdefault(service, set()).add(scope)
    obi_scopes = {'', 'go.opentelemetry.io/obi'}
    sdk = {service for service, names in scopes.items() if any(name not in obi_scopes for name in names)}
    expected = set() if stage == 'obi' else AGENTS if stage == 'fleet' else {'checkout'}
    if sdk != expected:
        raise ValueError(f'Expected {len(expected)} agent services; observed {len(sdk)}')
    if any(obi_scopes & scopes.get(service, set()) for service in expected):
        raise ValueError('SDK/OBI transition is still present in this request')
    if {'postgres', 'redis'} & set(scopes):
        raise ValueError('Datastore-server observations are still included')
    checkout = [span for service, _, span in rows if service == 'checkout']
    failed = [span for span in checkout if attributes(span.get('attributes', [])).get('error.type')]
    if stage in {'fixed', 'fleet'} and failed:
        raise ValueError('The fixed request still contains a failed Checkout operation')
    if stage == 'java' and not any(attributes(s.get('attributes', [])).get('error.type') ==
            'java.net.SocketTimeoutException' and any(
                attributes(e.get('attributes', [])).get('exception.message') == 'Connect timed out'
                for e in s.get('events', [])) for s in failed):
        raise ValueError('The configured timeout and exception event were not observed')
    if stage == 'obi' and not any(span['name'] == 'CONNECT' for span in checkout):
        raise ValueError('The failed connection is absent from the OBI baseline')
    if stage != 'obi' and not any(s['name'] == 'PricingEngine.calculate' for s in checkout):
        raise ValueError('The explicitly configured pricing-method span is missing')
    if stage != 'obi' and not any('SELECT' in s['name'] and 'products' in s['name'] for s in checkout):
        raise ValueError('The successful product-price lookup is missing')
    legacy = [attributes(b.get('resource', {}).get('attributes', [])).get(
        'process.environment_variable.LEGACY_PRICING_URL') for b in trace.get('batches', [])]
    if stage == 'java' and 'http://192.0.2.42:8080/price' not in legacy:
        raise ValueError('The explicitly exported stale setting is missing')
    if stage in {'fixed', 'fleet'} and any(value is not None for value in legacy):
        raise ValueError('The retired endpoint setting is still exported')
    if not APPS <= set(scopes):
        raise ValueError('Waiting for all eighteen application services to export this request')
    span_ids = {span['spanId'] for _, _, span in rows}
    unparented = sorted({service for service, _, span in rows
        if service != 'gateway' and span.get('kind') in ['SPAN_KIND_SERVER', 2]
        and span.get('parentSpanId') not in span_ids})
    if stage == 'fleet' and unparented:
        raise ValueError('The final fleet trace has unparented application server spans')
    return {'sdkServices': sorted(sdk), 'obiServices': sorted(set(scopes) - sdk),
            'spanCount': len(rows), 'services': sorted(scopes),
            'unparentedServerServices': unparented}


class Demo:
    def __init__(self, args):
        self.args = args
        self.context = args.context or subprocess.check_output(
            ['kubectl', 'config', 'current-context'], text=True).strip()
        if not self.context.startswith('kind-far-wide-'):
            raise ValueError('Use a dedicated kind-far-wide-* demo context; refusing another cluster')
        self.cluster = self.context.removeprefix('kind-')
        WORK.mkdir(parents=True, exist_ok=True)
        self.env = {**os.environ, 'TMPDIR': str(WORK), 'DEMO_GATEWAY': args.gateway, 'DEMO_CONTEXT': self.context}
        if os.environ.get('KUBECONFIG'):
            self.env['KUBECONFIG'] = os.pathsep.join(
                str(Path(p).expanduser().resolve()) for p in os.environ['KUBECONFIG'].split(os.pathsep) if p)

    def run(self, *argv, capture=False, input=None):
        result = subprocess.run(argv, cwd=ROOT, env=self.env, check=True, text=True,
                                input=input, stdout=subprocess.PIPE if capture else None)
        return result.stdout if capture else None

    def kube(self, *argv, capture=False, input=None):
        if not capture:
            print('$ kubectl '+shlex.join(argv), flush=True)
        return self.run('kubectl', '--context', self.context, '--cache-dir', str(WORK/'kubectl-cache'),
                        *argv, capture=capture, input=input)

    def get(self, *argv):
        return json.loads(self.kube('get', *argv, '-o', 'json', capture=True))

    def prepare(self):
        """All image work happens before the timed presentation, never in a live step."""
        self.kube('get', 'nodes')
        if self.args.build:
            self.run('make', '-C', 'demo', 'images')
            self.run('make', '-C', 'components/otel-injector-operator', 'image')
            self.run('make', '-C', 'components/otel-injector-images', 'image')
        images = [self.args.obi_image, PAYLOAD_IMAGE, CONTROLLER_IMAGE,
                  *['far-wide-demo-' + n + ':local' for n in
                    ['gateway', 'checkout', 'inventory', 'go', 'java', 'dotnet', 'python', 'rails']]]
        if self.args.obi_image == OBI_IMAGE:
            self.run('docker', 'pull', OBI_IMAGE)
        # A custom rehearsal build must be built/pulled explicitly before prepare.
        provenance = []
        for image in images:
            value = json.loads(self.run('docker', 'image', 'inspect', image, capture=True))[0]
            provenance.append({'image': image, 'id': value['Id'], 'repoDigests': value.get('RepoDigests', [])})
        self.run('kind', 'load', 'docker-image', '--name', self.cluster, *images)
        save('prepared-images.json', {'context': self.context, 'preparedAt': time.time(), 'images': provenance})
        print('All application, OBI, controller and language-agent images are loaded.')

    def reset(self):
        # Only the dedicated demo cluster is allowed above. Preserve database volumes.
        resources = self.kube('api-resources', '--api-group=demo.opentelemetry.io', '-o', 'name', capture=True)
        policy = self.kube('get', 'demoinstr', 'cluster', '--ignore-not-found', capture=True) if resources.strip() else ''
        if policy.strip():
            self.kube('apply', '-f', 'demo/k8s/fleet-instrumentation-base.yaml')
            self.wait_policy()
            self.kube('delete', 'demoinstr', 'cluster', '--timeout=300s')
        self.kube('delete', 'mutatingwebhookconfiguration', 'otel-demo-injector', '--ignore-not-found')
        self.kube('delete', 'namespace', 'otel-injector-system', '--ignore-not-found', '--timeout=180s')
        self.kube('delete', '-f', 'demo/k8s/obi.yaml', '--ignore-not-found', '--timeout=180s')
        self.kube('apply', '-f', 'demo/observability/lgtm.yaml')
        self.kube('apply', '-f', 'demo/k8s/applications.yaml')
        encoded = self.kube('create', '--dry-run=client', '-f',
                            'demo/k8s/applications.yaml', '-o', 'json', capture=True)
        # kubectl emits one JSON document per YAML object for multi-document input.
        desired = []
        decoder = json.JSONDecoder()
        while encoded.strip():
            item, end = decoder.raw_decode(encoded.lstrip())
            desired.extend(item['items'] if item.get('kind') == 'List' else [item])
            encoded = encoded.lstrip()[end:]
        for item in desired:
            if item['kind'] == 'Deployment' and item['metadata']['name'] in APPS:
                # Replace the whole template: apply alone retains manually added agent fields.
                patch = [{'op': 'replace', 'path': '/spec/template', 'value': item['spec']['template']}]
                self.kube('patch', 'deployment/'+item['metadata']['name'], '-n', 'demo-apps',
                          '--type=json', '-p', json.dumps(patch))
        self.kube('rollout', 'status', 'deployment', '-n', 'demo-apps', '--timeout=300s')
        print('Baseline restored: stale setting present; no language agents or OBI. Database retained.')

    def obi(self):
        self.kube('apply', '-f', 'demo/k8s/obi.yaml')
        if self.args.obi_image != OBI_IMAGE:
            self.kube('set', 'image', 'daemonset/obi', '-n', 'obi-system', 'obi='+self.args.obi_image)
        self.kube('rollout', 'status', 'daemonset/obi', '-n', 'obi-system', '--timeout=90s')
        print(f'OBI ready ({self.args.obi_image}). Application processes were not restarted.')

    def java(self):
        self.kube('patch', 'deployment/checkout', '-n', 'demo-apps', '--type=strategic',
                  '--patch-file', 'demo/k8s/checkout-direct-agent.patch.yaml')
        self.kube('rollout', 'status', 'deployment/checkout', '-n', 'demo-apps', '--timeout=90s')
        print('Checkout ready with the direct Java agent and configured pricing-method span.')

    def checkout_image_ids(self):
        pods = self.get('pods', '-n', 'demo-apps', '-l', 'app=checkout')
        return sorted({c['imageID'] for p in pods['items'] if not p['metadata'].get('deletionTimestamp')
                       for c in p.get('status', {}).get('containerStatuses', []) if c['name'] == 'checkout'})

    def fix(self):
        before_ids = self.checkout_image_ids()
        before = self.get('deployment/checkout', '-n', 'demo-apps')['spec']['template']
        self.kube('patch', 'deployment/checkout', '-n', 'demo-apps', '--type=strategic',
                  '--patch-file', 'demo/k8s/checkout-pricing-fixed.patch.yaml')
        self.kube('rollout', 'status', 'deployment/checkout', '-n', 'demo-apps', '--timeout=90s')
        after = self.get('deployment/checkout', '-n', 'demo-apps')['spec']['template']
        def without_setting(template):
            value = json.loads(json.dumps(template))
            for c in value['spec']['containers'] + value['spec'].get('initContainers', []):
                if 'env' in c:
                    c['env'] = [e for e in c['env'] if e['name'] != 'LEGACY_PRICING_URL']
            return value
        if without_setting(before) != without_setting(after):
            raise ValueError('Unexpected deployment change besides the retired endpoint setting')
        after_ids = self.checkout_image_ids()
        if len(before_ids) != 1 or before_ids != after_ids:
            raise ValueError('The resolved application image changed during the configuration fix')
        save('configuration-fix.json', {'before': before, 'after': after, 'sameImageAndAgent': True,
                                        'beforeImageIDs': before_ids, 'afterImageIDs': after_ids})
        print('Retired endpoint removed. Same application image and instrumentation.')

    def controller(self):
        self.run('make', '-C', 'components/otel-injector-operator', 'install')
        self.kube('apply', '-f', 'demo/k8s/fleet-instrumentation-base.yaml')
        self.wait_policy()
        print('RIO demo controller ready; shared defaults prepared; no namespace enrollment yet.')

    def wait_policy(self):
        deadline = time.monotonic() + 300
        while time.monotonic() < deadline:
            policy = self.get('demoinstr', 'cluster')
            if (policy.get('status', {}).get('phase') == 'Ready' and
                    policy['status'].get('observedGeneration') == policy['metadata']['generation']):
                return policy
            time.sleep(2)
        raise TimeoutError('Namespace policy did not finish its current generation')

    def namespace(self):
        policy = self.get('demoinstr', 'cluster')
        if not any(r['name'] == 'instrument-demo-namespace' for r in policy['spec']['rules']):
            self.kube('patch', 'demoinstr', 'cluster', '--type=json',
                      '--patch-file', 'demo/k8s/instrument-demo-namespace.patch.yaml')
        policy = self.wait_policy()
        if len(policy['status'].get('workloads', [])) != 13:
            raise ValueError('Expected thirteen additional enrolled workloads')
        print('Namespace enrolled. Controller performed the rolling restarts for 13 services.')

    def request(self):
        stage = self.args.stage
        deployed_obi = self.get('daemonset/obi', '-n', 'obi-system')['spec']['template']['spec']['containers'][0]['image']
        for _ in range(self.args.warmup):
            http(self.args.gateway.rstrip('/') + '/checkout')
        # An SDK must export before OBI can recognize it. Never present that first
        # overlapping request as a steady-state result. Every retry is new traffic.
        deadline = time.monotonic() + self.args.timeout
        last_error = 'No trace exported yet'
        attempts = []
        while time.monotonic() < deadline:
            trace_id = uuid.uuid4().hex
            request = urllib.request.Request(self.args.gateway.rstrip('/') + '/checkout',
                headers={'traceparent': f'00-{trace_id}-{os.urandom(8).hex()}-01'})
            started = time.time_ns()
            with urllib.request.urlopen(request, timeout=15) as response:
                value = json.load(response)
            ended = time.time_ns()
            attempts.append({'started': started, 'ended': ended, 'requestedTraceId': trace_id, 'orderId': value['orderId']})
            save(stage+'-attempts.json', attempts)
            flow.check_flow(value)
            time.sleep(2)
            query = urllib.parse.urlencode({'q': '{ resource.service.name = "gateway" && name = "GET /checkout" }',
                'start': int(attempts[0]['started']/1e9)-1, 'end': int(time.time())+1, 'limit': 50})
            try:
                # Prefer the traceparent ID we sent: direct lookup avoids waiting
                # for Tempo's search index. Window matching remains a fallback.
                candidates = [{'traceID': a['requestedTraceId']} for a in reversed(attempts)]
                candidates += http(self.args.tempo+'/api/search?'+query).get('traces', [])
                for candidate in candidates:
                    try:
                        trace = http(self.args.tempo+'/api/traces/'+candidate['traceID'])
                    except urllib.error.HTTPError as error:
                        if error.code == 404:
                            continue
                        raise
                    roots = [s for service, _, s in entries(trace) if service == 'gateway' and
                             s['name'] == 'GET /checkout' and s.get('kind') in ['SPAN_KIND_SERVER', 2] and
                             any(a['started']-20_000_000 <= int(s['startTimeUnixNano']) <= a['ended'] for a in attempts)]
                    if len(roots) != 1:
                        continue
                    attempt = next(a for a in attempts if a['started']-20_000_000 <= int(roots[0]['startTimeUnixNano']) <= a['ended'])
                    try:
                        summary = check_trace(trace, stage)
                    except ValueError as error:
                        last_error = str(error)
                        continue
                    summary.update(stage=stage, traceId=candidate['traceID'], capturedAt=time.time(),
                        durationMs=(int(roots[0]['endTimeUnixNano'])-int(roots[0]['startTimeUnixNano']))/1e6,
                        orderId=attempt['orderId'], requestStartedUnixNano=attempt['started'],
                        context=self.context, obiImage=deployed_obi)
                    save(stage+'-trace.json', trace)
                    save(stage+'-selection.json', summary)
                    dashboard = {'uid': 'far-wide-live', 'title': 'Follow the customer order',
                        'schemaVersion': 41, 'version': 0, 'time': {'from': 'now-1h', 'to': 'now'},
                        'panels': [{'id': 1, 'type': 'traces', 'title': {
                            'obi': 'OBI · find the wait', 'java': 'Java detail · explain the wait',
                            'fixed': 'Same image · retired endpoint removed',
                            'fleet': 'Namespace enrollment · language detail and OBI'}[stage],
                            'gridPos': {'h': 24, 'w': 24, 'x': 0, 'y': 0},
                            'datasource': {'type': 'tempo', 'uid': 'tempo'},
                            'targets': [{'refId': 'A', 'datasource': {'type': 'tempo', 'uid': 'tempo'},
                                         'queryType': 'traceId', 'query': candidate['traceID']}]}]}
                    http(self.args.grafana+'/api/dashboards/db', {'dashboard': dashboard, 'overwrite': True})
                    print(f"Order {attempt['orderId']} completed in {summary['durationMs']:.0f} ms")
                    print('Trace: '+candidate['traceID'])
                    print('View: '+self.args.grafana+'/d/far-wide-live/follow-the-customer-order')
                    return
            except (ValueError, urllib.error.HTTPError) as error:
                last_error = str(error)
            time.sleep(2)
        raise TimeoutError(f'No fresh, settled {stage} trace: {last_error}. Use the matching fallback.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--context', default=os.environ.get('DEMO_CONTEXT'))
    parser.add_argument('--obi-image', default=os.environ.get('DEMO_OBI_IMAGE', OBI_IMAGE))
    parser.add_argument('--gateway', default=os.environ.get('DEMO_GATEWAY', 'http://localhost:8080'))
    parser.add_argument('--tempo', default=os.environ.get('DEMO_TEMPO', 'http://localhost:3200'))
    parser.add_argument('--grafana', default=os.environ.get('DEMO_GRAFANA', 'http://localhost:3000'))
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('prepare').add_argument('--build', action='store_true')
    for name in ['reset', 'obi', 'java', 'fix', 'controller', 'namespace']:
        commands.add_parser(name)
    request = commands.add_parser('request')
    request.add_argument('stage', choices=['obi', 'java', 'fixed', 'fleet'])
    request.add_argument('--warmup', type=int, default=3)
    request.add_argument('--timeout', type=int, default=60)
    args = parser.parse_args()
    if getattr(args, 'warmup', 1) < 0 or getattr(args, 'timeout', 1) <= 0:
        parser.error('Warmup must be nonnegative and timeout positive')
    for name in ['kubectl'] + (['docker', 'kind', 'make'] if args.command == 'prepare' else []):
        if not shutil.which(name):
            parser.error(f'Missing required command: {name}')
    demo = Demo(args)
    getattr(demo, args.command)()


if __name__ == '__main__':
    try:
        main()
    except (ValueError, TimeoutError, subprocess.CalledProcessError, urllib.error.URLError) as error:
        print('Demo stopped: '+str(error), file=sys.stderr)
        raise SystemExit(1)
