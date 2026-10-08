import type { TulForm } from '../../data/tuls';
import { pointAt, routeOf, type Pt, type Route } from '../../data/tulRoute';

export type { Pt };

/**
 * Isometric projection of a tul floor: plain numbers, no DOM. TatamiIso.astro draws what this returns, at
 * build time, from the same route and stops the 3D tatami reads (`data-tatami`).
 *
 * World: a point of the diagram (x right, y down, 0..100 units) lies on the floor; z is the height. The view is
 * isometric (30 degrees): +x runs right and down, +y runs left and down, z runs up, all with the same scale, so
 * a unit is the same length on every axis. Nothing here is a shadow or a gradient: every face of a solid is one
 * flat polygon, and the shading is chosen per face by the stylesheet (top, left, right).
 */

/** Path units (0..1) to diagram units (0..100). */
export const SCALE = 100;
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

/** The floor covers the 0..100 frame plus a margin, like the 3D tatami (108 across). */
export const FLOOR_MIN = -4;
export const FLOOR_MAX = 104;
/** Thickness of a tatami plate, in diagram units. */
export const PLATE_T = 3.4;
/** Gap between two plates: the seam shows the darker base. */
export const SEAM = 0.9;
/** Height of the route above the floor base: just over the top face of the plates. */
export const ROUTE_Z = PLATE_T + 0.2;
/** A post is a square prism standing on the plates. */
const POST = { full: { w: 7.6, h: 14 }, compact: { w: 5.4, h: 8.5 } } as const;
/** Footprints and arrowheads are drawn a little larger than the flat notation: the whole floor is wider here. */
const MARK = 1.4;
/** Distance (diagram units) under which an arrowhead would collide with a post. */
const ARROW_CLEAR = 7.6;
/** Height of the ready flag's stem. */
const FLAG_H = 11;

/** The SVG view box: the projected floor, the thickest post and a hair of margin. */
export const VIEW_BOX = { x: -94.5, y: -13, w: 189, h: 122 } as const;

export const fmt = (n: number): number => Number(n.toFixed(2));

/** Isometric projection of a world point to the SVG plane. */
export function project(x: number, y: number, z = 0): Pt {
  return [(x - y) * COS30, (x + y) * SIN30 - z];
}

/** `x,y x,y ...` for a polygon or polyline. */
export const points = (pts: readonly Pt[]): string => pts.map(([x, y]) => `${fmt(x)},${fmt(y)}`).join(' ');

/** The three faces of a box that face the viewer. */
export interface Faces {
  top: Pt[];
  /** The face at the greater y: it faces left and down. */
  left: Pt[];
  /** The face at the greater x: it faces right and down. */
  right: Pt[];
}

export function boxFaces(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number): Faces {
  return {
    top: [project(x0, y0, z1), project(x1, y0, z1), project(x1, y1, z1), project(x0, y1, z1)],
    left: [project(x0, y1, z1), project(x1, y1, z1), project(x1, y1, z0), project(x0, y1, z0)],
    right: [project(x1, y0, z1), project(x1, y1, z1), project(x1, y1, z0), project(x1, y0, z0)]
  };
}

export interface Rect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Tatami mats on the floor: `rows` rows of 2:1 mats, the odd rows shifted by half a mat so their ends are half
 * mats (the same layout as the 3D floor). Returned in painter order, back to front: a mat of an earlier row is
 * entirely behind one of a later row, and inside a row the smaller x is behind.
 */
export function plateRects(rows: number): Rect[] {
  const side = FLOOR_MAX - FLOOR_MIN;
  const rowD = side / rows;
  const matW = rowD * 2;
  const out: Rect[] = [];
  for (let r = 0; r < rows; r++) {
    const y0 = FLOOR_MIN + rowD * r;
    const edges = [0];
    if (r % 2 === 1) edges.push(matW / 2);
    while (edges[edges.length - 1] + matW < side - 1e-6) edges.push(edges[edges.length - 1] + matW);
    edges.push(side);
    for (let i = 0; i < edges.length - 1; i++) {
      out.push({
        x0: FLOOR_MIN + edges[i] + SEAM / 2,
        x1: FLOOR_MIN + edges[i + 1] - SEAM / 2,
        y0: y0 + SEAM / 2,
        y1: y0 + rowD - SEAM / 2
      });
    }
  }
  return out;
}

