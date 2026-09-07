import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { calls } from '@/lib/content/site';
import { aboutPage } from '@/lib/content/pages';
import { showPrototypeCopy } from '@/lib/env';
import { pageMetadata } from '@/lib/seo';
import { getAboutPage } from '@/sanity/lib/queries';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'About',
  description: 'Visarto makes clothing to measure for men and women, by appointment.',
  path: '/about',
});

/**
 * Almost everything an about page normally contains is a fact about the
 * business: who runs it, how long it has been working, where it came from. None
 * of that has been supplied, so the page holds the shape and names what it
 * needs rather than writing a history nobody can stand behind.
 *
 * When `NEXT_PUBLIC_SHOW_PROTOTYPE_COPY=true`, a placeholder letter renders in
 * place of the marker. It carries a visible "Prototype copy" tag so it cannot
 * be mistaken for authored voice, and the flag is default off.
 */
export default async function AboutPage() {
  const page = await getAboutPage();
  const hasCmsBody = Boolean(page?.body && page.body.length > 0);
  const prototype = aboutPage.prototype;

  return (
    <>
      <PageOpening
        mark={aboutPage.mark}
        title={aboutPage.title}
        standfirst={page?.standfirst ?? aboutPage.standfirst}
      />

      <div className={`sheet ${styles.layout}`}>
        <div className={styles.body}>
          {hasCmsBody ? (
            page!.body!.map((block, index) => (
              <p key={block._key ?? index} className="body">
                {block.children?.map((span) => span.text).join('')}
              </p>
            ))
          ) : showPrototypeCopy ? (
            <article className={styles.letter} aria-label="Prototype founder's letter">
              <div className={styles.letterTag}>
                <span className="annotation">{prototype.tag}</span>
                <p className={styles.letterWarning}>{prototype.warning}</p>
              </div>
              {prototype.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`body ${index === 0 ? styles.letterOpening : ''}`}
                >
                  {paragraph}
                </p>
              ))}
              <footer className={styles.signature}>
                <span className={styles.signatureName}>{prototype.signature.name}</span>
                <span className={styles.signatureRole}>{prototype.signature.role}</span>
              </footer>
            </article>
          ) : (
            <ContentRequired>{aboutPage.bodyRequires}</ContentRequired>
          )}

          <div className={styles.action}>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
          </div>
        </div>

        <MediaFrame
          className={styles.media}
          ratio="4 / 5"
          image={page?.portrait}
          alt={page?.portrait?.alt ?? ''}
          sizes="(min-width: 64rem) 40vw, 100vw"
          weave="hopsack"
          brief="The people who make the clothes, in the room they work in. A portrait or a working shot, not a staged team photograph."
        />
      </div>
    </>
  );
}
