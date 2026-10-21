# OpenTelemetry Far and Wide presentation storyboard

The [interactive visual storyboard](../public/storyboard.html)
is the primary review surface and editable source. This companion keeps the scene plan and production requirements
available alongside the Slidev source.

The narrative follows one investigation: find the slow service, explain the local
work, then operate and evaluate the instrumentation profile. The demo is not
assumed complete. Every proposed demonstration and measurement is a requirement
for the next phase, and may require implementation changes.

## Audience promise

Attendees should leave able to choose a useful instrumentation profile and plan
how to manage and verify it. The central idea is to start with coverage, add
detail for an unanswered question, and retain that detail deliberately.

## Timing and presenter roles

Plan 21 minutes of content, one unallocated minute from 21:00 to 22:00, and
three minutes of Q&A from 22:00 to 25:00. If recovery time is unused, begin
questions early. Timing includes pauses and handoffs and remains a rehearsal
target. The proposed narration blocks give each presenter 10½ minutes.

| Scene | Time | Lead | Message |
| --- | --- | --- | --- |
| 01 | 0:00–0:15 | Tyler | OpenTelemetry Far and Wide |
| 02 | 0:15–1:15 | Tyler | You found the slow service. What happens inside it? |
| 03 | 1:15–2:00 | Tyler | Start with coverage. Add detail where needed. |
| 04 | 2:00–3:30 | Tyler · Nikola controls playback | One deployment workflow reveals the request path |
| 05 | 3:30–4:30 | Tyler | The service is visible. The local work is unnamed. |
| 06 | 4:30–6:30 | Nikola narrates · Tyler operates | Add a method span to explain the local time |
| 07 | 6:30–7:30 | Nikola | The same slow work now has a name |
| 08 | 7:30–9:30 | Nikola | A shared workflow manages both instrumentation paths |
| 09 | 9:30–10:45 | Nikola | An upgrade needs evidence from the running workload |
| 10 | 10:45–12:00 | Nikola | Remove selected detail while retaining the baseline |
| 11 | 12:00–14:30 | Tyler | Measure the profile, then decide what to retain |
| 12 | 14:30–16:30 | Tyler | A ready pod does not prove a correct trace |
| 13 | 16:30–18:30 | Nikola | Try one service, one question, and a rollback |
| 14 | 18:30–19:30 | Nikola | Which question actually needs more depth? |
| 15 | 19:30–21:00 | Tyler | Pick one service. Name one unanswered question. |

Tyler leads scenes 1–5, 11–12, and 15. Nikola leads scenes 6–10 and 13–14.
Tyler operates the main live depth change while Nikola narrates. Other lifecycle
checkpoints use planned playback and observed evidence rather than another live
rollout. Assignments can be exchanged during rehearsal without changing the story.

## Scenes

### Scene 01 The promise

**On screen:** OpenTelemetry Far and Wide

**Audience question:** What will this session help me do?

**Takeaway:** Get broad visibility first, then add the detail a specific investigation needs.

**Medium:** Opening

**Visual:** Static frame. Show the title, presenters, and promise together.

**Delivery:** Introduce both presenters in one sentence. Say the promise aloud: we will locate the slow service, explain its local work, and manage the instrumentation from one place.

**Transition:** Imagine you own the platform, but you do not own every application.

**Requirement:** Static opening; no reveal. The following investigation is a planned demonstration, not a customer incident.

### Scene 02 A question the audience recognizes

**On screen:** You found the slow service. What happens inside it?

**Audience question:** How do I investigate when different teams own the services?

**Takeaway:** The useful outcome is an explanation of the request without first rebuilding every application.

**Medium:** Staged scenario

**Visual:** Static frame. Show the platform constraint and investigation question together.

**Delivery:** Use a small staged checkout workload with an intentional delay. Establish the operational constraint: several languages and service owners. Tell the audience early that breadth and selected depth can share a platform workflow. Do not invent customer harm or imply that the defect will be fixed by instrumentation.

**Transition:** First get the request path. Then add detail only where that view leaves a question.

**Requirement:** D1 · Build a repeatable slow request. The opening can use a cropped preview of the planned baseline trace; it does not establish a completed demo.

### Scene 03 The mental model

**On screen:** Start with coverage. Add detail where needed.

**Audience question:** What does each instrumentation layer contribute?

**Takeaway:** Broad request visibility and selected runtime detail are complementary views.

**Medium:** Explanatory visual

