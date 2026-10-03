import { describe, expect, test } from 'bun:test';
import { readFile, readdir } from 'node:fs/promises';

const dir = new URL('../src/components/ink/', import.meta.url);
const read = (url: URL) => readFile(url, 'utf8');

const entries = await readdir(dir);
const pieces = await Promise.all(
  entries
    .filter((name) => name.endsWith('.astro') && name !== 'InkDefs.astro')
    .map(async (name) => ({ name, text: await read(new URL(name, dir)) })),
);

const labPage = await read(new URL('../src/pages/lab.astro', import.meta.url));
const labCard = await read(new URL('../src/components/lab/LabCard.astro', import.meta.url));
const layout = await read(new URL('../src/layouts/Layout.astro', import.meta.url));

function styleBlocks(text: string): string {
  return [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
}

async function walk(root: URL): Promise<URL[]> {
  const out: URL[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), root);
    if (entry.isDirectory()) out.push(...(await walk(url)));
    else out.push(url);
  }
  return out;
}

// Collects every offending piece so a failure names the file instead of a bare boolean.
function offenders(predicate: (name: string, text: string) => string | null): string[] {
  return pieces.flatMap(({ name, text }) => {
    const problem = predicate(name, text);
    return problem ? [`${name}: ${problem}`] : [];
  });
}

describe('ink pieces', () => {
  test('the lab ports a meaningful set of components', () => {
    expect(pieces.length).toBeGreaterThanOrEqual(20);
  });

  test('every component carries a data-specimen id', () => {
    expect(offenders((_, t) => (/data-specimen="\d+[a-z]"/.test(t) ? null : 'missing data-specimen'))).toEqual([]);
  });

  test('every component has a prefers-reduced-motion rule', () => {
    expect(
      offenders((_, t) => (styleBlocks(t).includes('prefers-reduced-motion') ? null : 'no reduced-motion rule')),
    ).toEqual([]);
  });

  test('no looping animations and no washi in any component', () => {
    expect(offenders((_, t) => (t.includes('infinite') ? 'contains "infinite"' : null))).toEqual([]);
    expect(offenders((_, t) => (t.includes('washi') ? 'contains "washi"' : null))).toEqual([]);
  });

  test('no CSS filter property in component styles', () => {
    expect(offenders((_, t) => (/(^|[\s;{])filter\s*:/.test(styleBlocks(t)) ? 'CSS filter property' : null))).toEqual([]);
  });

  test('SVG filters sit on bare groups, never on classed or styled elements', () => {
    expect(
      offenders((_, t) => {
        const tags = t.match(/<[a-zA-Z][^>]*\sfilter="url\(#[^)]+\)"[^>]*>/g) ?? [];
        const bad = tags.filter((tag) => /\s(class|style|class:list)=/.test(tag) || !/^<g[\s>]/.test(tag));
        return bad.length ? `filter on non-bare element: ${bad[0]}` : null;
      }),
    ).toEqual([]);
  });

  test('only filters defined in InkDefs are referenced', () => {
    const known = ['dryH', 'dryV', 'dryM', 'bleedF', 'wash', 'brushS'];
    expect(
      offenders((_, t) => {
        const unknown = [...t.matchAll(/filter="url\(#(\w+)\)"/g)].map((m) => m[1]).filter((id) => !known.includes(id));
        return unknown.length ? `unknown filter ${unknown[0]}` : null;
      }),
    ).toEqual([]);
  });

  test('keyframes are prefixed ink-', () => {
    expect(
      offenders((_, t) => {
        const bad = [...t.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]).filter((id) => !id.startsWith('ink-'));
        return bad.length ? `keyframes ${bad[0]}` : null;
      }),
    ).toEqual([]);
  });

  test('keyframes animate only transform, opacity, clip-path and stroke-dashoffset', () => {
    const allowed = ['transform', 'opacity', 'clip-path', 'stroke-dashoffset'];
    expect(
      offenders((_, t) => {
        for (const [, body] of t.matchAll(/@keyframes\s+[\w-]+\s*\{([\s\S]*?\})\s*\}/g)) {
          for (const [, prop] of body.matchAll(/([a-z-]+)\s*:/g)) {
            if (!allowed.includes(prop)) return `animates ${prop}`;
          }
        }
        return null;
      }),
    ).toEqual([]);
  });
});

describe('lab page', () => {
  test('is noindex through the Layout prop', () => {
    expect(labPage).toMatch(/<Layout[^>]*\snoindex[\s>]/);
    expect(layout).toContain('<meta name="robots" content="noindex" />');
  });

  test('imports every ink component', () => {
    const missing = pieces.filter(({ name }) => !labPage.includes(`/${name}'`)).map((p) => p.name);
    expect(missing).toEqual([]);
  });

  test('has a Replay button and no scroll listeners or rAF', () => {
    expect(labCard).toContain('data-lab-replay');
    expect(labPage).toContain("classList.remove('is-in')");
    expect(labPage).not.toContain('requestAnimationFrame');
    expect(labPage).not.toMatch(/addEventListener\(\s*['"]scroll/);
  });
});

describe('single engine', () => {
  test('new Lenis and ScrollTrigger.create live only in src/scripts/ink.ts', async () => {
    const files = await walk(new URL('../src/', import.meta.url));
    const sources = files.filter((u) => /\.(ts|astro|js)$/.test(u.pathname));
    const holders = new Set<string>();
    for (const url of sources) {
      const text = await read(url);
      if (text.includes('new Lenis') || text.includes('ScrollTrigger.create')) {
        holders.add(url.pathname.split('/src/')[1]);
      }
    }
    expect([...holders]).toEqual(['scripts/ink.ts']);
  });
});
