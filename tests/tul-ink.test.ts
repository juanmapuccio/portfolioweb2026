import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const passage = read('src/components/tul/InkPassage.astro');
const styleOf = (src: string) => src.slice(src.indexOf('<style>'));

const ASSETS = ['rule', 'drop', 'dry', 'drip', 'enso', 'vertical'];
const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;

describe('ink kit', () => {
  test('every brush asset exists, is a lightweight svg and takes its colour from the page', () => {
    for (const name of ASSETS) {
      const path = `src/assets/brush/${name}.svg`;
      expect(existsSync(path)).toBe(true);
      const svg = read(path);
      expect(svg).toMatch(/^<svg /);
      expect(svg.length).toBeLessThan(2500);
      expect(svg).toContain('currentColor');
      expect(svg).toContain('aria-hidden="true"');
    }
  });

  test('no hangul in the assets, the component or the engine', () => {
    for (const src of [...ASSETS.map((n) => read(`src/assets/brush/${n}.svg`)), passage, read('src/scripts/tul.ts')]) {
      expect(HANGUL.test(src)).toBe(false);
    }
  });

  test('InkPassage is decorative, in flow, with one piece per arriving belt', () => {
    expect(passage).toMatch(/aria-hidden="true"/);
    expect(passage).toContain('data-tul-passage');
    for (const piece of ['drop', 'dry', 'drip', 'enso', 'vertical']) expect(passage).toContain(`name: '${piece}'`);
    expect(passage).not.toMatch(/<p\b|<h[1-6]\b|<span\b/);
    // The passage box is in flow; only its ink layer is a viewport overlay.
    expect(styleOf(passage)).not.toMatch(/\.ink \{[^}]*position:\s*(fixed|sticky|absolute)/);
  });
});

describe('ink passage fallback and motion', () => {
  const css = styleOf(passage);
  const motion = css.slice(css.indexOf('@media (prefers-reduced-motion: no-preference)'), css.indexOf('/* Mobile:'));
  const base = css.slice(0, css.indexOf('@media (prefers-reduced-motion: no-preference)'));

  test('default (no JS, reduced motion) is a static 8rem brush divider that covers nothing', () => {
    expect(base).toMatch(/\.ink \{[^}]*height: 8rem/);
    expect(base).toMatch(/\.ink__art \{\s*display: none;/);
    expect(base).not.toMatch(/\.ink__rule \{[^}]*display: none/);
  });

  test('the immersive passage exists only under html.js with motion allowed', () => {
    expect(motion).toMatch(/html\.js\) \.ink \{[^}]*height: 60svh/);
    expect(motion).toMatch(/html\.js\) \.ink__art \{[^}]*display: block/);
    expect(motion).toMatch(/html\.js\) \.ink__rule \{\s*display: none/);
    // The ink layer is invisible at both ends of the crossing (k = 0), so it never lingers over a chapter.
    expect(motion).toMatch(/html\.js\) \.ink__art \{[^}]*opacity: clamp\(0, calc\(var\(--k\) \* 30\), 1\)/);
  });

  test('mobile is 40svh and drops the displacement filters', () => {
    expect(css).toMatch(/max-width: 47\.99rem\) and \(prefers-reduced-motion: no-preference\) \{[^@]*height: 40svh/);
    expect(css).toMatch(/max-width: 47\.99rem\) \{[^@]*\[filter\]\) \{\s*filter: none/);
  });

  test('ink recedes: every piece is driven by a 0 to 1 to 0 curve and nothing animates filters', () => {
    expect(motion).toMatch(/--k: min\(calc\(var\(--p, 0\) \* 2\), calc\(\(1 - var\(--p, 0\)\) \* 2\)\)/);
    expect(motion).not.toMatch(/filter:|box-shadow|gradient|transition|animation/);
    const props = [...motion.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]);
    const allowed = new Set([
      '--k', '--s', '--d', 'height', 'color', 'display', 'position', 'inset', 'z-index',
      'transform', 'transform-box', 'transform-origin', 'opacity',
      'clip-path', 'stroke-dasharray', 'stroke-dashoffset'
    ]);
    for (const prop of props) expect(allowed.has(prop)).toBe(true);
  });
});

describe('ink passages between chapters', () => {
  const BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'];

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
    const engine = read('src/scripts/tul.ts');
    const fn = engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'));
    expect(fn).toContain('[data-tul-passage]');
    expect(fn).toMatch(/if \(reduced\) return;/);
    expect(fn).toContain('scrollTrigger');
    expect(fn).not.toMatch(/requestAnimationFrame|lenis/i);
    expect(engine).toMatch(/initScrubs\(\);\s*initPassages\(\);/);
  });
});

describe('brush detail on white', () => {
  const chapter = read('src/components/tul/TulChapter.astro');
  const mark = read('src/components/tul/BeltMark.astro');
  const diagram = read('src/components/tul/FloorDiagram.astro');

  test('title cut is a dry brush stroke: the drawn line sits under a static bristle mask', () => {
    expect(chapter).toMatch(/<mask id=\{`\$\{beltKey\}-bristle`\}/);
    expect(chapter).toMatch(/<line [^>]*mask=\{`url\(#\$\{beltKey\}-bristle\)`\}/);
    expect(chapter).toMatch(/\.tc__slash line \{\s*stroke: var\(--belt-line\);\s*stroke-width: 6;/);
    expect(chapter).not.toMatch(/\.tc__slash[^{]*\{[^}]*filter:/);
  });

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
