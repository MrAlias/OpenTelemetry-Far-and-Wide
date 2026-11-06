# Editing and presenting the deck

`../slides.md` owns the Slidev configuration and cover. These five files are
hand-authored sections; the animation exporter does not generate them.

| File | Slides | Purpose |
| --- | --- | --- |
| `01-opening.md` | 2 | The visible slow request and the promise |
| `02-investigation.md` | 3–5 | Topology, OBI and the live trace investigation |
| `03-language-detail.md` | 6–12 | Explicit Java configuration, rollout and useful method detail |
| `04-namespace.md` | 13–19 | Repetition, upstream opt-in, custom controller and one namespace rule |
| `05-takeaways.md` | 20–23 | Lifecycle, adoption, engineering hours and the close |

The content budget is 20 minutes 45 seconds, with 75 seconds of live flexibility
and three minutes for recovery/questions. Slide 14 uses 90 seconds for grouped
upstream Operator examples and the coordination they require.
Open `/presenter/1` on the running Slidev server. Each slide’s notes contain
its full dialogue, tagged Tyler or Nikola, for reading while presenting.
`../scripts/animation/talk.json` is the script source;
`../presentation/data/slide-script-map.json` assigns every turn once, in order.
The four click-build slides use native `[click]` markers: the matching
passage is highlighted as you advance, and the rest stays dimmed for context.
`noteClicks` in the script map places each marker before a chapter turn; it
does not add audience-facing content or change the transcript.
Tyler opens each return from the live demo, including fallback entry points.
The script map records those return points and any slide-specific speaker
assignments and transition wording; the notes audit checks that Tyler speaks
first. Live notes connect the result just shown to the next question, without
replaying the demo. These overrides apply to live speaker notes without
rewriting or relabeling existing recorded narration.
Run `npm run slides:notes` after changing dialogue, speaker assignments or click assignments. `npm run slides:audit`
checks all 19 video chapters, all 23 slides, spoken-turn coverage and the
material recorded views, including terminal setup, the configuration fix,
post-fix waterfall and one mixed fleet view with Ruby agent detail and Go/OBI.

References remain in `../docs/presentation-research.md`; demo commands are in
`../demo/README.md`. Slide 4 links the previous talk’s CNCF recording. Slides
4, 5, 14 and 19 have purposeful click builds. Slide 14 groups the Operator
comparison into three states, each with matching highlighted dialogue.

Slide 15 introduces the upstream Injector with a startup diagram and its project QR.
The language list reflects the agents bundled in this demo; the Injector library
is separate from the payload and the Kubernetes rollout mechanism.
The sequence is a scaling question with a brief Injector preview, the upstream
Operator baseline, the full Injector mechanism, then the RIO demo and namespace
policy. Namespace opt-in already exists upstream; the
demo explores sharing the bundle, runtime choices and rollout work.

Slide 5 is a bookmark for the live Grafana investigation. Its captured waterfall
and one highlight are the fallback; skip the topology replay and trace tutorial.
Slide 6 inspects deployment configuration, then slide 7 installs the Java agent.
The source-inspection recording is intentionally omitted.

Terminal recordings play manually using their native controls. They are muted,
run at 1×, include WebM and MP4 sources, and pause automatically on slide leave. They provide rehearsal/fallback
material; execute the actual commands during the live demo. The namespace rule
assumes the shared payload, exporter and exclusions were configured first.

## Structure

- `../layouts/`: cover and standard talk layouts.
- `../components/presentation/`: reusable topology, trace and demo-video views.
- `../styles/presentation.css`: canvas styles scoped away from presenter UI.
- `../setup/main.ts`: registers presentation components separately from demo code.
- `../presentation/data/`: graph geometry, measured request and capture provenance.
- `../public/presentation/`: checked-in stills and short clips; no narration runtime
  or demo cluster is needed to view the slides.

