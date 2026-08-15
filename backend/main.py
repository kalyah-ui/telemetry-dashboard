from fastapi import FastAPI
import log_generator
import json
import glob
import random
import time

app = FastAPI()

START_TIME = time.time()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/logs")
def read_logs():
    # find all log files
    log_files = sorted(glob.glob("logs/*.log"))
    if not log_files:
        return []

    latest_file = log_files[-1]

    logs = []
    with open(latest_file, "r") as file:
        for line in file:
            try:
                logs.append(json.loads(line))
            except json.JSONDecodeError:
                continue  # skip bad lines

    return logs[-50:]

@app.get("/errors")
def read_error():
    log_files = sorted(glob.glob("logs/*.log"))
    if not log_files:
        return []

    latest_file = log_files[-1]

    errors = []
    with open(latest_file, "r") as f:
        for line in f:
            try:
                entry = json.loads(line)
                if entry["level"] == "ERROR":
                    errors.append(entry)
            except:
                continue

    return errors[-50:]


@app.get("/metrics")
def read_metric():
    log_files = sorted(glob.glob("logs/*.log"))
    if not log_files:
        return {}

    latest_file = log_files[-1]

    logs = []
    with open(latest_file, "r") as f:
        for line in f:
            try:
                logs.append(json.loads(line))
            except:
                continue

    if not logs:
        return {}

    latencies = [log["latency_ms"] for log in logs]
    errors = [log for log in logs if log["level"] == "ERROR"]

    metrics = {
        "avg_latency_ms": sum(latencies) / len(latencies),
        "requests_last_minute": len(logs),  # simple version
        "error_rate": len(errors) / len(logs),
        "cpu_percent": random.randint(10, 80),
        "memory_mb": random.randint(200, 800),
        "uptime_seconds": int(time.time() - START_TIME)
    }

    return metrics