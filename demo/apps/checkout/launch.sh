#!/bin/sh
set -eu

# Explicitly expose this one non-secret demo setting, not the whole environment.
# The Java agent reads resource attributes at startup. Unsetting the application
# setting on the next rollout also removes its resource attribute.
if [ -n "${LEGACY_PRICING_URL:-}" ]; then
  export OTEL_RESOURCE_ATTRIBUTES="${OTEL_RESOURCE_ATTRIBUTES:+$OTEL_RESOURCE_ATTRIBUTES,}process.environment_variable.LEGACY_PRICING_URL=$LEGACY_PRICING_URL"
fi

exec java --add-modules jdk.httpserver -cp '/app/lib/*' demo.checkout.Checkout
