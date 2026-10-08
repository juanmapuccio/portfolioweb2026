import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import {
  BAND,
  BAND_STITCHES,
  CREASES,
  FRAYS,
  GOLD_BAR,
  KNOT,
  KNOT_AT,
  OUTLINES,
  SHADES,
  TAILS,
  TAIL_STITCHES,
  VIEW,
  fray,
  stitches
} from '../src/components/tul/beltDrawing';

const read = (p: string) => readFileSync(p, 'utf8');
const drawing = read('src/components/tul/BeltDrawing.astro');
const passage = read('src/components/tul/InkPassage.astro');
const script = read('src/scripts/beltDrawing.ts');
const engine = read('src/scripts/tul.ts');
const styleOf = (src: string) => src.slice(src.indexOf('<style>'));
const noComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, '');

const numbers = (d: string) => [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));

/** Bounding box of absolute paths made of M/L/H/V/Z with plain numbers (all that the geometry module uses). */
function bbox(d: string): { x0: number; y0: number; x1: number; y1: number } {
  let x = 0;
  let y = 0;
  const xs: number[] = [];
  const ys: number[] = [];
  for (const [, cmd, args] of d.matchAll(/([MLHVZ])([^MLHVZ]*)/g)) {
    const n = numbers(args);
    if (cmd === 'M' || cmd === 'L') [x, y] = n;
    if (cmd === 'H') x = n[0];
    if (cmd === 'V') y = n[0];
    xs.push(x);
    ys.push(y);
  }
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
}

describe('belt drawing geometry', () => {
  test('the knot is at the centre of the drawing box and KNOT_AT says so', () => {
    const boxes = KNOT.map(bbox);
    const x = (Math.min(...boxes.map((b) => b.x0)) + Math.max(...boxes.map((b) => b.x1))) / 2;
    // The strap rises above the lobes and hangs below them: the lobes alone centre the knot.
    const lobes = boxes.slice(0, 2);
    const cx = (Math.min(...lobes.map((b) => b.x0)) + Math.max(...lobes.map((b) => b.x1))) / 2;
    const cy = (Math.min(...lobes.map((b) => b.y0)) + Math.max(...lobes.map((b) => b.y1))) / 2;
    expect(x).toBe(VIEW.w / 2);
    expect(cx).toBe(VIEW.w * KNOT_AT.fx);
    expect(cy).toBe(VIEW.h * KNOT_AT.fy);
  });

  test('the band is centred on the knot and the tails hang below it, inside the box', () => {
    const band = bbox(BAND);
    expect((band.y0 + band.y1) / 2).toBe(VIEW.h / 2);
    for (const tail of TAILS) {
      const b = bbox(tail);
      expect(b.y0).toBeGreaterThan(band.y1);
      expect(b.y1).toBeLessThanOrEqual(VIEW.h);
      expect(b.x0).toBeGreaterThanOrEqual(0);
      expect(b.x1).toBeLessThanOrEqual(VIEW.w);
    }
  });

  test('stitch lines are many short dashes, not one stroke', () => {
    const d = stitches(0, 0, 100, 0, 6, 5);
    expect(d.match(/M/g)?.length).toBe(Math.ceil(99 / 11));
    expect(BAND_STITCHES.length).toBe(8);
    for (const s of [...BAND_STITCHES, ...TAIL_STITCHES]) expect(s.match(/M/g)!.length).toBeGreaterThan(5);
  });

  test('the cut tail ends are frayed and the knot has creases and fold shade', () => {
    expect(FRAYS.length).toBe(2);
    expect(fray([0, 0], [10, 0], [0, 1], 4).match(/M/g)?.length).toBe(4);
    expect(CREASES.length).toBeGreaterThanOrEqual(4);
    expect(SHADES.length).toBeGreaterThanOrEqual(4);
    expect(OUTLINES.length).toBeGreaterThanOrEqual(4);
  });

  test('the gold bar lies on the right tail', () => {
    const bar = bbox(GOLD_BAR);
    const tail = bbox(TAILS[1]);
    expect(bar.x0).toBeGreaterThanOrEqual(tail.x0);
    expect(bar.x1).toBeLessThanOrEqual(tail.x1);
    expect(bar.y0).toBeGreaterThanOrEqual(tail.y0);
    expect(bar.y1).toBeLessThanOrEqual(tail.y1);
  });
});

