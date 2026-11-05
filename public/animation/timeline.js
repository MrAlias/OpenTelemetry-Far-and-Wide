window.TALK = {
  "title": "OpenTelemetry Far and Wide",
  "voice": "Tyler Yahn's and Nikola Grcevski's authorized synthetic voices; not a recording of the presenters",
  "status": "Rehearsal-edited draft with actual silent demo captures. Narration uses the separate authorized synthetic voices of Tyler Yahn and Nikola Grcevski; speech remains at its native pace. Live action budget: 20 minutes 45 seconds.",
  "chapters": [
    {
      "id": "01-promise",
      "kind": "title",
      "title": "OpenTelemetry Far and Wide",
      "plannedDuration": 45,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Welcome everyone. I'm Tyler Yahn."
        },
        {
          "speaker": "Nikola",
          "text": "And I'm Nikola Grcevski."
        },
        {
          "speaker": "Tyler",
          "text": "Imagine you've clicked Place Order. Now you're waiting. Did it work? Should you click again? Our checkout succeeds, but the customer waits more than two seconds. We're going to find that wait and remove it."
        },
        {
          "speaker": "Nikola",
          "text": "Then we'll make the same diagnostic detail available to the other teams, without repeating the agent setup for every service. First, let's follow the order."
        }
      ],
      "visuals": [
        {
          "at": 0,
          "type": "art"
        },
        {
          "type": "image",
          "src": "presentation/images/request-latency.png",
          "atCue": 2
        }
      ],
      "purpose": "Open a customer problem and promise a measured resolution, then make that investigation capability repeatable across the namespace.",
      "leadInSeconds": 0.6,
      "cues": [
        {
          "start": 0.6,
          "end": 3.0,
          "sampleStart": 14400,
          "sampleEnd": 72000,
          "speaker": "Tyler",
          "text": "Welcome everyone. I'm Tyler Yahn."
        },
        {
          "start": 3.32,
          "end": 5.72,
          "sampleStart": 79680,
          "sampleEnd": 137280,
          "speaker": "Nikola",
          "text": "And I'm Nikola Grcevski."
        },
        {
          "start": 6.04,
          "end": 16.48,
          "sampleStart": 144960,
          "sampleEnd": 395520,
          "speaker": "Tyler",
          "text": "Imagine you've clicked Place Order. Now you're waiting. Did it work? Should you click again? Our checkout succeeds, but the customer waits more than two seconds. We're going to find that wait and remove it."
        },
        {
          "start": 16.8,
          "end": 25.72,
          "sampleStart": 403200,
          "sampleEnd": 617280,
          "speaker": "Nikola",
          "text": "Then we'll make the same diagnostic detail available to the other teams, without repeating the agent setup for every service. First, let's follow the order."
        }
      ],
      "visualCues": [
        {
          "at": 0,
          "type": "art",
          "start": 0
        },
        {
          "type": "image",
          "src": "presentation/images/request-latency.png",
          "atCue": 2,
          "start": 6.04
        }
      ],
      "duration": 26.4,
      "start": 0,
      "end": 26.4,
      "audio": "narration/01-promise.mp3"
    },
    {
      "id": "02-topology",
      "kind": "topology",
      "title": "18 services. One customer request.",
      "plannedDuration": 30,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "The request enters through Gateway, reaches Checkout and Inventory, then fans out through the commerce services. Eighteen applications, plus PostgreSQL and Redis. We know the route; we don't yet know which part is making the customer wait."
        },
        {
          "speaker": "Nikola",
          "text": "And the customer shouldn't need to know. Let's see the request before we choose a service to investigate."
        }
      ],
      "purpose": "Orient in the actual application without selecting a culprit.",
      "cues": [
        {
          "start": 0.65,
          "end": 12.89,
          "sampleStart": 15600,
          "sampleEnd": 309360,
          "speaker": "Tyler",
          "text": "The request enters through Gateway, reaches Checkout and Inventory, then fans out through the commerce services. Eighteen applications, plus PostgreSQL and Redis. We know the route; we don't yet know which part is making the customer wait."
        },
        {
          "start": 13.21,
          "end": 18.85,
          "sampleStart": 317040,
          "sampleEnd": 452400,
          "speaker": "Nikola",
          "text": "And the customer shouldn't need to know. Let's see the request before we choose a service to investigate."
        }
      ],
      "visualCues": [],
      "duration": 19.52,
      "start": 26.4,
      "end": 45.92,
      "audio": "narration/02-topology.mp3"
    },
    {
      "id": "03-install-obi",
      "kind": "obi-intro",
      "title": "OBI",
      "plannedDuration": 85,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We'll start with OpenTelemetry eBPF Instrumentation, or OBI. Deploy it on the Linux nodes and it generates OpenTelemetry traces and metrics for supported applications. No application code changes and no application restarts. That's a pretty good way to meet eighteen services you haven't instrumented yet."
        },
        {
          "speaker": "Nikola",
          "text": "If you joined us in Atlanta last year, you'll recognize the idea. OBI is now version one and generally available. The previous talk is linked here. Today, we're using that broad view as the starting point for an investigation."
        },
        {
          "speaker": "Tyler",
          "text": "Let's deploy OBI and send an order. The application keeps running while we add visibility."
        },
        {
          "speaker": "Nikola",
          "text": "One deployment on the nodes. Let's open the request we just sent."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/install-obi-edited.mp4",
          "poster": "presentation/images/install-obi-edited-poster.png",
          "atCue": 2
        }
      ],
      "purpose": "Introduce OBI before its acronym is used: eBPF observations of running Linux applications, zero app changes/restarts, traces and metrics. Show deployment only after explaining its value.",
      "sources": [
        "https://opentelemetry.io/docs/zero-code/obi/",
        "demo/k8s/obi.yaml"
      ],
      "previewVisualIndex": 0,
      "alignTurnAfterVisual": {
        "3": 1
      },
      "cues": [
        {
          "start": 0.65,
          "end": 16.39,
          "sampleStart": 15600,
          "sampleEnd": 393360,
          "speaker": "Tyler",
          "text": "We'll start with OpenTelemetry eBPF Instrumentation, or OBI. Deploy it on the Linux nodes and it generates OpenTelemetry traces and metrics for supported applications. No application code changes and no application restarts. That's a pretty good way to meet eighteen services you haven't instrumented yet."
        },
        {
          "start": 16.71,
          "end": 29.39,
          "sampleStart": 401040,
          "sampleEnd": 705360,
          "speaker": "Nikola",
          "text": "If you joined us in Atlanta last year, you'll recognize the idea. OBI is now version one and generally available. The previous talk is linked here. Today, we're using that broad view as the starting point for an investigation."
        },
        {
          "start": 29.71,
          "end": 33.83,
          "sampleStart": 713040,
          "sampleEnd": 811920,
          "speaker": "Tyler",
          "text": "Let's deploy OBI and send an order. The application keeps running while we add visibility."
        },
        {
          "start": 36.95,
          "end": 41.63,
          "sampleStart": 886800,
          "sampleEnd": 999120,
          "speaker": "Nikola",
          "text": "One deployment on the nodes. Let's open the request we just sent."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/install-obi-edited.mp4",
          "poster": "presentation/images/install-obi-edited-poster.png",
          "atCue": 2,
          "start": 29.71,
          "mediaDuration": 6.24
        }
      ],
      "duration": 42.28,
      "start": 45.92,
      "end": 88.2,
      "audio": "narration/03-install-obi.mp3"
    },
    {
      "id": "04-connected-trace",
      "kind": "trace-focus",
      "title": "Find the two-second wait",
      "plannedDuration": 50,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Here's that order in Grafana. We can follow the service calls and database work without changing those applications."
        },
        {
          "speaker": "Tyler",
          "text": "Now look inside Checkout. Where does most of the customer's wait go?"
        },
        {
          "speaker": "Nikola",
          "text": "This failed connection takes about two seconds. The order still completes, but the customer waits for a failed attempt first."
        },
        {
          "speaker": "Tyler",
          "text": "Why is Checkout making that call? OBI has shown us where to look. Let's add the Java agent to connect the failed call to the work inside the service."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        }
      ],
      "purpose": "In live Grafana, find the failed two-second Checkout connection and ask why a successful order makes that attempt. Keep one actual waterfall as fallback; skip trace anatomy and the topology detour.",
      "buildAfter": 1,
      "cues": [
        {
          "start": 0.65,
          "end": 7.93,
          "sampleStart": 15600,
          "sampleEnd": 190320,
          "speaker": "Nikola",
          "text": "Here's that order in Grafana. We can follow the service calls and database work without changing those applications."
        },
        {
          "start": 8.25,
          "end": 11.57,
          "sampleStart": 198000,
          "sampleEnd": 277680,
          "speaker": "Tyler",
          "text": "Now look inside Checkout. Where does most of the customer's wait go?"
        },
        {
          "start": 11.89,
          "end": 18.37,
          "sampleStart": 285360,
          "sampleEnd": 440880,
          "speaker": "Nikola",
          "text": "This failed connection takes about two seconds. The order still completes, but the customer waits for a failed attempt first."
        },
        {
          "start": 18.69,
          "end": 26.25,
          "sampleStart": 448560,
          "sampleEnd": 630000,
          "speaker": "Tyler",
          "text": "Why is Checkout making that call? OBI has shown us where to look. Let's add the Java agent to connect the failed call to the work inside the service."
        }
      ],
      "buildTime": 11.89,
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        }
      ],
      "duration": 26.92,
      "start": 88.2,
      "end": 115.12,
      "audio": "narration/04-connected-trace.mp3"
    },
    {
      "id": "07-direct-agent",
      "kind": "java-setup",
      "title": "Add Java detail to Checkout",
      "plannedDuration": 120,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here's the direct setup. Supply the Java agent, tell Java to load it, set the service name and choose the exporter. We also configure a span around the pricing method. The agent supplies the HTTP and database detail; it doesn't invent a span for every method."
        },
        {
          "speaker": "Nikola",
          "text": "We know this service and have access to its deployment. Even then, somebody has to arrange the agent and startup settings. Java loads the agent when it starts, so this requires a rollout."
        },
        {
          "speaker": "Tyler",
          "text": "Let's apply the prepared patch. The payload image is already available; this step changes the Deployment, not the application image."
        },
        {
          "speaker": "Nikola",
          "text": "Now we send fresh traffic. Adding instrumentation hasn't fixed the delay. It should explain it."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/install-java-agent-edited.mp4",
          "poster": "presentation/images/install-java-agent-edited-poster.png",
          "atCue": 2
        }
      ],
      "purpose": "Inspect deployment configuration, attach the Java agent and restart the same application image. The named pricing method comes from the prepared demo configuration, not from OBI or a source-code inspection.",
      "alignTurnAfterVisual": {
        "3": 1
      },
      "previewVisualIndex": 0,
      "cues": [
        {
          "start": 0.65,
          "end": 15.83,
          "sampleStart": 15600,
          "sampleEnd": 379920,
          "speaker": "Tyler",
          "text": "Here's the direct setup. Supply the Java agent, tell Java to load it, set the service name and choose the exporter. We also configure a span around the pricing method. The agent supplies the HTTP and database detail; it doesn't invent a span for every method."
        },
        {
          "start": 16.15,
          "end": 26.39,
          "sampleStart": 387600,
          "sampleEnd": 633360,
          "speaker": "Nikola",
          "text": "We know this service and have access to its deployment. Even then, somebody has to arrange the agent and startup settings. Java loads the agent when it starts, so this requires a rollout."
        },
        {
          "start": 26.71,
          "end": 33.15,
          "sampleStart": 641040,
          "sampleEnd": 795600,
          "speaker": "Tyler",
          "text": "Let's apply the prepared patch. The payload image is already available; this step changes the Deployment, not the application image."
        },
        {
          "start": 38.71,
          "end": 44.19,
          "sampleStart": 929040,
          "sampleEnd": 1060560,
          "speaker": "Nikola",
          "text": "Now we send fresh traffic. Adding instrumentation hasn't fixed the delay. It should explain it."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/install-java-agent-edited.mp4",
          "poster": "presentation/images/install-java-agent-edited-poster.png",
          "atCue": 2,
          "start": 26.71,
          "mediaDuration": 11.0
        }
      ],
      "duration": 44.84,
      "start": 115.12,
      "end": 159.96,
      "audio": "narration/07-direct-agent.mp3"
    },
    {
      "id": "08-new-detail",
      "kind": "timeout-evidence",
      "title": "The failed call timed out",
      "plannedDuration": 65,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "The new trace has PricingEngine.calculate, the method we configured. Inside it: the failed HTTP call, then the successful product-price query. We can now name the operation and see its fallback."
        },
        {
          "speaker": "Nikola",
          "text": "The span says SocketTimeoutException. Its exception event says Connect timed out. Two seconds trying the wrong address, then the fallback gets the price."
        },
        {
          "speaker": "Tyler",
          "text": "So the order works. We just make the customer wait for a backend that isn't answering. Let's look at the setting behind that address."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        }
      ],
      "purpose": "Show the actual HTTP span error.type and exception event before calling the failure a timeout; return to the successful price lookup.",
      "sources": [
        "public/demo-capture/java-trace-evidence.json",
        "https://opentelemetry.io/docs/specs/semconv/http/http-spans/",
        "https://opentelemetry.io/docs/specs/semconv/exceptions/exceptions-spans/"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.65,
          "sampleStart": 15600,
          "sampleEnd": 279600,
          "speaker": "Tyler",
          "text": "The new trace has PricingEngine.calculate, the method we configured. Inside it: the failed HTTP call, then the successful product-price query. We can now name the operation and see its fallback."
        },
        {
          "start": 11.97,
          "end": 21.53,
          "sampleStart": 287280,
          "sampleEnd": 516720,
          "speaker": "Nikola",
          "text": "The span says SocketTimeoutException. Its exception event says Connect timed out. Two seconds trying the wrong address, then the fallback gets the price."
        },
        {
          "start": 21.85,
          "end": 28.01,
          "sampleStart": 524400,
          "sampleEnd": 672240,
          "speaker": "Tyler",
          "text": "So the order works. We just make the customer wait for a backend that isn't answering. Let's look at the setting behind that address."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        }
      ],
      "duration": 28.68,
      "start": 159.96,
      "end": 188.64,
      "audio": "narration/08-new-detail.mp3"
    },
    {
      "id": "08-fix-pricing",
      "kind": "configuration-fix",
      "title": "Remove the stale endpoint setting",
      "plannedDuration": 110,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We expose this deployment setting as a resource attribute: LEGACY_PRICING_URL. Its value matches the failed call. We know this backend was retired; this instance still tries it before the working product store."
        },
        {
          "speaker": "Nikola",
          "text": "Now we can help the owning team with more than a slow-service alert. Customers are losing two seconds here; here's the trace and a configuration PR that removes the old setting. We can bring them a fix based on what the application is actually doing."
        },
        {
          "speaker": "Tyler",
          "text": "Let's remove the setting and roll Checkout. Same application image, same Java agent, same exporter. No rebuild."
        },
        {
          "speaker": "Nikola",
          "text": "The rollout is ready. Back to the customer: let's send a new order and open its trace."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/fix-pricing-edited.mp4",
          "poster": "presentation/images/fix-pricing-edited-poster.png",
          "atCue": 2
        }
      ],
      "purpose": "Show the real Checkout resource attribute identifying the stale endpoint. Remove that environment variable and roll the same image; bring the owning team a configuration PR backed by the customer trace.",
      "sources": [
        "demo/apps/checkout/src/main/java/demo/checkout/PricingEngine.java",
        "demo/apps/checkout/launch.sh",
        "demo/k8s/checkout-pricing-fixed.patch.yaml",
        "public/demo-capture/java-trace-evidence.json",
        "presentation/data/resolution.json"
      ],
      "alignTurnAfterVisual": {
        "3": 1
      },
      "previewVisualIndex": 0,
      "cues": [
        {
          "start": 0.65,
          "end": 12.61,
          "sampleStart": 15600,
          "sampleEnd": 302640,
          "speaker": "Tyler",
          "text": "We expose this deployment setting as a resource attribute: LEGACY_PRICING_URL. Its value matches the failed call. We know this backend was retired; this instance still tries it before the working product store."
        },
        {
          "start": 12.93,
          "end": 26.59,
          "sampleStart": 310320,
          "sampleEnd": 638160,
          "speaker": "Nikola",
          "text": "Now we can help the owning team with more than a slow-service alert. Customers are losing two seconds here; here's the trace and a configuration PR that removes the old setting. We can bring them a fix based on what the application is actually doing."
        },
        {
          "start": 26.91,
          "end": 33.11,
          "sampleStart": 645840,
          "sampleEnd": 794640,
          "speaker": "Tyler",
          "text": "Let's remove the setting and roll Checkout. Same application image, same Java agent, same exporter. No rebuild."
        },
        {
          "start": 38.91,
          "end": 44.07,
          "sampleStart": 933840,
          "sampleEnd": 1057680,
          "speaker": "Nikola",
          "text": "The rollout is ready. Back to the customer: let's send a new order and open its trace."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/fix-pricing-edited.mp4",
          "poster": "presentation/images/fix-pricing-edited-poster.png",
          "atCue": 2,
          "start": 26.91,
          "mediaDuration": 11.0
        }
      ],
      "duration": 44.72,
      "start": 188.64,
      "end": 233.36,
      "audio": "narration/08-fix-pricing.mp3"
    },
    {
      "id": "08-customer-result",
      "kind": "screen",
      "title": "The next checkout skips the failed call",
      "plannedDuration": 50,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here's the new waterfall. The failed legacy call is gone. The product-price query is still there, and the order continues through the application."
        },
        {
          "speaker": "Nikola",
          "text": "That's better. The customer gets their order without waiting for a backend we've already turned off."
        },
        {
          "speaker": "Tyler",
          "text": "We didn't make the timeout less visible. We removed the unnecessary call. Let's compare the request-duration metrics too."
        }
      ],
      "purpose": "Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.",
      "sources": [
        "presentation/data/resolution.json",
        "scripts/presentation/measure_resolution.py",
        "docs/customer-resolution.md"
      ],
      "visuals": [
        {
          "type": "image",
          "src": "presentation/images/fixed-request-trace.png",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/fixed-request-detail.mp4",
          "poster": "presentation/images/fixed-request-trace.png",
          "atCue": 1
        }
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 7.17,
          "sampleStart": 15600,
          "sampleEnd": 172080,
          "speaker": "Tyler",
          "text": "Here's the new waterfall. The failed legacy call is gone. The product-price query is still there, and the order continues through the application."
        },
        {
          "start": 7.49,
          "end": 13.13,
          "sampleStart": 179760,
          "sampleEnd": 315120,
          "speaker": "Nikola",
          "text": "That's better. The customer gets their order without waiting for a backend we've already turned off."
        },
        {
          "start": 13.45,
          "end": 19.77,
          "sampleStart": 322800,
          "sampleEnd": 474480,
          "speaker": "Tyler",
          "text": "We didn't make the timeout less visible. We removed the unnecessary call. Let's compare the request-duration metrics too."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "presentation/images/fixed-request-trace.png",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/fixed-request-detail.mp4",
          "poster": "presentation/images/fixed-request-trace.png",
          "atCue": 1,
          "start": 7.49,
          "mediaDuration": 8.88
        }
      ],
      "duration": 20.44,
      "start": 233.36,
      "end": 253.8,
      "audio": "narration/08-customer-result.mp3"
    },
    {
      "id": "08-result-summary",
      "kind": "metric-comparison",
      "title": "The wait is gone",
      "plannedDuration": 30,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "These captured Grafana windows show the average checkout dropping from about two-point-two seconds to a hundred and sixty-five milliseconds. They're a repeated-request comparison, alongside the fresh trace we just opened."
        },
        {
          "speaker": "Nikola",
          "text": "A customer gets their two seconds back. Good. Now what about the other teams?"
        }
      ],
      "purpose": "Show actual Grafana screenshots of mean Gateway GET /checkout duration over equal 120-second windows. Repeat these means in the closing; retain the separate matched-request medians as measurement evidence.",
      "sources": [
        "presentation/data/metric-comparison.json",
        "presentation/dashboards/checkout-metrics.json"
      ],
      "evidenceImages": [
        "presentation/images/customer-before-metric.png",
        "presentation/images/customer-after-metric.png"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 12.25,
          "sampleStart": 15600,
          "sampleEnd": 294000,
          "speaker": "Tyler",
          "text": "These captured Grafana windows show the average checkout dropping from about two-point-two seconds to a hundred and sixty-five milliseconds. They're a repeated-request comparison, alongside the fresh trace we just opened."
        },
        {
          "start": 12.57,
          "end": 17.21,
          "sampleStart": 301680,
          "sampleEnd": 413040,
          "speaker": "Nikola",
          "text": "A customer gets their two seconds back. Good. Now what about the other teams?"
        }
      ],
      "visualCues": [],
      "duration": 17.88,
      "start": 253.8,
      "end": 271.68,
      "audio": "narration/08-result-summary.mp3"
    },
    {
      "id": "09-the-rest",
      "kind": "scale",
      "title": "What about the other 13?",
      "plannedDuration": 30,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "We arranged the Java setup for Checkout because we knew the service and had access. Thirteen other services can use language agents. Who's arranging those?"
        },
        {
          "speaker": "Tyler",
          "text": "I'd rather not schedule thirteen versions of that meeting. We'll use the OpenTelemetry Injector. First, let's look at what the established Kubernetes Operator workflow still needs from the platform and application teams."
        }
      ],
      "purpose": "Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.",
      "cues": [
        {
          "start": 0.65,
          "end": 11.05,
          "sampleStart": 15600,
          "sampleEnd": 265200,
          "speaker": "Nikola",
          "text": "We arranged the Java setup for Checkout because we knew the service and had access. Thirteen other services can use language agents. Who's arranging those?"
        },
        {
          "start": 11.37,
          "end": 22.37,
          "sampleStart": 272880,
          "sampleEnd": 536880,
          "speaker": "Tyler",
          "text": "I'd rather not schedule thirteen versions of that meeting. We'll use the OpenTelemetry Injector. First, let's look at what the established Kubernetes Operator workflow still needs from the platform and application teams."
        }
      ],
      "visualCues": [],
      "duration": 23.04,
      "start": 271.68,
      "end": 294.72,
      "audio": "narration/09-the-rest.mp3"
    },
    {
      "id": "10-operator-opt-in",
      "kind": "operator-opt-in",
      "title": "The annotation is the easy part",
      "plannedDuration": 90,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "The upstream OpenTelemetry Operator can inject agents, with opt-in on a workload or a namespace. But the platform still needs application facts. This Python image uses musl; its Python version and native packages must match the payload."
        },
        {
          "speaker": "Nikola",
          "text": "Which image, which runtime, who has the Dockerfile? The application team usually knows. The annotation doesn't answer those questions."
        },
        {
          "speaker": "Tyler",
          "text": "Add a dot net worker and we also need per-container language mappings and its runtime settings. If a container starts multiple languages, or an entrypoint ignores the injected environment, more YAML alone won't make that work."
        },
        {
          "speaker": "Nikola",
          "text": "That's where a small deployment change can turn into hours of investigation and days waiting for an owner or release. The Operator helps with injection. We'd like to prepare more of the routine runtime setup once, and share it."
        }
      ],
      "purpose": "Walk through the upstream Operator baseline, including existing namespace opt-in, to show the runtime decisions, application constraints and coordination work a shared setup must address.",
      "sources": [
        "docs/operator-configuration.md",
        "presentation/data/operator-complexity.json"
      ],
      "visuals": [
        {
          "type": "art",
          "artwork": {
            "operatorStep": 1
          },
          "at": 0
        },
        {
          "type": "art",
          "atCue": 2,
          "artwork": {
            "operatorStep": 2
          }
        },
        {
          "type": "art",
          "atCue": 3,
          "artwork": {
            "operatorStep": 5
          }
        }
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 16.45,
          "sampleStart": 15600,
          "sampleEnd": 394800,
          "speaker": "Tyler",
          "text": "The upstream OpenTelemetry Operator can inject agents, with opt-in on a workload or a namespace. But the platform still needs application facts. This Python image uses musl; its Python version and native packages must match the payload."
        },
        {
          "start": 16.77,
          "end": 24.41,
          "sampleStart": 402480,
          "sampleEnd": 585840,
          "speaker": "Nikola",
          "text": "Which image, which runtime, who has the Dockerfile? The application team usually knows. The annotation doesn't answer those questions."
        },
        {
          "start": 24.73,
          "end": 36.49,
          "sampleStart": 593520,
          "sampleEnd": 875760,
          "speaker": "Tyler",
          "text": "Add a dot net worker and we also need per-container language mappings and its runtime settings. If a container starts multiple languages, or an entrypoint ignores the injected environment, more YAML alone won't make that work."
        },
        {
          "start": 36.81,
          "end": 50.73,
          "sampleStart": 883440,
          "sampleEnd": 1217520,
          "speaker": "Nikola",
          "text": "That's where a small deployment change can turn into hours of investigation and days waiting for an owner or release. The Operator helps with injection. We'd like to prepare more of the routine runtime setup once, and share it."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "artwork": {
            "operatorStep": 1
          },
          "at": 0,
          "start": 0
        },
        {
          "type": "art",
          "atCue": 2,
          "artwork": {
            "operatorStep": 2
          },
          "start": 24.73
        },
        {
          "type": "art",
          "atCue": 3,
          "artwork": {
            "operatorStep": 5
          },
          "start": 36.81
        }
      ],
      "duration": 51.4,
      "start": 294.72,
      "end": 346.12,
      "audio": "narration/10-operator-opt-in.mp3"
    },
    {
      "id": "09-injector-intro",
      "kind": "injector-intro",
      "title": "OpenTelemetry Injector",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "The Injector is the shared library in this diagram. It runs inside a compatible process at startup and loads the matching language agent. We prepare the library and supported agents together, instead of having every service team assemble a language-specific installation."
        },
        {
          "speaker": "Nikola",
          "text": "It works at process startup; it doesn't manage Kubernetes workloads. We still need a controller to select the workloads and arrange the rollout."
        }
      ],
      "purpose": "After the upstream Operator comparison, explain the Injector shared library and prepared agents inside compatible application processes. Separate runtime startup from Kubernetes workload management.",
      "sources": [
        "presentation/data/injector-intro.json",
        "presentation/injector-diagram.js",
        "https://github.com/open-telemetry/opentelemetry-injector"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 15.03,
          "sampleStart": 15600,
          "sampleEnd": 360720,
          "speaker": "Tyler",
          "text": "The Injector is the shared library in this diagram. It runs inside a compatible process at startup and loads the matching language agent. We prepare the library and supported agents together, instead of having every service team assemble a language-specific installation."
        },
        {
          "start": 15.35,
          "end": 23.03,
          "sampleStart": 368400,
          "sampleEnd": 552720,
          "speaker": "Nikola",
          "text": "It works at process startup; it doesn't manage Kubernetes workloads. We still need a controller to select the workloads and arrange the rollout."
        }
      ],
      "visualCues": [],
      "duration": 23.68,
      "start": 346.12,
      "end": 369.8,
      "audio": "narration/09-injector-intro.mp3"
    },
    {
      "id": "10-install-operator",
      "kind": "controller-intro",
      "title": "Install the namespace-driven controller",
      "plannedDuration": 90,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "For this talk, that controller is RIO: the Runtime Instrumentation Operator in OTelX. This demo uses the bundled prototype of that workflow, building on Jack Berg's work. RIO selects Kubernetes workloads and handles rollout; the Injector loads agents inside the processes."
        },
        {
          "speaker": "Nikola",
          "text": "The idea we'd like to bring upstream is less routine runtime configuration for each team. RIO demonstrates it; the eventual upstream home is still open. Compatibility and unusual startup behavior still need owners."
        },
        {
          "speaker": "Tyler",
          "text": "Let's install the controller. We've prepared the agent bundle, exporter and exclusions. No application namespace is enrolled yet."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/install-operator-edited.mp4",
          "poster": "presentation/images/install-operator-edited-poster.png",
          "atCue": 2
        }
      ],
      "purpose": "Explain why this demo chooses the Injector plus RIO after the Operator comparison. Show the shared bundle, runtime selection and rollout responsibilities, retain compatibility work, and keep the upstream path open.",
      "sources": [
        "components/otel-injector-operator/README.md",
        "components/otel-injector-images/README.md",
        "docs/technical-findings.md#identified-implementation",
        "https://github.com/otelx/rio"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 16.55,
          "sampleStart": 15600,
          "sampleEnd": 397200,
          "speaker": "Tyler",
          "text": "For this talk, that controller is RIO: the Runtime Instrumentation Operator in OTelX. This demo uses the bundled prototype of that workflow, building on Jack Berg's work. RIO selects Kubernetes workloads and handles rollout; the Injector loads agents inside the processes."
        },
        {
          "start": 16.87,
          "end": 29.75,
          "sampleStart": 404880,
          "sampleEnd": 714000,
          "speaker": "Nikola",
          "text": "The idea we'd like to bring upstream is less routine runtime configuration for each team. RIO demonstrates it; the eventual upstream home is still open. Compatibility and unusual startup behavior still need owners."
        },
        {
          "start": 30.07,
          "end": 36.71,
          "sampleStart": 721680,
          "sampleEnd": 881040,
          "speaker": "Tyler",
          "text": "Let's install the controller. We've prepared the agent bundle, exporter and exclusions. No application namespace is enrolled yet."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/install-operator-edited.mp4",
          "poster": "presentation/images/install-operator-edited-poster.png",
          "atCue": 2,
          "start": 30.07,
          "mediaDuration": 10.6
        }
      ],
      "duration": 42.68,
      "start": 369.8,
      "end": 412.48,
      "audio": "narration/10-install-operator.mp3"
    },
    {
      "id": "11-enroll-services",
      "kind": "namespace-rule",
      "title": "Instrument this namespace",
      "plannedDuration": 90,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Instrument demo-apps. That's the selection: one namespace. We haven't listed thirteen services or assigned a language to each one. The prepared bundle supplies the supported runtime choices."
        },
        {
          "speaker": "Tyler",
          "text": "Apply it. RIO performs the rolling restarts for the selected workloads. Checkout keeps its existing direct agent, and the four Go services keep OBI. Compatible new workloads in this namespace inherit the policy."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/instrument-namespace-edited.mp4",
          "poster": "presentation/images/namespace-rule.png",
          "atCue": 1
        }
      ],
      "purpose": "Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.",
      "sources": [
        "demo/k8s/fleet-instrumentation-base.yaml",
        "demo/k8s/instrument-demo-namespace.patch.yaml",
        "public/demo-capture/capture-summary.json"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.93,
          "sampleStart": 15600,
          "sampleEnd": 286320,
          "speaker": "Nikola",
          "text": "Instrument demo-apps. That's the selection: one namespace. We haven't listed thirteen services or assigned a language to each one. The prepared bundle supplies the supported runtime choices."
        },
        {
          "start": 12.25,
          "end": 24.01,
          "sampleStart": 294000,
          "sampleEnd": 576240,
          "speaker": "Tyler",
          "text": "Apply it. RIO performs the rolling restarts for the selected workloads. Checkout keeps its existing direct agent, and the four Go services keep OBI. Compatible new workloads in this namespace inherit the policy."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/instrument-namespace-edited.mp4",
          "poster": "presentation/images/namespace-rule.png",
          "atCue": 1,
          "start": 12.25,
          "mediaDuration": 11.0
        }
      ],
      "duration": 25.28,
      "start": 412.48,
      "end": 437.76,
      "audio": "narration/11-enroll-services.mp3"
    },
    {
      "id": "12-wider-result",
      "kind": "namespace-result",
      "title": "Language detail. OBI alongside it.",
      "plannedDuration": 90,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Fourteen services now have language agents. The four Go services retain OBI. Let's open the result in a fresh order."
        },
        {
          "speaker": "Nikola",
          "text": "Open Cart in this fresh request. These are Ruby-agent observations; we didn't arrange a separate Ruby installation for its team. Now open Currency: that Go service still uses OBI. Fourteen language agents, including Checkout, and four services with OBI."
        },
        {
          "speaker": "Tyler",
          "text": "As the SDKs start exporting, OBI recognizes them and steps back from tracing those processes. We leave it running for the services that still need it."
        },
        {
          "speaker": "Nikola",
          "text": "So the next team can start with its question. Useful detail is already there. That is the result of the namespace rollout."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/fleet-mixed-detail.mp4",
          "poster": "presentation/images/fleet-mixed-detail.png",
          "atCue": 1
        }
      ],
      "purpose": "Keep one fleet result: fourteen language agents plus four Go/OBI services. Open actual Cart Ruby-agent detail and Currency OBI resource attributes in the same fresh request; skip replay after successful live proof.",
      "sources": [
        "presentation/data/resolution.json",
        "docs/customer-resolution.md",
        "components/otel-injector-images/versions.json"
      ],
      "previewVisualIndex": 0,
      "cues": [
        {
          "start": 0.65,
          "end": 7.25,
          "sampleStart": 15600,
          "sampleEnd": 174000,
          "speaker": "Tyler",
          "text": "Fourteen services now have language agents. The four Go services retain OBI. Let's open the result in a fresh order."
        },
        {
          "start": 7.57,
          "end": 24.51,
          "sampleStart": 181680,
          "sampleEnd": 588240,
          "speaker": "Nikola",
          "text": "Open Cart in this fresh request. These are Ruby-agent observations; we didn't arrange a separate Ruby installation for its team. Now open Currency: that Go service still uses OBI. Fourteen language agents, including Checkout, and four services with OBI."
        },
        {
          "start": 24.83,
          "end": 32.83,
          "sampleStart": 595920,
          "sampleEnd": 787920,
          "speaker": "Tyler",
          "text": "As the SDKs start exporting, OBI recognizes them and steps back from tracing those processes. We leave it running for the services that still need it."
        },
        {
          "start": 33.15,
          "end": 40.63,
          "sampleStart": 795600,
          "sampleEnd": 975120,
          "speaker": "Nikola",
          "text": "So the next team can start with its question. Useful detail is already there. That is the result of the namespace rollout."
        }
      ],
      "visualCues": [
        {
          "type": "art",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "presentation/clips/fleet-mixed-detail.mp4",
          "poster": "presentation/images/fleet-mixed-detail.png",
          "atCue": 1,
          "start": 7.57,
          "mediaDuration": 19.04
        }
      ],
      "duration": 41.28,
      "start": 437.76,
      "end": 479.04,
      "audio": "narration/12-wider-result.mp3"
    },
    {
      "id": "14-lifecycle",
      "kind": "lifecycle",
      "title": "Maintain once. Roll out together.",
      "plannedDuration": 45,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "An agent update next month shouldn't mean another setup project for thirteen teams. The platform can update the shared bundle and use the same rollout path. Eligible new services inherit the namespace policy."
        },
        {
          "speaker": "Nikola",
          "text": "Compatibility tests, exceptions and recovery remain real work. We centralize ownership of that shared path. The saving is avoiding the routine setup and updates being arranged independently over and over."
        }
      ],
      "purpose": "Explain shared onboarding and monthly update ownership, with compatibility, exceptions and recovery still maintained by people.",
      "cues": [
        {
          "start": 0.65,
          "end": 11.97,
          "sampleStart": 15600,
          "sampleEnd": 287280,
          "speaker": "Tyler",
          "text": "An agent update next month shouldn't mean another setup project for thirteen teams. The platform can update the shared bundle and use the same rollout path. Eligible new services inherit the namespace policy."
        },
        {
          "start": 12.29,
          "end": 25.33,
          "sampleStart": 294960,
          "sampleEnd": 607920,
          "speaker": "Nikola",
          "text": "Compatibility tests, exceptions and recovery remain real work. We centralize ownership of that shared path. The saving is avoiding the routine setup and updates being arranged independently over and over."
        }
      ],
      "visualCues": [],
      "duration": 26.0,
      "start": 479.04,
      "end": 505.04,
      "audio": "narration/14-lifecycle.mp3"
    },
    {
      "id": "15-adoption",
      "kind": "adoption",
      "title": "Make coverage the default",
      "plannedDuration": 45,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "This is a sketch of language-agent adoption across eligible services. With team-by-team work, one team finishes; another has a release freeze. Add a service or rewrite one in another language, and the gap can open again."
        },
        {
          "speaker": "Tyler",
          "text": "The centralized path covers the eligible services in one rollout, before that first team-by-team increment. New compatible services inherit it. We still maintain the shared path, but routine enrollment doesn't wait for a separate project in every team."
        }
      ],
      "purpose": "Compare one central enrollment and inherited coverage with a team-by-team long tail; explain aloud that the paths are conceptual, not observed adoption data.",
      "sources": [
        "presentation/rollout-charts.js",
        "demo/k8s/instrument-demo-namespace.patch.yaml"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 14.25,
          "sampleStart": 15600,
          "sampleEnd": 342000,
          "speaker": "Nikola",
          "text": "This is a sketch of language-agent adoption across eligible services. With team-by-team work, one team finishes; another has a release freeze. Add a service or rewrite one in another language, and the gap can open again."
        },
        {
          "start": 14.57,
          "end": 27.03,
          "sampleStart": 349680,
          "sampleEnd": 648720,
          "speaker": "Tyler",
          "text": "The centralized path covers the eligible services in one rollout, before that first team-by-team increment. New compatible services inherit it. We still maintain the shared path, but routine enrollment doesn't wait for a separate project in every team."
        }
      ],
      "visualCues": [],
      "duration": 27.68,
      "start": 505.04,
      "end": 532.72,
      "audio": "narration/15-adoption.mp3"
    },
    {
      "id": "15-cost",
      "kind": "cost-timeline",
      "title": "The cost of repeated setup and upkeep",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here's an example for this same eighteen-service application: the thirteen remaining agent setups and two years of monthly updates. Each step is another release to handle. Distributed owners repeat that work; the centralized path shares the setup and update rollouts."
        },
        {
          "speaker": "Nikola",
          "text": "The modeled difference is two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. Time for the next customer problem."
        },
        {
          "speaker": "Tyler",
          "text": "These are assumed setup and rollout hours, not measured cash savings or a complete platform budget. Put your own support and testing costs into the worksheet. We haven't priced the calendar time waiting for other teams."
        }
      ],
      "purpose": "Keep the cumulative setup/upkeep comparison in the same 18-service demo. Step up at each monthly release: 9.75 distributed hours versus 0.75 central hours. Over two years, show 266.5 versus 19.5 hours and emphasize 247 engineering hours freed, with their $24,700 assumed labor value secondary.",
      "sources": [
        "presentation/rollout-charts.js",
        "presentation/data/savings-assumptions.json",
        "docs/instrumentation-savings.md"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 14.91,
          "sampleStart": 15600,
          "sampleEnd": 357840,
          "speaker": "Tyler",
          "text": "Here's an example for this same eighteen-service application: the thirteen remaining agent setups and two years of monthly updates. Each step is another release to handle. Distributed owners repeat that work; the centralized path shares the setup and update rollouts."
        },
        {
          "start": 15.23,
          "end": 25.19,
          "sampleStart": 365520,
          "sampleEnd": 604560,
          "speaker": "Nikola",
          "text": "The modeled difference is two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars of capacity. Time for the next customer problem."
        },
        {
          "start": 25.51,
          "end": 35.95,
          "sampleStart": 612240,
          "sampleEnd": 862800,
          "speaker": "Tyler",
          "text": "These are assumed setup and rollout hours, not measured cash savings or a complete platform budget. Put your own support and testing costs into the worksheet. We haven't priced the calendar time waiting for other teams."
        }
      ],
      "visualCues": [],
      "duration": 36.6,
      "start": 532.72,
      "end": 569.32,
      "audio": "narration/15-cost.mp3"
    },
    {
      "id": "16-close",
      "kind": "close",
      "title": "OpenTelemetry. Ready to install.",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We started with a customer waiting for an order. OBI showed the failed connection. Java detail named the pricing operation. We found the old endpoint setting, removed it, and opened a new trace to see the wait disappear."
        },
        {
          "speaker": "Nikola",
          "text": "Then one namespace choice added language detail across the supported fleet. The next team shouldn't have to repeat our setup before investigating. RIO demonstrates the shared workflow we'd like to bring upstream."
        },
        {
          "speaker": "Tyler",
          "text": "OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service or across a cluster, then use to find what's keeping a customer waiting—and do something about it."
        },
        {
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Thank you."
        }
      ],
      "purpose": "Close with the measured customer improvement and namespace coverage: OpenTelemetry has grown beyond APIs and SDKs into instrumentation users can install for services and clusters. Leave the demo and RIO QR codes visible.",
      "cues": [
        {
          "start": 0.65,
          "end": 12.41,
          "sampleStart": 15600,
          "sampleEnd": 297840,
          "speaker": "Tyler",
          "text": "We started with a customer waiting for an order. OBI showed the failed connection. Java detail named the pricing operation. We found the old endpoint setting, removed it, and opened a new trace to see the wait disappear."
        },
        {
          "start": 12.73,
          "end": 25.29,
          "sampleStart": 305520,
          "sampleEnd": 606960,
          "speaker": "Nikola",
          "text": "Then one namespace choice added language detail across the supported fleet. The next team shouldn't have to repeat our setup before investigating. RIO demonstrates the shared workflow we'd like to bring upstream."
        },
        {
          "start": 25.61,
          "end": 36.93,
          "sampleStart": 614640,
          "sampleEnd": 886320,
          "speaker": "Tyler",
          "text": "OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install on a service or across a cluster, then use to find what's keeping a customer waiting—and do something about it."
        },
        {
          "start": 37.25,
          "end": 41.61,
          "sampleStart": 894000,
          "sampleEnd": 998640,
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Thank you."
        }
      ],
      "visualCues": [],
      "duration": 42.28,
      "start": 569.32,
      "end": 611.6,
      "audio": "narration/16-close.mp3"
    }
  ],
  "sources": [
    {
      "label": "Talk brief and intended Operator extension",
      "path": "docs/talk-brief.md"
    },
    {
      "label": "Storyboard and demo production requirements",
      "path": "public/storyboard.html"
    },
    {
      "label": "Technical findings and implementation boundaries",
      "path": "docs/technical-findings.md"
    },
    {
      "label": "Actual proof mechanism and scope",
      "path": "docs/demo-spec.md"
    },
    {
      "label": "Presentation research and primary references",
      "path": "docs/presentation-research.md"
    },
    {
      "label": "Demo scripting and narration research",
      "path": "docs/animation-script-research.md"
    },
    {
      "label": "Tyler's authorized voice skill",
      "path": "scripts/animation/README.txt"
    },
    {
      "label": "Upstream language and namespace opt-in",
      "url": "https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/"
    },
    {
      "label": "Merged demo namespace controller",
      "path": "components/otel-injector-operator/README.md"
    },
    {
      "label": "Jack Berg prototype source history and attribution",
      "path": "docs/technical-findings.md#identified-implementation"
    }
  ],
  "videoFile": "opentelemetry-far-and-wide-tyler-voice.mp4",
  "speakers": {
    "Tyler": {
      "engine": "tyler-demo-voice",
      "model": "ResembleAI/chatterbox-turbo",
      "revision": "749d1c1a46eb10492095d68fbcf55691ccf137cd",
      "reference": "go",
      "referenceSha256": "be53b05f2c869145f0813a8fde3492c75d7cc64b165339df4f3dac3986dd3467",
      "voiceName": "Tyler Yahn (synthetic)",
      "gender": "male",
      "role": "Tyler, using his authorized synthetic voice"
    },
    "Nikola": {
      "engine": "nikola-demo-voice",
      "model": "ResembleAI/chatterbox-turbo",
      "revision": "749d1c1a46eb10492095d68fbcf55691ccf137cd",
      "reference": "obi",
      "referenceSha256": "5fb94bc64673c7d343b53b01890a26b79cd18381ad90beb2f4742b7b39b43603",
      "voiceName": "Nikola Grcevski (synthetic)",
      "gender": "male",
      "role": "Nikola, using his authorized synthetic voice"
    }
  },
  "bigIdea": "Install visibility, follow the slow request to its stale configuration, fix it without rebuilding, then share that capability across the namespace.",
  "scriptRevision": "2026-11-04-live-path-and-fresh-evidence",
  "timing": "natural",
  "plannedDuration": 1245,
  "maxContentSeconds": 1320,
  "storyRevision": "2026-11-04-live-path-and-fresh-evidence",
  "pronunciation": {
    "RIO": "rhee-o (Spanish río)",
    "OTelX": "oh-tell-X",
    "OBI": "Tyler: short Oh-bee, spoken as one word with no drawn-out Oh"
  },
  "duration": 611.6
};
