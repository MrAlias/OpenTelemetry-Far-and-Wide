Animated talk: purpose and files
===============================

This is an optional recorded demo rehearsal based on the actual 18-service commerce
topology plus PostgreSQL and Redis. Fourteen services use payload-supported
language runtimes; four Go services retain OBI coverage.
OBI establishes the system view and guides the service selection; direct language-agent setup proves
useful detail on one; a custom operator/injector addresses the remaining fleet;
then the speakers examine coordination, adoption and cumulative setup/upkeep costs.
RIO is a purpose-built demo for this talk. We want the capability upstream;
the implementation and upstream path remain open.
Trace and terminal views were recorded from the running demo. The actual missing-backend timeout and fallback are resolved by removing an optional endpoint setting and rolling the same image;
show the post-fix waterfall before the matched-duration summary. Dollars use a
separate hypothetical ownership/monthly-upkeep model, not measured savings.

The narration uses Tyler Yahn's and Nikola Grcevski's separate authorized
synthetic voice profiles. These are scripted synthetic performances, not a
recording of the presenters. Tyler's profile uses the Go reference; Nikola's
uses the default October 7 OBI reference. Tyler relayed a positive assessment of
Nikola's sample likeness on October 22, 2026. Both retain native PerTh marks.

For live use, narration is optional. The player supports silent chapters and
three 20-second explainers. Each short clip gives context, shows a substantive
change and holds the result. The storyboard remains the current live plan;
the animation does not have to become the presentation format.

Editable sources
----------------
public/storyboard.html               Authoritative standalone visual storyboard
scripts/animation/talk.json           Speaker-tagged script, profiles and cues
public/animation/art.js               Shared vector compositions and three builds
presentation/rollout-charts.js        Shared adoption/cumulative-effort renderer
scripts/presentation/build_rollout_charts.mjs  Packages that renderer for playback
scripts/presentation/build_resources.mjs  Reuses the deck's two closing QR vectors
public/animation/player.js            Playback, optional audio, captions and looping
public/animation.html                 Review entry point
scripts/animation/build_topology.py   Source-checked Graphviz layout and offline embed
scripts/animation/topology-renderer.js  Topology evidence/enrollment rendering
public/animation/topology.js          Generated topology geometry and renderer
scripts/animation/export_slides.mjs   Vector rehearsal frames and a draft in .artifacts/animation/
scripts/animation/generate_demo_voice.py  Installed skill invocation and model reuse
scripts/animation/build_audio.py      Separate profile caches and natural timing
scripts/animation/check_demo_watermarks.py  Both source and encoded voice checks
scripts/animation/verify_media.py     Media, timing, profiles and reuse verification

The generated timeline records measured speech duration plus authored pauses.
The live rehearsal budget is 22 minutes 5 seconds, with two minutes for questions.
A shorter natural read is fine. If the read exceeds 22 minutes, edit the script;
never stretch, accelerate or slow speech to hit a duration. The opening starts “Welcome everyone,” introduces both full names and uses a
0.6-second visual lead-in with natural handoffs; no authored dramatic pauses.

