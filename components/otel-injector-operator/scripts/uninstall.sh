#!/usr/bin/env bash
set -euo pipefail
component=$(cd -- "$(dirname -- "$0")/.." && pwd)
root=$(cd -- "$component/../.." && pwd)
demo_context=$(kubectl config current-context)
artifacts="$root/.artifacts/injector-components/uninstall"
mkdir -p "$artifacts"
export TMPDIR="$artifacts"
kubectl() { command kubectl --context="$demo_context" --cache-dir="$artifacts/kubectl-cache" "$@"; }
printf 'Uninstalling the demo Injector operator from context %s\n' "$demo_context"
# Keep the operator and webhook running while the finalizer removes injection.
kubectl delete instrumentations.demo.opentelemetry.io cluster --ignore-not-found --wait=true --timeout=15m
kubectl delete mutatingwebhookconfiguration otel-demo-injector --ignore-not-found
kubectl delete namespace otel-injector-system --ignore-not-found
kubectl delete clusterrolebinding otel-demo-injector --ignore-not-found
kubectl delete clusterrole otel-demo-injector --ignore-not-found
kubectl delete crd instrumentations.demo.opentelemetry.io --ignore-not-found
