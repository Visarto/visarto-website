import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { PhotographRequired } from '@/components/primitives/PhotographRequired';
import { Reveal } from '@/components/primitives/Reveal';
import { lookbookPage } from '@/lib/content/pages';
import { pageMetadata } from '@/lib/seo';
import { getLookbook } from '@/sanity/lib/queries';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Lookbook',
  description: 'Finished garments made to measure by Visarto, photographed after delivery.',
  path: '/lookbook',
});

const RATIO = {
  portrait: '4 / 5',
  landscape: '4 / 3',
  square: '1 / 1',
} as const;

/**
 * Fallback grid used while real photography is being commissioned. All five
 * tiles are portrait — the mixed-orientation layout returns automatically once
 * the CMS supplies items with an explicit `orientation` field.
 */
const PLACEHOLDER_TILES = [
  '/placeholders/lookbook-tile-01.jpg',
  '/placeholders/lookbook-tile-02.jpg',
  '/placeholders/lookbook-tile-03.jpg',
  '/placeholders/lookbook-tile-04.jpg',
  '/placeholders/lookbook-tile-05.jpg',
];

/**
 * The lookbook shows real work or it shows a placeholder that is marked as such.
 *
 * The marking is the whole of the second half. A lookbook is a claim that these
 * are garments this house made, and five photographs under that heading with
 * nothing beside them make the claim silently. The note above the grid is what
 * keeps the page honest until the commissioned work replaces it.
 */
export default async function LookbookPage() {
  const items = await getLookbook();

  return (
    <>
      <PageOpening
        mark={lookbookPage.mark}
        title={lookbookPage.title}
        standfirst={lookbookPage.standfirst}
      />

      <div className="sheet">
        {items.length > 0 ? (
          <Reveal as="ul" stagger variant="mask" className={styles.grid}>
            {items.map((item) => (
              <li key={item._id} className={styles.item}>
                <figure>
                  <MediaFrame
                    ratio={RATIO[item.orientation ?? 'portrait']}
                    image={item.image}
                    alt={item.image.alt ?? item.title ?? ''}
                    sizes="(min-width: 64rem) 32vw, (min-width: 40rem) 48vw, 100vw"
                  />
                  {item.caption ? (
                    <figcaption className={styles.caption}>{item.caption}</figcaption>
                  ) : null}
                </figure>
              </li>
            ))}
          </Reveal>
        ) : (
          <>
            <PhotographRequired tone="compact" className={styles.placeholderNote}>
              {lookbookPage.placeholderNote}
            </PhotographRequired>
            <Reveal as="ul" stagger variant="mask" className={styles.grid}>
              {PLACEHOLDER_TILES.map((src) => (
                <li key={src} className={styles.item}>
                  <figure>
                    <MediaFrame
                      ratio="4 / 5"
                      fallbackSrc={src}
                      alt=""
                      sizes="(min-width: 64rem) 32vw, (min-width: 40rem) 48vw, 100vw"
                    />
                  </figure>
                </li>
              ))}
            </Reveal>
          </>
        )}
      </div>
    </>
  );
}
