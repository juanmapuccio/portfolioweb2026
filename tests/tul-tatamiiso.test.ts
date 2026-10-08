import { describe, expect, test } from 'bun:test';
import { RETURN_FORM, TUL_CHAPTERS } from '../src/data/tuls';
import { pointAt, routeOf } from '../src/data/tulRoute';
import {
  FLOOR_MAX,
  FLOOR_MIN,
  PLATE_T,
  SEAM,
  VIEW_BOX,
  boxFaces,
  buildTatamiIso,
  diagramPoints,
  diagramStops,
  plateRects,
  project,
  routeArrows,
  type Pt
} from '../src/components/tul/tatamiIso';

const FORMS = [...Object.values(TUL_CHAPTERS).flatMap((c) => c.forms), RETURN_FORM];
const close = (a: number, b: number, eps = 1e-9) => expect(Math.abs(a - b)).toBeLessThan(eps);
/** Area of a polygon (shoelace). */
const area = (pts: readonly Pt[]) => Math.abs(pts.reduce((s, p, i) => s + p[0] * pts[(i + 1) % pts.length][1] - pts[(i + 1) % pts.length][0] * p[1], 0)) / 2;
const inside = ([x, y]: Pt, eps = 0.05) =>
  x >= VIEW_BOX.x - eps && x <= VIEW_BOX.x + VIEW_BOX.w + eps && y >= VIEW_BOX.y - eps && y <= VIEW_BOX.y + VIEW_BOX.h + eps;
const pathPoints = (d: string): Pt[] => [...d.matchAll(/[ML]\s*(-?[\d.]+)\s+(-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])] as const);

describe('isometric projection', () => {
  test('the three axes have the same length on screen: x runs right and down, y left and down, z up', () => {
    const o = project(0, 0, 0);
    const x = project(1, 0, 0);
    const y = project(0, 1, 0);
    const z = project(0, 0, 1);
    expect(o).toEqual([0, 0]);
    for (const [a, b] of [[x, 1], [y, 1], [z, 1]] as const) close(Math.hypot(a[0], a[1]), b);
    expect(x[0]).toBeGreaterThan(0);
    expect(x[1]).toBeGreaterThan(0);
    expect(y[0]).toBeLessThan(0);
    expect(y[1]).toBeGreaterThan(0);
    close(x[0], -y[0]);
    close(x[1], y[1]);
    expect(z).toEqual([0, -1]);
    // 30 degrees from the horizontal.
    close((Math.atan2(x[1], x[0]) * 180) / Math.PI, 30, 1e-9);
  });

  test('the three faces of a box that look at the viewer are projected with the right areas and share their edges', () => {
    const w = 10;
    const d = 6;
    const h = 4;
    const f = boxFaces(0, 0, w, d, 0, h);
    const k = Math.cos(Math.PI / 6);
    close(area(f.top), w * d * k);
    close(area(f.left), w * h * k);
    close(area(f.right), d * h * k);
    // The front vertical edge (x1, y1) is shared by the left and right faces; the top face ends on its top.
    expect(f.left[1]).toEqual(f.right[1]);
    expect(f.left[2]).toEqual(f.right[2]);
    expect(f.top[2]).toEqual(f.left[1]);
    // Left looks left and down: it lies left of the front edge. Right lies right of it.
    for (const p of f.left) expect(p[0]).toBeLessThanOrEqual(f.left[1][0] + 1e-9);
    for (const p of f.right) expect(p[0]).toBeGreaterThanOrEqual(f.right[1][0] - 1e-9);
  });
});

