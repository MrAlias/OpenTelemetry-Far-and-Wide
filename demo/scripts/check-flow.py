#!/usr/bin/env python3
"""Exercise real HTTP/SQL/Redis work and validate every edge in the demo flow."""
import json
import sys
import urllib.request

GRAPH = {
    "cart": ("Rails", ["catalog", "tax"]),
    "catalog": ("Java", ["recommendations"]),
    "recommendations": ("Python", ["promotions"]),
    "promotions": ("Rails", []),
    "tax": (".NET", ["currency"]),
    "currency": ("Go", []),
    "shipping": ("Go", ["warehouse"]),
    "warehouse": ("Go", ["stock-planner"]),
    "stock-planner": ("Python", []),
    "payments": ("Java", ["fraud"]),
    "fraud": ("Java", ["customer-profile"]),
    "customer-profile": (".NET", ["loyalty"]),
    "loyalty": ("Rails", []),
    "notifications": (".NET", ["receipts"]),
    "receipts": ("Python", []),
}


def check_flow(result):
    assert result["price"] == 42, result
    assert result["inventory"] == {"available": True}, result
    assert isinstance(result["orderId"], int) and result["orderId"] > 0, result
    assert [item["service"] for item in result["services"]] == ["cart", "shipping", "payments", "notifications"]
    visited = {}

    def visit(item):
        name = item["service"]
        assert name not in visited, f"Repeated service: {name}"
        visited[name] = item["details"]
        language, children = GRAPH[name]
        assert item["language"] == language, name
        assert [child["service"] for child in item["dependencies"]] == children, name
        for child in item["dependencies"]:
            visit(child)

    for root in result["services"]:
        visit(root)
    assert set(visited) == set(GRAPH), visited.keys()
    assert {"id": 1, "name": "Demo product"} in visited["catalog"]["products"]
    assert visited["stock-planner"]["productCount"] >= 1
    assert visited["receipts"]["orderCount"] >= 1
    assert visited["loyalty"]["points"] >= 4
    assert visited["cart"]["visits"] >= 1
    assert "Demo product" in visited["recommendations"]["items"]
    assert visited["promotions"]["code"] == "WELCOME10"
    for name in ["catalog", "stock-planner", "receipts", "loyalty"]:
        assert visited[name]["store"] == "postgresql", name
    for name in ["cart", "recommendations", "promotions"]:
        assert visited[name]["store"] == "redis", name
    return visited


if __name__ == "__main__":
    endpoint = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080/checkout"
    results = []
    for _ in range(2):
        with urllib.request.urlopen(endpoint, timeout=15) as response:
            result = json.load(response)
        visited = check_flow(result)
        results.append((result, visited))
    assert results[1][0]["orderId"] > results[0][0]["orderId"], "Order IDs did not advance"
    assert results[1][1]["cart"]["visits"] > results[0][1]["cart"]["visits"], "Redis counter did not advance"
    print("OK: gateway, checkout, inventory + all 15 commerce services; PostgreSQL reads/writes and Redis cache/counter.")
