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
├── public/            # Static images, diagrams, and downloadable assets
├── demo/              # Live-demo environment and operator workflow
├── examples/          # Focused, independently runnable code examples
├── docs/              # Talk brief and architecture/content notes
├── notes/             # Rehearsal, timing, and delivery notes
└── resources/         # Curated references and attendee follow-up material
```

Each content directory includes a short README describing its intended scope.
Add material to the narrowest relevant directory and keep generated files out
of version control.

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

## Content direction

The audience should leave understanding that eBPF and SDK instrumentation are
complementary layers—not competing choices—and that teams can dynamically
trade telemetry depth for cost without asking every application team to change
its code or Kubernetes manifests.

The talk proposal and narrative outline live in
[`docs/talk-brief.md`](docs/talk-brief.md).

## License

Licensed under the [Apache License 2.0](LICENSE).