Generated deliverables, inside public/animation/
------------------------------------------------
opentelemetry-far-and-wide-tyler-voice.mp4  Two-profile H.264/AAC film with chapters
opentelemetry-far-and-wide-silent.mp4       Silent full film
clips/*-silent.mp4                        Twenty-one silent chapters
explainers/*-20s.mp4                      Three silent live explainers
draft-narration.m4a                       Mixed two-speaker narration
nikola-voice-preview.m4a                  Sample used for likeness assessment
timeline.js                              Actual timings, cues and profile identities
captions.vtt                             Draft sentence captions, speaker-labelled
transcript.txt                           Readable dialogue and synthetic disclosure
credits.txt                              Sources, voice references and credits

Generated audio/video is ignored by Git. A fresh checkout needs a media rebuild.
All working scripts, original skill WAVs, metadata, browser profiles and QA output
stay under .artifacts/animation/ inside this repository. They are not project
assets in a system temporary directory.

Serving
-------
npm run animation:serve

Open http://localhost:8010/animation.html. A reachable phone can use the serving
computer's address instead of localhost. Press Space to play/pause, use arrows to
seek, or use the visible controls. Playback speed controls are for viewer choice;
the authored film uses the original native speech rate.

Rebuilding
----------
Requirements: Node.js 20+, FFmpeg with libx264, local Chromium, Graphviz, Python with NumPy and PyYAML,
and both installed personal voice skills with their verified runtimes/model cache.
The model and reference files remain in those installations; never copy them
into the repository. Read their SKILL.md for installation and authorized scope.
Routine narration needs no bootstrap or source-recording extraction.
Pronunciation overrides preserve visible spellings: RIO is rhee-o (Spanish río);
OTelX is oh-tell-X. Tyler’s OBI pronunciation uses the single word Obi for a shorter opening vowel.
The speech generator uses Rio and Oh tell ex, avoiding
letter-by-letter delivery or an artificial break between Rio's syllables.

mkdir -p .artifacts/animation/runtime/tmp
export TMPDIR="$PWD/.artifacts/animation/runtime/tmp"
python3 scripts/animation/build_topology.py
node scripts/presentation/build_savings.mjs
node scripts/presentation/build_resolution.mjs
node scripts/animation/export_slides.mjs
.artifacts/animation/runtime/venv/bin/python scripts/animation/build_audio.py
ANIMATION_CHROMIUM=/absolute/path/to/chromium node scripts/animation/render_video.mjs
"${TYLER_VOICE_PYTHON:-$HOME/.local/share/tyler-demo-voice/venv/bin/python}" scripts/animation/check_demo_watermarks.py
python3 scripts/animation/verify_media.py

The main builder needs NumPy, not a stock voice model. Existing local environments
can be reused. It invokes each speaker's installed Chatterbox Turbo 0.1.7 generator
at its pinned model revision, verifies reference hashes, and keeps the skills'
original 24 kHz WAVs and JSON provenance unchanged. Each installed generator uses
its own reference and saved conditioning states. A loaded CPU model is retained
within each speaker's generation process to avoid loading it for every turn.

TYLER_VOICE_SKILL / TYLER_VOICE_PYTHON and NIKOLA_VOICE_SKILL /
NIKOLA_VOICE_PYTHON override the two installation/runtime locations. Defaults are
~/.codex/skills/<speaker>-demo-voice and
~/.local/share/<speaker>-demo-voice/venv/bin/python. Speaker identities must match
their profiles. No stock voice fallback is allowed.

Caches are separate: .artifacts/animation/tyler-voice/ and nikola-voice/.
Cache keys include the whole profile identity and pronounced text. A cast change
cannot reuse the other speaker's audio. Completed Tyler passages are reused when
only Nikola changes. Performance directions stay outside the synthesized text.

Write for the two presenters talking through a customer problem together.
Connect each technical action to what it lets a customer or team do next.
Use short replies and occasional light banter; avoid alternating documentation
readouts, unexplained terms, and jokes inserted to decorate a feature list.

The delivery mix normalizes loudness without altering speech duration. Cues and
builds derive from measured original WAVs, handoff gaps and explicit inspection
pauses. Caption sentence chunks use word weights within each turn; they remain
draft timings, not forced alignment. Native source and encoded PerTh detection
is checked separately for both speakers against the final movie's hash.

Original WAV metadata, .artifacts/animation/voice-report.json and audio-report.json
record reference identity, native duration, unchanged tempo and both speaking
roles. voice-watermark-report.json checks each role in each chapter. Layout and
interaction reports cover the actual frames and controls. The legacy
check_tyler_watermark.py and generate_tyler_voice.py commands forward to the
shared implementations for compatibility.

Namespace Injector revision
---------------------------
The upstream Operator scene credits language-specific workload OR namespace
opt-in. The merged custom component then selects demo-apps using one central
namespace rule and manages the rollout with the Injector's runtime selection.
Shared defaults/exclusions are prepared beforehand. Existing direct Checkout
and four Go OBI services remain clear. Supported new workloads inherit selection.

The namespace recording is public/demo-capture/instrument-namespace-edited.mp4.
Its raw recording and native-speed wait-cut ledger are retained in the repo.
The topology lighting is trace-derived illustration after the real rollout;
the following native Grafana scene opens the fresh fleet trace and Catalog detail.

For a script/media iteration whose other chapters are unchanged, reuse existing
chapter encodes with render_video.mjs --only ID1,ID2. The final movie, captions,
chapter metadata and silent companion are rebuilt from the current timeline.
Always rerun watermark/media checks after replacing the final movie.

The authored presentation is slides.md plus slides/*.md. This exporter never
overwrites those files. Native Vue components and layouts belong to the live
Slidev deck; public/animation remains an optional narrated review.

Customer story
--------------
The measured pricing fix and matched latency recheck precede the fleet-scale
setup challenge. See docs/customer-resolution.md and presentation/data/resolution.json.
The live plan is 22 minutes 5 seconds; the natural recorded read may be shorter.
Never substitute calculated or invented timings for actual captured requests.

Timeout evidence and code edit
------------------------------
Run node scripts/presentation/build_timeout_evidence.mjs before exporting.
The slides and animation enlarge native Grafana screenshots of the span
attributes, exception event, and Checkout resource attributes. Captured field
values and screenshot hashes are checked against java-trace-evidence.json.
Full dashboard captures remain reviewable under public/demo-capture/.
The Checkout launcher explicitly exposes LEGACY_PRICING_URL as a resource
attribute. Remove that setting and roll the same image; do not rebuild or edit
application code during the resolution. The new request waterfall precedes the
matched summary. Full raw traces stay local; public snapshots keep only the
presentation’s necessary fields.

Run npm run slides:notes after script changes. The slide-script map places the
complete dialogue in presenter notes and audits all chapters and recorded views.
Narration and all generated movies remain local and ignored.
