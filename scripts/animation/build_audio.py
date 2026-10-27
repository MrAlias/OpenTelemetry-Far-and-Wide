"""Synthesize a two-presenter conversation and its shared visual timing cues."""
from pathlib import Path
import hashlib
import json
import math
import os
import re
import subprocess
import wave

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.artifacts/animation'
OUT = ROOT / 'public/animation'
RAW = WORK / 'speech'
RAW.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
talk = json.loads((ROOT / 'scripts/animation/talk.json').read_text())
assert talk['timing'] == 'natural'
voice_provenance = {}
skill_casts = {}
skill_paths = {}
for speaker, cast in talk['speakers'].items():
    expected_engine = {'Tyler':'tyler-demo-voice', 'Nikola':'nikola-demo-voice'}.get(speaker)
    if cast.get('engine') == expected_engine:
        env_prefix = speaker.upper()+'_VOICE'
        skill_dir = Path(os.environ.get(env_prefix+'_SKILL', Path.home()/'.codex/skills'/cast['engine']))
        profile_path = skill_dir/'profile.json'
        profile = json.loads(profile_path.read_text())
        reference = profile['references'][cast['reference']]
        assert profile['model'] == cast['model'] and profile['model_revision'] == cast['revision']
        assert reference['sha256'] == cast['referenceSha256']
        assert profile['speaker'] == {'Tyler':'Tyler Yahn','Nikola':'Nikola Grcevski'}[speaker]
        identity = hashlib.sha256(profile_path.read_bytes()).hexdigest()
        skill_casts[speaker] = {'skill':skill_dir, 'work':WORK/(speaker.lower()+'-voice'),
                               'env':env_prefix, 'profile':profile}
        voice_provenance[speaker] = {
            'engine':cast['engine'], 'model':cast['model'], 'revision':cast['revision'],
            'voiceName':cast['voiceName'], 'gender':cast['gender'], 'sha256':identity,
            'referenceSha256':reference['sha256'], 'watermark':'native PerTh',
            'speakingSeconds':0, 'words':0, 'turns':0,
        }
        continue
    raise ValueError(f"Use the authorized voice skill for {speaker}; no stock fallback")
# Both installed skills produce native 24 kHz audio.
sample_rate = 24000
assert len({p['sha256'] for p in voice_provenance.values()}) == 2
report = []
captions = []
cursor = 0

def spoken(text):
    # Preserve visual spelling while making technical acronyms intelligible.
    for pattern, replacement in [
        (r'PricingEngine\.calculate', 'Pricing Engine calculate'),
        (r'\bNode\.js\b', 'Node J S'), (r'\bJVM\b', 'J V M'),
        (r'OpenTelemetry', 'Open Telemetry'), (r'\beBPF\b', 'E B P F'),
        (r'\bOBI\b', 'O bee'), (r'\bSDK\b', 'S D K'),
        (r'\bOTLP\b', 'O T L P'), (r'\bCPU\b', 'C P U'),
        (r'\bHTTP\b', 'H T T P'), (r'\bAPI\b', 'A P I'),
        (r'\bAPIs\b', 'A P I s'), (r'\bv2alpha1\b', 'version two alpha one'),
        (r'\bNode\b', 'Node'),
    ]:
        text = re.sub(pattern, replacement, text)
    return text

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def wav_duration(path):
    with wave.open(str(path)) as f:
        return f.getnframes() / f.getframerate()

