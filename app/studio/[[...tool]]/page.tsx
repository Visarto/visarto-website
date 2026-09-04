import { isSanityConfigured } from '@/lib/env';
import StudioClient from './StudioClient';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Visarto Studio',
  robots: { index: false, follow: false },
};

/**
 * The studio is served from the site so that editors have one address to
 * remember. It is never indexed, and it says so plainly rather than rendering a
 * broken shell when no project is configured.
 */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="sheet" style={{ paddingBlock: '4rem' }}>
        <h1 className="display-3">The studio is not connected yet</h1>
        <p className="body" style={{ marginTop: '1rem' }}>
          Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in the environment,
          then reload this page.
        </p>
      </div>
    );
  }

  return <StudioClient />;
}
