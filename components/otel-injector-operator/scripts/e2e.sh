#!/usr/bin/env bash
# Component integration fixture only: no application demo or OBI installation.
set -euo pipefail
component=$(cd -- "$(dirname -- "$0")/.." && pwd)
root=$(cd -- "$component/../.." && pwd)
cluster=${CLUSTER_NAME:-far-wide-components-check}
artifacts="$root/.artifacts/injector-components/e2e/$cluster"
mkdir -p "$artifacts/tmp"
export TMPDIR="$artifacts/tmp"
export KUBECONFIG="$artifacts/kubeconfig"
kubectl() { command kubectl --cache-dir="$artifacts/kubectl-cache" "$@"; }
operator_image=${OPERATOR_IMAGE:-far-wide-demo-injector-operator:dev}
payload_image=${PAYLOAD_IMAGE:-far-wide-demo-injector-payload:dev}
node_image=${NODE_IMAGE:-kindest/node:v1.35.0}
create_cluster=true
if kind get clusters | rg -qx "$cluster"; then
  if [ "${REUSE_CLUSTER:-false}" != true ] || [ ! -s "$KUBECONFIG" ]; then
    echo "Refusing to replace existing cluster $cluster (explicit REUSE_CLUSTER and its saved kubeconfig are required)" >&2
    exit 1
  fi
  create_cluster=false
fi
cleanup() {
  result=$?
  if [ "$result" -eq 0 ] && [ "${KEEP_CLUSTER:-false}" != true ]; then
    kind delete cluster --name "$cluster"
  else
    echo "Cluster and evidence retained: $cluster; KUBECONFIG=$KUBECONFIG" >&2
  fi
}
trap cleanup EXIT
cat > "$artifacts/kind.yaml" <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  ImageVolume: ${IMAGE_VOLUME_ENABLED:-true}
nodes:
  - role: control-plane
EOF
if [ "$create_cluster" = true ]; then
  kind create cluster --name "$cluster" --image "$node_image" --config "$artifacts/kind.yaml" --kubeconfig "$KUBECONFIG" --wait 120s
fi
kind load docker-image --name "$cluster" "$operator_image" "$payload_image"
"$component/scripts/install.sh" "$operator_image"
if [ "$create_cluster" = false ]; then
  kubectl rollout restart deployment/otel-injector -n otel-injector-system
  kubectl rollout status deployment/otel-injector -n otel-injector-system --timeout=120s
  kubectl delete namespace injector-component-test --ignore-not-found --wait=true --timeout=120s
  kubectl delete instrumentations.demo.opentelemetry.io cluster --ignore-not-found --wait=true --timeout=120s
fi
kubectl create namespace injector-component-test
python3 - "$payload_image" > "$artifacts/workloads.json" <<'PY'
import json,sys
image=sys.argv[1]; items=[]
for kind in ('Deployment','StatefulSet','DaemonSet'):
    name=kind.lower()
    template={'metadata':{'labels':{'fixture':name}},'spec':{'terminationGracePeriodSeconds':5,'tolerations':[{'operator':'Exists'}],'containers':[{
        'name':'fixture','image':image,'imagePullPolicy':'IfNotPresent',
        'command':['/bin/sh','-ec','if [ "${OTEL_DEMO_BREAK:-false}" = true ]; then exit 1; fi; exec sleep infinity'],
        'readinessProbe':{'exec':{'command':['/bin/sh','-c','kill -0 1']},'periodSeconds':1}}]}}
    spec={'selector':{'matchLabels':{'fixture':name}},'template':template,'minReadySeconds':1}
    if kind!='DaemonSet':spec['replicas']=1
    if kind=='Deployment':spec['strategy']={'type':'RollingUpdate','rollingUpdate':{'maxUnavailable':0,'maxSurge':1}}
    if kind=='StatefulSet':spec['serviceName']='fixture'
    items.append({'apiVersion':'apps/v1','kind':kind,'metadata':{'name':name,'namespace':'injector-component-test'},'spec':spec})
