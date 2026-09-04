import { defineConfig } from 'sanity';
import { structureTool, type StructureResolver } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { sanityConfig } from './lib/env';
import { schemaTypes, singletonTypes } from './sanity/schemas';

/**
 * The studio, mounted inside the application at /studio.
 *
 * The desk is arranged the way the house thinks: the details of the house
 * first, then the work, then the practical settings. Singletons are opened
 * directly rather than presented as a list with one item in it, because an
 * editor should never have to wonder whether to create a second "House
 * details".
 */

const structure: StructureResolver = (S) =>
  S.list()
    .title('Visarto')
    .items([
      S.listItem()
        .title('House details')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Homepage photographs')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      S.documentTypeListItem('collection').title('Collections'),
      S.documentTypeListItem('lookbookItem').title('Lookbook'),
      S.documentTypeListItem('mill').title('Mills'),
      S.documentTypeListItem('testimonial').title('Client words'),
      S.divider(),
      S.listItem()
        .title('Made to measure')
        .id('processPage')
        .child(S.document().schemaType('processPage').documentId('processPage')),
      S.listItem()
        .title('About')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Appointments')
        .id('appointmentSettings')
        .child(S.document().schemaType('appointmentSettings').documentId('appointmentSettings')),
      S.divider(),
      S.documentTypeListItem('promotion').title('Announcements'),
    ]);

export default defineConfig({
  name: 'visarto',
  title: 'Visarto',
  basePath: '/studio',
  projectId: sanityConfig.projectId ?? '',
  dataset: sanityConfig.dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: sanityConfig.apiVersion })],
  document: {
    // A singleton is never duplicated and never deleted from the desk.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
});
