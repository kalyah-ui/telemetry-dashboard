from fastapi import FastAPI
import log_generator
import json
import glob

app = FastAPI()

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
    return None