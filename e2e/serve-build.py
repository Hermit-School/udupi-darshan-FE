"""Serve the built frontend to Chromium on loopback only."""
import json
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class BuildServer(ThreadingHTTPServer):
    # Parallel chunk and image requests can overrun the default backlog of five.
    request_queue_size = 64


# Use the exact Firebase catch-all policy in every production-build browser test.
security_headers = next(rule["headers"] for rule in json.loads(Path("firebase.json").read_text())["hosting"]["headers"] if rule.get("source") == "**")


class HostingHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        for header in security_headers:
            self.send_header(header["key"], header["value"])
        super().end_headers()


handler = partial(HostingHandler, directory="dist/udupi-darshan-fe")
with BuildServer(("127.0.0.1", 4173), handler) as server:
    server.serve_forever()
