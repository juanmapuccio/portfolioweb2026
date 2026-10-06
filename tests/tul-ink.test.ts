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
    expect(styleOf(passage)).not.toMatch(/position:\s*(fixed|sticky)/);
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
      '--k', '--s', '--d', 'height', 'color', 'overflow-x', 'display', 'position', 'left', 'top', 'z-index',
      'width', 'translate', 'will-change', 'transform', 'transform-box', 'transform-origin', 'opacity',
      'clip-path', 'stroke-dasharray', 'stroke-dashoffset'
    ]);
    for (const prop of props) expect(allowed.has(prop)).toBe(true);
  });
});
