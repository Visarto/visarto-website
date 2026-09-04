import Link from 'next/link';
import type { Route } from 'next';

import { QuietLink } from '@/components/primitives/Cta';
import { Reveal } from '@/components/primitives/Reveal';
import { collectionEntries } from '@/lib/content/collections';
import { home } from '@/lib/content/home';
import type { Collection } from '@/sanity/lib/types';
import styles from './CollectionIndex.module.css';

/**
 * Collections created in the CMS take over from the authored entries entirely,
 * so an editor adding a seventh category or renaming one does not need a
 * developer. Until then the six areas named in the brief are listed.
 */
export function CollectionIndex({ collections }: { collections: Collection[] }) {
  const entries =
    collections.length > 0
      ? collections.map((item) => ({
          slug: item.slug.current,
          title: item.title,
          note: item.standfirst ?? '',
        }))
      : collectionEntries;

  return (
    <section className={styles.section} aria-labelledby="collections-heading">
      <div className={`sheet ${styles.layout}`}>
        <Reveal className={styles.intro}>
          <h2 id="collections-heading" className="display-2">
            {home.collections.heading}
          </h2>
          <p className={`body ${styles.introBody}`}>{home.collections.body}</p>
          <QuietLink href="/collections" className={styles.introLink}>
            {home.collections.linkLabel}
          </QuietLink>
        </Reveal>

        <ol className={styles.list}>
          {entries.map((entry, position) => (
            <li key={entry.slug} className={styles.row}>
              <Link href={`/collections/${entry.slug}` as Route} className={styles.link}>
                <span className={`index-mark ${styles.mark}`} aria-hidden="true">
                  {String(position + 1).padStart(2, '0')}
                </span>
                <span className={`display-3 ${styles.title}`}>{entry.title}</span>
                {entry.note ? <span className={styles.note}>{entry.note}</span> : null}
                <span className={styles.underline} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
