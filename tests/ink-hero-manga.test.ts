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
    expect(panels).toEqual(['name', 'tagline', 'portrait', 'role', 'cue']);
    expect(hero).toContain("t('hero.tagline')");
  });

  test('irregular panels: clip-path polygons with slanted edges, black frames of varied weight', () => {
    // every panel has its own polygon, the frame is a black ::before plus a paper ::after inset by --b
    const clips = [...hero.matchAll(/\.hero__panel--(name|tagline|portrait|role|cue) \{[^}]*--clip: polygon\(([^;]+)\);/g)];
    expect(new Set(clips.map((m) => m[1]))).toEqual(new Set(['name', 'tagline', 'portrait', 'role', 'cue']));
    // slanted: at least one polygon vertex off the rectangle (a calc() offset or a non-0/100% y on a side)
    expect(hero).toMatch(/--clip: polygon\([^;]*calc\(100% - var\(--tilt\)\)/);
    expect(hero).toMatch(/\.hero__panel::before \{[^}]*background: var\(--ink-belt-black\)/);
    expect(hero).toMatch(/\.hero__panel::after \{[^}]*inset: var\(--b\)/);
    // varied border weights
    const weights = new Set([...hero.matchAll(/\.hero__panel--\w+ \{ --b: (\d+)px/g)].map((m) => m[1]));
    expect(weights.size).toBeGreaterThanOrEqual(3);
    // paper gutters, black page frame
    expect(hero).toMatch(/\.hero__manga \{[^}]*background: var\(--paper\)[^}]*inset 0 0 0 3px var\(--ink-belt-black\)/);
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

  test('narration caption box, speech balloon and SFX word, all from i18n', () => {
    expect(hero).toMatch(/\.hero__caption \{[^}]*border: 3px solid var\(--ink-belt-black\)/);
    expect(hero).toContain('<p class="hero__caption hero__tagline">{t(\'hero.tagline\')}</p>');
    expect(hero).toMatch(/\.hero__balloon \{[^}]*border-radius: 50%/);
    expect(hero).toContain('.hero__balloon::before');
    expect(hero).toContain("t('hero.role')");
    expect(hero).toMatch(/\.hero__panel--name[^{]*\{[^}]*\}[\s\S]*\.hero__name \{[^}]*font: 800[^}]*text-transform: uppercase/);
    expect(hero).toContain('<span class="hero__sfx" aria-hidden="true">{t(\'hero.sfx\')}</span>');
    // the SFX words are Latin letters
    for (const w of ['¡PUM!', 'BAM!', 'POW!']) expect(ui).toContain(`'hero.sfx': '${w}'`);
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

  test('panels are scrubbed by --p (own windows), not by a timer', () => {
    expect(hero).toContain('calc((var(--p, 0) - var(--s, 0)) / var(--l, 0.1))');
    expect(hero).toContain('translateY(calc((1 - var(--i)) * 32px)) scale(calc(0.98 + var(--i) * 0.02))');
    expect(hero).toMatch(/html\.js \.hero__panel \{[^}]*opacity: var\(--i\)/);
    expect(hero).not.toMatch(/animation\s*:\s*hero-panel|@keyframes|hero-ready|cubic-bezier|var\(--k\)/);
    expect(loader).not.toContain('hero-ready');
    const windows = [...hero.matchAll(/data-panel="([a-z]+)" style="--s: (-?[\d.]+); --l: ([\d.]+)"/g)].map((m) => ({ n: m[1], s: +m[2], l: +m[3] }));
    expect(windows.length).toBe(5);
    for (const w of windows) expect(w.s + w.l).toBeLessThanOrEqual(0.6);
    // name and cue are complete at p = 0: the first screen is never empty and the cue is visible
    for (const n of ['name', 'cue']) {
      const w = windows.find((x) => x.n === n)!;
      expect(Math.min(1, Math.max(0, (0 - w.s) / w.l))).toBe(1);
    }
    // the others start hidden and appear in order
    const [, tagline, portrait, role] = windows;
    expect(tagline.s).toBeGreaterThan(0);
    expect(tagline.s).toBeLessThan(portrait.s);
    expect(portrait.s).toBeLessThan(role.s);
  });

  test('pinned stage: 300svh desktop, 250svh mobile, svh only', () => {
    expect(hero).toContain('html.js .hero { height: 250svh; }');
    expect(hero).toContain('html.js .hero { height: 300svh; }');
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
    const scrub = hero.indexOf('html.js .hero__panel { --i');
    const noPref = hero.lastIndexOf('@media (prefers-reduced-motion: no-preference)', scrub);
    expect(noPref).toBeGreaterThan(-1);
    expect(hero.slice(noPref, scrub)).not.toContain('@media (prefers-reduced-motion: reduce)');
    expect(hero.slice(0, noPref)).not.toMatch(/opacity: var\(--i\)|position: sticky/);
    // the frame, focus lines, caption and balloon are outside any media query, so they hold under reduced motion
    for (const marker of ['.hero__panel::before', '.hero__lines--focus {', '.hero__caption {', '.hero__balloon {']) {
      expect(hero.indexOf(marker)).toBeGreaterThan(-1);
      expect(hero.indexOf(marker)).toBeLessThan(noPref);
    }
  });

  test('exit is a soft wash scrubbed by --p, animating only transform and opacity', () => {
    expect(hero).toContain('.hero__wash');
    expect(hero).toMatch(/\.hero__wash \{[^}]*transform: translateY\(calc\(\(1 - var\(--exit\)\) \* 100%\)\)/);
    expect(hero).toContain('opacity: calc(1 - var(--exit))');
  });

  test('scrolled panels appear one at a time: windows do not overlap', () => {
    const windows = ['tagline', 'portrait', 'role'].map((name) => {
      const m = hero.match(new RegExp(`data-panel="${name}" style="--s: ([\\d.]+); --l: ([\\d.]+)"`));
      expect(m).not.toBeNull();
      return { start: Number(m![1]), end: Number(m![1]) + Number(m![2]) };
    });
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i].start).toBeGreaterThanOrEqual(windows[i - 1].end);
    }
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
