"""Check the actual exported media, chapter boundaries, and silent clip reuse."""
from pathlib import Path
import hashlib
import json
import subprocess
import wave

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
full = OUT / timeline['videoFile']
results.append(check(full,timeline['duration'],True))
results.append(check(OUT/'opentelemetry-far-and-wide-silent.mp4',timeline['duration'],False))
metadata = probe(full)
assert len(metadata['chapters'])==len(source['chapters'])
assert any(track['codec_type']=='subtitle' for track in metadata['streams'])
captions=(OUT/'captions.vtt').read_text()
assert 'Tyler: ' in captions and 'Nikola: ' in captions
for expected,actual in zip(timeline['chapters'],metadata['chapters']):
    assert abs(float(actual['start_time'])-expected['start'])<.1
    assert abs(float(actual['end_time'])-expected['end'])<.1
    assert actual['tags']['title']==expected['title']
for companion in [OUT/'opentelemetry-far-and-wide-silent.mp4',OUT/'draft-narration.m4a']:
    sidecar=probe(companion)
    assert len(sidecar['chapters'])==len(timeline['chapters'])
    for expected,actual in zip(timeline['chapters'],sidecar['chapters']):
        assert abs(float(actual['start_time'])-expected['start'])<.1, companion.name
        assert abs(float(actual['end_time'])-expected['end'])<.1, companion.name
        assert actual['tags']['title']==expected['title'], companion.name
assert timeline['storyRevision']==source['storyRevision']
resolution=json.loads((ROOT/'presentation/data/resolution.json').read_text())
assert resolution['version']==source['storyRevision']
assert json.loads((ROOT/'public/presentation/resolution.json').read_text())==resolution
scene_by_id={c['id']:c for c in timeline['chapters']}
assert scene_by_id['08-customer-result']['kind']=='screen'
assert scene_by_id['08-customer-result']['visualCues'][0]['src']=='demo-capture/fixed-request-trace.png'
assert scene_by_id['08-result-summary']['kind']=='latency-result'
assert scene_by_id['12-wider-result']['visualCues'][0]['src']=='demo-capture/fixed-fleet-overview.png', 'Fleet scene returns to the pre-fix application'
assert any(v['src']=='demo-capture/fixed-fleet-detail.mp4' for v in scene_by_id['12-wider-result']['visualCues']), 'Fixed fleet recording missing'
assert resolution['fleetAfterFix']['pricingMs']<30

topology=json.loads((OUT/'topology-data.json').read_text())
assert topology['manifestSha256']==hashlib.sha256((ROOT/topology['source']).read_bytes()).hexdigest(), 'Topology is stale'
assert len(topology['nodes'])==topology['applications']==18
assert len(topology['edges'])==17
assert sum(n['eligible'] for n in topology['nodes'])==topology['eligible']==14
assert {n['id'] for n in topology['nodes'] if not n['eligible']}=={'gateway','shipping','warehouse','currency'}
opening=timeline['chapters'][0]
assert opening['cues'][0]['start']==source['chapters'][0]['leadInSeconds']==.6
assert opening['cues'][1]['start']-opening['cues'][0]['end']<1.2
assert opening['turns'][0]['text'].startswith('Welcome everyone.')
assert 'Tyler Yahn' in opening['turns'][0]['text']
assert 'Nikola Grcevski' in opening['turns'][1]['text']
with wave.open(str(WORK/'speech'/f'{opening["id"]}.wav')) as f:
    assert not any(f.readframes(round(.6*f.getframerate()))), 'Opening title hold is not silent'
assert len(source['chapters'])==len(timeline['chapters'])
for authored,timed in zip(source['chapters'],timeline['chapters']):
    assert authored['turns']==timed['turns'], 'Exported dialogue is stale'
    assert timed['duration']>0 and timed['plannedDuration']==authored['plannedDuration']
    assert {t['speaker'] for t in timed['turns']}=={'Tyler','Nikola'}
    # Performance directions stay in the script, outside the spoken audio cues.
    spoken=lambda rows: [{'speaker':row['speaker'],'text':row['text']} for row in rows]
    assert spoken(timed['cues'])==spoken(timed['turns'])
    for index,cue in enumerate(timed['cues']):
        assert 0 <= cue['start'] < cue['end'] <= timed['duration'], (timed['id'],index)
        if index < len(timed['cues'])-1:
            gap=timed['cues'][index+1]['start']-cue['end']
            expected_pause=authored.get('pauseAfter',{}).get(str(index),0)
            assert gap >= expected_pause+.2, (timed['id'],index,'inspection pause lost')
    for turn,visual_index in authored.get('alignTurnAfterVisual',{}).items():
        visual=timed['visualCues'][visual_index]
        assert timed['cues'][int(turn)]['start']>=visual['start']+visual['mediaDuration']+.95, (timed['id'],'result spoken before recorded rollout finished')
    if 'buildAfter' in authored:
        result=timed['cues'][authored['buildAfter']+1]
        assert abs(timed['buildTime']-result['start'])<.02, (timed['id'],'result narration not aligned to build')
    assert (OUT/timed['audio']).is_file(), timed['audio']
    results.append(check(OUT/'clips'/f'{timed["id"]}-silent.mp4',timed['duration'],False))
    if 'buildTime' in timed:
        results.append(check(OUT/'explainers'/f'{timed["id"]}-20s.mp4',20,False))
