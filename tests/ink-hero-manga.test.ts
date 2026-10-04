import { describe, expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

// Hangul (jamo + syllables), CJK ideographs, kana.
const ASIAN = /[㄰-㆏가-힯一-鿿぀-ヿ]/;

async function walk(dir: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

const hero = await read('../src/components/site/HeroSection.astro');
const loader = await read('../src/scripts/loader.ts');
const belts = await read('../src/components/site/BeltsSection.astro');
const ui = await read('../src/i18n/ui.ts');

describe('hero as a manga page', () => {
  test('at least four panels with data-panel, on a black gutter grid', () => {
    const panels = [...hero.matchAll(/data-panel="([a-z]+)"/g)].map((m) => m[1]);
    expect(panels.length).toBeGreaterThanOrEqual(4);
    expect(panels).toEqual(['name', 'tagline', 'portrait', 'balloon', 'cue']);
    expect(hero).toContain("t('hero.tagline')");
  });

  test('irregular panels: clip-path polygons with slanted edges, black frames of varied weight', () => {
    // every panel has its own polygon, the frame is a black ::before plus a paper ::after inset by --b
    const clips = [...hero.matchAll(/\.hero__panel--(name|tagline|portrait|balloon|cue) \{[^}]*--clip: polygon\(([^;]+)\);/g)];
    expect(new Set(clips.map((m) => m[1]))).toEqual(new Set(['name', 'tagline', 'portrait', 'balloon', 'cue']));
    // slanted: at least one polygon vertex off the rectangle (a calc() offset or a non-0/100% y on a side)
    expect(hero).toMatch(/--clip: polygon\([^;]*calc\(100% - var\(--tilt\)\)/);
    expect(hero).toMatch(/\.hero__panel::before \{[^}]*background: var\(--ink-belt-black\)/);
    expect(hero).toMatch(/\.hero__panel::after \{[^}]*inset: var\(--b\)/);
    // varied border weights
    const weights = new Set([...hero.matchAll(/\.hero__panel--\w+ \{ --b: (\d+)px/g)].map((m) => m[1]));
    expect(weights.size).toBeGreaterThanOrEqual(2);
    for (const w of weights) expect(Number(w)).toBeLessThanOrEqual(3);
    // solid black page: gutters read as black between the panels
    expect(hero).toMatch(/\.hero__manga \{[^}]*background: var\(--ink-belt-black\)/);
  });

  test('one element breaks its frame: the ink cut-out is laid over the panel, outside its clip', () => {
    expect(hero).toMatch(/\.hero__cutout \{[^}]*position: absolute[^}]*left: -6%[^}]*top: -3%/);
    expect(hero).toContain("from '../../assets/fotojmPerfil-ink.png'");
    expect(hero).toMatch(/<figure class="hero__panel hero__panel--portrait"[\s\S]*<div class="hero__cutout">[\s\S]*<Picture /);
  });

  test('focus and speed lines are static repeating-conic-gradients with a mask', () => {
    expect((hero.match(/repeating-conic-gradient/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(hero).toContain('hero__lines--focus');
    expect(hero).toContain('hero__lines--name');
    expect(hero).toMatch(/\.hero__lines--focus \{[^}]*mask-image: radial-gradient/);
    // lines never animate or scrub
    expect(hero).not.toMatch(/\.hero__lines[^{]*\{[^}]*(animation|transition|var\(--p)/);
  });

  test('narration caption box and speech balloon with light 2px borders, all from i18n, no SFX word', () => {
    expect(hero).toMatch(/\.hero__caption \{[^}]*border: 2px solid var\(--ink-belt-black\)/);
    expect(hero).toContain('<p class="hero__caption hero__tagline">{t(\'hero.tagline\')}</p>');
    expect(hero).toMatch(/\.hero__balloon \{[^}]*border-radius: 9999px/);
    expect(hero).toContain('.hero__balloon::before');
    expect(hero).toContain("t('hero.balloon')");
    expect(hero).not.toMatch(/hero\.role|hero\.fig|hero__fig/);
    expect(hero).toMatch(/\.hero__panel--name[^{]*\{[^}]*\}[\s\S]*\.hero__name \{[^}]*font: 800[^}]*text-transform: uppercase/);
    expect(hero).not.toMatch(/sfx/i);
    expect(ui).not.toMatch(/hero\.sfx|¡PUM!|BAM!|POW!/);
  });

  test('portrait is manga ink (pre-processed asset), with no dot screentone and no runtime filter', async () => {
    expect(existsSync(new URL('../src/assets/fotojmPerfil-ink.png', import.meta.url))).toBe(true);
    expect(existsSync(new URL('../scripts/make-ink-portrait.mjs', import.meta.url))).toBe(true);
    expect(hero).not.toContain('hero__tone');
    expect(hero).not.toMatch(/radial-gradient\(rgba\(28, 26, 23/);
    expect(hero).not.toMatch(/(halftone|screentone)[^\n]*(radial-gradient|dot)/i);
    // no radial-gradient may be used as a background-image dot pattern (only as a mask)
    for (const [, line] of hero.matchAll(/^(.*radial-gradient.*)$/gm)) expect(line).toMatch(/mask-image/);
    expect(hero).not.toMatch(/(^|[;{\s])filter\s*:/m);
    expect(hero).not.toContain('filter="');
    expect(hero).not.toContain('backdrop-filter');
    expect(hero).not.toMatch(/@keyframes/);
    // hatching in panel backgrounds is fine
    expect(hero).toContain('repeating-linear-gradient');
  });

  test('panels are scrubbed by --p (own windows) with a smoothstep and a clip-path wipe, not by a timer', () => {
    expect(hero).toContain('calc((var(--p, 0) - var(--s, 0)) / var(--l, 0.1))');
    expect(hero).toContain('--e: calc(var(--i) * var(--i) * (3 - 2 * var(--i)))');
    // clip-path inset wipe, a different side per panel
    expect(hero).toContain('.hero__panel--tagline { clip-path: inset(-15% var(--w) -15% -15%)');
    expect(hero).toContain('.hero__panel--portrait { clip-path: inset(var(--w) -15% -15% -15%)');
    expect(hero).toContain('.hero__panel--balloon { clip-path: inset(-15% -15% -15% var(--w))');
    expect(hero).toContain('html.js .hero__panel--name, html.js .hero__panel--cue { clip-path: inset(-15% -15% var(--w) -15%)');
    // content eases in with opacity and a 20px translateY
    expect(hero).toContain('html.js .hero__in { transform: translateY(calc((1 - var(--e)) * 20px)); opacity: var(--e)');
    expect(hero).toMatch(/html\.js \.hero__panel \{[^}]*opacity: clamp\(0, calc\(var\(--i\) \* 4\), 1\)/);
    // the page itself never scales (the old push-in cropped the edges); only the portrait drifts slower
    expect(hero).not.toMatch(/scale\(/);
    expect(hero).toContain('html.js .hero__cutout { transform: translateY(calc((1 - var(--e)) * 24px + (1 - var(--cam)) * 3%))');
    expect(hero).not.toMatch(/animation\s*:\s*hero-panel|@keyframes|hero-ready|cubic-bezier|var\(--k\)/);
    expect(loader).not.toContain('hero-ready');
    expect(windows().length).toBe(5);
  });

  const windows = () =>
    [...hero.matchAll(/data-panel="([a-z]+)" style="--s: (-?[\d.]+); --l: ([\d.]+)"/g)].map((m) => ({ n: m[1], s: +m[2], l: +m[3], e: +m[2] + +m[3] }));

  // Order chosen by the user (2026-10-03): name < tagline < portrait < balloon < cue, cue last.
  const ORDER = ['name', 'tagline', 'portrait', 'balloon', 'cue'];

  test('p = 0 shows only the black page: every window starts after 0, in order name < tagline < portrait < balloon < cue', () => {
    const w = Object.fromEntries(windows().map((x) => [x.n, x]));
    for (const x of Object.values(w)) {
      expect(x.s).toBeGreaterThan(0);
      expect(Math.min(1, Math.max(0, (0 - x.s) / x.l))).toBe(0);
      // everything has finished entering before the exit wash starts (p = 0.7)
      expect(x.e).toBeLessThanOrEqual(0.7);
    }
    for (let i = 1; i < ORDER.length; i++) expect(w[ORDER[i - 1]].s).toBeLessThan(w[ORDER[i]].s);
  });

  test('the page sits inside a black ground with margins and a max width, never flush to the viewport', () => {
    expect(hero).toMatch(/\.hero__manga \{[^}]*--page-pad: clamp\(16px, 3vw, 48px\)/);
    expect(hero).toMatch(/\.hero__manga \{[^}]*max-width: 1600px[^}]*margin: 0 auto[^}]*padding: var\(--page-pad\)/);
    // no breakpoint overrides the page padding back to a thin value
    expect(hero).not.toMatch(/\.hero__manga \{[^}]*;\s*padding: \d+px/);
    expect(hero).not.toMatch(/html\.js \.hero__manga \{[^}]*padding:/);
  });

  test('speech balloon: "Full Stack · Rosario · Disponible" from i18n in es, en, pt, with the availability dot before the status', () => {
    expect(ui).toContain("'hero.balloon': 'Full Stack · Rosario · Disponible'");
    expect(ui).toContain("'hero.balloon': 'Full Stack · Rosario · Available'");
    expect(ui).toContain("'hero.balloon': 'Full Stack · Rosário · Disponível'");
    expect(ui).not.toMatch(/'hero\.(role|fig)'/);
    // lead on its own, then the status with the green dot just before it
    expect(hero).toContain('<span class="hero__balloon-lead">{balloonLead}</span>');
    expect(hero).toMatch(/<span class="hero__balloon-status">\s*<span class="hero__dot" aria-hidden="true"><\/span>\s*<span>\{balloonStatus\}<\/span>/);
    expect(hero).toMatch(/\.hero__balloon \{[^}]*border: 2px solid var\(--ink-belt-black\)[^}]*border-radius: 9999px/);
    // tail: black triangle plus a paper triangle on top, so the border is continuous
    expect(hero).toMatch(/\.hero__balloon::before \{[^}]*background: var\(--ink-belt-black\)/);
    expect(hero).toMatch(/\.hero__balloon::after \{[^}]*background: var\(--paper\)/);
  });

  test('the hero scene is smoothed (data-ink-smooth) and ink.ts only smooths those scenes', async () => {
    expect(hero).toContain('data-ink-scene data-ink-smooth');
    const ink = await read('../src/scripts/ink.ts');
    expect(ink).toContain("el.hasAttribute('data-ink-smooth')");
    expect(ink).toMatch(/if \(!smooth\) \{\s*write\(self\.progress\);\s*return;\s*\}\s*gsap\.to\(proxy/);
    expect(ink).not.toMatch(/requestAnimationFrame|addEventListener\('scroll'/);
  });

  test('refined: tilt 7px mobile, 12px desktop, hairline hatching', () => {
    expect(hero).toContain('--tilt: 7px;');
    expect(hero).toContain('.hero__panel { --tilt: 12px; }');
    expect(hero).not.toMatch(/--tilt: (1[3-9]|[2-9]\d)px/);
    // hairline hatching: ink inside repeating gradients stays faint (text colours are not hatching)
    for (const [, a] of hero.matchAll(/repeating-[a-z]+-gradient\([^;]*?rgba\(28, 26, 23, ([\d.]+)\)/g)) expect(Number(a)).toBeLessThanOrEqual(0.55);
  });

  test('pinned stage: 450svh desktop, 360svh mobile (room for a slow exit), svh only', () => {
    expect(hero).toContain('html.js .hero { height: 360svh; }');
    expect(hero).toContain('html.js .hero { height: 450svh; }');
    expect(hero).toContain('--exit: clamp(0, calc((var(--p, 0) - 0.7) / 0.3), 1)');
    expect(hero).not.toMatch(/\d(vh|dvh|lvh)/);
  });

  test('no flash, zoom, pull-back or impact keyframes', () => {
    expect(hero).not.toMatch(/@keyframes\s+[\w-]*(flash|zoom|pull|impact|bounce)/i);
    expect(hero).not.toMatch(/hero__flash|hero__pull|hero__zoom|#fff/);
    expect(hero).not.toMatch(/scale\((?:1\.[1-9]|[2-9])/);
  });

  test('reduced motion and no JS: everything visible and static, no pin, B/W kept', () => {
    expect(hero).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.hero__panel \{ opacity: 1; transform: none; animation: none; \}/);
    // every hiding / pinning rule lives under html.js inside the no-preference media query
    const scrub = hero.indexOf('html.js .hero__panel { --i:');
    const noPref = hero.lastIndexOf('@media (prefers-reduced-motion: no-preference)', scrub);
    expect(noPref).toBeGreaterThan(-1);
    expect(hero.slice(noPref, scrub)).not.toContain('@media (prefers-reduced-motion: reduce)');
    expect(hero.slice(0, noPref)).not.toMatch(/opacity: var\(--e\)|clip-path: inset|position: sticky/);
    // the frame, focus lines, caption and balloon are outside any media query, so they hold under reduced motion
    for (const marker of ['.hero__panel::before', '.hero__lines--focus {', '.hero__caption {', '.hero__balloon {']) {
      expect(hero.indexOf(marker)).toBeGreaterThan(-1);
      expect(hero.indexOf(marker)).toBeLessThan(noPref);
    }
  });

  test('exit is a soft wash scrubbed by --p, animating only transform and opacity', () => {
    expect(hero).toContain('.hero__wash');
    expect(hero).toMatch(/\.hero__wash \{[^}]*transform: translateY\(calc\(\(1 - var\(--x\)\) \* 100%\)\)/);
    expect(hero).toContain('opacity: calc(1 - var(--x))');
    expect(hero).toContain('--x: calc(var(--exit) * var(--exit) * (3 - 2 * var(--exit)))');
  });

  test('elements appear one at a time: windows do not overlap', () => {
    const w = Object.fromEntries(windows().map((x) => [x.n, x]));
    // 1e-9 absorbs float noise (0.46 + 0.12 is not exactly 0.58)
    for (let i = 1; i < ORDER.length; i++) expect(w[ORDER[i]].s).toBeGreaterThanOrEqual(w[ORDER[i - 1]].e - 1e-9);
  });
});

describe('no Asian-script text on the landing', () => {
  test('site components and pages carry none', async () => {
    const files = [
      ...(await walk(new URL('../src/components/site/', import.meta.url))),
      ...(await walk(new URL('../src/pages/', import.meta.url))),
    ].filter((u) => /\.(astro|ts)$/.test(u.pathname) && !u.pathname.endsWith('/lab.astro'));
    expect(files.length).toBeGreaterThan(10);
    for (const url of files) expect(ASIAN.test(await readFile(url, 'utf8'))).toBe(false);
  });

  test('the landing does not import the glyph-backdrop piece', async () => {
    const files = (await walk(new URL('../src/components/site/', import.meta.url))).filter((u) => u.pathname.endsWith('.astro'));
    for (const url of files) expect(await readFile(url, 'utf8')).not.toContain('InkGlyphTitle');
  });

  test('seals use Latin content: JMP initials and the principle name', async () => {
    const principles = await read('../src/components/site/PrinciplesSection.astro');
    expect(principles).toContain('seal="JMP"');
    expect(principles).toContain('{item.name}</h3>');
    expect(principles).not.toContain('item.hangul');
    expect(belts).toContain('>JMP</span>');
    expect(belts).not.toMatch(/belts__dan|belts__impact/);
  });

  test('rendered dist pages carry none (when built)', async () => {
    const pages = ['index.html', 'en/index.html', 'pt/index.html'].map((p) => new URL(`../dist/${p}`, import.meta.url));
    for (const url of pages) {
      if (!existsSync(url)) continue;
      expect(ASIAN.test(await readFile(url, 'utf8'))).toBe(false);
    }
  });
});
