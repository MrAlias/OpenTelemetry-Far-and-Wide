# Current application · fleet story, October 22, 2026

The dialogue now serves one idea: use OBI timing to choose an investigation,
prove useful agent detail on one service, and show why a shared operator workflow matters for the
rest. This supersedes the earlier selective-depth/upgrade/removal route described
in the historical synthesis below.

The existing source principles still govern the rebuild: state the outcome early
(HBR/Duarte), make the demo a visible problem-to-result journey with one takeaway
(Salesforce), write short spoken exchanges with purposeful handoffs (Wistia), and
use natural pacing and inspection pauses (TechSmith). Nikola asks about the
remaining supported services after the first useful agent result, so the
operator answers a need the audience has just seen. Two visual builds now add information: the captured Cart branch becomes an observed path, and the actual Checkout interval is highlighted after the timing explanation.
evidence-led service selection, the first new agent observation, and remaining-fleet coverage.

The October 22 topology update follows the checked-in commerce application at
`759cc0979909`: 18 services, PostgreSQL and Redis. The payload targets 14
supported language-runtime services, with four Go OBI baselines. The opening
holds its title silently for four seconds, then pauses 2.5 seconds after a short
audience problem before giving the promise. Speech remains at its native pace.

Savings now concern repeated human work, supported by the measurement guidance
in Google's [Site Reliability Workbook](https://sre.google/workbook/eliminating-toil/).
The [savings inventory](instrumentation-savings.md) applies it to this scenario and
includes the shared platform's maintenance costs. None of those benefits is a
measured result here. Current [Operator documentation](https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/)
credits existing language injection and namespace opt-in; this custom prototype
must demonstrate its actual additional contribution. A future upstream direction
is not presented as a verified release commitment.

The October 23 animation uses actual terminal and Grafana recordings from the expanded demo.
Tyler and Nikola use their separate authorized synthetic voice profiles. Nikola’s
default October 7 reference received a positive likeness assessment relayed by
Tyler on October 22, 2026.
Speech stays at native pace. The live plan budgets 21 minutes plus one minute
flex and three for questions; a shorter measured animation is acceptable.

---

# Historical synthesis · October 21, 2026

Sources reviewed October 21, 2026, for the optional animated talk at natural speaking pace.
The audience is platform and observability practitioners, with mixed familiarity
with the implementation. The video supports review and possible playback during
a live talk. At that stage, the concept animation used Tyler's authorized
synthetic voice and a male stand-in for Nikola. The October 22 rebuild above
supersedes that cast and storyline. The storyboard remains the presentation plan.

The central message is: **Use OBI to reveal the end-to-end request and locate the service to investigate;
add selected detail only when that trace leaves a question.**

## Sources and application

