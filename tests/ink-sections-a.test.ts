import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

const hero = await read('../src/components/site/HeroSection.astro');
const belts = await read('../src/components/site/BeltsSection.astro');
const rail = await read('../src/components/site/BeltRail.astro');
const bamboo = await read('../src/components/site/BambooGrow.astro');
const drip = await read('../src/components/site/InkDrip.astro');
const inkTs = await read('../src/scripts/ink.ts');
const ui = await read('../src/i18n/ui.ts');
const pages = {
  es: await read('../src/pages/index.astro'),
  en: await read('../src/pages/en/index.astro'),
  pt: await read('../src/pages/pt/index.astro'),
};
const newComponents = { hero, belts, rail, bamboo, drip };

async function walk(dir: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

describe('landing: placeholders replaced', () => {
  test('no page renders the "empty shell" h1 anywhere in src', async () => {
    const files = (await walk(new URL('../src/', import.meta.url))).filter((u) => /\.(ts|astro)$/.test(u.pathname));
    for (const url of files) {
      expect((await readFile(url, 'utf8')).toLowerCase().includes('empty shell')).toBe(false);
    }
  });

  test('hero and belts are real components and the placeholder shell is gone (replaced in batch B)', async () => {
    const files = (await walk(new URL('../src/', import.meta.url))).map((u) => u.pathname);
    expect(files.some((path) => path.endsWith('/Placeholders.astro'))).toBe(false);
    for (const text of Object.values(pages)) {
      expect(text).toContain('HeroSection');
      expect(text).toContain('BeltsSection');
      expect(text).not.toContain('Placeholders');
    }
    expect(hero).toContain('id="hero"');
    expect(belts).toContain('id="cinturones"');
  });
});

describe('S1 hero', () => {
  test('tagline, role and scroll cue come from i18n in es, en and pt', () => {
    for (const key of ['hero.tagline', 'hero.tagline.l1', 'hero.tagline.l2', 'hero.tagline.l3', 'hero.role', 'hero.fig', 'hero.scroll', 'hero.sfx', 'hero.portraitAlt', 'belts.label', 'belts.chapter']) {
      expect(ui.split(`'${key}':`)).toHaveLength(4);
    }
    expect(ui).toContain("'hero.tagline': 'Audito procesos de empresas y los resuelvo con código.'");
    expect(ui).toContain("'hero.tagline': 'I audit business processes and solve them with code.'");
    expect(ui).toContain("'hero.tagline': 'Audito processos de empresas e os resolvo com código.'");
    for (const key of ['hero.tagline', 'hero.role', 'hero.fig', 'hero.scroll', 'hero.sfx', 'hero.portraitAlt', 'header.name']) {
      expect(hero).toContain(`t('${key}')`);
    }
  });

  test('name is the h1, the portrait is the repo asset, the 9j cue is reused, no glyph backdrop', () => {
    expect(hero).toContain('<h1 class="hero__name"');
    expect(hero).toContain("from '../../assets/fotojmPerfil-ink.png'");
    expect(hero).toContain("import InkScrollDrop from '../ink/InkScrollDrop.astro'");
    expect(hero).toContain('<InkScrollDrop');
    expect(hero).not.toContain('InkGlyphTitle');
  });

  test('manga page: soft exit scrubbed through --p (drift + fade + wash), no pull-back, zoom, flash or drip', () => {
    expect(hero).toContain('data-ink-scene');
    expect(hero).toContain('.hero__wash');
    expect(hero).toContain('translateY(calc(var(--exit) * -6svh))');
    expect(hero).toContain('position: sticky');
    expect(hero).toContain('data-belt="blanco"');
    expect(hero).not.toContain('<InkDrip');
    expect(hero).not.toMatch(/hero__pull|hero__flash|hero__zoom/);
  });

  test('the entrance and scrub only apply with motion allowed and JS present', () => {
    expect(hero).toContain('@media (min-width: 768px) and (prefers-reduced-motion: no-preference)');
    expect(hero).toMatch(/@media \(min-width: 768px\) and \(prefers-reduced-motion: no-preference\) \{\s*html\.js \.hero \{/);
    expect(hero).toContain('@media (prefers-reduced-motion: reduce)');
    expect(hero).toMatch(/\.hero__wash \{ display: none; \}/);
  });
});

describe('S2 belts', () => {
  test('six chapters come from martialExperience.ts, not hardcoded', () => {
    expect(belts).toContain("from '../../data/martialExperience'");
    expect(belts).toContain('martialExperienceData[lang].stages');
    expect(belts).toContain('BELTS[stage.beltKey]');
    expect(belts).toContain('data-belt-chapter');
    expect(belts).toContain('data-belt={chapter.key}');
    expect(belts).toContain('stage.years');
    expect(belts).toContain('stage.title');
    expect(belts).toContain('stage.line');
    expect(belts).toContain('stage.kicker');
    for (const title of ['Cimientos', 'La calle', 'Producción']) {
      expect(belts).not.toContain(title);
    }
  });

  test('data-belt values map the six belts and the section', async () => {
    const data = await read('../src/data/martialExperience.ts');
    const keys = [...data.slice(0, data.indexOf('export interface MartialPosition')).matchAll(/^ {2}(blanco|amarillo|verde|azul|rojo|negro): \{/gm)].map((m) => m[1]);
    expect(keys).toEqual(['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro']);
    for (const [key, tone] of [['blanco', 'white'], ['amarillo', 'yellow'], ['verde', 'green'], ['azul', 'blue'], ['rojo', 'red'], ['negro', 'black']]) {
      expect(belts).toContain(`${key}: '${tone}'`);
    }
    expect(belts).toContain('data-belt="amarillo" data-belt-scene data-ink-scene');
  });

  test('ink.ts sets the active belt per chapter and leaves chapters out of the generic rule', () => {
    expect(inkTs).toContain('function initBeltScenes');
    expect(inkTs).toContain("'[data-belt-chapter]'");
    expect(inkTs).toContain('root.dataset.belt = belt');
    expect(inkTs).toContain('Math.round(self.progress * (chapters.length - 1))');
    expect(inkTs).toContain("el.matches('[data-belt-scene], [data-belt-chapter]')");
    expect(inkTs).toContain('initBeltScenes();');
    expect(inkTs).toContain('if (reduced) return;');
  });

  test('desktop: pinned horizontal track, 6b wipes at mid-segment, 6d enso and a soft ink bloom (no glyph, no flash)', () => {
    expect(belts).toContain('height: 700svh');
    expect(belts).toContain('position: sticky');
    expect(belts).toContain('translateX(calc(var(--p, 0) * -1 * (var(--count) - 1) / var(--count) * 100%))');
    expect(belts).toContain('(var(--i) - 0.5) / 5');
    expect(belts).toContain('stroke-dashoffset: calc(1 - var(--e))');
    expect(belts).toContain('.belts__bloom');
    expect((belts.match(/<span class="belts__bloom"/g) ?? []).length).toBe(1);
    expect(belts).not.toMatch(/belts__dan|belts__impact/);
    expect(belts).toContain('<BeltRail');
  });

  test('mobile: 7c sticky stack, 2d bamboo with --p and one drip per belt change', () => {
    expect(belts).toContain('@media (max-width: 1023.98px) and (prefers-reduced-motion: no-preference)');
    expect(belts).toMatch(/\.chapter \{ position: sticky;/);
    expect(belts).toContain('<BambooGrow');
    expect(bamboo).toContain('scaleY(var(--p, 1))');
    // the drip is skipped for the first chapter: 5 belt changes
    expect(belts).toContain('chapter.index > 0 && <InkDrip');
  });

  test('reduced motion: no pin, no scrub, no flash, chapters stay in a plain column', () => {
    const scrub = belts.slice(belts.indexOf('/* ---- Desktop scrub'));
    expect(scrub.startsWith('/* ---- Desktop scrub')).toBe(true);
    expect(belts).toContain('@media (min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    // pin, track transform, enso and bloom are only declared inside no-preference blocks
    const staticPart = belts.slice(belts.indexOf('<style'), belts.indexOf('/* ---- Mobile / tablet scrub'));
    expect(staticPart).not.toContain('position: sticky');
    expect(staticPart).not.toContain('700svh');
    expect(staticPart).toContain('flex-direction: column');
    expect(belts).toContain('@media (prefers-reduced-motion: reduce)');
    expect(belts).toMatch(/\.belts__wipes, \.belts__enso, \.belts__bloom, \.belts__bamboo \{ display: none; \}/);
    // the bloom is display:none by default and only shown in the no-preference block
    expect(belts).toMatch(/html\.js \.belts__bloom \{ display: block;/);
    expect(drip).toContain('prefers-reduced-motion: reduce');
  });
});

describe('perf and single engine', () => {
  test('no requestAnimationFrame, new Lenis or ScrollTrigger.create in the new components', () => {
    for (const text of Object.values(newComponents)) {
      expect(text.includes('requestAnimationFrame')).toBe(false);
      expect(text.includes('new Lenis')).toBe(false);
      expect(text.includes('ScrollTrigger')).toBe(false);
      expect(text.includes('addEventListener')).toBe(false);
    }
  });

  test('no CSS filter on animated selectors in the new components', () => {
    for (const text of Object.values(newComponents)) {
      // no CSS filter at all: the hero portrait is a pre-processed ink asset, not a runtime filter
      expect(text).not.toMatch(/(^|[;{\s])filter\s*:/m);
      expect(text).not.toContain('backdrop-filter');
    }
    // inline svg filter attributes only appear on the reused static pieces, never here
    for (const text of Object.values(newComponents)) {
      expect(text).not.toContain('filter="');
    }
  });

  test('only transform, opacity, clip-path and stroke-dashoffset are driven by --p', () => {
    for (const text of [hero, belts, rail, bamboo]) {
      const css = text.slice(text.indexOf('<style'));
      const driven = [...css.matchAll(/([a-z-]+):[^;{}]*var\(--(?:p|pull|exit|t|r|w|e|dan)[,)]/g)].map((m) => m[1]);
      for (const prop of driven) {
        expect(['transform', 'opacity', 'clip-path', 'stroke-dashoffset', '--pull', '--exit', '--t', '--r', '--w', '--e', '--dan', '--bloom', '--i', 'translate']).toContain(prop);
      }
    }
  });
});
