from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import log_generator
import json
import glob
import random
import time
import datetime

app = FastAPI()

START_TIME = time.time()

@app.get("/")
def read_root():
    return RedirectResponse(url="/metrics")

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
    with open(latest_file, "r") as file:
        for line in file:
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
    with open(latest_file, "r") as file:
        for line in file:
            try:
                logs.append(json.loads(line))
            except:
                continue

    if not logs:
        return {}

    latencies = [log["latency_ms"] for log in logs]
    errors = [log for log in logs if log["level"] == "ERROR"]
    one_minute_ago = time.time() - 60

    recent_logs = []
    for log in logs:
        try:
            ts = datetime.datetime.fromisoformat(log["timestamp"]).timestamp()
            if ts >= one_minute_ago:
                recent_logs.append(log)
        except:
            continue

    metrics = {
        "avg_latency_ms": sum(latencies) / len(latencies),
        "requests_last_minute": len(recent_logs),
        "error_rate": len(errors) / len(logs),
        "cpu_percent": random.randint(10, 80),
        "memory_mb": random.randint(200, 800),
        "uptime_seconds": int(time.time() - START_TIME)
    }

    return metrics