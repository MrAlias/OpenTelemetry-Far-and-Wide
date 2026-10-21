# Presentation research for OpenTelemetry Far and Wide

Research checked on October 19, 2026. This guide applies presentation research
and experienced speakers' advice to Tyler Yahn and Nikola Grcevski's
25-minute Observability Day session. The current plan reserves **21 minutes of
content, one minute of recovery time, and three minutes of Q&A**, as detailed in
the [storyboard](talk-storyboard.md). This allocation is our planning choice,
not a confirmed organizer requirement.

The central recommendation is to build the talk around a diagnostic question:
**We can see that checkout is slow. What additional instrumentation will let
us explain why?** Broad coverage, selective depth, and controlled removal then
become successive answers to a problem the audience already understands.

An exceptional audience experience is the ambition. No presentation method can
guarantee a 10/10 rating from every attendee. We can make the talk relevant,
understandable, technically credible, memorable, and useful, then test those
qualities with representative listeners before the event.

## What the evidence supports

The sources include five books through publisher previews, author explanations,
and an authorized chapter extract; five journal papers; a research handbook
chapter; and guidance from TED, CNCF, and W3C. The book recommendations below do
not imply that their complete paid texts were read.

| Source | Finding or contribution | What it can support here |
| --- | --- | --- |
| Richard E. Mayer, *Multimedia Learning*, third edition | Synthesizes experimental research on learning from words and graphics. | A research foundation for explanatory slides; not a formula for conference ratings. |
| Fiorella and Mayer, handbook chapter, 2021 | Describes coherence, signaling, redundancy, and spatial and temporal contiguity. | Remove distractions, direct attention, and put explanations beside the evidence they describe. |
| Garner and Alley, 2013, *International Journal of Engineering Education* | In 110 engineering students, assertion–evidence slides improved essay comprehension and delayed understanding; not every immediate test measure improved. | A useful default for technical explanation. The experiment changed a bundle of design features, so it does not isolate sentence titles as the sole cause. |
| Kosslyn and colleagues, 2012, *Frontiers in Psychology* | Documents common presentation flaws and viewers' difficulty recognizing some of them. | Review readability and information load explicitly. This was not a trial establishing an optimal presentation recipe. |
| Szpunar, Khan, and Schacter, 2013, *PNAS* | Two experiments with 80 students found benefits from tests between segments of a recorded lecture. | Consider brief opportunities to retrieve an idea, with caution when adapting classroom results to conferences. |
| Welhaf and colleagues, 2022, *Cognitive Research* | In 195 undergraduates, interpolated tests produced a smaller attention effect and no statistically supported learning benefit. | Keep interaction purposeful and modest; do not promise a large or universal benefit. |
| Bradbury, 2016, *Advances in Physiology Education* | Reviews the weak basis for a universal short attention limit during lectures. | Do not prescribe a gimmick every ten minutes on the premise that attention always expires then. |
| Duarte, Reynolds, Alley, Berkun, TED, and CNCF speakers | Offer practical methods for narrative, visual clarity, delivery, and preparation. | Useful craft guidance, distinct from controlled experimental evidence. |
| W3C and CNCF accessibility guidance | Describes how to make projected material, speech, demonstrations, and questions accessible. | Include the audience members who cannot rely on small text, color, audio, or rapid interaction alone. |

Sources: [Mayer][mayer], [Fiorella and Mayer][multimedia-principles],
[Garner and Alley][ae-paper], [Kosslyn et al.][kosslyn],
[Szpunar et al.][szpunar], [Welhaf et al.][welhaf],
[Bradbury][bradbury], [W3C][w3c], and [CNCF accessibility][cncf-accessibility].

## Structure the talk around an audience outcome

### Give the audience one idea they can use

