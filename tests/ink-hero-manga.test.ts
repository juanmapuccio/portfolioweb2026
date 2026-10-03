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

  test('portrait uses a screentone gradient overlay on the real photo, not a filter', () => {
    expect(hero).toContain('radial-gradient(rgba(28, 26, 23');
    expect(hero).not.toMatch(/(^|[;{\s])filter\s*:/m);
    expect(hero).not.toContain('filter="');
  });

  test('entrance is soft: long, eased, small travel, staggered, no bounce, plays after the loader', () => {
    expect(hero).toContain('cubic-bezier(0.22, 1, 0.36, 1)');
    expect(hero).toContain('1.1s');
    expect(hero).toContain('translateY(32px) scale(0.98)');
    expect(hero).toContain('var(--k) * 0.15s');
    expect(hero).toContain('html.js:not(.hero-ready) .hero__panel');
    expect(loader).toContain("classList.add('hero-ready')");
    expect(loader).toMatch(/if \(reduced \|\| !loaders\.some/);
  });

  test('no flash, zoom, pull-back or impact keyframes', () => {
    const keyframes = [...hero.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n  \}/g)];
    expect(keyframes.length).toBeGreaterThan(0);
    for (const [, name, body] of keyframes) {
      expect(name).not.toMatch(/flash|zoom|pull|impact|bounce/i);
      expect(body).not.toMatch(/scale\((?:1\.[1-9]|[2-9])/);
      expect(body).not.toMatch(/filter|background/);
    }
    expect(hero).not.toMatch(/hero__flash|hero__pull|hero__zoom|#fff\b/);
  });

  test('reduced motion: everything visible, no entrance, no wash', () => {
    expect(hero).toContain('@media (prefers-reduced-motion: reduce)');
    expect(hero).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.hero__panel \{ opacity: 1; transform: none; animation: none; \}/);
    const hidden = hero.indexOf('html.js:not(.hero-ready) .hero__panel');
    const noPref = hero.lastIndexOf('@media (prefers-reduced-motion: no-preference)', hidden);
    expect(noPref).toBeGreaterThan(-1);
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
