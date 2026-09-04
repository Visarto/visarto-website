import Link from 'next/link';
import type { Route } from 'next';

import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { collectionEntries } from '@/lib/content/collections';
import { collectionsPage } from '@/lib/content/pages';
import { pageMetadata } from '@/lib/seo';
import { getCollections } from '@/sanity/lib/queries';
import type { WeaveId } from '@/lib/weave';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Collections',
  description:
    'Suits and business wear, evening and black tie, wedding, shirts, occasion and everyday clothing, made to measure by Visarto.',
  path: '/collections',
});

/**
 * The collections index is composed as a set of unequal frames on a staggered
 * baseline rather than a grid of matching tiles. Each entry keeps a different
 * cloth behind it until a photograph exists, so the page has variation in it
 * from the beginning rather than six identical rectangles.
 */
const RATIOS = ['4 / 5', '3 / 4', '5 / 6', '4 / 5', '3 / 4', '5 / 6'];
const WEAVES: WeaveId[] = ['twill', 'herringbone', 'plain', 'birdseye', 'glenCheck', 'hopsack'];

export default async function CollectionsPage() {
  const collections = await getCollections();
  const entries =
    collections.length > 0
      ? collections.map((item) => ({
          slug: item.slug.current,
          title: item.title,
          note: item.standfirst ?? '',
          image: item.heroImage,
        }))
      : collectionEntries.map((entry) => ({ ...entry, image: undefined }));

  return (
    <>
      <PageOpening
        mark={collectionsPage.mark}
        title={collectionsPage.title}
        standfirst={collectionsPage.standfirst}
      />

      <div className="sheet">
        <ul className={styles.grid}>
          {entries.map((entry, index) => (
            <li key={entry.slug} className={styles.item}>
              <Link href={`/collections/${entry.slug}` as Route} className={styles.link}>
                <MediaFrame
                  ratio={RATIOS[index % RATIOS.length] ?? '4 / 5'}
                  image={entry.image}
                  alt={entry.image?.alt ?? ''}
                  sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 100vw"
                  weave={WEAVES[index % WEAVES.length] ?? 'twill'}
                  brief={entry.title}
                  briefTone="compact"
                />
                <span className={styles.title}>{entry.title}</span>
                {entry.note ? <span className={styles.note}>{entry.note}</span> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
