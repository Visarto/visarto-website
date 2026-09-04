#!/usr/bin/env bash
#
# Runs the behaviour checks against two application instances: one with nothing
# configured, and one pointed at a local receiver, so both halves of the
# appointment path are exercised.
set -uo pipefail

PORT="${PORT:-4313}"
CONFIGURED_PORT="${CONFIGURED_PORT:-4314}"
DELIVERY_PORT="${DELIVERY_PORT:-4399}"

PIDS=()

stop_all() {
  for pid in "${PIDS[@]:-}"; do
    [ -n "$pid" ] && { kill -- "-$pid" >/dev/null 2>&1 || kill "$pid" >/dev/null 2>&1; }
  done
  sleep 1
}
trap stop_all EXIT

setsid node scripts/delivery-receiver.mjs > /tmp/visarto-receiver.log 2>&1 &
PIDS+=($!)

setsid npm run start -- -p "$PORT" > /tmp/visarto-behaviour.log 2>&1 &
PIDS+=($!)

setsid env APPOINTMENT_ENDPOINT="http://localhost:$DELIVERY_PORT/deliver" \
  npm run start -- -p "$CONFIGURED_PORT" > /tmp/visarto-behaviour-configured.log 2>&1 &
PIDS+=($!)

for _ in $(seq 1 40); do
  curl -sf -o /dev/null "http://localhost:$PORT/" \
    && curl -sf -o /dev/null "http://localhost:$CONFIGURED_PORT/" \
    && break
  sleep 1
done

BASE="http://localhost:$PORT" \
CONFIGURED_BASE="http://localhost:$CONFIGURED_PORT" \
DELIVERY_BASE="http://localhost:$DELIVERY_PORT" \
  env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  node scripts/behaviour.mjs
exit $?