Duarte emphasizes a central idea shaped by the audience's needs and stakes;
TED's guide similarly asks for a clear idea supported by evidence and practical
implications. A topic such as OpenTelemetry is too broad to make editorial
decisions. A useful claim tells us what belongs in the talk.
[Duarte's writing guide][duarte-writing]; [TEDx Speaker Guide][ted].

Proposed audience outcome:

> Attendees can explain when broad eBPF instrumentation is enough, when to add
> selected runtime detail, and what to verify when changing instrumentation.

Proposed memorable takeaway:

> Start with broad coverage. Add depth to answer a specific question. Verify
> the transition and remove detail when its value no longer justifies its cost.

These are proposed messages for this talk, not experimentally validated slogans.
Keep the title **OpenTelemetry Far and Wide** and let the opening explain the
practical meaning of breadth and depth.

### Start with a recognizable problem and reveal the answer early

Use the existing demo workload to establish the stakes: a slow checkout request,
a visible service boundary, and an unanswered question inside that service.
Introduce the complementary instrumentation idea early, then create curiosity
about whether the evidence will support it. Avoid hiding the thesis until a
late reveal.

Suggested opening, to adapt into the presenters' natural voices:

> In this demo, checkout is slow. We can follow the request across the services
> and see where the time is spent. But that still leaves a question: what is
> happening inside checkout?
>
> We could add instrumentation across the whole estate. For this investigation,
> we need more detail in one place. We'll show how to add it centrally, what
> changes in the trace, and what we have to verify before trusting the result.

Show the evidence while making this introduction. Identify it as a demonstration
with an intentional delay; do not imply that it is a customer incident.

### Make each section create the need for the next

Duarte's contrast framework alternates a current difficulty with a possible
improvement. It is a practitioner model for persuasion, not proof that every
effective talk follows one structure. Here, use it to organize genuine
engineering questions. [Duarte on contrast][duarte-contrast].

The proposed progression is:

1. **What is slow?** Broad request telemetry locates the service.
2. **What happens inside it?** Selected Java instrumentation supplies method detail.
3. **How do the layers cooperate?** Explain trace ownership and the central control path.
4. **Can we change the profile safely?** Show the checks and the remaining limits.
5. **What do we keep enabled?** Explain selective depth, removal, upgrades, and the cost evidence needed.
6. **What should attendees try?** Offer a bounded, reproducible experiment.

Keep one workload throughout. Reintroducing a new example for each technology
would consume time and force listeners to rebuild the context.

### Serve different experience levels through the same example

The [talk brief](talk-brief.md) targets platform and observability practitioners.
Use these three listener profiles as planning hypotheses:

| Listener | Value they should receive | How to provide it |
| --- | --- | --- |
| New to eBPF or auto-injection | A usable distinction between request coverage and internal runtime detail. | Define those terms using the same trace before showing configuration. |
| Already operates OpenTelemetry | An actionable way to select and change instrumentation profiles. | Show the control, the workload rollout, and the resulting telemetry. |
| Instrumentation specialist | Evidence, boundaries, and an interesting unresolved problem. | Explain ownership, verification, and one concrete compatibility limitation. |

Give a short plain-language explanation before the implementation detail.
Keep the detail needed to justify trust in the main talk; put extended manifests,
kernel mechanisms, and the full failure matrix in companion material.

## Design material that makes the reasoning visible

### Give explanatory slides a claim and supporting evidence

The assertion–evidence approach pairs a concise sentence stating the message
with an explanatory visual. Its author tutorial recommends developing the
messages before formatting slides and keeping secondary details in notes.
[Assertion–evidence tutorial][ae-tutorial].

Proposed examples for this deck:

| Topic label to develop | More useful slide message | Evidence to show |
| --- | --- | --- |
| eBPF instrumentation | Broad tracing locates the slow service | A legible request trace across the demo services. |
| SDK instrumentation | A method span exposes the local delay | A comparable trace with `PricingEngine.calculate` highlighted. |
| Coexistence | Each request needs a clear trace owner | A small diagram distinguishing SDK traces from retained OBI metrics. |
| Reliability | Healthy requests can still have broken traces | One preserved counterexample with the incorrect relationship annotated. |
| Cost controls | Instrumentation depth can be temporary | The selected profile before and after removal; any measured output change labeled by layer. |

Use questions for genuine prediction moments and short labels for navigation
where appropriate. A sentence title is a useful default, not a requirement to
force every slide into the same format.

### Reduce the work needed to follow a visual

Fiorella and Mayer's principles suggest eliminating irrelevant content,
highlighting essential relationships, placing related labels together, and
coordinating the visual with its explanation. The redundancy principle argues
against duplicating a long spoken explanation as projected prose; it should
not be treated as a reason to remove captions or necessary labels.
[Handbook chapter][multimedia-principles].

For this deck, crop telemetry views to the relevant spans, retain their time
scale, and keep service positions consistent. Highlight the new method span
when discussing depth. Show the ownership diagram in stages if revealing all
components at once makes the sequence difficult to follow. Preserve visible
units and qualifiers on any result.

### Separate the projected explanation from the reference material

Reynolds advocates restraint, visual simplicity, and natural delivery rather
than densely written slides that double as documents.
[Presentation Zen author explanation][reynolds].

The projected deck should carry the question, model, evidence, and conclusion.
Speaker notes should carry transitions and delivery cues. The repository should
carry exact versions, setup commands, full evidence, and reproduction steps.
Make the repository link available in readable text as well as a QR code.

### Make readability and accessibility part of the design

W3C recommends readable projected material, sufficient contrast, simple language,
clear speech, descriptions of meaningful visual information, and time to
process. CNCF additionally recommends accessible slide access, captioned demos,
and repeating audience questions into the microphone.
[W3C presentation guidance][w3c]; [CNCF conference guidance][cncf-accessibility].

For this talk, test the actual trace screenshots and terminal views at a
distance. Explain what changed aloud: “The Java method span is now visible
inside checkout.” Pair color with labels or another cue. Caption the fallback
recording and make participation optional. Share technical terms with the
captioning team when that workflow is available.

## Build engagement around the engineering question

### Use short opportunities to think

The retrieval studies motivate trying a brief recall question, while their
different results argue against promising a guaranteed improvement.
[Original study][szpunar]; [larger follow-up][welhaf].

Proposed interactions:

- Before revealing internal detail: “What can this trace already tell us, and
  what can it not tell us?”
- After explaining ownership: “If both layers emit this server span, what
  would we need to check?”
- At the close: “For the next service you investigate, what question would
  justify adding depth?”

Allow a few quiet seconds and supply an answer. A thoughtful pause can work
without a show of hands, internet access, or an attendee speaking publicly.
Treat these as design choices to test in rehearsal, not a classroom experiment
reproduced on stage.

### Use relevance and contrast to create excitement

The exciting moment in this talk can be small and concrete: the audience sees
a previously invisible method explain the service's local delay. Establish
what is missing before adding the detail, then pause long enough for listeners
to inspect it.

Arsh Sharma's CNCF-hosted account recommends focusing demos on the moment that
connects to the audience's problem and putting detailed setup in a README.
This is directly relevant experience from technical conferences, rather than
experimental evidence. [CNCF conference-speaking article][cncf-speaking].

Use humor that arises naturally from shared engineering experience. Keep an
analogy only if it makes a concept easier to explain, and state its boundary.
The literal trace comparison should do most of the explanatory work here.

### Avoid arbitrary attention rules

Bradbury's review challenges claims of a universal eight-second or ten-minute
attention span. Change activity when the reasoning benefits: an unresolved
question, a comparison, a demonstration, or a recap.
[Bradbury's review][bradbury].

Treat rules such as a fixed slide count, six bullets per slide, or a visual
change every fixed number of seconds as optional constraints. For this talk,
select the slides by what the audience needs to understand, then validate the
pace aloud.

## Proposed sequence for the 25 minute slot

The detailed [presentation storyboard](talk-storyboard.md) is the current plan
for the 15 projected scenes, presenter roles, and demo requirements. Timing
includes speaker transitions and audience pauses.

| Elapsed time | Narrative job | Likely material |
| --- | --- | --- |
| 0:00–2:00 | Establish the slow-checkout question and breadth/depth model. | Brief introduction, platform constraint, and one three-service example. |
| 2:00–4:30 | Establish coverage and the question it cannot answer. | Planned baseline playback followed by a prediction about the unnamed local work. |
| 4:30–7:30 | Reveal selected depth and interpret the result. | One live profile change, then a comparison of two requests with matching framing. |
| 7:30–12:00 | Explain control, upgrade, and removal. | Parallel instrumentation paths under a shared workflow; verified playback for lifecycle checkpoints. |
| 12:00–16:30 | Make the cost decision and establish trust. | Measured profile comparisons when available, correctness gates, and limitations. |
| 16:30–19:30 | Help attendees transfer the idea to their work. | One-service adoption checklist and a prediction question with an explicit answer. |
| 19:30–21:00 | Resolve the opening question and leave a next step. | Named local work, central takeaway, and a verified companion destination. |
| 21:00–22:00 | Allow recovery time. | No additional planned content; begin questions early if unused. |
| 22:00–25:00 | Take questions. | Keep the useful closing slide visible; use backup material as needed. |

Plan one main live operation in scene 6. If its result is not visible within
60 seconds of starting the operation, switch to a verified recording of that
sequence. Validate this cutoff against measured rollout and drain times in
rehearsal. Use recorded evidence for the other lifecycle checkpoints and
label playback clearly.

If the session runs short on time, compress explanation of the full failure
matrix and move configuration detail to backup slides. Preserve the central
trace comparison, the relevant limitations, and the conclusion. Address the
published upgrade and cost promises explicitly, even if a result must be
described as proposed rather than demonstrated.

## Demonstrate observable outcomes and preserve trust

### Give the demo a clear sequence

For each action, use this pattern: **question → expected observation → action
→ observed evidence → implication**.

1. Show the existing broad request view and identify the unexplained local time.
2. Tell the audience exactly which new detail to look for.
3. Change the selected checkout instrumentation profile.
4. Show a new comparable request with the method span. Compare equivalent
   observations; do not imply that an old trace acquired spans retrospectively.
5. State what this reveals and what it still does not establish.
6. Return to breadth and show the evidence appropriate to that state.

Assign one presenter to narration and the other to the controls during the demo.
The narrator keeps the audience oriented while the operator verifies the
result. Assign those roles by preference and experience; rehearse the handoff.

Prepare a local recording and static annotated evidence of the same sequence.
Label recorded material when switching to it. Choose a recovery cutoff during
rehearsal so debugging the stage environment does not consume the explanation.
These are proposed operating practices for this session.

### Keep the talk's claims within the recorded evidence

The existing [reliability report](reliability-results.md) provides the following
boundaries. They should shape the audience-facing claim as well as the notes:

- **Passing case:** 1,086/1,086 measured requests in the final serial-load
  rehearsal using synchronous `HttpURLConnection`, across the documented
  transitions. This is a bounded demo result, not a production reliability estimate.
- **Remaining failures:** concurrent trials and the original `HttpClient`
  fixture failed trace-correctness checks. Successful HTTP responses alone
  did not establish correct telemetry.
- **Deployment behavior:** adding, removing, or changing the Java agent uses
  replacement pods. “Dynamic” must not imply instantaneous mutation of the
  running JVM.
- **Implementation status:** the reliable control path is a custom integration
  around released components. Distinguish its behavior from an upstream feature
  available to every Operator user.

The [technical findings](technical-findings.md#what-cost-evidence-would-justify-the-promise)
also distinguish telemetry production, transport, runtime resources, and backend
billing. Reduced span output alone cannot establish lower application CPU or
a particular bill. A centrally managed SDK upgrade needs observed version
evidence and workload convergence, not only a configuration edit.

The diagnostic scene shows an intentionally delayed method. Instrumenting it
explains the delay; it does not fix the application or establish a production
root cause. End the demonstration on improved knowledge and control.

## Deliver and rehearse the complete experience

### Practice the explanation aloud

Berkun's authorized book extract describes rehearsal as a way to discover and
fix problems before the audience encounters them. His emphasis is comfort with
the material rather than reproducing a memorized script. TED's guide also
recommends timed practice with other people and realistic stage conditions.
[Berkun's chapter][berkun-extract]; [TEDx Speaker Guide][ted].

For this session, know the opening, closing, key transitions, and demo recovery
line especially well. Vary pace with the material: move briskly through familiar
context, then slow down for trace interpretation. Pause after the new span
appears. Face the audience while explaining it.

### Make the two presenters one coherent explanation

Give each section a clear owner. At a handoff, state the unresolved question
the next presenter will answer, for example:

> We can now see the method. How do we know we haven't counted the request twice?

The next speaker should continue that reasoning without restarting the
introduction. Rehearse who speaks during rollout waits, who watches the clock,
who switches to the fallback, and who fields each category of question.

### Test what listeners actually understood

Use these as proposed rehearsal gates, not a validated scoring instrument:

| Rehearsal | What to check | What to change if it fails |
| --- | --- | --- |
| Listener unfamiliar with this implementation | Can they explain breadth versus depth and what the new span tells them? | Clarify the model and remove unexplained terms. |
| Practicing platform engineer | Can they describe an initial bounded trial and its rollout implications? | Make the operational sequence and next step more concrete. |
| Instrumentation specialist | Which claim is broader than the supporting evidence? | Narrow the claim or add the necessary proof. |
| Both presenters with the real demo | Does the complete presentation land by minute 21, including pauses? | Cut secondary content or reduce live operations. |
| Failure rehearsal | Can they complete the explanation after a failed command or unavailable UI? | Improve fallback artifacts and the handoff. |
| Recording and distance check | Are terminal output, span labels, speech, captions, and the final link understandable? | Crop, enlarge, simplify, or describe missing information. |

After a rehearsal, ask listeners to state the main idea without looking at the
slides, explain what changed in the demo, name a limitation, and describe what
they would try next. Then ask for a rating and the one change that would most
improve it. Use both comprehension and enjoyment to guide revision.

For Q&A, repeat the question into the microphone, answer the narrow question
first, and distinguish a measured result from an expectation. Keep backup
slides for compatibility, upgrades, cost methodology, and the full control path.
Return to the useful closing slide when finished.

## Books and sources to return to

### Books

- **Richard E. Mayer, *Multimedia Learning*, third edition, Cambridge, 2020.**
  Best foundation for why explanatory visuals work. Consulted the publisher
  overview; specific design principles above also use the accessible handbook
  chapter summary. [Publisher page][mayer].
- **Michael Alley, *The Craft of Scientific Presentations*, second edition,
  Springer, 2013.** Particularly relevant to engineering audiences, audience
  scope, preparation, and assertion–evidence slides. Consulted the publisher
  preview and contents, alongside the author's public tutorial and the research
  paper. [Publisher preview][alley-book].
- **Nancy Duarte, *Resonate*.** Useful for audience needs, stakes, and an arc
  involving problems and possibilities. Consulted the author's book overview
  and related public articles. [Book overview][resonate].
- **Garr Reynolds, *Presentation Zen*.** Useful for editing visual material and
  separating slides from reference documents. Consulted the author's public
  explanation and book listing. [Author explanation][reynolds];
  [book listing][reynolds-books].
- **Scott Berkun, *Confessions of a Public Speaker*.** Useful for practical
  delivery, preparation, and recovery. Consulted the author's book description
  and authorized chapter extract. [Book page][berkun-book];
  [chapter extract][berkun-extract].

For this project, begin with Alley's free tutorial and the short CNCF article,
then use Duarte for the story and Berkun for rehearsal. Mayer supplies the
research foundation when making design decisions; reading every book is not
a prerequisite to drafting the storyboard.

### Journal papers and research handbook

- **Garner, J. K., and Alley, M. P. (2013).** How the Design of Presentation
  Slides Affects Audience Comprehension: A Case for the Assertion–Evidence
  Approach. *International Journal of Engineering Education*, 29(6), 1564–1579.
  See methods and results as well as the abstract. [Full paper][ae-paper].
- **Kosslyn, S. M., Kievit, R. A., Russell, A. G., and Shephard, J. M. (2012).**
  PowerPoint Presentation Flaws and Failures: A Psychological Analysis.
  *Frontiers in Psychology*, 3:230. DOI: 10.3389/fpsyg.2012.00230.
  [Full paper][kosslyn].
- **Szpunar, K. K., Khan, N. Y., and Schacter, D. L. (2013).** Interpolated
  memory tests reduce mind wandering and improve learning of online lectures.
  *PNAS*, 110(16), 6313–6317. DOI: 10.1073/pnas.1221764110.
  [Full paper][szpunar].
- **Welhaf, M. S., Phillips, N. E., Smeekens, B. A., Miyake, A., and Kane,
  M. J. (2022).** Interpolated testing and content pretesting as interventions
  to reduce task-unrelated thoughts during a video lecture. *Cognitive Research:
  Principles and Implications*, 7:26. DOI: 10.1186/s41235-022-00372-y.
  [Full paper][welhaf].
- **Bradbury, N. A. (2016).** Attention span during lectures: 8 seconds,
  10 minutes, or more? *Advances in Physiology Education*, 40(4), 509–513.
  DOI: 10.1152/advan.00109.2016. [Journal article][bradbury].
- **Fiorella, L., and Mayer, R. E. (2021).** Principles for Reducing Extraneous
  Processing in Multimedia Learning. *The Cambridge Handbook of Multimedia
  Learning*, third edition, chapter 14, 185–198.
  DOI: 10.1017/9781108894333.019. Consulted the public chapter summary.
  [Chapter summary][multimedia-principles].

### Author guides and conference resources

- **Michael Alley, Assertion–Evidence tutorial.** A practical sequence for
  developing message-driven technical slides. [Current tutorial][ae-tutorial].
- **Kevin Friesen, Duarte (January 26, 2024).** Unlock success: How to write
  a great presentation. [Article][duarte-writing].
- **Phoebe Perelman, Duarte (August 9, 2024).** The ultimate guide to contrast:
  What your presentation is missing. [Article][duarte-contrast].
- **TEDx Speaker Guide.** Structure, factual support, slide simplicity, and
  realistic rehearsal. Its TED-specific duration is not a rule for this session.
  [Official guide][ted].
- **Arsh Sharma, CNCF (January 24, 2024).** Things I've learned about conference
  speaking. Experience-based advice on relevant stories and focused demos.
  [Article][cncf-speaking].
- **W3C Web Accessibility Initiative.** Making Events Accessible. Speaker
  guidance for preparation, projection, speech, participation, and Q&A.
  [Checklist][w3c].
- **CNCF Contributors.** Tips for deaf/hoh conference attendees, including a
  speaker section. [Conference guidance][cncf-accessibility].

[mayer]: https://www.cambridge.org/highereducation/books/multimedia-learning/FB7E79A165D24D47CEACEB4D2C426ECD
[multimedia-principles]: https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning/F29A19FCD34C542806F736E0661C05F5
[alley-book]: https://link.springer.com/book/10.1007/978-1-4419-8279-7
[ae-paper]: https://www.ijee.ie/articles/Vol29-6/23_ijee2791ns.pdf
[ae-tutorial]: https://www.craftscicom.org/ae_tutorial.html
[kosslyn]: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2012.00230/full
[szpunar]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/
[welhaf]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8964911/
[bradbury]: https://journals.physiology.org/doi/10.1152/advan.00109.2016
[resonate]: https://www.duarte.com/resources/books/resonate/
[duarte-writing]: https://www.duarte.com/blog/how-to-write-a-great-presentation/
[duarte-contrast]: https://www.duarte.com/blog/ultimate-guide-to-contrast/
[reynolds]: https://www.garrreynolds.com/
[reynolds-books]: https://presentationzen.com/books
[berkun-book]: https://scottberkun.com/the-books/confessions-of-a-public-speaker/
[berkun-extract]: https://scottberkun.com/speaking-fear/
[ted]: https://storage.ted.com/tedx/manuals/tedx_speaker_guide.pdf
[cncf-speaking]: https://www.cncf.io/blog/2024/01/24/things-ive-learned-about-conference-speaking/
[w3c]: https://www.w3.org/WAI/teach-advocate/accessible-presentations/
[cncf-accessibility]: https://contribute.cncf.io/projects/best-practices/accessibility/deaf-and-hard-of-hearing/tips-when-attending-or-speaking-at-a-conference/
