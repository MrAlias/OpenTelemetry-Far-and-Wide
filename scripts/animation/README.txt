Animated talk: purpose and files
===============================

This optional experiment is still under evaluation. The storyboard remains
the current presentation plan; animation is not a required delivery format.
Generated audio and video are excluded from Git and require rebuilding.

The 20-minute dialogue version supports review of the talk's explanation and
pacing. Two distinct male synthetic stand-ins perform the Tyler and Nikola
roles, with questions, short reactions, and light banter. Narration is optional.
For live delivery, use the silent full version,
silent chapters, or the six 20-second explainer clips. Each explainer starts
with seven seconds of context, makes its substantive visual change, and holds
the result. It does not require the draft voices or a network connection.

The animation is a concept visualization. It is not a demo recording. The
shared Operator integration is proposed, schematic requests have no measured
latency, and the cost comparisons contain no invented results. Replace these
illustrations with verified evidence when the demonstration is ready.

Editable sources
----------------
scripts/animation/talk.json       Speaker-tagged turns, cast, pauses, build cues
public/animation/art.js           Deterministic SVG compositions and six builds
public/animation/player.js        Optional audio, chapter controls, seeking, looping
public/animation/player.css       Responsive review player
public/animation.html             Player entry point

public/storyboard.html remains the source of the storyboard. This animation
is a separate deliverable; its timing is 20 minutes rather than the storyboard's
21-minute rehearsal plan. The current chapter durations sum to exactly 1200 s.
Changing those durations requires updating the total and seek range too.

Generated deliverables, all inside public/animation/
---------------------------------------------------
opentelemetry-far-and-wide-20min-dialogue.mp4 Two-voice H.264/AAC video with chapters
opentelemetry-far-and-wide-20min.mp4          Compatibility copy of the dialogue film
opentelemetry-far-and-wide-20min-silent.mp4   H.264 video, no audio stream
draft-narration.m4a                          Separate two-voice draft track
clips/*-silent.mp4                          Fifteen full-length silent chapters
explainers/*-20s.mp4                         Six short silent clips for live use
timeline.js                                 Shared cues for rendering and playback
captions.vtt                                Optional sentence captions
transcript.txt                              Reviewable, speaker-labelled dialogue
credits.txt                                 Sources and speech provenance

Serving
-------
npm run animation:serve

Open http://localhost:8010/animation.html. For a reachable phone, replace
localhost with the serving computer's address. All media is local; there is
no external browser dependency. Press Space to play/pause, or use the native
controls. Arrow keys seek by five seconds when not focused on a control.

Rebuilding
----------
Requirements: uv/Python 3.13, Node.js 20+, FFmpeg with libx264, and Chromium.
Working directories, caches, model files and browser profiles stay in the repo.
The checked-in sources do not contain the speech engine or model binary.

From the repository root:

mkdir -p .artifacts/animation/runtime/tmp .artifacts/animation/runtime/cache .artifacts/animation/voice/dialogue
export TMPDIR="$PWD/.artifacts/animation/runtime/tmp"
export UV_CACHE_DIR="$PWD/.artifacts/animation/runtime/cache"
export UV_PYTHON_INSTALL_DIR="$PWD/.artifacts/animation/runtime/python"
uv venv --python 3.13 .artifacts/animation/runtime/venv
uv pip install --python .artifacts/animation/runtime/venv/bin/python piper-tts==1.8.0 pillow==13.0.0

Download en_US-bryce-medium.onnx and its .onnx.json configuration, plus
en_US-john-medium.onnx and its .onnx.json configuration, into
.artifacts/animation/voice/dialogue/ from:
https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/bryce/medium
https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_US/john/medium
Model cards and provenance are linked in public/animation/credits.txt.

.artifacts/animation/runtime/venv/bin/python scripts/animation/build_audio.py
ANIMATION_CHROMIUM=/absolute/path/to/chromium node scripts/animation/render_video.mjs

build_audio.py caches synthesis by model hash and turn text. It uses the cast
on every turn, shortens only leading/trailing silence for quicker handoffs,
balances loudness, and fits the conversation to each chapter's timing. Both
five-second audience prediction pauses remain.
The current tempo adjustments are recorded in .artifacts/animation/audio-report.json.
The model identities, turn counts, and speaking time are recorded in
.artifacts/animation/voice-report.json. Captions and the transcript identify
each speaker. Captions use sentence word weights within each turn; they are
draft timings, not a forced-alignment transcript.

render_video.mjs captures every changing artwork frame and holds static frames
for their actual time. It checks text against frame boundaries, encodes each
chapter, creates silent live clips, and assembles the full film with chapter
metadata and optional subtitles. It writes logs and layout validation results
under .artifacts/animation/. The browser executable can be overridden through
ANIMATION_CHROMIUM; no system temporary directory is used.
