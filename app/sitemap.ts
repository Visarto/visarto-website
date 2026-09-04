import type { MetadataRoute } from 'next';

import { collectionEntries } from '@/lib/content/collections';
import { siteUrl } from '@/lib/env';
import { getCollections } from '@/sanity/lib/queries';

/**
 * Built from the same source the navigation is built from, so a route cannot be
 * added to the site and forgotten here. The legal pages are excluded because
 * they are marked no-index until Visarto supplies their text.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getCollections();
  const slugs =
    collections.length > 0
      ? collections.map((item) => item.slug.current)
      : collectionEntries.map((entry) => entry.slug);

  const now = new Date();

  const routes: { path: string; priority: number }[] = [
    { path: '/', priority: 1 },
    { path: '/made-to-measure', priority: 0.9 },
    { path: '/collections', priority: 0.9 },
    { path: '/cloth', priority: 0.7 },
    { path: '/lookbook', priority: 0.7 },
    { path: '/about', priority: 0.6 },
    { path: '/appointments', priority: 0.9 },
    { path: '/contact', priority: 0.6 },
    ...slugs.map((slug) => ({ path: `/collections/${slug}`, priority: 0.8 })),
  ];

  return routes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: route.priority,
  }));
}
