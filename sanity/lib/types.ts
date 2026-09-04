/**
 * The shape of the CMS data the front end consumes.
 *
 * These types are written by hand and treated as the contract between the
 * schemas in `sanity/schemas` and the components. Fields are optional wherever
 * the schema allows an editor to leave them blank, so that every component is
 * forced to handle editorial reality rather than assume a full document.
 */

export type SanityImageSource = {
  _type: 'image';
  asset?: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
  /** Set when a photograph must not be cropped through a critical detail. */
  protectDetail?: string;
};

export type SanitySlug = { current: string };

export type SiteSettings = {
  studioAddress?: string;
  serviceArea?: string;
  openingNote?: string;
  telephone?: string;
  email?: string;
  social?: { platform: string; url: string }[];
  bookingUrl?: string;
  defaultSocialImage?: SanityImageSource;
  legalName?: string;
};

export type Collection = {
  _id: string;
  title: string;
  slug: SanitySlug;
  standfirst?: string;
  description?: string;
  heroImage?: SanityImageSource;
  gallery?: SanityImageSource[];
  orderIndex?: number;
  seoTitle?: string;
  seoDescription?: string;
};

export type Mill = {
  _id: string;
  name: string;
  country?: string;
  note?: string;
  established?: string;
};

export type LookbookItem = {
  _id: string;
  title?: string;
  image: SanityImageSource;
  caption?: string;
  collection?: { title: string; slug: SanitySlug };
  orientation?: 'portrait' | 'landscape' | 'square';
};

export type Testimonial = {
  _id: string;
  quote: string;
  attribution?: string;
  context?: string;
  orderIndex?: number;
};

export type AppointmentSettings = {
  bookingUrl?: string;
  locations?: { name: string; note?: string }[];
  leadTimeNote?: string;
  whatToBring?: string;
};

export type Promotion = {
  _id: string;
  message: string;
  href?: string;
  linkLabel?: string;
  startsAt?: string;
  endsAt?: string;
};

export type PortableTextBlock = {
  _key?: string;
  _type: 'block';
  children?: { _key?: string; text: string }[];
};

export type AboutPage = {
  standfirst?: string;
  body?: PortableTextBlock[];
  portrait?: SanityImageSource;
};

export type ProcessStage = {
  _key?: string;
  title: string;
  note: string;
  duration?: string;
};

export type ProcessPage = {
  standfirst?: string;
  stages?: ProcessStage[];
};

export type HomePage = {
  heroImage?: SanityImageSource;
  heroDetailImage?: SanityImageSource;
  fittingImage?: SanityImageSource;
  clothImage?: SanityImageSource;
};
