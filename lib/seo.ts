import type { Metadata } from 'next';

import { brand } from '@/lib/content/site';
import { siteUrl } from '@/lib/env';

/**
 * One title pattern for the whole site: the page, then the house. The homepage
 * is the exception and carries the descriptor instead, because "Visarto |
 * Visarto" helps nobody.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = new URL(path, siteUrl).toString();
  const fullTitle = path === '/' ? `${brand.name} | ${brand.descriptor}` : `${title} | ${brand.name}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: brand.name,
      title: fullTitle,
      description,
      url: canonical,
      locale: 'en_CA',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
