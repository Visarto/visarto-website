/**
 * Every external dependency of the site is declared here, with an explicit
 * "configured" flag. Nothing in the application pretends a service exists.
 *
 * This matters most for the appointment path: if no destination is configured,
 * the form is presented as unavailable rather than showing a success screen for
 * a message that went nowhere.
 */

function readPublic(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

const rawSiteUrl = readPublic('NEXT_PUBLIC_SITE_URL');

export const siteUrl = (rawSiteUrl ?? 'http://localhost:3000').replace(/\/$/, '');

/** True once a real canonical origin has been set for production. */
export const hasCanonicalOrigin = Boolean(rawSiteUrl);

export const sanityConfig = {
  projectId: readPublic('NEXT_PUBLIC_SANITY_PROJECT_ID'),
  dataset: readPublic('NEXT_PUBLIC_SANITY_DATASET') ?? 'production',
  apiVersion: readPublic('NEXT_PUBLIC_SANITY_API_VERSION') ?? '2024-10-01',
  readToken: process.env.SANITY_READ_TOKEN,
} as const;

export const isSanityConfigured = Boolean(sanityConfig.projectId);

/**
 * An external booking provider, if Visarto uses one. When set, the primary CTA
 * points at it. When unset, the CTA points at the internal appointment request
 * page.
 */
export const bookingUrl = readPublic('NEXT_PUBLIC_BOOKING_URL');
export const hasExternalBooking = Boolean(bookingUrl);

/**
 * Where an appointment request is delivered. Server only. Until this is set the
 * request form is disabled and the API route refuses the submission.
 */
export const appointmentEndpoint = process.env.APPOINTMENT_ENDPOINT?.trim() || undefined;
export const isAppointmentDeliveryConfigured = Boolean(appointmentEndpoint);

export const analyticsId = readPublic('NEXT_PUBLIC_ANALYTICS_ID');
export const isAnalyticsConfigured = Boolean(analyticsId);
