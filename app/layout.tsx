import type { Metadata, Viewport } from 'next';

import { SiteFooter } from '@/components/chrome/SiteFooter';
import { SiteHeader } from '@/components/chrome/SiteHeader';
import { Intro } from '@/components/chrome/Intro';
import { SkipLink } from '@/components/chrome/SkipLink';
import { StructuredData } from '@/components/seo/StructuredData';
import { Grain } from '@/components/primitives/Grain';
import { WeaveDefs } from '@/components/primitives/WeaveDefs';
import { brand } from '@/lib/content/site';
import { siteUrl } from '@/lib/env';
import { display, manrope } from '@/lib/fonts';
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
  themeColor: '#16130f',
  colorScheme: 'dark',
};

/**
 * Runs before first paint, and decides two things.
 *
 * `data-js` gates the entrance styles in `motion.css`, so that they apply only
 * where JavaScript can complete them. Without it, and under reduced motion, the
 * page renders in its finished state with no transition to wait for.
 *
 * `data-intro` decides whether the opening curtain is shown at all. Doing it
 * here rather than in React is what avoids a flash: the curtain is in the
 * server HTML but stays `display: none` until this line says otherwise, so a
 * visitor without JavaScript, one who has asked for reduced motion, and one who
 * has already seen it this session never see it appear and disappear.
 */
const BOOT = `try{
  var d=document.documentElement;
  d.dataset.js='true';
  var quiet=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen=null;
  try{seen=sessionStorage.getItem('visarto:intro')}catch(e){}
  if(!quiet&&!seen)d.dataset.intro='pending';
}catch(e){document.documentElement.dataset.js='true'}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${display.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <Intro />
        <SkipLink />
        <StructuredData settings={settings} />
        <WeaveDefs />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter settings={settings} />
        <Grain />
      </body>
    </html>
  );
}
