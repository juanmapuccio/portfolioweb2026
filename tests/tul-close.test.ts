import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { RETURN_FORM } from '../src/data/tuls';
import { contactData } from '../src/data/contact';
import { ui } from '../src/i18n/ui';

const read = (p: string) => readFileSync(p, 'utf8');
const PAGES = [
  ['src/pages/index.astro', 'es'],
  ['src/pages/en/index.astro', 'en'],
  ['src/pages/pt/index.astro', 'pt']
] as const;
const COMPONENTS = ['Principles', 'TechSheet', 'KyongYe'].map((n) => `src/components/tul/${n}.astro`);

describe('close mounting', () => {
  for (const [file, lang] of PAGES) {
    test(`${lang}: Kyong-ye closes the page right after the black belt work`, () => {
      const src = read(file);
      const tags = [...src.matchAll(/<(HeroJoonbi|BeltSprint|BlackBeltWork|Principles|TechSheet|KyongYe) lang="(\w+)" \/>/g)];
      expect(tags.map((m) => m[1]).slice(-2)).toEqual(['BlackBeltWork', 'KyongYe']);
      expect(tags.every((m) => m[2] === lang)).toBe(true);
    });
  }
});

describe('anchors', () => {
  test('exactly one element has id="contacto" among the mounted tul components', () => {
    const files = [
      ...COMPONENTS,
      'src/components/tul/TulChapter.astro',
      'src/components/tul/HeroJoonbi.astro',
      'src/components/tul/TulHeader.astro',
      'src/components/tul/BeltSprint.astro',
      'src/components/tul/BlackBeltWork.astro'
    ];
    const hits = files.flatMap((f) => [...read(f).matchAll(/\bid="contacto"/g)]);
    expect(hits.length).toBe(1);
    expect(read('src/components/tul/KyongYe.astro')).toContain('id="contacto"');
  });

  test('the section ids exist and the header and hero point at #contacto', () => {
    expect(read('src/components/tul/Principles.astro')).toContain('id="principios"');
    expect(read('src/components/tul/TechSheet.astro')).toContain('id="hoja-tecnica"');
    expect(read('src/components/tul/TulHeader.astro')).toContain('href="#contacto"');
    expect(read('src/components/tul/HeroJoonbi.astro')).toContain('href="#contacto"');
  });

  test('the three sections carry the negro belt (1st dan in the header) and so take the black field', () => {
    const base = read('src/styles/tul/base.css');
    // Every section that carries data-belt="negro" is covered by the black-field rules in base.css
    // (CSS fallback) and by html[data-field="dark"] (flood).
    expect(base).toContain("main > section[data-belt='negro']");
    for (const f of COMPONENTS) {
      const src = read(f);
      expect(src).toMatch(/<section[^>]*data-belt="negro"/);
      expect(src).not.toContain('data-grade-belt');
    }
  });
});

describe('contact channels', () => {
  for (const lang of ['es', 'en', 'pt'] as const) {
    test(`${lang}: five channels, each with a real href scheme`, () => {
      const channels = contactData[lang].channels;
      expect(channels.map((c) => c.id)).toEqual(['whatsapp', 'email', 'linkedin', 'github', 'nodosur']);
      for (const c of channels) expect(/^(mailto:|https:\/\/)/.test(c.url)).toBe(true);
      expect(channels.find((c) => c.id === 'email')?.url.startsWith('mailto:')).toBe(true);
      expect(channels.find((c) => c.id === 'whatsapp')?.url.startsWith('https://wa.me/')).toBe(true);
    });
  }
});

