import { RequestForm } from '@/components/appointments/RequestForm';
import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { MediaFrame } from '@/components/primitives/MediaFrame';
import { PageOpening } from '@/components/primitives/PageOpening';
import { Reveal } from '@/components/primitives/Reveal';
import { appointmentsPage, madeToMeasure } from '@/lib/content/pages';
import { home, studioPlace, visitingPlaces } from '@/lib/content/home';
import { bookingUrl, isAppointmentDeliveryConfigured } from '@/lib/env';
import { pageMetadata } from '@/lib/seo';
import { getAppointmentSettings, getSiteSettings } from '@/sanity/lib/queries';
import styles from './page.module.css';

/**
 * Rendered per request.
 *
 * Whether the appointment destination is configured is read from the server
 * environment, and a statically prerendered page would bake in whatever that
 * was at build time. On a platform where environment variables are set after a
 * build, or changed without one, the form would silently stay switched off
 * while the destination was live. This is the one page on the site where that
 * would cost a client, so it is rendered per request.
 */
export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  title: 'Book an appointment',
  description:
    'Request a fitting with Visarto at the studio, at your home or at your office. Made to measure for men and women.',
  path: '/appointments',
});

/**
 * The conversion page.
 *
 * If Visarto books through an external system, this page hands over to it
 * plainly rather than redirecting, so the visitor keeps their bearings. If not,
 * it carries the request form, which is switched off unless a real destination
 * is configured.
 */
export default async function AppointmentsPage() {
  const [appointment, settings] = await Promise.all([getAppointmentSettings(), getSiteSettings()]);
  const external = appointment?.bookingUrl ?? settings?.bookingUrl ?? bookingUrl;
  const locations = appointment?.locations ?? null;

  return (
    <>
      <PageOpening
        mark={appointmentsPage.mark}
        title={appointmentsPage.title}
        standfirst={appointmentsPage.standfirst}
      />

      <div className={`sheet ${styles.layout}`}>
        <div className={styles.main}>
          {external ? (
            <div className={styles.external}>
              <h2 className="display-3">{appointmentsPage.external.title}</h2>
              <p className="body">{appointmentsPage.external.body}</p>
              <CtaLink href={external} external>
                {appointmentsPage.external.action}
              </CtaLink>
            </div>
          ) : (
            <RequestForm intent="appointment" deliveryConfigured={isAppointmentDeliveryConfigured} />
          )}
        </div>

        <aside className={styles.aside} aria-labelledby="appointment-detail">
          <h2 id="appointment-detail" className={styles.asideHeading}>
            Where a fitting can happen
          </h2>

          {locations && locations.length > 0 ? (
            <dl className={styles.places}>
              {locations.map((place) => (
                <div key={place.name} className={styles.place}>
                  <dt className={styles.placeTitle}>{place.name}</dt>
                  {place.note ? <dd className={styles.placeNote}>{place.note}</dd> : null}
                </div>
              ))}
            </dl>
          ) : (
            <dl className={styles.places}>
              <div className={styles.place}>
                <dt className={styles.placeTitle}>{studioPlace.title}</dt>
                <dd>
                  {settings?.studioAddress ? (
                    <span className={styles.placeNote} style={{ whiteSpace: 'pre-line' }}>
                      {settings.studioAddress}
                    </span>
                  ) : (
                    <ContentRequired>{studioPlace.requires}</ContentRequired>
                  )}
                </dd>
              </div>
              {visitingPlaces.map((place) => (
                <div key={place.title} className={styles.place}>
                  <dt className={styles.placeTitle}>{place.title}</dt>
                  <dd className={styles.placeNote}>{place.note}</dd>
                </div>
              ))}
            </dl>
          )}

          <p className={`fine ${styles.closing}`}>{home.fitting.closing}</p>

          {/* The studio, so the page is not asking for an appointment against a
              blank field. */}
          <Reveal variant="mask" className={styles.media}>
            <MediaFrame
              ratio="4 / 3"
              fallbackSrc="/placeholders/home-fitting.jpg"
              sizes="(min-width: 64rem) 32vw, 100vw"
              weave="birdseye"
              alt=""
            />
          </Reveal>

          <div className={styles.practical}>
            {appointment?.whatToBring ? (
              <p className={styles.placeNote}>{appointment.whatToBring}</p>
            ) : (
              <ContentRequired>{madeToMeasure.practicalRequires}</ContentRequired>
            )}
          </div>
        </aside>
      </div>

      {/*
        The leap this page asks for is a conversation with a stranger about
        clothes, so it says what the conversation is. Nothing here is a promise
        about time or price: every line is drawn from copy already written on
        the made to measure page and the standfirst above.
      */}
      <section className={`on-close ${styles.next}`} aria-labelledby="next-heading">
        <div className={`sheet ${styles.nextLayout}`}>
          <h2 id="next-heading" className="display-3">
            {appointmentsPage.next.heading}
          </h2>
          <Reveal as="ol" stagger className={styles.steps}>
            {appointmentsPage.next.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={`index-mark ${styles.stepMark}`} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepNote}>{step.note}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
