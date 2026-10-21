"""Synthesize a two-presenter conversation and its shared visual timing cues."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import wave

import numpy as np
import onnxruntime as ort
from piper import PiperVoice, SynthesisConfig
from piper.config import PiperConfig
from piper.phonemize_espeak import ESPEAK_DATA_DIR

ROOT = Path(__file__).resolve().parents[2]
WORK = ROOT / '.artifacts/animation'
OUT = ROOT / 'public/animation'
RAW = WORK / 'speech'
RAW.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)
talk = json.loads((ROOT / 'scripts/animation/talk.json').read_text())
assert sum(c['duration'] for c in talk['chapters']) == talk['duration'] == 1200
ort.disable_telemetry_events()
voices = {}
voice_provenance = {}
for speaker, cast in talk['speakers'].items():
    model = WORK / 'voice' / cast['model']
    options = ort.SessionOptions()
    options.intra_op_num_threads = 4
    options.inter_op_num_threads = 1
    voices[speaker] = PiperVoice(
        config=PiperConfig.from_dict(json.loads(Path(str(model)+'.json').read_text())),
        session=ort.InferenceSession(str(model), sess_options=options, providers=['CPUExecutionProvider']),
        espeak_data_dir=Path(ESPEAK_DATA_DIR),
        download_dir=WORK / 'voice',
    )
    voice_provenance[speaker] = {
        'model': cast['model'], 'voiceName': cast['voiceName'], 'gender': cast['gender'],
        'sha256': hashlib.sha256(model.read_bytes()).hexdigest(),
        'speakingSeconds': 0, 'words': 0, 'turns': 0,
    }
sample_rate = next(iter(voices.values())).config.sample_rate
assert all(v.config.sample_rate == sample_rate for v in voices.values())
assert len({p['sha256'] for p in voice_provenance.values()}) == 2
report = []
captions = []
cursor = 0

def spoken(text):
    # Preserve visual spelling while making technical acronyms intelligible.
    for pattern, replacement in [
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

def trim_edges(path):
    """Keep natural sentence pauses; shorten only the silence around a turn."""
    with wave.open(str(path)) as f:
        assert f.getframerate() == sample_rate and f.getsampwidth() == 2
        data = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16)
    active = np.flatnonzero(np.abs(data.astype(np.int32)) > 130)
    if not len(active):
        raise ValueError(f'No speech in {path}')
    return data[max(0,active[0]-round(.045*sample_rate)):min(len(data),active[-1]+round(.13*sample_rate))]

for chapter in talk['chapters']:
    raw_paths = []
    native = []
    turns = chapter['turns']
    assert {turn['speaker'] for turn in turns} == set(voices), chapter['id']
    for i, turn in enumerate(turns):
        speaker, text = turn['speaker'], turn['text']
        identity = voice_provenance[speaker]['sha256']
        digest = hashlib.sha256((identity + '\n' + spoken(text)).encode()).hexdigest()[:12]
        path = RAW / f'{chapter["id"]}-{i}-{speaker.lower()}-{digest}.wav'
        if not path.exists():
            with wave.open(str(path), 'wb') as f:
                voices[speaker].synthesize_wav(spoken(text), f, syn_config=SynthesisConfig(length_scale=1.0))
        trimmed = trim_edges(path)
        trimmed_path = RAW / (path.stem+'-trimmed.wav')
        with wave.open(str(trimmed_path), 'wb') as f:
            f.setnchannels(1); f.setsampwidth(2); f.setframerate(sample_rate)
            f.writeframes(trimmed.tobytes())
        raw_paths.append(trimmed_path)
        native.append(len(trimmed)/sample_rate)
    pauses = {int(k): float(v) for k,v in chapter.get('pauseAfter', {}).items()}
    # Quick conversational handoffs; preserve the two audience prediction pauses.
    gaps = [.24 if turns[i]['speaker']!=turns[i+1]['speaker'] else .16 for i in range(len(turns)-1)]
    edge = .65
    reserved = edge * 2 + sum(gaps) + sum(pauses.values())
    target_speech = chapter['duration'] - reserved
    tempo = sum(native) / target_speech
    if not .70 <= tempo <= 1.55:
        raise ValueError(f'{chapter["id"]}: narration needs editing, tempo={tempo:.3f}')
    pieces = [np.zeros(round(edge * sample_rate), dtype=np.int16)]
    local = edge
    chapter['cues'] = []
    chapter_speakers = {speaker: 0 for speaker in voices}
    for i, (path, turn) in enumerate(zip(raw_paths, turns)):
        speaker, text = turn['speaker'], turn['text']
        adjusted = RAW / f'{chapter["id"]}-{i}-timed.wav'
        run(['ffmpeg', '-y', '-i', str(path), '-af', f'atempo={tempo:.8f},loudnorm=I=-18:TP=-2:LRA=7', '-ar', str(sample_rate), '-ac', '1', str(adjusted)])
        with wave.open(str(adjusted)) as f:
            data = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16)
        duration = len(data) / sample_rate
        chapter['cues'].append({'start': round(local, 4), 'end': round(local + duration, 4), 'speaker': speaker, 'text': text})
        chapter_speakers[speaker] += duration
        voice_provenance[speaker]['speakingSeconds'] += duration
        voice_provenance[speaker]['words'] += len(text.split())
        voice_provenance[speaker]['turns'] += 1
        # Sentence-level optional captions identify the speaker without affecting silent visuals.
        sentences = re.split(r'(?<=[.!?])\s+', text)
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
    data = np.concatenate(pieces)
    length = round(chapter['duration'] * sample_rate)
    # Rounding differences between synthesis chunks are absorbed in the final breath.
    assert len(data) <= length, (chapter['id'], len(data)/sample_rate)
    data = np.pad(data, (0, length-len(data)))
    wav = RAW / f'{chapter["id"]}.wav'
    with wave.open(str(wav), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        f.writeframes(data.tobytes())
    chapter['start'] = cursor
    cursor += chapter['duration']
    chapter['end'] = cursor
    chapter['audio'] = f'narration/{chapter["id"]}.mp3'
    audio = OUT / chapter['audio']
    audio.parent.mkdir(exist_ok=True)
    run(['ffmpeg', '-y', '-i', str(wav), '-c:a', 'libmp3lame', '-q:a', '3', str(audio)])
    report.append({'id': chapter['id'], 'seconds': chapter['duration'], 'words': sum(len(t['text'].split()) for t in turns), 'turns': len(turns), 'speakers': {s:round(d,2) for s,d in chapter_speakers.items()}, 'native_speech_seconds': round(sum(native),2), 'tempo': round(tempo,3), 'buildTime': chapter.get('buildTime')})
    print(json.dumps(report[-1]), flush=True)

def vtt_time(seconds):
    milliseconds = round(seconds*1000)
    h, remainder = divmod(milliseconds, 3600000)
    m, remainder = divmod(remainder, 60000)
    s, ms = divmod(remainder, 1000)
    return f'{h:02}:{m:02}:{s:02}.{ms:03}'

vtt = ['WEBVTT', '']
for i, (start,end,text) in enumerate(captions,1):
    vtt += [str(i), f'{vtt_time(start)} --> {vtt_time(end)}', text, '']
(OUT / 'captions.vtt').write_text('\n'.join(vtt))
(OUT / 'timeline.js').write_text('window.TALK = '+json.dumps(talk, ensure_ascii=False, indent=2)+';\n')
(WORK / 'audio-report.json').write_text(json.dumps(report, indent=2)+'\n')
(WORK / 'voice-report.json').write_text(json.dumps(voice_provenance,indent=2)+'\n')
(OUT / 'transcript.txt').write_text('Two male synthetic stand-ins perform the Tyler and Nikola draft roles.\n\n'+'\n\n'.join(f'{c["title"]}\n'+ '\n\n'.join(f'{t["speaker"]}: {t["text"]}' for t in c['turns']) for c in talk['chapters'])+'\n')
print(f'Audio complete: {cursor} seconds, {sum(r["words"] for r in report)} words.', flush=True)
