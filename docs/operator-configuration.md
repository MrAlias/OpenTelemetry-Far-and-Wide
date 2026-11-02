# What the upstream Operator still needs to know

Slide 16 uses an illustrative `reporting-api` pod to examine the upstream
OpenTelemetry Operator. It does not describe Injector or RIO behavior and does
not claim the example is part of the recorded demo. Annotation keys on the
slide share the displayed `instrumentation.opentelemetry.io/` prefix.
The [complete YAML example](../presentation/examples/operator-reporting.yaml)
shows the actual nesting, resource references and a custom Python payload
placeholder. It is not a deployment instruction for the demo.

Research checked November 2, 2026 against Operator commit
`614a0378b14276a4dbea8d575b4a5825e3c3538a`. Confirm behavior against the version
actually deployed; current GitHub documentation and the website can differ.

## Six builds and the work behind them

1. **Language opt-in.** Upstream supports workload and namespace annotations.
   Do not imply namespace-level opt-in is missing. An `Instrumentation` resource
   supplies the agent configuration; the annotation selects it.
   [Operator guide](https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/).
2. **Image compatibility.** Python has `otel-python-platform: musl`; .NET has
   `otel-dotnet-auto-runtime: linux-musl-x64`, with glibc defaults described in
   the respective docs. Python native wheels also depend on the interpreter
   version; selecting musl alone is not a universal compatibility guarantee.
   A matching custom instrumentation image may be needed.
   [Python](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/docs/auto-instrumentation/languages/python.md),
   [.NET](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/docs/auto-instrumentation/languages/dotnet.md),
   [Python binary packages](https://opentelemetry.io/docs/zero-code/python/operator/),
   [custom payloads](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/docs/auto-instrumentation/custom-images.md).
   Ruby's current Operator documentation requires enabling its language support
   and `inject-ruby`. It does **not** document the same libc-selection annotation.
   Do not generalize Python's switch to Ruby.
   [Ruby enablement](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/docs/auto-instrumentation/languages/ruby.md).
3. **Container targeting.** A Python API and .NET worker in one pod need
   language-specific container mappings. This feature requires
   multi-instrumentation to be enabled; the pinned source says it is enabled by
   default. The slide does not claim every cluster must explicitly turn it on.
   A generic `container-names` annotation is not the multi-language mapping.
   [Multi-instrumentation](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/docs/auto-instrumentation/multi-instrumentation.md).
4. **Processes within a container.** The same document explicitly excludes
   multiple language instrumentations in one container. Multiple containers
   and multiple processes are different cases. A Python-plus-Node container
   can require application packaging or startup changes; do not invent another
   annotation that supposedly fixes it.
5. **Startup behavior.** The Operator modifies `PYTHONPATH` for its Python
   bootstrap. CPython `-I` ignores `PYTHON*` variables; `-S` suppresses `site`
   initialization. The illustrative `exec python -I -S /app/reporting.py`
   therefore bypasses this bootstrap path. A healthy pod does not prove an
   agent loaded. Application-owned launchers can also discard environment
   variables before starting children. This is an application constraint,
   not evidence of an Operator bug. Do not automatically remove isolation
   flags; agree on a supported startup with the owner.
   [Operator Python implementation](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/internal/instrumentation/python.go),
   [CPython command-line behavior](https://docs.python.org/3.12/using/cmdline.html#cmdoption-I),
   [site initialization](https://docs.python.org/3.12/using/cmdline.html#cmdoption-S).
6. **Delivery and ownership.** Account for payload testing, mount/read access,
   existing agents, Collector connectivity, a safe restart and actual exported
   telemetry. Python's image instructions explicitly discuss installed
   dependencies, filesystem access and the bootstrap layout.
   [Payload build instructions](https://github.com/open-telemetry/opentelemetry-operator/blob/614a0378b14276a4dbea8d575b4a5825e3c3538a/autoinstrumentation/python/Dockerfile).
   The coordination chain shown is an operational inference: the application
   team knows the image and entrypoint; the platform team may need their help
   and release access. Hours or an afternoon are **possible effort/waiting**,
   not measured averages or a charge assigned to each annotation. The savings
   calculator receives no new time credits from this example.

## Delivery and scope

The configuration grows only through the first three states. Later states
show why additional YAML cannot resolve every application constraint. This
avoids making unsupported combinations look configurable. No live demo
workload, Operator installation, application image or security policy changes.

The slide uses five click transitions and twelve short speaker turns. The
full dialogue remains in the generated notes, with one marker per build.
RIO's existing introduction moves to slide 17, outside this upstream Operator
sequence, and explicitly retains application compatibility/startup constraints.
The revised content budget is 23 minutes plus two minutes for questions.
