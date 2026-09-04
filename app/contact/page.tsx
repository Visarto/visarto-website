import { RequestForm } from '@/components/appointments/RequestForm';
import { ContentRequired } from '@/components/primitives/ContentRequired';
import { PageOpening } from '@/components/primitives/PageOpening';
import { contactPage } from '@/lib/content/pages';
import { isAppointmentDeliveryConfigured } from '@/lib/env';
import { pageMetadata } from '@/lib/seo';
import { getSiteSettings } from '@/sanity/lib/queries';
import styles from '../appointments/page.module.css';

export const metadata = pageMetadata({
  title: 'Make an inquiry',
  description:
    'Ask Visarto about cloth, about what can be made, or about a date you are working towards.',
  path: '/contact',
});

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <PageOpening
        mark={contactPage.mark}
        title={contactPage.title}
        standfirst={contactPage.standfirst}
      />

      <div className={`sheet ${styles.layout}`}>
        <div className={styles.main}>
          <RequestForm intent="inquiry" deliveryConfigured={isAppointmentDeliveryConfigured} />
        </div>

        <aside className={styles.aside} aria-labelledby="contact-detail">
          <h2 id="contact-detail" className={styles.asideHeading}>
            Or reach us directly
          </h2>
          {settings?.telephone || settings?.email || settings?.studioAddress ? (
            <dl className={styles.places}>
              {settings.telephone ? (
                <div className={styles.place}>
                  <dt className={styles.placeTitle}>Telephone</dt>
                  <dd className={styles.placeNote}>
                    <a href={`tel:${settings.telephone.replace(/[^+\d]/g, '')}`}>
                      {settings.telephone}
                    </a>
                  </dd>
                </div>
              ) : null}
              {settings.email ? (
                <div className={styles.place}>
                  <dt className={styles.placeTitle}>Email</dt>
                  <dd className={styles.placeNote}>
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </dd>
                </div>
              ) : null}
              {settings.studioAddress ? (
                <div className={styles.place}>
                  <dt className={styles.placeTitle}>Studio</dt>
                  <dd className={styles.placeNote} style={{ whiteSpace: 'pre-line' }}>
                    {settings.studioAddress}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <ContentRequired>
              Telephone number, email address, studio address and the hours Visarto answers.
            </ContentRequired>
          )}
        </aside>
      </div>
    </>
  );
}
