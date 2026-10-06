import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(p, 'utf8');
const diagram = read('src/components/tul/FloorDiagram.astro');
const engine = read('src/scripts/tul.ts');
const css = diagram.slice(diagram.indexOf('<style>'));
const markup = diagram.slice(diagram.indexOf('---', 3), diagram.indexOf('<style>'));

describe('floor in perspective', () => {
  test('the stage holds the perspective and the plane preserves 3D', () => {
    expect(css).toMatch(/perspective:\s*1100px/);
    expect(css).toContain('perspective-origin');
    expect(css).toContain('transform-style: preserve-3d');
    expect(css).toMatch(/rotateX\(var\(--tilt\)\)/);
    expect(css).toMatch(/rotateZ\(var\(--yaw\)\)/);
  });

  test('stop numbers and the ready label are HTML, not SVG text', () => {
    expect(markup).not.toContain('<text');
    expect(markup).toContain("'fd-mk__disc'");
    expect(markup).toContain('class="fd-mk__flag"');
    expect(markup).toContain('fd-mk__stem');
  });

  test('markers counter-rotate with --tilt so they stand up', () => {
    expect(css).toMatch(/rotateX\(calc\(-1 \* var\(--tilt\)\)\)/);
    expect(css).toContain('translateZ(1px)');
    expect(css).toContain('backface-visibility: hidden');
  });

  test('the camera follows the scene --p in CSS only', () => {
    expect(css).toMatch(/--tv:\s*calc\(58 - 14 \* var\(--p, 1\)\)/);
    expect(css).toMatch(/--cam:\s*calc\(0\.96 \+ 0\.08 \* var\(--p, 1\)\)/);
    expect(css).toContain('[data-tul-scene]');
  });

  test('the hero floor stays flat until the portrait fades, then tilts with --q', () => {
    expect(css).toContain('fd--portrait');
    expect(css).toMatch(/--reveal:\s*clamp\(0, calc\(\(var\(--q, 0\) - 0\.3\)/);
  });

  test('mobile and compact get a lighter fixed tilt', () => {
    expect(css).toMatch(/--tv:\s*34;/);
  });

  test('reduced motion and no JS get a static mild tilt, drawn and unscrubbed', () => {
    expect(css).toMatch(/--tv:\s*30;/);
    // Every motion-driven rule hangs off html.js and no-preference.
    const motion = css.slice(css.indexOf('prefers-reduced-motion: no-preference'));
    expect(motion).toContain('html.js');
    expect(css).not.toMatch(/prefers-reduced-motion:\s*reduce\)\s*\{[^}]*--p/);
  });

  test('without preserve-3d support the floor falls back to flat', () => {
    expect(css).toMatch(/@supports not \(transform-style: preserve-3d\)/);
    expect(css).toMatch(/--tv:\s*0 !important/);
  });

  test('depth is geometry only: no filter, box-shadow or gradient', () => {
    expect(css).not.toMatch(/filter\s*:/);
    expect(css).not.toContain('box-shadow');
    expect(css).not.toMatch(/gradient/);
  });

  test('the engine adds no per-frame loop or smooth-scroll library for the camera', () => {
    expect(engine).not.toContain('requestAnimationFrame');
    expect(engine).not.toContain('new Lenis');
  });
});
