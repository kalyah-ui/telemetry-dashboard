from log_generator import CustomLogGenerator
import time
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_DIR = os.path.join(BASE_DIR, "logs")

gen = CustomLogGenerator(LOG_DIR, "app_")

while True: 
    gen.generate_log()
    time.sleep(5)