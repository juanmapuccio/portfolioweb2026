import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const passage = read('src/components/tul/InkPassage.astro');
const engine = read('src/scripts/tul.ts');
const css = passage.slice(passage.indexOf('<style>'));
const markup = passage.slice(0, passage.indexOf('<style>'));
const motion = css.slice(css.indexOf('@media (prefers-reduced-motion: no-preference)'), css.indexOf('@media (max-width: 47.99rem)'));

describe('black flood at 1st dan', () => {
  test('only the passage that arrives at negro carries the flood', () => {
    expect(markup).toContain("const floods = to === 'negro';");
    expect(markup.match(/floods && \(/g)?.length).toBe(2);
    expect(markup).toContain('data-ink-flood');
  });

  test('the flood is hidden by default (no JS, reduced motion) and exists only under html.js with motion', () => {
    const base = css.slice(0, css.indexOf('@media (prefers-reduced-motion: no-preference)'));
    expect(base).toMatch(/\.ink__flood \{\s*display: none;/);
    expect(motion).toMatch(/html\.js\) \.ink__flood \{[^}]*display: block/);
  });

  test('the fill is a clip-path circle that grows with --p from the knot', () => {
    expect(motion).toMatch(/--f: clamp\(0, calc\(\(var\(--p, 0\) - 0\.2\) \/ 0\.3\), 1\)/);
    expect(motion).toMatch(/clip-path: circle\(calc\(var\(--f\) \* var\(--f\) \* 150vmax\) at calc\(var\(--cx\) \+ 3rem\) calc\(var\(--cy\) \+ 3rem\)\)/);
    expect(motion).toMatch(/background-color: var\(--field-dark\)/);
  });

  test('the centre is the published 3D knot, else the drawn knot of the spacer (mobile)', () => {
    expect(motion).toMatch(/--cx: var\(--knot-x, calc\(100vw \* var\(--knot-fx\)\)\)/);
    expect(motion).toMatch(/--knot-y,\s*calc\(100svh \+ var\(--ink-h\) \* var\(--knot-fy\) - var\(--p, 0\) \* \(100svh \+ var\(--ink-h\)\)\)/);
    expect(css).toMatch(/--knot-fx: 0\.5;/);
    expect(css).toMatch(/--knot-fy: 0\.5;/);
  });

  test('it sits above the chapters and below the header, covers the view at p = 0.5 and then goes away', () => {
    expect(motion).toMatch(/position: fixed;/);
    expect(motion).toMatch(/z-index: 10;/);
    expect(read('src/components/tul/TulHeader.astro')).toMatch(/\.tul-header \{[^}]*z-index: 50/);
    expect(motion).toMatch(/opacity: clamp\(0, calc\(\(0\.5 - var\(--p, 0\)\) \* 1000 \+ 1\), 1\)/);
  });

  test('the ink edge is a static feTurbulence displacement, desktop only, and never a blend mode', () => {
    expect(markup).toMatch(/<feTurbulence[^>]*>/);
    expect(markup).toMatch(/<feDisplacementMap[^>]*>/);
    expect(markup).not.toMatch(/<animate|<set\b|animateTransform/);
    expect(css).toMatch(/min-width: 64rem\) and \(prefers-reduced-motion: no-preference\) \{\s*:global\(html\.js\) \.ink__flood \{\s*filter: url\('#ink-edge'\)/);
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/mix-blend-mode/);
    expect(css.match(/filter:/g)?.length).toBe(1);
  });

  test('the flood animates only clip-path and opacity (no filter, transition or keyframes)', () => {
    expect(css).not.toMatch(/transition|animation|@keyframes/);
    const props = [...motion.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]);
    const allowed = new Set(['--ink-h', '--f', '--cx', '--cy', 'position', 'inset', 'z-index', 'display', 'opacity', 'background-color', 'clip-path']);
    for (const prop of props) expect(allowed.has(prop)).toBe(true);
  });
});

describe('data-field flip', () => {
  const fn = engine.slice(engine.indexOf('function setField'), engine.indexOf('function initChapters'));

  test('the engine sets html[data-field="dark"] at p >= 0.5 on the negro passage and removes it below', () => {
    expect(engine).toContain('const FLOOD_FULL = 0.5;');
    expect(fn).toContain("el.dataset.belt === 'negro'");
    expect(fn).toMatch(/setField\(state\.p >= FLOOD_FULL\)/);
    expect(fn).toMatch(/root\.dataset\.field = 'dark'/);
    expect(fn).toMatch(/delete root\.dataset\.field/);
  });

  test('it reads the same scrubbed p as the flood, with ScrollTrigger only and no reduced-motion write', () => {
    expect(fn).toMatch(/if \(reduced\) return;/);
    expect(fn).toContain('scrollTrigger');
    expect(fn).not.toMatch(/requestAnimationFrame|lenis|IntersectionObserver/i);
    // The flood threshold and the CSS threshold are the same number.
    expect(motion).toContain('(0.5 - var(--p, 0))');
  });

  test('the dark field survives a reload deep in the page: the tween is a plain scrub, no one-way latch', () => {
    expect(fn).not.toMatch(/once:\s*true/);
  });
});

describe('fallbacks without the flood', () => {
  const base = read('src/styles/tul/base.css');
  const tokens = read('src/styles/tul/tokens.css');

  test('no JS: the negro chapter and what follows are black by CSS', () => {
    expect(base).toMatch(/html:not\(\.js\) main > section\[data-belt='negro'\]/);
  });

  test('reduced motion: the same, with no animation', () => {
    expect(base).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*html main > section\[data-belt='negro'\]/);
    // The engine never writes --p or data-field with reduced motion.
    expect(engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'))).toContain('if (reduced) return;');
  });

  test('the sections that must be black all carry the negro belt', () => {
    for (const f of ['Principles', 'TechSheet', 'KyongYe']) {
      expect(read(`src/components/tul/${f}.astro`)).toContain('data-belt="negro"');
    }
    expect(read('src/components/tul/TulChapter.astro')).toContain('data-belt={beltKey}');
  });

  test('no blend mode anywhere in the tul styles', () => {
    for (const src of [base, tokens, css]) expect(src.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/mix-blend-mode/);
  });
});
