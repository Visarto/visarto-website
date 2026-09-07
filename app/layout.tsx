import type { Metadata, Viewport } from 'next';

import { SiteFooter } from '@/components/chrome/SiteFooter';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { SkipLink } from '@/components/chrome/SkipLink';
import { StructuredData } from '@/components/seo/StructuredData';
import { WeaveDefs } from '@/components/primitives/WeaveDefs';
import { brand } from '@/lib/content/site';
import { siteUrl } from '@/lib/env';
import { fraunces, manrope } from '@/lib/fonts';
import { getSiteSettings } from '@/sanity/lib/queries';

import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/typography.css';
import '@/styles/layout.css';
import '@/styles/motion.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} | ${brand.descriptor}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.summary,
  applicationName: brand.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#f2eee6',
  colorScheme: 'light',
};

/**
 * `data-js` is set before first paint so that the entrance styles in
 * `motion.css` apply only where JavaScript can complete them. Without it, and
 * under reduced motion, the page renders in its finished state with no
 * transition to wait for.
 */
const JS_FLAG = "document.documentElement.dataset.js='true'";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body>
        <SkipLink />
        <StructuredData settings={settings} />
        <WeaveDefs />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
