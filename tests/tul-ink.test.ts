import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const passage = read('src/components/tul/InkPassage.astro');
const titleInk = read('src/components/tul/TitleInk.astro');
const titleScript = read('src/scripts/titleInk.ts');
const engine = read('src/scripts/tul.ts');
const chapter = read('src/components/tul/TulChapter.astro');
const styleOf = (src: string) => src.slice(src.indexOf('<style>'));

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;
const BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'];

describe('GSAP plugins', () => {
  test('SplitText, DrawSVG and MorphSVG come from the installed gsap package and are registered once', () => {
    for (const name of ['SplitText', 'DrawSVGPlugin', 'MorphSVGPlugin']) {
      expect(engine).toContain(`import { ${name} } from 'gsap/${name}';`);
    }
    expect(engine).toMatch(/gsap\.registerPlugin\(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin\);/);
    expect(engine.match(/registerPlugin\(/g)?.length).toBe(1);
    // gsap 3.13+ ships these free; nothing else (no private registry, no CDN) is involved.
    const pkg = JSON.parse(read('package.json')) as { dependencies: Record<string, string> };
    expect(pkg.dependencies.gsap).toMatch(/^\^3\.(1[3-9]|[2-9]\d)/);
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
    expect(engine).toMatch(/initScrubs\(\);\s*initPassages\(\);/);
  });
});

describe('title ink', () => {
  test('one mark per belt, decorative, with its own piece', () => {
    expect(titleInk).toMatch(/aria-hidden="true"/g);
    for (const kind of ['dry', 'drop', 'brush', 'drip', 'enso', 'vertical']) {
      expect(titleInk).toMatch(new RegExp(`data-ink=(\\{[^}]*'${kind}'|"${kind}")`));
    }
    for (const belt of ['blanco', 'verde', 'amarillo', 'azul', 'rojo']) expect(titleInk).toContain(`'${belt}'`);
    expect(titleInk).not.toMatch(/<text\b|<title\b|<p\b|<h[1-6]\b/);
  });

  test('the strokes are drawn by DrawSVG hooks and the splat morphs from a thin shape', () => {
    expect(titleInk).toContain('data-ink-stroke');
    expect(titleInk).toContain('data-ink-morph');
    expect(titleInk).toMatch(/data-from=\{SPLAT_THIN\}/);
    expect(titleInk).toContain('data-ink-dot');
    expect(titleScript).toMatch(/drawSVG: '0%'/);
    expect(titleScript).toMatch(/morphSVG:/);
  });

  test('the colour is the belt line and no filter or gradient paints the mark', () => {
    expect(titleInk).toMatch(/\.ti \{[^}]*color: var\(--belt-line\)/);
    expect(styleOf(titleInk)).not.toMatch(/filter:|box-shadow|gradient|mix-blend-mode/);
    expect(titleInk).not.toMatch(/<filter\b|feTurbulence/);
  });

  test('the chapter mounts it in the title wrap and the old bristle line is gone', () => {
    expect(chapter).toContain("import TitleInk from './TitleInk.astro'");
    expect(chapter).toContain('<TitleInk beltKey={beltKey} />');
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
  const diagram = read('src/components/tul/FloorDiagram.astro');

  test('chapter seal gets an ink ensō behind the belt, drawn with the same entrance and hidden from the header mark', () => {
    expect(mark).toMatch(/animate && !mini && <path class="bm__e"/);
    expect(mark.indexOf('bm__e"')).toBeLessThan(mark.indexOf('class="bm__part"'));
    expect(mark).toMatch(/\.bm__e \{[^}]*stroke: var\(--ink\)/);
  });

  test('route stroke is brush-textured by a static mask and keeps the --draw logic', () => {
    expect(diagram).toMatch(/<path class="fd-line" d=\{d\} pathLength="1" mask=/);
    expect(diagram).toMatch(/<pattern id=/);
    expect(diagram).toMatch(/stroke-dashoffset: calc\(1 - var\(--draw, 1\)\)/);
  });
});
