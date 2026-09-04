import { CtaLink, QuietLink } from '@/components/primitives/Cta';
import { PageOpening } from '@/components/primitives/PageOpening';
import { calls } from '@/lib/content/site';
import { notFoundPage } from '@/lib/content/pages';
import styles from './not-found.module.css';

export const metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <PageOpening
        mark={notFoundPage.mark}
        title={notFoundPage.title}
        standfirst={notFoundPage.standfirst}
      />
      <div className={`sheet ${styles.actions}`}>
        <CtaLink href="/">Back to the front</CtaLink>
        <QuietLink href={calls.primary.href}>{calls.primary.label}</QuietLink>
      </div>
    </>
  );
}