**Visual sequence:** Follow the request across services → Open checkout to locate detail within that request.

**Delivery:** Define a trace as one linked request and spans as timed operations. Introduce OpenTelemetry eBPF Instrumentation and SDK auto-injection using the two views on screen. The magnified interior must show where detail fits rather than merely label a box depth. Do not imply that eBPF is limited to network telemetry or that SDKs cannot provide broad coverage.

**Transition:** Let’s establish the broad view first.

**Requirement:** Conceptual model. Replace example geometry with actual traces later; verify support for the final workload.

### Scene 04 Establish breadth

**On screen:** One deployment workflow reveals the request path

**Audience question:** Can a platform establish a useful baseline across this workload?

**Takeaway:** Show the coverage that arrived, not just a successful install command.

**Medium:** Planned short clip + evidence

**Visual sequence:** Show the central deployment action → Inspect the resulting correlated request.

**Delivery:** Use a short, captioned recording of the real deployment action, then freeze on its resulting trace. Explain prepared prerequisites. If waiting is edited out, show the actual elapsed time. Do not make a second live installation a prerequisite for the main reveal.

**Transition:** The request is connected. Most of its local time is in checkout; what is that work?

**Requirement:** D2 · Build the deployment path and resulting telemetry. Planned clip length is an editorial target, not a claim about installation speed.

### Scene 05 Create the need for depth

**On screen:** The service is visible. The local work is unnamed.

**Audience question:** What is the baseline trace still unable to name?

**Takeaway:** A specific gap in the evidence justifies the next instrumentation change.

**Medium:** Trace interpretation + prediction

**Visual:** Static frame. Inspect the baseline trace and ask which local observation is missing.

**Delivery:** Read the service timing and downstream call with the audience. Explain inclusive versus nested time only as needed. Pause for five seconds after asking what they would want to see inside checkout, then name the target: a local application operation. Keep the trace and question visible throughout; give the answer aloud without a slide build.

**Transition:** Nikola, can we expose that operation without changing the application image?

**Requirement:** D2 · Build a baseline trace supporting this exact question. Preserve actual parent relationships and time scale in the final asset.

**Audience pause:** Five seconds of silent prediction, then name the target observation aloud: a local application operation. Keep the same trace on screen.

### Scene 06 The main live reveal

**On screen:** Add a method span to explain the local time

**Audience question:** Can selected runtime detail answer the unresolved question?

**Takeaway:** A centrally selected profile exposes the application work inside the request.

**Medium:** One planned live operation

**Visual sequence:** Keep the baseline visible while changing the profile → Inspect the new request and its named method span.

**Delivery:** Tyler operates the one main live profile change while Nikola keeps the audience oriented. Show a fresh request after convergence, keep the surrounding trace visible, and hold the method span for at least five seconds. Reserve the last part of the two-minute slot for interpretation. If the target is not visible by 60 seconds after starting the operation, switch to a verified recording of the same sequence. Keep the baseline request on screen during the action; move directly to the new request with its method span, without an intermediate status-only slide.

**Transition:** Let’s compare what we knew before with what we know now.

**Requirement:** D3 · Build selective injection, a linked method span, continued baseline signals, and unchanged application identity. Prepare the fallback; no operation is assumed complete.

### Scene 07 Resolve the opening question

**On screen:** The same slow work now has a name

**Audience question:** What conclusion became possible?

**Takeaway:** Selected detail names the work without implying that the request became faster.

**Medium:** Aligned before and after comparison

**Visual:** Static frame. Show both requests together on a common time scale.

**Delivery:** Keep two separate requests visible together, with matching framing and a common time scale. Point to the newly named pricing calculation. Explain that the work was already happening: observability improved; application performance was not repaired. Display the complete pair from the start so attendees can compare without waiting for an animation.

**Transition:** The diagnostic result is useful. How does a platform own the two instrumentation layers?

**Requirement:** D3 · Capture measured baseline and depth traces and verify correlation. PricingEngine.calculate remains the proposed illustrative method.

### Scene 08 The operating model

**On screen:** A shared workflow manages both instrumentation paths

**Audience question:** What makes the combined approach manageable?

**Takeaway:** The proposed Operator integration should manage OBI configuration and SDK injection through a shared workflow.

**Medium:** One architecture diagram

**Visual sequence:** Follow the OBI configuration and SDK injection paths → Add telemetry flow and the trace ownership rule.

