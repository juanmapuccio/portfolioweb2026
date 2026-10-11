import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { passageFrame, travelFrame, type Metrics } from '../src/scripts/belt3d/journey';
import {
  FLOOD_FULL,
  FLOOD_START,
  KNOT_UNTIL,
  PASSAGE_SVH,
  SEEP,
  TEXT_OUT,
  seepAt,
  seepPoints,
  seepPolygon
} from '../src/scripts/belt3d/passage';

// T6: the red-to-black passage. The belt turns black organically (from the knot, along the cloth) while the field
// is still light, the ink then overflows from the knot into the page, and the sprint stage stays pinned throughout.

const read = (p: string) => readFileSync(p, 'utf8');
const noComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const passage = read('src/components/tul/InkPassage.astro');
const sprint = read('src/components/tul/BeltSprint.astro');
const engine = read('src/scripts/tul.ts');
const tokens = read('src/styles/tul/tokens.css');
const belt = read('src/scripts/belt3d/proceduralBelt.ts');
const styleOf = (src: string) => src.slice(src.indexOf('<style>'));
const close = (a: number, b: number, eps = 1e-6) => expect(Math.abs(a - b)).toBeLessThan(eps);

const sizes: Metrics[] = [
  { w: 1440, h: 900, col: { x: 1292, y: 474, w: 216, h: 852 }, hero: { x: 1080, y: 470, s: 364 } },
  { w: 1024, h: 768, col: { x: 913, y: 408, w: 154, h: 720 }, hero: { x: 790, y: 400, s: 250 } }
];

describe('the timeline of the passage', () => {
  test('the belt is black before the flood starts, and the flood is full before the knot stops being published', () => {
    expect(SEEP.to).toBeLessThanOrEqual(FLOOD_START);
    expect(FLOOD_START).toBeLessThan(FLOOD_FULL);
    expect(KNOT_UNTIL).toBeGreaterThanOrEqual(FLOOD_FULL);
    expect(TEXT_OUT.to).toBeLessThanOrEqual(FLOOD_FULL);
    expect(FLOOD_FULL).toBeLessThan(1);
  });

  test('seepAt is a smooth 0..1 over the seep window', () => {
    expect(seepAt(0)).toBe(0);
    expect(seepAt(SEEP.from)).toBe(0);
    expect(seepAt(SEEP.to)).toBe(1);
    expect(seepAt(1)).toBe(1);
    let prev = 0;
    for (let p = 0; p <= 1.0001; p += 0.01) {
      expect(seepAt(p)).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = seepAt(p);
    }
  });
});

describe('journey: the tie beat turns the belt black on the light field', () => {
  for (const m of sizes) {
    test(`${m.w}x${m.h}: the 3D belt is (almost) black when the flood starts, and the mix is the shared seep`, () => {
      expect(passageFrame('rojo', 'negro', FLOOD_START, m).mix).toBeGreaterThanOrEqual(0.8);
      expect(passageFrame('rojo', 'negro', 0, m).mix).toBe(0);
      for (let p = 0; p <= 1.0001; p += 0.05) close(passageFrame('rojo', 'negro', p, m).mix, seepAt(p));
    });

    test(`${m.w}x${m.h}: the belt stays in the column through the whole passage (the stage is pinned, it has text)`, () => {
      const col = travelFrame('rojo', 1, m).cam;
      for (let p = 0; p <= 1.0001; p += 0.02) {
        const f = passageFrame('rojo', 'negro', p, m);
        for (const key of ['sx', 'sy', 'ppm', 'elevation', 'dist'] as const) close(f.cam[key], col[key]);
      }
    });
  }

  test('gold stitches show on the light field, the rim light is full when the field flips, the knot leads the flood', () => {
    const m = sizes[0];
    expect(passageFrame('rojo', 'negro', FLOOD_START, m).gold).toBeGreaterThan(0.5);
    expect(passageFrame('rojo', 'negro', FLOOD_START, m).rim).toBe(0);
    expect(passageFrame('rojo', 'negro', FLOOD_FULL, m).rim).toBe(1);
    expect(passageFrame('rojo', 'negro', FLOOD_FULL, m).tie).toBe(true);
    expect(passageFrame('rojo', 'negro', KNOT_UNTIL + 0.01, m).tie).toBe(false);
  });

  test('the knot loosens while the ink soaks in and is tied again before the flood covers the view', () => {
    const m = sizes[0];
    const k = (p: number) => (passageFrame('rojo', 'negro', p, m).pose as { k: number }).k;
    expect(k(0)).toBe(1);
    expect(k(0.3)).toBeLessThan(0.7);
    expect(k(FLOOD_FULL)).toBe(1);
  });
});

