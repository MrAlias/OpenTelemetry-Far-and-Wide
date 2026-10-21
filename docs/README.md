# Talk documentation

Use this directory for durable thinking that shapes the presentation: the talk
brief, architecture decisions, terminology, research notes, and content plans.

Keep speaker notes alongside the relevant slide in `slides.md`. Store static
presentation assets in `public/`.

- [Talk brief](talk-brief.md): proposal, audience outcomes, and narrative spine.
- [Presentation research](presentation-research.md): sources on talk structure,
  slide design, audience engagement, delivery, and a proposed 25-minute sequence.
- [Interactive visual storyboard](../public/storyboard.html): editable, standalone
  scene sketches, reveals, timing, presenter notes, and demo requirements.
- [Companion scene plan](talk-storyboard.md): text reference for the visual storyboard.
- [Technical findings](technical-findings.md): evidence-backed preparation answers,
  architecture decisions, and the experimental proof still required.
- [Source lock](evidence/source-lock.json): immutable upstream references and
  inspected-file hashes for reproducing the research.
- [Executable demo specification](demo-spec.md): concrete workload, deployment
  commands, instrumentation states, and trace/metric/rollout assertions.
- [Proof results](proof-results.md): measured coexistence and rollout results,
  raw evidence archives, corrections, and remaining failures.
- [Instrumentation handoff reliability](reliability-results.md): coordinated
  admission, routing, export drain, repeated trials, and preserved counterexamples.
- [Compatibility counterexamples](compatibility-counterexample.md): exact failed
  trace IDs and raw observations preserved for further OBI investigation.
- [Injector prototype evaluation](technical-findings.md#injector-prototype-evaluation--2026-10-19):
  Grafana fork identification, pinned source review, migration requirements and
  the role of `otelc`; includes candidate policy and cluster configurations.

The [animation experiment](../scripts/animation/README.txt) is retained for
possible review and live playback. Its use in the talk is undecided. Generated
audio and video are excluded from Git; rebuild them before opening the player.