**Delivery:** Separate deployment control from telemetry flow. Draw OBI configuration and language-agent injection as parallel paths, not a chain from OBI into the SDK. Explain which layer owns checkout request spans for each profile and which baseline metrics remain. Identify custom or experimental integration. Details that do not explain a consequence belong in backup material. Name the selected implementation and distinguish existing components from proposed coordination; do not imply a unified policy API has been established. Start with both control branches visible. Add the telemetry route and ownership rule together only after explaining control; retain both branches for reference.

**Transition:** The shared workflow also needs to manage instrumentation versions.

**Requirement:** D4 · Choose or build the final implementation, then make this diagram match it. The two paths and ownership rules are requirements, not an upstream feature claim.

### Scene 09 Central upgrade checkpoint

**On screen:** An upgrade needs evidence from the running workload

**Audience question:** Can I upgrade instrumentation without rebuilding the app?

**Takeaway:** The requested profile and the observed running version must agree.

**Medium:** Planned clip + verification frame

**Visual:** Static evidence frame. Keep requested and running versions visible before and after the upgrade.

**Delivery:** Use a short verified upgrade recording and an evidence frame showing old/new agent and bundled SDK versions, workload convergence, and unchanged application image identity. State any restart or rollout. The profile edit is the instruction; the telemetry and workload observations prove the result. Let the recording show the operation; hold one complete before-and-after evidence frame with requested and running versions together. Do not add a separate slide build for the version labels.

**Transition:** The same lifecycle should let us remove depth after the investigation.

**Requirement:** D5 · Build a real upgrade and exercise rollback. Placeholder version labels are not verified versions; playback is planned, not already recorded.

### Scene 10 Return to breadth

**On screen:** Remove selected detail while retaining the baseline

**Audience question:** Can the profile follow the investigation in both directions?

**Takeaway:** Temporary depth can end without discarding the useful baseline.

**Medium:** Planned short clip + trace pair

**Visual sequence:** Request breadth while retaining the depth request for comparison → Inspect the fresh baseline request after convergence.

**Delivery:** Show a brief verified removal recording and a fresh request after convergence. Keep the comparison on screen. Explain that the pricing work remains, while the selected method span is no longer emitted. Describe any required workload replacement without turning waiting into the show.

**Transition:** Tyler, which costs should determine how much detail we retain?

**Requirement:** D3 + D4 · Build removal and verify retained coverage. The target trace is a schematic until that evidence exists.

### Scene 11 The cost decision

**On screen:** Measure the profile, then decide what to retain

**Audience question:** Is the diagnostic value worth the measured cost?

**Takeaway:** The cost claim must identify both the layer being measured and its unit.

**Medium:** Measurement comparison to produce

**Visual:** Static frame. Show both cost comparisons, all three profiles, and measurement conditions together.

**Delivery:** Use at most two evidence-backed comparisons: OTLP bytes per completed request, and application CPU at matched completed-request throughput. Keep breadth, selected depth, and restored breadth together. State measurement location, load, sampling, warm-up treatment, repeated trials, and variation in notes and a concise caption. A small or inconclusive difference remains useful evidence. Do not infer a bill or CPU saving from span count. Display both comparisons and their measurement conditions from the start; guide attention by pointing rather than hiding a chart or its caption.

**Transition:** Cost is only one side of the decision. Can we still trust the request view during a change?

**Requirement:** D6 · Produce repeated, comparable measurements. These are empty chart locations, not fabricated data or a predicted savings curve.

### Scene 12 The trust test

**On screen:** A ready pod does not prove a correct trace

**Audience question:** What must pass before I rely on a profile change?

**Takeaway:** Verify the telemetry, not only the application’s availability.

**Medium:** Verification sequence + scope

**Visual:** Static frame. Show the complete verification gate before promotion and retirement.

**Delivery:** Make the specialist lesson concrete: a 200 response alone cannot establish the correct trace parent chain or owner. Explain the chosen mechanism’s promotion, retirement, and recovery boundaries. State the final demo’s supported conditions plainly. Use one counterexample only when it makes this check easier to understand. Keep the entire candidate, verification, promotion, and retirement flow visible. Place the required telemetry checks at the verification gate, before the promotion arrow.

**Transition:** Nikola, what is the smallest useful trial an attendee can run?

**Requirement:** D4 + D6 · Validate the final mechanism and its scope. Existing prototype failures inform development but do not define a required story subplot.

### Scene 13 A practical adoption experiment