/** The floor base, at height 0: what the seams between the mats show. */
export const baseQuad = (): Pt[] => [
  project(FLOOR_MIN, FLOOR_MIN),
  project(FLOOR_MAX, FLOOR_MIN),
  project(FLOOR_MAX, FLOOR_MAX),
  project(FLOOR_MIN, FLOOR_MAX)
];

/** Points of the route in diagram units. */
export const diagramPoints = (form: TulForm): Pt[] => form.path.map(([x, y]) => [x * SCALE, y * SCALE] as const);

export interface DiagramStop {
  x: number;
  y: number;
  t: number;
  move: number;
}

/** Where each milestone sits on the route (diagram units, 2 decimals): the posts of the SVG and of the tatami. */
export function diagramStops(form: TulForm): DiagramStop[] {
  const route = routeOf(diagramPoints(form));
  return form.stops.map((stop) => {
    const p = pointAt(route, stop.t);
    return { x: fmt(p[0]), y: fmt(p[1]), t: stop.t, move: stop.move };
  });
}

/** Path data of already projected points. */
export const pathOf = (pts: readonly Pt[]): string =>
  pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${fmt(x)} ${fmt(y)}`).join(' ');

/** Path data of a polyline lying on the floor at height `z`. */
export const routePath = (pts: readonly Pt[], z = ROUTE_Z): string => pathOf(pts.map(([x, y]) => project(x, y, z)));

const rotate = ([x, y]: Pt, deg: number): Pt => {
  const r = (deg * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)];
};

/** A flat mark (arrowhead, footprint) given in its own frame, turned and placed on the floor. */
function onFloor(shape: readonly Pt[], at: Pt, deg: number, z: number): Pt[] {
  return shape.map((p) => {
    const q = rotate([p[0] * MARK, p[1] * MARK], deg);
    return project(at[0] + q[0], at[1] + q[1], z);
  });
}

export interface Arrow {
  x: number;
  y: number;
  /** Direction of travel, degrees. */
  angle: number;
  /** Fraction of the route where the arrow shows up. */
  t: number;
}

const retraces = (segs: Route['segs'], i: number, j: number): boolean => {
  const A = segs[i];
  const B = segs[j];
  const sameX = A.a[0] === A.b[0] && B.a[0] === B.b[0] && A.a[0] === B.a[0];
  const sameY = A.a[1] === A.b[1] && B.a[1] === B.b[1] && A.a[1] === B.a[1];
  if (!sameX && !sameY) return false;
  const k: 0 | 1 = sameX ? 1 : 0;
  const lo = Math.max(Math.min(A.a[k], A.b[k]), Math.min(B.a[k], B.b[k]));
  const hi = Math.min(Math.max(A.a[k], A.b[k]), Math.max(B.a[k], B.b[k]));
  return hi - lo > 1;
};

/**
 * Direction arrowheads: one per segment, offset to the right of the travel direction so that segments walked
 * back over the same line keep separate arrows. Segments that retrace the same line also get distinct places
 * along it (30% and 70%), so out-and-back pairs never stack their marks.
 */
export function routeArrows(route: Route): Arrow[] {
  const { segs, total } = route;
  const out: Arrow[] = [];
  segs.forEach((s, i) => {
    if (s.len < 12) return;
    const others = segs.map((_, j) => j).filter((j) => j !== i && retraces(segs, i, j));
    const rank = others.filter((j) => j < i).length;
    const along = others.length === 0 ? 0.5 : rank === 0 ? 0.3 : 0.7;
    // `along` is measured from the lower-coordinate end of the line, not from the start of travel.
    const forward = s.b[0] > s.a[0] || (s.b[0] === s.a[0] && s.b[1] > s.a[1]);
    const f = forward ? along : 1 - along;
    const ux = (s.b[0] - s.a[0]) / s.len;
    const uy = (s.b[1] - s.a[1]) / s.len;
    out.push({
      x: fmt(s.a[0] + (s.b[0] - s.a[0]) * f - uy * 3.4),
      y: fmt(s.a[1] + (s.b[1] - s.a[1]) * f + ux * 3.4),
      angle: fmt((Math.atan2(uy, ux) * 180) / Math.PI),
      t: fmt((s.start + s.len * f) / total)
    });
  });
  return out;
}

const CHEVRON: readonly Pt[] = [[-2.4, -2], [1, 0], [-2.4, 2]];
const FOOT_L: readonly Pt[] = [[-5.9, -4.5], [-2.9, -4.5], [-2.9, 1.5], [-3.5, 4.5], [-5.3, 4.5], [-5.9, 1.5]];
const FOOT_R: readonly Pt[] = [[2.9, -4.5], [5.9, -4.5], [5.9, 1.5], [5.3, 4.5], [3.5, 4.5], [2.9, 1.5]];

export interface IsoPost {
  /** Movement number shown on the post. */
  n: number;
  t: number;
  x: number;
  y: number;
  faces: Faces;
  /** Centre of the number on the left face (labelled posts only). */
  label?: Pt;
}

export interface IsoModel {
  viewBox: string;
  base: Pt[];
  /** Mats, back to front. */
  plates: Faces[];
  /** Path data of the route on the top face. */
  route: string;
  arrows: { d: string; t: number }[];
  /** Posts, back to front. */
  posts: IsoPost[];
  /** The two footprints of the ready point (Joon-bi). */
  feet: Pt[][];
  /** A flag on a stem beside the footprints: where its stem stands and where its text starts. */
  flag?: { foot: Pt; top: Pt };
}

export interface IsoOptions {
  /** Fewer mats, smaller posts, no arrowheads, no numbers: the minimap. */
  compact?: boolean;
  /** Numbers on the posts and the ready flag. */
  labelled?: boolean;
  /** Show the ready flag (the caller has a label for it). */
  flag?: boolean;
}

export function buildTatamiIso(form: TulForm, options: IsoOptions = {}): IsoModel {
  const { compact = false, labelled = false, flag = false } = options;
  const pts = diagramPoints(form);
  const route = routeOf(pts);
  const stops = diagramStops(form);
  const size = compact ? POST.compact : POST.full;
  const numbered = labelled && !compact;

  const plates = plateRects(compact ? 2 : 4).map((r) => boxFaces(r.x0, r.y0, r.x1, r.y1, 0, PLATE_T));

  const posts: IsoPost[] = stops
    .map((s) => {
      const half = size.w / 2;
      const z1 = PLATE_T + size.h;
      const faces = boxFaces(s.x - half, s.y - half, s.x + half, s.y + half, PLATE_T, z1);
      const post: IsoPost = { n: s.move, t: s.t, x: s.x, y: s.y, faces };
      // The number sits on the left face, near its top: horizontal, never turned.
      if (numbered) post.label = project(s.x, s.y + half, z1 - size.h * 0.4);
      return post;
    })
    .sort((a, b) => a.x + a.y - (b.x + b.y));

  const arrows = compact
    ? []
    : routeArrows(route)
        .filter((a) => !stops.some((s) => Math.hypot(a.x - s.x, a.y - s.y) < ARROW_CLEAR))
        .map((a) => ({ d: pathOf(onFloor(CHEVRON, [a.x, a.y], a.angle, ROUTE_Z)), t: a.t }));

  const first = route.segs[0];
  const ready: Pt = first ? first.a : [50, 50];
  const readyAngle = first ? (Math.atan2(first.b[1] - first.a[1], first.b[0] - first.a[0]) * 180) / Math.PI + 90 : 0;
  const feet = [FOOT_L, FOOT_R].map((foot) => onFloor(foot, ready, readyAngle, ROUTE_Z));

  const flagAt: IsoModel['flag'] =
    numbered && flag
      ? { foot: project(ready[0] + 7, ready[1] + 7, ROUTE_Z), top: project(ready[0] + 7, ready[1] + 7, ROUTE_Z + FLAG_H) }
      : undefined;

  return {
    viewBox: `${VIEW_BOX.x} ${VIEW_BOX.y} ${VIEW_BOX.w} ${VIEW_BOX.h}`,
    base: baseQuad(),
    plates,
    route: routePath(pts),
    arrows,
    posts,
    feet,
    flag: flagAt
  };
}
