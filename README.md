# OpenTelemetry Far and Wide

Materials for **“OpenTelemetry Far and Wide”**, presented by Tyler Yahn and
Nikola Grcevski at KubeCon + CloudNativeCon North America 2026, Observability
Day.

The talk explores how OpenTelemetry eBPF instrumentation and SDK
auto-injection can work together: broad, zero-touch coverage first, then
language-level detail where it is valuable, all through a shared deployment
mechanism with dynamic cost controls.

## Repository map

```text
.
├── slides.md          # Slidev presentation entry point
├── style.css          # Shared presentation styles
├── components/        # Reusable Slidev Vue components
├── layouts/           # Talk-specific Slidev layouts
├── public/            # Static assets and the interactive storyboard
├── demo/proof/        # Executable coexistence and reliability checks
└── docs/              # Talk brief and architecture/content notes
```

Put images, video, downloadable manifests, and other files that should be
addressable directly as `/filename` in `public/`. Keep speaker notes alongside
their slides in `slides.md`, and keep generated files out of version control.

## Work on the slides

Prerequisites: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run export
```

The `export` command may prompt Slidev to install a browser dependency the first
time it is used.

## Review the storyboard

The [interactive visual storyboard](public/storyboard.html) is a self-contained,
editable HTML file in this repository. Open it directly in a browser, or run
`npm run dev` and open `/storyboard.html` on the development server.

It includes all 15 scene sketches, progressive reveals, timing, presenter notes,
and requirements for the next demo phase. It works offline
and needs no Codex installation, external assets, or build step. Edit
`public/storyboard.html` as the source of truth for the visual storyboard.

The [companion scene plan](docs/talk-storyboard.md) provides a text reference.

## Review the animated talk

Open [the animation player](public/animation.html) for the 20-minute version.
It includes two distinct male synthetic draft voices performing the Tyler and
Nikola parts as a conversation, with questions, handoffs, and light banter.
Narration is optional. Chapter selection, seeking, speaker-labelled captions,
speed controls, and chapter looping support review. The six visual builds
also have separate 20-second silent clips for use while presenting live.

Serve the files with `npm run animation:serve`, then open
`http://localhost:8010/animation.html`. For mobile review, use the serving
computer's reachable address instead of `localhost`.

The full narrated MP4, silent MP4, separate narration track, and silent chapter
clips are generated inside `public/animation/`. Traces and operational outcomes
are concept illustrations; cost results remain unmeasured. The animation does
not assume a completed demo.

Edit [the narration and chapter durations](scripts/animation/talk.json) and
[the visual renderer](public/animation/art.js). Build instructions are in
[scripts/animation/README.txt](scripts/animation/README.txt).

## Content direction

The audience should leave understanding that eBPF and SDK instrumentation are
complementary layers—not competing choices—and that teams can dynamically
trade telemetry depth for cost without asking every application team to change
its code or Kubernetes manifests.

The talk proposal and narrative outline live in
[`docs/talk-brief.md`](docs/talk-brief.md).

The executable coexistence experiment lives in
[`demo/proof/`](demo/proof/README.md). Its
[`specification`](docs/demo-spec.md) and [`results`](docs/proof-results.md)
record the original experiment. The [reliability follow-up](docs/reliability-results.md)
documents the revised handoff and its repeatable rehearsal: 1,086/1,086 measured
requests passed at serial load; broader compatibility and concurrency failures
remain preserved.

## License

Licensed under the [Apache License 2.0](LICENSE).
