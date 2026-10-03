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

describe('hero as a manga page', () => {
  test('at least four panels with data-panel, on a black gutter grid', () => {
    const panels = [...hero.matchAll(/data-panel="([a-z]+)"/g)].map((m) => m[1]);
    expect(panels.length).toBeGreaterThanOrEqual(4);
    expect(panels).toEqual(['name', 'tagline', 'portrait', 'role', 'cue']);
    expect(hero).toContain('gap: 10px');
    expect(hero).toContain('background: var(--ink-belt-black)');
    expect(hero).toContain("t('hero.tagline')");
  });

  test('portrait is B/W via a static filter on the img, with a multiply dot screentone and an ink border', () => {
    expect(hero).toContain('radial-gradient(rgba(28, 26, 23');
    expect(hero).toContain('mix-blend-mode: multiply');
    expect(hero).toMatch(/\.hero__panel--portrait img \{[^}]*filter: grayscale\(1\) contrast\(1\.2\)/);
    expect(hero).toMatch(/\.hero__panel--portrait \{[^}]*border: 2px solid var\(--ink-belt-black\)/);
    expect(hero).not.toContain('filter="');
    // the filter is never inside a keyframe, a transition, or on the transformed panel wrapper
    for (const [, body] of hero.matchAll(/@keyframes\s+[\w-]+\s*\{([\s\S]*?)\n  \}/g)) expect(body).not.toMatch(/filter/);
    expect(hero).not.toMatch(/transition[^;]*filter/);
    expect(hero).not.toMatch(/\.hero__panel(--\w+)? \{[^}]*filter\s*:/);
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
    // the filter is outside any media query, so it also holds under reduced motion
    expect(hero.indexOf('filter: grayscale(1) contrast(1.2)')).toBeLessThan(noPref);
  });

  test('exit is a soft wash scrubbed by --p, animating only transform and opacity', () => {
    expect(hero).toContain('.hero__wash');
    expect(hero).toMatch(/\.hero__wash \{[^}]*transform: translateY\(calc\(\(1 - var\(--exit\)\) \* 100%\)\)/);
    expect(hero).toContain('opacity: calc(1 - var(--exit))');
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
