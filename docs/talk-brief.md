# Current presentation direction · October 26, 2026

Use the [current storyboard](talk-storyboard.md): brief introduction → actual
18-service topology with PostgreSQL and Redis → OBI connected view and timing
comparison → direct language-agent setup on Checkout after evidence selects it →
reveal and remove the seeded pricing wait → measured customer payoff →
13 additional payload-supported services → upstream Operator opt-in → custom namespace selection and rollout →
verified wider picture → coordination, engineering and lifecycle savings.
Four Go services retain OBI coverage; the payload has no Go language agent.

The central takeaway is that OBI can tell us where to investigate, language
instrumentation can name actionable local work, and changing that work can
improve the customer request. Shared automation makes that investigation
capability available across the fleet without repeated setup. Compare with a capable direct/upstream baseline. The
recorded presentation now shows direct Checkout setup, a real application fix,
a matched latency recheck and broader enrollment;
rehearse the same sequence live. Savings are hypotheses until measured;
adding agent detail does not automatically reduce a backend bill. The closing
slides and review video include an explicitly hypothetical dollar-capacity model
for the demo and larger fleets; see [the inputs and scope](instrumentation-savings.md#illustrative-dollar-model--october-26-2026).

The submitted proposal below is retained as the original event abstract. It is
historical context; the current storyboard supersedes its proposed live sequence.

---

# Talk brief

## Event

- **Event:** KubeCon + CloudNativeCon North America 2026
- **Co-located event:** Observability Day
- **Talk:** OpenTelemetry Far and Wide
- **Presenters:** Tyler Yahn and Nikola Grcevski

## Communication job

By the end, platform and observability practitioners should understand how to
combine zero-touch eBPF coverage with selective SDK auto-injection because the
two approaches can provide immediate breadth and on-demand depth through one
operational control plane.

## Central demonstration

A single deployment workflow should be able to:

1. instrument every service with OpenTelemetry eBPF instrumentation;
2. selectively add language-level SDK instrumentation;
3. upgrade injected OpenTelemetry SDK versions; and
4. change telemetry detail and cost without application code or manifest edits.

## Narrative spine

1. Broad eBPF coverage makes the unknown environment visible immediately.
2. Debugging some failures requires details available only inside a language runtime.
3. Per-team SDK rollouts make that depth slow and operationally expensive.
4. SDK auto-injection and eBPF instrumentation can share a deployment mechanism.
5. Selective activation turns instrumentation depth into a dynamic cost control.
6. A live, mixed-technology environment demonstrates the approach end to end.

## Talk description

OpenTelemetry eBPF instrumentation made broad observability effortless: one
command, zero code changes, every service covered. But breadth is not always the
whole story. OpenTelemetry SDK instrumentation operates at the language level,
surfacing transaction details that can be lifesavers in debugging scenarios and
provide invaluable insights to developers. The catch is that rolling out SDK
instrumentation across a diverse, multi-technology, multi-team ecosystem can be
slow and expensive.

This talk introduces a practical approach that eliminates the tradeoff. By
combining eBPF instrumentation with SDK auto-injection, teams get broad coverage
immediately and deep, language-level insights where needed, with a single
deployment mechanism and dynamic cost controls.

We will give a live demo of this combined instrumentation approach and show how
a single command can instrument everything in the system, upgrade to new
OpenTelemetry SDK versions, and control instrumentation cost.

## Intended attendee outcomes

Attendees will learn:

- how to deploy zero-touch eBPF and SDK instrumentation together;
- why eBPF and SDK instrumentation are complementary;
- how to dynamically control telemetry cost and detail; and
- practical strategies for instrumenting diverse environments.

The proposed architecture extends the OpenTelemetry Operator so broad, precise
eBPF signals can be combined with selective SDK injection without requiring
developers to touch application code or Kubernetes manifests.
