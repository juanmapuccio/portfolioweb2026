import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const chapter = read('src/components/tul/TulChapter.astro');
const principles = read('src/components/tul/Principles.astro');
const engine = read('src/scripts/tul.ts');

const styleOf = (src: string) => src.slice(src.indexOf('<style>'));
/** The CSS blocks added for the entrances, picked by selector. */
const block = (css: string, needle: string): string[] =>
  [...css.matchAll(/[^{}]+\{[^{}]*\}/g)].map((m) => m[0]).filter((b) => b.includes(needle));

describe('chapter title cut', () => {
  test('one real h2, two aria-hidden decorative halves', () => {
    expect(chapter.match(/<h2\b/g)?.length).toBe(1);
    expect(chapter).toMatch(/class="tc__split" aria-hidden="true"/);
    expect(chapter.match(/tc__half tc__half--[tb]/g)?.length).toBe(2);
    expect(chapter).toMatch(/<svg class="tc__slash"[^>]*aria-hidden="true"/);
    expect(chapter).toContain('pathLength="1"');
  });

  test('the halves exist only under html.js with motion allowed; default is the plain h2', () => {
    const css = styleOf(chapter);
    expect(css).toMatch(/\.tc__split \{\s*display: none;/);
    const motion = css.slice(css.indexOf('@media (prefers-reduced-motion: no-preference)'));
    expect(motion).toContain('html.js) .tc__titlewrap .tc__split');
    expect(motion).toContain('animation: tc-half-t 650ms var(--ease-out)');
    expect(motion).toContain('animation: tc-slash 500ms var(--ease-out) 358ms');
  });

  test('new CSS animates only transform, opacity, clip-path and stroke-dashoffset', () => {
    const css = styleOf(chapter);
    const parts = ['tc__titlewrap', 'tc__split', 'tc__half', 'tc__slash', 'tc-half-', 'tc-slash'];
    const text = parts.flatMap((p) => block(css, p)).join('\n');
    expect(text.length).toBeGreaterThan(200);
    expect(text).not.toMatch(/filter:|box-shadow|text-shadow|gradient/);
    const animated = [...css.matchAll(/@keyframes tc-[\s\S]*?\r?\n {2}\}\r?\n/g)].join('\n');
    const props = [...animated.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]);
    expect(new Set(props)).toEqual(new Set(['opacity', 'transform', 'stroke-dashoffset']));
  });
});

describe('principles word by word', () => {
  test('words are split at build time in the component and capped', () => {
    expect(principles).toContain('const MAX_WORDS = 40');
    expect(principles).toMatch(/text\.split\(' '\)/);
    expect(principles).toContain('style={`--i:${i}`}');
    expect(engine).not.toMatch(/\.split\(/);
  });

  test('the tenet name rises as one block, no word split', () => {
    expect(principles).toMatch(/class="pr__name grade-type" data-rise/);
  });

  test('default is fully visible; the dimmed state is only under html.js with motion', () => {
    const css = styleOf(principles);
    const idx = css.indexOf('@media (prefers-reduced-motion: no-preference)');
    expect(idx).toBeGreaterThan(-1);
    expect(css.slice(0, idx)).not.toMatch(/opacity: 0\.12/);
    expect(css.slice(idx)).toContain('html.js) .pr .w');
    expect(css).not.toMatch(/filter:|box-shadow|text-shadow|gradient/);
  });
});

describe('entrance engine', () => {
  test('observes data-split-title, data-words and data-rise, once each', () => {
    expect(engine).toContain("'[data-split-title]'");
    expect(engine).toContain('[data-words]');
    expect(engine).toContain('IntersectionObserver(');
    expect(engine.match(/unobserve\(/g)?.length).toBeGreaterThanOrEqual(2);
    expect(engine).toContain('threshold: 0.4');
  });

  test('no smooth-scroll library, no raw requestAnimationFrame', () => {
    expect(engine).not.toContain('new Lenis');
    expect(engine).not.toContain('requestAnimationFrame');
  });

  test('reduced motion leaves everything visible', () => {
    const fn = engine.slice(engine.indexOf('function initEntrances'));
    const branch = fn.slice(fn.indexOf('if (reduced'), fn.indexOf('const titleObserver'));
    expect(branch).toContain('finish(el)');
    expect(branch).toContain("classList.add('is-in')");
    expect(branch).toContain('return;');
  });
});
