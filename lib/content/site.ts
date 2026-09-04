/**
 * Global authored copy.
 *
 * All viewer-facing English written by the studio lives under `lib/content`.
 * Keeping it in one place is what makes the copy gate in `scripts/copy-gate.mjs`
 * meaningful: a single scan covers everything a visitor can read.
 *
 * Anything that is a fact about Visarto's business and has not been supplied is
 * represented by a `contentRequired` marker, never by invented text.
 */

export type NavItem = {
  label: string;
  href: string;
  /** One line used in the mobile menu, where a label alone is thin. */
  note?: string;
};

export const primaryNav: NavItem[] = [
  {
    label: 'Made to Measure',
    href: '/made-to-measure',
    note: 'How a garment is ordered, fitted and finished',
  },
  {
    label: 'Collections',
    href: '/collections',
    note: 'Suits, evening wear, shirts, wedding and everyday clothing',
  },
  { label: 'Cloth', href: '/cloth', note: 'Weave structures and the mills we buy from' },
  { label: 'Lookbook', href: '/lookbook', note: 'Finished garments, photographed' },
  { label: 'About', href: '/about', note: 'The house and the people in it' },
];

export const brand = {
  name: 'Visarto',
  /** Used in the document title pattern and in structured data. */
  descriptor: 'Made-to-measure and custom clothing',
  /**
   * The one sentence that has to be true on every page: what Visarto is, who it
   * is for, and how it works.
   */
  summary:
    'Visarto is a made-to-measure house for men and women. Suits, evening wear, shirts, wedding and everyday clothing, cut to one set of measurements and fitted in person.',
} as const;

export const calls = {
  primary: { label: 'Book an Appointment', href: '/appointments' },
  secondary: { label: 'Make an Inquiry', href: '/contact' },
} as const;

export const footer = {
  /** A short statement, not a manifesto. */
  statement: 'Made to measure for men and women. By appointment.',
  columns: [
    {
      heading: 'Visit',
      // Address, service area, and studio hours are business facts and are not
      // authored here. They come from siteSettings in the CMS.
      requires: 'Studio address, service area and opening hours',
    },
    {
      heading: 'Contact',
      requires: 'Telephone number, email address and preferred contact hours',
    },
  ],
  legal: {
    rights: 'All rights reserved.',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
} as const;
