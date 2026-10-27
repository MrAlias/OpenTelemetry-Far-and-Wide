window.RESOLUTION = {
  "version": "2026-10-27-timeout-fallback-and-real-trace",
  "recordedAt": "2026-10-27T19:41:42.960656+00:00",
  "method": "Median Gateway GET /checkout server duration; 30 sequential complete successful checkouts per image after 20 successful warmups, concurrency one, 100 ms between requests. Same instrumentation and template except image. Local JVM, database and scheduling variation remains; total-duration change need not equal the configured timeout.",
  "controls": {
    "sameInstrumentation": true,
    "sameTemplateExceptImageSha256": "84b664e25534c81a0270760db64d0ee73cb2ffe35930720bf06580011ddd8d69",
    "sdkServices": [
      "checkout"
    ],
    "applicationServices": 18,
    "databaseDependencies": [
      "postgres",
      "redis"
    ],
    "fullResponseFlowValidated": true,
    "concurrency": 1,
    "noConcurrentBuildRecordingOrNarration": true
  },
  "before": {
    "image": "far-wide-demo-checkout:timeout",
    "sampleCount": 30,
    "warmupCount": 20,
    "requestMedianMs": 361.62698950000004,
    "pricingMedianMs": 157.0313965,
    "exemplarTraceId": "f9f9731fb7524e0bbf067c4cbab22eea",
    "exemplarRequestMs": 365.039673,
    "exemplarPricingMs": 155.955326,
    "samples": [
      {
        "traceId": "f364edfc992641cea46cab6dc5ea627a",
        "requestMs": 418.20759,
        "pricingMs": 159.592586,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "7aff794637334ce7ae6cd86497acfd88",
        "requestMs": 243.858844,
        "pricingMs": 153.158382,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "dbac942dbbff452fbee85f2a2376e404",
        "requestMs": 254.850333,
        "pricingMs": 153.869113,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "426a18f86f0c4dce8da9fcc70e3778c2",
        "requestMs": 259.714436,
        "pricingMs": 152.903828,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "fedaa901c4ff428591e4b388291230b8",
        "requestMs": 373.470409,
        "pricingMs": 156.871716,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "198ca1b87924434ca771703c2a9783f7",
        "requestMs": 348.675055,
        "pricingMs": 160.108239,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "ddd5a93b956d4093b455039cbe64fb57",
        "requestMs": 415.106936,
        "pricingMs": 157.555293,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "6ab4d515478d4cd3a1db5689069c01be",
        "requestMs": 351.019465,
        "pricingMs": 162.349797,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "725a276eac9d43f2910d12e83d467aef",
        "requestMs": 373.610185,
        "pricingMs": 155.883987,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "22b7b355330c4636951fe8a247f766a6",
        "requestMs": 299.867225,
        "pricingMs": 162.068395,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "af2285afca9c47d1ae83631b363e1f15",
        "requestMs": 414.453424,
        "pricingMs": 155.980964,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "3881d7e9fa1a4665a57bad55ed751e6a",
        "requestMs": 296.612816,
        "pricingMs": 154.199545,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "abad81e915634c778168b3709543d622",
        "requestMs": 419.154302,
        "pricingMs": 155.915781,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "5f21adde7a95447a884d67de2ca10ddf",
        "requestMs": 374.047776,
        "pricingMs": 160.667874,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "f9f9731fb7524e0bbf067c4cbab22eea",
        "requestMs": 365.039673,
        "pricingMs": 155.955326,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "3005b06ee3f64821bb7b8f4d1a684026",
        "requestMs": 289.035199,
        "pricingMs": 157.607751,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "8c8e892def3c4ee59a48589625e4ff41",
        "requestMs": 433.322676,
        "pricingMs": 156.736421,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "1e01c27dc6444c908a3f030805d15f76",
        "requestMs": 256.147336,
        "pricingMs": 153.683236,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "94480c357055498e9281c792998c356f",
        "requestMs": 414.02582,
        "pricingMs": 157.426918,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "d41116860dae488fb097294b391fb25a",
        "requestMs": 377.601076,
        "pricingMs": 159.656726,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "9ef219e3bafc41e48d17a85ef3907fcc",
        "requestMs": 426.837613,
        "pricingMs": 157.346553,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "83945f9cc39d491387b98086170582dd",
        "requestMs": 365.388399,
        "pricingMs": 162.453653,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "5a66e547dde14c18b71e36960bbf19d6",
        "requestMs": 351.190093,
        "pricingMs": 157.094761,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "50ff124c90c44cd9a70f5f4710f667b9",
        "requestMs": 451.744096,
        "pricingMs": 156.968032,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "be612ee3edc04766816d8fca5f600af8",
        "requestMs": 294.452718,
        "pricingMs": 154.080078,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "644cbb52aeee420fbe07bc1157f87698",
        "requestMs": 335.223743,
        "pricingMs": 156.277617,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "e03b1e9b41a442aba4cbf52bafeced5c",
        "requestMs": 358.214306,
        "pricingMs": 157.521795,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "66863b2aea5c4e7f9020048b0e0ae03c",
        "requestMs": 336.850275,
        "pricingMs": 156.327616,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "853c8866cb0a4401b2472ea6a634a803",
        "requestMs": 326.496832,
        "pricingMs": 157.24,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "7c7d6fb00d52481b9e371c0735ae2e15",
        "requestMs": 411.306576,
        "pricingMs": 157.403411,
        "status": 200,
        "price": 42
      }
    ]
  },
  "after": {
    "image": "far-wide-demo-checkout:pricing-fixed",
    "sampleCount": 30,
    "warmupCount": 20,
    "requestMedianMs": 214.088603,
    "pricingMedianMs": 4.001466000000001,
    "exemplarTraceId": "99aef33f6f7c4db09a39703cd9d57bf5",
    "exemplarRequestMs": 215.033806,
    "exemplarPricingMs": 2.406217,
    "samples": [
      {
        "traceId": "9ac0f9dd95e94c1bb3631d950bb1f7b7",
        "requestMs": 118.585143,
        "pricingMs": 2.387246,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "1c1dfe76700f42449b71e0f5c713492a",
        "requestMs": 266.839231,
        "pricingMs": 4.659513,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "5bde06e10ca94b30827a76f8f5704d81",
        "requestMs": 181.256395,
        "pricingMs": 6.216073,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "86a6cb7009ac43b0abf51d9e86061753",
        "requestMs": 304.150205,
        "pricingMs": 4.492258,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "1cbf0f2aba844334abba37ff75913543",
        "requestMs": 216.933286,
        "pricingMs": 4.002608,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "7d71929acc8f4a63b8393f91206090d5",
        "requestMs": 116.822788,
        "pricingMs": 1.453832,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "99aef33f6f7c4db09a39703cd9d57bf5",
        "requestMs": 215.033806,
        "pricingMs": 2.406217,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "24fc369e7c3c4134ad7d80103ee65219",
        "requestMs": 201.281874,
        "pricingMs": 3.963044,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "3809ad1665ec4225a2112b9d638a0339",
        "requestMs": 213.1434,
        "pricingMs": 2.728112,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "e416728775a342fe9cb3b41b17d8fd9f",
        "requestMs": 285.859948,
        "pricingMs": 5.405232,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "310c36b3e36345b4bd7b6cdceb059c4f",
        "requestMs": 212.289284,
        "pricingMs": 2.839324,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "8d73606920a64795aa246c348f41e462",
        "requestMs": 338.847949,
        "pricingMs": 6.35164,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "18df556c5a5140a8b29e664d0b0368db",
        "requestMs": 103.510072,
        "pricingMs": 1.231454,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "f920c0a73caa4d99887b23e477e5afab",
        "requestMs": 225.362969,
        "pricingMs": 4.718214,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "7297ac4ffaea434685adbadf39c6c5be",
        "requestMs": 215.884917,
        "pricingMs": 5.35419,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "8937aeeff1534a3d8916f3961ae1f26f",
        "requestMs": 273.427864,
        "pricingMs": 5.373532,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "e5976911109f429994d26029715da86f",
        "requestMs": 228.542914,
        "pricingMs": 2.085563,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "ba5632a019a9499cbfe9c232a932270b",
        "requestMs": 188.990511,
        "pricingMs": 5.191155,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "bc4106118ec0439aa61d634cf48e5d54",
        "requestMs": 102.507919,
        "pricingMs": 2.088795,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "e693ef9e51004600a5b8a1ce70bcf156",
        "requestMs": 92.135521,
        "pricingMs": 1.434391,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "55247f34c09a4dd2b05b9cea05bad82a",
        "requestMs": 186.000289,
        "pricingMs": 3.217264,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "3c660ad81da241caad1129f40b4f9c56",
        "requestMs": 175.142175,
        "pricingMs": 5.334484,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "1505c546b20a4d68948cbf77b9aa3164",
        "requestMs": 295.239527,
        "pricingMs": 6.52213,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "8213a614bad4495eb5988072f0d4e47f",
        "requestMs": 240.447693,
        "pricingMs": 4.532239,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "b89c3272fd4b4f8f8b608dcd472548bc",
        "requestMs": 246.490116,
        "pricingMs": 6.2948,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "0e1c1a4289e0445ea3e44099afd78d4e",
        "requestMs": 158.676287,
        "pricingMs": 4.000324,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "2ad6c51e5952498da772e8766985ea41",
        "requestMs": 161.089271,
        "pricingMs": 3.11767,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "0fc65013640343aaa945835de8560612",
        "requestMs": 155.099597,
        "pricingMs": 6.324248,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "043c3a07dfe745a7bef84fed45109d40",
        "requestMs": 234.78893,
        "pricingMs": 3.868028,
        "status": 200,
        "price": 42
      },
      {
        "traceId": "c74101e928424bbfb1802016f7f569b6",
        "requestMs": 222.651884,
        "pricingMs": 3.482984,
        "status": 200,
        "price": 42
      }
    ]
  },
  "change": "Remove the real HTTP connection attempt to missing legacy pricing (150 ms connect/read timeout); retain the authoritative PostgreSQL price lookup, value 42, order creation and full checkout flow.",
  "scope": "Local seeded missing-dependency demonstration, not a production benchmark. Successful timeout-and-fallback baseline compared with direct use of the same price store. No incident, labor, outage or revenue saving inferred from latency.",
  "sources": [
    "scripts/presentation/measure_resolution.py",
    "demo/apps/checkout/baseline/PricingEngine.java",
    "demo/apps/checkout/fixes/PricingEngine.java",
    "demo/k8s/checkout-pricing-fixed.patch.yaml"
  ],
  "fleetAfterFix": {
    "traceId": "05fed0b791c2427f83c14ed3c0c9be8c",
    "sdkServices": [
      "cart",
      "catalog",
      "checkout",
      "customer-profile",
      "fraud",
      "inventory",
      "loyalty",
      "notifications",
      "payments",
      "promotions",
      "receipts",
      "recommendations",
      "stock-planner",
      "tax"
    ],
    "obiOnlyServices": [
      "gateway",
      "shipping",
      "warehouse",
      "currency"
    ],
    "pricingMs": 2.072588,
    "catalogDatabaseSpans": [
      "SELECT checkout.products"
    ],
    "price": 42,
    "orderId": 493
  },
  "openingExemplarMs": 350.341063,
  "visualEvidence": {
    "openingTraceId": "e7f5bb95c0acdaf1996964a6489547a3",
    "javaTraceId": "09007e84d580263d160932d7e72f772b",
    "fixedTraceId": "99aef33f6f7c4db09a39703cd9d57bf5",
    "fleetTraceId": "05fed0b791c2427f83c14ed3c0c9be8c"
  }
};
