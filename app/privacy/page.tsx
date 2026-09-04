import { ContentRequired } from '@/components/primitives/ContentRequired';
import { PageOpening } from '@/components/primitives/PageOpening';
import { legalPages } from '@/lib/content/pages';
import { pageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export const metadata = pageMetadata({
  title: 'Privacy',
  description: 'How Visarto handles the information sent through this website.',
  path: '/privacy',
  noIndex: true,
});

/**
 * Left empty on purpose. A privacy notice is a legal document about a specific
 * business and cannot be written on its behalf, so the page exists, is reachable
 * and is marked no-index until Visarto supplies the text.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageOpening mark={legalPages.privacy.mark} title={legalPages.privacy.title} />
      <div className={`sheet ${styles.body}`}>
        <ContentRequired>{legalPages.privacy.requires}</ContentRequired>
      </div>
    </>
  );
}
