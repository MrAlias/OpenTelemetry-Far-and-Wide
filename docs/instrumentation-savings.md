# Where instrumentation automation can save work

The economic claim for this talk is that a shared, maintained instrumentation
workflow can reduce repeated work across services. The 18-service
scenario demonstrates the mechanism; it does not establish organization-wide
savings. No labor, dollar, latency-repair, or telemetry-bill result is measured yet.

The closing slides and video now include the explicitly hypothetical dollar
model below. It values engineering capacity under declared inputs; it does not
turn the demo into a benchmark or establish an average customer's savings.

Use three audience-facing frames: the work around a deployment, its recurrence
over the service lifecycle, and a transparent comparison. Keep this inventory in
speaker preparation rather than reading every row on stage.

## Savings inventory

These are hypotheses to test against the best practical direct setup, including
existing scripts, deployment templates, and namespace-level upstream injection.
An activity belongs in one effort category even when several benefits result.

| Area | Work the shared path may reduce | Evidence to collect | Cost or condition that remains |
|---|---|---|---|
| Initial investigation | Asking many teams to guess which service is slow; wrong-team handoffs | OBI request paths, identified slow set, investigation handoffs | Exercise relevant paths; interpret downstream waiting correctly |
| Ownership discovery | Finding the service owner and the person able to change its deployment | Contacts and active minutes before enrollment | Accountable owners and enrollment consent |
| Coordination | Repeated scoping meetings, status exchanges, scheduling and handoffs | Participant-minutes; number of handoffs | Shared design decisions and exceptions still need people |
| Access and approvals | Repeating access requests and reviews for routine per-service setup | Active review/request effort, approval count | Central permissions, security assessment and application constraints |
| Runtime expertise | Every owner learning agent selection, startup hooks and exporter configuration | Setup/training effort by runtime; documentation use | Platform compatibility expertise and supported-runtime boundaries |
| Configuration authoring | Rewriting agent startup settings, resource identity, export and propagation settings | Changed configuration, authoring and review effort | Correct shared defaults and necessary service-specific overrides |
| Application development | Changes solely needed to arrange automatic instrumentation | Actual source or packaging changes avoided | Business-specific custom instrumentation still needs application knowledge |
| Artifact and CI work | Repeated image edits, builds, tests and artifact publishing where injection avoids them | Build minutes, pipeline executions, artifacts and associated engineer effort | Do not claim avoided rebuilds for compile-time instrumentation or unsupported injection |
| Deployment coordination | Separate service deployment changes and release scheduling | Change count; active deployment work; schedule wait | Processes or pods may still restart; readiness and safe rollout |
| Verification | Repeating export, identity, propagation and request-health checks by hand | Check executions, active validation time, per-service coverage evidence | Reliable shared checks and investigation of genuine failures |
| Configuration drift | Divergent endpoints, resource names, versions and propagation settings | Drift incidents and remediation effort | Central configuration can be wrong; exceptions must be tracked |
| Rework | Missing exports, duplicate instrumentation, broken trace links and wrong versions caused by setup variation | Repeated attempts and attributable repair effort | Prove that standardization reduces these failures; do not assume it |
| New-service onboarding | Reopening the setup project for each eligible service | Effort and lead time for subsequent enrollments | Eligibility and scope checks remain |
| Agent upgrades and patches | Separate version decisions, changes, reviews and rollout arrangements | Upgrade effort and convergence over a defined period | Shared compatibility testing, staged rollout and security ownership |
| Disabling and rollback | Ad hoc removal instructions and repeated recovery setup | Recovery exercise effort, success and elapsed recovery | Tested exclusions, rollback and startup-agent behavior |
| Documentation and support | Repeating setup guides, answering recurring questions, repairing stale local instructions | Support contacts, maintenance and training effort | Maintain one accurate shared interface and exception guidance |
| Incident readiness | Arranging new detail while an investigation is already waiting | Time from visibility request to verified useful observations | Useful detail may still require custom spans; no automatic MTTR claim |
| Focus and opportunity | Interrupting service owners and abandoning feature work for routine setup | Interruptions, measured recovery effort, work capacity actually reassigned | Do not add an invented productivity multiplier to recorded person-time |
| Governance and audit | Reconstructing version, scope and enrollment evidence separately for each service | Audit preparation effort and completeness of actual centralized records | Reviewable records and authorization must exist; centralization alone does not establish compliance |
| Team resilience | Dependence on each owner's individual setup knowledge | Coverage of maintainers, support escalation and onboarding observations | Platform ownership can become a new dependency |
| Human experience | Frustration and recurring setup burden | Optional qualitative feedback, consistent survey before/after | Distinct from measured money or reclaimed engineering time |

