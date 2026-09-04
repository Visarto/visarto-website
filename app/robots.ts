import type { MetadataRoute } from 'next';

import { hasCanonicalOrigin, siteUrl } from '@/lib/env';

/**
 * Until a canonical origin is configured the site refuses indexing outright,
 * which stops a preview deployment being crawled and competing with production.
 */
export default function robots(): MetadataRoute.Robots {
  if (!hasCanonicalOrigin) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api/'],
    },
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
  };
}
