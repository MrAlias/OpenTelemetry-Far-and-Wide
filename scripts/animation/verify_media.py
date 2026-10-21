"""Check the actual exported media, chapter boundaries, and silent clip reuse."""
from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'public/animation'
WORK = ROOT / '.artifacts/animation'
source = json.loads((ROOT / 'scripts/animation/talk.json').read_text())
timeline_text = (OUT / 'timeline.js').read_text()
timeline = json.loads(timeline_text.removeprefix('window.TALK = ').strip().removesuffix(';'))

def probe(path):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-show_chapters','-of','json',str(path)]))

def check(path, seconds, audio):
    data = probe(path)
    duration = float(data['format']['duration'])
    assert abs(duration-seconds) < .15, (path.name, duration, seconds)
    tracks = data['streams']
    video = [track for track in tracks if track['codec_type']=='video']
    sound = [track for track in tracks if track['codec_type']=='audio']
    assert len(video)==1 and video[0]['codec_name']=='h264', path.name
    assert (video[0]['width'],video[0]['height'])==(1280,720), path.name
    assert bool(sound)==audio, (path.name,'unexpected audio streams')
    return {'file': str(path.relative_to(ROOT)), 'seconds': duration, 'audio': bool(sound), 'size': int(data['format']['size'])}

results = []
full = OUT / timeline.get('videoFile','opentelemetry-far-and-wide-20min.mp4')
results.append(check(full,1200,True))
results.append(check(OUT/'opentelemetry-far-and-wide-20min-silent.mp4',1200,False))
metadata = probe(full)
canonical = OUT/'opentelemetry-far-and-wide-20min.mp4'
if full != canonical:
    assert hashlib.sha256(full.read_bytes()).digest()==hashlib.sha256(canonical.read_bytes()).digest(), 'Original video link still points to an older narration'
assert len(metadata['chapters'])==15
assert any(track['codec_type']=='subtitle' for track in metadata['streams'])
captions=(OUT/'captions.vtt').read_text()
assert 'Tyler: ' in captions and 'Nikola: ' in captions
for expected,actual in zip(timeline['chapters'],metadata['chapters']):
    assert abs(float(actual['start_time'])-expected['start'])<.1
    assert actual['tags']['title']==expected['title']
for authored,timed in zip(source['chapters'],timeline['chapters']):
    assert authored['turns']==timed['turns'], 'Exported dialogue is stale'
    assert {t['speaker'] for t in timed['turns']}=={'Tyler','Nikola'}
    assert [{'speaker':c['speaker'],'text':c['text']} for c in timed['cues']]==timed['turns']
    assert (OUT/timed['audio']).is_file(), timed['audio']
    results.append(check(OUT/'clips'/f'{timed["id"]}-silent.mp4',timed['duration'],False))
    if 'buildTime' in timed:
        results.append(check(OUT/'explainers'/f'{timed["id"]}-20s.mp4',20,False))
assert len(list((OUT/'explainers').glob('*.mp4')))==6
voices=json.loads((WORK/'voice-report.json').read_text())
assert set(voices)=={'Tyler','Nikola'}
assert len({v['sha256'] for v in voices.values()})==2
assert all(v['gender']=='male' and v['speakingSeconds']>300 for v in voices.values())
for speaker,voice in voices.items():
    assert voice['model']==source['speakers'][speaker]['model']
for name in ['layout-report.json','interaction-report.json']:
    data=json.loads((WORK/name).read_text())
    assert not data.get('errors',data.get('issues',[])), name
report={'duration':1200,'chapters':15,'short_silent_explainers':6,'speakers':voices,'files':results}
(WORK/'media-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'duration':1200,'chapters':15,'short_silent_explainers':6,'verified_video_files':len(results)}))
