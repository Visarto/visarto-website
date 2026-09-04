import { groq } from 'next-sanity';

import { sanityClient } from './client';
import type {
  AboutPage,
  AppointmentSettings,
  Collection,
  HomePage,
  LookbookItem,
  Mill,
  ProcessPage,
  Promotion,
  SiteSettings,
  Testimonial,
} from './types';

/**
 * Every read goes through `read`, which returns the fallback when no project is
 * configured and when a query fails. A CMS outage degrades the site to the
 * authored baseline instead of taking a page down.
 */
async function read<T>(query: string, fallback: T, params: Record<string, unknown> = {}): Promise<T> {
  if (!sanityClient) return fallback;
  try {
    const result = await sanityClient.fetch<T>(query, params, {
      next: { revalidate: 60, tags: ['sanity'] },
    });
    return result ?? fallback;
  } catch (error) {
    console.error('[sanity] query failed', error);
    return fallback;
  }
}

const IMAGE = groq`{
  _type,
  asset,
  hotspot,
  crop,
  alt,
  protectDetail
}`;

export function getSiteSettings(): Promise<SiteSettings | null> {
  return read<SiteSettings | null>(
    groq`*[_type == "siteSettings"][0]{
      studioAddress,
      serviceArea,
      openingNote,
      telephone,
      email,
      legalName,
      bookingUrl,
      social[]{platform, url},
      defaultSocialImage ${IMAGE}
    }`,
    null,
  );
}

export function getHomePage(): Promise<HomePage | null> {
  return read<HomePage | null>(
    groq`*[_type == "homePage"][0]{
      heroImage ${IMAGE},
      heroDetailImage ${IMAGE},
      fittingImage ${IMAGE},
      clothImage ${IMAGE}
    }`,
    null,
  );
}

export function getAboutPage(): Promise<AboutPage | null> {
  return read<AboutPage | null>(
    groq`*[_type == "aboutPage"][0]{
      standfirst,
      body[]{_key, _type, children[]{_key, text}},
      portrait ${IMAGE}
    }`,
    null,
  );
}

export function getProcessPage(): Promise<ProcessPage | null> {
  return read<ProcessPage | null>(
    groq`*[_type == "processPage"][0]{
      standfirst,
      stages[]{_key, title, note, duration}
    }`,
    null,
  );
}

export function getCollections(): Promise<Collection[]> {
  return read<Collection[]>(
    groq`*[_type == "collection"] | order(coalesce(orderIndex, 99) asc, title asc){
      _id, title, slug, standfirst, description, orderIndex,
      heroImage ${IMAGE}
    }`,
    [],
  );
}

export function getCollection(slug: string): Promise<Collection | null> {
  return read<Collection | null>(
    groq`*[_type == "collection" && slug.current == $slug][0]{
      _id, title, slug, standfirst, description, seoTitle, seoDescription,
      heroImage ${IMAGE},
      gallery[] ${IMAGE}
    }`,
    null,
    { slug },
  );
}

export function getMills(): Promise<Mill[]> {
  return read<Mill[]>(
    groq`*[_type == "mill"] | order(name asc){ _id, name, country, note, established }`,
    [],
  );
}

export function getLookbook(): Promise<LookbookItem[]> {
  return read<LookbookItem[]>(
    groq`*[_type == "lookbookItem"] | order(_createdAt desc){
      _id, title, caption, orientation,
      image ${IMAGE},
      collection->{title, slug}
    }`,
    [],
  );
}

export function getTestimonials(): Promise<Testimonial[]> {
  return read<Testimonial[]>(
    groq`*[_type == "testimonial"] | order(coalesce(orderIndex, 99) asc){
      _id, quote, attribution, context, orderIndex
    }`,
    [],
  );
}

export function getAppointmentSettings(): Promise<AppointmentSettings | null> {
  return read<AppointmentSettings | null>(
    groq`*[_type == "appointmentSettings"][0]{
      bookingUrl,
      leadTimeNote,
      whatToBring,
      locations[]{name, note}
    }`,
    null,
  );
}

/** Only a promotion that is live right now is returned. */
export function getActivePromotion(): Promise<Promotion | null> {
  return read<Promotion | null>(
    groq`*[_type == "promotion"
      && (!defined(startsAt) || startsAt <= now())
      && (!defined(endsAt) || endsAt >= now())][0]{
      _id, message, href, linkLabel, startsAt, endsAt
    }`,
    null,
  );
}
