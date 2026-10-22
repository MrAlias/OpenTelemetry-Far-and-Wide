import json
import os

from flask import Flask, jsonify
import psycopg
import redis
import requests

app = Flask(__name__)
name = os.environ["SERVICE_NAME"]
if name not in {"recommendations", "stock-planner", "receipts"}:
    raise ValueError(f"Unknown SERVICE_NAME: {name}")
downstream = list(filter(None, os.environ.get("DOWNSTREAM_SERVICES", "").split(",")))
cache = redis.Redis.from_url(
    os.environ.get("REDIS_URL", "redis://redis:6379/0"),
    decode_responses=True, socket_connect_timeout=2, socket_timeout=2,
)


def details():
    if name == "recommendations":
        cache.set("recommendations:demo-shopper", json.dumps(["Demo product", "Gift wrap"]), nx=True)
        return {"items": json.loads(cache.get("recommendations:demo-shopper")), "store": "redis"}
    with psycopg.connect(
        host=os.environ["DATABASE_HOST"], dbname="checkout",
        user=os.environ["DATABASE_USER"], password=os.environ["DATABASE_PASSWORD"],
        connect_timeout=2, options="-c statement_timeout=2000",
    ) as connection:
        if name == "stock-planner":
            count = connection.execute("SELECT count(*) FROM products").fetchone()[0]
            return {"productCount": count, "restockThreshold": 10, "store": "postgresql"}
        count = connection.execute("SELECT count(*) FROM checkout_orders").fetchone()[0]
        return {"orderCount": count, "format": "email", "store": "postgresql"}


@app.get("/healthz")
def health():
    return "ok\n"


@app.get("/work")
def work():
    try:
        result = details()
        dependencies = []
        for service in downstream:
            with requests.get(f"http://{service}:8080/work", timeout=(2, 3)) as response:
                response.raise_for_status()
                dependencies.append(response.json())
        return jsonify(service=name, language="Python", details=result, dependencies=dependencies)
    except (psycopg.Error, redis.RedisError, requests.RequestException, ValueError):
        app.logger.exception("Dependency failed for %s", name)
        return jsonify(service=name, error="dependency unavailable"), 502