for speaker, setup in skill_casts.items():
    cast = talk['speakers'][speaker]
    jobs = []
    for chapter in talk['chapters']:
        for index, turn in enumerate(chapter['turns']):
            if turn['speaker'] != speaker:
                continue
            text = spoken(turn['text'])
            identity = voice_provenance[speaker]['sha256']
            digest = hashlib.sha256((identity+'\n'+text).encode()).hexdigest()[:16]
            name = f'{chapter["id"]}-{index}-{digest}'
            text_file = setup['work']/'text'/(name+'.txt')
            output = setup['work']/'audio'/(name+'.wav')
            # Reuse the same authorized performance when scenes are rearranged.
            if not output.exists():
                for cached in sorted((setup['work']/'audio').glob('*-'+digest+'.wav')):
                    provenance=cached.with_suffix('.json')
                    if not provenance.is_file():
                        continue
                    saved=json.loads(provenance.read_text())
                    if (saved.get('text')==text and saved.get('reference_sha256')==cast['referenceSha256']
                            and saved.get('model_revision')==cast['revision']
                            and saved.get('speaker')==setup['profile']['speaker']):
                        output=cached
                        break
            text_file.parent.mkdir(parents=True,exist_ok=True)
            output.parent.mkdir(parents=True,exist_ok=True)
            text_file.write_text(text+'\n')
            jobs.append({'chapter':chapter['id'],'turn':index,'text':text,
                         'text_file':str(text_file),'output':str(output)})
    jobs_file = setup['work']/'jobs.json'
    jobs_file.write_text(json.dumps(jobs,indent=2)+'\n')
    if any(not Path(j['output']).is_file() or not Path(j['output']).with_suffix('.json').is_file() for j in jobs):
        runtime = Path(os.environ.get(setup['env']+'_PYTHON', Path.home()/'.local/share'/cast['engine']/'venv/bin/python'))
        cached_hf = Path(os.environ.get('HF_HOME',Path.home()/'.cache/huggingface'))
        pinned = cached_hf/'hub/models--ResembleAI--chatterbox-turbo/snapshots'/cast['revision']
        generator_env = {**os.environ,'TMPDIR':str(WORK/'runtime/tmp'),
                         'XDG_CACHE_HOME':str(setup['work']/'cache'),
                         'XDG_DATA_HOME':str(setup['work']/'data'),
                         'PYTHONDONTWRITEBYTECODE':'1'}
        generator_env['HF_HOME'] = str(cached_hf if pinned.is_dir() else setup['work']/'cache/huggingface')
        if pinned.is_dir(): generator_env['HF_HUB_OFFLINE']='1'
        subprocess.run([str(runtime),str(ROOT/'scripts/animation/generate_demo_voice.py'),
                        '--jobs',str(jobs_file),'--skill',str(setup['skill']),
                        '--reference',cast['reference']],env=generator_env,check=True)
    for j in jobs: skill_paths[(speaker,j['chapter'],j['turn'])] = Path(j['output'])