| Source | Guidance used | Application to this script |
| --- | --- | --- |
| Nancy Duarte, [How to Present to Senior Executives](https://hbr.org/2012/10/how-to-present-to-senior-execu), HBR, October 4, 2012 | State the outcome early. | The first sentence gives the diagnostic payoff before introductions. Only the publicly available introduction was accessible. |
| Nancy Duarte, [How the Duarte Big Idea Formula Can Make Your Presentation the Best](https://www.duarte.com/blog/how-to-develop-the-best-big-idea-for-your-presentation/), July 19, 2018 | Choose one message, a point of view, and stakes that matter to listeners. | Every chapter serves the investigation or the decision to operate and retain its instrumentation. The stakes are a useful next diagnostic step and manageable ongoing detail. |
| Gabe Sumner, [5 Simple Steps To Delivering Better Product Demos](https://www.salesforce.com/blog/better-product-demo/), Salesforce, July 14, 2022 | Establish a question and focused takeaway; orient viewers to visible evidence; connect the starting problem, change, and result. | Narration names the service path, empty method row, new span, and paired requests. The main change appears before its extended interpretation. Upgrades, removal, and cost continue the same operating decision. |
| Chris Lavigne and Courtney Lefferts, [How to Write a Video Script](https://wistia.com/blog/wistias-scripting-tips), Wistia, February 4, 2019 | Define audience and takeaway, use conversational language and short sentences, include shot directions, and read the script aloud. | Tyler and Nikola share a real investigation. Questions clarify a choice; occasional humor releases tension. Speaker directions and inspection pauses are explicit in the editable script. The final action is one service and one unanswered question. |
| Katie Eidelson, [How to Record a Voice Over: Complete Guide](https://www.techsmith.com/blog/voice-over/), TechSmith, updated June 24, 2026 | Balance clarity, volume, natural pacing, engaged tone, pronunciation, and useful pauses; review recordings. | Keep two distinct voices, technical pronunciation overrides, level normalization, inspection holds, and five-second prediction pauses. Use native speech duration and edit an overlong script before rendering. No music competes with technical language. |

These are practitioner recommendations. They do not establish an optimal word
rate, prove an audience rating, or validate this implementation. Narration stays at each voice’s native speed. Runtime follows spoken audio and
useful pauses; an overlong version requires editing its script or presentation.

The supplied synthesis from another thread helped identify these applications.
Its missing connection, header insertion, and Collector-proof sequence describes
a different demonstration. This script instead follows the slow-request
investigation: OBI end-to-end coverage, evidence-led service selection, selected
pricing detail, fresh request, and verification. It adds no unrelated header operation or claimed Collector proof.
The linked Salesforce article was reviewed; its companion video was not viewed.

## Narration and visual contract

- Start with a slow response and an unknown service. Reveal the end-to-end OBI
  trace, then read its parent/child timing to justify investigating checkout.
  Method detail follows that decision.
- Establish what viewers are looking at before interpreting it. Point to labels
  and relationships that actually appear in that chapter.
- Cue each of the six builds from a specific turn. Interpret the revealed
  evidence after the build begins. Leave time to inspect the result.
- Keep both requests visible for comparisons. They are separate executions;
  the earlier trace never acquires new spans retrospectively.
- Explain the central outcome before qualifications. Keep qualifications where
  they affect an operating decision: replacement pods, trace ownership, proposed
  integration, measured cost, and the earlier proof's tested boundary.
- Preserve the actual limits: captured trace timing, a recorded shared
  integration, unfinished demo requirements, and pending cost measurements.
- Let either speaker explain substantive points. Avoid a repeated quizmaster
  pattern, invented presenter biography, or simulated claims of real deployment
  success. Directions guide a future human read; the local speech engine does
  not interpret them as expressive performance controls.

## Review and reproduction

Edit `scripts/animation/talk.json`. It contains the dialogue, chapter purposes,
performance directions, durations, reveal cues, and explicit pauses. Generated
speaker-labelled captions and the readable transcript live in
`public/animation/`. Caption timings are estimated from speech chunks, not
manually aligned to every spoken word.

Follow [the build instructions](../scripts/animation/README.txt) to synthesize
the two voices, inspect the pacing report, render the film, and validate media.
The previous draft is retained locally under
`.artifacts/animation/before-script-revision/` for comparison. Generated audio,
video, caches, browser profiles, and validation output remain inside the repo
and are ignored by Git.


## October 23 evidence-led iteration

The opening shows a real single-request Grafana stat: 306 ms, without revealing
a culprit. The connected trace has its own scene. An observed-path build uses
the same request’s actual Cart branch and server durations. The selection scene
uses the native waterfall and highlights 151.8 ms before Checkout’s first
outbound call; long inclusive parent bars do not select the service.

Installation narration accompanies recorded terminal execution for OBI, direct
Java setup and the custom operator. Readiness waits are cut with visible cards;
commands and results play at their native pace. Trace IDs, parent-link checks
and staged-error disclaimers were removed from delivery. Such checks remain
preparation work. The direct method span is explicitly configured, and the
fresh request supplies genuine Hibernate/JDBC observations.

OpenTelemetry’s [zero-code overview](https://opentelemetry.io/docs/zero-code/)
and [Java agent documentation](https://opentelemetry.io/docs/zero-code/java/agent/)
confirm the preferred terminology. “Zero code” describes instrumentation;
it does not remove deployment configuration or runtime compatibility work.

Each actual screenshot or recording should have one job that matches its spoken
line. The same rule applies through enrollment, Catalog detail, savings and
lifecycle sections. Natural voice pace and useful inspection pauses determine
the review film duration; the live presentation has a separate operating budget.


## Namespace selection as the payoff

The next iteration separates upstream language-specific opt-in from the merged
custom controller/Injector. The comparison credits upstream namespace annotations
([official documentation](https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/)).
The custom demo's value is one namespace choice coupled to runtime selection and
managed rollout, rather than claiming namespace opt-in was previously impossible.

Show the exact applied rule, run its real patch, show actual workload readiness,
then light the topology from the resulting captured coverage. Follow with fresh
Catalog spans. Explain fewer per-team configuration/review/release changes and
default selection for new compatible workloads. Preserve separate shared defaults
and exclusions in preparation. Do not suggest restarts, compatibility work or
central ownership costs disappear. A future standalone repository is not a
current release or an audience download link.


## October 27 timeout, collaboration and actual-trace iteration

The current opening starts “Welcome everyone” and introduces Tyler Yahn and
Nikola Grcevski by full name, with natural handoffs. It supersedes the authored
intro holds described in earlier iterations. The new fault is a real missing
legacy-backend connection with a 150 ms timeout, followed by a successful
PostgreSQL fallback. OBI sees CONNECT; Java detail names the caller and error.
The old no-I/O gap narrative is retired for this version.

After deploying the fix, show the authentic waterfall first, then the matched
request-duration aggregate. Literal code excerpts and actual exported spans
replace abstract payoff timing graphics. The narration explains collaborating
with the owning team through a PR carrying customer impact, trace and fix.

The standalone project now exists: [RIO](https://github.com/otelx/rio). Its
README identifies an independent OTelX controller using upstream components,
not a distribution of the upstream Operator. The recorded demo uses its bundled
precursor. Upstream language annotations are shown for context, with namespace
opt-in acknowledged. A new cost ledger compares distributed instrumentation
ownership with central setup and twelve monthly updates, without an
unsubstantiated investigation-time or telemetry-bill credit.
