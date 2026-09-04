import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Visarto's content model.
 *
 * The types are business concepts, not page regions: a collection, a mill, a
 * lookbook photograph, an appointment setting. Nothing here maps to a section
 * of a page, because an editor should be thinking about the house, not about
 * the layout.
 *
 * Every description is written for the person who will be filling this in, and
 * says what the field is for rather than what it is called.
 */

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'House details',
  type: 'document',
  // A single document. Presented as a settings pane rather than a list.
  fields: [
    defineField({
      name: 'legalName',
      title: 'Registered name',
      type: 'string',
      description: 'Used in the copyright line and in the structured data search engines read.',
    }),
    defineField({
      name: 'studioAddress',
      title: 'Studio address',
      type: 'text',
      rows: 4,
      description:
        'One line per line, as it should be printed. Shown in the footer and on the fitting section of the homepage. Leave blank until it is confirmed: the site marks it as missing rather than inventing one.',
    }),
    defineField({
      name: 'serviceArea',
      title: 'Where fittings can travel',
      type: 'string',
      description:
        'The area Visarto will travel to for a fitting at a home or office, in the words a client would use.',
    }),
    defineField({
      name: 'openingNote',
      title: 'Hours',
      type: 'string',
      description: 'For example, when the studio is open, or that visits are by appointment only.',
    }),
    defineField({
      name: 'telephone',
      title: 'Telephone',
      type: 'string',
      description: 'In the format a client should dial it, including the country code.',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'social',
      title: 'Social accounts',
      type: 'array',
      of: [defineArrayMember({ type: 'socialAccount' })],
    }),
    defineField({
      name: 'defaultSocialImage',
      title: 'Default sharing image',
      type: 'editorialImage',
      description:
        'Shown when a page of the site is shared in a message or on social. Landscape works best. Text in the image will be cropped on some services, so use a photograph.',
    }),
  ],
  preview: { prepare: () => ({ title: 'House details' }) },
});

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  description: 'A garment category: suits, evening wear, shirts, wedding, and so on.',
  fields: [
    defineField({
      name: 'title',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      options: { source: 'title', maxLength: 72 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'orderIndex',
      title: 'Position in the index',
      type: 'number',
      description: 'Lower numbers come first on the homepage index and the collections page.',
    }),
    defineField({
      name: 'standfirst',
      title: 'One line',
      type: 'string',
      description:
        'The single line that sits beside the name in the index. About the occasion or the wearing, not about quality.',
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      description: 'A few short paragraphs for the collection page itself.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Lead photograph',
      type: 'editorialImage',
      description: 'Portrait orientation. Set the hotspot on the part of the garment that matters.',
    }),
    defineField({
      name: 'gallery',
      title: 'Further photographs',
      type: 'array',
      of: [defineArrayMember({ type: 'editorialImage' })],
    }),
    defineField({
      name: 'seoTitle',
      title: 'Search title',
      type: 'string',
      description: 'Optional. Overrides the page title used in search results.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 2,
      description: 'Optional. Around 150 characters reads best in a search result.',
      validation: (rule) => rule.max(180),
    }),
  ],
  orderings: [
    {
      title: 'Index order',
      name: 'indexOrder',
      by: [{ field: 'orderIndex', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'standfirst', media: 'heroImage' },
  },
});

export const mill = defineType({
  name: 'mill',
  title: 'Mill',
  type: 'document',
  description:
    'A mill Visarto buys cloth from. Only add a mill where the relationship is real and may be named publicly.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'country', title: 'Country', type: 'string' }),
    defineField({
      name: 'established',
      title: 'Weaving since',
      type: 'string',
      description: 'Only if it is a fact you can point to. Leave blank otherwise.',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 3,
      description: 'What Visarto buys from this mill, in plain terms.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'country' } },
});

export const lookbookItem = defineType({
  name: 'lookbookItem',
  title: 'Lookbook photograph',
  type: 'document',
  description: 'A finished Visarto garment, photographed. Real work only.',
  fields: [
    defineField({
      name: 'image',
      title: 'Photograph',
      type: 'editorialImage',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'title', title: 'Short title', type: 'string' }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'What the garment is. Cloth, cut, occasion. Not a slogan.',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'orientation',
      title: 'Shape',
      type: 'string',
      options: {
        list: [
          { title: 'Portrait', value: 'portrait' },
          { title: 'Landscape', value: 'landscape' },
          { title: 'Square', value: 'square' },
        ],
        layout: 'radio',
      },
      initialValue: 'portrait',
      description: 'How the photograph should be cropped in the grid.',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      description: 'Optional. Links this photograph to a collection page.',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'caption', media: 'image' } },
});

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Client words',
  type: 'document',
  description:
    'Only add words a real client actually said and has agreed to have published, with the attribution they approved.',
  fields: [
    defineField({
      name: 'quote',
      title: 'What they said',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'As the client agreed it should appear. Initials are fine if that is the agreement.',
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'string',
      description: 'Optional. What was made, or the occasion it was made for.',
    }),
    defineField({ name: 'orderIndex', title: 'Position', type: 'number' }),
  ],
  preview: { select: { title: 'quote', subtitle: 'attribution' } },
});

export const appointmentSettings = defineType({
  name: 'appointmentSettings',
  title: 'Appointments',
  type: 'document',
  fields: [
    defineField({
      name: 'bookingUrl',
      title: 'Booking system link',
      type: 'url',
      description:
        'If Visarto books through an external system, put its link here and every Book an Appointment button will point at it. Leave blank to use the request form on the site.',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'locations',
      title: 'Where a fitting can happen',
      type: 'array',
      of: [defineArrayMember({ type: 'appointmentLocation' })],
    }),
    defineField({
      name: 'leadTimeNote',
      title: 'How far ahead to book',
      type: 'string',
      description: 'Only state a real lead time. Leave blank if it varies.',
    }),
    defineField({
      name: 'whatToBring',
      title: 'What to bring',
      type: 'text',
      rows: 3,
      description:
        'What a client should bring or wear to a first appointment, and roughly how long to set aside.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Appointments' }) },
});

export const promotion = defineType({
  name: 'promotion',
  title: 'Announcement',
  type: 'document',
  description:
    'A short line shown above the header, for a trunk show, a travel date or a closure. One at a time.',
  fields: [
    defineField({
      name: 'message',
      title: 'Message',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({ name: 'href', title: 'Link', type: 'string' }),
    defineField({
      name: 'linkLabel',
      title: 'Link text',
      type: 'string',
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: 'startsAt',
      title: 'Show from',
      type: 'datetime',
      description: 'Leave blank to show immediately.',
    }),
    defineField({
      name: 'endsAt',
      title: 'Stop showing',
      type: 'datetime',
      description: 'Leave blank to show until the announcement is deleted.',
    }),
  ],
  preview: { select: { title: 'message', subtitle: 'endsAt' } },
});

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage photographs',
  type: 'document',
  description:
    'The homepage text is part of the design and is not edited here. These are the photographs it holds open.',
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Opening photograph',
      type: 'editorialImage',
      description:
        'Portrait. A finished garment on a client, with a calm ground. It runs the full height of the first screen, so the subject should sit centrally and the shoe line should not be cropped.',
    }),
    defineField({
      name: 'fittingImage',
      title: 'The fitting',
      type: 'editorialImage',
      description:
        'A fitting in progress: hands, chalk, tape, cloth. Shot at working distance so the room reads as well as the detail.',
    }),
    defineField({
      name: 'clothImage',
      title: 'Cloth',
      type: 'editorialImage',
      description: 'Optional. A length of cloth, a bunch, or a detail of a weave.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Homepage photographs' }) },
});

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About',
  type: 'document',
  fields: [
    defineField({
      name: 'standfirst',
      title: 'Opening line',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'body',
      title: 'The house',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          // No headings inside the body: the page template owns the hierarchy.
          styles: [{ title: 'Paragraph', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [{ title: 'Italic', value: 'em' }],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'Address' }],
              },
            ],
          },
        }),
      ],
    }),
    defineField({ name: 'portrait', title: 'Photograph', type: 'editorialImage' }),
  ],
  preview: { prepare: () => ({ title: 'About' }) },
});

export const processPage = defineType({
  name: 'processPage',
  title: 'Made to measure',
  type: 'document',
  fields: [
    defineField({
      name: 'standfirst',
      title: 'Opening line',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: 'stages',
      title: 'Stages',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'stage',
          fields: [
            defineField({
              name: 'title',
              title: 'Stage',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'note',
              title: 'What happens',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'duration',
              title: 'How long',
              type: 'string',
              description: 'Only if it is a real figure. Leave blank rather than estimating.',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'note' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Made to measure' }) },
});