The same reduction can have several consequences without creating several
independent savings. For example, a deployment template might remove a ticket,
one review and one repeated configuration edit. Count the actual work eliminated;
do not turn ticket count into additional hours after counting that ticket's work.

## Compare equivalent outcomes

Define the eligible fleet, exercised traffic, required observations, service
identity, trace-link correctness, request health, export destination and sampling
before comparing workflows. Include repeatability and recovery criteria. Use the
same prerequisites where they are genuinely shared; attribute different
prerequisite work to the workflow that needs it.

Use a declared period that includes initial setup and chosen lifecycle events:

- **Direct effort:** shared direct-path preparation and maintenance, plus actual
  per-service configuration, coordination, deployment, verification and rework.
- **Operator effort:** operator/injector adoption or development attributable to
  the comparison, shared setup, testing and ongoing maintenance, plus residual
  per-service enrollment, exceptions, verification and rework.
- **Net person-time saved:** direct effort minus operator effort over that period.
  It may be negative for a small fleet or a short horizon. Report it honestly.

Measure each service rather than multiplying the first attempt by thirteen.
Learning, existing templates, runtime differences, and parallel work change the
comparison. Distinguish the cost of building a prototype from adopting an
already maintained distribution, and state which comparison is being made.

Track **calendar lead time** separately: request for instrumentation to useful,
verified observations. Preserve queue and release waits. A shorter critical path
can matter even when total person-time changes little; parallel engineering work
does not translate directly into sequential calendar duration.

Measure meetings in participant-minutes, for example duration times attendance,
then place them in coordination effort. A demonstration stopwatch is elapsed
workflow time, not total organizational effort. Disclose recording cuts and use
identical timing boundaries. Do not slow down or break the direct setup to make
the operator look more valuable.

## Include the platform's bill

Shared automation requires ownership: implementation/adoption, infrastructure
prerequisites, permissions and security reviews, compatibility matrices,
configuration and version maintenance, testing, staged rollout, monitoring,
support, exceptions, failure investigation, rollback exercises and incident
response. Broader scope increases the potential blast radius. Centralizing work
can reduce its repetition while retaining these obligations.

If converting effort to money, disclose the rate, period and attribution.
Released capacity becomes cash savings only when actual expenditure falls; more
capacity for engineering work is a separate, useful outcome. Qualitative benefits
such as confidence and reduced frustration should remain qualitative without
supporting measurements.

Application CPU, memory, network/export volume, collector work, storage, backend
retention and telemetry charges are another cost layer. Adding language detail
can increase them. Record matched load and sampling and actual billing terms
before claiming resource or bill reductions. This story does not infer them from
fewer configuration steps.

## Source basis and application

