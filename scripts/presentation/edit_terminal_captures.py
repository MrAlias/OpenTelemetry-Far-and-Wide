"""Cut idle rollout waits, preserving real commands/output and an explicit transition."""
from pathlib import Path
import json,subprocess
ROOT=Path(__file__).resolve().parents[2]
WORK=ROOT/'.artifacts/demo-capture'
OUT=ROOT/'public/demo-capture'
def run(args):
 subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def duration(path):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)]))
def assemble(name,takes):
 work=WORK/'edits'/name;work.mkdir(parents=True,exist_ok=True);segments=[];ledger=[]
 def segment(src,start,end,label):
  target=work/f'{len(segments):03}.mp4';run(['ffmpeg','-y','-ss',f'{start:.4f}','-i',str(src),'-t',f'{end-start:.4f}','-an','-vf','fps=25','-c:v','libx264','-preset','veryfast','-crf','18','-threads','2','-pix_fmt','yuv420p',str(target)]);segments.append(target);ledger.append({'source':str(src.relative_to(ROOT)),'start':start,'end':end,'purpose':label})
 def transition():
  target=work/f'{len(segments):03}.mp4';text=work/'transition.txt';text.write_text('After waiting for readiness')
  font=subprocess.check_output(['fc-match','-f','%{file}','DejaVu Sans Mono'],text=True)
  vf=f"drawtext=fontfile='{font}':textfile='{text}':fontcolor=white:fontsize=34:x=(w-tw)/2:y=(h-th)/2"
  run(['ffmpeg','-y','-f','lavfi','-i','color=c=0x081725:s=1280x720:r=25','-t','1.4','-vf',vf,'-an','-c:v','libx264','-preset','veryfast','-crf','18','-threads','2','-pix_fmt','yuv420p',str(target)]);segments.append(target);ledger.append({'transition':'After waiting for readiness','duration':1.4})
 for take,limit in takes:
  meta=json.loads((WORK/'terminal'/take/'recording.json').read_text());raw=ROOT/meta['video'];job=json.loads((WORK/'terminal'/take/'job.json').read_text());length=duration(raw);base=meta.get('captureStartedAt',meta['capturedAt']-length)
  for i,event in enumerate(meta['commands'][:limit]):
   if event['exitCode']:raise RuntimeError('A failed command cannot be presented as a successful installation')
   before=job['commands'][i].get('readBeforeSeconds',2);after=job['commands'][i].get('holdAfterSeconds',3)
   start=max(0,event.get('displayed',event['started']-before)-base-.15);finish=min(length,event['finished']-base+after)
   execute=event['started']-base;done=event['finished']-base
   if done-execute>10:
    segment(raw,start,min(execute+3,finish),'actual command and beginning of wait');transition();segment(raw,max(start,done-3),finish,'actual completed result')
   else:segment(raw,start,finish,'actual command and output')
 concat=work/'concat.txt';concat.write_text('\n'.join("file '"+str(p)+"'" for p in segments)+'\n');target=OUT/(name+'-edited.mp4')
 run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(concat),'-c:v','copy','-an','-movflags','+faststart',str(target)])
 run(['ffmpeg','-y','-sseof','-1','-i',str(target),'-frames:v','1',str(OUT/(name+'-edited-poster.png'))])
 (work/'edit.json').write_text(json.dumps({'output':str(target.relative_to(ROOT)),'seconds':duration(target),'segments':ledger,'playbackRate':1.0},indent=2)+'\n');print(name,round(duration(target),2),'seconds',flush=True)
if __name__=='__main__':
 import sys
 targets={'fix-pricing':[('fix-pricing',1)],'instrument-namespace':[('instrument-namespace',1)],'install-obi':[('install-obi',1)],'inspect-java-setup':[('inspect-java-setup',2)],'install-java-agent':[('install-java-agent',1)],'install-operator':[('install-operator',2)],'enroll-fleet':[('enroll-fleet',4)]}
 for name in sys.argv[1:] or targets:assemble(name,targets[name])