Audience slides use a headline with evidence, code, or a diagram; the full
dialogue stays in presenter notes. Shared layout flags `evidence` and `mediaAt`
give recordings the full canvas, `codeHero` enlarges the namespace rule, and
`titleHidden` lets the cost chart stand alone. Code uses GitHub syntax themes
for contrast in both light and dark mode.

Code and headings are editable Markdown/HTML. The Vue graph uses
Graphviz geometry generated from the demo manifest, including shared database
nodes and their eight explicit client connections. Data stores are separate
from the eighteen application services and never count as agent deployments.
Every service keeps its language label; the observed-request state adds the
recorded duration alongside it, rather than replacing the language. Actual
trace screenshots remain evidence rather than redrawn span diagrams.

## Checks and exports

From the repository root:

```sh
npm ci
npm run dev
npm run build
npm run export
```

The PDF export goes into ignored `.artifacts/slides/`. It uses posters and click
states; live video playback belongs to the Slidev deck. Slidev may require its
export browser dependency on a fresh machine.

With the development server running on port 3030, run:

```sh
SLIDEV_URL=http://localhost:3030 npm run slides:verify
```

The check renders every slide, checks bounds and collisions, exercises all
click transitions, plays a real clip and verifies pause-on-leave and presenter notes.
Set `SLIDEV_CHROMIUM` to an installed Chromium executable if necessary. Browser
profiles, screenshots and reports stay in `.artifacts/slides/`.

For static hosting under the repository path:

```sh
npm run build -- --base /OpenTelemetry-Far-and-Wide/ --router-mode hash
```

`npm run slides:assets` refreshes the curated evidence from local demo captures.
The checked-in manifest records hashes and source paths. Changing the optional
animation or regenerating its rehearsal frames cannot overwrite this deck.

## Dollar examples

Slide 21 compares language-agent adoption among eligible workloads; slide 22 compares cumulative setup and upkeep
cost over 24 months for the existing 18-service demo. The adoption curves
are conceptual, not measured rates or a rollout forecast; this is covered in
the spoken notes rather than an on-slide label. Both charts use
`../presentation/rollout-charts.js`.

The cost chart and the review video's cost scene share the calculator in
`../presentation/savings-model.js`, with inputs in
`../presentation/data/savings-assumptions.json`. These are theoretical capacity
values, not measured customer savings. They model repeated setup and routine update work;
central setup is counted once per rollout group and upkeep uses twelve monthly
agent releases, with optional exceptions separately. No investigation-time credit.
The $24,700 callout is $13,900 first-year capacity plus $10,800 of second-year
upkeep capacity. The scope and sensitivity examples are
in `../docs/instrumentation-savings.md`.

Run `npm run savings:verify` to check the worked examples and accounting,
including an already-centralized baseline with zero additional savings.
Run `npm run savings:build` after changing the inputs. `npm run build` also
refreshes these results automatically.
It refreshes the video data and the editable browser calculator at
`/presentation/savings.html`. The current notes budget 20 minutes 45 seconds of live content;
coordination and waiting are covered with the Operator configuration on slide 14.


## Customer payoff

Slides 9–12 resolve the customer problem: identify the stale endpoint setting,
remove it and roll the same image, show the actual post-fix waterfall, then compare
real Grafana metric captures side by side. The panels show mean Gateway request
duration from OBI over equal two-minute windows: 2.21 s and 165 ms.
`../presentation/data/metric-comparison.json` retains their queries and provenance.
The closing callback repeats these captured means. The original matched-request medians remain in the measurement record.
`../presentation/data/resolution.json` holds all 60 request timings and
controls. `CustomerResult.vue` uses the same evidence as the animation. The
closing slide recalls both the faster request and namespace-wide readiness.

Run `npm run resolution:verify` for the evidence, unchanged-instrumentation and
story-order checks. `npm run resolution:build` refreshes public review data;
normal production builds also do this. The full protocol and reset instructions
are in `../docs/customer-resolution.md`. Keep the measured local latency result
separate from the hypothetical labor-capacity dollar model.
