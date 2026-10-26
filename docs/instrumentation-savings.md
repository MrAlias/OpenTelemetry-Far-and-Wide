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

### Baseline and boundaries

Compare equivalent useful instrumentation and healthy requests against the
**best practical existing workflow**, including runtime templates, existing
tracing and upstream namespace opt-in. A custom operator's name establishes no
saving. Only instrumentation work is priced here, not unrelated application
release work. The common directly configured Checkout pilot and other genuinely
common prerequisites cancel. Four Go services receive no injector credit.

The calculation compares **complete work ledgers**, not gross avoided effort
minus a generic platform allowance. Centralizing existing maintenance is a
saving: distributed update effort is replaced by shared update effort plus
exceptions. Shared work is counted once in the with-tools ledger. It is not
charged again to every routine service or deducted again as an annual surcharge.

Every workflow time below is an authored hypothetical input. Sources support
the comparison method and rate context, not these time estimates. The example
assumes adoption of maintained tools, not development of this prototype. Actual
prototype development/hardening needs its own estimate; no arbitrary development
allowance is silently applied to users adopting OBI or the injector.

### Explicit work assumptions

| Activity | Baseline workflow | With shared tools |
| --- | --- | --- |
| Initial work per remaining eligible service | 2.5 person-hours for active coordination, configuration, review, rollout and checks | 0.5 person-hours of residual enrollment/validation |
| Shared initial work per rollout domain | 0 additional hours in this example | 2 hours deploying/configuring OBI and the injector, policy and shared checks |
| Routine updates | Four changes/year × 0.75 hours per service, including change/review/checks | Four changes/year × 1 hour per rollout domain for shared configuration, compatibility checks and rollout |
| Exceptions at each shared update | Already included in baseline service work | 0.5 hours per exception service; explicit scenario counts below |
| Qualifying investigation | 3 people × 30 minutes | 1 person × 30 minutes |

The two shared deployment hours and one shared hour per update are **editable
scenario work estimates**, not measured installation requirements, a quoted
adoption charge or a universal production budget. Replace them with actual
compatibility, security, rollout and support effort for the intended deployment.
Initial shared work is charged once per domain; ongoing shared work is charged
once per change per domain. The 0.5-hour exception budget is additional to shared
checks, only for services requiring individual attention. It is not a claim
that the demo observed a failure or that the prototype already automates every
compatibility check. The scenario assumes the shared path can perform the stated
routine work; measure it before using these values for an adoption decision.

A rollout domain is an independently maintained rollout group, perhaps a
cluster or a runtime/compatibility cohort. Service count does not determine its
count automatically. If mixed runtimes need separate validation, increase groups
or shared hours. Normal checks must be in the shared-update budget; individual
exceptions belong in the exception count. Neither is free, and neither is counted
twice. Exception counts refer to each update, not a cumulative annual total.

The OBI investigation credit applies **only where it supplies missing useful
visibility**. It is not unique ownership of connected tracing or an automatic
MTTR reduction. Count separate investigation events, excluding setup meetings,
repair time and calendar waiting. If existing traces are equally useful, set
qualifying investigations to zero. Additional telemetry/backend/support costs
need actual estimates and are outside the labor headline unless entered.

### Formula

Let `K` be remaining eligible services, `D` rollout domains, `X` exception
services per update and `Q` qualifying investigations/year. For the scale
illustration, eligible services are `floor(N × 14 / 18)`, with one common pilot
excluded. Four changes/year and the following times are scenario inputs:

```text
Baseline initial work = K × 2.5
Shared initial work   = K × 0.5 + D × 2

Baseline annual upkeep = K × 4 × 0.75
Shared annual upkeep   = 4 × (D × 1 + X × 0.5)

Baseline investigations = Q × 3 × 0.5
With-OBI investigations  = Q × 1 × 0.5

First-year hours saved = sum(baseline ledger) − sum(with-tools ledger)
First-year value       = first-year hours saved × $100

Recurring hours saved = (baseline upkeep + baseline investigations)
                      − (shared upkeep + with-OBI investigations)
Recurring value       = recurring hours saved × $100
```

Any baseline shared work can also be entered. Additional initial or annual work
is added to the relevant with-tools row once. Extra annual non-labor spending is
subtracted from economic value separately, not converted into invented hours.

### The 18-service demo

