#!/usr/bin/env bash
set -uo pipefail
PORT="${PORT:-4316}"
PIDFILE=".lcp-server.pid"
stop() { [ -f "$PIDFILE" ] && { kill -- "-$(cat $PIDFILE)" 2>/dev/null || kill "$(cat $PIDFILE)" 2>/dev/null; rm -f "$PIDFILE"; sleep 1; }; }
trap stop EXIT
stop
setsid npm run start -- -p "$PORT" > /tmp/visarto-lcp.log 2>&1 &
echo $! > "$PIDFILE"
for _ in $(seq 1 40); do curl -sf -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done
export BASE="http://localhost:$PORT"
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy INTRO=off node scripts/lcp.mjs
echo
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy node scripts/lcp.mjs
