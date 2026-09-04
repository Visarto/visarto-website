import { brand } from '@/lib/content/site';
import { siteUrl } from '@/lib/env';
import type { SiteSettings } from '@/sanity/lib/types';

/**
 * Structured data describing Visarto.
 *
 * Every property here comes from something Visarto has confirmed. There is no
 * aggregateRating, no review, no founding date and no award, because inventing
 * any of those would be putting a false claim into a machine-readable format,
 * which is worse than putting it on a page.
 *
 * A field with no value is left out of the graph entirely rather than emitted
 * empty.
 */
export function StructuredData({ settings }: { settings: SiteSettings | null }) {
  const address = settings?.studioAddress;

  const organisation: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': `${siteUrl}/#visarto`,
    name: settings?.legalName ?? brand.name,
    description: brand.summary,
    url: siteUrl,
    // Made to measure is by appointment, which is a fact given in the brief.
    publicAccess: false,
  };

  if (settings?.telephone) organisation.telephone = settings.telephone;
  if (settings?.email) organisation.email = settings.email;
  if (settings?.social?.length) {
    organisation.sameAs = settings.social.map((account) => account.url);
  }
  if (address) {
    organisation.address = {
      '@type': 'PostalAddress',
      streetAddress: address.split('\n').join(', '),
    };
  }
  if (settings?.serviceArea) {
    organisation.areaServed = settings.serviceArea;
  }

  return (
    <script
      type="application/ld+json"
      // The payload is built above from typed values, not from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
    />
  );
}
