import { notFound } from 'next/navigation';

import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink, QuietLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { collectionEntries } from '@/lib/content/collections';
import { collectionsPage } from '@/lib/content/pages';
import { calls } from '@/lib/content/site';
import { pageMetadata } from '@/lib/seo';
import { getCollection, getCollections } from '@/sanity/lib/queries';
import styles from './page.module.css';

type Params = { params: Promise<{ slug: string }> };

/**
 * A collection page is served from the CMS when the document exists and from
 * the six authored areas when it does not, so the links on the homepage index
 * never lead to a dead end while the CMS is still empty.
 */
async function resolve(slug: string) {
  const fromCms = await getCollection(slug);
  if (fromCms) {
    return {
      title: fromCms.title,
      standfirst: fromCms.standfirst,
      description: fromCms.description,
      heroImage: fromCms.heroImage,
      gallery: fromCms.gallery ?? [],
      seoTitle: fromCms.seoTitle,
      seoDescription: fromCms.seoDescription,
      fromCms: true as const,
    };
  }

  const authored = collectionEntries.find((entry) => entry.slug === slug);
  if (!authored) return null;

  return {
    title: authored.title,
    standfirst: authored.note,
    description: undefined,
    heroImage: undefined,
    gallery: [],
    seoTitle: undefined,
    seoDescription: undefined,
    fromCms: false as const,
  };
}

export async function generateStaticParams() {
  const collections = await getCollections();
  const slugs =
    collections.length > 0
      ? collections.map((item) => item.slug.current)
      : collectionEntries.map((entry) => entry.slug);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const collection = await resolve(slug);
  if (!collection) return pageMetadata({ title: 'Not found', description: '', path: `/collections/${slug}`, noIndex: true });

  return pageMetadata({
    title: collection.seoTitle ?? collection.title,
    description:
      collection.seoDescription ??
      collection.standfirst ??
      `${collection.title}, made to measure by Visarto for men and women.`,
    path: `/collections/${slug}`,
  });
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const collection = await resolve(slug);
  if (!collection) notFound();

  return (
    <>
      <PageOpening
        mark="Collections"
        title={collection.title}
        standfirst={collection.standfirst ?? undefined}
      />

      <div className={`sheet ${styles.layout}`}>
        <MediaFrame
          className={styles.hero}
          ratio="4 / 5"
          image={collection.heroImage}
          alt={collection.heroImage?.alt ?? ''}
          sizes="(min-width: 64rem) 48vw, 100vw"
          priority
          weave="herringbone"
          brief={`Lead photograph for ${collection.title.toLowerCase()}. A finished garment on a client, portrait, natural light.`}
        />

        <div className={styles.body}>
          {collection.description ? (
            collection.description
              .split('\n')
              .filter((paragraph) => paragraph.trim().length > 0)
              .map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="body">
                  {paragraph}
                </p>
              ))
          ) : (
            <ContentRequired>{collectionsPage.detailRequires}</ContentRequired>
          )}

          <div className={styles.actions}>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
            <QuietLink href="/collections">All collections</QuietLink>
          </div>
        </div>
      </div>

      {collection.gallery.length > 0 ? (
        <div className="sheet">
          <ul className={styles.gallery}>
            {collection.gallery.map((image, index) => (
              <li key={image.asset?._ref ?? index}>
                <MediaFrame
                  ratio={index % 3 === 1 ? '3 / 4' : '4 / 5'}
                  image={image}
                  alt={image.alt ?? ''}
                  sizes="(min-width: 64rem) 32vw, (min-width: 40rem) 48vw, 100vw"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
