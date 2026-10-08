import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const passage = read('src/components/tul/InkPassage.astro');
const titleScript = read('src/scripts/titleReveal.ts');
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

describe('chapter title without an underline', () => {
  test('there is no TitleInk component, no .ti mark and no ink stroke in the chapters', () => {
    expect(existsSync('src/components/tul/TitleInk.astro')).toBe(false);
    expect(existsSync('src/scripts/titleInk.ts')).toBe(false);
    expect(chapter).not.toMatch(/TitleInk|class="ti"|:global\(\.ti\)|data-ink-stroke|\.ti__/);
    expect(chapter.match(/<h2\b/g)?.length).toBe(1);
    expect(chapter).not.toMatch(/tc__slash|bristle|tc__split|tc__half/);
    const files = (readdirSync('src', { recursive: true }) as string[])
      .map((f) => f.replaceAll('\\', '/'))
      .filter((f) => /\.(ts|astro|js|mjs)$/.test(f));
    for (const f of files) expect(read(`src/${f}`)).not.toMatch(/TitleInk|data-ink-stroke|\.ti__/);
  });

  test('the title wrap reserves no room for a mark', () => {
    const wrap = styleOf(chapter).match(/\.tc__titlewrap \{[^}]*\}/)![0];
    expect(wrap).not.toMatch(/padding-bottom|margin-bottom/);
  });

  test('the belt line colour still holds 3:1 on the field it sits on (active row marker)', () => {
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

  test('the reveal splits the real h2 with SplitText, keeps it accessible and reverts it', () => {
    expect(titleScript).toContain("from 'gsap/SplitText'");
    expect(titleScript).toMatch(/SplitText\.create\(heading, \{[^}]*aria: 'auto'/);
    expect(titleScript).toContain('split?.revert()');
    expect(titleScript).not.toMatch(/requestAnimationFrame|lenis|drawSVG|strokes/);
    expect(engine).toContain("import { playTitleReveal } from './titleReveal';");
  });

  test('without JS or with reduced motion the h2 is plain visible markup', () => {
    const css = styleOf(chapter);
    const idx = css.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(idx).toBeGreaterThan(-1);
    const hidden = css.slice(idx);
    expect(hidden).toMatch(/html\.js\) \.tc__titlewrap:not\(\.is-in\) \.tc__title \{\s*opacity: 0/);
    expect(css.slice(0, idx)).not.toMatch(/\.tc__title[^{]*\{[^}]*opacity: 0/);
  });

  test('no hangul in the reveal, the passage or the engine', () => {
    for (const src of [titleScript, passage, engine]) expect(HANGUL.test(src)).toBe(false);
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
