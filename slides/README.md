# Editing and presenting the deck

`../slides.md` owns the Slidev configuration and cover. These five files are
hand-authored sections; the animation exporter does not generate them.

| File | Slides | Purpose |
| --- | --- | --- |
| `01-opening.md` | 2 | The visible slow request and the promise |
| `02-investigation.md` | 3–5 | Topology, OBI and the live trace investigation |
| `03-language-detail.md` | 6–12 | Explicit Java configuration, rollout and useful method detail |
| `04-namespace.md` | 13–20 | Repetition, upstream opt-in, custom controller and one namespace rule |
| `05-takeaways.md` | 21–24 | Lifecycle, adoption, engineering hours and the close |

The live budget is 20 minutes 50 seconds with two minutes for questions. Slide 14
uses about 2¼ minutes to walk through upstream Operator configuration and
application-team coordination at a natural pace.
Open `/presenter/1` on the running Slidev server. Each slide’s notes contain
its full dialogue, tagged Tyler or Nikola, for reading while presenting.
`../scripts/animation/talk.json` is the script source;
`../presentation/data/slide-script-map.json` assigns every turn once, in order.
The four click-build slides use native `[click]` markers: the matching
passage is highlighted as you advance, and the rest stays dimmed for context.
`noteClicks` in the script map places each marker before a chapter turn; it
does not add audience-facing content or change the transcript.
Run `npm run slides:notes` after changing dialogue or click assignments. `npm run slides:audit`
checks all 18 video chapters, all 24 slides, spoken-turn coverage and the
material recorded views, including terminal setup, the configuration fix,
post-fix waterfall, full fleet waterfall and Catalog inspection.

References remain in `../docs/presentation-research.md`; demo commands are in
`../demo/README.md`. Slide 4 links the previous talk’s CNCF recording. Slides
4, 5, 14 and 18 have purposeful click builds. Slide 14 has five
steps; each has its own highlighted dialogue in presenter notes.

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

The check renders every slide, checks bounds and collisions, exercises all ten
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

Slide 22 compares adoption paths; slide 23 compares cumulative setup and upkeep
cost over 24 months for the existing 18-service demo. The adoption curves
are conceptual, not measured rates or a rollout forecast; this is covered in
the spoken notes rather than an on-slide label. Both charts use
`../presentation/rollout-charts.js`.

The cost chart and the review video's cost scene share the calculator in
`../presentation/savings-model.js`, with inputs in
`../presentation/data/savings-assumptions.json`. These are theoretical capacity
values, not measured customer savings. They compare complete work ledgers;
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
`/presentation/savings.html`. The current notes budget 20 minutes 50 seconds of live content;
coordination and waiting are covered with the Operator configuration on slide 14.


## Customer payoff

Slides 9–12 resolve the customer problem: identify the stale endpoint setting,
remove it and roll the same image, show the actual post-fix waterfall, then compare
matched request medians. `../presentation/data/resolution.json` holds all 60 request timings and
controls. `CustomerResult.vue` uses the same evidence as the animation. The
closing slide recalls both the faster request and namespace-wide readiness.

Run `npm run resolution:verify` for the evidence, unchanged-instrumentation and
story-order checks. `npm run resolution:build` refreshes public review data;
normal production builds also do this. The full protocol and reset instructions
are in `../docs/customer-resolution.md`. Keep the measured local latency result
separate from the hypothetical labor-capacity dollar model.
