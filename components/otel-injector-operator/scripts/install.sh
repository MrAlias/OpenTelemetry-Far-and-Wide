#!/usr/bin/env bash
set -euo pipefail
umask 077
component=$(cd -- "$(dirname -- "$0")/.." && pwd)
root=$(cd -- "$component/../.." && pwd)
demo_context=${DEMO_CONTEXT:-$(kubectl config current-context)}
config_id=$(python3 -c 'import hashlib,os,sys; print(hashlib.sha256((os.environ.get("KUBECONFIG", "") + "\0" + sys.argv[1]).encode()).hexdigest()[:16])' "$demo_context")
artifacts="$root/.artifacts/injector-components/install/$config_id"
mkdir -p "$artifacts"
export TMPDIR="$artifacts"
kubectl() { command kubectl --context="$demo_context" --cache-dir="$artifacts/kubectl-cache" "$@"; }
printf 'Installing the bundled RIO demo controller in context %s\n' "$demo_context"
image=${1:-otel-injector-operator:demo}
kubectl apply -f "$component/config/crd.yaml"
kubectl wait --for=condition=Established crd/instrumentations.demo.opentelemetry.io --timeout=60s
kubectl create namespace otel-injector-system --dry-run=client -o yaml | kubectl apply -f -
# Reuse the cluster's certificate so reinstalling does not race an old server.
if kubectl get secret otel-injector-tls -n otel-injector-system -o json > "$artifacts/secret.json" 2>/dev/null; then
  python3 - "$artifacts" <<'PY'
import base64,json,pathlib,sys
p=pathlib.Path(sys.argv[1]); data=json.loads((p/'secret.json').read_text())['data']
for key in ('tls.crt','tls.key'):
    (p/key).write_bytes(base64.b64decode(data[key]))
PY
else
  openssl req -x509 -newkey rsa:2048 -nodes -days 365 -keyout "$artifacts/tls.key" -out "$artifacts/tls.crt" \
    -subj '/CN=otel-injector.otel-injector-system.svc' \
    -addext 'subjectAltName=DNS:otel-injector.otel-injector-system.svc,DNS:otel-injector.otel-injector-system.svc.cluster.local'
  kubectl create secret tls otel-injector-tls -n otel-injector-system --cert="$artifacts/tls.crt" --key="$artifacts/tls.key" --dry-run=client -o yaml | kubectl apply -f -
fi
chmod 600 "$artifacts/tls.key"
python3 - "$component" "$artifacts" "$image" <<'PY'
import base64,pathlib,sys
component,artifacts=map(pathlib.Path,sys.argv[1:3]); image=sys.argv[3]
if '\n' in image or ' ' in image: raise SystemExit('Invalid image reference')
text=(component/'config/install.yaml').read_text()
text=text.replace('REPLACE_CA_BUNDLE',base64.b64encode((artifacts/'tls.crt').read_bytes()).decode())
text=text.replace('otel-injector-operator:demo',image)
(artifacts/'install.yaml').write_text(text)
PY
kubectl apply -f "$artifacts/install.yaml"
kubectl rollout status deployment/otel-injector -n otel-injector-system --timeout=180s
