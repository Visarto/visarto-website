import { ContentRequired } from '@/components/primitives/ContentRequired';
import { PageOpening } from '@/components/primitives/PageOpening';
import { legalPages } from '@/lib/content/pages';
import { pageMetadata } from '@/lib/seo';
import styles from '../privacy/page.module.css';

export const metadata = pageMetadata({
  title: 'Terms',
  description: 'The terms a Visarto commission is made under.',
  path: '/terms',
  noIndex: true,
});

export default function TermsPage() {
  return (
    <>
      <PageOpening mark={legalPages.terms.mark} title={legalPages.terms.title} />
      <div className={`sheet ${styles.body}`}>
        <ContentRequired>{legalPages.terms.requires}</ContentRequired>
      </div>
    </>
  );
}