Of 18 services, 14 support the language payload. Excluding the common Checkout
pilot leaves **13 remaining eligible services**. Assume one rollout domain,
one exception service per update and 12 qualifying investigations in the year:

| Activity | Before, person-hours | With tools, person-hours | Saved | Value at $100/hour |
| --- | ---: | ---: | ---: | ---: |
| Initial setup | 13 × 2.5 = 32.5 | 13 × 0.5 + 2 = 8.5 | 24 | $2,400 |
| Annual upkeep | 13 × 4 × 0.75 = 39 | 4 × (1 + 1 × 0.5) = 6 | 33 | $3,300 |
| Qualifying investigations | 12 × 3 × 0.5 = 18 | 12 × 1 × 0.5 = 6 | 12 | $1,200 |
| **First year** | **89.5** | **20.5** | **69** | **$6,900** |

**Centralized upkeep saves $3,300/year in this example.** Its six remaining
hours consist of four shared update hours and two service-exception hours. They
are already included in the comparison. No additional generic adoption or
maintenance allowance is deducted, and routine shared upkeep is not also
charged to every service.

The same stable fleet saves **45 hours, or $4,500/year**, in following years:
33 upkeep hours + 12 investigation hours. Initial work is removed from both
ledgers. Initial setup alone saves 24 hours, or $2,400. Setup plus upkeep saves
57 hours, or **$5,700**, even with no OBI investigation credit.

### Scale beyond the demo

These independent domain, exception and investigation counts are hypothetical
inputs, not average organizations or a validated service-to-incident scaling
law. The same per-service and per-domain times apply throughout:

| Services | Eligible left | Domains | Exceptions/update | Qualifying investigations/year | First year | Then/year |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 18 | 13 | 1 | 1 | 12 | **$6,900** | $4,500 |
| 100 | 76 | 2 | 4 | 24 | **$38,400** | $23,600 |
| 500 | 387 | 5 | 20 | 60 | **$192,500** | $116,100 |
| 1,000 | 776 | 10 | 40 | 120 | **$386,000** | $232,800 |

Shared annual upkeep including exceptions is 6, 16, 60 and 120 hours,
respectively. Baseline annual upkeep is 39, 228, 1,161 and 2,328 hours. Its
reduction is 33, 212, 1,101 and 2,208 hours. This explicitly shows the value of
centralized upkeep instead of charging shared maintenance to every service.
First-year setup savings are 24, 148, 764 and 1,532 hours. Recurring values
include no new-service growth or repeated credit for initial setup.

### Sensitivity and fair comparison

Holding other demo inputs fixed:

| Alternative assumption | First-year capacity value |
| --- | ---: |
| No qualifying missing-visibility investigations | $5,700 |
| Two hours shared upkeep per domain per change, rather than one | $6,500 |
| Every one of the 13 remaining services needs a half-hour exception at each update | $4,500 |
| Baseline initial setup takes 1 hour/service and each update 0.25 hours/service | $2,350 |
| Additional 80 hours of initial prototype development | −$1,100 |
| Additional $2,000/year telemetry or support spending | $4,900 after that spending |

These are alternative assumptions, not statistical confidence bounds. To compare
against an **already centralized** baseline, set its per-service initial effort
to 0.5 hours, its shared initial effort to 2 hours/domain, its repeated per-service
update effort to zero and its shared update effort to match the new workflow's
shared updates plus exceptions. Set qualifying investigations to zero if its
traces are equally useful. Identical effort ledgers yield **zero** value. This
is essential: moving an existing shared process into a different controller is
not automatically an additional saving.

Benefits such as fewer meetings and handoffs are already inside active setup
and update work; they are not separate dollar multipliers. Calendar waiting,
outage revenue, application speed improvements, telemetry-bill reductions and
hypothetical productivity multipliers receive no credit. Released capacity is
useful engineering time; it becomes cash saving only when spending actually
falls or necessary expenditure is avoided. No measured standalone OBI-versus-
injector ROI or average-user saving is claimed.

The talk should show the two ledgers, explain centralized upkeep, then scale
with transparent inputs. Suggested wording: “In this hypothetical year, we go
from 89.5 to 20.5 person-hours. That frees $6,900 of engineering capacity,
including $3,300 from centralized upkeep. At 1,000 services under these explicit
assumptions, it is about $386,000 in year one. Replace these inputs with your
own workflow; these are not customer results we measured.”