describe('the organic front', () => {
  test('seep points are deterministic, star-shaped around the knot, irregular, with fibres running ahead', () => {
    const a = seepPoints(7, 48);
    expect(seepPoints(7, 48)).toEqual(a);
    expect(a).toHaveLength(48);
    const angles = a.map((q) => Math.atan2(q.s, q.c));
    // Monotonic angle around the centre (no self-crossing polygon).
    const unwrapped = angles.map((x) => (x < angles[0] - 1e-9 ? x + 2 * Math.PI : x));
    for (let i = 1; i < unwrapped.length; i++) expect(unwrapped[i]).toBeGreaterThan(unwrapped[i - 1]);
    const w = a.map((q) => q.w);
    const mean = w.reduce((s, x) => s + x, 0) / w.length;
    const sd = Math.sqrt(w.reduce((s, x) => s + (x - mean) ** 2, 0) / w.length);
    expect(Math.min(...w)).toBeGreaterThanOrEqual(0.8);
    expect(sd).toBeGreaterThan(0.03);
    expect(a.filter((q) => q.f > 0.1).length).toBeGreaterThanOrEqual(3);
    for (const q of a) expect(q.f).toBeGreaterThanOrEqual(0);
  });

  test('the clip polygon collapses to the centre at 0 and is written with calc() on one variable', () => {
    const poly = seepPolygon({ v: '--seep', cx: '50%', cy: '35%', rx: 140, ry: 140, unit: '%', seed: 3, points: 24 });
    expect(poly.startsWith('polygon(')).toBe(true);
    expect(poly.match(/calc\(/g)?.length).toBe(48);
    expect(poly).toContain('var(--seep)');
    expect(poly).not.toMatch(/NaN|Infinity|undefined/);
  });
});

describe('the passage plays while the sprint stage is held (no seam)', () => {
  test('one length for the passage, shared by the sprint track and the spacer, ~120-150svh', () => {
    expect(tokens).toMatch(new RegExp(`--pass-h: ${PASSAGE_SVH.wide}svh;`));
    expect(tokens).toMatch(new RegExp(`max-width: 47\\.99rem\\) \\{\\s*:root \\{\\s*--pass-h: ${PASSAGE_SVH.narrow}svh;`));
    for (const v of [PASSAGE_SVH.wide, PASSAGE_SVH.narrow]) {
      expect(v).toBeGreaterThanOrEqual(120);
      expect(v).toBeLessThanOrEqual(150);
    }
    expect(sprint).toMatch(/\.bs__track\s*\{\s*height: calc\(100svh \+ \(var\(--n\) - 1\) \* 120svh \+ var\(--pass-h\)\);/);
  });

  test('the flood passage overlaps the tail of the sprint track: same height, pulled up by it, still in flow', () => {
    const css = styleOf(passage);
    expect(passage).toContain("'ink--flood': floods");
    expect(css).toMatch(/:global\(html\.js\) \.ink--flood \{\s*--ink-h: var\(--pass-h\);\s*margin-top: calc\(-1 \* var\(--ink-h\)\);/);
    expect(css).not.toMatch(/\.ink--flood \{[^}]*position:/);
  });

  test('the sprint ends exactly where the passage starts: the passage is the end trigger of the sprint', () => {
    const fn = engine.slice(engine.indexOf('function initSprint'), engine.indexOf('function initPassages'));
    expect(fn).toContain('[data-tul-passage][data-belt="negro"]');
    expect(fn).toMatch(/endTrigger: seam \?\? track/);
    expect(fn).toMatch(/end: seam \? 'top bottom' : 'bottom bottom'/);
    const pass = engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'));
    expect(pass).toMatch(/start: 'top bottom', end: flips \? 'bottom bottom' : 'bottom top'/);
  });

  test('the engine hands the passage progress to the sprint stage and publishes the drawn knot as the fallback origin', () => {
    const pass = engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'));
    expect(pass).toContain("'--pass'");
    expect(pass).toContain("'--ink-ox'");
    expect(pass).toContain("'--ink-oy'");
    expect(pass).toContain("ScrollTrigger.addEventListener('refresh'");
    expect(pass).not.toMatch(/requestAnimationFrame|lenis/i);
  });
});

describe('the flood comes out of the knot', () => {
  const css = styleOf(passage);

  test('its centre is the 3D knot, else the drawn knot of the sprint stage, else the spacer', () => {
    expect(css).toMatch(/--cx: var\(--knot-x, var\(--ink-ox, calc\(100vw \* var\(--knot-fx\)\)\)\)/);
    expect(css).toMatch(/--cy: var\(--knot-y, var\(--ink-oy, 50svh\)\)/);
  });

  test('it starts at FLOOD_START and covers the view at FLOOD_FULL, numbers passed from passage.ts', () => {
    expect(passage).toContain('--flood-a:${FLOOD_START};--flood-z:${FLOOD_FULL}');
    expect(css).toContain('--f: clamp(0, calc((var(--p, 0) - var(--flood-a)) / (var(--flood-z) - var(--flood-a))), 1)');
    expect(css).toContain('opacity: clamp(0, calc((var(--flood-z) - var(--p, 0)) * 1000 + 1), 1)');
    expect(engine).toContain("import { FLOOD_FULL } from './belt3d/passage';");
  });

  test('the edge is an irregular ink front (seep polygon), not a clean circle, on every width', () => {
    expect(css).toMatch(/clip-path: var\(--flood-clip\)/);
    expect(passage).toMatch(/seepPolygon\(\{[^}]*v: '--g'/);
  });
});

describe('phones and no 3D: the drawn belt turns black the same way', () => {
  const css = noComments(styleOf(sprint));

  test('the red belt carries a black twin of its mark and band, revealed by the seep polygon from the knot', () => {
    expect(sprint.match(/{i === steps.length - 1 && /g)?.length).toBe(2);
    expect(sprint).toMatch(/class="bs__soak" data-belt="negro"/);
    expect(sprint).toMatch(/<BeltMark beltKey="negro" \/>/);
    expect(sprint).toMatch(/seepPolygon\(\{[^}]*v: '--seep'/);
    expect(css).toMatch(/clip-path: var\(--soak-clip\)/);
  });

  test('the seep reads the passage progress handed over by the engine, on the shared window', () => {
    expect(sprint).toContain('--seep-a:${SEEP.from};--seep-z:${SEEP.to}');
    expect(css).toContain('--seep0: clamp(0, calc((var(--pass, 0) - var(--seep-a)) / (var(--seep-z) - var(--seep-a))), 1)');
  });

  test('the words step back under the ink; the belt stays, so the black belt is what is left on the dark field', () => {
    expect(sprint).toContain('--out-a:${TEXT_OUT.from};--out-z:${TEXT_OUT.to}');
    expect(css).toMatch(/opacity: calc\(var\(--sv\) \* \(1 - var\(--gone\)\)\)/);
    expect(css).toMatch(/\.bs__title,\s*:global\(html\.js\) \.bs__rail \{\s*opacity: calc\(1 - var\(--gone\)\);/);
  });

  test('without JS or with reduced motion there is no black twin: the static list keeps its colours', () => {
    const base = css.slice(0, css.indexOf('@media (prefers-reduced-motion: no-preference)'));
    expect(base).toMatch(/\.bs__soak\s*\{\s*display: none;/);
    expect(css).toMatch(/:global\(html\.js\) \.bs__soak \{[^}]*display: block/);
  });

  test('the flood passage gives its drawing to the sprint stage (it would scroll over the pinned stage)', () => {
    expect(styleOf(passage)).toMatch(/:global\(html\.js\) \.ink--flood \.ink__drawing \{\s*display: none;/);
  });
});

describe('3D: the ink enters at the knot and runs along the cloth', () => {
  test('every cloth vertex knows its distance from the knot; the mask mixes it with noise and fibres', () => {
    expect(belt).toContain("setAttribute('aSeep'");
    expect(belt).toContain('attribute float aSeep');
    expect(belt).toContain('varying float vSeep');
    expect(belt).toMatch(/float v = [^;]*vSeep[^;]*;/);
  });

  test('the built belt has aSeep on every cloth mesh, 0 at the knot and 1 at the farthest cloth', async () => {
    // The weave texture only needs a canvas: a stub is enough to build the geometry (as in tul-beltbudget).
    (globalThis as unknown as { document: unknown }).document = {
      createElement: () => ({ getContext: () => null, width: 0, height: 0 })
    };
    const mod = await import('../src/scripts/belt3d/proceduralBelt');
    const built = mod.createProceduralBelt();
    let min = Infinity;
    let max = -Infinity;
    built.group.traverse((o) => {
      const m = o as unknown as { isMesh?: boolean; material?: unknown; geometry?: { getAttribute: (n: string) => { array: ArrayLike<number> } | undefined } };
      if (!m.isMesh || m.material !== built.materials.cloth) return;
      const a = m.geometry?.getAttribute('aSeep');
      expect(a).toBeDefined();
      for (const v of Array.from(a?.array ?? [])) {
        min = Math.min(min, v);
        max = Math.max(max, v);
      }
    });
    expect(min).toBeLessThan(0.08);
    close(max, 1);
    built.dispose();
  });
});

describe('reduced motion and no JS', () => {
  test('nothing is scrubbed: no --pass, no flood, the static gap and colours remain', () => {
    const pass = engine.slice(engine.indexOf('function initPassages'), engine.indexOf('function initChapters'));
    expect(pass).toMatch(/if \(reduced\) return;/);
    const base = styleOf(passage).slice(0, styleOf(passage).indexOf('@media (prefers-reduced-motion: no-preference)'));
    expect(base).toMatch(/\.ink__flood \{\s*display: none;/);
    expect(base).not.toContain('ink--flood');
  });
});
