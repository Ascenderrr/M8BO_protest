#!/usr/bin/env python3
import subprocess
import os
import time

time.sleep(10)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_FILE = os.path.join(SCRIPT_DIR, "index.html")
url = f"file://{INDEX_FILE}"

subprocess.Popen([
    "chromium-browser",
    "--kiosk",
    "--noerrdialogs",
    "--disable-infobars",
    "--no-first-run",
    url
])