describe('tatami plates', () => {
  test('four rows of 2:1 mats make ten plates, two rows make three (the minimap)', () => {
    expect(plateRects(4).length).toBe(10);
    expect(plateRects(2).length).toBe(3);
  });

  test('plates lie inside the floor, never overlap and keep the seam between neighbours', () => {
    for (const rows of [2, 4]) {
      const rects = plateRects(rows);
      for (const r of rects) {
        expect(r.x0).toBeGreaterThanOrEqual(FLOOR_MIN);
        expect(r.x1).toBeLessThanOrEqual(FLOOR_MAX);
        expect(r.y0).toBeGreaterThanOrEqual(FLOOR_MIN);
        expect(r.y1).toBeLessThanOrEqual(FLOOR_MAX);
        expect(r.x1).toBeGreaterThan(r.x0);
      }
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          const gapX = Math.max(a.x0 - b.x1, b.x0 - a.x1);
          const gapY = Math.max(a.y0 - b.y1, b.y0 - a.y1);
          // Disjoint, and at least a seam apart along one axis.
          expect(Math.max(gapX, gapY)).toBeGreaterThanOrEqual(SEAM - 1e-9);
        }
      }
    }
  });

  test('the odd rows are shifted by half a mat, like the 3D floor', () => {
    const rects = plateRects(4);
    const row = (y: number) => rects.filter((r) => Math.abs(r.y0 - (FLOOR_MIN + 27 * y) - SEAM / 2) < 1e-9);
    expect(row(0).map((r) => Math.round(r.x1 - r.x0 + SEAM))).toEqual([54, 54]);
    expect(row(1).map((r) => Math.round(r.x1 - r.x0 + SEAM))).toEqual([27, 54, 27]);
    expect(row(2).length).toBe(2);
    expect(row(3).length).toBe(3);
  });

  test('plates come back to front: no later plate is entirely behind an earlier one', () => {
    for (const rows of [2, 4]) {
      const rects = plateRects(rows);
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          // A plate can hide another only if they share the view line: smaller x (or y) and not entirely beyond the other axis.
          const behind =
            (rects[j].x1 <= rects[i].x0 && rects[j].y0 < rects[i].y1) || (rects[j].y1 <= rects[i].y0 && rects[j].x0 < rects[i].x1);
          expect(behind).toBe(false);
        }
      }
    }
  });
});

