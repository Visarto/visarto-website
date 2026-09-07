import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { Reveal } from '@/components/primitives/Reveal';
import { calls } from '@/lib/content/site';
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
 * The lookbook shows real work or it shows nothing. There is no stock imagery
 * standing in for garments Visarto has not photographed, and the empty state
 * says plainly what is missing rather than filling the page.
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
          <Reveal stagger className={styles.empty}>
            <ContentRequired>{lookbookPage.emptyRequires}</ContentRequired>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
          </Reveal>
        )}
      </div>
    </>
  );
}
