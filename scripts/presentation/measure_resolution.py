"""Capture matched successful requests around the demo's explicit application fix."""
from pathlib import Path
import argparse, importlib.util, json, math, os, statistics, subprocess, time, urllib.error, urllib.parse, urllib.request, uuid
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.artifacts/story-refinement'
WORK.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('flow',ROOT/'demo/scripts/check-flow.py');flow=importlib.util.module_from_spec(spec);spec.loader.exec_module(flow)
def get(url):
    with urllib.request.urlopen(url,timeout=20) as r:return json.load(r)
def request():
    trace_id=uuid.uuid4().hex
    req=urllib.request.Request('http://127.0.0.1:18080/checkout',headers={'traceparent':f'00-{trace_id}-{os.urandom(8).hex()}-01'})
    begin=time.time_ns(); clock=time.perf_counter_ns()
    with urllib.request.urlopen(req,timeout=15) as r:
        result=json.load(r); status=r.status
    elapsed=(time.perf_counter_ns()-clock)/1e6
    flow.check_flow(result)
    return {'traceId':trace_id,'startedUnixNano':begin,'clientDurationMs':elapsed,'status':status,'price':result['price'],'orderId':result['orderId']}
def spans(trace):
    for batch in trace.get('batches',trace.get('resourceSpans',[])):
        service=next((a['value'].get('stringValue') for a in batch.get('resource',{}).get('attributes',[]) if a['key']=='service.name'),None)
        for group in batch.get('scopeSpans',[]):
            for span in group.get('spans',[]):yield service,span
def resolve_trace(row):
    """Confirm identity from the actual Gateway span, never substitute durations."""
    begin=row['startedUnixNano'];end=begin+round(row['clientDurationMs']*1e6)
    def matches(trace):
        return [s for n,s in spans(trace) if n=='gateway' and s.get('name')=='GET /checkout'
                and s.get('kind') in ['SPAN_KIND_SERVER',2]
                and int(s['startTimeUnixNano'])>=begin-20_000_000
                and int(s['endTimeUnixNano'])<=end+20_000_000]
    try:
        trace=get('http://127.0.0.1:13200/api/traces/'+row['traceId'])
        if len(matches(trace))==1:return trace
    except urllib.error.HTTPError as error:
        if error.code!=404:raise
    # Requests are sequential, with a 100 ms gap. The 20 ms clock allowance
    # cannot bridge that gap. Require exactly one exported Gateway server span
    # contained in this request's window; ambiguity is a failure, not a guess.
    query=urllib.parse.urlencode({'q':'{ resource.service.name = "gateway" && name = "GET /checkout" }',
        'start':math.floor(begin/1e9)-1,'end':math.ceil(end/1e9)+1,'limit':100})
    candidates=get('http://127.0.0.1:13200/api/search?'+query).get('traces',[])
    found={}
    for candidate in candidates:
        tid=candidate['traceID'].zfill(32)
        if not any(begin-20_000_000<=int(s['startTimeUnixNano'])<=end+20_000_000
                   for group in candidate.get('spanSets',[]) for s in group.get('spans',[])):continue
        trace=get('http://127.0.0.1:13200/api/traces/'+tid)
        if len(matches(trace))==1:found[tid]=trace
    if len(found)!=1:raise ValueError('No unique exported Gateway span in the client request window')
    tid,trace=next(iter(found.items()))
    row.setdefault('requestedTraceId',row['traceId'])
    row['traceId']=tid
    row['correlation']='Unique exported Gateway server span inside the recorded client request window (20 ms clock allowance)'
    return trace
parser=argparse.ArgumentParser();parser.add_argument('phase',choices=['before','after']);parser.add_argument('--count',type=int,default=30);parser.add_argument('--warmup',type=int,default=20);parser.add_argument('--expected-sdk-services',type=int,default=1);parser.add_argument('--resume',action='store_true');parser.add_argument('--work-dir',type=Path,default=WORK);args=parser.parse_args()
WORK=args.work_dir.resolve();WORK.mkdir(parents=True,exist_ok=True)
assert args.count>=2 and args.warmup>=1
if args.resume:
    saved=json.loads((WORK/(args.phase+'-requests.json')).read_text());rows=saved['requests']
    assert saved['phase']==args.phase and len(rows)==args.count
    assert all(r['status']==200 and r['price']==42 for r in rows)
