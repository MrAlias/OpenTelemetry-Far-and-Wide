---
kicker: Add useful detail
---

# Give the local work a name

<div class="code-focus">

```yaml
JAVA_TOOL_OPTIONS: >-
  -javaagent:/java-agent/opentelemetry-javaagent.jar
OTEL_SERVICE_NAME: checkout
OTEL_INSTRUMENTATION_METHODS_INCLUDE: >-
  demo.checkout.PricingEngine[calculate]
```

</div>

<p class="lead">The agent supplies instrumentation.<br>We still supply the setup.</p>

<!--
**Tyler → Nikola · 0:45**

- **Tyler:** Source access; pricing runs before Inventory.
- **Point:** Agent startup; service identity; explicitly included **PricingEngine.calculate**.
- **Tyler:** Agent provides library detail; named business method needs configuration.
- **Nikola:** Zero-code instrumentation still needs agent delivery, exporter settings, a rollout.
- **Next · Tyler:** Apply the actual deployment patch; same application image.

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/checkout-direct-agent.patch.yaml
- demo/apps/checkout/src/main/java/demo/checkout/Checkout.java
- https://opentelemetry.io/docs/zero-code/java/agent/
[/Sources]

</details>
-->

---
kicker: Live demo · Java agent
---

# Roll Checkout with the Java agent

<DemoClip src="install-java-agent-edited.mp4" poster="install-java-agent-edited-poster.png" label="Actual Java agent deployment patch, rollout and startup log" />

<!--
**Tyler → Nikola · 1:15**

- **Do:** Apply direct-agent patch → wait for Checkout → send fresh traffic.
- **Tyler:** Agent + identity + exporter + method setting; **application image unchanged**.
- **Nikola:** Full access and runtime expertise; setup still takes work.
- **Land:** Zero code hasn't removed the release calendar.
- **Next · Tyler:** Open the new request's pricing method.

<details>
<summary>Demo commands / fallback</summary>

```sh
kubectl patch deployment/checkout -n demo-apps --type=strategic \
  --patch-file demo/k8s/checkout-direct-agent.patch.yaml
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
curl -fsS http://localhost:8080/checkout
```

Silent recording: manual play, native speed; use if the live demo stalls.

</details>

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/checkout-direct-agent.patch.yaml
- docs/fleet-demo-handoff.md
[/Sources]

</details>
-->

---
kicker: The useful result
---

# A failed attempt before a working fallback

<TimeoutEvidence />

<!--
**Tyler → Nikola → Tyler · 1:00**

- **Tyler · show:** Checkout → **PricingEngine.calculate** → failed HTTP span.
- **Nikola · point:** `error.type = java.net.SocketTimeoutException`.
- **Nikola · point:** Exception event: `exception.message = Connect timed out`.
- **Then name it:** **~2 s connection timeout**; successful product-price query follows.
- **Tyler:** OBI located the failed call; Java detail names method + fallback.
- **Next · Tyler:** Open the responsible Java code.

<details>
<summary>Sources</summary>

[Sources]
- public/demo-capture/java-trace-evidence.json
- presentation/data/timeout-evidence.json
- https://opentelemetry.io/docs/specs/semconv/http/http-spans/
- https://opentelemetry.io/docs/specs/semconv/exceptions/exceptions-spans/
- demo/apps/checkout/baseline/PricingEngine.java
[/Sources]

</details>
-->

---
kicker: The cause
---

# Stop calling the retired backend

<DemoClip src="edit-pricing-source.mp4" poster="edit-pricing-before.png" label="Actual Java source edit in Vim: remove the retired-backend HTTP attempt and retain orders.currentPrice()" />

<!--
**Tyler → Nikola · 0:35**

- **Show:** Real Java file in Vim; timeout **2000 ms**.
- **Tyler:** Retired backend attempt → timeout → current PostgreSQL price store.
- **Edit:** Remove obsolete HTTP block; keep `orders.currentPrice()`.
- **Nikola:** Instrumentation enables action + collaboration.
- **Land:** Bring the owning team a **PR: customer impact + trace + proposed fix**.
- **Next · Tyler:** Deploy that application change.

<details>
<summary>Sources</summary>

[Sources]
- demo/apps/checkout/baseline/PricingEngine.java
- demo/apps/checkout/fixes/PricingEngine.java
[/Sources]

</details>
-->

---
kicker: Live demo · application fix
---

# Deploy the pricing fix

<DemoClip src="fix-pricing-edited.mp4" poster="fix-pricing-edited-poster.png" label="Actual Checkout fix deployment and successful rollout" />

<!--
**Tyler → Nikola · 0:55**

- **Do:** Deploy prebuilt `pricing-fixed` image; wait for readiness.
- **Tyler:** Only application behavior changes; **same Java agent + exporter**.
- **Nikola:** Rollout ready ≠ customer problem solved.
- **Next · Nikola:** Send another customer request; **show its waterfall immediately**.

<details>
<summary>Demo commands / fallback</summary>

Prebuild/load `pricing-fixed` before presenting; see `docs/customer-resolution.md`.

```sh
kubectl patch deployment/checkout -n demo-apps --type=strategic \
  --patch-file demo/k8s/checkout-pricing-fixed.patch.yaml
kubectl rollout status deployment/checkout -n demo-apps --timeout=300s
curl -fsS http://localhost:8080/checkout
```

Silent recording: manual play, native speed; use if the live demo stalls.

</details>

<details>
<summary>Sources</summary>

[Sources]
- demo/k8s/checkout-pricing-fixed.patch.yaml
- demo/apps/checkout/Dockerfile
- docs/customer-resolution.md
[/Sources]

</details>
-->

---
kicker: Back to the customer
---

# The next checkout skips the failed call

<TraceEvidence image="fixed-request-trace.png" label="Actual post-fix Grafana waterfall: current product-price lookup retained, failed legacy call removed, full checkout completes" />

<p class="caption">The failed call is gone. The successful checkout path remains.</p>

<!--
**Tyler → Nikola → Tyler · 0:50**

- **Show first:** Fresh **post-fix waterfall**, before aggregate numbers.
- **Tyler · point:** Checkout → PricingEngine.calculate; price query remains, failed legacy call gone.
- **Nikola · follow:** Inventory, commerce branches, order write — useful work retained.
- **Land:** Customer no longer waits for the retired backend.
- **Next · Tyler:** Symptom → cause → code change → fresh trace; now compare requests.

<details>
<summary>Sources</summary>

[Sources]
- public/demo-capture/fixed-request-evidence.json
- public/demo-capture/fixed-request-trace.png
- presentation/data/resolution.json
[/Sources]

</details>
-->

---
kicker: The repeated-request result
---

# The improvement holds across requests

<CustomerResult />

<!--
**Tyler → Nikola · 0:35**

- **Tyler · point:** Matched request medians: **2.21 s → 220 ms**.
- **Tyler:** Pricing: **2.01 s → 3.71 ms**; successful price lookup retained.
- **Nikola:** Same instrumentation; warmed local demo, **not a production benchmark**.
- **Land:** Summary supports the waterfall we just saw.
- **Next · Nikola:** How do other teams get this detail without repeating setup?

<details>
<summary>Sources</summary>

[Sources]
- presentation/data/resolution.json
- scripts/presentation/measure_resolution.py
- docs/customer-resolution.md
[/Sources]

</details>
-->
