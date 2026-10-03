import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';

const read = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

const tokens = await read('../src/styles/tokens.css');
const globalCss = await read('../src/styles/global.css');
const inkDefs = await read('../src/components/ink/InkDefs.astro');
const inkCss = await read('../src/styles/ink/ink.css');
const inkTs = await read('../src/scripts/ink.ts');
const layout = await read('../src/layouts/Layout.astro');

async function walk(dir: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), dir);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

async function filesUnder(path: string): Promise<{ path: string; text: string }[]> {
  const files = await walk(new URL(path, import.meta.url));
  return Promise.all(files.map(async (u) => ({ path: u.pathname, text: await readFile(u, 'utf8') })));
}

describe('ink tokens', () => {
  test('Layout imports tokens and ink css before global.css, without nested @import', () => {
    // Nested relative @import broke the Vite dev server on Windows (resolved
    // against the project root), so the three sheets are imported from Layout.
    const tokensAt = layout.indexOf("import '../styles/tokens.css';");
    const inkAt = layout.indexOf("import '../styles/ink/ink.css';");
    const globalAt = layout.indexOf("import '../styles/global.css';");
    expect(tokensAt).toBeGreaterThan(-1);
    expect(inkAt).toBeGreaterThan(tokensAt);
    expect(globalAt).toBeGreaterThan(inkAt);
    expect(globalCss).not.toContain('@import');
    expect(globalCss).not.toContain(':root {');
  });

  test('hex belt set and oklch ink belt set are both defined', () => {
    for (const c of ['white', 'yellow', 'green', 'blue', 'red', 'black']) {
      expect(tokens).toContain(`--belt-${c}: #`);
      expect(tokens).toContain(`--ink-belt-${c}:`);
    }
    expect(tokens).toContain('--ink-belt-yellow: oklch(');
  });

  test('seal, ok and paper tokens exist; obsolete circle token is gone', () => {
    expect(tokens).toContain('--seal-red: #b91c1c');
    expect(tokens).toContain('--ok-green: #047857');
    expect(tokens).toContain('--paper: #f4efe4');
    expect(tokens).not.toContain('--black-circle-max-radius');
  });
});

describe('ink defs', () => {
  test('defines the six filters once and no washi', () => {
    for (const id of ['dryH', 'dryV', 'dryM', 'bleedF', 'wash', 'brushS']) {
      expect(inkDefs.split(`id="${id}"`)).toHaveLength(2);
    }
    expect(inkDefs).not.toContain('id="washi"');
  });

  test('is rendered once in Layout', () => {
    expect(layout.split('<InkDefs />')).toHaveLength(2);
  });
});

describe('ink css', () => {
  test('has the five keyframes and the reduced-motion block', () => {
    for (const k of ['ink-draw', 'ink-rise', 'ink-fade', 'ink-stamp', 'ink-unroll']) {
      expect(inkCss).toContain(`@keyframes ${k}`);
    }
    expect(inkCss).toContain('@media (prefers-reduced-motion: reduce)');
  });

  test('declares no filter property', () => {
    expect(inkCss).not.toMatch(/filter\s*:/);
  });
});

describe('single engine', () => {
  test('ink.ts is the only file in src with new Lenis and ScrollTrigger.create', async () => {
    const files = await filesUnder('../src/');
    const withLenis = files.filter((f) => f.text.includes('new Lenis')).map((f) => f.path);
    const withTrigger = files.filter((f) => f.text.includes('ScrollTrigger.create')).map((f) => f.path);
    expect(withLenis).toHaveLength(1);
    expect(withTrigger).toHaveLength(1);
    expect(withLenis[0].endsWith('/src/scripts/ink.ts')).toBe(true);
    expect(withTrigger[0].endsWith('/src/scripts/ink.ts')).toBe(true);
  });

  test('no requestAnimationFrame in layouts, ink components or styles', async () => {
    for (const dir of ['../src/layouts/', '../src/components/ink/', '../src/styles/']) {
      for (const f of await filesUnder(dir)) {
        expect(f.text.includes('requestAnimationFrame')).toBe(false);
      }
    }
  });

  test('ink.ts honors prefers-reduced-motion and is loaded by Layout', () => {
    expect(inkTs).toContain('prefers-reduced-motion');
    expect(layout).toContain("import '../scripts/ink';");
  });
});
