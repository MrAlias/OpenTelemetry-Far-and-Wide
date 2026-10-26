# Where instrumentation automation can save work

The economic claim for this talk is that a shared, maintained instrumentation
workflow can reduce repeated work across services. The 18-service
scenario demonstrates the mechanism; it does not establish organization-wide
savings. No labor, dollar, latency-repair, or telemetry-bill result is measured yet.

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
