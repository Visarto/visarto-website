import { ImageResponse } from 'next/og';

import { brand } from '@/lib/content/site';

/**
 * The default sharing card.
 *
 * next/og renders this to a real 1200×630 image at request time. It runs on
 * the Node runtime because the site's default target is Node, not Edge.
 *
 * The card is typographic on chalk, in the same voice family as the site:
 * a masthead, a rule, a standfirst, and the Visarto mark. No photograph. That
 * choice is deliberate. A shared link should read the way the site reads, not
 * dress the site up in stock imagery it does not own.
 *
 * Fraunces is fetched from the Google Fonts static host and cached by Next's
 * fetch cache, so the download happens once per cold start rather than per
 * request.
 */

export const runtime = 'nodejs';
export const alt = `${brand.name} | ${brand.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const FRAUNCES_URL =
  'https://fonts.gstatic.com/s/fraunces/v40/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk.woff2';
const MANROPE_URL =
  'https://fonts.gstatic.com/s/manrope/v20/xn7_YHE41ni1AdIRggexSg.woff2';

async function loadFont(url: string) {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Font fetch failed: ${url}`);
  return response.arrayBuffer();
}

export default async function OpenGraphImage() {
  const [fraunces, manrope] = await Promise.all([
    loadFont(FRAUNCES_URL),
    loadFont(MANROPE_URL),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '88px 104px',
          backgroundColor: '#f2eee6',
          color: '#191512',
          fontFamily: 'Manrope',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width={44} height={44} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <g
              fill="none"
              stroke="#191512"
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <path d="M6 9 H26 L16 25 Z" />
              <path d="M11 12.5 L16 20.5 L21 12.5" />
            </g>
          </svg>
          <span
            style={{
              fontFamily: 'Fraunces',
              fontSize: 30,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            Visarto
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div
            style={{
              width: 96,
              height: 1,
              backgroundColor: '#bdb4a4',
            }}
          />
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize: 96,
              lineHeight: 1.04,
              letterSpacing: '-0.028em',
              maxWidth: 900,
            }}
          >
            {brand.descriptor}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.48,
              color: '#4e463c',
              maxWidth: 780,
            }}
          >
            {brand.summary}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: '#675e52',
          }}
        >
          <span>By appointment</span>
          <span>Menswear · Womenswear</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, style: 'normal', weight: 500 },
        { name: 'Manrope', data: manrope, style: 'normal', weight: 400 },
      ],
    },
  );
}
