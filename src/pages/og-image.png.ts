import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

// Generated at build time (prerender), not per-request — Astro's default
// `output: 'static'` (no adapter configured) writes this to dist/og-image.png
// as a static asset, same as any other prerendered route.
export const prerender = true;

const fontsDir = path.join(process.cwd(), 'src/assets/fonts');
const plexBold = fs.readFileSync(path.join(fontsDir, 'IBMPlexSans-Bold.ttf'));
const plexMedium = fs.readFileSync(path.join(fontsDir, 'IBMPlexSans-Medium.ttf'));
const plexRegular = fs.readFileSync(path.join(fontsDir, 'IBMPlexSans-Regular.ttf'));

// Dark-theme tokens copied from src/styles/global.css ([data-theme='dark']
// block) — satori renders in isolation and can't read CSS custom properties,
// so the values are inlined here rather than referenced.
const COLORS = {
  bgPrimary: '#15181c',
  textMain: '#edf2f7',
  textDim: '#718096',
  accentAmber: '#fbbf24'
};

const TAGS = ['TypeScript', 'React', 'Astro', 'Node.js'];

export const GET: APIRoute = async () => {
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          backgroundColor: COLORS.bgPrimary,
          fontFamily: 'IBM Plex Sans'
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '36px'
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      backgroundColor: COLORS.accentAmber,
                      color: '#12161c',
                      fontSize: '28px',
                      fontWeight: 800
                    },
                    children: 'JP'
                  }
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '26px',
                      fontWeight: 500,
                      color: COLORS.textDim,
                      letterSpacing: '0.02em'
                    },
                    children: 'juanpuccio.vercel.app'
                  }
                }
              ]
            }
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '84px',
                fontWeight: 700,
                color: COLORS.textMain,
                lineHeight: 1.05,
                letterSpacing: '-0.02em'
              },
              children: 'Juan Manuel Puccio'
            }
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                fontSize: '40px',
                fontWeight: 500,
                color: COLORS.accentAmber,
                marginTop: '20px'
              },
              children: 'Full Stack Developer & Consultor IT'
            }
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '16px',
                marginTop: '56px'
              },
              children: TAGS.map((tag) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: `1px solid ${COLORS.accentAmber}55`,
                    backgroundColor: `${COLORS.accentAmber}1a`,
                    color: COLORS.accentAmber,
                    fontSize: '24px',
                    fontWeight: 500
                  },
                  children: tag
                }
              }))
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'IBM Plex Sans', data: plexBold, weight: 700, style: 'normal' },
        { name: 'IBM Plex Sans', data: plexMedium, weight: 500, style: 'normal' },
        { name: 'IBM Plex Sans', data: plexRegular, weight: 400, style: 'normal' }
      ]
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 }
  });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' }
  });
};
