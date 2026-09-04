import { createImageUrlBuilder } from '@sanity/image-url';

import { sanityConfig } from '@/lib/env';
import type { SanityImageSource } from './types';

const builder = createImageUrlBuilder({
  projectId: sanityConfig.projectId ?? '',
  dataset: sanityConfig.dataset,
});

export function imageUrl(source: SanityImageSource, width: number, height?: number): string | null {
  if (!source?.asset?._ref) return null;
  let url = builder.image(source).width(width).auto('format').fit('crop');
  if (height) url = url.height(height);
  return url.url();
}

/**
 * Turns a Sanity hotspot into a CSS `object-position`. This is what keeps a
 * face, a lapel or a cuff inside the frame when the same photograph is cropped
 * to a different ratio on a phone.
 */
export function focalPosition(source: SanityImageSource | undefined): string {
  const hotspot = source?.hotspot;
  if (!hotspot) return '50% 50%';
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`;
}
