---
kicker: The investigation
---

# Why is checkout taking so long?

<figure class="opening-evidence"><img src="/presentation/images/request-latency.png" alt="Actual Grafana measurement: one checkout request takes two seconds" /></figure>

<!--
**Tyler:**

Imagine, you've clicked "Place Order". Now you're waiting. Did it work? Should you click again? Our checkout completes the order, but it makes the customer wait more than two seconds. In this presentation, we'll first show you how install OpenTelemetry eBPF Instrumentation to identify the issue source.

**Nikola:**

Then we'll tackle the other problem: getting eighteen services ready for that investigation. We'll use the OpenTelemetry Injector and our demo Kubernetes operator so every team doesn't have to repeat the setup. First, let's follow that order.
-->
