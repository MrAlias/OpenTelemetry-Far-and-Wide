"""Select actual complete fleet evidence for the presentation, outside the talk track."""
from pathlib import Path
import argparse,json,time,urllib.parse,urllib.request
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.artifacts/demo-capture/evidence'

def get(url):
    with urllib.request.urlopen(url,timeout=30) as response:return json.load(response)

def inspect(trace):
    scopes={}
    for batch in trace.get('batches',[]):
        attrs={a['key']:a['value'].get('stringValue') for a in batch['resource']['attributes']}
        name=attrs.get('service.name')
        scopes.setdefault(name,set()).update(group.get('scope',{}).get('name') for group in batch.get('scopeSpans',[]))
    return {name:sorted(n for n in names if n) for name,names in scopes.items() if any(names)},scopes

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--start',type=int);parser.add_argument('--warm',action='store_true');parser.add_argument('--update-dashboard',action='store_true');args=parser.parse_args()
    start=args.start or int(time.time())-1
    if args.warm:
        requests=[]
        for _ in range(8):
            try:
                result=get('http://127.0.0.1:18080/checkout');requests.append({'success':True,'orderId':result.get('orderId'),'time':time.time()})
            except Exception as error:requests.append({'success':False,'error':str(error),'time':time.time()})
            if sum(x['success'] for x in requests)>=4:break
            time.sleep(1)
        (WORK/'namespace-requests.json').write_text(json.dumps({'start':start,'requests':requests},indent=2)+'\n')
        if not any(x['success'] for x in requests):raise RuntimeError('No successful request through the application')
    expected={n['id'] for n in json.loads((ROOT/'public/animation/topology-data.json').read_text())['nodes'] if n['eligible']}
    for attempt in range(9):
        query=urllib.parse.urlencode({'q':'{ resource.service.name = "gateway" && name = "GET /checkout" }','limit':20,'start':start,'end':int(time.time())+1})
        result=get('http://127.0.0.1:13200/api/search?'+query)
        for candidate in result.get('traces',[]):
            if int(candidate.get('startTimeUnixNano','0'))<start*10**9:continue
            trace=get('http://127.0.0.1:13200/api/traces/'+candidate['traceID']);sdk,all_scopes=inspect(trace)
            print(candidate['traceID'],'SDK services',len(sdk),'missing',sorted(expected-set(sdk)),flush=True)
            if set(sdk)!=expected:continue
            for name,data in [('fleet-trace',trace),('fleet-selection',candidate),('fleet-instrumentation-scopes',sdk)]:
                (WORK/(name+'.json')).write_text(json.dumps(data,indent=2)+'\n')
            if args.update_dashboard:
                saved=json.loads((WORK/'trace-dashboard.json').read_text());dashboard=saved.get('dashboard',saved)
                for panel in dashboard['panels']:
                    if panel['id']==4:panel['targets'][0]['query']=candidate['traceID']
                body={'dashboard':dashboard,'overwrite':True}
                request=urllib.request.Request('http://127.0.0.1:13000/api/dashboards/db',json.dumps(body).encode(),{'Content-Type':'application/json'})
                with urllib.request.urlopen(request,timeout=30) as response:json.load(response)
                (WORK/'trace-dashboard.json').write_text(json.dumps(body,indent=2)+'\n')
            print('Selected complete namespace-enrolled request',candidate['traceID'],flush=True);return
        if attempt<8:time.sleep(10)
    raise RuntimeError('No complete 14-SDK request was observed in the fresh capture window')

if __name__=='__main__':main()
