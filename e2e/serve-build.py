"""Serve the built frontend to Chromium on loopback only."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class BuildServer(ThreadingHTTPServer):
    # Parallel chunk and image requests can overrun the default backlog of five.
    request_queue_size = 64


handler = partial(SimpleHTTPRequestHandler, directory="dist/udupi-darshan-fe")
with BuildServer(("127.0.0.1", 4173), handler) as server:
    server.serve_forever()
