/**
 * Route math of a tul diagram: plain numbers, no DOM. Shared by the build (FloorDiagram, TatamiIso) and by the
 * 3D scene (belt3d/journey.ts), so the stops sit at the same place in the SVG and on the tatami.
 *
 * Points are in diagram units (0..100). A route is a polyline; `t` is the fraction of its length.
 */
export type Pt = readonly [x: number, y: number];

export interface RouteSegment {
  a: Pt;
  b: Pt;
  len: number;
  /** Length of the route before this segment. */
  start: number;
}

export interface Route {
  segs: RouteSegment[];
  total: number;
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** Segments of a polyline with their cumulative lengths. */
export function routeOf(points: readonly Pt[]): Route {
  const segs: RouteSegment[] = [];
  let acc = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len, start: acc });
    acc += len;
  }
  return { segs, total: acc };
}

/** The point at fraction `t` (0..1) of the route length. An empty route has no point: the origin. */
export function pointAt(route: Route, t: number): Pt {
  const last = route.segs[route.segs.length - 1];
  if (!last) return [0, 0];
  const target = clamp01(t) * route.total;
  const seg = route.segs.find((s) => target <= s.start + s.len) ?? last;
  const k = seg.len === 0 ? 0 : (target - seg.start) / seg.len;
  return [seg.a[0] + (seg.b[0] - seg.a[0]) * k, seg.a[1] + (seg.b[1] - seg.a[1]) * k];
}
