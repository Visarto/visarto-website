import { ContentRequired } from '@/components/primitives/ContentRequired';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { Reveal } from '@/components/primitives/Reveal';
import { home, studioPlace, visitingPlaces } from '@/lib/content/home';
import type { SanityImageSource, SiteSettings } from '@/sanity/lib/types';
import styles from './FittingSection.module.css';

/**
 * Where a fitting happens is the part of Visarto's service that is genuinely
 * unusual, so it is given a full passage rather than a line in a feature list.
 * The studio entry stays empty until an address exists in the CMS.
 */
export function FittingSection({
  image,
  settings,
}: {
  image?: SanityImageSource | undefined;
  settings: SiteSettings | null;
}) {
  return (
    <section className={`on-raised ${styles.section}`} aria-labelledby="fitting-heading">
      <div className={`sheet ${styles.layout}`}>
        {/*
          The photograph and the copy start together, which is the point of the
          height-independent trigger: a tall frame and a short paragraph beside
          it are one passage and must not arrive at two different moments.
        */}
        <Reveal as="div" variant="mask" className={styles.media}>
          <MediaFrame
            ratio="5 / 6"
            image={image}
            fallbackSrc="/placeholders/home-fitting.jpg"
            alt={image?.alt ?? ''}
            sizes="(min-width: 64rem) 44vw, 100vw"
            weave="herringbone"
            brief={home.fitting.imageBrief}
          />
        </Reveal>

        <Reveal stagger className={styles.copy}>
          <h2 id="fitting-heading" className="display-2">
            {home.fitting.heading}
          </h2>
          <p className={`body ${styles.body}`}>{home.fitting.body}</p>

          <div className={styles.places}>
            <div className={styles.place}>
              <span className={styles.placeTitle}>{studioPlace.title}</span>
              {settings?.studioAddress ? (
                <span className={styles.placeNote} style={{ whiteSpace: 'pre-line' }}>
                  {settings.studioAddress}
                  {settings.openingNote ? `\n${settings.openingNote}` : ''}
                </span>
              ) : (
                <ContentRequired>{studioPlace.requires}</ContentRequired>
              )}
            </div>

            {visitingPlaces.map((place) => (
              <div key={place.title} className={styles.place}>
                <span className={styles.placeTitle}>{place.title}</span>
                <span className={styles.placeNote}>{place.note}</span>
              </div>
            ))}
          </div>

          <p className={`fine ${styles.closing}`}>{home.fitting.closing}</p>
        </Reveal>
      </div>
    </section>
  );
}
