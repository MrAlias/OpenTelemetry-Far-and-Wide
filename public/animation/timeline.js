window.TALK = {
  "title": "OpenTelemetry Far and Wide",
  "voice": "Tyler Yahn's and Nikola Grcevski's authorized synthetic voices; not a recording of the presenters",
  "status": "Local demo captures from October 23 and October 26, 2026: 18 application services, PostgreSQL and Redis. The historical opening request is 306.26 ms, with a 151.78 ms initial Checkout interval; Java method detail names the deliberately seeded 150 ms pricing wait. Removing that wait in the application gives 359.9 ms before versus 226.2 ms after in a fresh matched 30-request median comparison with unchanged instrumentation. A later fixed request has 14 SDK services and four OBI-only application services. These are measured local seeded-fault observations, not a production benchmark or an instrumentation speedup. Dollar figures remain a hypothetical labor-capacity model, not measured savings or an average customer result; additional telemetry, support and prototype development need separate estimates.",
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
          "text": "You know the application is slow. The hard part is knowing where to look.",
          "direction": "Warm, conversational opening. Four seconds of title before speaking; let the question land afterward."
        },
        {
          "speaker": "Tyler",
          "text": "Today we'll follow this request with OBI, find the work behind the wait, and fix it. Then we'll come back to the customer's request and check the result. We'll also stop repeating the instrumentation setup across the other services by leveraging the OpenTelemetry Injector and its Kubernetes Operator."
        },
        {
          "speaker": "Nikola",
          "text": "I'm Nikola. Tyler gets the first service. I'll keep an eye on the rest."
        },
        {
          "speaker": "Tyler",
          "text": "I'm Tyler. That sounds suspiciously like you've given me the homework. Let's get straight to the system."
        }
      ],
      "leadInSeconds": 4,
      "pauseAfter": {
        "0": 2.5,
        "1": 1
      },
      "visuals": [
        {
          "at": 0,
          "type": "art"
        },
        {
          "type": "image",
          "src": "demo-capture/request-latency.png",
          "atCue": 0
        }
      ],
      "purpose": "Open a customer problem and promise a measured resolution, then make that investigation capability repeatable across the namespace.",
      "cues": [
        {
          "start": 4.0,
          "end": 7.44,
          "sampleStart": 96000,
          "sampleEnd": 178560,
          "speaker": "Tyler",
          "text": "You know the application is slow. The hard part is knowing where to look."
        },
        {
          "start": 10.16,
          "end": 27.18,
          "sampleStart": 243840,
          "sampleEnd": 652320,
          "speaker": "Tyler",
          "text": "Today we'll follow this request with OBI, find the work behind the wait, and fix it. Then we'll come back to the customer's request and check the result. We'll also stop repeating the instrumentation setup across the other services by leveraging the OpenTelemetry Injector and its Kubernetes Operator."
        },
        {
          "start": 28.5,
          "end": 32.9,
          "sampleStart": 684000,
          "sampleEnd": 789600,
          "speaker": "Nikola",
          "text": "I'm Nikola. Tyler gets the first service. I'll keep an eye on the rest."
        },
        {
          "start": 33.22,
          "end": 38.7,
          "sampleStart": 797280,
          "sampleEnd": 928800,
          "speaker": "Tyler",
          "text": "I'm Tyler. That sounds suspiciously like you've given me the homework. Let's get straight to the system."
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
          "atCue": 0,
          "start": 4.0
        }
      ],
      "duration": 39.36,
      "start": 0,
      "end": 39.36,
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
      "start": 39.36,
      "end": 60.6,
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
      "start": 60.6,
      "end": 84.64,
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
          "at": 0
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
          "start": 0
        }
      ],
      "duration": 20.08,
      "start": 84.64,
      "end": 104.72,
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
      "start": 104.72,
      "end": 122.52,
      "audio": "narration/05-observed-path.mp3"
    },
    {
      "id": "06-local-time",
      "kind": "trace-focus",
      "title": "Find the time before the downstream calls",
      "plannedDuration": 80,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Start with the waterfall. The Gateway span is long, but almost all of that time is spent waiting for Checkout. Checkout's total also contains its downstream calls."
        },
        {
          "speaker": "Nikola",
          "text": "So choosing the longest bar would send us back to the beginning. Look instead at the gap before Checkout makes its first downstream call."
        },
        {
          "speaker": "Tyler",
          "text": "That interval is about a hundred and fifty milliseconds. The downstream services haven't started yet, so they can't explain it. Nearly half of this request is spent before that first call. That is our first useful discovery: look inside Checkout, not at its dependencies."
        },
        {
          "speaker": "Nikola",
          "text": "Now we have a specific question for language-level detail: what is Checkout doing during that wait?"
        }
      ],
      "buildAfter": 1,
      "pauseAfter": {
        "1": 4,
        "2": 3
      },
      "purpose": "Earn Checkout selection from the measured 151.8 ms local interval, not inclusive duration.",
      "cues": [
        {
          "start": 0.65,
          "end": 9.49,
          "sampleStart": 15600,
          "sampleEnd": 227760,
          "speaker": "Tyler",
          "text": "Start with the waterfall. The Gateway span is long, but almost all of that time is spent waiting for Checkout. Checkout's total also contains its downstream calls."
        },
        {
          "start": 9.81,
          "end": 18.29,
          "sampleStart": 235440,
          "sampleEnd": 438960,
          "speaker": "Nikola",
          "text": "So choosing the longest bar would send us back to the beginning. Look instead at the gap before Checkout makes its first downstream call."
        },
        {
          "start": 22.61,
          "end": 36.11,
          "sampleStart": 542640,
          "sampleEnd": 866640,
          "speaker": "Tyler",
          "text": "That interval is about a hundred and fifty milliseconds. The downstream services haven't started yet, so they can't explain it. Nearly half of this request is spent before that first call. That is our first useful discovery: look inside Checkout, not at its dependencies."
        },
        {
          "start": 39.43,
          "end": 44.79,
          "sampleStart": 946320,
          "sampleEnd": 1074960,
          "speaker": "Nikola",
          "text": "Now we have a specific question for language-level detail: what is Checkout doing during that wait?"
        }
      ],
      "buildTime": 22.61,
      "visualCues": [],
      "duration": 45.44,
      "start": 122.52,
      "end": 167.96,
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
          "text": "We have source access here. The pricing calculation happens before the Inventory call. We'll use the Java agent to time that method and expose the library work around it."
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
          "end": 9.13,
          "sampleStart": 15600,
          "sampleEnd": 219120,
          "speaker": "Tyler",
          "text": "We have source access here. The pricing calculation happens before the Inventory call. We'll use the Java agent to time that method and expose the library work around it."
        },
        {
          "start": 9.45,
          "end": 20.53,
          "sampleStart": 226800,
          "sampleEnd": 492720,
          "speaker": "Nikola",
          "text": "This is OpenTelemetry's zero-code instrumentation. The agent supplies the instrumentation; we still need to make it available, add the startup setting, and configure where its data goes."
        },
        {
          "start": 23.85,
          "end": 33.97,
          "sampleStart": 572400,
          "sampleEnd": 815280,
          "speaker": "Tyler",
          "text": "Here's the deployment change. The application image stays the same. We provide the agent, set the service identity and exporter, and enable the pricing-method span. Then we roll Checkout."
        },
        {
          "start": 34.29,
          "end": 43.25,
          "sampleStart": 822960,
          "sampleEnd": 1038000,
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
          "mediaDuration": 16.32
        },
        {
          "type": "video",
          "src": "demo-capture/install-java-agent-edited.mp4",
          "poster": "demo-capture/install-java-agent-edited-poster.png",
          "atCue": 2,
          "start": 23.85,
          "mediaDuration": 27.0
        }
      ],
      "duration": 52.88,
      "start": 167.96,
      "end": 220.84,
      "audio": "narration/07-direct-agent.mp3"
    },
    {
      "id": "08-new-detail",
      "kind": "screen",
      "title": "The missing interval has a name",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Here's a fresh request with the Java agent running. The missing interval now has a name: PricingEngine.calculate."
        },
        {
          "speaker": "Nikola",
          "text": "There it is: about a hundred and fifty milliseconds. Below it, Hibernate and JDBC show the product lookup, the order insert, and the transaction commit."
        },
        {
          "speaker": "Tyler",
          "text": "OBI got us to the right service. The language agent named the work inside it. But naming the wait does not remove it. Let's open that pricing method."
        }
      ],
      "pauseAfter": {
        "0": 4,
        "1": 3
      },
      "visuals": [
        {
          "type": "image",
          "src": "demo-capture/java-detail-poster.png",
          "at": 0
        },
        {
          "type": "video",
          "src": "demo-capture/java-detail.mp4",
          "poster": "demo-capture/java-detail-poster.png",
          "atCue": 1
        }
      ],
      "purpose": "Show the actual 150.4 ms method span and Hibernate/JDBC observations.",
      "cues": [
        {
          "start": 0.65,
          "end": 6.05,
          "sampleStart": 15600,
          "sampleEnd": 145200,
          "speaker": "Tyler",
          "text": "Here's a fresh request with the Java agent running. The missing interval now has a name: PricingEngine.calculate."
        },
        {
          "start": 10.37,
          "end": 19.73,
          "sampleStart": 248880,
          "sampleEnd": 473520,
          "speaker": "Nikola",
          "text": "There it is: about a hundred and fifty milliseconds. Below it, Hibernate and JDBC show the product lookup, the order insert, and the transaction commit."
        },
        {
          "start": 23.05,
          "end": 30.77,
          "sampleStart": 553200,
          "sampleEnd": 738480,
          "speaker": "Tyler",
          "text": "OBI got us to the right service. The language agent named the work inside it. But naming the wait does not remove it. Let's open that pricing method."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "demo-capture/java-detail-poster.png",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "demo-capture/java-detail.mp4",
          "poster": "demo-capture/java-detail-poster.png",
          "atCue": 1,
          "start": 10.37,
          "mediaDuration": 10.2
        }
      ],
      "duration": 31.44,
      "start": 220.84,
      "end": 252.28,
      "audio": "narration/08-new-detail.mp3"
    },
    {
      "id": "08-fix-pricing",
      "kind": "pricing-fix",
      "title": "There's our 150 milliseconds",
      "plannedDuration": 90,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "There is our hundred and fifty milliseconds. This demo deliberately puts a wait inside the pricing method. It is local work, before the first downstream call, exactly where the trace sent us."
        },
        {
          "speaker": "Nikola",
          "text": "So the fix is small: remove that wait and keep the same price. The instrumentation did not make the application faster. It showed us where to act."
        },
        {
          "speaker": "Tyler",
          "text": "Here we deploy the fixed application image. The Java agent, its settings, and the rest of the request path stay the same."
        },
        {
          "speaker": "Nikola",
          "text": "The deployment is ready. A completed rollout is not the customer result. Let's send the request again."
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
      "purpose": "Reveal the exact seeded wait, show its removal without changing the price, and record deployment of the real application fix.",
      "sources": [
        "demo/proof/apps/checkout/PricingEngine.java",
        "demo/apps/checkout/fixes/PricingEngine.java",
        "demo/k8s/checkout-pricing-fixed.patch.yaml",
        "presentation/data/resolution.json"
      ],
      "pauseAfter": {
        "0": 2.5
      },
      "cues": [
        {
          "start": 0.65,
          "end": 10.77,
          "sampleStart": 15600,
          "sampleEnd": 258480,
          "speaker": "Tyler",
          "text": "There is our hundred and fifty milliseconds. This demo deliberately puts a wait inside the pricing method. It is local work, before the first downstream call, exactly where the trace sent us."
        },
        {
          "start": 13.59,
          "end": 22.55,
          "sampleStart": 326160,
          "sampleEnd": 541200,
          "speaker": "Nikola",
          "text": "So the fix is small: remove that wait and keep the same price. The instrumentation did not make the application faster. It showed us where to act."
        },
        {
          "start": 22.87,
          "end": 28.75,
          "sampleStart": 548880,
          "sampleEnd": 690000,
          "speaker": "Tyler",
          "text": "Here we deploy the fixed application image. The Java agent, its settings, and the rest of the request path stay the same."
        },
        {
          "start": 44.19,
          "end": 50.31,
          "sampleStart": 1060560,
          "sampleEnd": 1207440,
          "speaker": "Nikola",
          "text": "The deployment is ready. A completed rollout is not the customer result. Let's send the request again."
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
          "start": 22.87,
          "mediaDuration": 20.32
        }
      ],
      "duration": 50.96,
      "start": 252.28,
      "end": 303.24,
      "audio": "narration/08-fix-pricing.mp3"
    },
    {
      "id": "08-customer-result",
      "kind": "latency-result",
      "title": "The customer gets the time back",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Back to the customer request. In a fresh matched run, the median goes from about three hundred and sixty milliseconds to two hundred and twenty-six. The pricing method goes from a hundred and fifty milliseconds to less than one."
        },
        {
          "speaker": "Nikola",
          "text": "Same price. An order still gets created, and the request still visits all eighteen services. We removed the deliberate wait, not the work needed to finish checkout."
        },
        {
          "speaker": "Tyler",
          "text": "These are medians of thirty warmed requests on each version, with the same instrumentation. It is a measured demo result, not a production benchmark."
        },
        {
          "speaker": "Nikola",
          "text": "Now that is a useful trace. It helped us change the customer experience. The next question is how to make this kind of investigation available to the rest of the teams."
        }
      ],
      "purpose": "Deliver the measured customer payoff before raising the fleet-scale setup challenge; distinguish fresh matched samples from the historical opening exemplar.",
      "sources": [
        "presentation/data/resolution.json",
        "scripts/presentation/measure_resolution.py",
        "docs/customer-resolution.md"
      ],
      "leadInSeconds": 2,
      "pauseAfter": {
        "0": 2.5
      },
      "cues": [
        {
          "start": 2.0,
          "end": 12.64,
          "sampleStart": 48000,
          "sampleEnd": 303360,
          "speaker": "Tyler",
          "text": "Back to the customer request. In a fresh matched run, the median goes from about three hundred and sixty milliseconds to two hundred and twenty-six. The pricing method goes from a hundred and fifty milliseconds to less than one."
        },
        {
          "start": 15.46,
          "end": 24.9,
          "sampleStart": 371040,
          "sampleEnd": 597600,
          "speaker": "Nikola",
          "text": "Same price. An order still gets created, and the request still visits all eighteen services. We removed the deliberate wait, not the work needed to finish checkout."
        },
        {
          "start": 25.22,
          "end": 32.98,
          "sampleStart": 605280,
          "sampleEnd": 791520,
          "speaker": "Tyler",
          "text": "These are medians of thirty warmed requests on each version, with the same instrumentation. It is a measured demo result, not a production benchmark."
        },
        {
          "start": 33.3,
          "end": 43.5,
          "sampleStart": 799200,
          "sampleEnd": 1044000,
          "speaker": "Nikola",
          "text": "Now that is a useful trace. It helped us change the customer experience. The next question is how to make this kind of investigation available to the rest of the teams."
        }
      ],
      "visualCues": [],
      "duration": 44.16,
      "start": 303.24,
      "end": 347.4,
      "audio": "narration/08-customer-result.mp3"
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
      "start": 347.4,
      "end": 376.44,
      "audio": "narration/09-the-rest.mp3"
    },
    {
      "id": "10-operator-opt-in",
      "kind": "operator-opt-in",
      "title": "Injection still needs a selection",
      "plannedDuration": 45,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "The upstream OpenTelemetry Operator can supply the agent. You opt in using language-specific annotations, on workloads or namespaces. That already removes much of the agent setup."
        },
        {
          "speaker": "Nikola",
          "text": "For this mixed-language application, we want one shared choice: instrument the namespace. Then let the system choose the agents and manage the rollout."
        }
      ],
      "purpose": "Credit upstream injection and namespace opt-in, then set up the custom component’s combined namespace selection, runtime handling and rollout value.",
      "sources": [
        "https://opentelemetry.io/docs/platforms/kubernetes/operator/automatic/"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.09,
          "sampleStart": 15600,
          "sampleEnd": 266160,
          "speaker": "Tyler",
          "text": "The upstream OpenTelemetry Operator can supply the agent. You opt in using language-specific annotations, on workloads or namespaces. That already removes much of the agent setup."
        },
        {
          "start": 11.41,
          "end": 20.33,
          "sampleStart": 273840,
          "sampleEnd": 487920,
          "speaker": "Nikola",
          "text": "For this mixed-language application, we want one shared choice: instrument the namespace. Then let the system choose the agents and manage the rollout."
        }
      ],
      "visualCues": [],
      "duration": 21.0,
      "start": 376.44,
      "end": 397.44,
      "audio": "narration/10-operator-opt-in.mp3"
    },
    {
      "id": "10-install-operator",
      "kind": "terminal",
      "title": "Let the namespace be the selection",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "This demo uses the custom namespace-driven controller and the OpenTelemetry Injector. The controller selects workloads and manages their rollout. The Injector detects the supported runtime and loads its language agent."
        },
        {
          "speaker": "Nikola",
          "text": "Here we install the controller once. The agent payload, exporter, and exclusions are shared settings. Next comes the application choice: instrument this namespace."
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
        "docs/technical-findings.md#identified-implementation"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 11.49,
          "sampleStart": 15600,
          "sampleEnd": 275760,
          "speaker": "Tyler",
          "text": "This demo uses the custom namespace-driven controller and the OpenTelemetry Injector. The controller selects workloads and manages their rollout. The Injector detects the supported runtime and loads its language agent."
        },
        {
          "start": 11.81,
          "end": 22.41,
          "sampleStart": 283440,
          "sampleEnd": 537840,
          "speaker": "Nikola",
          "text": "Here we install the controller once. The agent payload, exporter, and exclusions are shared settings. Next comes the application choice: instrument this namespace."
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
      "duration": 23.08,
      "start": 397.44,
      "end": 420.52,
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
          "text": "Here is the whole selection rule: instrument demo-apps. No list of service names. No language-specific annotations on each application."
        },
        {
          "speaker": "Tyler",
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector supplies their agents. The shared rule replaces thirteen deployment edits and manual restarts."
        },
        {
          "speaker": "Nikola",
          "text": "Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. One namespace choice carries the setup across the application."
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
          "end": 9.05,
          "sampleStart": 15600,
          "sampleEnd": 217200,
          "speaker": "Nikola",
          "text": "Here is the whole selection rule: instrument demo-apps. No list of service names. No language-specific annotations on each application."
        },
        {
          "start": 12.37,
          "end": 22.77,
          "sampleStart": 296880,
          "sampleEnd": 546480,
          "speaker": "Tyler",
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector supplies their agents. The shared rule replaces thirteen deployment edits and manual restarts."
        },
        {
          "start": 37.36,
          "end": 50.0,
          "sampleStart": 896640,
          "sampleEnd": 1200000,
          "speaker": "Nikola",
          "text": "Now all the supported services are lit up. Checkout keeps its direct agent, thirteen more services gain language detail, and the four Go services keep OBI. One namespace choice carries the setup across the application."
        }
      ],
      "buildTime": 37.36,
      "visualCues": [
        {
          "type": "video",
          "src": "demo-capture/instrument-namespace-edited.mp4",
          "poster": "demo-capture/instrument-namespace-edited-poster.png",
          "at": 0,
          "start": 0,
          "mediaDuration": 36.36
        },
        {
          "type": "art",
          "atCue": 2,
          "start": 37.36
        }
      ],
      "duration": 50.68,
      "start": 420.52,
      "end": 471.2,
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
          "at": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fixed-fleet-detail.mp4",
          "poster": "demo-capture/fixed-fleet-overview.png",
          "atCue": 1
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
          "start": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fixed-fleet-detail.mp4",
          "poster": "demo-capture/fixed-fleet-overview.png",
          "atCue": 1,
          "start": 11.45,
          "mediaDuration": 11.0
        }
      ],
      "duration": 34.76,
      "start": 471.2,
      "end": 505.96,
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
      "start": 505.96,
      "end": 539.84,
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
      "start": 539.84,
      "end": 571.32,
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
          "text": "Let us compare the actual work in each approach. This is a hypothetical year for our eighteen-service system, at a hundred dollars per person-hour."
        },
        {
          "speaker": "Nikola",
          "text": "Thirteen compatible services remain after our pilot. Initial setup takes thirty-two and a half person-hours across those teams. With the shared tools, we allow two hours for deployment and policy, plus half an hour per service. Eight and a half hours altogether."
        },
        {
          "speaker": "Tyler",
          "text": "Upkeep is where centralization keeps paying back. Four updates take thirty-nine hours when repeated across those services. Four shared updates take four hours. Allow another two hours for service exceptions: six hours instead of thirty-nine. That saves thirty-three hours every year."
        },
        {
          "speaker": "Nikola",
          "text": "Then twelve investigations where OBI adds missing visibility: eighteen person-hours becomes six. Twelve more hours saved. Already have equally useful traces? That part is zero."
        },
        {
          "speaker": "Tyler",
          "text": "Add the three rows: eighty-nine and a half hours before, twenty and a half with the tools. Sixty-nine hours saved, worth sixty-nine hundred dollars of engineering capacity. Central setup and upkeep are already included."
        },
        {
          "speaker": "Nikola",
          "text": "Every time estimate is an assumption to replace with your own. Prototype development, extra telemetry, and support need separate estimates."
        }
      ],
      "purpose": "Compare baseline and shared work directly; show centralized updates once per rollout domain, service exceptions separately, and conditional OBI investigation savings.",
      "sources": [
        "docs/instrumentation-savings.md",
        "presentation/data/savings-assumptions.json",
        "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm",
        "https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 8.33,
          "sampleStart": 15600,
          "sampleEnd": 199920,
          "speaker": "Tyler",
          "text": "Let us compare the actual work in each approach. This is a hypothetical year for our eighteen-service system, at a hundred dollars per person-hour."
        },
        {
          "start": 8.65,
          "end": 25.55,
          "sampleStart": 207600,
          "sampleEnd": 613200,
          "speaker": "Nikola",
          "text": "Thirteen compatible services remain after our pilot. Initial setup takes thirty-two and a half person-hours across those teams. With the shared tools, we allow two hours for deployment and policy, plus half an hour per service. Eight and a half hours altogether."
        },
        {
          "start": 25.87,
          "end": 41.73,
          "sampleStart": 620880,
          "sampleEnd": 1001520,
          "speaker": "Tyler",
          "text": "Upkeep is where centralization keeps paying back. Four updates take thirty-nine hours when repeated across those services. Four shared updates take four hours. Allow another two hours for service exceptions: six hours instead of thirty-nine. That saves thirty-three hours every year."
        },
        {
          "start": 42.05,
          "end": 53.37,
          "sampleStart": 1009200,
          "sampleEnd": 1280880,
          "speaker": "Nikola",
          "text": "Then twelve investigations where OBI adds missing visibility: eighteen person-hours becomes six. Twelve more hours saved. Already have equally useful traces? That part is zero."
        },
        {
          "start": 53.69,
          "end": 66.37,
          "sampleStart": 1288560,
          "sampleEnd": 1592880,
          "speaker": "Tyler",
          "text": "Add the three rows: eighty-nine and a half hours before, twenty and a half with the tools. Sixty-nine hours saved, worth sixty-nine hundred dollars of engineering capacity. Central setup and upkeep are already included."
        },
        {
          "start": 66.69,
          "end": 74.69,
          "sampleStart": 1600560,
          "sampleEnd": 1792560,
          "speaker": "Nikola",
          "text": "Every time estimate is an assumption to replace with your own. Prototype development, extra telemetry, and support need separate estimates."
        }
      ],
      "visualCues": [],
      "duration": 75.36,
      "start": 571.32,
      "end": 646.68,
      "audio": "narration/15-measure.mp3"
    },
    {
      "id": "15-scale",
      "kind": "cost-scale",
      "title": "Repetition changes the economics",
      "plannedDuration": 60,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Keep the same runtime mix, and allow more rollout groups and service exceptions as the fleet grows. At a hundred services, the first-year value is about thirty-eight thousand dollars. At five hundred services, about a hundred and ninety-three thousand dollars. At a thousand services, about three hundred and eighty-six thousand dollars."
        },
        {
          "speaker": "Nikola",
          "text": "The following-year figures are lower because initial setup savings happen once. Centralized upkeep keeps saving work: updates happen per rollout group, plus the service exceptions we explicitly allow for."
        },
        {
          "speaker": "Tyler",
          "text": "These are replaceable assumptions, not average customer results. If existing namespace templates already centralize your updates, compare against that workflow. There may be little extra work left to save."
        },
        {
          "speaker": "Nikola",
          "text": "And capacity is not automatically cash in the bank. We have not priced outages, waiting time, or a smaller telemetry bill."
        }
      ],
      "purpose": "Scale the explicit before/with-tools ledgers using declared rollout groups, exceptions and qualifying investigations; distinguish first-year and recurring capacity.",
      "sources": [
        "docs/instrumentation-savings.md",
        "presentation/data/savings-assumptions.json",
        "public/presentation/savings.html"
      ],
      "cues": [
        {
          "start": 0.65,
          "end": 17.63,
          "sampleStart": 15600,
          "sampleEnd": 423120,
          "speaker": "Tyler",
          "text": "Keep the same runtime mix, and allow more rollout groups and service exceptions as the fleet grows. At a hundred services, the first-year value is about thirty-eight thousand dollars. At five hundred services, about a hundred and ninety-three thousand dollars. At a thousand services, about three hundred and eighty-six thousand dollars."
        },
        {
          "start": 17.95,
          "end": 29.95,
          "sampleStart": 430800,
          "sampleEnd": 718800,
          "speaker": "Nikola",
          "text": "The following-year figures are lower because initial setup savings happen once. Centralized upkeep keeps saving work: updates happen per rollout group, plus the service exceptions we explicitly allow for."
        },
        {
          "start": 30.27,
          "end": 40.31,
          "sampleStart": 726480,
          "sampleEnd": 967440,
          "speaker": "Tyler",
          "text": "These are replaceable assumptions, not average customer results. If existing namespace templates already centralize your updates, compare against that workflow. There may be little extra work left to save."
        },
        {
          "start": 40.63,
          "end": 48.03,
          "sampleStart": 975120,
          "sampleEnd": 1152720,
          "speaker": "Nikola",
          "text": "And capacity is not automatically cash in the bank. We have not priced outages, waiting time, or a smaller telemetry bill."
        }
      ],
      "visualCues": [],
      "duration": 48.68,
      "start": 646.68,
      "end": 695.36,
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
          "text": "We started with a customer waiting for checkout. OBI showed where the time went. The Java agent named the pricing method. We removed the deliberate wait and came back to measure the request."
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
          "end": 12.29,
          "sampleStart": 15600,
          "sampleEnd": 294960,
          "speaker": "Tyler",
          "text": "We started with a customer waiting for checkout. OBI showed where the time went. The Java agent named the pricing method. We removed the deliberate wait and came back to measure the request."
        },
        {
          "start": 12.61,
          "end": 22.37,
          "sampleStart": 302640,
          "sampleEnd": 536880,
          "speaker": "Nikola",
          "text": "Then one namespace choice carried language instrumentation across the supported services. The next team can start with useful detail instead of starting another setup project."
        },
        {
          "start": 22.69,
          "end": 30.21,
          "sampleStart": 544560,
          "sampleEnd": 725040,
          "speaker": "Tyler",
          "text": "The customer gets a faster checkout. The teams get a shared way to investigate the next slow request. That is what the traces and the automation were for."
        },
        {
          "start": 30.53,
          "end": 35.73,
          "sampleStart": 732720,
          "sampleEnd": 857520,
          "speaker": "Nikola",
          "text": "Find the wait. Fix the cause. Make the next investigation easier. Let's take your questions."
        }
      ],
      "visualCues": [],
      "duration": 36.4,
      "start": 695.36,
      "end": 731.76,
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
  "scriptRevision": "Resolve the opening customer latency with a real application fix and matched remeasurement, then make the diagnostic workflow repeatable across services.",
  "timing": "natural",
  "plannedDuration": 1260,
  "maxContentSeconds": 1320,
  "storyRevision": "customer-resolution-2026-10-26",
  "duration": 731.76
};
