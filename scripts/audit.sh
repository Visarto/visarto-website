#!/usr/bin/env bash
set -uo pipefail
PORT="${PORT:-4312}"
PATHS="${1:-/}"
PIDFILE=".audit-server.pid"

stop_server() {
  if [ -f "$PIDFILE" ]; then
    kill -- "-$(cat "$PIDFILE")" >/dev/null 2>&1 || kill "$(cat "$PIDFILE")" >/dev/null 2>&1
    rm -f "$PIDFILE"
    sleep 1
  fi
}
stop_server

setsid npm run start -- -p "$PORT" > /tmp/visarto-audit.log 2>&1 &
echo $! > "$PIDFILE"
for _ in $(seq 1 40); do curl -sf -o /dev/null "http://localhost:$PORT/" && break; sleep 1; done

BASE="http://localhost:$PORT" env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  node scripts/audit.mjs "$PATHS"
STATUS=$?
stop_server
exit $STATUS
