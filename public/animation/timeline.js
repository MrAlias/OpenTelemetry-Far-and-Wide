window.TALK = {
  "title": "OpenTelemetry Far and Wide",
  "duration": 1200,
  "voice": "Two distinct male synthetic stand-ins for the Tyler and Nikola roles; not imitations of their real voices",
  "status": "Concept animation. Service traces and outcomes are illustrations, not a recording of a completed demo. No measured cost results are shown.",
  "chapters": [
    {
      "id": "01-promise",
      "kind": "title",
      "title": "OpenTelemetry Far and Wide",
      "duration": 15,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "I'm Tyler, and this is OpenTelemetry Far and Wide."
        },
        {
          "speaker": "Nikola",
          "text": "And I'm Nikola. Start with broad coverage, then add the detail your investigation needs."
        },
        {
          "speaker": "Tyler",
          "text": "One request. One missing answer. Let's follow it."
        }
      ],
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 4.2303,
          "speaker": "Tyler",
          "text": "I'm Tyler, and this is OpenTelemetry Far and Wide."
        },
        {
          "start": 4.4703,
          "end": 10.6289,
          "speaker": "Nikola",
          "text": "And I'm Nikola. Start with broad coverage, then add the detail your investigation needs."
        },
        {
          "start": 10.8689,
          "end": 14.3731,
          "speaker": "Tyler",
          "text": "One request. One missing answer. Let's follow it."
        }
      ],
      "start": 0,
      "end": 15,
      "audio": "narration/01-promise.mp3"
    },
    {
      "id": "02-question",
      "kind": "problem",
      "title": "You found the slow service. What happens inside it?",
      "duration": 55,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Checkout is slow. Nikola, I've narrowed the problem down to the service named checkout."
        },
        {
          "speaker": "Nikola",
          "text": "Excellent. The service name has really pulled its weight there. What is it actually doing?"
        },
        {
          "speaker": "Tyler",
          "text": "That's the question. Imagine you own the platform, but different teams own the applications. Our illustrated request enters a Go gateway, passes through Java checkout, and reaches Node inventory."
        },
        {
          "speaker": "Nikola",
          "text": "So you can follow the request across services. But the expensive work inside checkout still has no useful name."
        },
        {
          "speaker": "Tyler",
          "text": "I could ask every team to change its instrumentation. That sounds like a meeting before an investigation."
        },
        {
          "speaker": "Nikola",
          "text": "Start smaller. What can the existing signals answer, and which observation is missing?"
        },
        {
          "speaker": "Tyler",
          "text": "That's our investigation. Broad coverage gets us oriented. Selected application detail should explain the local work."
        },
        {
          "speaker": "Nikola",
          "text": "And adding a span will not magically make checkout faster. We still have to fix the actual application."
        }
      ],
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 5.9298,
          "speaker": "Tyler",
          "text": "Checkout is slow. Nikola, I've narrowed the problem down to the service named checkout."
        },
        {
          "start": 6.1698,
          "end": 11.9833,
          "speaker": "Nikola",
          "text": "Excellent. The service name has really pulled its weight there. What is it actually doing?"
        },
        {
          "start": 12.2233,
          "end": 23.3069,
          "speaker": "Tyler",
          "text": "That's the question. Imagine you own the platform, but different teams own the applications. Our illustrated request enters a Go gateway, passes through Java checkout, and reaches Node inventory."
        },
        {
          "start": 23.5469,
          "end": 29.4218,
          "speaker": "Nikola",
          "text": "So you can follow the request across services. But the expensive work inside checkout still has no useful name."
        },
        {
          "start": 29.6618,
          "end": 35.8841,
          "speaker": "Tyler",
          "text": "I could ask every team to change its instrumentation. That sounds like a meeting before an investigation."
        },
        {
          "start": 36.1241,
          "end": 40.6549,
          "speaker": "Nikola",
          "text": "Start smaller. What can the existing signals answer, and which observation is missing?"
        },
        {
          "start": 40.8949,
          "end": 48.5337,
          "speaker": "Tyler",
          "text": "That's our investigation. Broad coverage gets us oriented. Selected application detail should explain the local work."
        },
        {
          "start": 48.7737,
          "end": 54.4392,
          "speaker": "Nikola",
          "text": "And adding a span will not magically make checkout faster. We still have to fix the actual application."
        }
      ],
      "start": 15,
      "end": 70,
      "audio": "narration/02-question.mp3"
    },
    {
      "id": "03-coverage-and-depth",
      "kind": "model",
      "title": "Follow the request. Then look inside one service.",
      "duration": 40,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Think of a trace as one linked request. Its spans describe timed operations. First, follow that request across gateway, checkout, and inventory."
        },
        {
          "speaker": "Nikola",
          "text": "That gives us context. Which service deserves attention, and how does it connect to the rest of the request?"
        },
        {
          "speaker": "Tyler",
          "text": "Now look inside checkout. A selected application operation can become another span within that request."
        },
        {
          "speaker": "Nikola",
          "text": "Same investigation, a more specific observation. We haven't replaced the service view; we've explained something inside it."
        },
        {
          "speaker": "Tyler",
          "text": "One qualification: eBPF instrumentation and language agents have overlapping capabilities. This example uses broad coverage first and method detail where the question needs it."
        }
      ],
      "buildAfter": 1,
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 9.7474,
          "speaker": "Tyler",
          "text": "Think of a trace as one linked request. Its spans describe timed operations. First, follow that request across gateway, checkout, and inventory."
        },
        {
          "start": 9.9874,
          "end": 15.0375,
          "speaker": "Nikola",
          "text": "That gives us context. Which service deserves attention, and how does it connect to the rest of the request?"
        },
        {
          "start": 15.2775,
          "end": 21.601,
          "speaker": "Tyler",
          "text": "Now look inside checkout. A selected application operation can become another span within that request."
        },
        {
          "start": 21.841,
          "end": 28.3615,
          "speaker": "Nikola",
          "text": "Same investigation, a more specific observation. We haven't replaced the service view; we've explained something inside it."
        },
        {
          "start": 28.6015,
          "end": 39.3908,
          "speaker": "Tyler",
          "text": "One qualification: eBPF instrumentation and language agents have overlapping capabilities. This example uses broad coverage first and method detail where the question needs it."
        }
      ],
      "buildTime": 15.2775,
      "start": 70,
      "end": 110,
      "audio": "narration/03-coverage-and-depth.mp3"
    },
    {
      "id": "04-establish-breadth",
      "kind": "breadth",
      "title": "A deployment is useful when it produces request evidence.",
      "duration": 90,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Let's establish that broad view through the shared deployment workflow. Our proposed Operator integration should manage eBPF coverage and selected language instrumentation together."
        },
        {
          "speaker": "Nikola",
          "text": "Shared workflow sounds convenient. What does the platform actually have to bring?"
        },
        {
          "speaker": "Tyler",
          "text": "A working cluster, the applications, admission components where needed, and somewhere to export telemetry. One command can coordinate the work. It cannot make those dependencies disappear."
        },
        {
          "speaker": "Nikola",
          "text": "So the command finishing is the beginning of the check, not the end."
        },
        {
          "speaker": "Tyler",
          "text": "Right. The person investigating needs useful request evidence. A successful installation message doesn't tell them whether gateway, checkout, and inventory belong to the same trace."
        },
        {
          "speaker": "Nikola",
          "text": "Now follow the illustrated request. Gateway reaches checkout, checkout reaches inventory, and their operations are linked. That's the baseline we're trying to establish."
        },
        {
          "speaker": "Tyler",
          "text": "I want to check service identities and parent relationships before interpreting any timing. Otherwise a convincing diagram can send us toward the wrong explanation."
        },
        {
          "speaker": "Nikola",
          "text": "And these bar lengths are schematic. They aren't measured latency values or a recording of a completed deployment."
        },
        {
          "speaker": "Tyler",
          "text": "Once the real request path is trustworthy, we can ask a much better question than, is something somewhere slow?"
        },
        {
          "speaker": "Nikola",
          "text": "Which local work inside checkout explains its time? Coverage has brought us to the right door. Now we need to look inside."
        }
      ],
      "buildAfter": 4,
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 12.6003,
          "speaker": "Tyler",
          "text": "Let's establish that broad view through the shared deployment workflow. Our proposed Operator integration should manage eBPF coverage and selected language instrumentation together."
        },
        {
          "start": 12.8403,
          "end": 17.9226,
          "speaker": "Nikola",
          "text": "Shared workflow sounds convenient. What does the platform actually have to bring?"
        },
        {
          "start": 18.1626,
          "end": 30.6762,
          "speaker": "Tyler",
          "text": "A working cluster, the applications, admission components where needed, and somewhere to export telemetry. One command can coordinate the work. It cannot make those dependencies disappear."
        },
        {
          "start": 30.9162,
          "end": 34.9222,
          "speaker": "Nikola",
          "text": "So the command finishing is the beginning of the check, not the end."
        },
        {
          "start": 35.1622,
          "end": 46.6476,
          "speaker": "Tyler",
          "text": "Right. The person investigating needs useful request evidence. A successful installation message doesn't tell them whether gateway, checkout, and inventory belong to the same trace."
        },
        {
          "start": 46.8876,
          "end": 57.2555,
          "speaker": "Nikola",
          "text": "Now follow the illustrated request. Gateway reaches checkout, checkout reaches inventory, and their operations are linked. That's the baseline we're trying to establish."
        },
        {
          "start": 57.4955,
          "end": 68.5957,
          "speaker": "Tyler",
          "text": "I want to check service identities and parent relationships before interpreting any timing. Otherwise a convincing diagram can send us toward the wrong explanation."
        },
        {
          "start": 68.8357,
          "end": 74.6214,
          "speaker": "Nikola",
          "text": "And these bar lengths are schematic. They aren't measured latency values or a recording of a completed deployment."
        },
        {
          "start": 74.8614,
          "end": 82.0183,
          "speaker": "Tyler",
          "text": "Once the real request path is trustworthy, we can ask a much better question than, is something somewhere slow?"
        },
        {
          "start": 82.2583,
          "end": 89.4787,
          "speaker": "Nikola",
          "text": "Which local work inside checkout explains its time? Coverage has brought us to the right door. Now we need to look inside."
        }
      ],
      "buildTime": 46.8876,
      "start": 110,
      "end": 200,
      "audio": "narration/04-establish-breadth.mp3"
    },
    {
      "id": "05-the-gap",
      "kind": "gap",
      "title": "The service is visible. Its local work is unnamed.",
      "duration": 60,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Stay with checkout's baseline span. Inventory is nested inside it, but the downstream call doesn't explain all the local work."
        },
        {
          "speaker": "Nikola",
          "text": "Can I add the bars together and report a really impressive total?"
        },
        {
          "speaker": "Tyler",
          "text": "Only if you want to count some time twice. A parent span can already include the time in its children."
        },
        {
          "speaker": "Nikola",
          "text": "Fair. What would everyone want to observe next: another service map, or an operation inside checkout? Give that five seconds."
        },
        {
          "speaker": "Tyler",
          "text": "A local application operation. For this workload, the target is a pricing calculation."
        },
        {
          "speaker": "Nikola",
          "text": "And selecting that method takes application knowledge. Someone has to know which class and operation mean something to this investigation."
        },
        {
          "speaker": "Tyler",
          "text": "We aren't discovering business meaning automatically. We're choosing the observation that could close this gap."
        },
        {
          "speaker": "Nikola",
          "text": "Good. A reason for more detail. Tyler, let's get that calculation into the request view."
        }
      ],
      "pauseAfter": {
        "3": 5.0
      },
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 9.091,
          "speaker": "Tyler",
          "text": "Stay with checkout's baseline span. Inventory is nested inside it, but the downstream call doesn't explain all the local work."
        },
        {
          "start": 9.331,
          "end": 13.1359,
          "speaker": "Nikola",
          "text": "Can I add the bars together and report a really impressive total?"
        },
        {
          "start": 13.3759,
          "end": 20.8368,
          "speaker": "Tyler",
          "text": "Only if you want to count some time twice. A parent span can already include the time in its children."
        },
        {
          "start": 21.0768,
          "end": 28.2061,
          "speaker": "Nikola",
          "text": "Fair. What would everyone want to observe next: another service map, or an operation inside checkout? Give that five seconds."
        },
        {
          "start": 33.4461,
          "end": 39.1668,
          "speaker": "Tyler",
          "text": "A local application operation. For this workload, the target is a pricing calculation."
        },
        {
          "start": 39.4068,
          "end": 46.6733,
          "speaker": "Nikola",
          "text": "And selecting that method takes application knowledge. Someone has to know which class and operation mean something to this investigation."
        },
        {
          "start": 46.9133,
          "end": 53.4876,
          "speaker": "Tyler",
          "text": "We aren't discovering business meaning automatically. We're choosing the observation that could close this gap."
        },
        {
          "start": 53.7276,
          "end": 59.426,
          "speaker": "Nikola",
          "text": "Good. A reason for more detail. Tyler, let's get that calculation into the request view."
        }
      ],
      "start": 200,
      "end": 260,
      "audio": "narration/05-the-gap.mp3"
    },
    {
      "id": "06-add-depth",
      "kind": "depth",
      "title": "Add a method span to explain the local work.",
      "duration": 120,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Before changing anything, say what success would look like. We want a span around the existing pricing calculation, linked inside a fresh checkout request."
        },
        {
          "speaker": "Tyler",
          "text": "Same application image, more information about the work it already does?"
        },
        {
          "speaker": "Nikola",
          "text": "Yes. The running process can still change. With startup agent injection, adding or changing the agent can require replacement pods. No application rebuild doesn't mean no rollout."
        },
        {
          "speaker": "Tyler",
          "text": "That's an important distinction. Where does the method selection come from?"
        },
        {
          "speaker": "Nikola",
          "text": "For this Java example, configuration identifies a class and method. The agent must load in the process and apply that setting. A configuration field alone doesn't prove either happened."
        },
        {
          "speaker": "Tyler",
          "text": "So while the profile converges, we keep the original diagnostic question visible. We're waiting for a named operation in a new request, not just a green workload indicator."
        },
        {
          "speaker": "Nikola",
          "text": "And keep the baseline request available. Old and new processes can coexist during a transition, and their instrumentation can differ. We need to know which request we're inspecting."
        },
        {
          "speaker": "Tyler",
          "text": "There it is in the illustrated depth view: Pricing Engine calculate, inside checkout. Gateway and inventory are still around it."
        },
        {
          "speaker": "Nikola",
          "text": "That's the useful change. The local operation has a name and a place in the request. An isolated method span in another trace would leave us doing the detective work ourselves."
        },
        {
          "speaker": "Tyler",
          "text": "What would make you trust it?"
        },
        {
          "speaker": "Nikola",
          "text": "The correct parent chain, the intended producer of checkout request spans, and the baseline signals that should remain. Also, verify that the fresh request really came from the new configuration."
        },
        {
          "speaker": "Tyler",
          "text": "So the prize is an explanation we can use. The extra colored bar is just how we're seeing it."
        },
        {
          "speaker": "Nikola",
          "text": "Exactly. Hold onto that distinction when we compare the two views."
        }
      ],
      "buildAfter": 6,
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 10.4641,
          "speaker": "Nikola",
          "text": "Before changing anything, say what success would look like. We want a span around the existing pricing calculation, linked inside a fresh checkout request."
        },
        {
          "start": 10.7041,
          "end": 16.0083,
          "speaker": "Tyler",
          "text": "Same application image, more information about the work it already does?"
        },
        {
          "start": 16.2483,
          "end": 28.682,
          "speaker": "Nikola",
          "text": "Yes. The running process can still change. With startup agent injection, adding or changing the agent can require replacement pods. No application rebuild doesn't mean no rollout."
        },
        {
          "start": 28.922,
          "end": 33.9974,
          "speaker": "Tyler",
          "text": "That's an important distinction. Where does the method selection come from?"
        },
        {
          "start": 34.2374,
          "end": 46.0567,
          "speaker": "Nikola",
          "text": "For this Java example, configuration identifies a class and method. The agent must load in the process and apply that setting. A configuration field alone doesn't prove either happened."
        },
        {
          "start": 46.2967,
          "end": 59.0563,
          "speaker": "Tyler",
          "text": "So while the profile converges, we keep the original diagnostic question visible. We're waiting for a named operation in a new request, not just a green workload indicator."
        },
        {
          "start": 59.2963,
          "end": 71.5441,
          "speaker": "Nikola",
          "text": "And keep the baseline request available. Old and new processes can coexist during a transition, and their instrumentation can differ. We need to know which request we're inspecting."
        },
        {
          "start": 71.7841,
          "end": 81.3332,
          "speaker": "Tyler",
          "text": "There it is in the illustrated depth view: Pricing Engine calculate, inside checkout. Gateway and inventory are still around it."
        },
        {
          "start": 81.5732,
          "end": 92.4167,
          "speaker": "Nikola",
          "text": "That's the useful change. The local operation has a name and a place in the request. An isolated method span in another trace would leave us doing the detective work ourselves."
        },
        {
          "start": 92.6567,
          "end": 94.5362,
          "speaker": "Tyler",
          "text": "What would make you trust it?"
        },
        {
          "start": 94.7762,
          "end": 107.2201,
          "speaker": "Nikola",
          "text": "The correct parent chain, the intended producer of checkout request spans, and the baseline signals that should remain. Also, verify that the fresh request really came from the new configuration."
        },
        {
          "start": 107.4601,
          "end": 114.7995,
          "speaker": "Tyler",
          "text": "So the prize is an explanation we can use. The extra colored bar is just how we're seeing it."
        },
        {
          "start": 115.0395,
          "end": 119.4115,
          "speaker": "Nikola",
          "text": "Exactly. Hold onto that distinction when we compare the two views."
        }
      ],
      "buildTime": 71.7841,
      "start": 260,
      "end": 380,
      "audio": "narration/06-add-depth.mp3"
    },
    {
      "id": "07-compare",
      "kind": "answer",
      "title": "The work was already happening. Now it has a name.",
      "duration": 60,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Here's the comparison, with both requests visible together. They're separate executions, so use matching framing and a common time scale."
        },
        {
          "speaker": "Tyler",
          "text": "Baseline on the left: checkout does some unnamed local work. Depth on the right: a pricing calculation is linked inside checkout."
        },
        {
          "speaker": "Nikola",
          "text": "Now we can form a specific hypothesis and decide what to inspect in the application. That is the diagnostic improvement."
        },
        {
          "speaker": "Tyler",
          "text": "The tracing got better. Checkout didn't get faster. We have upgraded our explanation, not our pricing algorithm."
        },
        {
          "speaker": "Nikola",
          "text": "And that is still a useful result. We can act on a named operation instead of treating the whole service as one mystery interval."
        },
        {
          "speaker": "Tyler",
          "text": "All right. The investigation makes sense. How do we operate these two instrumentation paths without creating another hand-maintained project for every application team?"
        }
      ],
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 10.75,
          "speaker": "Nikola",
          "text": "Here's the comparison, with both requests visible together. They're separate executions, so use matching framing and a common time scale."
        },
        {
          "start": 10.99,
          "end": 20.9131,
          "speaker": "Tyler",
          "text": "Baseline on the left: checkout does some unnamed local work. Depth on the right: a pricing calculation is linked inside checkout."
        },
        {
          "start": 21.1531,
          "end": 29.3255,
          "speaker": "Nikola",
          "text": "Now we can form a specific hypothesis and decide what to inspect in the application. That is the diagnostic improvement."
        },
        {
          "start": 29.5655,
          "end": 38.4715,
          "speaker": "Tyler",
          "text": "The tracing got better. Checkout didn't get faster. We have upgraded our explanation, not our pricing algorithm."
        },
        {
          "start": 38.7115,
          "end": 46.39,
          "speaker": "Nikola",
          "text": "And that is still a useful result. We can act on a named operation instead of treating the whole service as one mystery interval."
        },
        {
          "start": 46.63,
          "end": 59.2723,
          "speaker": "Tyler",
          "text": "All right. The investigation makes sense. How do we operate these two instrumentation paths without creating another hand-maintained project for every application team?"
        }
      ],
      "start": 380,
      "end": 440,
      "audio": "narration/07-compare.mp3"
    },
    {
      "id": "08-shared-workflow",
      "kind": "control",
      "title": "Manage two instrumentation paths through one workflow.",
      "duration": 110,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Separate the control of instrumentation from the path its telemetry takes. At the top is the proposed Operator integration and its shared deployment workflow."
        },
        {
          "speaker": "Tyler",
          "text": "What is that box responsible for, in concrete terms?"
        },
        {
          "speaker": "Nikola",
          "text": "Selecting an enrolled workload, expressing its intended instrumentation configuration, and coordinating the changes needed to reach it. That coordination is part of the proposed integration, not a finished upstream feature we can assume exists."
        },
        {
          "speaker": "Tyler",
          "text": "Underneath it, there are two paths. One configures OBI. The other selects and injects a language agent. eBPF isn't secretly installing the Java agent on its way past."
        },
        {
          "speaker": "Nikola",
          "text": "Correct. They're parallel responsibilities. An Operator Instrumentation resource can describe agent settings, and injection annotations select it in the current proof. Custom orchestration handles that proof's transitions."
        },
        {
          "speaker": "Tyler",
          "text": "One entry point still needs configuration ownership, explicit workload selection, and checks on the actual running result. We haven't made those responsibilities disappear behind a friendlier button."
        },
        {
          "speaker": "Nikola",
          "text": "Now follow the telemetry toward the Collector. Both paths can export there, but they should not both produce the same checkout request spans without an ownership plan."
        },
        {
          "speaker": "Tyler",
          "text": "So who owns checkout tracing in this example?"
        },
        {
          "speaker": "Nikola",
          "text": "In the intended breadth view, OBI. In the depth view, the Java agent supplies checkout request spans while the configured OBI baseline metrics remain. That ownership rule has to be verified during the transition too."
        },
        {
          "speaker": "Tyler",
          "text": "Otherwise we could add detail and also add a confusing duplicate request view. More data, less understanding."
        },
        {
          "speaker": "Nikola",
          "text": "The operating goal is to choose the workload and profile, then verify what's running and what's exported. A shared workflow should make that easier to do consistently."
        },
        {
          "speaker": "Tyler",
          "text": "Let's test the lifecycle, then. If we own the configuration centrally, can we also manage an instrumentation upgrade?"
        }
      ],
      "buildAfter": 5,
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 8.1176,
          "speaker": "Nikola",
          "text": "Separate the control of instrumentation from the path its telemetry takes. At the top is the proposed Operator integration and its shared deployment workflow."
        },
        {
          "start": 8.3576,
          "end": 11.8279,
          "speaker": "Tyler",
          "text": "What is that box responsible for, in concrete terms?"
        },
        {
          "start": 12.0679,
          "end": 26.0372,
          "speaker": "Nikola",
          "text": "Selecting an enrolled workload, expressing its intended instrumentation configuration, and coordinating the changes needed to reach it. That coordination is part of the proposed integration, not a finished upstream feature we can assume exists."
        },
        {
          "start": 26.2772,
          "end": 37.9171,
          "speaker": "Tyler",
          "text": "Underneath it, there are two paths. One configures OBI. The other selects and injects a language agent. eBPF isn't secretly installing the Java agent on its way past."
        },
        {
          "start": 38.1571,
          "end": 50.4024,
          "speaker": "Nikola",
          "text": "Correct. They're parallel responsibilities. An Operator Instrumentation resource can describe agent settings, and injection annotations select it in the current proof. Custom orchestration handles that proof's transitions."
        },
        {
          "start": 50.6424,
          "end": 62.4141,
          "speaker": "Tyler",
          "text": "One entry point still needs configuration ownership, explicit workload selection, and checks on the actual running result. We haven't made those responsibilities disappear behind a friendlier button."
        },
        {
          "start": 62.6541,
          "end": 71.2746,
          "speaker": "Nikola",
          "text": "Now follow the telemetry toward the Collector. Both paths can export there, but they should not both produce the same checkout request spans without an ownership plan."
        },
        {
          "start": 71.5146,
          "end": 74.4988,
          "speaker": "Tyler",
          "text": "So who owns checkout tracing in this example?"
        },
        {
          "start": 74.7388,
          "end": 86.0555,
          "speaker": "Nikola",
          "text": "In the intended breadth view, OBI. In the depth view, the Java agent supplies checkout request spans while the configured OBI baseline metrics remain. That ownership rule has to be verified during the transition too."
        },
        {
          "start": 86.2955,
          "end": 93.571,
          "speaker": "Tyler",
          "text": "Otherwise we could add detail and also add a confusing duplicate request view. More data, less understanding."
        },
        {
          "start": 93.811,
          "end": 102.1588,
          "speaker": "Nikola",
          "text": "The operating goal is to choose the workload and profile, then verify what's running and what's exported. A shared workflow should make that easier to do consistently."
        },
        {
          "start": 102.3988,
          "end": 109.4632,
          "speaker": "Tyler",
          "text": "Let's test the lifecycle, then. If we own the configuration centrally, can we also manage an instrumentation upgrade?"
        }
      ],
      "buildTime": 62.6541,
      "start": 440,
      "end": 550,
      "audio": "narration/08-shared-workflow.mp3"
    },
    {
      "id": "09-upgrade",
      "kind": "upgrade",
      "title": "An upgrade needs evidence from the running workload.",
      "duration": 75,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "An upgrade has a requested state and an observed state. Keep both in view before and after convergence."
        },
        {
          "speaker": "Tyler",
          "text": "I've changed the version field. Can I put upgraded on the slide?"
        },
        {
          "speaker": "Nikola",
          "text": "Your configuration has upgraded. The running process hasn't agreed yet."
        },
        {
          "speaker": "Tyler",
          "text": "Fair point. What evidence gets the process a vote?"
        },
        {
          "speaker": "Nikola",
          "text": "Observe the running agent version. Where relevant, identify the SDK bundled inside that agent too. Those are related version numbers, not interchangeable labels."
        },
        {
          "speaker": "Tyler",
          "text": "And compare the application image identity. The intended result is new instrumentation with the same application image, while acknowledging any replacement pods or restart."
        },
        {
          "speaker": "Nikola",
          "text": "Then send a fresh request and check the expected method span, parent relationships, and baseline signals. Starting successfully isn't the same as exporting the right telemetry."
        },
        {
          "speaker": "Tyler",
          "text": "So this complete comparison answers three questions: what did we request, what is actually running, and did we rebuild the application?"
        },
        {
          "speaker": "Nikola",
          "text": "Yes. A single version field would leave at least two of those open. And record the rollback path as part of the upgrade, rather than discovering it when a candidate fails."
        },
        {
          "speaker": "Tyler",
          "text": "Good. Let's see whether that same lifecycle can take the extra detail away again."
        }
      ],
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 6.1993,
          "speaker": "Nikola",
          "text": "An upgrade has a requested state and an observed state. Keep both in view before and after convergence."
        },
        {
          "start": 6.4393,
          "end": 10.4772,
          "speaker": "Tyler",
          "text": "I've changed the version field. Can I put upgraded on the slide?"
        },
        {
          "start": 10.7172,
          "end": 14.8019,
          "speaker": "Nikola",
          "text": "Your configuration has upgraded. The running process hasn't agreed yet."
        },
        {
          "start": 15.0419,
          "end": 18.2351,
          "speaker": "Tyler",
          "text": "Fair point. What evidence gets the process a vote?"
        },
        {
          "start": 18.4751,
          "end": 28.6782,
          "speaker": "Nikola",
          "text": "Observe the running agent version. Where relevant, identify the SDK bundled inside that agent too. Those are related version numbers, not interchangeable labels."
        },
        {
          "start": 28.9182,
          "end": 40.2253,
          "speaker": "Tyler",
          "text": "And compare the application image identity. The intended result is new instrumentation with the same application image, while acknowledging any replacement pods or restart."
        },
        {
          "start": 40.4653,
          "end": 50.4042,
          "speaker": "Nikola",
          "text": "Then send a fresh request and check the expected method span, parent relationships, and baseline signals. Starting successfully isn't the same as exporting the right telemetry."
        },
        {
          "start": 50.6442,
          "end": 58.8091,
          "speaker": "Tyler",
          "text": "So this complete comparison answers three questions: what did we request, what is actually running, and did we rebuild the application?"
        },
        {
          "start": 59.0491,
          "end": 68.6603,
          "speaker": "Nikola",
          "text": "Yes. A single version field would leave at least two of those open. And record the rollback path as part of the upgrade, rather than discovering it when a candidate fails."
        },
        {
          "start": 68.9003,
          "end": 74.4805,
          "speaker": "Tyler",
          "text": "Good. Let's see whether that same lifecycle can take the extra detail away again."
        }
      ],
      "start": 550,
      "end": 625,
      "audio": "narration/09-upgrade.mp3"
    },
    {
      "id": "10-remove-depth",
      "kind": "return",
      "title": "Remove selected detail. Keep the useful baseline.",
      "duration": 75,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "The investigation ends, so selected detail needs a way out as well as a way in. Retain it deliberately, or return to the breadth configuration."
        },
        {
          "speaker": "Tyler",
          "text": "We're removing the method span. Unfortunately, the pricing calculation doesn't go away with it."
        },
        {
          "speaker": "Nikola",
          "text": "If only performance fixes were that easy. The application still does the work; we're changing the observations it emits."
        },
        {
          "speaker": "Tyler",
          "text": "With startup agent injection, removal can require replacement processes too. We request breadth, follow convergence, and keep the earlier depth request available for comparison."
        },
        {
          "speaker": "Nikola",
          "text": "Now inspect the illustrated fresh baseline request. The selected method span is absent, while the service path remains connected."
        },
        {
          "speaker": "Tyler",
          "text": "But one missing span doesn't prove the baseline survived. We also need the expected request relationships and the baseline metrics."
        },
        {
          "speaker": "Nikola",
          "text": "And an old trace can't establish a new configuration. Use a fresh request from the converged workload and verify what actually arrived."
        },
        {
          "speaker": "Tyler",
          "text": "That's the reversible part of the operating model. Depth can follow an investigation instead of becoming a permanent collection of every setting we've ever enabled."
        },
        {
          "speaker": "Nikola",
          "text": "Which raises the next question: what does that detail cost, and what information makes it worth keeping? Tyler, this is where the units matter."
        }
      ],
      "buildAfter": 3,
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 9.2138,
          "speaker": "Nikola",
          "text": "The investigation ends, so selected detail needs a way out as well as a way in. Retain it deliberately, or return to the breadth configuration."
        },
        {
          "start": 9.4538,
          "end": 15.0656,
          "speaker": "Tyler",
          "text": "We're removing the method span. Unfortunately, the pricing calculation doesn't go away with it."
        },
        {
          "start": 15.3056,
          "end": 22.0138,
          "speaker": "Nikola",
          "text": "If only performance fixes were that easy. The application still does the work; we're changing the observations it emits."
        },
        {
          "start": 22.2538,
          "end": 33.2789,
          "speaker": "Tyler",
          "text": "With startup agent injection, removal can require replacement processes too. We request breadth, follow convergence, and keep the earlier depth request available for comparison."
        },
        {
          "start": 33.5189,
          "end": 40.4558,
          "speaker": "Nikola",
          "text": "Now inspect the illustrated fresh baseline request. The selected method span is absent, while the service path remains connected."
        },
        {
          "start": 40.6958,
          "end": 48.7549,
          "speaker": "Tyler",
          "text": "But one missing span doesn't prove the baseline survived. We also need the expected request relationships and the baseline metrics."
        },
        {
          "start": 48.9949,
          "end": 56.5605,
          "speaker": "Nikola",
          "text": "And an old trace can't establish a new configuration. Use a fresh request from the converged workload and verify what actually arrived."
        },
        {
          "start": 56.8005,
          "end": 66.5786,
          "speaker": "Tyler",
          "text": "That's the reversible part of the operating model. Depth can follow an investigation instead of becoming a permanent collection of every setting we've ever enabled."
        },
        {
          "start": 66.8186,
          "end": 74.4719,
          "speaker": "Nikola",
          "text": "Which raises the next question: what does that detail cost, and what information makes it worth keeping? Tyler, this is where the units matter."
        }
      ],
      "buildTime": 33.5189,
      "start": 625,
      "end": 700,
      "audio": "narration/10-remove-depth.mp3"
    },
    {
      "id": "11-cost",
      "kind": "cost",
      "title": "Measure the profile before deciding what to retain.",
      "duration": 140,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Instrumentation cost hides more than one question. How much telemetry leaves the system? And how much application resource use is associated with producing it?"
        },
        {
          "speaker": "Nikola",
          "text": "I was hoping to count the spans, announce a saving, and finish early."
        },
        {
          "speaker": "Tyler",
          "text": "Tempting. But which saving, measured where? Span count alone doesn't answer either of those questions."
        },
        {
          "speaker": "Nikola",
          "text": "Let's start with export volume. What comparison would be useful?"
        },
        {
          "speaker": "Tyler",
          "text": "OTLP bytes per completed request, at a stated measurement boundary. Keep breadth, selected depth, and restored breadth together. Otherwise a smaller total might just mean that one run completed less work."
        },
        {
          "speaker": "Nikola",
          "text": "The denominator gets a speaking part. Good. And the application CPU view?"
        },
        {
          "speaker": "Tyler",
          "text": "Compare CPU use at matched completed-request throughput. State the unit and measurement location, and say which components are included. Application CPU doesn't automatically include the node agent, Collector, network, or backend."
        },
        {
          "speaker": "Nikola",
          "text": "So we can't turn a change at one layer into a claim about the entire system, or translate a span count directly into a bill."
        },
        {
          "speaker": "Tyler",
          "text": "We also need comparable conditions: workload, request mix, sampling, warm-up treatment, and repeated trials. Report variation. If a configuration fails requests or slows completion, discuss that before interpreting a normalized number."
        },
        {
          "speaker": "Nikola",
          "text": "Otherwise the cheapest profile might be the one that stopped doing the job. That's a fairly important footnote."
        },
        {
          "speaker": "Tyler",
          "text": "Exactly. Correctness and completed work belong in the measurement context. Cost without those can be a misleading comparison."
        },
        {
          "speaker": "Nikola",
          "text": "What do the empty plotting areas mean here?"
        },
        {
          "speaker": "Tyler",
          "text": "The measurements are still pending. There is no percentage saving to report from this illustration. A small or inconclusive difference would still help us decide, or show where the experiment needs more precision."
        },
        {
          "speaker": "Nikola",
          "text": "Then the decision is specific to the service and investigation: did the information we gained justify the effect we measured?"
        },
        {
          "speaker": "Tyler",
          "text": "Keep detail when it earns its place. Remove it when it no longer helps. And don't promise a faster application or a smaller bill just because a graph has fewer bars."
        }
      ],
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 11.3413,
          "speaker": "Tyler",
          "text": "Instrumentation cost hides more than one question. How much telemetry leaves the system? And how much application resource use is associated with producing it?"
        },
        {
          "start": 11.5813,
          "end": 15.3178,
          "speaker": "Nikola",
          "text": "I was hoping to count the spans, announce a saving, and finish early."
        },
        {
          "start": 15.5578,
          "end": 22.5226,
          "speaker": "Tyler",
          "text": "Tempting. But which saving, measured where? Span count alone doesn't answer either of those questions."
        },
        {
          "start": 22.7626,
          "end": 26.7844,
          "speaker": "Nikola",
          "text": "Let's start with export volume. What comparison would be useful?"
        },
        {
          "start": 27.0244,
          "end": 41.3159,
          "speaker": "Tyler",
          "text": "OTLP bytes per completed request, at a stated measurement boundary. Keep breadth, selected depth, and restored breadth together. Otherwise a smaller total might just mean that one run completed less work."
        },
        {
          "start": 41.5559,
          "end": 46.7598,
          "speaker": "Nikola",
          "text": "The denominator gets a speaking part. Good. And the application CPU view?"
        },
        {
          "start": 46.9998,
          "end": 62.7811,
          "speaker": "Tyler",
          "text": "Compare CPU use at matched completed-request throughput. State the unit and measurement location, and say which components are included. Application CPU doesn't automatically include the node agent, Collector, network, or backend."
        },
        {
          "start": 63.0211,
          "end": 70.9689,
          "speaker": "Nikola",
          "text": "So we can't turn a change at one layer into a claim about the entire system, or translate a span count directly into a bill."
        },
        {
          "start": 71.2089,
          "end": 87.9958,
          "speaker": "Tyler",
          "text": "We also need comparable conditions: workload, request mix, sampling, warm-up treatment, and repeated trials. Report variation. If a configuration fails requests or slows completion, discuss that before interpreting a normalized number."
        },
        {
          "start": 88.2358,
          "end": 94.5632,
          "speaker": "Nikola",
          "text": "Otherwise the cheapest profile might be the one that stopped doing the job. That's a fairly important footnote."
        },
        {
          "start": 94.8032,
          "end": 103.2666,
          "speaker": "Tyler",
          "text": "Exactly. Correctness and completed work belong in the measurement context. Cost without those can be a misleading comparison."
        },
        {
          "start": 103.5066,
          "end": 106.7244,
          "speaker": "Nikola",
          "text": "What do the empty plotting areas mean here?"
        },
        {
          "start": 106.9644,
          "end": 120.9684,
          "speaker": "Tyler",
          "text": "The measurements are still pending. There is no percentage saving to report from this illustration. A small or inconclusive difference would still help us decide, or show where the experiment needs more precision."
        },
        {
          "start": 121.2084,
          "end": 127.7079,
          "speaker": "Nikola",
          "text": "Then the decision is specific to the service and investigation: did the information we gained justify the effect we measured?"
        },
        {
          "start": 127.9479,
          "end": 139.5305,
          "speaker": "Tyler",
          "text": "Keep detail when it earns its place. Remove it when it no longer helps. And don't promise a faster application or a smaller bill just because a graph has fewer bars."
        }
      ],
      "start": 700,
      "end": 840,
      "audio": "narration/11-cost.mp3"
    },
    {
      "id": "12-verify",
      "kind": "verify",
      "title": "A ready application does not prove a correct trace.",
      "duration": 120,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "There's one more gate before relying on a profile change. A workload can accept requests while its telemetry is still wrong."
        },
        {
          "speaker": "Nikola",
          "text": "The pod is green. You're saying the trace needs its own interview?"
        },
        {
          "speaker": "Tyler",
          "text": "A short one. A successful HTTP response doesn't establish the parent chain, the intended span producer, or the baseline signals. Application readiness answers a different question."
        },
        {
          "speaker": "Nikola",
          "text": "Then put verification before promotion. Inspect a fresh request for the expected relationships, selected method detail where required, and the baseline signals that should remain."
        },
        {
          "speaker": "Tyler",
          "text": "Check observed configuration and version when they're part of the change too. Desired settings describe intent. Exported telemetry helps establish behavior."
        },
        {
          "speaker": "Nikola",
          "text": "How does that affect a rollout while old requests are still in flight?"
        },
        {
          "speaker": "Tyler",
          "text": "A candidate can stay away from normal traffic until it passes the relevant checks. The previous process may need time to finish its requests and export before it retires. Candidate checks, routing, and export drain are separate responsibilities."
        },
        {
          "speaker": "Nikola",
          "text": "And those boundaries depend on the actual mechanism. They aren't all guaranteed by a ready indicator or a released Operator feature."
        },
        {
          "speaker": "Tyler",
          "text": "If the checks pass, promote and retire according to that mechanism. If they fail, preserve a usable state and follow the recovery path. A rejected candidate should be something we can explain, not an unexpected plot twist."
        },
        {
          "speaker": "Nikola",
          "text": "We should exercise the path between steady states, including rejection and return to breadth. Two attractive screenshots don't establish the transition."
        },
        {
          "speaker": "Tyler",
          "text": "And define the load and request patterns under which those checks apply. That gives the claim a scope people can assess."
        },
        {
          "speaker": "Nikola",
          "text": "Candidate, verify, promote, retire. We can use that order to reason about a change even when our platforms use different controllers."
        }
      ],
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 9.159,
          "speaker": "Tyler",
          "text": "There's one more gate before relying on a profile change. A workload can accept requests while its telemetry is still wrong."
        },
        {
          "start": 9.399,
          "end": 13.8651,
          "speaker": "Nikola",
          "text": "The pod is green. You're saying the trace needs its own interview?"
        },
        {
          "start": 14.1051,
          "end": 26.7253,
          "speaker": "Tyler",
          "text": "A short one. A successful HTTP response doesn't establish the parent chain, the intended span producer, or the baseline signals. Application readiness answers a different question."
        },
        {
          "start": 26.9653,
          "end": 37.2515,
          "speaker": "Nikola",
          "text": "Then put verification before promotion. Inspect a fresh request for the expected relationships, selected method detail where required, and the baseline signals that should remain."
        },
        {
          "start": 37.4915,
          "end": 48.6037,
          "speaker": "Tyler",
          "text": "Check observed configuration and version when they're part of the change too. Desired settings describe intent. Exported telemetry helps establish behavior."
        },
        {
          "start": 48.8437,
          "end": 52.5205,
          "speaker": "Nikola",
          "text": "How does that affect a rollout while old requests are still in flight?"
        },
        {
          "start": 52.7605,
          "end": 69.9651,
          "speaker": "Tyler",
          "text": "A candidate can stay away from normal traffic until it passes the relevant checks. The previous process may need time to finish its requests and export before it retires. Candidate checks, routing, and export drain are separate responsibilities."
        },
        {
          "start": 70.2051,
          "end": 77.7866,
          "speaker": "Nikola",
          "text": "And those boundaries depend on the actual mechanism. They aren't all guaranteed by a ready indicator or a released Operator feature."
        },
        {
          "start": 78.0266,
          "end": 93.3656,
          "speaker": "Tyler",
          "text": "If the checks pass, promote and retire according to that mechanism. If they fail, preserve a usable state and follow the recovery path. A rejected candidate should be something we can explain, not an unexpected plot twist."
        },
        {
          "start": 93.6056,
          "end": 102.1945,
          "speaker": "Nikola",
          "text": "We should exercise the path between steady states, including rejection and return to breadth. Two attractive screenshots don't establish the transition."
        },
        {
          "start": 102.4345,
          "end": 110.3801,
          "speaker": "Tyler",
          "text": "And define the load and request patterns under which those checks apply. That gives the claim a scope people can assess."
        },
        {
          "start": 110.6201,
          "end": 119.4983,
          "speaker": "Nikola",
          "text": "Candidate, verify, promote, retire. We can use that order to reason about a change even when our platforms use different controllers."
        }
      ],
      "start": 840,
      "end": 960,
      "audio": "narration/12-verify.mp3"
    },
    {
      "id": "13-try-it",
      "kind": "adopt",
      "title": "Try one service, one question, and a rollback.",
      "duration": 110,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Let's make this something people can try. Pick one supported service and a question that matters to its owner."
        },
        {
          "speaker": "Tyler",
          "text": "Not instrument the entire fleet and hope a question turns up?"
        },
        {
          "speaker": "Nikola",
          "text": "Let's give the fleet a quiet afternoon. First establish baseline telemetry. Ask whether that existing view can already answer the question."
        },
        {
          "speaker": "Tyler",
          "text": "If it can, we have useful evidence without changing another profile. If it can't, what would the next observation need to tell us?"
        },
        {
          "speaker": "Nikola",
          "text": "Choose detail that could change the diagnosis. Work with someone who understands the application. For a named method, knowing which operation to select is part of the investigation, not an automatic discovery feature."
        },
        {
          "speaker": "Tyler",
          "text": "Then apply the profile through the chosen mechanism, compare a fresh request, and check the relationships, ownership, and application identity."
        },
        {
          "speaker": "Nikola",
          "text": "Measure the relevant cost under comparable load. Keep the original question beside the result: did this observation actually help answer it?"
        },
        {
          "speaker": "Tyler",
          "text": "That makes it harder to confuse having more telemetry with having a better answer."
        },
        {
          "speaker": "Nikola",
          "text": "Decide what to retain, or remove the selected detail and verify the baseline. Keep a rollback path for the transition itself. That makes this a bounded experiment an application team can understand."
        },
        {
          "speaker": "Tyler",
          "text": "What should we leave for the next person who wants to repeat it?"
        },
        {
          "speaker": "Nikola",
          "text": "Prerequisites, supported conditions, pinned versions, each change operation, the observations that establish success, and the recovery procedure. Enough to understand what enrolling a service will do."
        },
        {
          "speaker": "Tyler",
          "text": "One service, one question, and a clear way back. That sounds like an experiment we can discuss, rather than a platform migration hidden in a debugging session."
        }
      ],
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 6.6157,
          "speaker": "Nikola",
          "text": "Let's make this something people can try. Pick one supported service and a question that matters to its owner."
        },
        {
          "start": 6.8557,
          "end": 11.2248,
          "speaker": "Tyler",
          "text": "Not instrument the entire fleet and hope a question turns up?"
        },
        {
          "start": 11.4648,
          "end": 20.4394,
          "speaker": "Nikola",
          "text": "Let's give the fleet a quiet afternoon. First establish baseline telemetry. Ask whether that existing view can already answer the question."
        },
        {
          "start": 20.6794,
          "end": 29.5541,
          "speaker": "Tyler",
          "text": "If it can, we have useful evidence without changing another profile. If it can't, what would the next observation need to tell us?"
        },
        {
          "start": 29.7941,
          "end": 42.8937,
          "speaker": "Nikola",
          "text": "Choose detail that could change the diagnosis. Work with someone who understands the application. For a named method, knowing which operation to select is part of the investigation, not an automatic discovery feature."
        },
        {
          "start": 43.1337,
          "end": 53.1056,
          "speaker": "Tyler",
          "text": "Then apply the profile through the chosen mechanism, compare a fresh request, and check the relationships, ownership, and application identity."
        },
        {
          "start": 53.3456,
          "end": 61.1435,
          "speaker": "Nikola",
          "text": "Measure the relevant cost under comparable load. Keep the original question beside the result: did this observation actually help answer it?"
        },
        {
          "start": 61.3835,
          "end": 66.8997,
          "speaker": "Tyler",
          "text": "That makes it harder to confuse having more telemetry with having a better answer."
        },
        {
          "start": 67.1397,
          "end": 80.1538,
          "speaker": "Nikola",
          "text": "Decide what to retain, or remove the selected detail and verify the baseline. Keep a rollback path for the transition itself. That makes this a bounded experiment an application team can understand."
        },
        {
          "start": 80.3938,
          "end": 84.8201,
          "speaker": "Tyler",
          "text": "What should we leave for the next person who wants to repeat it?"
        },
        {
          "start": 85.0601,
          "end": 98.0621,
          "speaker": "Nikola",
          "text": "Prerequisites, supported conditions, pinned versions, each change operation, the observations that establish success, and the recovery procedure. Enough to understand what enrolling a service will do."
        },
        {
          "start": 98.3021,
          "end": 109.5169,
          "speaker": "Tyler",
          "text": "One service, one question, and a clear way back. That sounds like an experiment we can discuss, rather than a platform migration hidden in a debugging session."
        }
      ],
      "start": 960,
      "end": 1070,
      "audio": "narration/13-try-it.mp3"
    },
    {
      "id": "14-prediction",
      "kind": "question",
      "title": "Which question actually needs more depth?",
      "duration": 55,
      "turns": [
        {
          "speaker": "Nikola",
          "text": "Let's test that rule. Which service is returning errors? Do you inspect existing request signals first, or add method instrumentation first? Take five seconds to choose."
        },
        {
          "speaker": "Tyler",
          "text": "Start with the existing request signals. They may already identify the service and the affected request path."
        },
        {
          "speaker": "Nikola",
          "text": "Correct. Now change the question: which local calculation inside checkout consumes the time?"
        },
        {
          "speaker": "Tyler",
          "text": "The baseline may leave that work unnamed. Now selected runtime detail is worth considering, because the question needs a different observation."
        },
        {
          "speaker": "Nikola",
          "text": "Same system, different question, different next step. These are hypothetical cases, but the decision rule travels: examine the evidence you have, then add what the unanswered question needs."
        }
      ],
      "pauseAfter": {
        "0": 5.0
      },
      "buildAfter": 0,
      "lead": "Nikola",
      "cues": [
        {
          "start": 0.65,
          "end": 12.243,
          "speaker": "Nikola",
          "text": "Let's test that rule. Which service is returning errors? Do you inspect existing request signals first, or add method instrumentation first? Take five seconds to choose."
        },
        {
          "start": 17.483,
          "end": 25.4833,
          "speaker": "Tyler",
          "text": "Start with the existing request signals. They may already identify the service and the affected request path."
        },
        {
          "start": 25.7233,
          "end": 31.5655,
          "speaker": "Nikola",
          "text": "Correct. Now change the question: which local calculation inside checkout consumes the time?"
        },
        {
          "start": 31.8055,
          "end": 42.1394,
          "speaker": "Tyler",
          "text": "The baseline may leave that work unnamed. Now selected runtime detail is worth considering, because the question needs a different observation."
        },
        {
          "start": 42.3794,
          "end": 54.3846,
          "speaker": "Nikola",
          "text": "Same system, different question, different next step. These are hypothetical cases, but the decision rule travels: examine the evidence you have, then add what the unanswered question needs."
        }
      ],
      "buildTime": 17.483,
      "start": 1070,
      "end": 1125,
      "audio": "narration/14-prediction.mp3"
    },
    {
      "id": "15-close",
      "kind": "close",
      "title": "Pick one service. Name one unanswered question.",
      "duration": 75,
      "turns": [
        {
          "speaker": "Tyler",
          "text": "Back to checkout. We started with a slow service and an unexplained local interval. In the illustrated depth view, the pricing operation has a name and a place inside the request."
        },
        {
          "speaker": "Nikola",
          "text": "And checkout is still slow. We should probably stop congratulating the tracing and investigate the calculation."
        },
        {
          "speaker": "Tyler",
          "text": "That's the point. The explanation improved, so we have a specific operation to investigate. Broad coverage got us oriented; selected detail closed a gap."
        },
        {
          "speaker": "Nikola",
          "text": "A shared deployment workflow should make those views manageable. Upgrades, removal, measured cost, and verified transitions determine whether the workflow is useful to operate."
        },
        {
          "speaker": "Tyler",
          "text": "Your next step is small. Choose one service. Write down a question its current telemetry cannot answer. Identify the observation that could close that gap, and what would convince you the change is correct."
        },
        {
          "speaker": "Nikola",
          "text": "Keep the detail that helps, and remove it when it no longer earns its place."
        },
        {
          "speaker": "Tyler",
          "text": "Start broad. Add depth with purpose. Manage and verify the profile. Thank you."
        }
      ],
      "lead": "Tyler",
      "cues": [
        {
          "start": 0.65,
          "end": 14.2789,
          "speaker": "Tyler",
          "text": "Back to checkout. We started with a slow service and an unexplained local interval. In the illustrated depth view, the pricing operation has a name and a place inside the request."
        },
        {
          "start": 14.5189,
          "end": 21.8256,
          "speaker": "Nikola",
          "text": "And checkout is still slow. We should probably stop congratulating the tracing and investigate the calculation."
        },
        {
          "start": 22.0656,
          "end": 34.8646,
          "speaker": "Tyler",
          "text": "That's the point. The explanation improved, so we have a specific operation to investigate. Broad coverage got us oriented; selected detail closed a gap."
        },
        {
          "start": 35.1046,
          "end": 47.0972,
          "speaker": "Nikola",
          "text": "A shared deployment workflow should make those views manageable. Upgrades, removal, measured cost, and verified transitions determine whether the workflow is useful to operate."
        },
        {
          "start": 47.3372,
          "end": 62.5136,
          "speaker": "Tyler",
          "text": "Your next step is small. Choose one service. Write down a question its current telemetry cannot answer. Identify the observation that could close that gap, and what would convince you the change is correct."
        },
        {
          "start": 62.7536,
          "end": 67.575,
          "speaker": "Nikola",
          "text": "Keep the detail that helps, and remove it when it no longer earns its place."
        },
        {
          "start": 67.815,
          "end": 74.2582,
          "speaker": "Tyler",
          "text": "Start broad. Add depth with purpose. Manage and verify the profile. Thank you."
        }
      ],
      "start": 1125,
      "end": 1200,
      "audio": "narration/15-close.mp3"
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
      "label": "Piper speech synthesis",
      "url": "https://github.com/OHF-Voice/piper1-gpl"
    },
    {
      "label": "Bryce male voice model and provenance",
      "url": "https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/bryce/medium/MODEL_CARD"
    },
    {
      "label": "John male voice model and provenance",
      "url": "https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_US/john/medium/MODEL_CARD"
    }
  ],
  "videoFile": "opentelemetry-far-and-wide-20min-dialogue.mp4",
  "speakers": {
    "Tyler": {
      "model": "dialogue/en_US-bryce-medium.onnx",
      "voiceName": "Bryce",
      "gender": "male",
      "role": "Tyler draft role"
    },
    "Nikola": {
      "model": "dialogue/en_US-john-medium.onnx",
      "voiceName": "John",
      "gender": "male",
      "role": "Nikola draft role"
    }
  }
};
