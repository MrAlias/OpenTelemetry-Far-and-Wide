"""Compare current authorized voice passages with local ASR; never changes speech pace."""
from pathlib import Path
import argparse,difflib,json,re,subprocess,time
import numpy as np
from faster_whisper import WhisperModel
ROOT=Path(__file__).resolve().parents[2];WORK=ROOT/'.artifacts/animation'
def normalized(text):
 text=text.lower()
 aliases=[('u r l','url'),('ree oh','rio'),('oh tell ex','otelx'),('otel x','otelx'),('oh tell x','otelx'),('open telemetry','opentelemetry'),('o bee','obi'),('oh bee','obi'),('o b i','obi'),('s d k','sdk'),('e b p f','ebpf'),('j d b c','jdbc'),('h t t p','http'),('dot net','dotnet'),('eighteen','18'),('fourteen','14'),('thirteen','13'),('one','1')]
 for a,b in aliases:text=text.replace(a,b)
 return re.findall('[a-z0-9]+',text)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--watch',action='store_true');a=parser.parse_args()
 talk=json.loads((ROOT/'scripts/animation/talk.json').read_text())
 model=WhisperModel('small.en',device='cpu',compute_type='int8',cpu_threads=1,download_root=str(WORK/'tyler-voice/cache/asr'),local_files_only=True)
 records=[]
 for speaker in talk['speakers']:
  base=WORK/(speaker.lower()+'-voice');expected=sum(t['speaker']==speaker for c in talk['chapters'] for t in c['turns']);announced=set()
  while True:
   jobs=json.loads((base/'jobs.json').read_text())
   if len(jobs)!=expected:
    if not a.watch:raise RuntimeError('Current speaker jobs are not ready')
    time.sleep(3);continue
   rows=[]
   for job in jobs:
    wav=Path(job['output']);meta=wav.with_suffix('.json')
    if not (wav.exists() and meta.exists()):continue
    cache=base/'evidence-asr'/(wav.stem+'.json');cache.parent.mkdir(exist_ok=True)
    candidates=[cache,base/'fleet-asr'/(wav.stem+'.json'),base/'asr'/(wav.stem+'.json')]
    saved=next((json.loads(p.read_text()) for p in candidates if p.exists() and json.loads(p.read_text()).get('expected')==job['text']),None)
    if saved:heard=saved['recognized']
    else:
     audio=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(wav),'-ar','16000','-ac','1','-f','f32le','-']),dtype=np.float32)
     segments,_=model.transcribe(audio,language='en',beam_size=5,condition_on_previous_text=False,initial_prompt='OpenTelemetry, OBI, eBPF, SDK, Injector, Kubernetes Operator, Checkout, PricingEngine.calculate, Hibernate, JDBC, Nikola Grcevski, Tyler Yahn.')
     heard=' '.join(s.text.strip() for s in segments)
    x,y=normalized(job['text']),normalized(heard);matcher=difflib.SequenceMatcher(None,x,y)
    diffs=[{'expected':' '.join(x[i:j]),'recognized':' '.join(y[k:l])} for op,i,j,k,l in matcher.get_opcodes() if op!='equal']
    row={'speaker':speaker,'chapter':job['chapter'],'turn':job['turn'],'expected':job['text'],'recognized':heard,'agreement':round(matcher.ratio(),4),'differences':diffs,'audio':str(wav.relative_to(ROOT))};rows.append(row)
    cache.write_text(json.dumps(row,indent=2)+'\n')
    if str(wav) not in announced:print(json.dumps({k:row[k] for k in ['speaker','chapter','turn','agreement','differences']}),flush=True);announced.add(str(wav))
   (WORK/(speaker.lower()+'-evidence-asr-report.json')).write_text(json.dumps(rows,indent=2)+'\n')
   if len(rows)==expected or not a.watch:records.extend(rows);break
   time.sleep(3)
 (WORK/'evidence-asr-report.json').write_text(json.dumps({'storyRevision':talk['storyRevision'],'turns':records},indent=2)+'\n');print('Checked',len(records),'current passages',flush=True)
if __name__=='__main__':main()
