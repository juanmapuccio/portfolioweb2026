import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { CLOSE_CHANNEL_IDS, closeChannels, contactData } from '../src/data/contact';
import { ui } from '../src/i18n/ui';

const strip = (s: string) => s.split(String.fromCharCode(13)).join('').replace(/\/\*[\s\S]*?\*\//g, '');
const ky = strip(readFileSync('src/components/tul/KyongYe.astro', 'utf8'));
const kyMarkup = ky.slice(0, ky.indexOf('<style>'));
const kyCss = ky.slice(ky.indexOf('<style>'));
const drops = strip(readFileSync('src/components/tul/InkDrops.astro', 'utf8'));
const dropsCss = drops.slice(drops.indexOf('<style>'));
const LANGS = ['es', 'en', 'pt'] as const;

// The block of the first rule whose selector list is exactly `selector` inside `css`.
const rule = (css: string, selector: string) => {
  const m = css.match(new RegExp(`(?:^|[}\\s])${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`));
  return m ? m[1] : '';
};
const media = (css: string, query: string) => {
  const start = css.indexOf(`@media ${query} {`);
  if (start < 0) return '';
  const next = css.indexOf('\n  @media', start + 1);
  return css.slice(start, next < 0 ? undefined : next);
};

describe('close: fewer, clearer options', () => {
  for (const lang of LANGS) {
    test(`${lang}: the close lists WhatsApp, LinkedIn and GitHub; email lives in the CTA, NodoSur in the colophon`, () => {
      expect([...CLOSE_CHANNEL_IDS]).toEqual(['whatsapp', 'linkedin', 'github']);
      expect(closeChannels(lang).map((c) => c.id)).toEqual(['whatsapp', 'linkedin', 'github']);
      // The data keeps every channel: the CV page lists all of them.
      expect(contactData[lang].channels.map((c) => c.id)).toEqual(['whatsapp', 'email', 'linkedin', 'github', 'nodosur']);
    });
  }

  test('four items in the channel list: the three channels and the CV of the language (no duplicate CV link)', () => {
    expect(kyMarkup).toContain('closeChannels(lang)');
    expect(kyMarkup).toMatch(/id: 'cv'[^}]*url: localePaths\[lang\] \+ 'cv\/'/);
    expect(kyMarkup).toContain('items.map(');
    expect(kyMarkup).not.toContain('content.channels.map(');
    expect(kyMarkup).not.toContain('class="ky__cv"');
  });

  test('on phones WhatsApp is a second CTA beside the email CTA; from 48rem there is one primary CTA', () => {
    expect(kyMarkup).toContain('class="ky__cta ky__cta--wa"');
    expect(kyMarkup).toContain("t('tul.close.whatsapp')");
    expect(kyMarkup).toMatch(/class="ky__cta ky__cta--wa"[\s\S]*?rel="noopener noreferrer"/);
    expect(rule(media(kyCss, '(min-width: 48rem)'), '.ky__cta--wa')).toContain('display: none');
    for (const lang of LANGS) {
      const v = ui[lang]['tul.close.whatsapp'];
      expect(typeof v).toBe('string');
      expect(v).toContain('WhatsApp');
    }
  });

  test('the channels are a 2x2 grid on phones and one row of four from 48rem, with no orphan rule', () => {
    expect(rule(kyCss, '.ky__channels')).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    expect(rule(media(kyCss, '(min-width: 48rem)'), '.ky__channels')).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))');
    expect(kyCss).not.toContain(':last-child:nth-child(odd)');
  });

  test('NodoSur is a small link in the colophon, opening a new tab', () => {
    const foot = kyMarkup.slice(kyMarkup.indexOf('<footer class="ky__colophon"'));
    expect(foot).toContain('class="ky__studio"');
    expect(foot).toContain('href={studio.url}');
    expect(foot).toMatch(/class="ky__studio"[^>]*rel="noopener noreferrer"/);
    expect(foot).toContain("t('tul.cv.newTab')");
  });
});

describe('close: type and touch', () => {
  test('title tracking is a local -0.01em and the phone title caps at 5.5svh', () => {
    const title = rule(kyCss, '.ky__title');
    expect(title).toContain('letter-spacing: -0.01em');
    expect(title).toContain('font-size: min(var(--step-3), 5.5svh)');
  });

  test('channel values read at 0.875rem on phones', () => {
    expect(rule(kyCss, '.ky__chan-value')).toContain('font-size: 0.875rem');
  });

  test('the language links are 44px targets', () => {
    const langs = rule(kyCss, '.ky__langs a');
    expect(langs).toContain('min-width: 2.75rem');
    expect(langs).toContain('min-height: 2.75rem');
  });

  test('the CTA drip bead is invisible at rest and shows on hover and focus-visible', () => {
    expect(rule(kyCss, '.ky__goo--drip')).toContain('opacity: 0');
    expect(kyCss).toMatch(/\.ky__cta:hover \.ky__goo--drip,\s*\.ky__cta:focus-visible \.ky__goo--drip \{[^}]*opacity: 1/);
  });

  test('the ink rule is thinner with smaller beads on phones, full weight from 48rem', () => {
    expect(rule(dropsCss, '.ink__rule')).toContain('height: var(--line)');
    expect(rule(dropsCss, '.ink')).toContain('--bead: 0.7');
    expect(rule(dropsCss, '.ink__bead')).toContain('var(--bead)');
    const wide = media(dropsCss, '(min-width: 48rem)');
    expect(rule(wide, '.ink')).toContain('--bead: 1');
    expect(rule(wide, '.ink__rule')).toContain('height: var(--line-strong)');
  });
});

describe('close: accessible channel names', () => {
  test('external channels open a new tab with noopener noreferrer and say so to screen readers', () => {
    const list = kyMarkup.slice(kyMarkup.indexOf('class="ky__channels"'), kyMarkup.indexOf('<footer'));
    expect(list).toContain("rel={c.external ? 'noopener noreferrer' : undefined}");
    expect(list).toContain("target={c.external ? '_blank' : undefined}");
    expect(list).toMatch(/\{c\.external && <span class="visually-hidden"> \{t\('tul\.cv\.newTab'\)\}<\/span>\}/);
  });

  test('a separator keeps the name and the value apart in the accessible name', () => {
    const list = kyMarkup.slice(kyMarkup.indexOf('class="ky__channels"'), kyMarkup.indexOf('<footer'));
    expect(list).toMatch(/<span class="ky__chan-name">\{c\.name\}<span class="visually-hidden"> · <\/span><\/span>/);
  });
});
