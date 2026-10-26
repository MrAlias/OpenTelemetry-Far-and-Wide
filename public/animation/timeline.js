window.TALK = {
  "title": "OpenTelemetry Far and Wide",
  "voice": "Tyler Yahn's and Nikola Grcevski's authorized synthetic voices; not a recording of the presenters",
  "status": "Recorded local demonstration on October 23, 2026: 18 application services, PostgreSQL and Redis. Captured request: 306.26 ms; Checkout initial local interval: 151.78 ms; a fresh Java-agent request shows PricingEngine.calculate at 150.38 ms. Direct Checkout plus 13 operator-enrolled services produce language SDK spans; four Go services retain OBI. Dollar figures are an explicitly hypothetical labor-capacity model, not measured savings or an average customer result; additional telemetry, support and prototype hardening are outside the headline amounts.",
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
          "text": "Today we'll follow a request across our application with OBI, find where the time goes, and add detail where we need it. Then we'll show how to stop repeating the setup for the rest of the services by leveraging the OpenTelemetry Injector and its Kubernetes Operator."
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
      "purpose": "Make the slow request visible before introducing the investigation.",
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
          "end": 23.18,
          "sampleStart": 243840,
          "sampleEnd": 556320,
          "speaker": "Tyler",
          "text": "Today we'll follow a request across our application with OBI, find where the time goes, and add detail where we need it. Then we'll show how to stop repeating the setup for the rest of the services by leveraging the OpenTelemetry Injector and its Kubernetes Operator."
        },
        {
          "start": 24.5,
          "end": 28.9,
          "sampleStart": 588000,
          "sampleEnd": 693600,
          "speaker": "Nikola",
          "text": "I'm Nikola. Tyler gets the first service. I'll keep an eye on the rest."
        },
        {
          "start": 29.22,
          "end": 34.7,
          "sampleStart": 701280,
          "sampleEnd": 832800,
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
      "duration": 35.36,
      "start": 0,
      "end": 35.36,
      "audio": "narration/01-promise.mp3"
    },
    {
      "id": "02-topology",
      "kind": "topology",
      "title": "One application, many places to look",
      "plannedDuration": 50,
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
      "start": 35.36,
      "end": 56.6,
      "audio": "narration/02-topology.mp3"
    },
    {
      "id": "03-install-obi",
      "kind": "terminal",
      "title": "Start with OBI",
      "plannedDuration": 60,
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
      "start": 56.6,
      "end": 80.64,
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
          "text": "Now we can see service calls, database work, and how their timings fit together. We can move from the application is slow to a place worth investigating."
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
          "end": 17.13,
          "sampleStart": 237360,
          "sampleEnd": 411120,
          "speaker": "Tyler",
          "text": "Now we can see service calls, database work, and how their timings fit together. We can move from the application is slow to a place worth investigating."
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
      "duration": 17.8,
      "start": 80.64,
      "end": 98.44,
      "audio": "narration/04-connected-trace.mp3"
    },
    {
      "id": "05-observed-path",
      "kind": "observed",
      "title": "Follow the cart branch of this request",
      "plannedDuration": 45,
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
      "start": 98.44,
      "end": 116.24,
      "audio": "narration/05-observed-path.mp3"
    },
    {
      "id": "06-local-time",
      "kind": "trace-focus",
      "title": "Find the time before the downstream calls",
      "plannedDuration": 95,
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
          "text": "That interval is about a hundred and fifty milliseconds. The downstream services haven't started yet, so they can't explain it. This is the part we want to understand inside Checkout."
        },
        {
          "speaker": "Nikola",
          "text": "Now we've got a reason to add language-level detail."
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
          "end": 31.17,
          "sampleStart": 542640,
          "sampleEnd": 748080,
          "speaker": "Tyler",
          "text": "That interval is about a hundred and fifty milliseconds. The downstream services haven't started yet, so they can't explain it. This is the part we want to understand inside Checkout."
        },
        {
          "start": 34.49,
          "end": 37.69,
          "sampleStart": 827760,
          "sampleEnd": 904560,
          "speaker": "Nikola",
          "text": "Now we've got a reason to add language-level detail."
        }
      ],
      "buildTime": 22.61,
      "visualCues": [],
      "duration": 38.36,
      "start": 116.24,
      "end": 154.6,
      "audio": "narration/06-local-time.mp3"
    },
    {
      "id": "07-direct-agent",
      "kind": "terminal",
      "title": "Add Java zero-code instrumentation",
      "plannedDuration": 150,
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
      "start": 154.6,
      "end": 207.48,
      "audio": "narration/07-direct-agent.mp3"
    },
    {
      "id": "08-new-detail",
      "kind": "screen",
      "title": "The missing interval has a name",
      "plannedDuration": 75,
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
          "text": "OBI got us to the right service. The language agent gave us a way to describe the work inside it."
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
          "end": 27.81,
          "sampleStart": 553200,
          "sampleEnd": 667440,
          "speaker": "Tyler",
          "text": "OBI got us to the right service. The language agent gave us a way to describe the work inside it."
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
      "duration": 28.48,
      "start": 207.48,
      "end": 235.96,
      "audio": "narration/08-new-detail.mp3"
    },
    {
      "id": "09-the-rest",
      "kind": "scale",
      "title": "What about the rest of the application?",
      "plannedDuration": 45,
      "lead": "Nikola",
      "turns": [
        {
          "speaker": "Nikola",
          "text": "That's one service. How do we get this kind of detail into the rest without asking each team to repeat the setup?"
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
      "purpose": "Make the repeated workflow create the need for the operator.",
      "cues": [
        {
          "start": 0.65,
          "end": 6.61,
          "sampleStart": 15600,
          "sampleEnd": 158640,
          "speaker": "Nikola",
          "text": "That's one service. How do we get this kind of detail into the rest without asking each team to repeat the setup?"
        },
        {
          "start": 6.93,
          "end": 16.45,
          "sampleStart": 166320,
          "sampleEnd": 394800,
          "speaker": "Tyler",
          "text": "In this demo, thirteen more services use runtimes in the Injector payload. The Go services keep their OBI coverage. Our next step is to share the setup across those thirteen."
        },
        {
          "start": 16.77,
          "end": 23.85,
          "sampleStart": 402480,
          "sampleEnd": 572400,
          "speaker": "Nikola",
          "text": "And share the routine work around it. Not every team has our access, our runtime knowledge, or an empty release queue."
        }
      ],
      "visualCues": [],
      "duration": 24.52,
      "start": 235.96,
      "end": 260.48,
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
      "start": 260.48,
      "end": 281.48,
      "audio": "narration/10-operator-opt-in.mp3"
    },
    {
      "id": "10-install-operator",
      "kind": "terminal",
      "title": "Let the namespace be the selection",
      "plannedDuration": 75,
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
      "start": 281.48,
      "end": 304.56,
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
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector supplies their agents. We aren't visiting thirteen deployment files or restarting each service by hand."
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
          "end": 22.41,
          "sampleStart": 296880,
          "sampleEnd": 537840,
          "speaker": "Tyler",
          "text": "Apply that rule, and the controller rolls the selected workloads. The Injector supplies their agents. We aren't visiting thirteen deployment files or restarting each service by hand."
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
      "start": 304.56,
      "end": 355.24,
      "audio": "narration/11-enroll-services.mp3"
    },
    {
      "id": "12-wider-result",
      "kind": "screen",
      "title": "Open language detail in more services",
      "plannedDuration": 85,
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
          "text": "The namespace rule got us here. We didn't need a separate instrumentation change from each application team. They keep their services; the platform carries the shared setup."
        }
      ],
      "visuals": [
        {
          "type": "image",
          "src": "demo-capture/fleet-overview.png",
          "at": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fleet-detail.mp4",
          "poster": "demo-capture/fleet-detail-poster.png",
          "atCue": 1
        }
      ],
      "purpose": "Use the actual fleet trace, then inspect Catalog rather than returning only to Checkout.",
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
          "end": 31.09,
          "sampleStart": 548400,
          "sampleEnd": 746160,
          "speaker": "Tyler",
          "text": "The namespace rule got us here. We didn't need a separate instrumentation change from each application team. They keep their services; the platform carries the shared setup."
        }
      ],
      "visualCues": [
        {
          "type": "image",
          "src": "demo-capture/fleet-overview.png",
          "at": 0,
          "start": 0
        },
        {
          "type": "video",
          "src": "demo-capture/fleet-detail.mp4",
          "poster": "demo-capture/fleet-detail-poster.png",
          "atCue": 1,
          "start": 11.45,
          "mediaDuration": 10.56
        }
      ],
      "duration": 31.76,
      "start": 355.24,
      "end": 387.0,
      "audio": "narration/12-wider-result.mp3"
    },
    {
      "id": "13-hidden-cost",
      "kind": "savings",
      "title": "The work around a deployment adds up",
      "plannedDuration": 60,
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
      "start": 387.0,
      "end": 420.88,
      "audio": "narration/13-hidden-cost.mp3"
    },
    {
      "id": "14-lifecycle",
      "kind": "lifecycle",
      "title": "Reuse the workflow after day one",
      "plannedDuration": 60,
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
      "start": 420.88,
      "end": 452.36,
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
      "start": 452.36,
      "end": 527.72,
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
      "start": 527.72,
      "end": 576.4,
      "audio": "narration/15-scale.mp3"
    },
    {
      "id": "16-close",
      "kind": "close",
      "title": "Make the next investigation easier",
      "plannedDuration": 55,
      "lead": "Tyler",
      "turns": [
        {
          "speaker": "Tyler",
          "text": "We began with a slow request and no chosen culprit. OBI showed us where its time went. Java zero-code instrumentation named the local work we wanted to understand."
        },
        {
          "speaker": "Nikola",
          "text": "Then we chose one namespace. The custom controller and Injector carried the repeated setup across the supported services."
        },
        {
          "speaker": "Tyler",
          "text": "Try one service. Measure the whole path to useful detail. Then ask which repeated steps your platform can take off the next team's plate."
        },
        {
          "speaker": "Nikola",
          "text": "Keep the engineering. Lose the repetition. Let's take your questions."
        }
      ],
      "purpose": "Resolve the opening and leave a practical next step.",
      "cues": [
        {
          "start": 0.65,
          "end": 10.09,
          "sampleStart": 15600,
          "sampleEnd": 242160,
          "speaker": "Tyler",
          "text": "We began with a slow request and no chosen culprit. OBI showed us where its time went. Java zero-code instrumentation named the local work we wanted to understand."
        },
        {
          "start": 10.41,
          "end": 16.81,
          "sampleStart": 249840,
          "sampleEnd": 403440,
          "speaker": "Nikola",
          "text": "Then we chose one namespace. The custom controller and Injector carried the repeated setup across the supported services."
        },
        {
          "start": 17.13,
          "end": 24.29,
          "sampleStart": 411120,
          "sampleEnd": 582960,
          "speaker": "Tyler",
          "text": "Try one service. Measure the whole path to useful detail. Then ask which repeated steps your platform can take off the next team's plate."
        },
        {
          "start": 24.61,
          "end": 28.21,
          "sampleStart": 590640,
          "sampleEnd": 677040,
          "speaker": "Nikola",
          "text": "Keep the engineering. Lose the repetition. Let's take your questions."
        }
      ],
      "visualCues": [],
      "duration": 28.88,
      "start": 576.4,
      "end": 605.28,
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
  "bigIdea": "Use OBI to find the work worth investigating, add zero-code language detail, then select one namespace to carry instrumentation across supported services.",
  "scriptRevision": "Compare full work ledgers; count centralized upkeep per rollout group, separate exceptions, and remove the unsupported adoption/maintenance surcharge.",
  "timing": "natural",
  "plannedDuration": 1260,
  "maxContentSeconds": 1320,
  "storyRevision": "centralized-upkeep-ledgers-2026-10-26",
  "duration": 605.28
};
