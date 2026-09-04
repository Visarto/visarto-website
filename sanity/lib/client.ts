import { createClient, type SanityClient } from 'next-sanity';

import { isSanityConfigured, sanityConfig } from '@/lib/env';

/**
 * The read client. It is `null` until a project id is configured, and every
 * query helper treats that as "no content yet" rather than an error, so the
 * application builds, runs and is reviewable before the CMS exists.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: sanityConfig.projectId as string,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: true,
      perspective: 'published',
    })
  : null;
