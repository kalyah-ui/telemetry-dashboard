from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import log_generator
import json
import glob
import os
import random
import time
import datetime

app = FastAPI()

START_TIME = time.time()


def get_recent_window_logs(days: int = 7):
    now = datetime.datetime.now()
    cutoff = now.replace(hour=0, minute=0, second=0, microsecond=0) - datetime.timedelta(days=7)
    log_files = sorted(glob.glob("logs/*.log"), key=os.path.getmtime, reverse=True)
    logs = []

    for file_path in log_files:
        try:
            with open(file_path, "r") as file:
                for line in file:
                    try:
                        entry = json.loads(line)
                        ts = datetime.datetime.fromisoformat(entry["timestamp"])
                        if ts >= cutoff:
                            logs.append(entry)
                    except (json.JSONDecodeError, KeyError, ValueError):
                        continue
        except OSError:
            continue

    logs.sort(key=lambda item: item["timestamp"])
    return logs


@app.get("/")
def read_root():
    return RedirectResponse(url="/metrics")


@app.get("/logs")
def read_logs():
    return get_recent_window_logs(7)


@app.get("/errors")
def read_error():
    logs = get_recent_window_logs(7)
    errors = [log for log in logs if log.get("level") == "ERROR"]
    return errors[-50:]


@app.get("/metrics")
def read_metric():
    logs = get_recent_window_logs(7)
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