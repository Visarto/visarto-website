import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { Reveal } from '@/components/primitives/Reveal';
import { calls } from '@/lib/content/site';
import { home } from '@/lib/content/home';
import { madeToMeasure } from '@/lib/content/pages';
import { pageMetadata } from '@/lib/seo';
import { getHomePage } from '@/sanity/lib/queries';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Made to measure',
  description:
    'How a Visarto garment is made: the appointment, measuring, the pattern, the cloth, the fitting and finishing.',
  path: '/made-to-measure',
});

/**
 * The process page is set as a numbered sequence with the stage name held on
 * the left and what happens beside it. Everything written here follows from
 * what made to measure is; the figures a client will ask about next, lead time
 * and price, are marked as required rather than estimated.
 */
export default async function MadeToMeasurePage() {
  const page = await getHomePage();

  return (
    <>
      <PageOpening
        mark={madeToMeasure.mark}
        title={madeToMeasure.title}
        standfirst={madeToMeasure.standfirst}
      />

      <div className="sheet">
        <Reveal as="ol" stagger className={styles.stages}>
          {madeToMeasure.stages.map((stage, index) => (
            <li key={stage.title} className={styles.stage}>
              <span className={`index-mark ${styles.mark}`} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h2 className={styles.stageTitle}>{stage.title}</h2>
              <p className={styles.stageNote}>{stage.note}</p>
            </li>
          ))}
        </Reveal>
      </div>

      <section className={`on-raised ${styles.practical}`} aria-labelledby="practical-heading">
        <div className={`sheet ${styles.practicalLayout}`}>
          <Reveal variant="mask" className={styles.media}>
            <MediaFrame
              ratio="4 / 3"
              image={page?.fittingImage}
              fallbackSrc="/placeholders/mtm-practical.jpg"
              alt={page?.fittingImage?.alt ?? ''}
              sizes="(min-width: 64rem) 46vw, 100vw"
              weave="birdseye"
              brief={home.fitting.imageBrief}
            />
          </Reveal>
          <Reveal stagger className={styles.practicalCopy}>
            <h2 id="practical-heading" className="display-3">
              The practical questions
            </h2>
            <ContentRequired>{madeToMeasure.practicalRequires}</ContentRequired>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
