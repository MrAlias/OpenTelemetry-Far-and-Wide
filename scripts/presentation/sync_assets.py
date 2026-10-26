"""Curate captured evidence for the portable Slidev deck; never generate demo results."""
from pathlib import Path
import hashlib,json,shutil,subprocess
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'public/demo-capture';TARGET=ROOT/'public/presentation'
IMAGES=['request-latency','connected-trace','java-detail-poster','fleet-catalog','namespace-rule','install-obi-edited-poster','install-java-agent-edited-poster','install-operator-edited-poster','instrument-namespace-edited-poster']
CLIPS=['install-obi-edited','install-java-agent-edited','install-operator-edited','instrument-namespace-edited','java-detail','fleet-detail']

def main():
    manifest=[]
    for folder,names,suffix in [('images',IMAGES,'.png'),('clips',CLIPS,'.mp4')]:
        (TARGET/folder).mkdir(parents=True,exist_ok=True)
        for name in names:
            source=SOURCE/(name+suffix);target=TARGET/folder/source.name
            shutil.copy2(source,target)
            manifest.append({'asset':str(target.relative_to(ROOT)),'source':str(source.relative_to(ROOT)),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size})
    for name in CLIPS:
        source=TARGET/'clips'/(name+'.mp4');target=source.with_suffix('.webm')
        if not target.exists() or target.stat().st_mtime<source.stat().st_mtime:
            subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-an','-c:v','libvpx-vp9','-crf','32','-b:v','0','-deadline','good','-cpu-used','4','-row-mt','1','-threads','2',str(target)],check=True)
        manifest.append({'asset':str(target.relative_to(ROOT)),'source':str(source.relative_to(ROOT)),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size,'encoding':'VP9; native playback duration'})
    (TARGET/'manifest.json').write_text(json.dumps({'recorded':'2026-10-23','provenance':'Actual isolated demo; long readiness waits cut with visible cards, playback stays at 1x','assets':manifest},indent=2)+'\n')
    shutil.copy2(SOURCE/'capture-summary.json',ROOT/'presentation/data/capture.json')
    print('Curated',len(manifest),'recorded assets for Slidev')

if __name__=='__main__':main()
