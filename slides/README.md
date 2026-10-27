# Editing and presenting the deck

`../slides.md` owns the Slidev configuration and cover. These five files are
hand-authored sections; the animation exporter does not generate them.

| File | Slides | Purpose |
| --- | --- | --- |
| `01-opening.md` | 2 | The visible slow request and the promise |
| `02-investigation.md` | 3–7 | Topology, OBI, actual trace and earned service selection |
| `03-language-detail.md` | 8–13 | Explicit Java configuration, rollout and useful method detail |
| `04-namespace.md` | 14–20 | Repetition, upstream opt-in, custom controller and one namespace rule |
| `05-takeaways.md` | 21–25 | Coordination, lifecycle, illustrative dollars, fleet scaling and the close |

The live budget is 21 minutes, one minute flex and three minutes questions.
Speaker notes include handoffs, time budgets, commands, source references and
places to switch into the running demo. Use Slidev's presenter view (`/presenter/`)
and press `F` for fullscreen. Only slides 6, 7 and 19 have click builds; each
adds evidence or changes the enrollment state.

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

Code, headings and conclusions are editable Markdown/HTML. The Vue graph uses
Graphviz geometry generated from the demo manifest; actual trace screenshots
remain evidence rather than redrawn span diagrams.

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

The check renders every slide, checks bounds and collisions, exercises all three
click builds, plays a real clip and verifies pause-on-leave and presenter notes.
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

Slides 23–24 and the review video's final cost scenes share the calculator in
`../presentation/savings-model.js`, with inputs in
`../presentation/data/savings-assumptions.json`. These are theoretical capacity
values, not measured customer savings. They compare complete work ledgers;
shared upkeep is counted per rollout group with service exceptions separately.
The scope and sensitivity examples are
in `../docs/instrumentation-savings.md`.

Run `npm run savings:verify` to check the worked examples and accounting,
including an already-centralized baseline with zero additional savings.
Run `npm run savings:build` after changing the inputs. `npm run build` also
refreshes these results automatically.
It refreshes the video data and the editable browser calculator at
`/presentation/savings.html`. The notes keep the live content at 21 minutes;
the existing coordination and lifecycle sections were shortened to make room.


## Customer payoff

Slides 11–13 resolve the opening customer problem: reveal the deliberate pricing
wait, show the actual application deployment, then compare matched request
medians. `../presentation/data/resolution.json` holds all 60 request timings and
controls. `CustomerResult.vue` uses the same evidence as the animation. The
closing slide recalls both the faster request and namespace-wide readiness.

Run `npm run resolution:verify` for the evidence, unchanged-instrumentation and
story-order checks. `npm run resolution:build` refreshes public review data;
normal production builds also do this. The full protocol and reset instructions
are in `../docs/customer-resolution.md`. Keep the measured local latency result
separate from the hypothetical labor-capacity dollar model.
