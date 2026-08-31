# Live demo

Use this directory for the reproducible live-demo environment and the operator
workflow shown on stage.

Keep the demo organized around explicit lifecycle commands:

- bootstrap the environment;
- deploy the mixed-technology sample system;
- enable broad eBPF instrumentation;
- selectively enable or upgrade SDK auto-injection;
- change cost/detail controls; and
- tear down the environment.

Prefer deterministic scripts or task-runner targets over undocumented shell
history. Record prerequisites, expected output, recovery steps, and an offline
fallback before rehearsal.
