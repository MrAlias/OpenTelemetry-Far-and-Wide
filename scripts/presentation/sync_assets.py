"""Curate captured evidence for the portable Slidev deck; never generate demo results."""
from pathlib import Path
import hashlib,json,shutil,subprocess
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'public/demo-capture';TARGET=ROOT/'public/presentation'
IMAGES=['java-timeout-proof','checkout-resource-proof','request-latency','connected-trace','namespace-rule','install-obi-edited-poster','install-java-agent-edited-poster','install-operator-edited-poster','instrument-namespace-edited-poster','fix-pricing-edited-poster','fixed-request-trace','fleet-mixed-detail']
CLIPS=['install-obi-edited','install-java-agent-edited','install-operator-edited','instrument-namespace-edited','fix-pricing-edited','fixed-request-detail','fleet-mixed-detail']

def assert_silent_video(path):
    probe=subprocess.run(['ffprobe','-v','error','-show_entries','stream=codec_type','-of','json',str(path)],capture_output=True,text=True,check=True)
    streams=json.loads(probe.stdout).get('streams',[])
    if any(stream.get('codec_type')=='audio' for stream in streams):
        raise ValueError(f'Audio is not allowed in versioned presentation clips: {path}')
    if not any(stream.get('codec_type')=='video' for stream in streams):
        raise ValueError(f'Presentation clip has no video stream: {path}')

def main():
    # Check every source before copying anything into the versioned asset folder.
    for name in CLIPS:
        assert_silent_video(SOURCE/(name+'.mp4'))
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
        assert_silent_video(target)
        manifest.append({'asset':str(target.relative_to(ROOT)),'source':str(source.relative_to(ROOT)),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'bytes':target.stat().st_size,'encoding':'VP9; native playback duration'})
    (TARGET/'manifest.json').write_text(json.dumps({'recorded':'2026-11-04','provenance':'Actual OBI v1.0.0, direct Java agent, same-image configuration fix, controller and namespace recordings from the isolated demo on November 4. Long readiness waits cut with explicit cards; commands and results remain at 1x. The post-fix waterfall is cropped from the native capture to enlarge Checkout and its price lookup. The separately measured Grafana metric panels retain their historical windows.','assets':manifest},indent=2)+'\n')
    shutil.copy2(SOURCE/'capture-summary.json',ROOT/'presentation/data/capture.json')
    print('Curated',len(manifest),'recorded assets for Slidev')

if __name__=='__main__':main()
