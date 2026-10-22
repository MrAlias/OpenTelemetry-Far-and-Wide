# Demo applications

The [full walkthrough](../README.md) builds and deploys these services. Gateway
(Go), checkout (Java/Hibernate), and inventory (Node.js) retain the original
checkout flow. Checkout also calls four commerce branches, reaching all 15
services below on every successful request.

| Service | Implementation | Calls | Work |
| --- | --- | --- | --- |
| cart | Ruby / Rails | catalog, tax | Increment the demo shopper's Redis cart counter |
| catalog | Java | recommendations | Read product IDs and names from PostgreSQL with JDBC |
| recommendations | Python / Flask | promotions | Seed and read suggested products in Redis |
| promotions | Ruby / Rails | — | Seed and read the current promotion in Redis |
| tax | C# / ASP.NET Core | currency | Return the Ontario tax rate |
| currency | Go | — | Return a fixed CAD/USD exchange rate |
| shipping | Go | warehouse | Offer a simulated two-day delivery |
| warehouse | Go | stock-planner | Identify the Toronto warehouse and picking aisle |
| stock-planner | Python / Flask | — | Count PostgreSQL products for a restocking summary |
| payments | Java | fraud | Return a simulated payment authorization |
| fraud | Java | customer-profile | Return a fixed low-risk decision |
| customer-profile | C# / ASP.NET Core | loyalty | Return the demo shopper's region |
| loyalty | Ruby / Rails | — | Use Active Record to calculate points from PostgreSQL order totals |
| notifications | C# / ASP.NET Core | receipts | Simulate an email notification |
| receipts | Python / Flask | — | Read the PostgreSQL order count for a receipt summary |

There are three independent Deployments per new language, sharing one image per
language. `SERVICE_NAME` chooses the domain logic and `DOWNSTREAM_SERVICES` lists
the next HTTP calls. The [applications manifest](../k8s/applications.yaml) contains
all 18 applications, both databases, and the fixed, acyclic call graph. Each
commerce service exposes `/work` and `/healthz` on port 8080;
health checks do not call other services or databases.

Java uses Java 21 and JDBC; Python uses Python 3.14, Flask, requests, psycopg, and
redis-py; Rails uses Ruby 3.3, Rails 8.1, Puma, Active Record, and redis-rb. The .NET
services use .NET 10 and ASP.NET Core. Go services use the standard library.
Rails is an [API-only application](https://guides.rubyonrails.org/api_app.html).
None of these application images include OpenTelemetry SDKs or manual trace
context forwarding. OBI supplies the baseline instrumentation; the walkthrough
then injects only the existing Java checkout service.

PostgreSQL remains the source of products and orders. The additional services
only read its existing tables, so no schema migration or data reset is needed.
Redis is an ephemeral cache, populated on demand with three keys:
`cart:demo-shopper:visits`, `recommendations:demo-shopper`, and `promotions:active`.

The response preserves checkout's `price`, `inventory`, and `orderId`, and adds
a nested `services` array. Pricing still takes about 150 ms, and Hibernate still
saves an order. Commerce calls happen after that save, so a later dependency
failure returns 502 but does not roll back the already-saved order. This is a
telemetry demo, not a transactional payment workflow; all payments, customer
records, rates, and notifications are fictional.

Run `make -C demo smoke` from the repository root with gateway port-forwarded to
8080. The check sends two real checkouts and verifies every service and edge,
unchanged original response fields, increasing order IDs, PostgreSQL results,
and Redis counter/cache results. For another port, run:

```bash
python3 demo/scripts/check-flow.py http://localhost:18080/checkout
```

After changing a language implementation, rebuild that image, load it, and roll
its Deployments. For example, from the repository root:

```bash
docker build -t far-wide-demo-go:local demo/apps/go
kind load docker-image --name far-wide-demo far-wide-demo-go:local
kubectl rollout restart -n demo-apps deployment/shipping deployment/warehouse deployment/currency
```

The original [proof harness](../proof/README.md) retains its separate three-service
experiment. Its application sources and instrumentation settings are unchanged.