**On screen:** Try one service, one question, and a rollback

**Audience question:** What can I try after this session?

**Takeaway:** A bounded experiment can test fit before a fleet-wide adoption decision.

**Medium:** Practical decision sequence

**Visual:** Static frame. Show the full experiment from question to retention or rollback.

**Delivery:** Give an operationally useful first step: establish baseline telemetry, name the unresolved question, select meaningful detail, compare a new request, and roll back or retain. A newcomer gets the model; an operator gets the profile/rollout sequence; a specialist gets verification criteria. Explain that selecting a method still needs application knowledge. Keep the complete experiment visible as a usable checklist; do not replace an earlier step with a later one.

**Transition:** Let’s see whether that decision rule works for a different question.

**Requirement:** Companion material · Prepare prerequisites, supported scope, pinned versions, expected observations, and rollback. Verify the published link before displaying it.

### Scene 14 Audience transfer check

**On screen:** Which question actually needs more depth?

**Audience question:** Would I add instrumentation before examining the signals I already have?

**Takeaway:** Use existing coverage first; add selected depth when the question still needs it.

**Medium:** Prediction → answer → contrast

**Visual sequence:** Ask the audience to choose a first observation → Explain the answer alongside the contrasting local-work question.

**Delivery:** Give five quiet seconds to choose the first observation for which service is returning errors. Reveal the answer: inspect the existing request signals first. Then contrast a question about work inside a pricing calculation. State that these are hypothetical questions, not new measured incidents. Use one reveal after the pause: keep the original question and options visible, identify A, and show the local-work contrast alongside the explanation.

**Transition:** The instrumentation profile follows the question we need to answer.

**Requirement:** No new claimed result. The prompt and answer should be understandable without learning another application.

**Audience pause:** Five-second quiet prediction; reveal an explicit answer and explain the contrast within the minute.

### Scene 15 Close with a usable next step

**On screen:** Pick one service. Name one unanswered question.

**Audience question:** What should I remember and do next?

**Takeaway:** Start broad. Add depth with purpose. Manage and verify the profile.

**Medium:** Closing frame retained for Q&A

**Visual:** Static frame. Keep the takeaway, next action, and companion destination visible together.

**Delivery:** Recall the opening question and point to the named local work. Ask attendees to choose one service and write the question that would justify more detail. Provide a readable companion link after it is verified. Thank the audience and invite questions. This closes by minute 21; the next minute is unallocated recovery time, not extra planned content. Use one static closing frame, with the next action and companion destination visible from its first appearance and throughout Q&A.

**Transition:** Start with coverage. Let the next unanswered question determine the detail you add.

**Requirement:** Verify the companion destination. Planned content ends at 21:00; keep 21:00–22:00 flexible and 22:00–25:00 for Q&A.

## Production requirements for the next phase

- **D1:** Build the repeatable slow request in the selected workload.
- **D2:** Demonstrate central baseline deployment and correlated request coverage.
- **D3:** Add and remove selected method detail, retaining baseline signals and
  application identity, then capture comparable fresh requests.
- **D4:** Select or build the shared deployment mechanism, ownership rules, transition
  checks, and recovery path. Match the final diagram to the implementation.
- **D5:** Perform a real central instrumentation upgrade, verify running agent
  and SDK versions, and exercise rollback.
- **D6:** Produce repeated comparable cost measurements with named units, load
  conditions, measurement location, and variability.

Prepare captioned recordings of deployment, upgrade, and removal and a verified
fallback for the main live depth change. At 60 seconds after starting that live
operation, switch to the fallback if the target observation has not arrived.
The cutoff is a proposed rehearsal rule, not a measured operation duration.

Keep all trace geometry schematic until real evidence replaces it. A recording
can preserve an authentic observation; it cannot supply functionality that does
not work. Do not fabricate cost results or imply an observed profile change
without verifying it.

## Rehearsal checks

- Can a newcomer explain the two views before the architecture discussion?
- Does the main method reveal leave time to inspect and interpret the result?
- Can a practitioner explain the version check and rollback implication?
- Does a specialist agree that each conclusion stays within its evidence?
- Can both presenters finish by minute 21 with the real playback and live action?
- Can the explanation survive an unavailable live environment without losing the
  diagnostic payoff or the audience’s next step?

Keep full manifests, compatibility matrices, cost methodology, and extended
failure analysis in companion material or backup slides. Put final delivery
notes beside the relevant slides in `slides.md`.