else:
    state=json.loads(subprocess.check_output(['kubectl','--kubeconfig',str(ROOT/'.artifacts/demo-capture/kubeconfig'),'-n','demo-apps','get','deploy','checkout','-o','json']))
    pods=json.loads(subprocess.check_output(['kubectl','--kubeconfig',str(ROOT/'.artifacts/demo-capture/kubeconfig'),'-n','demo-apps','get','pods','-l','app=checkout','-o','json']))
    state['measuredContainerImageIDs']=sorted({c['imageID'] for p in pods['items'] if not p['metadata'].get('deletionTimestamp') for c in p['status'].get('containerStatuses',[]) if c['name']=='checkout'})
    (WORK/(args.phase+'-deployment.json')).write_text(json.dumps(state,indent=2)+'\n')
    warm=[];consecutive=0
    for _ in range(args.warmup+10):
        try:warm.append(request());consecutive+=1
        except Exception as error:warm.append({'error':str(error)});consecutive=0
        if consecutive>=args.warmup:break
        time.sleep(.1)
    assert consecutive>=args.warmup, 'Cannot measure an unhealthy or cold request path'
    rows=[]
    for _ in range(args.count):
        rows.append(request());time.sleep(.1)
    assert len({r['orderId'] for r in rows})==args.count
    saved={'phase':args.phase,'protocol':f'{args.count} sequential successful full-flow requests after {args.warmup} consecutive successful warmups; concurrency one, 100 ms inter-request pause, no narration generation/build/recording during measurement','warmup':warm,'requests':rows}
    (WORK/(args.phase+'-requests.json')).write_text(json.dumps(saved,indent=2)+'\n')
# Allow asynchronous trace export, then correlate the actual request IDs.
for attempt in range(40):
    pending=[]
    for row in rows:
        if row.get('evidenceComplete'):continue
        try:
            trace=resolve_trace(row)
            entries=list(spans(trace))
            gateway=[s for service,s in entries if service=='gateway' and s.get('name')=='GET /checkout' and s.get('kind') in ['SPAN_KIND_SERVER',2]]
            methods=[s for service,s in entries if service=='checkout' and s.get('name')=='PricingEngine.calculate']
            if len(gateway)!=1 or len(methods)!=1:raise ValueError('Incomplete trace export')
            duration=lambda s:(int(s['endTimeUnixNano'])-int(s['startTimeUnixNano']))/1e6
            row['serverDurationMs']=duration(gateway[0]);row['pricingDurationMs']=duration(methods[0]);row['services']=sorted({service for service,s in entries if service})
            expected=set(flow.GRAPH)|{'gateway','checkout','inventory','postgres','redis'}
            assert set(row['services'])<=expected, row['services']
            # The response already proves every application step completed.
            # Latency comparisons require the exported Gateway and pricing
            # spans above, not every protocol span sharing their trace ID.
            # OBI can report some .NET branches as independent roots; retain
            # those coverage gaps explicitly rather than discard fast requests.
            row['applicationResourcesNotLinked']=sorted((expected-{'postgres','redis'})-set(row['services']))
            sdk={next((a['value'].get('stringValue') for a in b.get('resource',{}).get('attributes',[]) if a['key']=='service.name'),None) for b in trace.get('batches',[]) if any(g.get('scope',{}).get('name') for g in b.get('scopeSpans',[]))}
            assert len(sdk)==args.expected_sdk_services, sdk
            row['sdkServices']=sorted(sdk)
            row['evidenceComplete']=True
            (WORK/'traces').mkdir(exist_ok=True);(WORK/'traces'/(row['traceId']+'.json')).write_text(json.dumps(trace,indent=2)+'\n')
        except Exception:pending.append(row['traceId'])
    if not pending:break
    if attempt==39:raise RuntimeError(f'Missing complete exported requests: {pending}')
    time.sleep(2)
assert len({r['traceId'] for r in rows})==args.count, 'Two requests cannot share an observed trace'
saved['traceCoverageNote']='Every response passed the complete 18-service flow check and every timed request has Gateway and PricingEngine.calculate spans. Other OBI application/protocol observations may be independently rooted; applicationResourcesNotLinked records that coverage separately from the measured durations.'
saved['medianServerMs']=statistics.median(r['serverDurationMs'] for r in rows)
saved['medianClientMs']=statistics.median(r['clientDurationMs'] for r in rows)
saved['medianPricingMs']=statistics.median(r['pricingDurationMs'] for r in rows)
saved['exemplar']=min(rows,key=lambda r:abs(r['serverDurationMs']-saved['medianServerMs']))
(WORK/(args.phase+'-requests.json')).write_text(json.dumps(saved,indent=2)+'\n')
print(json.dumps({k:saved[k] for k in ['phase','medianServerMs','medianClientMs','medianPricingMs','exemplar']}),flush=True)
