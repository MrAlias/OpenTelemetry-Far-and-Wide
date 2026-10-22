#!/usr/bin/env bash
# Startup/loader checks, not a replacement for application telemetry tests.
set -euo pipefail
component=$(cd -- "$(dirname -- "$0")/.." && pwd)
root=$(cd -- "$component/../.." && pwd)
artifacts="$root/.artifacts/injector-components/image-smoke"
mkdir -p "$artifacts/payload" "$artifacts/tmp"
export TMPDIR="$artifacts/tmp"
payload=${PAYLOAD_IMAGE:-far-wide-demo-injector-payload:dev}
mount=/__otel_sdk_auto_instrumentation__
docker run --rm "$payload" /verify-layout.sh
docker run --rm --mount "type=bind,src=$artifacts/payload,dst=$mount" "$payload" /copy-to-volume.sh
common=(--rm --mount "type=bind,src=$artifacts/payload,dst=$mount,readonly"
  -e "LD_PRELOAD=$mount/dist/injector/libotelinject.so"
  -e "OTEL_INJECTOR_CONFIG_FILE=$mount/dist/injector/otelinject.conf"
  -e OTEL_TRACES_EXPORTER=none -e OTEL_METRICS_EXPORTER=none -e OTEL_LOGS_EXPORTER=none
  -e OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf)
docker run "${common[@]}" "${JAVA_IMAGE:-eclipse-temurin:21-jre}" java -version > "$artifacts/java.log" 2>&1
rg -q 'opentelemetry-javaagent.*version: 2.30.0' "$artifacts/java.log"
docker run "${common[@]}" "${NODE_IMAGE:-node:24}" node -e 'if (!Object.keys(require.cache).some(p => p.endsWith("auto-instrumentations-node/build/src/register.js"))) throw new Error("Node agent not loaded"); console.log("Node.js Injector activated")' > "$artifacts/node.log" 2>&1
docker run "${common[@]}" "${PYTHON_IMAGE:-python:3.14.6-trixie}" python -c 'import sys; assert "opentelemetry.instrumentation.auto_instrumentation" in sys.modules; from opentelemetry import trace; assert type(trace.get_tracer_provider()).__name__ == "TracerProvider"; print("Python Injector activated")' > "$artifacts/python.log" 2>&1
docker run "${common[@]}" "${RUBY_IMAGE:-ruby:3.3.12-slim-bookworm}" ruby -e 'raise "Ruby agent not loaded" unless defined?(OpenTelemetry::SDK); puts "Ruby Injector activated"' > "$artifacts/ruby.log" 2>&1
docker build -t far-wide-injector-dotnet-smoke:dev "$component/tests/dotnet" > "$artifacts/dotnet-build.log" 2>&1
docker run "${common[@]}" far-wide-injector-dotnet-smoke:dev > "$artifacts/dotnet.log" 2>&1
echo 'All five language agents activated through the Injector.'
