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
          "text": "The application completes the request, but the customer is waiting. We'll follow that request across the system, add language detail, and remove the stale setting behind the delay. Then we'll use the OpenTelemetry Injector and a small demo operator to share that setup across the application."
        },
        {
          "speaker": "Nikola",
          "text": "One customer problem, then a way for each of the teams in the organization to investigate theirs. Let's open the system."
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
          "end": 24.1,
          "sampleStart": 249600,
          "sampleEnd": 578400,
          "speaker": "Tyler",
          "text": "The application completes the request, but the customer is waiting. We'll follow that request across the system, add language detail, and remove the stale setting behind the delay. Then we'll use the OpenTelemetry Injector and a small demo operator to share that setup across the application."
        },
        {
          "start": 24.42,
          "end": 31.9,
          "sampleStart": 586080,
          "sampleEnd": 765600,
          "speaker": "Nikola",
          "text": "One customer problem, then a way for each of the teams in the organization to investigate theirs. Let's open the system."
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
      "duration": 32.56,
      "start": 0,
      "end": 32.56,
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
      "start": 32.56,
      "end": 53.8,
      "audio": "narration/02-topology.mp3"
    },
    {
      "id": "03-install-obi",
      "kind": "obi-intro",
      "title": "Meet OBI",
      "plannedDuration": 70,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "First, OpenTelemetry eBPF Instrumentation, or OBI. It's a zero-code way to observe running Linux applications. It uses eBPF to watch application and network activity, then exports OpenTelemetry traces and metrics."
        },
        {
          "speaker": "Nikola",
          "text": "We're getting a starting point across the application without asking each team to add a library or restart its service. That's a lot of visibility before the first instrumentation ticket. We showed this idea last year in Atlanta. Now OBI is version one and generally available."
        },
        {
          "speaker": "Tyler",
          "text": "And this is more than a service map. OBI follows supported calls across service boundaries, including our HTTP, PostgreSQL, and Redis traffic. Let's deploy it on the nodes and let it discover the running applications."
        },
        {
          "speaker": "Nikola",
          "text": "One deployment. Eighteen services to investigate. Much better odds than guessing which team to call. Let's open a request."
        }
      ],
      "visuals": [
        {
          "type": "art",
          "at": 0
        },
        {
          "type": "video",
          "src": "demo-capture/install-obi-edited.mp4",
          "poster": "demo-capture/install-obi-edited-poster.png",
          "atCue": 2
        }
      ],
      "purpose": "Introduce OBI before its acronym is used: eBPF observations of running Linux applications, zero app changes/restarts, traces and metrics. Show deployment only after explaining its value.",
      "previewVisualIndex": 0,
      "sources": [
        "https://opentelemetry.io/docs/zero-code/obi/",
        "demo/k8s/obi.yaml"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 14.57,
          "sampleStart": 15600,
          "sampleEnd": 349680,
          "speaker": "Tyler",
          "text": "First, OpenTelemetry eBPF Instrumentation, or OBI. It's a zero-code way to observe running Linux applications. It uses eBPF to watch application and network activity, then exports OpenTelemetry traces and metrics."
        },
        {
          "start": 14.89,
          "end": 30.95,
          "sampleStart": 357360,
          "sampleEnd": 742800,
          "speaker": "Nikola",
          "text": "We're getting a starting point across the application without asking each team to add a library or restart its service. That's a lot of visibility before the first instrumentation ticket. We showed this idea last year in Atlanta. Now OBI is version one and generally available."
        },
        {
          "start": 31.27,
          "end": 42.87,
          "sampleStart": 750480,
          "sampleEnd": 1028880,
          "speaker": "Tyler",
          "text": "And this is more than a service map. OBI follows supported calls across service boundaries, including our HTTP, PostgreSQL, and Redis traffic. Let's deploy it on the nodes and let it discover the running applications."
        },
        {
          "start": 43.19,
          "end": 50.71,
          "sampleStart": 1036560,
          "sampleEnd": 1217040,
          "speaker": "Nikola",
          "text": "One deployment. Eighteen services to investigate. Much better odds than guessing which team to call. Let's open a request."
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
          "src": "demo-capture/install-obi-edited.mp4",
          "poster": "demo-capture/install-obi-edited-poster.png",
          "atCue": 2,
          "start": 31.27,
          "mediaDuration": 22.04
        }
      ],
      "duration": 55.32,
      "start": 53.8,
      "end": 109.12,
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
          "text": "Look what that one OBI deployment gave us. This is the slow request behind the opening number, followed across the application. Here are the HTTP calls and the PostgreSQL price query, before we've added a language agent to any service."
        },
        {
          "speaker": "Tyler",
          "text": "Different languages, one request we can follow. We've gone from a customer waiting for seconds to a specific set of service calls and durations. That's a huge head start for such a small setup. The customer is still waiting, though. Let's find the part we can change."
        }
      ],
      "pauseAfter": {
        "0": 1
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
          "end": 15.81,
          "sampleStart": 15600,
          "sampleEnd": 379440,
          "speaker": "Nikola",
          "text": "Look what that one OBI deployment gave us. This is the slow request behind the opening number, followed across the application. Here are the HTTP calls and the PostgreSQL price query, before we've added a language agent to any service."
        },
        {
          "start": 17.13,
          "end": 31.39,
          "sampleStart": 411120,
          "sampleEnd": 753360,
          "speaker": "Tyler",
          "text": "Different languages, one request we can follow. We've gone from a customer waiting for seconds to a specific set of service calls and durations. That's a huge head start for such a small setup. The customer is still waiting, though. Let's find the part we can change."
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
      "duration": 32.04,
      "start": 109.12,
      "end": 141.16,
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
          "text": "Watch the plain topology turn into an observed request path. We can now ask which calls happened, which services handled them, and where the time went."
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
      "start": 141.16,
      "end": 158.96,
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
          "text": "Start with the waterfall. Gateway's long span includes its wait for Checkout, and Checkout's span includes its downstream work. The longest parent span doesn't tell us what to fix."
        },
        {
          "speaker": "Nikola",
          "text": "Look at this failed connection from Checkout instead. It consumes about two seconds before the successful product lookup and the other service calls."
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
          "end": 9.93,
          "sampleStart": 15600,
          "sampleEnd": 238320,
          "speaker": "Tyler",
          "text": "Start with the waterfall. Gateway's long span includes its wait for Checkout, and Checkout's span includes its downstream work. The longest parent span doesn't tell us what to fix."
        },
        {
          "start": 10.25,
          "end": 17.45,
          "sampleStart": 246000,
          "sampleEnd": 418800,
          "speaker": "Nikola",
          "text": "Look at this failed connection from Checkout instead. It consumes about two seconds before the successful product lookup and the other service calls."
        },
        {
          "start": 18.97,
          "end": 30.41,
          "sampleStart": 455280,
          "sampleEnd": 729840,
          "speaker": "Tyler",
          "text": "Now we have somewhere specific to investigate: why is Checkout spending time on a connection that fails? OBI has exposed the failed attempt; language detail can connect it to the method and fallback in our code."
        },
        {
          "start": 30.73,
          "end": 34.01,
          "sampleStart": 737520,
          "sampleEnd": 816240,
          "speaker": "Nikola",
          "text": "Let's open Checkout and follow that connection."
        }
      ],
      "buildTime": 18.97,
      "visualCues": [],
      "duration": 34.68,
      "start": 158.96,
      "end": 193.64,
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
          "text": "Zero code is useful, but hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change."
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
          "end": 42.85,
          "sampleStart": 806640,
          "sampleEnd": 1028400,
          "speaker": "Nikola",
          "text": "Zero code is useful, but hasn't made the release calendar disappear. Someone still needs the runtime knowledge, the settings, and a way to deploy the change."
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
      "duration": 43.52,
      "start": 193.64,
      "end": 237.16,
      "audio": "narration/07-direct-agent.mp3"
    },
    {
      "id": "08-new-detail",
      "kind": "timeout-evidence",
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
          "text": "Open the failed HTTP span. Its error type is Java's SocketTimeoutException. The exception event says, Connect timed out. That is a connection timeout. The product-price lookup after it succeeds, so Checkout completes, but the customer pays for the failed attempt first."
        },
        {
          "speaker": "Tyler",
          "text": "OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now let's find out why this instance is still calling that old address."
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
          "type": "art",
          "atCue": 1
        },
        {
          "type": "image",
          "src": "demo-capture/java-detail-poster.png",
          "atCue": 2,
          "focus": "waterfall"
        }
      ],
      "purpose": "Show the actual HTTP span error.type and exception event before calling the failure a timeout; return to the successful price lookup.",
      "sources": [
        "public/demo-capture/java-trace-evidence.json",
        "https://opentelemetry.io/docs/specs/semconv/http/http-spans/",
        "https://opentelemetry.io/docs/specs/semconv/exceptions/exceptions-spans/"
      ],
      "previewVisualIndex": 1,
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
          "end": 27.11,
          "sampleStart": 256560,
          "sampleEnd": 650640,
          "speaker": "Nikola",
          "text": "Open the failed HTTP span. Its error type is Java's SocketTimeoutException. The exception event says, Connect timed out. That is a connection timeout. The product-price lookup after it succeeds, so Checkout completes, but the customer pays for the failed attempt first."
        },
        {
          "start": 27.43,
          "end": 36.51,
          "sampleStart": 658320,
          "sampleEnd": 876240,
          "speaker": "Tyler",
          "text": "OBI got us to Checkout. The language agent exposed the failed attempt and the working fallback. Now let's find out why this instance is still calling that old address."
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
          "type": "art",
          "atCue": 1,
          "start": 10.69
        },
        {
          "type": "image",
          "src": "demo-capture/java-detail-poster.png",
          "atCue": 2,
          "focus": "waterfall",
          "start": 27.43
        }
      ],
      "duration": 37.16,
      "start": 237.16,
      "end": 274.32,
      "audio": "narration/08-new-detail.mp3"
    },
    {
      "id": "08-fix-pricing",
      "kind": "configuration-fix",
      "title": "Remove the stale endpoint setting",
      "plannedDuration": 90,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Checkout's resource attributes show LEGACY_PRICING_URL. Its value matches the failing URL. This instance is still configured to try a retired backend before it uses the working product store."
        },
        {
          "speaker": "Nikola",
          "text": "Instrumentation didn't remove that setting. It gave us the evidence to act. If we can collaborate with the owning team, we can bring a configuration pull request: here is the customer impact, here is the timeout, and here is the stale setting to remove. We can fix this without rebuilding the application."
        },
        {
          "speaker": "Tyler",
          "text": "Remove LEGACY_PRICING_URL from the Deployment. Kubernetes rolls Checkout with the same application image, Java agent, and exporter settings. Only the legacy endpoint setting changes."
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
      "purpose": "Show the real Checkout resource attribute identifying the stale endpoint. Remove that environment variable and roll the same image; bring the owning team a configuration PR backed by the customer trace.",
      "sources": [
        "demo/apps/checkout/src/main/java/demo/checkout/PricingEngine.java",
        "demo/apps/checkout/launch.sh",
        "demo/k8s/checkout-pricing-fixed.patch.yaml",
        "public/demo-capture/java-trace-evidence.json",
        "presentation/data/resolution.json"
      ],
      "pauseAfter": {},
      "previewVisualIndex": 0,
      "cues": [
        {
          "start": 0.65,
          "end": 11.45,
          "sampleStart": 15600,
          "sampleEnd": 274800,
          "speaker": "Tyler",
          "text": "Checkout's resource attributes show LEGACY_PRICING_URL. Its value matches the failing URL. This instance is still configured to try a retired backend before it uses the working product store."
        },
        {
          "start": 11.77,
          "end": 29.55,
          "sampleStart": 282480,
          "sampleEnd": 709200,
          "speaker": "Nikola",
          "text": "Instrumentation didn't remove that setting. It gave us the evidence to act. If we can collaborate with the owning team, we can bring a configuration pull request: here is the customer impact, here is the timeout, and here is the stale setting to remove. We can fix this without rebuilding the application."
        },
        {
          "start": 29.87,
          "end": 40.07,
          "sampleStart": 716880,
          "sampleEnd": 961680,
          "speaker": "Tyler",
          "text": "Remove LEGACY_PRICING_URL from the Deployment. Kubernetes rolls Checkout with the same application image, Java agent, and exporter settings. Only the legacy endpoint setting changes."
        },
        {
          "start": 60.23,
          "end": 64.51,
          "sampleStart": 1445520,
          "sampleEnd": 1548240,
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
          "start": 29.87,
          "mediaDuration": 29.36
        }
      ],
      "duration": 65.2,
      "start": 274.32,
      "end": 339.52,
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
          "text": "This is the payoff: a customer symptom, an observed cause, one configuration change, and a fresh trace showing the failed call has disappeared."
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
          "end": 31.46,
          "sampleStart": 565920,
          "sampleEnd": 755040,
          "speaker": "Tyler",
          "text": "This is the payoff: a customer symptom, an observed cause, one configuration change, and a fresh trace showing the failed call has disappeared."
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
          "mediaDuration": 10.12
        }
      ],
      "duration": 32.12,
      "start": 339.52,
      "end": 371.64,
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
          "text": "Across matched requests, checkout falls from seconds to a fraction of a second. Pricing no longer spends two seconds waiting for the retired backend. The graph summarizes the same change we just followed in the waterfall: keep the useful work, remove the unnecessary wait."
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
          "end": 13.47,
          "sampleStart": 15600,
          "sampleEnd": 323280,
          "speaker": "Tyler",
          "text": "Across matched requests, checkout falls from seconds to a fraction of a second. Pricing no longer spends two seconds waiting for the retired backend. The graph summarizes the same change we just followed in the waterfall: keep the useful work, remove the unnecessary wait."
        },
        {
          "start": 13.79,
          "end": 24.39,
          "sampleStart": 330960,
          "sampleEnd": 585360,
          "speaker": "Nikola",
          "text": "That summary supports the trace we just saw. It is a local demo comparison, not a production benchmark. Next, how do we make the same diagnostic detail available to the other teams?"
        }
      ],
      "visualCues": [],
      "duration": 25.04,
      "start": 371.64,
      "end": 396.68,
      "audio": "narration/08-result-summary.mp3"
    },
    {
      "id": "09-the-rest",
      "kind": "scale",
      "title": "One fixed. Thirteen to equip.",
      "plannedDuration": 40,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "We've fixed this checkout. But getting to that answer needed runtime knowledge, configuration, access, and a deployment. How do the other teams get this detail without repeating all that setup?"
        },
        {
          "speaker": "Tyler",
          "text": "In this demo, thirteen more services use runtimes supported by the OTel Injector. The Go services will keep their OBI coverage. Our next step is to share the setup across those thirteen."
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
          "end": 25.13,
          "sampleStart": 274800,
          "sampleEnd": 603120,
          "speaker": "Tyler",
          "text": "In this demo, thirteen more services use runtimes supported by the OTel Injector. The Go services will keep their OBI coverage. Our next step is to share the setup across those thirteen."
        }
      ],
      "visualCues": [],
      "duration": 25.8,
      "start": 396.68,
      "end": 422.48,
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
          "text": "That already saves work. For this talk, we built RIO, the Runtime Instrumentation Operator, in OTelX. It's a demo operator that combines central namespace selection, the OpenTelemetry Injector, and managed rollouts. We want to bring this capability upstream, whether in the existing Operator or another form. That path still needs design and agreement."
        }
      ],
      "purpose": "Put upstream opt-in in context, then explain RIO as a talk-specific demonstration of functionality we want upstream; no agreed implementation or roadmap.",
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
          "end": 37.25,
          "sampleStart": 325200,
          "sampleEnd": 894000,
          "speaker": "Nikola",
          "text": "That already saves work. For this talk, we built RIO, the Runtime Instrumentation Operator, in OTelX. It's a demo operator that combines central namespace selection, the OpenTelemetry Injector, and managed rollouts. We want to bring this capability upstream, whether in the existing Operator or another form. That path still needs design and agreement."
        }
      ],
      "visualCues": [],
      "duration": 37.92,
      "start": 422.48,
      "end": 460.4,
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
          "text": "Here we install the demo controller once. It builds on Jack Berg's prototype. The controller selects workloads and manages their rollout. The OpenTelemetry Injector handles supported runtimes and loads their agents."
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
      "purpose": "Install the talk-specific controller and shared Injector settings once; demonstrate the workflow rather than recommend RIO as a production dependency.",
      "sources": [
        "components/otel-injector-operator/README.md",
        "components/otel-injector-images/README.md",
        "docs/technical-findings.md#identified-implementation",
        "https://github.com/otelx/rio"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.49,
          "sampleStart": 15600,
          "sampleEnd": 275760,
          "speaker": "Tyler",
          "text": "Here we install the demo controller once. It builds on Jack Berg's prototype. The controller selects workloads and manages their rollout. The OpenTelemetry Injector handles supported runtimes and loads their agents."
        },
        {
          "start": 11.81,
          "end": 24.77,
          "sampleStart": 283440,
          "sampleEnd": 594480,
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
      "duration": 25.44,
      "start": 460.4,
      "end": 485.84,
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
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector injects and supplies the OTel agents. Compatible services deployed into the namespace later inherit the same policy."
        },
        {
          "speaker": "Nikola",
          "text": "Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it. OBI is still running here. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI for every service."
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
          "end": 25.61,
          "sampleStart": 349680,
          "sampleEnd": 614640,
          "speaker": "Tyler",
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector injects and supplies the OTel agents. Compatible services deployed into the namespace later inherit the same policy."
        },
        {
          "start": 41.2,
          "end": 68.16,
          "sampleStart": 988800,
          "sampleEnd": 1635840,
          "speaker": "Nikola",
          "text": "Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. The ongoing responsibility lives with the platform, instead of thirteen application teams repeating it. OBI is still running here. It detects services already exporting traces through an OpenTelemetry SDK and avoids duplicate tracing. We didn't have to reconfigure OBI for every service."
        }
      ],
      "buildTime": 41.2,
      "visualCues": [
        {
          "type": "video",
          "src": "demo-capture/instrument-namespace-edited.mp4",
          "poster": "demo-capture/instrument-namespace-edited-poster.png",
          "at": 0,
          "start": 0,
          "mediaDuration": 40.2
        },
        {
          "type": "art",
          "atCue": 2,
          "start": 41.2
        }
      ],
      "duration": 68.84,
      "start": 485.84,
      "end": 554.68,
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
          "mediaDuration": 10.0
        }
      ],
      "duration": 34.76,
      "start": 554.68,
      "end": 589.44,
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
      "start": 589.44,
      "end": 623.32,
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
          "text": "Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve. A runtime change doesn't automatically mean a new onboarding project: OBI can keep the baseline for supported traffic, while language-level detail depends on the runtime."
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
          "end": 28.39,
          "sampleStart": 178800,
          "sampleEnd": 681360,
          "speaker": "Nikola",
          "text": "Compatible new services inherit the namespace choice. Updates reuse the shared rollout path. Configuration, documentation, and recovery instructions have one place to improve. A runtime change doesn't automatically mean a new onboarding project: OBI can keep the baseline for supported traffic, while language-level detail depends on the runtime."
        },
        {
          "start": 28.71,
          "end": 33.63,
          "sampleStart": 689040,
          "sampleEnd": 807120,
          "speaker": "Tyler",
          "text": "That can reduce drift and repeated troubleshooting. But the platform does not maintain itself."
        },
        {
          "start": 33.95,
          "end": 41.03,
          "sampleStart": 814800,
          "sampleEnd": 984720,
          "speaker": "Nikola",
          "text": "Exactly. Compatibility, rollout, and recovery still need people. Their time goes into the calculation too."
        }
      ],
      "visualCues": [],
      "duration": 41.68,
      "start": 623.32,
      "end": 665.0,
      "audio": "narration/14-lifecycle.mp3"
    },
    {
      "id": "15-adoption",
      "kind": "adoption",
      "title": "Make coverage the default",
      "plannedDuration": 50,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "This is a sketch of adoption, not measured rollout data. Team-by-team ownership advances in steps: one service, then another. Busy teams create a long tail that may never reach full coverage."
        },
        {
          "speaker": "Tyler",
          "text": "And the finish line moves. New services arrive. Someone rewrites a service from Java to Python, and the old instrumentation setup no longer fits. Coverage can drop while other teams are still catching up."
        },
        {
          "speaker": "Nikola",
          "text": "Central policy makes coverage the default. One rollout reaches the eligible services in scope, and new compatible workloads inherit it. The platform still tests and maintains that shared path."
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
          "end": 11.81,
          "sampleStart": 15600,
          "sampleEnd": 283440,
          "speaker": "Nikola",
          "text": "This is a sketch of adoption, not measured rollout data. Team-by-team ownership advances in steps: one service, then another. Busy teams create a long tail that may never reach full coverage."
        },
        {
          "start": 12.13,
          "end": 23.77,
          "sampleStart": 291120,
          "sampleEnd": 570480,
          "speaker": "Tyler",
          "text": "And the finish line moves. New services arrive. Someone rewrites a service from Java to Python, and the old instrumentation setup no longer fits. Coverage can drop while other teams are still catching up."
        },
        {
          "start": 24.09,
          "end": 35.77,
          "sampleStart": 578160,
          "sampleEnd": 858480,
          "speaker": "Nikola",
          "text": "Central policy makes coverage the default. One rollout reaches the eligible services in scope, and new compatible workloads inherit it. The platform still tests and maintains that shared path."
        }
      ],
      "visualCues": [],
      "duration": 36.44,
      "start": 665.0,
      "end": 701.44,
      "audio": "narration/15-adoption.mp3"
    },
    {
      "id": "15-cost",
      "kind": "cost-timeline",
      "title": "The cost of team-by-team ownership",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Let's keep the cost comparison in this demo. Eighteen services, thirteen of them still needing language instrumentation after our first example. These steps show setup and two years of monthly agent updates. Each jump is another release."
        },
        {
          "speaker": "Nikola",
          "text": "With distributed ownership, each service owner arranges the work. With centralized control, we set up the namespace once and share each update. Both lines include upkeep; the centralized path still costs engineering time."
        },
        {
          "speaker": "Tyler",
          "text": "Over two years, that frees two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars. From setup and monthly updates, in the same small application we've been investigating."
        },
        {
          "speaker": "Nikola",
          "text": "These are assumed person-hours valued at a hundred dollars an hour, not a measured cash saving. Include your own compatibility and support costs. We haven't priced the calendar time spent waiting for other teams."
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
          "end": 13.17,
          "sampleStart": 15600,
          "sampleEnd": 316080,
          "speaker": "Tyler",
          "text": "Let's keep the cost comparison in this demo. Eighteen services, thirteen of them still needing language instrumentation after our first example. These steps show setup and two years of monthly agent updates. Each jump is another release."
        },
        {
          "start": 13.49,
          "end": 27.05,
          "sampleStart": 323760,
          "sampleEnd": 649200,
          "speaker": "Nikola",
          "text": "With distributed ownership, each service owner arranges the work. With centralized control, we set up the namespace once and share each update. Both lines include upkeep; the centralized path still costs engineering time."
        },
        {
          "start": 27.37,
          "end": 39.87,
          "sampleStart": 656880,
          "sampleEnd": 956880,
          "speaker": "Tyler",
          "text": "Over two years, that frees two hundred and forty-seven engineering hours. At a hundred dollars an hour, that's twenty-four thousand seven hundred dollars. From setup and monthly updates, in the same small application we've been investigating."
        },
        {
          "start": 40.19,
          "end": 51.51,
          "sampleStart": 964560,
          "sampleEnd": 1236240,
          "speaker": "Nikola",
          "text": "These are assumed person-hours valued at a hundred dollars an hour, not a measured cash saving. Include your own compatibility and support costs. We haven't priced the calendar time spent waiting for other teams."
        }
      ],
      "visualCues": [],
      "duration": 52.16,
      "start": 701.44,
      "end": 753.6,
      "audio": "narration/15-cost.mp3"
    },
    {
      "id": "16-close",
      "kind": "close",
      "title": "OpenTelemetry. Ready to install.",
      "plannedDuration": 50,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We started with a customer waiting. OBI showed the failed connection. The Java agent tied it to pricing, and the resource attributes exposed a stale endpoint setting. We removed that setting, rolled the same image, and checked the next request's trace."
        },
        {
          "speaker": "Nikola",
          "text": "Then one namespace choice carried language instrumentation across the supported services. RIO demonstrates that shared workflow; we want an upstream home for the idea. The next team should start with useful detail, instead of another setup project."
        },
        {
          "speaker": "Tyler",
          "text": "OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install: on a service, across a cluster. From a customer waiting to a cause you can act on. Less setup. More answers."
        },
        {
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Thank you. Let's take your questions."
        }
      ],
      "purpose": "Close with the measured customer improvement and namespace coverage: OpenTelemetry has grown beyond APIs and SDKs into instrumentation users can install for services and clusters. Leave the demo and RIO QR codes visible.",
      "cues": [
        {
          "start": 0.65,
          "end": 13.39,
          "sampleStart": 15600,
          "sampleEnd": 321360,
          "speaker": "Tyler",
          "text": "We started with a customer waiting. OBI showed the failed connection. The Java agent tied it to pricing, and the resource attributes exposed a stale endpoint setting. We removed that setting, rolled the same image, and checked the next request's trace."
        },
        {
          "start": 13.71,
          "end": 28.33,
          "sampleStart": 329040,
          "sampleEnd": 679920,
          "speaker": "Nikola",
          "text": "Then one namespace choice carried language instrumentation across the supported services. RIO demonstrates that shared workflow; we want an upstream home for the idea. The next team should start with useful detail, instead of another setup project."
        },
        {
          "start": 28.65,
          "end": 42.81,
          "sampleStart": 687600,
          "sampleEnd": 1027440,
          "speaker": "Tyler",
          "text": "OpenTelemetry has grown beyond APIs and SDKs. It's instrumentation you can install: on a service, across a cluster. From a customer waiting to a cause you can act on. Less setup. More answers."
        },
        {
          "start": 43.13,
          "end": 49.93,
          "sampleStart": 1035120,
          "sampleEnd": 1198320,
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Thank you. Let's take your questions."
        }
      ],
      "visualCues": [],
      "duration": 50.6,
      "start": 753.6,
      "end": 804.2,
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
  "scriptRevision": "2026-11-02-configuration-fix-and-readable-slide-scripts",
  "timing": "natural",
  "plannedDuration": 1260,
  "maxContentSeconds": 1320,
  "storyRevision": "2026-11-02-configured-legacy-endpoint",
  "pronunciation": {
    "RIO": "rhee-o (Spanish río)",
    "OTelX": "oh-tell-X",
    "OBI": "Tyler: short Oh-bee, spoken as one word with no drawn-out Oh"
  },
  "duration": 804.2
};
