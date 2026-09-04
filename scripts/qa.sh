#!/usr/bin/env bash
# Rebuild, serve the production output, capture screenshots, then stop.
# The server pid is tracked in a file rather than matched by name, so nothing
# else on the machine is signalled.
set -uo pipefail
PORT="${PORT:-4311}"
PATHS="${1:-/}"
PIDFILE=".qa-server.pid"

stop_server() {
  if [ -f "$PIDFILE" ]; then
    # npm spawns the real server as a child, so the whole process group is
    # signalled rather than just the wrapper.
    kill -- "-$(cat "$PIDFILE")" >/dev/null 2>&1 || kill "$(cat "$PIDFILE")" >/dev/null 2>&1
    rm -f "$PIDFILE"
    sleep 1
  fi
}

stop_server

npm run build 2>&1 | tail -n 20 || exit 1

setsid npm run start -- -p "$PORT" > /tmp/visarto-server.log 2>&1 &
echo $! > "$PIDFILE"

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "http://localhost:$PORT/" && break
  sleep 1
done

env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  node scripts/shoot.mjs "$PATHS"
STATUS=$?

stop_server
exit $STATUS