describe('the model of every form', () => {
  for (const form of FORMS) {
    for (const compact of [false, true]) {
      test(`${form.id}${compact ? ' (compact)' : ''}: everything stays inside the view box`, () => {
        const m = buildTatamiIso(form, { compact, labelled: true, flag: true });
        const all: Pt[] = [
          ...m.base,
          ...m.plates.flatMap((p) => [...p.top, ...p.left, ...p.right]),
          ...pathPoints(m.route),
          ...m.arrows.flatMap((a) => pathPoints(a.d)),
          ...m.posts.flatMap((p) => [...p.faces.top, ...p.faces.left, ...p.faces.right]),
          ...m.feet.flat()
        ];
        for (const p of all) expect(inside(p)).toBe(true);
        if (m.flag) {
          expect(inside(m.flag.foot)).toBe(true);
          expect(inside(m.flag.top)).toBe(true);
        }
      });
    }

    test(`${form.id}: one post per stop, at the stop's place, back to front`, () => {
      const m = buildTatamiIso(form, { labelled: true });
      const stops = diagramStops(form);
      expect(m.posts.length).toBe(stops.length);
      for (const s of stops) expect(m.posts.some((p) => p.x === s.x && p.y === s.y && p.t === s.t && p.n === s.move)).toBe(true);
      for (let i = 1; i < m.posts.length; i++) expect(m.posts[i].x + m.posts[i].y).toBeGreaterThanOrEqual(m.posts[i - 1].x + m.posts[i - 1].y);
    });

    test(`${form.id}: the route passes through every vertex of the form on the top face`, () => {
      const m = buildTatamiIso(form);
      const got = pathPoints(m.route);
      const want = diagramPoints(form).map(([x, y]) => project(x, y, PLATE_T + 0.2));
      expect(got.length).toBe(want.length);
      got.forEach((p, i) => {
        close(p[0], want[i][0], 0.01);
        close(p[1], want[i][1], 0.01);
      });
    });
  }

  test('the full diagram has ten plates and arrowheads; the minimap has three plates, no arrowheads, no numbers', () => {
    const form = TUL_CHAPTERS.amarillo.forms[0];
    const full = buildTatamiIso(form, { labelled: true });
    const mini = buildTatamiIso(form, { compact: true, labelled: true });
    expect(full.plates.length).toBe(10);
    expect(full.arrows.length).toBeGreaterThan(3);
    expect(full.posts.every((p) => p.label)).toBe(true);
    expect(mini.plates.length).toBe(3);
    expect(mini.arrows.length).toBe(0);
    expect(mini.posts.every((p) => p.label === undefined)).toBe(true);
    expect(area(mini.posts[0].faces.top)).toBeLessThan(area(full.posts[0].faces.top));
  });

  test('a number sits on the left face of its post, horizontally inside it, with room for two digits', () => {
    for (const form of FORMS) {
      for (const post of buildTatamiIso(form, { labelled: true }).posts) {
        const left = post.faces.left;
        const xs = left.map((p) => p[0]);
        const label = post.label as Pt;
        expect(label[0]).toBeGreaterThan(Math.min(...xs));
        expect(label[0]).toBeLessThan(Math.max(...xs));
        // Two digits at the label font size (4.6 units, about 0.6 wide each) fit the face width.
        expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(2 * 0.6 * 4.6);
        // Vertically inside the face at the label's x (the face is a parallelogram with vertical sides).
        const top = Math.min(...left.map((p) => p[1]));
        const bottom = Math.max(...left.map((p) => p[1]));
        expect(label[1]).toBeGreaterThan(top);
        expect(label[1]).toBeLessThan(bottom);
      }
    }
  });

  test('the ready flag exists only on a labelled, full diagram that was given a label', () => {
    const form = TUL_CHAPTERS.blanco.forms[0];
    expect(buildTatamiIso(form, { labelled: true, flag: true }).flag).toBeDefined();
    expect(buildTatamiIso(form, { labelled: true }).flag).toBeUndefined();
    expect(buildTatamiIso(form, { flag: true }).flag).toBeUndefined();
    expect(buildTatamiIso(form, { compact: true, labelled: true, flag: true }).flag).toBeUndefined();
  });

  test('two footprints at the ready point, and the Kyong-ye line comes back to them', () => {
    const m = buildTatamiIso(TUL_CHAPTERS.blanco.forms[0]);
    expect(m.feet.length).toBe(2);
    for (const foot of m.feet) expect(foot.length).toBe(6);
    const ret = pathPoints(buildTatamiIso(RETURN_FORM).route);
    expect(ret[0]).toEqual(ret[ret.length - 1]);
  });

  test('arrowheads keep out of the posts and appear along the draw, in order of the route', () => {
    for (const form of FORMS) {
      const m = buildTatamiIso(form, { labelled: true });
      for (const a of m.arrows) {
        expect(a.t).toBeGreaterThanOrEqual(0);
        expect(a.t).toBeLessThanOrEqual(1);
      }
    }
    // Segments that retrace the same line get arrows at different places along it.
    const arrows = routeArrows(routeOf(diagramPoints(TUL_CHAPTERS.blanco.forms[0])));
    const keys = new Set(arrows.map((a) => `${a.x},${a.y}`));
    expect(keys.size).toBe(arrows.length);
  });
});

describe('route math shared with the 3D scene', () => {
  test('the stops of the SVG and of the data-tatami are the same points', () => {
    const form = TUL_CHAPTERS.amarillo.forms[0];
    const route = routeOf(diagramPoints(form));
    form.stops.forEach((stop, i) => {
      const p = pointAt(route, stop.t);
      close(diagramStops(form)[i].x, p[0], 0.006);
      close(diagramStops(form)[i].y, p[1], 0.006);
    });
  });

  test('pointAt walks the polyline by length and clamps its ends', () => {
    const route = routeOf([[0, 0], [10, 0], [10, 10]]);
    expect(route.total).toBe(20);
    expect(pointAt(route, 0)).toEqual([0, 0]);
    expect(pointAt(route, 0.25)).toEqual([5, 0]);
    expect(pointAt(route, 0.75)).toEqual([10, 5]);
    expect(pointAt(route, 1)).toEqual([10, 10]);
    expect(pointAt(route, 2)).toEqual([10, 10]);
    expect(pointAt(route, -1)).toEqual([0, 0]);
    expect(pointAt(routeOf([]), 0.5)).toEqual([0, 0]);
  });
});