describe('BeltDrawing component', () => {
  test('decorative svg with the weave pattern, stitches, shade, creases, frays and outlines', () => {
    expect(drawing).toMatch(/<svg\s[^>]*aria-hidden="true"/);
    expect(drawing).toContain('data-belt-drawing');
    expect(drawing).toMatch(/<pattern id=\{`\$\{id\}-weave`\}/);
    for (const cls of ['bd__stitch', 'bd__shade', 'bd__crease', 'bd__fray', 'bd__line']) expect(drawing).toContain(cls);
    expect(drawing).not.toMatch(/<text\b|<title\b|<p\b|<h[1-6]\b/);
  });

  test('colours come from the belt tokens, the ink and the field; only the gold is a literal', () => {
    const css = noComments(styleOf(drawing));
    expect(css).toMatch(/\.bd__layer \{\s*fill: var\(--belt-fill\)/);
    expect(css).toMatch(/\.bd__line \{[^}]*stroke: var\(--ink\)/);
    expect(css).toMatch(/\.bd__stitch \{[^}]*var\(--belt-fill\)/);
    expect(css).toMatch(/\.bd__key \{[^}]*var\(--belt-key, transparent\)/);
    const literals = [...css.matchAll(/#[0-9a-f]{3,6}\b/gi)].map((m) => m[0].toLowerCase());
    expect(new Set(literals)).toEqual(new Set(['#c9a227']));
  });

  test('carries a from and a to belt, each in its own data-belt group', () => {
    expect(drawing).toMatch(/data-belt=\{from\} data-bd-from/);
    expect(drawing).toMatch(/<g class="bd__layer" data-belt=\{to\}>/);
  });

  test('gold embroidery only on the 1st dan belt', () => {
    expect(drawing).toContain("const dan = to === 'negro';");
    expect(drawing).toMatch(/\{dan && \(\s*<g data-bd-gold>/);
  });

  test('static default shows the finished belt: the from layer is hidden until the engine reveals it', () => {
    const css = styleOf(drawing);
    expect(css).toMatch(/\.bd__layer--from \{\s*opacity: 0;/);
  });

  test('no filter, shadow, gradient or blend mode', () => {
    expect(noComments(styleOf(drawing))).not.toMatch(/filter:|box-shadow|gradient|mix-blend-mode/);
    expect(drawing).not.toMatch(/<filter\b|feTurbulence|linearGradient|radialGradient/);
  });
});

describe('mounted in the spacers', () => {
  test('every spacer holds one drawing, centred, with the knot position published as CSS vars', () => {
    expect(passage).toContain("import BeltDrawing from './BeltDrawing.astro';");
    expect(passage).toContain('<BeltDrawing from={from} to={to} />');
    expect(passage).toContain('--knot-fx:${KNOT_AT.fx};--knot-fy:${KNOT_AT.fy}');
    expect(styleOf(passage)).toMatch(/\.ink__drawing \{[^}]*place-items: center/);
  });

  test('mobile always shows it; desktop hides it only once the 3D belt reports ready', () => {
    const css = styleOf(passage);
    expect(css).toMatch(/min-width: 64rem\) \{\s*:global\(html\[data-belt3d='ready'\]\) \.ink__drawing \{\s*display: none/);
    expect(css).not.toMatch(/max-width[^{]*\{[^}]*\.ink__drawing \{[^}]*display: none/);
  });

  test('the static spacer is tall enough for the static drawing (no overlap with the next section)', () => {
    expect(styleOf(passage)).toMatch(/--ink-h: 12rem/);
    expect(styleOf(drawing)).toMatch(/width: min\(22rem, calc\(100% - 2 \* var\(--gutter\)\)\)/);
  });
});

describe('untie and tie with DrawSVG', () => {
  test('the timeline erases and redraws the outlines, fades fills and wipes the band with clip-path', () => {
    expect(script).toMatch(/drawSVG: '0%'/);
    expect(script).toMatch(/drawSVG: '100%'/);
    expect(script).toContain("clipPath: 'inset(0% 100% 0% 0%)'");
    expect(script).toContain('paused: true');
    expect(script).toMatch(/if \(gold\) tl\.fromTo\(gold/);
  });

  test('it animates only opacity, clip-path and stroke-dashoffset (through DrawSVG)', () => {
    const props = [...script.matchAll(/\{\s*(?:[a-zA-Z]+: [^,}]+,\s*)*(opacity|drawSVG|clipPath)\b/g)].map((m) => m[1]);
    expect(props.length).toBeGreaterThan(5);
    const tweened = [...noComments(script).matchAll(/\b(x|y|scale|rotate|rotation|width|height|fill|stroke|top|left)\s*:/g)].map((m) => m[1]);
    expect(tweened).toEqual([]);
  });

  test('tul.ts scrubs it with the same --p as the passage, only when it is rendered, never with reduced motion', () => {
    const fn = engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'));
    expect(fn).toMatch(/if \(reduced\) return;/);
    expect(fn).toContain("'[data-belt-drawing]'");
    expect(fn).toContain('getClientRects().length === 0');
    expect(fn).toContain('belt?.progress(state.p)');
    expect(fn).toContain('scrollTrigger');
    expect(fn).not.toMatch(/requestAnimationFrame|lenis/i);
    expect(engine).toContain("import { buildBeltTimeline } from './beltDrawing';");
  });

  test('without the parts the timeline is null, and nothing in the script reads layout every frame', () => {
    expect(script).toMatch(/return null;/);
    expect(script).not.toMatch(/getBoundingClientRect|offsetWidth|requestAnimationFrame/);
  });

  test('no hangul', () => {
    for (const src of [drawing, script, passage]) expect(/[ᄀ-ᇿ㄰-㆏가-힯]/.test(src)).toBe(false);
  });
});
