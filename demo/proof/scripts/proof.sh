#!/usr/bin/env bash
set -Eeuo pipefail

PROOF_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
readonly PROOF_ROOT
readonly CLUSTER=far-wide-proof
readonly NAMESPACE=far-wide-proof
readonly KUBECONFIG_FILE="$PROOF_ROOT/.artifacts/kubeconfig"
readonly CHART_URL=https://github.com/open-telemetry/opentelemetry-helm-charts/releases/download/opentelemetry-operator-0.124.1/opentelemetry-operator-0.124.1.tgz

usage() {
    printf '%s\n' 'Usage: proof.sh prepare|up|depth|breadth|status|down' \
        'prepare builds images and creates the isolated cluster and Operator.' \
        'up starts the breadth experiment; depth/breadth roll checkout.' \
        'down deletes only the far-wide-proof cluster; evidence files remain.'
}

log() { printf '[proof] %s\n' "$*" >&2; }
trap 'log "Command failed at line $LINENO; cluster and evidence retained"' ERR

require() {
    local command_name
    for command_name in "$@"; do
        command -v "$command_name" >/dev/null || { log "Missing: $command_name"; return 1; }
    done
}

kube() {
    [[ -f "$KUBECONFIG_FILE" ]] || { log 'Run prepare first'; return 1; }
    kubectl --kubeconfig "$KUBECONFIG_FILE" --context "kind-$CLUSTER" --request-timeout=10s --namespace "$NAMESPACE" "$@"
}

prepare() {
    require python3 docker kind kubectl helm rg
    mkdir -p -- "$PROOF_ROOT/.artifacts"
    python3 "$PROOF_ROOT/scripts/prepare.py"
    docker build -t far-wide-proof-agent:local -f "$PROOF_ROOT/agent/Dockerfile" "$PROOF_ROOT"
    docker build -t far-wide-proof-router:local "$PROOF_ROOT/router"
    local target
    for target in gateway checkout inventory; do
        docker build --target "$target" -t "far-wide-proof-$target:local" \
            -f "$PROOF_ROOT/apps/Dockerfile" "$PROOF_ROOT/apps"
    done
    if ! kind get clusters | rg -qx "$CLUSTER"; then
        kind create cluster --name "$CLUSTER" --image kindest/node:v1.33.2 \
            --kubeconfig "$KUBECONFIG_FILE" --wait 120s
    else
        kind export kubeconfig --name "$CLUSTER" --kubeconfig "$KUBECONFIG_FILE"
    fi
    kind load docker-image --name "$CLUSTER" far-wide-proof-agent:local \
        far-wide-proof-gateway:local far-wide-proof-checkout:local far-wide-proof-inventory:local far-wide-proof-router:local
    helm upgrade --install far-wide-operator "$CHART_URL" \
        --namespace far-wide-system --create-namespace --kubeconfig "$KUBECONFIG_FILE" \
        --kube-context "kind-$CLUSTER" --values "$PROOF_ROOT/k8s/operator-values.yaml" \
        --wait --timeout 180s
}

roll_profile() {
    exec python3 "$PROOF_ROOT/scripts/handoff.py" "$1"
}

main() {
    [[ $# == 1 ]] || { usage >&2; return 2; }
    require kubectl python3
    case "$1" in
        prepare) prepare ;;
        up)
            kube create namespace "$NAMESPACE" --dry-run=client -o yaml | kube apply -f -
            kube create configmap proof-evidence-server --from-file="$PROOF_ROOT/scripts/evidence_server.py" --from-file="$PROOF_ROOT/scripts/analyze.py" --dry-run=client -o yaml | kube apply -f -
            kube apply -f "$PROOF_ROOT/k8s/breadth.yaml"
            kube apply -f "$PROOF_ROOT/k8s/depth.yaml"
            local deployment
            for deployment in collector gateway inventory checkout-router; do
                kube rollout status "deployment/$deployment" --timeout=180s
            done
            kube rollout status daemonset/proof-agent --timeout=180s
            roll_profile breadth
            ;;
        depth) roll_profile depth ;;
        breadth) roll_profile breadth ;;
        status) kube get pods -o wide ;;
        down)
            require kind
            [[ -f "$KUBECONFIG_FILE" ]] || { log 'No proof kubeconfig; refusing deletion'; return 1; }
            kind delete cluster --name "$CLUSTER" --kubeconfig "$KUBECONFIG_FILE"
            ;;
        -h|--help) usage ;;
        *) usage >&2; return 2 ;;
    esac
}

main "$@"