describe('RETURN_FORM', () => {
  test('is a closed path inside the unit square', () => {
    const p = RETURN_FORM.path;
    expect(p.length).toBeGreaterThan(3);
    expect(p[0]).toEqual(p[p.length - 1]);
    for (const [x, y] of p) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  test('starts at the footprints of the hero (centre of the white diagram)', () => {
    expect(RETURN_FORM.path[0]).toEqual([0.5, 0.5]);
  });
});

describe('technical sheet', () => {
  const sheet = read('src/components/tul/TechSheet.astro');
  const skills = read('src/data/skills.ts');

  test('is a definition list with a heading and the Drive CV link', () => {
    expect(sheet).toContain('<dl');
    expect(read('src/data/cvSheet.ts')).toContain('CV_URL');
    expect(sheet).toContain('target="_blank" rel="noopener noreferrer"');
  });

  test('the data holds all five certifications with their year and English B2, in every language', () => {
    for (const name of ['AWS Certified Cloud Practitioner (2025)', 'AZ-900 (2025)', 'Google Cloud Computing Foundations (2024)', 'CS50: Introduction to Computer Science', '(2022)']) {
      expect(skills.split(name).length - 1).toBe(3);
    }
    for (const lang of ['es', 'en', 'pt'] as const) expect(ui[lang]['tul.sheet.lang.en']).toContain('B2');
  });
});

describe('copy and glyph rules', () => {
  test('no hangul in the new components', () => {
    for (const f of COMPONENTS) expect(/[ᄀ-ᇿ㄰-㆏가-힯]/.test(read(f))).toBe(false);
  });

  test('new i18n strings are complete, in first person, with no em-dash', () => {
    const keys = Object.keys(ui.es).filter((k) => /^tul\.(principles|sheet|close)\./.test(k));
    expect(keys.length).toBeGreaterThan(10);
    for (const lang of ['es', 'en', 'pt'] as const) {
      for (const k of keys) {
        const v = (ui[lang] as Record<string, string>)[k];
        expect(typeof v).toBe('string');
        expect(v.includes('—')).toBe(false);
        expect(/Stoky|Inmotuls|Credituls|Abogac/i.test(v)).toBe(false);
      }
    }
  });

  test('the engine has no grade override workaround', () => {
    const engine = read('src/scripts/tul.ts');
    expect(engine).not.toContain('gradeBelt');
    expect(engine).not.toContain('nextGradeBelt');
  });
});

describe('single-viewport close with living ink (T4)', () => {
  const strip = (s: string) => s.split(String.fromCharCode(13)).join('').replace(/\/\*[\s\S]*?\*\//g, '');
  const ky = strip(read('src/components/tul/KyongYe.astro'));
  const kyCss = ky.slice(ky.indexOf('<style>'));
  const drops = strip(read('src/components/tul/InkDrops.astro'));
  const dropsMarkup = drops.slice(0, drops.indexOf('<style>'));
  const dropsCss = drops.slice(drops.indexOf('<style>'));
  const engine = read('src/scripts/tul.ts');
  const fn = engine.slice(engine.indexOf('function initInkDrops'), engine.indexOf('function initHeaderAutohide'));

  test('the close is one screen: no tall pinned track, no sticky stage, one 100svh section', () => {
    expect(kyCss).not.toMatch(/100svh \+ var\(--n/);
    expect(kyCss).not.toContain('position: sticky');
    expect(ky).not.toMatch(/style="--n:/);
    expect(kyCss).toMatch(/\.ky__stage \{[^}]*min-height: 100svh/);
  });

  test('the channels and the colophon live inside the one stage (the footer is part of the screen)', () => {
    const stage = ky.slice(ky.indexOf('class="ky__stage"'), ky.indexOf('<style>'));
    expect(stage).toContain('class="ky__channels"');
    expect(stage).toContain('<footer class="ky__colophon"');
    expect(ky).not.toContain('ky__after');
  });

  test('the return line still draws, over the section entering the viewport (no extra scroll)', () => {
    expect(ky).toMatch(/data-tul-scene data-scene-span="enter"/);
    expect(engine).toContain("el.dataset.sceneSpan === 'enter'");
    expect(engine).toMatch(/start: enter \? 'top bottom' : 'top top'/);
  });

  test('content kept: CTA, CV link of the language, five channels, languages and the back link', () => {
    expect(ky).toContain('id="contacto"');
    expect(ky).toContain('<a class="ky__cta" href={primary.url}>');
    expect(ky).toContain("localePaths[lang] + 'cv/'");
    expect(ky).toContain('content.channels.map(');
    for (const key of ['tul.close.cta', 'tul.close.cv', 'tul.close.channels', 'tul.close.back', 'tul.hero.availability', 'contact.footer', 'tul.lang.label']) {
      expect(ky).toContain(`t('${key}')`);
    }
  });

  test('the gooey filter: blur, alpha threshold and a crisp composite, on a decorative hidden layer', () => {
    expect(dropsMarkup).toMatch(/<filter id="ky-goo"/);
    expect(dropsMarkup).toContain('<feGaussianBlur');
    expect(dropsMarkup).toMatch(/<feColorMatrix[^>]*type="matrix"/);
    expect(dropsMarkup).toContain('<feComposite');
    expect(dropsMarkup).not.toMatch(/feTurbulence|feDisplacementMap/);
    expect(dropsMarkup).toMatch(/<svg[^>]*aria-hidden="true"/);
    expect(dropsMarkup).toMatch(/<div class="ink" data-ink-drops aria-hidden="true"/);
    expect(ky).toContain('<InkDrops />');
    // The filter never touches text: only the hidden goo layers use it.
    for (const m of [...(kyCss + dropsCss).matchAll(/([^{}]+)\{[^}]*filter: url\(#ky-goo\)/g)]) {
      expect(m[1]).toMatch(/goo|ink__layer/);
    }
    expect(ky).toMatch(/class="ky__goo" aria-hidden="true"/);
  });

  test('ink colours only, no gradient, shadow or blend mode, transform and opacity motion', () => {
    for (const css of [kyCss, dropsCss]) {
      expect(css).not.toMatch(/gradient|box-shadow|mix-blend-mode|#[0-9a-f]{3,6}\b/i);
      for (const kf of css.matchAll(/@keyframes [\w-]+ \{([\s\S]*?)\n  \}/g)) {
        const props = [...kf[1].matchAll(/([a-z-]+):/g)].map((m) => m[1]);
        for (const p of props) expect(['transform', 'opacity']).toContain(p);
      }
    }
    expect(dropsCss).toContain('background-color: var(--ink)');
  });

  test('without JS or with reduced motion the merged state shows, still; motion runs only under html.js', () => {
    const idx = dropsCss.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(idx).toBeGreaterThan(-1);
    expect(dropsCss.slice(0, idx)).not.toMatch(/animation:/);
    expect(dropsCss.slice(idx)).toContain(':global(html.js)');
    expect(dropsCss.slice(idx)).toContain('.is-in');
  });

  test('the ambient loop pauses offscreen: an observer toggles is-live, the CSS reads play-state', () => {
    expect(fn).toContain('IntersectionObserver');
    expect(fn).toContain("toggle('is-live'");
    expect(fn).toContain('if (reduced');
    expect(fn).not.toMatch(/requestAnimationFrame|lenis/i);
    expect(engine).toMatch(/\ninitInkDrops\(\);/);
    expect(dropsCss).toContain('animation-play-state: paused');
    expect(dropsCss).toMatch(/\.is-live[^{]*\{[^}]*animation-play-state: running/);
  });
});
