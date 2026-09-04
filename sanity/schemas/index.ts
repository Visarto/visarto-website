import type { SchemaTypeDefinition } from 'sanity';

import { appointmentLocation, editorialImage, socialAccount } from './objects';
import {
  aboutPage,
  appointmentSettings,
  collection,
  homePage,
  lookbookItem,
  mill,
  processPage,
  promotion,
  siteSettings,
  testimonial,
} from './documents';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  editorialImage,
  socialAccount,
  appointmentLocation,
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  processPage,
  appointmentSettings,
  // Collections of documents
  collection,
  mill,
  lookbookItem,
  testimonial,
  promotion,
];

/** Documents that should exist exactly once. */
export const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'processPage',
  'appointmentSettings',
]);
