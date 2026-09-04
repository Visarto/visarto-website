import { isAnalyticsConfigured } from './env';

/**
 * Conversion events.
 *
 * Nothing is sent until an analytics property is genuinely configured, and the
 * set of events is deliberately short: the appointment path, the inquiry, and
 * a click on a phone number or email. Scroll depth, hover, and animation frames
 * are not measured, because no decision would be made differently because of
 * them.
 *
 * Events carry no personal data. A request is reported as having happened, not
 * who made it or what they wrote.
 */

type EventName =
  | 'appointment_cta'
  | 'appointment_request_sent'
  | 'inquiry_sent'
  | 'telephone_click'
  | 'email_click'
  | 'booking_system_opened';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const sent = new Set<string>();

export function track(name: EventName, once = true): void {
  if (!isAnalyticsConfigured) return;
  if (typeof window === 'undefined') return;

  // Strict Mode, route transitions and double clicks must not produce two of
  // the same conversion event.
  if (once) {
    if (sent.has(name)) return;
    sent.add(name);
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name });
}
