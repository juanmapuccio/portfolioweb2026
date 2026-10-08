// Geometry of the detailed belt drawing (BeltDrawing.astro). All numbers are user units of a
// 480 x 260 viewBox. The knot sits exactly at the centre of the box, so a spacer that centres the
// drawing has its knot at the centre of the spacer: that is what KNOT_AT publishes to the flood.

export const VIEW = { w: 480, h: 260 } as const;

/** Where the knot is inside the drawing box, as fractions of its width and height. */
export const KNOT_AT = { fx: 0.5, fy: 0.5 } as const;

/** The band: a straight strip that ends in a break line on each side, as a manual figure shows a part that goes on. */
export const BAND = 'M14 110H466L460 120L468 130L460 140L466 150H14L8 140L16 130L8 120Z';

/** Band edges and its two break lines: always drawn, never erased. */
export const BAND_EDGES = 'M14 110H466M14 150H466M14 110L8 120L16 130L8 140L14 150M466 110L460 120L468 130L460 140L466 150';

/** Knot fills: left lobe, right lobe and the strap that crosses them. */
export const KNOT = [
  'M204 100L240 92V168L206 160Z',
  'M240 92L276 100L274 160L240 168Z',
  'M228 88H252V172H228Z'
] as const;

/** Tails hanging from under the knot, each with a cut end. */
export const TAILS = [
  'M222 166L196 238L230 250L246 168Z',
  'M248 168L262 252L300 238L270 166Z'
] as const;

/** Outlines drawn by DrawSVG when the belt unties and ties again (knot, strap and both tails). */
export const OUTLINES = [
  'M204 100L240 92L276 100L274 160L240 168L206 160Z',
  'M240 92V168',
  'M228 88H252V172H228Z',
  'M222 172L196 238L230 250L246 172',
  'M250 172L262 252L300 238L270 172'
] as const;

/** Fold shadows: the darker half of each lobe, the strap edges and the inner side of each tail. */
export const SHADES = [
  'M206 130L240 126V168L206 160Z',
  'M228 88H234V172H228Z',
  'M236 172L246 172L230 250L220 246Z',
  'M250 172L258 172L272 249L262 252Z',
  'M204 150H276V158H204Z'
] as const;

/** Creases of the knot. */
export const CREASES = ['M208 106L238 120', 'M242 120L272 106', 'M210 150L238 140', 'M242 140L270 150'] as const;

/**
 * Pespunte: one stitch path = many short dashes (moves between them are not stroked), so DrawSVG
 * and plain strokes both show a real stitch line.
 */
export function stitches(x1: number, y1: number, x2: number, y2: number, dash = 6, gap = 5): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  let d = '';
  for (let s = 0; s < len - 1; s += dash + gap) {
    const e = Math.min(s + dash, len);
    d += `M${(x1 + ux * s).toFixed(1)} ${(y1 + uy * s).toFixed(1)}L${(x1 + ux * e).toFixed(1)} ${(y1 + uy * e).toFixed(1)}`;
  }
  return d;
}

/** Frayed threads at a cut tail end: short strokes leaving the edge `a` to `b` on its outer side. */
export function fray(a: [number, number], b: [number, number], outward: [number, number], n = 6): string {
  let d = '';
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    const x = a[0] + (b[0] - a[0]) * t;
    const y = a[1] + (b[1] - a[1]) * t;
    const len = 3 + ((i * 7) % 4);
    d += `M${x.toFixed(1)} ${y.toFixed(1)}L${(x + outward[0] * len).toFixed(1)} ${(y + outward[1] * len).toFixed(1)}`;
  }
  return d;
}

/** Stitch rows along the band, left and right of the knot. */
export const BAND_STITCHES = [114, 120, 140, 146].flatMap((y) => [stitches(22, y, 198, y), stitches(282, y, 458, y)]);

/** Stitch rows inside the tails, parallel to their edges. */
export const TAIL_STITCHES = [
  stitches(228, 176, 205, 238),
  stitches(238, 176, 221, 244),
  stitches(254, 178, 266, 244),
  stitches(262, 176, 281, 240)
];

export const FRAYS = [
  fray([196, 238], [230, 250], [-0.33, 0.94]),
  fray([262, 252], [300, 238], [0.35, 0.94])
];

/** 1st dan embroidery: a gold bar near the end of the right tail and a gold stitch line along the band. */
export const GOLD_BAR = 'M258.9 233.5L293.4 222.2L295.2 226.5L259.8 238.6Z';
export const GOLD_STITCHES = [stitches(24, 130, 198, 130, 7, 5), stitches(282, 130, 456, 130, 7, 5)];