for chapter in talk['chapters']:
    raw_paths = []
    native = []
    turns = chapter['turns']
    assert {turn['speaker'] for turn in turns} == set(talk['speakers']), chapter['id']
    for i, turn in enumerate(turns):
        speaker, text = turn['speaker'], turn['text']
        path = skill_paths[(speaker,chapter['id'],i)]
        meta = json.loads(path.with_suffix('.json').read_text())
        cast = talk['speakers'][speaker]
        assert meta['model_revision'] == cast['revision']
        assert meta['reference_sha256'] == cast['referenceSha256']
        assert meta['speaker'] == skill_casts[speaker]['profile']['speaker']
        assert meta['synthetic'] and meta['text'] == spoken(text)
        with wave.open(str(path)) as source:
            assert source.getframerate() == sample_rate and source.getsampwidth() == 2
        raw_paths.append(path)
        native.append(wav_duration(path))
    pauses = {int(k): float(v) for k,v in chapter.get('pauseAfter', {}).items()}
    # Allow a natural handoff as well as authored inspection/prediction pauses.
    gaps = [.32 if turns[i]['speaker']!=turns[i+1]['speaker'] else .22 for i in range(len(turns)-1)]
    edge = .65
    lead_in = float(chapter.get('leadInSeconds', edge))
    assert lead_in >= 0
    pieces = [np.zeros(round(lead_in * sample_rate), dtype=np.int16)]
    local = lead_in
    chapter['cues'] = []
    chapter_speakers = {speaker: 0 for speaker in talk['speakers']}
    media_hold = 0
    for i, (path, turn) in enumerate(zip(raw_paths, turns)):
        aligned = chapter.get('alignTurnAfterVisual', {}).get(str(i))
        if aligned is not None:
            visual = chapter['visuals'][aligned]
            assert visual['type'] == 'video'
            if 'atCue' in visual:
                assert 0 <= visual['atCue'] < i
                visual_start = chapter['cues'][visual['atCue']]['start']
            else:
                visual_start = float(visual.get('at', 0))
            duration = float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(ROOT/'public'/visual['src'])]))
            earliest = visual_start + duration + 1
            if local < earliest:
                hold = earliest-local
                pieces.append(np.zeros(round(hold*sample_rate),dtype=np.int16))
                local = earliest
                media_hold += hold
        speaker, text = turn['speaker'], turn['text']
        # Balance the two speakers without changing pace or removing watermarks.
        # Each skill's original WAV remains unmodified in its own audio directory.
        adjusted = RAW / f'{chapter["id"]}-{i}-natural.wav'
        run(['ffmpeg', '-y', '-i', str(path), '-af', 'loudnorm=I=-18:TP=-2:LRA=7', '-ar', str(sample_rate), '-ac', '1', str(adjusted)])
        with wave.open(str(adjusted)) as f:
            data = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16)
        duration = len(data) / sample_rate
        assert abs(duration-native[i]) < .005, (chapter['id'],i,'Speech duration changed')
        chapter['cues'].append({'start': round(local, 4), 'end': round(local + duration, 4),
                               'sampleStart': round(local*sample_rate), 'sampleEnd': round(local*sample_rate)+len(data),
                               'speaker': speaker, 'text': text})
        chapter_speakers[speaker] += duration
        voice_provenance[speaker]['speakingSeconds'] += duration
        voice_provenance[speaker]['words'] += len(text.split())
        voice_provenance[speaker]['turns'] += 1
        # Sentence-level optional captions identify the speaker without affecting silent visuals.
        sentences = []
        for sentence in re.split(r'(?<=[.!?])\s+', text):
            # Short caption lines remain readable in the video and on a phone.
            words = sentence.split()
            chunk = []
            for word in words:
                if chunk and len(' '.join(chunk + [word])) > 80:
                    sentences.append(' '.join(chunk))
                    chunk = []
                chunk.append(word)
            if chunk:
                sentences.append(' '.join(chunk))
        weights = [len(s.split()) for s in sentences]
        offset = local
        for sentence, weight in zip(sentences, weights):
            end = offset + duration * weight / sum(weights)
            captions.append((cursor + offset, cursor + end, f'{speaker}: {sentence}'))
            offset = end
        pieces.append(data)
        local += duration
        if i < len(native)-1:
            pause = gaps[i] + pauses.get(i, 0)
            pieces.append(np.zeros(round(pause * sample_rate), dtype=np.int16))
            local += pause
        if chapter.get('buildAfter') == i:
            chapter['buildTime'] = round(local, 4)
    if 'buildAtCue' in chapter:
        chapter['buildTime']=round(chapter['cues'][chapter['buildAtCue']]['start']+chapter.get('buildDelay',0),4)
    chapter['visualCues']=[]
    media_end=0
    for visual in chapter.get('visuals',[]):
        start=chapter['cues'][visual['atCue']]['start'] if 'atCue' in visual else visual.get('at',0)
        scheduled={**visual,'start':round(start,4)}
        if visual['type']=='video':
            path=ROOT/'public'/visual['src']
            seconds=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)]))
            scheduled['mediaDuration']=seconds
            media_end=max(media_end,start+seconds+2)
        chapter['visualCues'].append(scheduled)
    data = np.concatenate(pieces)
    # Only the silent end hold is rounded to a video frame. Speech stays native.
    chapter['duration'] = math.ceil(max(len(data)/sample_rate + edge,media_end) * 25) / 25
    length = round(chapter['duration'] * sample_rate)
    data = np.pad(data, (0, length-len(data)))
    wav = RAW / f'{chapter["id"]}.wav'
    with wave.open(str(wav), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        f.writeframes(data.tobytes())
    chapter['start'] = cursor
    cursor = round(cursor + chapter['duration'], 4)
    chapter['end'] = cursor
    chapter['audio'] = f'narration/{chapter["id"]}.mp3'
    audio = OUT / chapter['audio']
    audio.parent.mkdir(exist_ok=True)
    run(['ffmpeg', '-y', '-i', str(wav), '-c:a', 'libmp3lame', '-q:a', '3', str(audio)])
    report.append({'id': chapter['id'], 'seconds': chapter['duration'], 'words': sum(len(t['text'].split()) for t in turns), 'turns': len(turns), 'speakers': {s:round(d,2) for s,d in chapter_speakers.items()}, 'native_speech_seconds': round(sum(native),2), 'tempo': 1.0, 'inspection_pause_seconds': sum(pauses.values()), 'media_hold_seconds':round(media_hold,4), 'buildTime': chapter.get('buildTime')})
    print(json.dumps(report[-1]), flush=True)

def vtt_time(seconds):
    milliseconds = round(seconds*1000)
    h, remainder = divmod(milliseconds, 3600000)
    m, remainder = divmod(remainder, 60000)
    s, ms = divmod(remainder, 1000)
    return f'{h:02}:{m:02}:{s:02}.{ms:03}'

talk['duration'] = cursor
if cursor > talk['maxContentSeconds']:
    raise ValueError(f'{cursor}s exceeds the content budget; edit the script, never the speech speed')
vtt = ['WEBVTT', '']
for i, (start,end,text) in enumerate(captions,1):
    vtt += [str(i), f'{vtt_time(start)} --> {vtt_time(end)}', text, '']
(OUT / 'captions.vtt').write_text('\n'.join(vtt))
(OUT / 'timeline.js').write_text('window.TALK = '+json.dumps(talk, ensure_ascii=False, indent=2)+';\n')
(WORK / 'audio-report.json').write_text(json.dumps(report, indent=2)+'\n')
(WORK / 'voice-report.json').write_text(json.dumps(voice_provenance,indent=2)+'\n')
(OUT / 'transcript.txt').write_text(talk['status']+"\n\nTyler and Nikola use their separate authorized synthetic voice profiles.\n\n"+'\n\n'.join(f'{c["title"]}\n'+ '\n\n'.join(f'{t["speaker"]}: {t["text"]}' for t in c['turns']) for c in talk['chapters'])+'\n')
print(f'Audio complete: {cursor} seconds, {sum(r["words"] for r in report)} words.', flush=True)