print(json.dumps({'apiVersion':'v1','kind':'List','items':items}))
PY
kubectl apply -f "$artifacts/workloads.json"
for kind in deployment statefulset daemonset; do
  kubectl rollout status "$kind/$kind" -n injector-component-test --timeout=180s
done
python3 - "$payload_image" > "$artifacts/policy.json" <<'PY'
import json,sys
print(json.dumps({'apiVersion':'demo.opentelemetry.io/v1alpha1','kind':'Instrumentation','metadata':{'name':'cluster'},'spec':{
    'image':sys.argv[1],'endpoint':'http://collector.invalid:4318','signals':{'traces':True,'metrics':True,'logs':True},
    'timeoutSeconds':60,'rules':[{'name':'fixture','selector':{'namespaces':['injector-component-test']},'action':'Inject'}]}}))
PY
wait_phase() {
  local wanted=$1
  for attempt in $(seq 1 100); do
    kubectl get instrumentations.demo.opentelemetry.io cluster -o json > "$artifacts/status.json"
    if python3 - "$artifacts/status.json" "$wanted" <<'PY'
import json,sys
w=json.load(open(sys.argv[1])).get('status',{}).get('workloads',[])
sys.exit(0 if len(w)==3 and all(x['phase']==sys.argv[2] for x in w) else 1)
PY
    then cp "$artifacts/status.json" "$artifacts/$wanted.json"; return 0; fi
    sleep 2
  done
  cat "$artifacts/status.json"
  kubectl logs deployment/otel-injector -n otel-injector-system > "$artifacts/operator.log"
  return 1
}
kubectl apply -f "$artifacts/policy.json"
wait_phase Ready
kubectl get pods -n injector-component-test -o json > "$artifacts/injected-pods.json"
python3 - "$artifacts/injected-pods.json" "${EXPECT_DELIVERY:-}" <<'PY'
import json,sys
pods=[p for p in json.load(open(sys.argv[1]))['items'] if not p['metadata'].get('deletionTimestamp')]
assert len(pods)==3, len(pods)
for p in pods:
    a=p['metadata']['annotations']; assert a['demo.opentelemetry.io/applied-revision']==a['demo.opentelemetry.io/revision']
    if sys.argv[2]: assert a['demo.opentelemetry.io/delivery']==sys.argv[2], a
print('Verified injection:', [p['metadata']['annotations']['demo.opentelemetry.io/delivery'] for p in pods])
PY
kubectl patch instrumentations.demo.opentelemetry.io cluster --type=merge -p '{"spec":{"timeoutSeconds":15,"env":[{"name":"OTEL_DEMO_BREAK","value":"true"}]}}'
wait_phase RolledBack
kubectl get pods -n injector-component-test -o json > "$artifacts/rolled-back-pods.json"
# A blocked revision must remain blocked across a controller restart.
kubectl rollout restart deployment/otel-injector -n otel-injector-system
kubectl rollout status deployment/otel-injector -n otel-injector-system --timeout=120s
wait_phase RolledBack
kubectl patch instrumentations.demo.opentelemetry.io cluster --type=merge -p '{"spec":{"timeoutSeconds":60,"retryToken":"corrected","env":[]}}'
wait_phase Ready
kubectl delete instrumentations.demo.opentelemetry.io cluster --wait=true --timeout=180s
kubectl get pods -n injector-component-test -o json > "$artifacts/removed-pods.json"
python3 - "$artifacts/removed-pods.json" <<'PY'
import json,sys
pods=[p for p in json.load(open(sys.argv[1]))['items'] if not p['metadata'].get('deletionTimestamp')]
assert len(pods)==3
for pod in pods:
    assert not any(v['name']=='otel-demo-payload' for v in pod['spec'].get('volumes',[]))
    assert not any(e['name']=='LD_PRELOAD' for c in pod['spec']['containers'] for e in c.get('env',[]))
print('Verified removal from all three workload types.')
PY
kubectl logs deployment/otel-injector -n otel-injector-system > "$artifacts/operator.log"
kubectl get nodes -o json > "$artifacts/nodes.json"
kubectl get pods -n otel-injector-system -o json > "$artifacts/capability-probes.json"
echo 'Component integration checks passed.'
