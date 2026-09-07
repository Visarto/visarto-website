import { SpecimenSheet } from '@/components/cloth/SpecimenSheet';
import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { PageOpening } from '@/components/primitives/PageOpening';
import { Reveal } from '@/components/primitives/Reveal';
import { calls } from '@/lib/content/site';
import { clothPage } from '@/lib/content/pages';
import { pageMetadata } from '@/lib/seo';
import { getMills } from '@/sanity/lib/queries';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Cloth',
  description:
    'The weave structures behind a suit length: plain, twill, herringbone, hopsack, birdseye and glen check, and the mills Visarto buys from.',
  path: '/cloth',
});

/**
 * The cloth room.
 *
 * Weave structure is a fact about textiles and can be written in full. Which
 * mills Visarto buys from is a fact about the business, and stays empty until
 * Visarto supplies it. The page is designed so that it reads as finished in
 * either state.
 *
 * This is the one page on the site set on light, and it is set on light all the
 * way through. A whole page may change world: arrived at through navigation, it
 * reads as a chapter. A section that changes ground inside a page reads as a
 * seam, which is what this page used to have halfway down it.
 *
 * The ground is also the right one for the subject. The weave drafts were drawn
 * to read on paper, and a bunch of swatches is a paper object.
 */
export default async function ClothPage() {
  const mills = await getMills();

  return (
    <div className="on-bone">
      <PageOpening mark={clothPage.mark} title={clothPage.title} standfirst={clothPage.standfirst} />

      <section className={styles.structures} aria-labelledby="structures-heading">
        <div className="sheet">
          <Reveal className={styles.head}>
            <h2 id="structures-heading" className="display-3">
              {clothPage.structureHeading}
            </h2>
            <p className="body">{clothPage.structureBody}</p>
          </Reveal>
          <SpecimenSheet />
        </div>
      </section>

      <section className={styles.mills} aria-labelledby="mills-heading">
        <div className={`sheet ${styles.millsLayout}`}>
          <h2 id="mills-heading" className="display-3">
            {clothPage.millsHeading}
          </h2>

          {mills.length > 0 ? (
            <dl className={styles.millList}>
              {mills.map((mill) => (
                <div key={mill._id} className={styles.mill}>
                  <dt className={styles.millName}>{mill.name}</dt>
                  <dd className={styles.millNote}>
                    {[mill.country, mill.established].filter(Boolean).join(', ')}
                    {mill.note ? <span className={styles.millBody}>{mill.note}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <ContentRequired>{clothPage.millsRequires}</ContentRequired>
          )}

          <div className={styles.action}>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
          </div>
        </div>
      </section>
    </div>
  );
}
