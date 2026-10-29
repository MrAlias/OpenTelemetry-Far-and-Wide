# The value of centralized instrumentation ownership

Compare **distributed responsibility for instrumentation** with a **centralized
injector/operator approach**, at the same useful telemetry outcome. RIO is the
talk-specific demo implementation of that idea, with an upstream home as the
intended direction rather than an agreed roadmap. This is
an editable labor-capacity scenario, not measured customer savings or an industry
average. Dollars value engineering time; cash savings require actual spending to
fall.

The presentation uses one cumulative-effort chart for the 18-service demo:
distributed ownership takes 266.5 hours over 24 months; central ownership
takes 19.5 hours. At $100/hour, those totals are $26,650 and $1,950.
The primary callout is **247 engineering hours freed**: 31 hours of
setup plus 108 hours in each of two upkeep years. At $100/hour, their $24,700
value equals $13,900 in year one plus $10,800 in year two. The chart starts
with setup effort of 32.5 versus 1.5 hours, then holds flat between monthly
releases. Each release adds 9.75 hours (13 × 0.75 hours; $975) to distributed
ownership and 0.75 hours (1 × 0.75 hours; $75) to centralized control.
`presentation/rollout-charts.js` derives these steps from the same ledgers.
There is no additional adoption-delay credit. The preceding adoption chart is
a conceptual comparison of rollout shapes, not observed uptake or a schedule.

## One-time setup

The demo has 18 application services, 14 compatible with the demonstrated agent
payload. Exclude the common direct Checkout pilot, leaving 13 service owners.

| One-time activity | Distributed ownership | Centralized injector/operator |
| --- | ---: | ---: |
| Agent configuration, review and rollout | 13 × 2.5 h = 32.5 h | One controller/policy deployment: 1 h |
| Cluster-wide OBI deployment | Not added to this baseline | Once: 0.5 h |
| Total | 32.5 h | 1.5 h |

The centralized namespace rule is one operation. It is **not** charged another
half-hour for every service; compatible future workloads inherit the policy.
The 30-minute OBI deployment budget comes from the presenter’s estimate. The
other labor budgets are authored assumptions, not measured terminal runtimes.
The distributed 2.5-hour budget includes agent delivery, settings, review and
rollout. Calendar weeks awaiting a team or release are not person-hours and are
not monetized.

## Monthly agent releases

Assume one new agent release every month: **12 releases per year**. Each of the
13 distributed owners arranges an update, compared with one platform-owned
update for the namespace. Shared release qualification common to both workflows
cancels. Budget the same 45 minutes of active labor per owned rollout operation.

| Annual activity | Distributed ownership | Centralized injector/operator |
| --- | ---: | ---: |
| Update operations | 13 × 12 = 156 | 1 × 12 = 12 |
| Active labor | 156 × 0.75 = 117 h | 12 × 0.75 = 9 h |

Centralization saves **108 hours per year** in this scenario. This prices who
owns the rollout, not how many Pods Kubernetes replaces. A shared update still
needs compatibility checks, readiness and recovery. Add any different testing,
service-specific exceptions, hardening or support work explicitly; the default
scenario does not invent an exception for every routine service.

## No investigation-time credit

After both approaches provide equivalent instrumentation, assume equivalent
investigation capability. The model gives **zero credit per investigation**.
OBI supplies initial cluster visibility while applications keep running; its
one-time deployment is counted above. Do not charge or credit it again every
incident. An uninstrumented baseline may take much longer to obtain coverage,
but development weeks, incident frequency and blocked time require evidence
before pricing them.

Turning collection on and off could change telemetry volume, but no telemetry
bill reduction is claimed here. It needs measured signal volume, activation
patterns, retention and actual backend pricing. There is no invented always-on
cost penalty for distributed ownership.

## Worked result and scale

At an assumed **$100 per person-hour**:

- Initial saving: 32.5 − 1.5 = **31 h**.
- Recurring saving: 117 − 9 = **108 h/year**.
- First year: (31 + 108) × $100 = **$13,900** of capacity.
- Following stable-fleet year: 108 × $100 = **$10,800**.

| Total services | Remaining compatible | Independent rollout domains | First year | Following year |
| ---: | ---: | ---: | ---: | ---: |
| 18 | 13 | 1 | $13,900 | $10,800 |
| 100 | 76 | 2 | $85,300 | $66,600 |
| 500 | 387 | 5 | $439,800 | $343,800 |
| 1,000 | 776 | 10 | $881,900 | $689,400 |

Larger scenarios retain the demo’s 14/18 supported-runtime mix, rounded down,
and exclude one common pilot per fleet. Domain counts are separate assumptions,
not an observed scaling law. Each independently maintained domain pays shared
setup and 12 updates once. If there is really only one fleet-wide domain, enter
one. An already centralized baseline with equivalent work must return zero.

Canonical inputs: `presentation/data/savings-assumptions.json`. Calculation:
`presentation/savings-model.js`. Edit the assumptions in the mobile-friendly
`public/presentation/savings.html` calculator. Extra initial/annual labor and
non-labor cost inputs can make the result smaller or negative.

## Rate and method sources

[$100 is a rounded planning input, not a BLS rate.](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm)
The BLS developer median wage ($135,980/year, May 2025) and the broad private
industry wage share of compensation
[70.0%, June 2026](https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm)
provide context: $135,980 ÷ 2,080 ÷ 0.70 ≈ $93.39/hour. That benefits ratio is not
developer-specific. Neither source measures these workflow hours.

[Google SRE’s discussion of eliminating toil](https://sre.google/workbook/eliminating-toil/)
supports comparing complete implementation and maintenance effort with repeated
work. [RIO](https://github.com/otelx/rio) is an independent experimental OTelX
project using upstream Injector and language agents, not the upstream Operator.
The [upstream Operator already supports namespace opt-in](https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/).
Use the best existing workflow in the baseline.


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
  the comparison, shared setup, testing and ongoing maintenance, plus evidenced
  service exceptions, verification and rework. Routine central enrollment is
  one namespace operation; do not add a per-service setup allowance.
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
