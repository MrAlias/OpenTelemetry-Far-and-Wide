# OpenTelemetry Far and Wide

Tyler Yahn and Nikola Grcevski · Observability Day · KubeCon + CloudNativeCon
North America 2026.

A 25-minute talk: use OBI to find where a request spends time, add Java zero-code
detail on one service, then select a namespace to carry instrumentation across
supported services. A real pricing change resolves the obsolete backend attempt,
and matched requests measure the customer result. The closing slides explain coordination and lifecycle savings
and how to measure them.

## Run the Slidev presentation

```sh
npm ci
npm run dev
```

Open the URL printed by Slidev. Use `/presenter/` for notes and handoffs.
`npm run present` opens the deck in a browser. `npm run build` creates the static
site in `dist/`; `npm run export` creates a PDF in `.artifacts/slides/`.

The **26-slide deck is editable Slidev source** in [slides.md](slides.md) and
[slides/](slides/README.md), with reusable Vue components and custom layouts.
Actual dashboard stills and short terminal recordings are checked in alongside
the slides, so a fresh checkout can present without a demo cluster, synthetic
voice model, or media rebuild. The live plan has 21 minutes of content, one minute
flex and three minutes of questions.

## Project structure

```text
slides.md                  Slidev configuration, cover and section imports
slides/                    Editable sections and presenter notes
layouts/                   Cover and standard talk layouts
components/presentation/   Reusable Slidev evidence and media components
styles/                    Scoped presentation styles
setup/                     Slidev application setup
presentation/data/         Source-derived topology and measured capture data
public/presentation/       Versioned still images and short demo clips
public/storyboard.html     Editable visual storyboard
public/animation/          Optional narrated review and its player
scripts/presentation/      Evidence preparation and slide validation
scripts/animation/         Optional narration and rehearsal export pipeline
demo/                      Live application, manifests and walkthrough
components/otel-injector-*/ Injector payload and controller implementation
docs/                      Talk brief, research, findings and savings definitions
.artifacts/                Ignored working files, captures, profiles and checks
```

Keep all generated working files inside this repository. Never use `/tmp` for
project assets. Slidev files are authored independently; animation exports cannot
overwrite them. See [editing and presenting](slides/README.md) for slide ranges,
media behavior, checks, exports and deployment under a URL prefix.

## Live demo and evidence

The standalone controller and payload project is **[RIO — Runtime Instrumentation Operator](https://github.com/otelx/rio)**. For a fresh installation of OpenTelemetry Zero-Code instrumentation, start with [RIO’s quickstart](https://github.com/otelx/rio/blob/main/docs/quickstart.md). This repository contains the presentation and its recorded demo snapshot.

The [demo walkthrough](demo/README.md) runs eighteen services, PostgreSQL and
Redis. OBI supplies the baseline. The opening 350 ms request contains a failed
Checkout connection around 150 ms. Java-agent detail ties the failed HTTP call
to pricing and its successful PostgreSQL fallback. These are actual local
exemplars, not performance benchmarks.

The [customer resolution](docs/customer-resolution.md) removes the obsolete
backend attempt while retaining the current product-price lookup. The actual
post-fix waterfall comes first; an aggregate comparison follows. Matched warmed
request medians are 361.6 → 214.1 ms with identical instrumentation. Pricing
medians are 157.0 → 4.0 ms. The newly built default image retains the timeout
baseline for rehearsal; the historical proof keeps its older fixture.

The custom controller and OpenTelemetry Injector then enroll thirteen additional
supported workloads using one namespace rule. Fourteen language-agent services
and four Go services with OBI appear in the fresh request. Upstream already
supports language-specific workload or namespace opt-in; the custom integration
combines central selection, runtime handling and managed rollout.

Use the [live handoff](docs/fleet-demo-handoff.md) for the exact direct-agent and
namespace sequence. The original [proof harness](demo/proof/README.md) is historical
and separate. The closing dollar figures are hypothetical engineering-capacity
values, not measured savings or a smaller telemetry bill. The
[savings model and inventory](docs/instrumentation-savings.md) define the inputs
and comparison; open `/presentation/savings.html` for the editable calculator.

## Storyboard and narrated review

The [visual storyboard](public/storyboard.html) retains the 21-scene customer-to-resolution arc.
Run `npm run storyboard:serve` and open `/storyboard.html`; a reachable phone can
use the serving computer's address. Its stills work offline; recorded video
links use local generated capture files.

The optional [animated review](public/animation.html) uses Tyler's and Nikola's
separate authorized synthetic voice profiles at native pace. Full generated
movies, narration and original capture intermediates are ignored by Git; see
[scripts/animation/README.txt](scripts/animation/README.txt) to rebuild them.
The Slidev deck includes its own portable short clips.

Synthetic voice recordings, voice previews and narrated movies must stay local
and untracked. The versioned slide clips contain no audio tracks; asset refresh
rejects clips containing audio. Text transcripts, scripts and captions remain
versioned.

The [presentation research](docs/presentation-research.md),
[script research](docs/animation-script-research.md) and
[talk brief](docs/talk-brief.md) explain the communication choices and sources.
