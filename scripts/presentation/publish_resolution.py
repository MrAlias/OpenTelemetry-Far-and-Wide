"""Publish measured traces and a same-image, configuration-only comparison."""
from pathlib import Path
import argparse, copy, datetime, hashlib, json
from trace_snapshot import public_snapshot

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--work-dir', type=Path, required=True)
args = parser.parse_args()
work = args.work_dir.resolve()
key = 'process.environment_variable.LEGACY_PRICING_URL'

def read(path):
    return json.loads(path.read_text())

def save(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')

def entries(trace):
    for batch in trace['batches']:
        resource = {a['key']:a['value'].get('stringValue') for a in batch['resource']['attributes']}
        for group in batch['scopeSpans']:
            for span in group['spans']:
                yield resource.get('service.name'), span, group.get('scope', {}).get('name'), resource

def milliseconds(span):
    return (int(span['endTimeUnixNano']) - int(span['startTimeUnixNano'])) / 1e6

phases = {name:read(work / (name + '-requests.json')) for name in ['before', 'after']}
states = {name:read(work / (name + '-deployment.json')) for name in phases}
templates = []
for name, state in states.items():
    template = copy.deepcopy(state['spec']['template'])
    container = next(c for c in template['spec']['containers'] if c['name'] == 'checkout')
    configured = [e for e in container['env'] if e['name'] == 'LEGACY_PRICING_URL']
    assert bool(configured) == (name == 'before')
    # kubectl set env can also apply the same variable to init containers.
    # Compare every container, excluding only that one setting.
    for target in template['spec']['containers'] + template['spec'].get('initContainers', []):
        remaining = [e for e in target.get('env', []) if e['name'] != 'LEGACY_PRICING_URL']
        if remaining:
            target['env'] = remaining
        else:
            target.pop('env', None)
    templates.append(template)
assert templates[0] == templates[1], 'A setting besides LEGACY_PRICING_URL changed'
image_ids = states['before']['measuredContainerImageIDs']
assert len(image_ids) == 1 and image_ids == states['after']['measuredContainerImageIDs']

published = {}
for name, phase in phases.items():
    assert len(phase['requests']) == 30 and len(phase['warmup']) >= 20
    for row in phase['requests']:
        assert row['evidenceComplete'] and row['sdkServices'] == ['checkout']
        trace = read(work / 'traces' / (row['traceId'] + '.json'))
        rows = list(entries(trace))
        checkout = [(s, r) for service, s, _, r in rows if service == 'checkout']
        failed = [s for s, _ in checkout if any(a['key'] == 'error.type' and a['value'].get('stringValue') == 'java.net.SocketTimeoutException' for a in s.get('attributes', []))]
        assert len(failed) == (1 if name == 'before' else 0)
        assert any('SELECT' in s['name'] and 'products' in s['name'] for s, _ in checkout)
        assert any(key in resource for _, resource in checkout) == (name == 'before')
        if name == 'before':
            assert all(resource.get(key) == 'http://192.0.2.42:8080/price'
                for span, resource in checkout if span in failed)
    example = phase['exemplar']
    published[name] = {
        'image':templates[0]['spec']['containers'][0]['image'], 'imageId':image_ids[0],
        'sampleCount':30, 'warmupCount':20, 'requestMedianMs':phase['medianServerMs'],
        'pricingMedianMs':phase['medianPricingMs'], 'exemplarTraceId':example['traceId'],
        'exemplarRequestMs':example['serverDurationMs'], 'exemplarPricingMs':example['pricingDurationMs'],
        'samples':[{'traceId':r['traceId'], 'requestMs':r['serverDurationMs'], 'pricingMs':r['pricingDurationMs'], 'status':r['status'], 'price':r['price']} for r in phase['requests']],
        'traceCoverage':{'completeApplicationResponses':30, 'timedGatewayAndPricingSpans':30,
            'requestsWithUnlinkedApplicationResources':sum(bool(r.get('applicationResourcesNotLinked')) for r in phase['requests']),
            'identityRecoveredFromRequestWindow':sum(bool(r.get('requestedTraceId')) for r in phase['requests'])},
    }
    save(ROOT / 'public/demo-capture' / ('timeout-' + name + '-trace.json'),
        public_snapshot(read(work / 'traces' / (example['traceId'] + '.json'))))

summary = {name:read(work / (name + '-trace-summary.json')) for name in ['obi', 'java', 'fixed']}
fleet = read(work / 'fixed-fleet-summary.json')
result = {
    'version':'2026-11-02-configured-legacy-endpoint',
    'recordedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'method':'Median Gateway GET /checkout server duration; 30 sequential complete successful checkouts per configuration after 20 successful warmups, concurrency one, 100 ms between requests. Same image digest and Pod template except LEGACY_PRICING_URL. Exported Gateway and pricing-method spans supply durations. No concurrent build, recording or voice generation during measurement. Local JVM, database and scheduling variation remains.',
    'controls':{'sameInstrumentation':True, 'sameImage':True, 'imageId':image_ids[0],
        'sameTemplateExceptLegacyUrlSha256':hashlib.sha256(json.dumps(templates[0],sort_keys=True).encode()).hexdigest(),
        'onlyChangedEnvironmentVariable':'LEGACY_PRICING_URL', 'sdkServices':['checkout'],
        'applicationServices':18, 'databaseDependencies':['postgres','redis'],
        'fullResponseFlowValidated':True, 'concurrency':1, 'noConcurrentBuildRecordingOrNarration':True},
    **published,
    'change':'Remove LEGACY_PRICING_URL from the Deployment and roll the same image. Retain the current PostgreSQL price lookup, value 42, order creation and full checkout flow. The absent setting also disappears from the explicitly captured resource attribute.',
    'scope':'Local seeded missing-dependency demonstration, not a production benchmark. No incident, labor, outage or revenue saving inferred from latency.',
    'sources':['scripts/presentation/measure_resolution.py', 'scripts/presentation/publish_resolution.py', 'demo/apps/checkout/src/main/java/demo/checkout/PricingEngine.java', 'demo/apps/checkout/launch.sh', 'demo/k8s/checkout-pricing-fixed.patch.yaml'],
    'openingExemplarMs':summary['obi']['selected']['durationMs'],
    'visualEvidence':{'openingTraceId':summary['obi']['traceId'], 'javaTraceId':summary['java']['traceId'], 'fixedTraceId':summary['fixed']['traceId'], 'fleetTraceId':fleet['traceId']},
    'fleetAfterFix':fleet,
}
save(ROOT / 'presentation/data/resolution.json', result)

capture_path = ROOT / 'public/demo-capture/capture-summary.json'
capture = read(capture_path)
obi_rows = list(entries(read(work / 'obi-trace.json')))
gateway = next(s for n, s, _, _ in obi_rows if n == 'gateway' and s['name'] == 'GET /checkout' and s['kind'] == 'SPAN_KIND_SERVER')
checkout = next(s for n, s, _, _ in obi_rows if n == 'checkout' and s['kind'] == 'SPAN_KIND_SERVER')
failed = next(s for n, s, _, _ in obi_rows if n == 'checkout' and s['name'] == 'CONNECT')
capture['source'] = 'Actual isolated local demo; configuration-only resolution recorded November 2, 2026'
capture['baseline'] = {'traceId':summary['obi']['traceId'], 'rootDurationMs':milliseconds(gateway), 'checkoutDurationMs':milliseconds(checkout), 'failedConnectionMs':milliseconds(failed), 'failedConnectionRowY':500, 'checkoutSpanId':checkout['spanId'], 'spanCount':len(obi_rows), 'services':sorted({n for n, *_ in obi_rows})}
java_rows = list(entries(read(work / 'java-trace.json')))
capture['javaDetail'] = {'traceId':summary['java']['traceId'], 'pricingMs':milliseconds(next(s for n, s, _, _ in java_rows if n == 'checkout' and s['name'] == 'PricingEngine.calculate')), 'fault':'Stale optional endpoint setting; real connection timeout, then successful PostgreSQL fallback', 'evidence':'public/demo-capture/java-trace-evidence.json'}
capture.pop('sourceEdit', None)
capture['configurationFix'] = {'variable':'LEGACY_PRICING_URL', 'sameImageId':image_ids[0], 'command':'kubectl set env deployment/checkout -n demo-apps LEGACY_PRICING_URL-', 'resourceAttribute':key, 'recording':'public/demo-capture/fix-pricing-edited.mp4'}
capture['fleetTrace'] = {'traceID':fleet['traceId'], 'fixedCheckout':True, **{k:fleet[k] for k in ['pricingMs','sdkServices','obiOnlyServices']}}
fleet_rows = list(entries(read(work / 'fixed-fleet-trace.json')))
capture['languageSdkServices'] = {n:sorted({scope for service, _, scope, _ in fleet_rows if service == n and scope}) for n in fleet['sdkServices']}
capture['operatorIdentity']['recording'] = 'Talk-specific RIO demo snapshot; upstream capability is a goal, with the implementation still open'
policy = read(work / 'namespace-policy.json')
assert policy['status']['phase'] == 'Ready'
assert policy['metadata']['generation'] == policy['status']['observedGeneration']
assert len(policy['status']['workloads']) == 13
capture['namespaceSelection']['recorded'] = '2026-11-02'
capture['namespaceSelection']['observedGeneration'] = policy['status']['observedGeneration']
capture['namespaceSelection']['verification']['fullPolicyGeneration'] = policy['metadata']['generation']
save(capture_path, capture)
for name, destination in [('obi','obi-trace-evidence'), ('java','java-trace-evidence'), ('fixed','fixed-request-evidence'), ('fixed-fleet','fixed-fleet-trace-evidence')]:
    save(ROOT / 'public/demo-capture' / (destination + '.json'), public_snapshot(read(work / (name + '-trace.json'))))
evidence = json.loads((ROOT / 'public/animation/evidence.js').read_text().removeprefix('window.DEMO_EVIDENCE = ').strip().removesuffix(';'))
evidence.update(traceId=summary['obi']['traceId'], failedConnectionMs=milliseconds(failed), failedConnectionRowY=500)
evidence['serverDurationMs'] = {n:milliseconds(s) for n,s,_,_ in obi_rows if s.get('kind') == 'SPAN_KIND_SERVER'}
evidence['source'] = 'public/demo-capture/obi-trace-evidence.json'
(ROOT / 'public/animation/evidence.js').write_text('window.DEMO_EVIDENCE = ' + json.dumps(evidence,indent=2) + ';\n')
print(f"Same-image configuration fix: {result['before']['requestMedianMs']:.1f} → {result['after']['requestMedianMs']:.1f} ms; 60 actual traces checked")
