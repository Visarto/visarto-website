'use client';

import { NextStudio } from 'next-sanity/studio';

import config from '@/sanity.config';

/**
 * The studio runs entirely in the browser. Keeping the config import behind a
 * client boundary keeps the whole studio bundle out of the server graph, where
 * several of its dependencies have no React Server Components build.
 */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
