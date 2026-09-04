import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';

/**
 * The appointment path is the one place on this site where being wrong has a
 * cost outside the browser: a client fills in a form, reads a confirmation, and
 * nobody ever contacts them.
 *
 * These are the guarantees that must not regress.
 */

const ROUTE = readFileSync(new URL('../app/api/appointments/route.ts', import.meta.url), 'utf8');
const FORM = readFileSync(
  new URL('../components/appointments/RequestForm.tsx', import.meta.url),
  'utf8',
);

test('the route refuses to accept a request it cannot deliver', () => {
  assert.match(
    ROUTE,
    /if \(!isAppointmentDeliveryConfigured \|\| !appointmentEndpoint\)/,
    'the unconfigured case must be handled explicitly',
  );
  assert.match(ROUTE, /reason: 'unavailable' \}, 503/, 'and answered with 503, not 200');
});

test('only a successful response from the destination counts as delivered', () => {
  assert.match(ROUTE, /if \(!response\.ok\)/);
  assert.match(ROUTE, /reason: 'failed' \}, 502/);
});

test('the form shows a confirmation only when the server said ok', () => {
  assert.match(
    FORM,
    /if \(result\.ok\) \{\s*setStatus\('sent'\);/,
    "'sent' must be reachable only from a confirmed ok",
  );
  const sentAssignments = FORM.match(/setStatus\('sent'\)/g) ?? [];
  assert.equal(sentAssignments.length, 1, 'there must be exactly one path to the success screen');
});

test('nothing the visitor typed is written to the log', () => {
  const logCalls = ROUTE.match(/console\.(log|warn|error)\([^)]*\)/g) ?? [];
  for (const call of logCalls) {
    for (const field of ['payload.name', 'payload.email', 'payload.about', 'payload.telephone']) {
      assert.ok(!call.includes(field), `log call must not include ${field}: ${call}`);
    }
  }
});

test('the honeypot answers as though it succeeded', () => {
  assert.match(
    ROUTE,
    /if \(payload\.company\) return respond\(\{ ok: true \}, 200\);/,
    'a script filling the hidden field should learn nothing',
  );
});

test('delivery is bounded by a timeout', () => {
  assert.match(ROUTE, /new AbortController\(\)/);
  assert.match(ROUTE, /controller\.abort\(\)/);
  assert.match(ROUTE, /signal: controller\.signal/);
});