explainer_count=sum('buildAfter' in c or 'buildAtCue' in c for c in source['chapters'])
assert len(list((OUT/'explainers').glob('*.mp4')))==explainer_count
summary=json.loads((ROOT/'public/demo-capture/capture-summary.json').read_text())
namespace=summary.get('namespaceSelection')
if namespace:
    check_namespace=namespace['verification']
    assert check_namespace['positiveWorkloadNames']==0
    assert check_namespace['applicationOptInAnnotations']==[]
    assert check_namespace['readyOperatorWorkloads']==13
    assert len(check_namespace['sdkServices'])==14
    assert set(check_namespace['obiServices'])=={'gateway','shipping','warehouse','currency'}
    assert check_namespace['namespaceRule']['selector']=={'namespaces':['demo-apps']}
    assert summary['fleetTrace']['traceID'] in (ROOT/'public/demo-capture/fixed-fleet-detail.png.json').read_text(), 'Fleet capture is stale'
voices=json.loads((WORK/'voice-report.json').read_text())
assert set(voices)=={'Tyler','Nikola'}
assert len({v['sha256'] for v in voices.values()})==2
assert all(v['gender']=='male' and v['speakingSeconds']>0 for v in voices.values())
for speaker,voice in voices.items():
    assert voice['model']==source['speakers'][speaker]['model']
    expected=[t for c in source['chapters'] for t in c['turns'] if t['speaker']==speaker]
    assert voice['turns']==len(expected)
    assert voice['words']==sum(len(turn['text'].split()) for turn in expected)
raw = {}
for speaker,cast in source['speakers'].items():
    assert voices[speaker]['engine']==cast['engine']==speaker.lower()+'-demo-voice'
    assert voices[speaker]['referenceSha256']==cast['referenceSha256']
    assert voices[speaker]['revision']==cast['revision']
    jobs=json.loads((WORK/(speaker.lower()+'-voice')/'jobs.json').read_text())
    for j in jobs: raw[(speaker,j['chapter'],j['turn'])]=j
for chapter in timeline['chapters']:
    with wave.open(str(WORK/'speech'/f'{chapter["id"]}.wav')) as f:
        assert f.getframerate()==24000
    for index,cue in enumerate(chapter['cues']):
        speaker=cue['speaker'];job=raw[(speaker,chapter['id'],index)]
        meta=json.loads(Path(job['output']).with_suffix('.json').read_text())
        assert meta['synthetic'] and meta['reference_sha256']==source['speakers'][speaker]['referenceSha256']
        assert meta['text']==job['text']
        assert abs(cue['end']-cue['start']-meta['duration_seconds'])<.005, f'{speaker} speech speed changed'
watermarks=json.loads((WORK/'voice-watermark-report.json').read_text())
assert watermarks['video_sha256']==hashlib.sha256(full.read_bytes()).hexdigest(), 'Watermark check is stale'
assert set(watermarks['speakers'])==set(source['speakers'])
for speaker,marks in watermarks['speakers'].items():
    assert marks['reference_sha256']==source['speakers'][speaker]['referenceSha256']
    assert len(marks['chapters'])==len(timeline['chapters'])
    assert all(r['source']>.9 and r['encoded']>.9 for r in marks['chapters']), 'Native watermark did not survive export'
for name in ['layout-report.json','interaction-report.json']:
    data=json.loads((WORK/name).read_text())
    assert not data.get('errors',data.get('issues',[])), name
audio=json.loads((WORK/'audio-report.json').read_text())
assert all(chapter['tempo']==1.0 for chapter in audio), 'Speech must stay at native speed'
assert timeline['timing']=='natural'
for measured,chapter in zip(audio,timeline['chapters']):
    spoken_seconds=sum(cue['end']-cue['start'] for cue in chapter['cues'])
    assert abs(spoken_seconds-measured['native_speech_seconds'])<.05, 'Speech duration differs from native read'
assert abs(sum(c['seconds'] for c in audio)-timeline['duration'])<.01
assert timeline['duration'] <= source['maxContentSeconds'], 'Edit the script to fit the slot'
assert sum(c.get('inspection_pause_seconds',0) for c in audio)==sum(sum(c.get('pauseAfter',{}).values()) for c in source['chapters'])
report={'duration':timeline['duration'],'chapters':len(source['chapters']),'short_silent_explainers':explainer_count,'speakers':voices,'files':results}
(WORK/'media-report.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'duration':timeline['duration'],'chapters':len(source['chapters']),'short_silent_explainers':explainer_count,'verified_video_files':len(results)}))
