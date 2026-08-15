import os
import datetime
import random
import json

class CustomLogGenerator:
    def __init__(self, log_folder, file_prefix, max_file_size=1e6):
        self.log_folder = log_folder
        self.file_prefix = file_prefix
        self.max_file_size = max_file_size

        if not os.path.exists(self.log_folder):
            os.makedirs(self.log_folder)

    def _get_filename(self, date_str, file_number = None):
        if file_number:
            return f"{self.log_folder}/{self.file_prefix}{date_str}_{file_number}.log"
        else:
            return f"{self.log_folder}/{self.file_prefix}{date_str}.log"

    def _get_next_file_number(self, date_str):
        i = 1
        while True:
            log_file = self._get_filename(date_str, i)
            if not os.path.exists(log_file):
                return i
            i += 1

    def generate_log(self):
        levels = ["INFO", "WARNING", "ERROR", "DEBUG"]
        level = random.choice(levels)

        messages = [
            "User login successful",
            "Cache miss for key session_123",
            "Database connection timeout",
            "Unhandled exception in payment module",
            "API response latency high"
        ]
        message = random.choice(messages)

        latency = random.randint(20, 500)

        if level == "ERROR":
            message += " | Traceback: ValueError: invalid input"

        date_str = datetime.datetime.now().strftime("%d%m%Y")
        log_file = self._get_filename(date_str)
        next_file_number = 1

        if os.path.exists(log_file) and os.path.getsize(log_file) > self.max_file_size:
            while True:
                log_file = self._get_filename(date_str, next_file_number)
                if not os.path.exists(log_file) or os.path.getsize(log_file) <= self.max_file_size:
                    break
            next_file_number += 1

        log_entry = {
            "timestamp": datetime.datetime.now().isoformat(),
            "level": level,
            "message": message,
            "latency_ms": latency
        }

        with open(log_file, 'a') as f:
            f.write(json.dumps(log_entry) + "\n")