Google's *Site Reliability Workbook*, [Eliminating Toil](https://sre.google/workbook/eliminating-toil/),
recommends comparing automation's development and maintenance investment with
work saved, choosing observable effort units and tracking them before and after.
It also discusses benefits such as fewer interruptions, standardization and
training. The inventory and comparison above apply that guidance to this proposed
instrumentation workflow; they are our hypotheses, not measurements reported by
Google. Its earlier [Eliminating Toil](https://sre.google/sre-book/eliminating-toil/)
distinguishes repeated automatable operational work from novel engineering and
from general overhead; the talk's broader savings inventory intentionally
includes coordination overhead as a separate category.

Current [OpenTelemetry Operator documentation](https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/)
already supports auto-instrumentation and namespace opt-in. Compare against that
capable baseline. Our custom prototype's exact contribution and runtime support
must be demonstrated rather than inferred from the word “operator.” Sources
checked October 22, 2026; pinned prototype findings remain in
[technical-findings.md](technical-findings.md#injector-prototype-evaluation--2026-10-19).


## What namespace selection changes

The direct comparison is the remaining work after an injection mechanism exists.
Upstream already supports language-specific namespace opt-in. The demo's custom
controller and Injector combine namespace scope, runtime selection and managed
rollout, using one shared payload and configuration.

- **Enrollment:** one namespace selection replaces a positive list of services
  and separate language-specific instrumentation changes in those services.
- **Coordination:** fewer repeated tickets, owner lookups, meetings, access
  requests, reviews and release scheduling across application teams.
- **Delivery:** the controller replaces selected running workloads using their
  rollout/readiness configuration; operators do not restart thirteen services
  manually. Deployment time and workload restarts still exist.
- **Onboarding:** a compatible new workload in scope inherits selection instead
  of needing its own instrumentation opt-in request.
- **Consistency:** common agent versions, exporters and settings reduce copy/paste
  drift and repeated troubleshooting, documentation and training effort.
- **Lifecycle:** shared configuration provides a place to revise scope, update
  payloads and remove enrollment, with residual compatibility/recovery work.

These are specific mechanisms for potential savings, not measured amounts.
Count central preparation, testing, maintenance and blast radius. Language detail
can increase runtime and telemetry costs; it does not establish a smaller bill.

## Illustrative dollar model — October 26, 2026

This is a **theoretical first-year labor-capacity comparison in USD**, not an
industry average, measured demo result, customer ROI, or forecast of a smaller
cash or telemetry bill. It asks what the repeated work could be worth if the
declared assumptions hold. It assumes adoption of maintained tooling; production
hardening of this prototype needs a separate, explicit budget.

The controlling inputs are
[`presentation/data/savings-assumptions.json`](../presentation/data/savings-assumptions.json).
[`presentation/savings-model.js`](../presentation/savings-model.js) contains the
single calculation shared by the native slides, video data and editable
[browser calculator](../public/presentation/savings.html). Rebuild public results
with `node scripts/presentation/build_savings.mjs`. No organizational cost or
time study was available; every workflow hour, frequency and domain count below
is an authored assumption, not a source's measured estimate.

### Labor rate

Use **$100 per active person-hour** as a rounded planning input. For context,
BLS reports a **$135,980 median annual wage for U.S. software developers in May
2025**. Dividing by an assumed 2,080 paid hours yields about $65.38 per hour.
BLS reports that wages represented **70.0% of private-industry employer
compensation in June 2026**. Applying that broad ratio gives about $93.39 per
hour including benefits; we round the illustrative input to $100. This combines
different populations and periods and is not a developer-specific loaded-cost
estimate. It is not a statistical average for this audience, and local rates
may differ substantially. Do not add paid leave or a productivity multiplier
again; replace the input with your own relevant cost per person-hour.

Sources checked October 26, 2026:

- [BLS Occupational Outlook Handbook: software developers](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm).
- [BLS: June 2026 employer compensation and benefit shares](https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm).

### Baseline, boundaries and assumed work

Compare against the user's **best practical existing workflow**, including
competent direct setup, runtime templates, upstream namespace opt-in and existing
tracing. The custom integration's name alone establishes no monetary advantage.
Both instrumentation paths must produce the same required useful detail and
healthy requests. The following effort deltas apply only where that repeated
work actually exists. Common prerequisites and the directly configured pilot
cancel; the platform budget below is additional to that common work.

| Assumed activity | Baseline | Shared workflow | Difference credited |
| --- | ---: | ---: | ---: |
| Initial setup per remaining compatible service: active owner coordination, configuration, review, deployment and checks | 2.5 person-hours | 0.5 person-hours | 2 hours |
| Each later agent/configuration change, four per year | 0.75 person-hours | 0.25 person-hours | 0.5 hours per change |
| Qualifying investigation where OBI supplies useful cross-service visibility absent from the baseline | 3 people × 30 minutes | 1 person × 30 minutes | 1 person-hour |
| Initial shared adoption, first rollout domain | — | 24 hours | Subtract all 24 |
| Annual shared maintenance, first rollout domain | — | 24 hours | Subtract all 24 |
| Each extra rollout domain | — | 4 initial + 4 annual hours | Subtract both |

The investigation credit is **conditional**, not a claim that OBI uniquely
provides connected tracing or automatically reduces MTTR. Count only cases where
it adds missing visibility, for example before detailed SDK instrumentation is
available. If existing traces provide equally useful evidence, set the count or
people-hour difference to zero. Do not apply this credit to every incident in a
fully instrumented system. These are investigation activities, separate from the
enrollment coordination already included in setup. Do not count repair time or
calendar waiting as avoided person-hours.

The 24-hour adoption allowance could represent one day adopting OBI and two
days adopting the shared injector workflow. The 24-hour annual allowance is two
hours per month for routine platform upkeep. These are scenario budgets, not
observed requirements; real compatibility testing, support, security review,
exceptions and production rollout can require much more. Add that work rather
than claiming the allowance covers unknown prototype development.

A rollout domain can be a separately maintained cluster or rollout boundary.
The scenario counts below are explicit inputs, not an assertion that every 100
services need one cluster. Unsupported runtimes receive no injector credit.
Residual supported-service effort remains in both setup and each later change.

### Formula and the 18-service example

Let `N` be total services, `E = floor(N × 14 / 18)` be agent-compatible services
for this illustrative runtime mix, and `K = max(0, E − 1)` be the remainder after
one directly configured pilot common to both paths. Let `Q` be qualifying
investigations and `D` be rollout domains.

```text
Initial enrollment hours avoided = K × (2.5 − 0.5)
Annual lifecycle hours avoided   = K × 4 × (0.75 − 0.25)
Investigation hours avoided      = Q × (3 − 1) × 0.5
Initial platform hours          = 24 + (D − 1) × 4
Annual platform hours           = 24 + (D − 1) × 4

First-year net labor hours = initial + lifecycle + investigation
                            − initial platform − annual platform
First-year capacity value = first-year net labor hours × $100

Following-year net labor hours = lifecycle + investigation − annual platform
Following-year capacity value = following-year net labor hours × $100
```

For the demo: 18 services, 14 compatible, one common Checkout pilot, **13
remaining eligible**, one domain and 12 qualifying investigations:

| First-year contribution | Person-hours | Value at $100/hour |
| --- | ---: | ---: |
| Avoided initial repetition: 13 × 2 | +26 | +$2,600 |
| Four later changes: 13 × 4 × 0.5 | +26 | +$2,600 |
| Qualifying investigations: 12 × 1 | +12 | +$1,200 |
| Shared adoption | −24 | −$2,400 |
| Annual shared upkeep | −24 | −$2,400 |
| **First-year capacity after platform labor** | **16** | **$1,600** |

The unchanged following-year fleet yields `26 + 12 − 24 = 14` hours, or
**$1,400 per year**, under the same recurring assumptions. Initial setup savings
and initial platform adoption both disappear from that recurring year. The
first rollout alone, without recurring changes or investigations, would avoid
only `26 − 24 = 2` hours, or **$200**. This is why the talk emphasizes repetition
and lifecycle work rather than pricing a few terminal commands.

### Scale beyond the demo

Maintain the approximate demo runtime mix, rounded down, and exclude one common
pilot per fleet. These investigation frequencies and domain counts are
illustrative inputs, not observed incident rates or a validated scaling law.

| Total services | Compatible | Remaining credited | Domains | Qualifying investigations/year | First-year capacity | Then per year |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 18 | 14 | 13 | 1 | 12 | **$1,600** | $1,400 |
| 100 | 77 | 76 | 2 | 24 | **$27,200** | $14,800 |
| 500 | 388 | 387 | 5 | 60 | **$152,800** | $79,400 |
| 1,000 | 777 | 776 | 10 | 120 | **$310,400** | $161,200 |

Platform costs grow: the first-year setup-plus-upkeep budgets are 48, 56, 80
and 120 hours, respectively. The recurring upkeep budgets are 24, 28, 40 and
60 hours. No growth, new-service onboarding, unpriced downtime, queue reduction,
saved revenue, or blanket productivity multiplier is added. At larger scale,
replace the simple domain and residual-effort assumptions with the actual
platform architecture, runtime mix and exception distribution.

### Sensitivity and break-even

At $100/hour, holding all other demo inputs constant, suppose avoided initial
plus four lifecycle changes total one, four or eight hours per remaining
eligible service across the first year:

| Avoided hours per remaining service/year | Demo first-year capacity after platform labor |
| ---: | ---: |
| 1 hour | **−$2,300** |
| 4 hours — base scenario | **$1,600** |
| 8 hours | **$6,800** |

These are alternative scenarios, not confidence bounds. If existing namespace
templates remove all of the modeled per-service work, set its incremental
savings to zero. With the default investigation credit the demo then returns
**−$3,600**, and with equally useful existing traces as well it returns
**−$4,800**. Centralizing work is not automatically cheaper.

Under the base demo assumptions, first-year break-even requires at least **nine
remaining compatible services**: `ceil((48 − 12) / 4) = 9`. At no investigation
credit it requires 12. An extra 40 hours of adoption or prototype hardening
deducts **$4,000**, turning the base demo value into **−$2,400**. The editable
calculator accepts extra initial work, extra annual platform work and additional
annual non-labor costs. For example, $2,000/year of incremental telemetry or
support would make the base demo's combined first-year economic value **−$400**.

Reduced hands-on work is released capacity; it becomes cash saving only if
actual spending falls or an otherwise necessary expenditure is avoided.
Dollar figures do not value delay reduction or establish lower observability
bills. Compare matched load, sampling, retention and coverage before pricing
infrastructure or telemetry changes. No measured standalone OBI-versus-injector
ROI is claimed: the headline subtracts their joint incremental platform labor.

The presentation recommendation is to show the small worked example first,
then the fleet table, and invite the audience to replace the inputs with their
own baseline. A statement suitable for the talk is: “In this hypothetical year,
the demo frees $1,600 of engineering capacity after platform labor. With these
assumptions, 1,000 services reach about $310,000. Those are inputs to test, not
customer savings we measured.”
