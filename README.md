# OpenTelemetry Far and Wide

Materials for **“OpenTelemetry Far and Wide”**, presented by Tyler Yahn and
Nikola Grcevski at KubeCon + CloudNativeCon North America 2026, Observability
Day.

The talk explores how OpenTelemetry eBPF instrumentation and SDK
auto-injection can work together: broad, zero-touch coverage first, then
language-level detail where it is valuable, all through a shared deployment
mechanism with dynamic cost controls.

The current starting point is the visual storyboard and its companion research.
The Slidev deck contains the title slide and shared base styling; the remaining
slides and demo evidence still need to be built against the storyboard.

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
The rehearsal target is 21 minutes of content, one minute of recovery time,
and three minutes of questions within the 25-minute slot.

For mobile review, run `npm run storyboard:serve` and open
`http://<computer-address>:8010/storyboard.html` on a phone that can reach the
serving computer. On that computer, use `http://localhost:8010/storyboard.html`.
This preview command serves the contents of `public/`.

The [presentation research](docs/presentation-research.md) explains the choices
behind the structure, visuals, audience interaction, and delivery.

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

## Experimental animation

The [animation sources and rebuild instructions](scripts/animation/README.txt)
preserve an optional 20-minute narration and playback experiment. Animation is
still under evaluation; the storyboard is the current presentation plan.
Generated audio and video are ignored by Git and must be rebuilt before using
[the player](public/animation.html) on a fresh checkout.

## License

Licensed under the [Apache License 2.0](LICENSE).
