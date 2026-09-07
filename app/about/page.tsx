import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { Reveal } from '@/components/primitives/Reveal';
import { calls } from '@/lib/content/site';
import { aboutPage } from '@/lib/content/pages';
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
 */
export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <>
      <PageOpening
        mark={aboutPage.mark}
        title={aboutPage.title}
        standfirst={page?.standfirst ?? aboutPage.standfirst}
      />

      <div className={`sheet ${styles.layout}`}>
        <Reveal stagger className={styles.body}>
          {page?.body && page.body.length > 0 ? (
            page.body.map((block, index) => (
              <p key={block._key ?? index} className="body">
                {block.children?.map((span) => span.text).join('')}
              </p>
            ))
          ) : (
            <ContentRequired>{aboutPage.bodyRequires}</ContentRequired>
          )}

          <div className={styles.action}>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
          </div>
        </Reveal>

        <Reveal variant="mask" className={styles.media}>
          <MediaFrame
            ratio="4 / 5"
            image={page?.portrait}
            fallbackSrc="/placeholders/about-portrait.jpg"
            alt={page?.portrait?.alt ?? ''}
            sizes="(min-width: 64rem) 40vw, 100vw"
            weave="hopsack"
            brief="The people who make the clothes, in the room they work in. A portrait or a working shot, not a staged team photograph."
          />
        </Reveal>
      </div>
    </>
  );
}
