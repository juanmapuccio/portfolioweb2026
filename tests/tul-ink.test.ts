import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const passage = read('src/components/tul/InkPassage.astro');
const titleInk = read('src/components/tul/TitleInk.astro');
const titleScript = read('src/scripts/titleInk.ts');
const engine = read('src/scripts/tul.ts');
const chapter = read('src/components/tul/TulChapter.astro');
const tokens = read('src/styles/tul/tokens.css');
const styleOf = (src: string) => src.slice(src.indexOf('<style>'));

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;
const BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'];

function declarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[decl[1]] = decl[2].trim();
  return out;
}

const rootTokens = (): Record<string, string> => declarations(tokens.match(/:root\s*\{([^}]*)\}/)![1]);

/** `--belt-line` of one belt, with a `var(--other)` followed through the root block. */
function beltLine(key: string): string {
  const block = tokens.match(new RegExp(String.raw`\[data-belt="${key}"\]\s*\{([^}]*)\}`));
  if (!block) throw new Error(`missing belt block for ${key}`);
  const value = declarations(block[1])['belt-line'];
  const ref = value.match(/^var\(--([\w-]+)\)$/);
  return ref ? rootTokens()[ref[1]] : value;
}

function luminance(hex: string): number {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) throw new Error(`token is not a 6-digit hex: ${hex}`);
  const n = parseInt(m[1], 16);
  const channel = (v: number): number => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('GSAP plugins', () => {
  test('SplitText and DrawSVG come from the installed gsap package and are registered once', () => {
    for (const name of ['SplitText', 'DrawSVGPlugin']) {
      expect(engine).toContain(`import { ${name} } from 'gsap/${name}';`);
    }
    expect(engine).toMatch(/gsap\.registerPlugin\(ScrollTrigger, SplitText, DrawSVGPlugin\);/);
    expect(engine.match(/registerPlugin\(/g)?.length).toBe(1);
    // gsap 3.13+ ships these free; nothing else (no private registry, no CDN) is involved.
    const pkg = JSON.parse(read('package.json')) as { dependencies: Record<string, string> };
    expect(pkg.dependencies.gsap).toMatch(/^\^3\.(1[3-9]|[2-9]\d)/);
  });

  test('MorphSVG is not imported, registered or used anywhere in src (no morphing underline is left)', () => {
    const files = (readdirSync('src', { recursive: true }) as string[])
      .map((f) => f.replaceAll('\\', '/'))
      .filter((f) => /\.(ts|astro|js|mjs)$/.test(f));
    expect(files.length).toBeGreaterThan(20);
    for (const f of files) expect(read(`src/${f}`)).not.toMatch(/MorphSVG|morphSVG/);
  });
});

describe('InkPassage is a spacer', () => {
  test('decorative, in flow, with no fixed ink layer and no brush art', () => {
    expect(passage).toMatch(/aria-hidden="true"/);
    expect(passage).toContain('data-tul-passage');
    expect(passage).not.toMatch(/ink__art|\.svg\?raw|assets\/brush/);
    expect(passage).not.toMatch(/<p\b|<h[1-6]\b|<span\b/);
    // The passage box itself stays in flow; only the flood layer (tul-flood.test.ts) is a viewport overlay.
    expect(styleOf(passage)).not.toMatch(/\.ink \{[^}]*position:\s*(fixed|sticky|absolute)/);
  });

  test('about 50svh on desktop, smaller on mobile, a static 12rem gap without JS or with reduced motion', () => {
    const css = styleOf(passage);
    expect(css).toMatch(/\.ink \{[^}]*--ink-h: 12rem/);
    expect(css).toMatch(/prefers-reduced-motion: no-preference\) \{\s*:global\(html\.js\) \.ink \{\s*--ink-h: 50svh/);
    expect(css).toMatch(/max-width: 47\.99rem\) and \(prefers-reduced-motion: no-preference\) \{\s*:global\(html\.js\) \.ink \{\s*--ink-h: 40svh/);
  });

  test('no shadows, gradients or blend modes in the spacer (the flood has its own tests)', () => {
    expect(styleOf(passage).replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/box-shadow|gradient|mix-blend-mode/);
  });
});

describe('ink passages between chapters', () => {
  for (const [lang, file] of [['es', 'src/pages/index.astro'], ['en', 'src/pages/en/index.astro'], ['pt', 'src/pages/pt/index.astro']]) {
    test(`${lang}: one passage between every pair of belt chapters, in order`, () => {
      const page = read(file);
      const order = [...page.matchAll(/<TulChapter lang="\w+" beltKey="(\w+)" \/>|<InkPassage from="(\w+)" to="(\w+)" \/>/g)].map((m) =>
        m[1] ? m[1] : `${m[2]}>${m[3]}`
      );
      const expected = BELTS.flatMap((belt, i) => (i === 0 ? [belt] : [`${BELTS[i - 1]}>${belt}`, belt]));
      expect(order).toEqual(expected);
    });
  }

  test('the engine scrubs passages with ScrollTrigger only and skips them with reduced motion', () => {
    const fn = engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'));
    expect(fn).toContain('[data-tul-passage]');
    expect(fn).toMatch(/if \(reduced\) return;/);
    expect(fn).toContain('scrollTrigger');
    expect(fn).not.toMatch(/requestAnimationFrame|lenis/i);
    expect(engine).toMatch(/initBeats\(\);\s*initPassages\(\);/);
  });
});

describe('title ink', () => {
  /** The four bristle streaks of the brush: path data and stroke width, as authored in TitleInk.astro. */
  const streaks = [...titleInk.matchAll(/\{ d: '([^']+)', w: ([\d.]+) \}/g)].map((m) => ({ d: m[1], w: Number(m[2]) }));

  test('one decorative dry-brush shape for every belt: no variant, no per-belt branch', () => {
    // A single svg, with no props and no condition on the belt: the chapter template mounts it six times.
    expect(titleInk.match(/<svg\b/g)?.length).toBe(1);
    expect(titleInk).toMatch(/<svg class="ti" data-ink="dry" viewBox="0 0 600 48" aria-hidden="true"/);
    expect(titleInk).not.toMatch(/interface Props|Astro\.props|beltKey/);
    for (const gone of ['drop', 'brush', 'drip', 'enso', 'vertical']) {
      expect(titleInk).not.toContain(`data-ink="${gone}"`);
      expect(titleInk).not.toContain(`ti--${gone}`);
    }
    expect(titleInk).not.toMatch(/data-ink-morph|data-ink-dot|SPLAT|SPATTER|DRIPS|<circle\b|ti__f|ti--h\b/);
    expect(titleInk).not.toMatch(/<text\b|<title\b|<p\b|<h[1-6]\b/);
  });

  test('the brush is variable width with bristle streaks that all run left to right', () => {
    expect(streaks.length).toBeGreaterThanOrEqual(4);
    const widths = streaks.map((s) => s.w);
    expect(new Set(widths).size).toBe(widths.length);
    expect(widths).toEqual([...widths].sort((a, b) => b - a));
    for (const s of streaks) {
      const xs = [...s.d.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map((m) => Number(m[1]));
      expect(xs.length).toBeGreaterThan(2);
      expect(xs[xs.length - 1]).toBeGreaterThan(xs[0]);
      // Stays inside the 600 wide view box, so the mark never leaves the title column.
      for (const x of xs) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(600);
      }
    }
  });

  test('DrawSVG lays the streaks down; nothing morphs and no dot or splat is animated', () => {
    expect(titleInk).toContain('data-ink-stroke');
    expect(titleScript).toMatch(/drawSVG: '0%'/);
    expect(titleScript).toMatch(/drawSVG: '100%'/);
    expect(titleScript).not.toMatch(/morphSVG|data-ink-morph|data-ink-dot|dots|scale:/);
    // gsap.set is only called with the streaks (never with an empty target list, which warns "target not found").
    for (const call of titleScript.matchAll(/gsap\.set\(([^,]+),/g)) expect(call[1]).toBe('strokes');
    expect(titleScript).toMatch(/if \(strokes\.length\) gsap\.set\(strokes/);
  });

  test('the colour is the belt line of the chapter; the mark carries no colour of its own', () => {
    expect(titleInk).toMatch(/\.ti \{[^}]*color: var\(--belt-line\)/);
    expect(titleInk).toMatch(/\.ti__s \{[^}]*stroke: currentColor/);
    expect(titleInk).not.toMatch(/#[0-9a-f]{3,8}\b|rgb\(|hsl\(|(stroke|fill)="(?!none)/i);
    expect(styleOf(titleInk)).not.toMatch(/filter:|box-shadow|gradient|mix-blend-mode/);
    expect(titleInk).not.toMatch(/<filter\b|feTurbulence/);
  });

  test('the stroke is a different colour per belt and holds 3:1 on the field it sits on', () => {
    const root = rootTokens();
    const lines = BELTS.map((key) => beltLine(key));
    // Six belts, six colours, all resolved from tokens.css.
    expect(new Set(lines.map((l) => l.toLowerCase())).size).toBe(BELTS.length);
    for (const [i, key] of BELTS.entries()) {
      // White field for blanco to rojo; the black chapter always sits on the dark field.
      const field = key === 'negro' ? root['field-dark'] : root.field;
      expect(contrast(lines[i], field)).toBeGreaterThanOrEqual(3);
    }
    expect(beltLine('negro')).toBe(root['line-dark']);
    // Once the flood has turned the page dark, every line resolves to the light one and still holds.
    const dark = declarations(tokens.match(/\[data-field="dark"\]\s*\{([^}]*)\}/)![1]);
    expect(contrast(root[dark['belt-line'].match(/var\(--([\w-]+)\)/)![1]], root['field-dark'])).toBeGreaterThanOrEqual(3);
  });

  test('the chapter mounts it once in the title wrap, for all six belts, and the old bristle line is gone', () => {
    expect(chapter).toContain("import TitleInk from './TitleInk.astro'");
    expect(chapter.match(/<TitleInk\b/g)?.length).toBe(1);
    expect(chapter).toContain('<TitleInk />');
    expect(chapter).not.toMatch(/tc__slash|bristle|tc__split|tc__half/);
    expect(chapter.match(/<h2\b/g)?.length).toBe(1);
  });

  test('the entrance splits the real h2 with SplitText, keeps it accessible and reverts it', () => {
    expect(titleScript).toContain("from 'gsap/SplitText'");
    expect(titleScript).toMatch(/SplitText\.create\(heading, \{[^}]*aria: 'auto'/);
    expect(titleScript).toContain('split?.revert()');
    expect(titleScript).not.toMatch(/requestAnimationFrame|lenis/i);
  });

  test('without JS or with reduced motion the h2 and the mark are plain visible markup', () => {
    const css = styleOf(chapter);
    const idx = css.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(idx).toBeGreaterThan(-1);
    const hidden = css.slice(idx);
    expect(hidden).toMatch(/html\.js\) \.tc__titlewrap:not\(\.is-in\) \.tc__title \{\s*opacity: 0/);
    expect(hidden).toMatch(/html\.js\) \.tc__titlewrap:not\(\.is-in\) :global\(\.ti\) \{\s*visibility: hidden/);
    expect(css.slice(0, idx)).not.toMatch(/\.tc__title[^{]*\{[^}]*opacity: 0/);
  });

  test('no hangul in the mark, the entrance or the engine', () => {
    for (const src of [titleInk, titleScript, passage, engine]) expect(HANGUL.test(src)).toBe(false);
  });
});

describe('brush detail on white', () => {
  const mark = read('src/components/tul/BeltMark.astro');
  const diagram = read('src/components/tul/TatamiIso.astro');

  test('chapter seal gets an ink ensō behind the belt, drawn with the same entrance and hidden from the header mark', () => {
    expect(mark).toMatch(/animate && !mini && <path class="bm__e"/);
    expect(mark.indexOf('bm__e"')).toBeLessThan(mark.indexOf('class="bm__part"'));
    expect(mark).toMatch(/\.bm__e \{[^}]*stroke: var\(--ink\)/);
  });

  test('route stroke is brush-textured by a static mask and keeps the --draw logic', () => {
    expect(diagram).toMatch(/<path class="tiso-line" d=\{model\.route\} pathLength="1" mask=/);
    expect(diagram).toMatch(/<pattern id=/);
    expect(diagram).toMatch(/stroke-dashoffset: calc\(1 - var\(--draw, 1\)\)/);
  });
});
