"""Run an installed demo voice skill for each turn, retaining its loaded CPU model."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--jobs', type=Path, required=True)
parser.add_argument('--skill', type=Path, required=True)
parser.add_argument('--reference')
args = parser.parse_args()
jobs = json.loads(args.jobs.read_text())
spec = importlib.util.spec_from_file_location('demo_narrate', args.skill / 'scripts/narrate.py')
skill = importlib.util.module_from_spec(spec)
spec.loader.exec_module(skill)

from chatterbox.tts_turbo import ChatterboxTurboTTS

# Use the skill's generator, reference checks, seed, and native watermark.
# Reusing its model avoids loading several GB again for every short turn.
original_loader = ChatterboxTurboTTS.from_local
loaded = {}

@classmethod
def retained_loader(cls, checkpoint, device):
    key = (str(checkpoint), device)
    if key not in loaded:
        loaded[key] = original_loader(checkpoint, device)
    return loaded[key]

ChatterboxTurboTTS.from_local = retained_loader
for index, job in enumerate(jobs, 1):
    output = Path(job['output'])
    metadata = output.with_suffix('.json')
    if output.exists() and metadata.exists():
        assert json.loads(metadata.read_text())['text'] == job['text'], 'Cached script differs'
        print(f"Cached {index}/{len(jobs)}: {job['chapter']} turn {job['turn']}", flush=True)
        continue
    sys.argv = [str(args.skill / 'scripts/narrate.py'), '--text-file', job['text_file'],
                '--output', job['output'], '--reference', args.reference or json.loads((args.skill/'profile.json').read_text())['default_reference'], '--threads', '4']
    skill.main()
    print(f"Finished {index}/{len(jobs)}: {job['chapter']} turn {job['turn']}", flush=True)
