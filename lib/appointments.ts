/**
 * The shape of an appointment or inquiry request, shared by the form and the
 * route that receives it.
 */

export const INTENTS = ['appointment', 'inquiry'] as const;
export type Intent = (typeof INTENTS)[number];

export const PLACES = ['studio', 'home', 'office', 'other'] as const;
export type Place = (typeof PLACES)[number];

export type RequestPayload = {
  intent: Intent;
  name: string;
  email: string;
  telephone?: string;
  place?: Place;
  about?: string;
  timing?: string;
  /** Honeypot. A real client leaves this empty because they never see it. */
  company?: string;
};

export type RequestResult =
  | { ok: true }
  | { ok: false; reason: 'invalid'; fields: Record<string, string> }
  | { ok: false; reason: 'unavailable' }
  | { ok: false; reason: 'rate-limited' }
  | { ok: false; reason: 'failed' };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validation runs on the server as well as in the browser. The messages are
 * written to be read by a person who has just made a mistake, so they say what
 * to do rather than what went wrong.
 */
export function validate(payload: Partial<RequestPayload>): Record<string, string> {
  const fields: Record<string, string> = {};

  const name = payload.name?.trim() ?? '';
  if (name.length < 2) fields.name = 'Please give us a name to reply to.';
  if (name.length > 120) fields.name = 'That name is longer than we can store.';

  const email = payload.email?.trim() ?? '';
  if (!EMAIL.test(email)) fields.email = 'Please check the email address.';
  if (email.length > 200) fields.email = 'That address is longer than we can store.';

  if (payload.telephone && payload.telephone.trim().length > 40) {
    fields.telephone = 'Please shorten the telephone number.';
  }

  if (payload.place && !PLACES.includes(payload.place)) {
    fields.place = 'Please choose one of the options.';
  }

  if (payload.about && payload.about.length > 2000) {
    fields.about = 'Please keep this under two thousand characters.';
  }

  if (payload.timing && payload.timing.length > 300) {
    fields.timing = 'Please keep this shorter.';
  }

  if (payload.intent === 'inquiry' && !(payload.about ?? '').trim()) {
    fields.about = 'Tell us what you would like to know.';
  }

  return fields;
}
