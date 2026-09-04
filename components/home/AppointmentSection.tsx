import { ContentRequired } from '@/components/primitives/ContentRequired';
import { CtaLink } from '@/components/primitives/Cta';
import { Reveal } from '@/components/primitives/Reveal';
import { home } from '@/lib/content/home';
import { calls } from '@/lib/content/site';
import type { AppointmentSettings } from '@/sanity/lib/types';
import styles from './AppointmentSection.module.css';

export function AppointmentSection({ settings }: { settings: AppointmentSettings | null }) {
  return (
    <section className={`on-midnight ${styles.section}`} aria-labelledby="appointment-heading">
      <div className={`sheet ${styles.layout}`}>
        <Reveal className={styles.copy}>
          <h2 id="appointment-heading" className={`display-2 ${styles.heading}`}>
            {home.appointment.heading}
          </h2>
          <p className={`body ${styles.body}`}>{home.appointment.body}</p>
        </Reveal>

        <div className={styles.aside}>
          {settings?.whatToBring ? (
            <p className={`body ${styles.body}`}>{settings.whatToBring}</p>
          ) : (
            <ContentRequired>{home.appointment.bringRequires}</ContentRequired>
          )}
          <div className={styles.actions}>
            <CtaLink href={calls.primary.href}>{calls.primary.label}</CtaLink>
            <CtaLink href={calls.secondary.href} variant="outline">
              {calls.secondary.label}
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
