"""Check both authorized speakers' native PerTh marks before and after encoding."""
from pathlib import Path
import hashlib,json,subprocess
import numpy as np
import perth
import torch
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.artifacts/animation'
talk=json.loads((ROOT/'public/animation/timeline.js').read_text().removeprefix('window.TALK = ').strip().removesuffix(';'))
movie=ROOT/'public/animation'/talk['videoFile']
torch.set_num_threads(1)
detector=perth.PerthImplicitWatermarker()
def audio(path,start=None,duration=None):
 command=['ffmpeg','-v','error']
 if start is not None:command+=['-ss',str(start)]
 command+=['-i',str(path)]
 if duration is not None:command+=['-t',str(duration)]
 command+=['-ar','24000','-ac','1','-f','f32le','-']
 return np.frombuffer(subprocess.check_output(command),dtype=np.float32)
report={'video_sha256':hashlib.sha256(movie.read_bytes()).hexdigest(),'speakers':{}}
for speaker,cast in talk['speakers'].items():
 assert cast['engine']==speaker.lower()+'-demo-voice'
 jobs=json.loads((WORK/(speaker.lower()+'-voice')/'jobs.json').read_text())
 paths={(j['chapter'],j['turn']):j['output'] for j in jobs}
 rows=[]
 for chapter in talk['chapters']:
  candidates=[(i,c) for i,c in enumerate(chapter['cues']) if c['speaker']==speaker]
  if not candidates:continue
  index,cue=max(candidates,key=lambda pair:pair[1]['end']-pair[1]['start'])
  row={'chapter':chapter['id'],'turn':index,'source':float(detector.get_watermark(audio(paths[(chapter['id'],index)]),24000,round=False)),'encoded':float(detector.get_watermark(audio(movie,chapter['start']+cue['start'],cue['end']-cue['start']),24000,round=False))}
  rows.append(row);print(json.dumps({'speaker':speaker,**row}),flush=True)
 report['speakers'][speaker]={'reference_sha256':cast['referenceSha256'],'chapters':rows}
(WORK/'voice-watermark-report.json').write_text(json.dumps(report,indent=2)+'\n')
assert all(r['source']>.9 and r['encoded']>.9 for v in report['speakers'].values() for r in v['chapters']), 'Native watermark verification failed'
