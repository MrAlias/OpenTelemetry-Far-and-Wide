window.TALK = {
  "title": "OpenTelemetry Far and Wide",
  "voice": "Tyler Yahn's and Nikola Grcevski's authorized synthetic voices; not a recording of the presenters",
  "status": "Draft narration in authorized synthetic voices; actual demo timeout/fallback and waterfall captures. Monthly centralized-ownership cost scenario uses explicit hypothetical labor inputs.",
  "chapters": [
    {
      "id": "01-promise",
      "kind": "title",
      "title": "OpenTelemetry Far and Wide",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Welcome everyone. I'm Tyler Yahn."
        },
        {
          "speaker": "Nikola",
          "text": "And I'm Nikola Grcevski. Today we're following a slow customer checkout, from the first symptom to a fix."
        },
        {
          "speaker": "Tyler",
          "text": "The application completes the request, but the customer is waiting. We'll use OBI to find where that time goes, add language detail, and change the code responsible. Then we'll make that visibility available across the application with the OpenTelemetry Injector and RIO, its namespace-driven operator."
        },
        {
          "speaker": "Nikola",
          "text": "One customer problem, then a way for the other teams to investigate theirs. Let's open the system."
        }
      ],
      "leadInSeconds": 0.6,
      "visuals": [
        {
          "at": 0,
          "type": "art"
        },
        {
          "type": "image",
          "src": "demo-capture/request-latency.png",
          "atCue": 2
        }
      ],
      "purpose": "Open a customer problem and promise a measured resolution, then make that investigation capability repeatable across the namespace.",
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
          "end": 10.08,
          "sampleStart": 79680,
          "sampleEnd": 241920,
          "speaker": "Nikola",
          "text": "And I'm Nikola Grcevski. Today we're following a slow customer checkout, from the first symptom to a fix."
        },
        {
          "start": 10.4,
          "end": 26.42,
          "sampleStart": 249600,
          "sampleEnd": 634080,
          "speaker": "Tyler",
          "text": "The application completes the request, but the customer is waiting. We'll use OBI to find where that time goes, add language detail, and change the code responsible. Then we'll make that visibility available across the application with the OpenTelemetry Injector and RIO, its namespace-driven operator."
        },
        {
          "start": 26.74,
          "end": 32.38,
          "sampleStart": 641760,
          "sampleEnd": 777120,
          "speaker": "Nikola",
          "text": "One customer problem, then a way for the other teams to investigate theirs. Let's open the system."
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
          "src": "demo-capture/request-latency.png",
          "atCue": 2,
          "start": 10.4
        }
      ],
      "duration": 33.04,
      "start": 0,
      "end": 33.04,
      "audio": "narration/01-promise.mp3"
    },
    {
      "id": "02-topology",
      "kind": "topology",
      "title": "One application, many places to look",
      "plannedDuration": 40,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here is our checkout application: eighteen services, with PostgreSQL and Redis. The Gateway hands the request to Checkout, which calls Inventory and four commerce branches. The map shows what can talk to what; the duration tells us the whole request is slow."
        },
        {
          "speaker": "Nikola",
          "text": "Every team can have a different definition of healthy. Following the request gives us one shared starting point."
        }
      ],
      "purpose": "Orient in the actual application without selecting a culprit.",
      "cues": [
        {
          "start": 0.65,
          "end": 13.91,
          "sampleStart": 15600,
          "sampleEnd": 333840,
          "speaker": "Tyler",
          "text": "Here is our checkout application: eighteen services, with PostgreSQL and Redis. The Gateway hands the request to Checkout, which calls Inventory and four commerce branches. The map shows what can talk to what; the duration tells us the whole request is slow."
        },
        {
          "start": 14.23,
          "end": 20.59,
          "sampleStart": 341520,
          "sampleEnd": 494160,
          "speaker": "Nikola",
          "text": "Every team can have a different definition of healthy. Following the request gives us one shared starting point."
        }
      ],
      "visualCues": [],
      "duration": 21.24,
      "start": 33.04,
      "end": 54.28,
      "audio": "narration/02-topology.mp3"
    },
    {
      "id": "03-install-obi",
      "kind": "terminal",
      "title": "Start with OBI",
      "plannedDuration": 45,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "First, OpenTelemetry eBPF Instrumentation, or OBI. We deploy it and let it discover the running applications."
        },
        {
          "speaker": "Nikola",
          "text": "That gives us service and dependency observations without setting up a language SDK in each application. We can start investigating while the applications keep running."
        },
        {
          "speaker": "Tyler",
          "text": "OBI is ready. Let's open a checkout request."
        }
      ],
      "visuals": [
        {
          "type": "video",
          "src": "demo-capture/install-obi-edited.mp4",
          "poster": "demo-capture/install-obi-edited-poster.png",
          "at": 0
        }
      ],
      "purpose": "Show the real OBI installation, then move to its result.",
      "cues": [
        {
          "start": 0.65,
          "end": 7.01,
          "sampleStart": 15600,
          "sampleEnd": 168240,
          "speaker": "Tyler",
          "text": "First, OpenTelemetry eBPF Instrumentation, or OBI. We deploy it and let it discover the running applications."
        },
        {
          "start": 7.33,
          "end": 17.09,
          "sampleStart": 175920,
          "sampleEnd": 410160,
          "speaker": "Nikola",
          "text": "That gives us service and dependency observations without setting up a language SDK in each application. We can start investigating while the applications keep running."
        },
        {
          "start": 17.41,
          "end": 20.13,
          "sampleStart": 417840,
          "sampleEnd": 483120,
          "speaker": "Tyler",
          "text": "OBI is ready. Let's open a checkout request."
        }
      ],
      "visualCues": [
        {
          "type": "video",
          "src": "demo-capture/install-obi-edited.mp4",
          "poster": "demo-capture/install-obi-edited-poster.png",
          "at": 0,
          "start": 0,
          "mediaDuration": 22.04
        }
      ],
      "duration": 24.04,
      "start": 54.28,
      "end": 78.32,
      "audio": "narration/03-install-obi.mp3"
    },
    {
      "id": "04-connected-trace",
      "kind": "screen",
      "title": "One request across the application",
      "plannedDuration": 55,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "The useful result is a connected trace. This is the request behind the duration we started with."
        },
        {
          "speaker": "Tyler",
          "text": "Now we can see service calls, database work, and how their timings fit together. But a connected trace is not a faster checkout. The customer is still waiting. We need to find the part we can change."
        }
      ],
      "pauseAfter": {
        "0": 4
      },
      "visuals": [
        {
          "type": "image",
          "src": "demo-capture/connected-trace.png",
          "at": 0,
          "focus": "waterfall"
        }
      ],
      "purpose": "Give the connected-trace statement its own actual waterfall exemplar.",
      "cues": [
        {
          "start": 0.65,
          "end": 5.57,
          "sampleStart": 15600,
          "sampleEnd": 133680,
          "speaker": "Nikola",
          "text": "The useful result is a connected trace. This is the request behind the duration we started with."
        },
        {
          "start": 9.89,
          "end": 19.41,
          "sampleStart": 237360,
          "sampleEnd": 465840,
          "speaker": "Tyler",
          "text": "Now we can see service calls, database work, and how their timings fit together. But a connected trace is not a faster checkout. The customer is still waiting. We need to find the part we can change."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "demo-capture/connected-trace.png",
          "at": 0,
          "focus": "waterfall",
          "start": 0
        }
      ],
      "duration": 20.08,
      "start": 78.32,
      "end": 98.4,
      "audio": "narration/04-connected-trace.mp3"
    },
    {
      "id": "05-observed-path",
      "kind": "observed",
      "title": "Follow the cart branch of this request",
      "plannedDuration": 35,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went.",
          "direction": "Invite the viewer to look. Pause before the meaningful result appears."
        },
        {
          "speaker": "Nikola",
          "text": "Here we're following the Cart branch through Catalog, Recommendations, and Promotions. This is one branch of the same request moving through the system."
        }
      ],
      "buildAtCue": 0,
      "buildDelay": 2.5,
      "purpose": "Transform orientation into an observed path, using the captured request.",
      "cues": [
        {
          "start": 0.65,
          "end": 8.33,
          "sampleStart": 15600,
          "sampleEnd": 199920,
          "speaker": "Tyler",
          "text": "Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went."
        },
        {
          "start": 8.65,
          "end": 17.13,
          "sampleStart": 207600,
          "sampleEnd": 411120,
          "speaker": "Nikola",
          "text": "Here we're following the Cart branch through Catalog, Recommendations, and Promotions. This is one branch of the same request moving through the system."
        }
      ],
      "buildTime": 3.15,
      "visualCues": [],
      "duration": 17.8,
      "start": 98.4,
      "end": 116.2,
      "audio": "narration/05-observed-path.mp3"
    },
    {
      "id": "06-local-time",
      "kind": "trace-focus",
      "title": "Find the failed connection on the request path",
      "plannedDuration": 70,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Start with the waterfall. Gateway's long bar includes its wait for Checkout, and Checkout includes its downstream work. The longest parent bar doesn't tell us what to fix."
        },
        {
          "speaker": "Nikola",
          "text": "Look at this failed connection from Checkout instead. It consumes about a hundred and fifty milliseconds before the successful product lookup and the other service calls."
        },
        {
          "speaker": "Tyler",
          "text": "Now we have somewhere specific to investigate: why is Checkout spending time on a connection that fails? OBI has exposed the failed attempt; language detail can connect it to the method and fallback in our code."
        },
        {
          "speaker": "Nikola",
          "text": "Let's open Checkout and follow that connection."
        }
      ],
      "buildAfter": 1,
      "pauseAfter": {
        "1": 1.2
      },
      "purpose": "Select Checkout from the actual failed CONNECT span; use language detail to identify the calling method, timeout exception and working fallback.",
      "cues": [
        {
          "start": 0.65,
          "end": 11.93,
          "sampleStart": 15600,
          "sampleEnd": 286320,
          "speaker": "Tyler",
          "text": "Start with the waterfall. Gateway's long bar includes its wait for Checkout, and Checkout includes its downstream work. The longest parent bar doesn't tell us what to fix."
        },
        {
          "start": 12.25,
          "end": 21.77,
          "sampleStart": 294000,
          "sampleEnd": 522480,
          "speaker": "Nikola",
          "text": "Look at this failed connection from Checkout instead. It consumes about a hundred and fifty milliseconds before the successful product lookup and the other service calls."
        },
        {
          "start": 23.29,
          "end": 33.65,
          "sampleStart": 558960,
          "sampleEnd": 807600,
          "speaker": "Tyler",
          "text": "Now we have somewhere specific to investigate: why is Checkout spending time on a connection that fails? OBI has exposed the failed attempt; language detail can connect it to the method and fallback in our code."
        },
        {
          "start": 33.97,
          "end": 37.25,
          "sampleStart": 815280,
          "sampleEnd": 894000,
          "speaker": "Nikola",
          "text": "Let's open Checkout and follow that connection."
        }
      ],
      "buildTime": 23.29,
      "visualCues": [],
      "duration": 37.92,
      "start": 116.2,
      "end": 154.12,
      "audio": "narration/06-local-time.mp3"
    },
    {
      "id": "07-direct-agent",
      "kind": "terminal",
      "title": "Add Java zero-code instrumentation",
      "plannedDuration": 120,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We have source access here. Pricing runs before Inventory. We'll use the Java agent to time that method and expose the library calls inside it."
        },
        {
          "speaker": "Nikola",
          "text": "This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes."
        },
        {
          "speaker": "Tyler",
          "text": "Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout."
        },
        {
          "speaker": "Nikola",
          "text": "Zero code is useful. It hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change."
        }
      ],
      "pauseAfter": {
        "1": 3
      },
      "visuals": [
        {
          "type": "video",
          "src": "demo-capture/inspect-java-setup-edited.mp4",
          "poster": "demo-capture/inspect-java-setup-edited-poster.png",
          "at": 0
        },
        {
          "type": "video",
          "src": "demo-capture/install-java-agent-edited.mp4",
          "poster": "demo-capture/install-java-agent-edited-poster.png",
          "atCue": 2
        }
      ],
      "purpose": "Show actual source-informed configuration and the real direct-agent installation.",
      "cues": [
        {
          "start": 0.65,
          "end": 8.45,
          "sampleStart": 15600,
          "sampleEnd": 202800,
          "speaker": "Tyler",
          "text": "We have source access here. Pricing runs before Inventory. We'll use the Java agent to time that method and expose the library calls inside it."
        },
        {
          "start": 8.77,
          "end": 19.85,
          "sampleStart": 210480,
          "sampleEnd": 476400,
          "speaker": "Nikola",
          "text": "This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes."
        },
        {
          "start": 23.17,
          "end": 33.29,
          "sampleStart": 556080,
          "sampleEnd": 798960,
          "speaker": "Tyler",
          "text": "Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout."
        },
        {
          "start": 33.61,
          "end": 42.57,
          "sampleStart": 806640,
          "sampleEnd": 1021680,
          "speaker": "Nikola",
          "text": "Zero code is useful. It hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change."
        }
      ],
      "visualCues": [
        {
          "type": "video",
          "src": "demo-capture/inspect-java-setup-edited.mp4",
          "poster": "demo-capture/inspect-java-setup-edited-poster.png",
          "at": 0,
          "start": 0,
          "mediaDuration": 16.16
        },
        {
          "type": "video",
          "src": "demo-capture/install-java-agent-edited.mp4",
          "poster": "demo-capture/install-java-agent-edited-poster.png",
          "atCue": 2,
          "start": 23.17,
          "mediaDuration": 17.88
        }
      ],
      "duration": 43.24,
      "start": 154.12,
      "end": 197.36,
      "audio": "narration/07-direct-agent.mp3"
    },
    {
      "id": "08-new-detail",
      "kind": "screen",
      "title": "A failed attempt before a working fallback",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here's a fresh request with the Java agent. Open PricingEngine.calculate. The long interval contains a failed HTTP connection, then a successful product-price lookup."
        },
        {
          "speaker": "Nikola",
          "text": "That connection is timing out. The fallback works, so Checkout succeeds, but every customer pays for the failed attempt first. Further down, the order insert and the rest of the checkout still complete."
        },
        {
          "speaker": "Tyler",
          "text": "OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now we have a code change to investigate."
        }
      ],
      "pauseAfter": {
        "0": 1
      },
      "visuals": [
        {
          "type": "image",
          "src": "demo-capture/java-detail-poster.png",
          "at": 0,
          "focus": "waterfall"
        },
        {
          "type": "video",
          "src": "demo-capture/java-detail.mp4",
          "poster": "demo-capture/java-detail-poster.png",
          "atCue": 1,
          "focus": "waterfall"
        }
      ],
      "purpose": "Show the actual failed HTTP client span, timeout exception and successful PostgreSQL fallback; keep the trace visible.",
      "cues": [
        {
          "start": 0.65,
          "end": 9.37,
          "sampleStart": 15600,
          "sampleEnd": 224880,
          "speaker": "Tyler",
          "text": "Here's a fresh request with the Java agent. Open PricingEngine.calculate. The long interval contains a failed HTTP connection, then a successful product-price lookup."
        },
        {
          "start": 10.69,
          "end": 22.89,
          "sampleStart": 256560,
          "sampleEnd": 549360,
          "speaker": "Nikola",
          "text": "That connection is timing out. The fallback works, so Checkout succeeds, but every customer pays for the failed attempt first. Further down, the order insert and the rest of the checkout still complete."
        },
        {
          "start": 23.21,
          "end": 30.01,
          "sampleStart": 557040,
          "sampleEnd": 720240,
          "speaker": "Tyler",
          "text": "OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now we have a code change to investigate."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "demo-capture/java-detail-poster.png",
          "at": 0,
          "focus": "waterfall",
          "start": 0
        },
        {
          "type": "video",
          "src": "demo-capture/java-detail.mp4",
          "poster": "demo-capture/java-detail-poster.png",
          "atCue": 1,
          "focus": "waterfall",
          "start": 10.69,
          "mediaDuration": 7.6
        }
      ],
      "duration": 30.68,
      "start": 197.36,
      "end": 228.04,
      "audio": "narration/08-new-detail.mp3"
    },
    {
      "id": "08-fix-pricing",
      "kind": "pricing-fix",
      "title": "Stop calling the retired backend",
      "plannedDuration": 90,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "There it is. Pricing still calls a legacy backend that no longer exists. The connection times out after a hundred and fifty milliseconds, then we read the price from the current product store. The fix is to use that store directly."
        },
        {
          "speaker": "Nikola",
          "text": "Instrumentation didn't fix the code. It enabled us to act. If we can collaborate with the owning team, we can bring a pull request instead of a vague report that their service is slow. Here is the customer impact, here is the trace showing the timeout, and here is a change that removes it while keeping the price lookup."
        },
        {
          "speaker": "Tyler",
          "text": "We're deploying that application change now. The Java agent and exporter settings stay the same."
        },
        {
          "speaker": "Nikola",
          "text": "The rollout is ready. Let's send another customer request and look at its trace."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fix-pricing-edited.mp4",
          "poster": "demo-capture/fix-pricing-edited-poster.png",
          "atCue": 2
        }
      ],
      "alignTurnAfterVisual": {
        "3": 1
      },
      "purpose": "Show the real obsolete-backend attempt and current-store fallback, offer an evidence-backed PR, then deploy the code change.",
      "sources": [
        "demo/apps/checkout/baseline/PricingEngine.java",
        "demo/apps/checkout/fixes/PricingEngine.java",
        "demo/k8s/checkout-pricing-fixed.patch.yaml",
        "presentation/data/resolution.json"
      ],
      "pauseAfter": {},
      "cues": [
        {
          "start": 0.65,
          "end": 13.01,
          "sampleStart": 15600,
          "sampleEnd": 312240,
          "speaker": "Tyler",
          "text": "There it is. Pricing still calls a legacy backend that no longer exists. The connection times out after a hundred and fifty milliseconds, then we read the price from the current product store. The fix is to use that store directly."
        },
        {
          "start": 13.33,
          "end": 30.63,
          "sampleStart": 319920,
          "sampleEnd": 735120,
          "speaker": "Nikola",
          "text": "Instrumentation didn't fix the code. It enabled us to act. If we can collaborate with the owning team, we can bring a pull request instead of a vague report that their service is slow. Here is the customer impact, here is the trace showing the timeout, and here is a change that removes it while keeping the price lookup."
        },
        {
          "start": 30.95,
          "end": 36.03,
          "sampleStart": 742800,
          "sampleEnd": 864720,
          "speaker": "Tyler",
          "text": "We're deploying that application change now. The Java agent and exporter settings stay the same."
        },
        {
          "start": 50.83,
          "end": 55.11,
          "sampleStart": 1219920,
          "sampleEnd": 1322640,
          "speaker": "Nikola",
          "text": "The rollout is ready. Let's send another customer request and look at its trace."
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
          "src": "demo-capture/fix-pricing-edited.mp4",
          "poster": "demo-capture/fix-pricing-edited-poster.png",
          "atCue": 2,
          "start": 30.95,
          "mediaDuration": 18.88
        }
      ],
      "duration": 55.76,
      "start": 228.04,
      "end": 283.8,
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
          "text": "Here is the new request's waterfall. Expand Checkout and PricingEngine.calculate. The product-price query is still here. The failed legacy call is gone, and the rest of the request starts sooner."
        },
        {
          "speaker": "Nikola",
          "text": "Follow it through Inventory, the commerce branches, and the order write. We kept the useful work. The customer gets a faster checkout because we're no longer waiting for a backend that isn't there."
        },
        {
          "speaker": "Tyler",
          "text": "This is the payoff: a customer symptom, an observed cause, a code change, and a fresh trace showing what changed."
        }
      ],
      "purpose": "Return directly to a real Grafana waterfall after deployment; show the missing failed attempt and retained successful backend path before aggregate metrics.",
      "sources": [
        "presentation/data/resolution.json",
        "scripts/presentation/measure_resolution.py",
        "docs/customer-resolution.md"
      ],
      "leadInSeconds": 0.5,
      "visuals": [
        {
          "type": "image",
          "src": "demo-capture/fixed-request-trace.png",
          "at": 0,
          "focus": "waterfall"
        },
        {
          "type": "video",
          "src": "demo-capture/fixed-request-detail.mp4",
          "poster": "demo-capture/fixed-request-trace.png",
          "atCue": 1,
          "focus": "waterfall"
        }
      ],
      "cues": [
        {
          "start": 0.5,
          "end": 10.58,
          "sampleStart": 12000,
          "sampleEnd": 253920,
          "speaker": "Tyler",
          "text": "Here is the new request's waterfall. Expand Checkout and PricingEngine.calculate. The product-price query is still here. The failed legacy call is gone, and the rest of the request starts sooner."
        },
        {
          "start": 10.9,
          "end": 23.26,
          "sampleStart": 261600,
          "sampleEnd": 558240,
          "speaker": "Nikola",
          "text": "Follow it through Inventory, the commerce branches, and the order write. We kept the useful work. The customer gets a faster checkout because we're no longer waiting for a backend that isn't there."
        },
        {
          "start": 23.58,
          "end": 29.62,
          "sampleStart": 565920,
          "sampleEnd": 710880,
          "speaker": "Tyler",
          "text": "This is the payoff: a customer symptom, an observed cause, a code change, and a fresh trace showing what changed."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "demo-capture/fixed-request-trace.png",
          "at": 0,
          "focus": "waterfall",
          "start": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fixed-request-detail.mp4",
          "poster": "demo-capture/fixed-request-trace.png",
          "atCue": 1,
          "focus": "waterfall",
          "start": 10.9,
          "mediaDuration": 10.0
        }
      ],
      "duration": 30.28,
      "start": 283.8,
      "end": 314.08,
      "audio": "narration/08-customer-result.mp3"
    },
    {
      "id": "08-result-summary",
      "kind": "latency-result",
      "title": "The improvement across repeated requests",
      "plannedDuration": 35,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "In a matched run, the median customer request fell from about three hundred and sixty-two milliseconds to two hundred and fourteen. Pricing fell from about a hundred and fifty-seven milliseconds to about four. The repeated-request result supports what we saw in the waterfall."
        },
        {
          "speaker": "Nikola",
          "text": "That summary supports the trace we just saw. It is a local demo comparison, not a production benchmark. Next, how do we make the same diagnostic detail available to the other teams?"
        }
      ],
      "purpose": "Summarize matched measured request durations only after the audience has seen the actual post-fix waterfall.",
      "sources": [
        "presentation/data/resolution.json"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 13.71,
          "sampleStart": 15600,
          "sampleEnd": 329040,
          "speaker": "Tyler",
          "text": "In a matched run, the median customer request fell from about three hundred and sixty-two milliseconds to two hundred and fourteen. Pricing fell from about a hundred and fifty-seven milliseconds to about four. The repeated-request result supports what we saw in the waterfall."
        },
        {
          "start": 14.03,
          "end": 24.63,
          "sampleStart": 336720,
          "sampleEnd": 591120,
          "speaker": "Nikola",
          "text": "That summary supports the trace we just saw. It is a local demo comparison, not a production benchmark. Next, how do we make the same diagnostic detail available to the other teams?"
        }
      ],
      "visualCues": [],
      "duration": 25.28,
      "start": 314.08,
      "end": 339.36,
      "audio": "narration/08-result-summary.mp3"
    },
    {
      "id": "09-the-rest",
      "kind": "scale",
      "title": "One fixed. Thirteen to equip.",
      "plannedDuration": 45,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?"
        },
        {
          "speaker": "Tyler",
          "text": "In this demo, thirteen more services use runtimes in the Injector payload. The Go services keep their OBI coverage. Our next step is to share the setup across those thirteen."
        },
        {
          "speaker": "Nikola",
          "text": "And share the routine work around it. Not every team has our access, our runtime knowledge, or an empty release queue."
        }
      ],
      "purpose": "Turn the resolved customer delay into the second tension: make the same diagnostic detail available to the other teams without repeating the direct setup.",
      "cues": [
        {
          "start": 0.65,
          "end": 11.13,
          "sampleStart": 15600,
          "sampleEnd": 267120,
          "speaker": "Nikola",
          "text": "We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?"
        },
        {
          "start": 11.45,
          "end": 20.97,
          "sampleStart": 274800,
          "sampleEnd": 503280,
          "speaker": "Tyler",
          "text": "In this demo, thirteen more services use runtimes in the Injector payload. The Go services keep their OBI coverage. Our next step is to share the setup across those thirteen."
        },
        {
          "start": 21.29,
          "end": 28.37,
          "sampleStart": 510960,
          "sampleEnd": 680880,
          "speaker": "Nikola",
          "text": "And share the routine work around it. Not every team has our access, our runtime knowledge, or an empty release queue."
        }
      ],
      "visualCues": [],
      "duration": 29.04,
      "start": 339.36,
      "end": 368.4,
      "audio": "narration/09-the-rest.mp3"
    },
    {
      "id": "10-operator-opt-in",
      "kind": "operator-opt-in",
      "title": "From language opt-in to a shared namespace policy",
      "plannedDuration": 45,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "To see what we're centralizing, here's the upstream Operator's opt-in configuration. Java and Python have different injection annotations, with an Instrumentation resource supplying their settings. You can put those annotations on workloads or a namespace."
        },
        {
          "speaker": "Nikola",
          "text": "That already saves work. RIO, the Runtime Instrumentation Operator from OTelX, takes a different route: select the namespace centrally, let the Injector detect supported runtimes, and let the controller manage existing workloads. This demo uses the bundled prototype that led to RIO, not an upstream Operator installation."
        }
      ],
      "purpose": "Show real upstream configuration for context, credit namespace opt-in, and name the independent RIO project and bundled prototype accurately.",
      "sources": [
        "https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/",
        "https://github.com/otelx/rio"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 13.23,
          "sampleStart": 15600,
          "sampleEnd": 317520,
          "speaker": "Tyler",
          "text": "To see what we're centralizing, here's the upstream Operator's opt-in configuration. Java and Python have different injection annotations, with an Instrumentation resource supplying their settings. You can put those annotations on workloads or a namespace."
        },
        {
          "start": 13.55,
          "end": 32.77,
          "sampleStart": 325200,
          "sampleEnd": 786480,
          "speaker": "Nikola",
          "text": "That already saves work. RIO, the Runtime Instrumentation Operator from OTelX, takes a different route: select the namespace centrally, let the Injector detect supported runtimes, and let the controller manage existing workloads. This demo uses the bundled prototype that led to RIO, not an upstream Operator installation."
        }
      ],
      "visualCues": [],
      "duration": 33.44,
      "start": 368.4,
      "end": 401.84,
      "audio": "narration/10-operator-opt-in.mp3"
    },
    {
      "id": "10-install-operator",
      "kind": "terminal",
      "title": "Install the namespace-driven controller",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here we install the namespace-driven controller once. This is the demo's RIO precursor, working with the OpenTelemetry Injector. The controller selects workloads and manages rollout; the Injector detects supported runtimes and loads their agents."
        },
        {
          "speaker": "Nikola",
          "text": "The payload, exporter, and exclusions are shared settings. Application owners don't each choose a language annotation and arrange a separate instrumentation rollout. Next comes the application choice: instrument this namespace."
        }
      ],
      "visuals": [
        {
          "type": "video",
          "src": "demo-capture/install-operator-edited.mp4",
          "poster": "demo-capture/install-operator-edited-poster.png",
          "at": 0
        }
      ],
      "purpose": "Install the merged custom component as a distinct step after upstream opt-in; earn the namespace-wide payoff.",
      "sources": [
        "components/otel-injector-operator/README.md",
        "components/otel-injector-images/README.md",
        "docs/technical-findings.md#identified-implementation",
        "https://github.com/otelx/rio"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 13.79,
          "sampleStart": 15600,
          "sampleEnd": 330960,
          "speaker": "Tyler",
          "text": "Here we install the namespace-driven controller once. This is the demo's RIO precursor, working with the OpenTelemetry Injector. The controller selects workloads and manages rollout; the Injector detects supported runtimes and loads their agents."
        },
        {
          "start": 14.11,
          "end": 27.07,
          "sampleStart": 338640,
          "sampleEnd": 649680,
          "speaker": "Nikola",
          "text": "The payload, exporter, and exclusions are shared settings. Application owners don't each choose a language annotation and arrange a separate instrumentation rollout. Next comes the application choice: instrument this namespace."
        }
      ],
      "visualCues": [
        {
          "type": "video",
          "src": "demo-capture/install-operator-edited.mp4",
          "poster": "demo-capture/install-operator-edited-poster.png",
          "at": 0,
          "start": 0,
          "mediaDuration": 14.2
        }
      ],
      "duration": 27.72,
      "start": 401.84,
      "end": 429.56,
      "audio": "narration/10-install-operator.mp3"
    },
    {
      "id": "11-enroll-services",
      "kind": "namespace-result",
      "title": "Instrument this namespace",
      "plannedDuration": 105,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Here is the selection rule: instrument demo-apps. We select the application boundary once. Unlike the language opt-in we just showed, this rule doesn't list languages or individual services."
        },
        {
          "speaker": "Tyler",
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector detects their runtimes and supplies the agents. Compatible services deployed into the namespace later inherit the same policy."
        },
        {
          "speaker": "Nikola",
          "text": "Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it."
        }
      ],
      "visuals": [
        {
          "type": "video",
          "src": "demo-capture/instrument-namespace-edited.mp4",
          "poster": "demo-capture/instrument-namespace-edited-poster.png",
          "at": 0
        },
        {
          "type": "art",
          "atCue": 2
        }
      ],
      "purpose": "Show the actual single namespace selection and automatic rollout, then light the actual covered fleet using the captured result.",
      "pauseAfter": {
        "0": 3,
        "1": 3
      },
      "buildAtCue": 2,
      "buildDelay": 0,
      "alignTurnAfterVisual": {
        "2": 0
      },
      "sources": [
        "demo/k8s/fleet-instrumentation-base.yaml",
        "demo/k8s/instrument-demo-namespace.patch.yaml",
        "public/demo-capture/capture-summary.json"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.25,
          "sampleStart": 15600,
          "sampleEnd": 270000,
          "speaker": "Nikola",
          "text": "Here is the selection rule: instrument demo-apps. We select the application boundary once. Unlike the language opt-in we just showed, this rule doesn't list languages or individual services."
        },
        {
          "start": 14.57,
          "end": 27.09,
          "sampleStart": 349680,
          "sampleEnd": 650160,
          "speaker": "Tyler",
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector detects their runtimes and supplies the agents. Compatible services deployed into the namespace later inherit the same policy."
        },
        {
          "start": 40.36,
          "end": 55.58,
          "sampleStart": 968640,
          "sampleEnd": 1333920,
          "speaker": "Nikola",
          "text": "Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it."
        }
      ],
      "buildTime": 40.36,
      "visualCues": [
        {
          "type": "video",
          "src": "demo-capture/instrument-namespace-edited.mp4",
          "poster": "demo-capture/instrument-namespace-edited-poster.png",
          "at": 0,
          "start": 0,
          "mediaDuration": 39.36
        },
        {
          "type": "art",
          "atCue": 2,
          "start": 40.36
        }
      ],
      "duration": 56.24,
      "start": 429.56,
      "end": 485.8,
      "audio": "narration/11-enroll-services.mp3"
    },
    {
      "id": "12-wider-result",
      "kind": "screen",
      "title": "Open language detail in more services",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Back in the application view, we're looking at a new request through the instrumented fleet. We still have the system view, and now we can open language-level observations in more services."
        },
        {
          "speaker": "Nikola",
          "text": "Let's follow Catalog. These are the Java agent's database spans from that service. The same enrollment also covers the Node, Python, Ruby, and dot net services in this application."
        },
        {
          "speaker": "Tyler",
          "text": "The namespace rule got us here without a separate instrumentation change from each application team. Checkout keeps its fix. Now the other teams have the language detail ready for their next investigation too."
        }
      ],
      "visuals": [
        {
          "type": "image",
          "src": "demo-capture/fixed-fleet-overview.png",
          "at": 0,
          "focus": "waterfall"
        },
        {
          "type": "video",
          "src": "demo-capture/fixed-fleet-detail.mp4",
          "poster": "demo-capture/fixed-fleet-overview.png",
          "atCue": 1,
          "focus": "waterfall"
        }
      ],
      "purpose": "Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.",
      "sources": [
        "presentation/data/resolution.json",
        "docs/customer-resolution.md",
        "components/otel-injector-images/versions.json"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.13,
          "sampleStart": 15600,
          "sampleEnd": 267120,
          "speaker": "Tyler",
          "text": "Back in the application view, we're looking at a new request through the instrumented fleet. We still have the system view, and now we can open language-level observations in more services."
        },
        {
          "start": 11.45,
          "end": 22.53,
          "sampleStart": 274800,
          "sampleEnd": 540720,
          "speaker": "Nikola",
          "text": "Let's follow Catalog. These are the Java agent's database spans from that service. The same enrollment also covers the Node, Python, Ruby, and dot net services in this application."
        },
        {
          "start": 22.85,
          "end": 34.09,
          "sampleStart": 548400,
          "sampleEnd": 818160,
          "speaker": "Tyler",
          "text": "The namespace rule got us here without a separate instrumentation change from each application team. Checkout keeps its fix. Now the other teams have the language detail ready for their next investigation too."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "demo-capture/fixed-fleet-overview.png",
          "at": 0,
          "focus": "waterfall",
          "start": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fixed-fleet-detail.mp4",
          "poster": "demo-capture/fixed-fleet-overview.png",
          "atCue": 1,
          "focus": "waterfall",
          "start": 11.45,
          "mediaDuration": 10.04
        }
      ],
      "duration": 34.76,
      "start": 485.8,
      "end": 520.56,
      "audio": "narration/12-wider-result.mp3"
    },
    {
      "id": "13-hidden-cost",
      "kind": "savings",
      "title": "The work around a deployment adds up",
      "plannedDuration": 55,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Think about the direct setup we watched. We knew the runtime, had access, and controlled the release. How much happens before someone in a real organization can even begin?"
        },
        {
          "speaker": "Nikola",
          "text": "Find an owner. Explain the request. A ticket, a meeting, access, review, and a release slot. Then somebody switches away from their feature work."
        },
        {
          "speaker": "Tyler",
          "text": "One namespace choice can remove repeated enrollment changes and keep shared settings consistent. The saving is more than typing fewer commands."
        },
        {
          "speaker": "Nikola",
          "text": "It is fewer people arranging the same work. Count their active effort separately from the time spent waiting."
        }
      ],
      "purpose": "Connect the demonstrated workflow to people, coordination and waiting.",
      "cues": [
        {
          "start": 0.65,
          "end": 9.49,
          "sampleStart": 15600,
          "sampleEnd": 227760,
          "speaker": "Tyler",
          "text": "Think about the direct setup we watched. We knew the runtime, had access, and controlled the release. How much happens before someone in a real organization can even begin?"
        },
        {
          "start": 9.81,
          "end": 19.73,
          "sampleStart": 235440,
          "sampleEnd": 473520,
          "speaker": "Nikola",
          "text": "Find an owner. Explain the request. A ticket, a meeting, access, review, and a release slot. Then somebody switches away from their feature work."
        },
        {
          "start": 20.05,
          "end": 27.29,
          "sampleStart": 481200,
          "sampleEnd": 654960,
          "speaker": "Tyler",
          "text": "One namespace choice can remove repeated enrollment changes and keep shared settings consistent. The saving is more than typing fewer commands."
        },
        {
          "start": 27.61,
          "end": 33.21,
          "sampleStart": 662640,
          "sampleEnd": 797040,
          "speaker": "Nikola",
          "text": "It is fewer people arranging the same work. Count their active effort separately from the time spent waiting."
        }
      ],
      "visualCues": [],
      "duration": 33.88,
      "start": 520.56,
      "end": 554.44,
      "audio": "narration/13-hidden-cost.mp3"
    },
    {
      "id": "14-lifecycle",
      "kind": "lifecycle",
      "title": "Reuse the workflow after day one",
      "plannedDuration": 50,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "And setup is only the first bill. A new service arrives. An agent needs an update. A team needs to turn instrumentation off."
        },
        {
          "speaker": "Nikola",
          "text": "Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve."
        },
        {
          "speaker": "Tyler",
          "text": "That can reduce drift and repeated troubleshooting. But the platform does not maintain itself."
        },
        {
          "speaker": "Nikola",
          "text": "Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too."
        }
      ],
      "purpose": "Cover onboarding, updates, consistency, recovery, training and shared upkeep.",
      "cues": [
        {
          "start": 0.65,
          "end": 7.13,
          "sampleStart": 15600,
          "sampleEnd": 171120,
          "speaker": "Tyler",
          "text": "And setup is only the first bill. A new service arrives. An agent needs an update. A team needs to turn instrumentation off."
        },
        {
          "start": 7.45,
          "end": 18.17,
          "sampleStart": 178800,
          "sampleEnd": 436080,
          "speaker": "Nikola",
          "text": "Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve."
        },
        {
          "start": 18.49,
          "end": 23.41,
          "sampleStart": 443760,
          "sampleEnd": 561840,
          "speaker": "Tyler",
          "text": "That can reduce drift and repeated troubleshooting. But the platform does not maintain itself."
        },
        {
          "start": 23.73,
          "end": 30.81,
          "sampleStart": 569520,
          "sampleEnd": 739440,
          "speaker": "Nikola",
          "text": "Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too."
        }
      ],
      "visualCues": [],
      "duration": 31.48,
      "start": 554.44,
      "end": 585.92,
      "audio": "narration/14-lifecycle.mp3"
    },
    {
      "id": "15-measure",
      "kind": "cost-demo",
      "title": "Put a price on the repetition",
      "plannedDuration": 80,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Let's price that difference in ownership. This is a hypothetical year, at a hundred dollars per person-hour. Thirteen compatible services remain after our common pilot."
        },
        {
          "speaker": "Nikola",
          "text": "With distributed ownership, allow two and a half hours per team to arrange and deploy its instrumentation. Thirteen teams means thirty-two and a half hours. RIO centralizes the setup. Allow one hour for the controller and namespace policy, plus thirty minutes to deploy OBI. Once for the namespace. There is no additional setup allowance for each service."
        },
        {
          "speaker": "Tyler",
          "text": "Now assume an agent release every month. Thirteen separately owned updates versus one shared update: a hundred and fifty-six operations versus twelve in a year. At an assumed forty-five minutes each, that's a hundred and seventeen hours versus nine. A hundred and eight hours saved every year."
        },
        {
          "speaker": "Nikola",
          "text": "We give neither side a faster-investigation credit once both have equivalent telemetry. OBI gives us broad initial visibility; we count its deployment once, not once per incident."
        },
        {
          "speaker": "Tyler",
          "text": "Setup plus monthly upkeep saves a hundred and thirty-nine person-hours in this scenario: thirteen thousand nine hundred dollars of engineering capacity in year one. Ten thousand eight hundred in following years. Replace the assumed hours with your own; this is not a measured customer saving."
        }
      ],
      "purpose": "Compare distributed ownership against one centralized namespace setup and twelve monthly shared agent updates; show operations before dollars, with zero investigation-time credit.",
      "sources": [
        "docs/instrumentation-savings.md",
        "presentation/data/savings-assumptions.json",
        "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
        "https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 9.37,
          "sampleStart": 15600,
          "sampleEnd": 224880,
          "speaker": "Tyler",
          "text": "Let's price that difference in ownership. This is a hypothetical year, at a hundred dollars per person-hour. Thirteen compatible services remain after our common pilot."
        },
        {
          "start": 9.69,
          "end": 32.19,
          "sampleStart": 232560,
          "sampleEnd": 772560,
          "speaker": "Nikola",
          "text": "With distributed ownership, allow two and a half hours per team to arrange and deploy its instrumentation. Thirteen teams means thirty-two and a half hours. RIO centralizes the setup. Allow one hour for the controller and namespace policy, plus thirty minutes to deploy OBI. Once for the namespace. There is no additional setup allowance for each service."
        },
        {
          "start": 32.51,
          "end": 48.13,
          "sampleStart": 780240,
          "sampleEnd": 1155120,
          "speaker": "Tyler",
          "text": "Now assume an agent release every month. Thirteen separately owned updates versus one shared update: a hundred and fifty-six operations versus twelve in a year. At an assumed forty-five minutes each, that's a hundred and seventeen hours versus nine. A hundred and eight hours saved every year."
        },
        {
          "start": 48.45,
          "end": 59.53,
          "sampleStart": 1162800,
          "sampleEnd": 1428720,
          "speaker": "Nikola",
          "text": "We give neither side a faster-investigation credit once both have equivalent telemetry. OBI gives us broad initial visibility; we count its deployment once, not once per incident."
        },
        {
          "start": 59.85,
          "end": 74.11,
          "sampleStart": 1436400,
          "sampleEnd": 1778640,
          "speaker": "Tyler",
          "text": "Setup plus monthly upkeep saves a hundred and thirty-nine person-hours in this scenario: thirteen thousand nine hundred dollars of engineering capacity in year one. Ten thousand eight hundred in following years. Replace the assumed hours with your own; this is not a measured customer saving."
        }
      ],
      "visualCues": [],
      "duration": 74.8,
      "start": 585.92,
      "end": 660.72,
      "audio": "narration/15-measure.mp3"
    },
    {
      "id": "15-scale",
      "kind": "cost-scale",
      "title": "Repetition changes the economics",
      "plannedDuration": 45,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "The same assumptions give about eighty-five thousand dollars of capacity for a hundred services in year one, four hundred and forty thousand for five hundred, and eight hundred and eighty-two thousand for a thousand."
        },
        {
          "speaker": "Nikola",
          "text": "These are scenarios, not a scaling law. We retain the demo's supported-runtime mix and allow more independent rollout domains as the fleet grows. Each domain pays for its shared setup and monthly updates once."
        },
        {
          "speaker": "Tyler",
          "text": "Already centralized? Compare against that workflow. Equivalent work should give zero saving. Extra compatibility testing, exceptions, hardening, and support need their own estimates. We haven't priced incident response, waiting time, or a smaller telemetry bill."
        }
      ],
      "purpose": "Extrapolate explicit ownership and monthly-update assumptions, with no invented per-investigation or telemetry-bill saving.",
      "sources": [
        "docs/instrumentation-savings.md",
        "presentation/data/savings-assumptions.json",
        "public/presentation/savings.html"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 10.57,
          "sampleStart": 15600,
          "sampleEnd": 253680,
          "speaker": "Tyler",
          "text": "The same assumptions give about eighty-five thousand dollars of capacity for a hundred services in year one, four hundred and forty thousand for five hundred, and eight hundred and eighty-two thousand for a thousand."
        },
        {
          "start": 10.89,
          "end": 23.93,
          "sampleStart": 261360,
          "sampleEnd": 574320,
          "speaker": "Nikola",
          "text": "These are scenarios, not a scaling law. We retain the demo's supported-runtime mix and allow more independent rollout domains as the fleet grows. Each domain pays for its shared setup and monthly updates once."
        },
        {
          "start": 24.25,
          "end": 38.35,
          "sampleStart": 582000,
          "sampleEnd": 920400,
          "speaker": "Tyler",
          "text": "Already centralized? Compare against that workflow. Equivalent work should give zero saving. Extra compatibility testing, exceptions, hardening, and support need their own estimates. We haven't priced incident response, waiting time, or a smaller telemetry bill."
        }
      ],
      "visualCues": [],
      "duration": 39.0,
      "start": 660.72,
      "end": 699.72,
      "audio": "narration/15-scale.mp3"
    },
    {
      "id": "16-close",
      "kind": "close",
      "title": "Less waiting. More services ready.",
      "plannedDuration": 55,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We started with a customer waiting for checkout. OBI showed the failed connection. The Java agent connected it to pricing and its fallback. We removed the stale backend attempt, then returned to the actual request trace to see the change."
        },
        {
          "speaker": "Nikola",
          "text": "Then one namespace choice carried language instrumentation across the supported services. The next team can start with useful detail instead of starting another setup project."
        },
        {
          "speaker": "Tyler",
          "text": "The customer gets a faster checkout. The teams get a shared way to investigate the next slow request. That is what the traces and the automation were for."
        },
        {
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Let's take your questions."
        }
      ],
      "purpose": "Close the customer-latency loop and the shared-workflow loop together; leave both outcomes visible during questions.",
      "cues": [
        {
          "start": 0.65,
          "end": 14.29,
          "sampleStart": 15600,
          "sampleEnd": 342960,
          "speaker": "Tyler",
          "text": "We started with a customer waiting for checkout. OBI showed the failed connection. The Java agent connected it to pricing and its fallback. We removed the stale backend attempt, then returned to the actual request trace to see the change."
        },
        {
          "start": 14.61,
          "end": 24.37,
          "sampleStart": 350640,
          "sampleEnd": 584880,
          "speaker": "Nikola",
          "text": "Then one namespace choice carried language instrumentation across the supported services. The next team can start with useful detail instead of starting another setup project."
        },
        {
          "start": 24.69,
          "end": 32.21,
          "sampleStart": 592560,
          "sampleEnd": 773040,
          "speaker": "Tyler",
          "text": "The customer gets a faster checkout. The teams get a shared way to investigate the next slow request. That is what the traces and the automation were for."
        },
        {
          "start": 32.53,
          "end": 37.73,
          "sampleStart": 780720,
          "sampleEnd": 905520,
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Let's take your questions."
        }
      ],
      "visualCues": [],
      "duration": 38.4,
      "start": 699.72,
      "end": 738.12,
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
  "bigIdea": "Follow a slow customer request from broad visibility to a specific cause, fix and measure the wait, then share that investigation capability across the namespace.",
  "scriptRevision": "2026-10-27-natural-intro-rio-monthly-ownership",
  "timing": "natural",
  "plannedDuration": 1260,
  "maxContentSeconds": 1320,
  "storyRevision": "2026-10-27-timeout-fallback-and-real-trace",
  "duration": 738.12
};
