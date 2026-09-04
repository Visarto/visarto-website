import { defineField, defineType } from 'sanity';

/**
 * Shared field shapes.
 *
 * Editors get hotspot cropping and alt text on every image, and nothing else.
 * There is no colour picker, no spacing control, no class name field and no
 * free-form layout: the design system decides how an image is placed, and the
 * editor decides which image it is and what part of it must stay in frame.
 */

export const editorialImage = defineType({
  name: 'editorialImage',
  title: 'Photograph',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description:
        'What the photograph shows, for people using a screen reader and for search. Describe the garment and the situation, not the mood. Leave blank only if the image is purely decorative.',
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'protectDetail',
      title: 'Do not crop through',
      type: 'string',
      description:
        'Optional. A detail that must stay in frame at every screen size, such as the cuff, the lapel roll or the shoe line. Set the hotspot over it.',
      validation: (rule) => rule.max(120),
    }),
  ],
  preview: {
    select: { imageUrl: 'asset.url', title: 'alt' },
  },
});

export const socialAccount = defineType({
  name: 'socialAccount',
  title: 'Social account',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      description: 'Shown in the footer, so write it as it should read: Instagram, not instagram.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https'] }),
    }),
  ],
  preview: { select: { title: 'platform', subtitle: 'url' } },
});

export const appointmentLocation = defineType({
  name: 'appointmentLocation',
  title: 'Where a fitting can happen',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Place',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 2,
      description: 'One or two sentences. What a client should know about choosing this option.',
      validation: (rule) => rule.max(240),
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'note' } },
});
