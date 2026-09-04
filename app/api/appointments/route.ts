import { NextResponse } from 'next/server';

import { appointmentEndpoint, isAppointmentDeliveryConfigured } from '@/lib/env';
import { validate, type RequestPayload, type RequestResult } from '@/lib/appointments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Where an appointment request goes.
 *
 * There is no fallback that quietly swallows a request. If no destination is
 * configured the route refuses with 503 and the form is presented as switched
 * off, because a client who fills in a form and reads "thank you" has been
 * misled if nothing arrived.
 *
 * Only a 2xx from the configured destination counts as delivered.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const seen = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (seen.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  seen.set(key, recent);

  // The map is swept opportunistically so a long-running instance does not grow
  // without bound.
  if (seen.size > 5000) {
    for (const [entry, times] of seen) {
      if (times.every((time) => now - time >= WINDOW_MS)) seen.delete(entry);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function respond(result: RequestResult, status: number) {
  return NextResponse.json(result, { status });
}

export async function POST(request: Request) {
  let payload: Partial<RequestPayload>;
  try {
    payload = (await request.json()) as Partial<RequestPayload>;
  } catch {
    return respond({ ok: false, reason: 'invalid', fields: {} }, 400);
  }

  // The honeypot is a field a person never sees. Anything that fills it is
  // answered as though it succeeded, so a script learns nothing.
  if (payload.company) return respond({ ok: true }, 200);

  const fields = validate(payload);
  if (Object.keys(fields).length > 0) {
    return respond({ ok: false, reason: 'invalid', fields }, 422);
  }

  const forwarded = request.headers.get('x-forwarded-for');
  const key = forwarded?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(key)) {
    return respond({ ok: false, reason: 'rate-limited' }, 429);
  }

  if (!isAppointmentDeliveryConfigured || !appointmentEndpoint) {
    // Logged without any of what the visitor typed.
    console.warn('[appointments] refused: APPOINTMENT_ENDPOINT is not configured');
    return respond({ ok: false, reason: 'unavailable' }, 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(appointmentEndpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        intent: payload.intent ?? 'appointment',
        name: payload.name?.trim(),
        email: payload.email?.trim(),
        telephone: payload.telephone?.trim() || undefined,
        place: payload.place,
        about: payload.about?.trim() || undefined,
        timing: payload.timing?.trim() || undefined,
        receivedAt: new Date().toISOString(),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('[appointments] destination rejected the request', response.status);
      return respond({ ok: false, reason: 'failed' }, 502);
    }

    return respond({ ok: true }, 200);
  } catch (error) {
    // The message is logged, never the body of the request.
    console.error('[appointments] delivery failed', error instanceof Error ? error.message : error);
    return respond({ ok: false, reason: 'failed' }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
