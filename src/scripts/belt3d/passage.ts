// The red-to-black passage (InkPassage to="negro") as pure numbers, shared by the 3D journey (journey.ts), the engine
// (tul.ts) and the CSS of InkPassage.astro and BeltSprint.astro (passed in as inline custom properties, so the CSS and
// the code can never disagree). No three, no DOM.
//
// The passage plays while the sprint stage is still pinned on the red belt: its scroll (`--pass-h`, PASSAGE_SVH) is
// the tail of the sprint track, so the sprint hands over without the stage ever scrolling away. Over its progress p:
//   SEEP       0.06-0.46  ink soaks into the red belt at the knot and runs along the cloth with an irregular,
//                         fibrous front: the 3D belt (noise mask led by the distance from the knot) and, on a phone
//                         or without 3D, the drawn mark and the band of the stage. The field is still light.
//              0.30-0.60  the stitches turn gold (3D).
//   TEXT_OUT   0.56-0.78  the words of the stage step back.
//   FLOOD      0.50-0.80  the ink overflows from the knot into the page. At FLOOD_FULL it covers the view and the
//                         engine flips html[data-field="dark"] under it; the rim light is up by then (3D).
//              0.80-1.00  the black belt rests on the black field; then the stage lets go and the 1st dan follows.

export const SEEP = { from: 0.06, to: 0.46 } as const;
export const TEXT_OUT = { from: 0.56, to: 0.78 } as const;
export const FLOOD_START = 0.5;
/** The flood covers the whole view from here on: the field flips under it. */
export const FLOOD_FULL = 0.8;
/** The 3D scene publishes the knot (the centre of the flood) while the passage is at or below this. */
export const KNOT_UNTIL = 0.82;
/** Scroll length of the passage in svh (`--pass-h` in tokens.css): desktop and phone. */
export const PASSAGE_SVH = { wide: 140, narrow: 120 } as const;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
const smoothstep = (x: number, a: number, b: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** How black the belt is at passage progress `p` (0..1). */
export const seepAt = (p: number): number => smoothstep(p, SEEP.from, SEEP.to);

/** One vertex of the ink front: its direction (`c`, `s`), its body radius `w` and how far a fibre runs ahead `f`. */
export interface SeepPoint {
  c: number;
  s: number;
  w: number;
  f: number;
}

/** Small deterministic PRNG (mulberry32): the same seed always draws the same front. */
function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The ink front around a centre: `n` points in angle order (so the polygon never crosses itself). The body radius
 * wobbles on two slow waves plus a little noise (0.8..1.05); a few points are fibres that run ahead while the ink is
 * young and are caught up by the body as it grows (`f`, see seepPolygon).
 */
export function seepPoints(seed: number, n = 48): SeepPoint[] {
  const rand = prng(seed);
  const step = (2 * Math.PI) / n;
  const p1 = rand() * Math.PI * 2;
  const p2 = rand() * Math.PI * 2;
  const every = Math.max(2, Math.round(n / 6));
  const out: SeepPoint[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * step + (rand() - 0.5) * 0.5 * step;
    const w = 0.93 + 0.06 * Math.sin(3 * a + p1) + 0.035 * Math.sin(5 * a + p2) + 0.05 * (rand() - 0.5);
    const lead = rand();
    const fibre = i % every === 2 || lead < 0.12;
    out.push({ c: Math.cos(a), s: Math.sin(a), w: Math.max(0.8, w), f: fibre ? 0.14 + 0.32 * rand() : 0 });
  }
  return out;
}

const num = (n: number): string => {
  const r = Math.round(n * 1000) / 1000;
  return Object.is(r, -0) ? '0' : String(r);
};

export interface SeepPolygonOptions {
  /** The custom property that grows the front, 0..1 (e.g. '--seep'). */
  v: string;
  /** Centre, as the inside of a calc() (e.g. '50%' or 'var(--cx) + 3rem'). */
  cx: string;
  cy: string;
  /** Radius at full growth along x and y, in `unit`. */
  rx: number;
  ry: number;
  unit: string;
  seed: number;
  points?: number;
  /** Scale of the fibres that run ahead (1 = as drawn). The page-sized flood keeps them short, or they read as spikes. */
  lead?: number;
}

/**
 * A `clip-path: polygon()` whose points are calc() of one custom property `s` (0..1): each point sits at
 * centre + s * (w + f) * r - s^2 * f * r along its direction. At s = 0 every point is the centre (nothing shows); the
 * fibres lead early and the body catches up, so the front looks like ink running along threads, never a circle.
 * Only the custom property changes with the scroll: the polygon itself is fixed at build time.
 */
export function seepPolygon(o: SeepPolygonOptions): string {
  const v = `var(${o.v})`;
  const axis = (centre: string, r: number, dir: number, q: SeepPoint): string => {
    const f = q.f * (o.lead ?? 1);
    const a = (q.w + f) * r * dir;
    const b = f * r * dir;
    return `calc(${centre} + ${v} * ${num(a)}${o.unit} - ${v} * ${v} * ${num(b)}${o.unit})`;
  };
  const pts = seepPoints(o.seed, o.points ?? 48).map((q) => `${axis(o.cx, o.rx, q.c, q)} ${axis(o.cy, o.ry, q.s, q)}`);
  return `polygon(${pts.join(', ')})`;
}
