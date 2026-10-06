// The journey of the 3D belt as pure numbers: no three, no DOM. The scene (scene.ts) reads the beat
// progress that tul.ts writes as inline custom properties, asks this module for a `Frame` and draws it.
//
// One fixed full-viewport canvas carries the belt through the whole page. Where it is on screen comes
// from tables below and from a few metrics tul.ts publishes (never from layout reads in the scene):
//   land      the hero: the white belt falls onto the floor diagram (reads the hero's `--q`), rests there
//             and, once the hero scrolls away (`--e`), travels to the reserved column.
//   travel    inside a chapter: the belt sits in the reserved side column (see `--belt-col`), turns slowly
//             with the scroll (`--bp`) and its tails lean toward the route.
//   passage   the spacer between two chapters (`--p`): the belt rides the spacer to its centre, unties,
//             changes colour through a noise mask and ties again, then returns to the column.
//             The passage that arrives at 1st dan ties the belt red to black (the tie beat): the knot is
//             the centre of the black flood.
//   rest      travel on black: rim light so the black belt reads on the black field; it fades out before
//             the chapter ends, long before the close.
//
// Continuity: every beat ends in the pose the next one starts with (travel p = 1 equals passage p = 0,
// passage p = 1 equals travel p = 0), so switching beats never jumps.
import type { BeltKey } from './colors';

const DEG = Math.PI / 180;

export const FOV = 24;
/** Width of the belt (ring plus some air) in metres: the unit that turns a column width into pixels per metre. */
export const RING_W = 0.34;
/** Share of the reserved column the belt fills. */
export const COL_FILL = 0.9;
/** Height of the in-flow spacer as a fraction of the viewport (`--ink-h: 50svh` in InkPassage.astro). */
export const SPACER_VH = 0.5;
/** The belt never reaches further than this from its centre, loose tails and the perspective included (metres). */
export const REACH = 0.4;
/** Hero camera distance in metres (mirrors the CSS floor of FloorDiagram). */
const HERO_DIST = 2.05;
const HERO_TARGET: [number, number, number] = [0.07, -0.02, 0.08];
const TRAVEL_DIST = 1.7;
const TRAVEL_EL = 16 * DEG;
const TRAVEL_TARGET: [number, number, number] = [0, -0.09, 0];
/** The belt turns from -YAW to +YAW over a chapter. */
export const TRAVEL_YAW = 0.55;
/** The tie beat publishes the knot while the passage is below this progress (the flood is over at 0.5). */
export const KNOT_UNTIL = 0.55;

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
export const smooth = (x: number, a: number, b: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Viewport measures, in CSS pixels. `col` and `hero` are published by tul.ts. */
export interface Metrics {
  w: number;
  h: number;
  /** The reserved side column of the chapters (centre and size). */
  col: { x: number; y: number; w: number; h: number };
  /** The hero's floor box while the hero is pinned (centre and side). */
  hero: { x: number; y: number; s: number };
}

/** Camera: where the target is on screen, pixels per metre there, and the orbit. */
export interface Cam {
  sx: number;
  sy: number;
  ppm: number;
  elevation: number;
  dist: number;
  target: [number, number, number];
}

export type Pose =
  | { kind: 'floor'; landed: number; yaw: number; up: { y: number; z: number } }
  | { kind: 'hang'; yaw: number; k: number; lean: number };

export interface Frame {
  /** 0 = nothing to draw. */
  opacity: number;
  cam: Cam;
  pose: Pose;
  /** With `blend` > 0 the belt is drawn between `pose` and `poseB`. */
  poseB?: Pose;
  blend: number;
  from: BeltKey;
  to: BeltKey;
  /** Noise-mask blend from `from` to `to`, 0..1. */
  mix: number;
  /** Stitches towards gold, 0..1. */
  gold: number;
  /** Rim light on the black belt, 0..1. */
  rim: number;
  /** The tie beat: the scene publishes the knot's screen position while this is true. */
  tie: boolean;
  /** The hero belt is at rest, so the scene may add its idle sway. */
  resting: boolean;
}

export type BeatKind = 'land' | 'travel' | 'passage';

export interface Beat {
  kind: BeatKind;
  belt: BeltKey;
  from: BeltKey;
}

/** Progress of each beat in document order; the active beat is the last one that has started. */
export function pickBeat(progress: ArrayLike<number>): number {
  let idx = 0;
  for (let i = 0; i < progress.length; i++) if (progress[i] > 0) idx = i;
  return idx;
}

export function columnPpm(m: Metrics): number {
  return (COL_FILL * m.col.w) / RING_W;
}

function centrePpm(m: Metrics): number {
  return Math.min(0.3 * m.h, 0.3 * m.w) / RING_W;
}

function heroPpm(m: Metrics): number {
  return m.hero.s / (2 * HERO_DIST * Math.tan((FOV / 2) * DEG));
}

/**
 * Side of the square canvas, in CSS px. The canvas is fixed and travels with the belt (the scene moves it
 * with a transform), so it only has to hold the belt's reach around its centre at the largest scale of the
 * journey, not the whole viewport: a fraction of the pixels (and of the antialiasing cost) of a full-screen layer.
 */
export function canvasSize(m: Metrics): number {
  return Math.ceil(2 * REACH * Math.max(columnPpm(m), centrePpm(m), heroPpm(m)));
}

export function travelCam(m: Metrics): Cam {
  return { sx: m.col.x, sy: m.col.y, ppm: columnPpm(m), elevation: TRAVEL_EL, dist: TRAVEL_DIST, target: TRAVEL_TARGET };
}

function lerpCam(a: Cam, b: Cam, t: number): Cam {
  return {
    sx: lerp(a.sx, b.sx, t),
    sy: lerp(a.sy, b.sy, t),
    ppm: lerp(a.ppm, b.ppm, t),
    elevation: lerp(a.elevation, b.elevation, t),
    dist: lerp(a.dist, b.dist, t),
    target: [lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t)]
  };
}

const travelYaw = (p: number): number => -TRAVEL_YAW + 2 * TRAVEL_YAW * clamp01(p);

/** The hero: land (q), rest, then leave for the column (e). `yawExtra` carries the idle sway and the drag. */
export function heroFrame(q: number, e: number, m: Metrics, yawExtra: number): Frame {
  const reveal = clamp01((q - 0.3) / 0.7);
  // The drop starts once the portrait is mostly gone, and lands as the line starts tracing.
  const landed = clamp01((q - 0.6) / 0.38);
  const elevation = (90 - 50 * reveal) * DEG;
  const cam: Cam = {
    sx: m.hero.x,
    sy: m.hero.y,
    ppm: heroPpm(m),
    elevation,
    dist: HERO_DIST,
    target: HERO_TARGET
  };
  const pose: Pose = {
    kind: 'floor',
    landed,
    // Same numbers as the CSS floor: yaw -8 degrees * reveal.
    yaw: 8 * DEG * reveal + yawExtra,
    // Screen-up in model space, so the drop starts off the top edge whatever the tilt is.
    up: { y: Math.cos(elevation), z: -Math.sin(elevation) }
  };
  const blend = smooth(e, 0, 1);
  const frame: Frame = {
    opacity: landed > 0 ? 1 : 0,
    cam,
    pose,
    blend: 0,
    from: 'blanco',
    to: 'blanco',
    mix: 0,
    gold: 0,
    rim: 0,
    tie: false,
    resting: landed >= 1 && blend === 0
  };
  if (blend > 0) {
    frame.cam = lerpCam(cam, travelCam(m), blend);
    frame.poseB = { kind: 'hang', yaw: travelYaw(0), k: 1, lean: 1 };
    frame.blend = blend;
  }
  return frame;
}

/** Inside a chapter: the belt in its column. On black (`rest`) it carries the rim light and fades out near the end. */
export function travelFrame(belt: BeltKey, p: number, m: Metrics): Frame {
  const black = belt === 'negro';
  return {
    opacity: black ? 1 - smooth(p, 0.9, 0.98) : 1,
    cam: travelCam(m),
    pose: { kind: 'hang', yaw: travelYaw(p), k: 1, lean: 1 },
    blend: 0,
    from: belt,
    to: belt,
    mix: 0,
    gold: black ? 1 : 0,
    rim: black ? 1 : 0,
    tie: false,
    resting: false
  };
}

/** Where the belt is between two chapters. `to === 'negro'` is the tie beat. */
export function passageFrame(from: BeltKey, to: BeltKey, p: number, m: Metrics): Frame {
  const tie = to === 'negro';
  // Out to the centre of the spacer and back.
  const out = smooth(p, 0.3, 0.44) - smooth(p, 0.56, 0.7);
  // The belt rides the spacer (it scrolls up with it) while it is away from the column, so it never leaves
  // the empty box between the chapters. In the column it is free to be anywhere.
  const rideY = Math.min(0.8 * m.h, Math.max(0.2 * m.h, m.h * (1 + SPACER_VH / 2 - (1 + SPACER_VH) * p)));
  const follow = smooth(p, 0, 0.3) * (1 - smooth(p, 0.7, 1));
  const cam: Cam = {
    sx: lerp(m.col.x, m.w / 2, out),
    sy: lerp(m.col.y, rideY, follow),
    ppm: lerp(columnPpm(m), centrePpm(m), out),
    elevation: TRAVEL_EL,
    dist: TRAVEL_DIST,
    target: TRAVEL_TARGET
  };
  // k: 1 = tied, 0 = loose. Ordinary passage: untie, change colour while loose, tie again.
  // Tie beat: untie early, then tie while the colour turns black and the stitches go gold.
  const k = tie ? 1 - smooth(p, 0.08, 0.26) + smooth(p, 0.3, 0.62) : 1 - smooth(p, 0.3, 0.46) + smooth(p, 0.54, 0.72);
  const mix = tie ? smooth(p, 0.3, 0.58) : smooth(p, 0.44, 0.56);
  return {
    opacity: 1,
    cam,
    pose: { kind: 'hang', yaw: TRAVEL_YAW - 2 * TRAVEL_YAW * smooth(p, 0.1, 0.9), k, lean: 1 - out },
    blend: 0,
    from,
    to,
    mix,
    gold: tie ? smooth(p, 0.62, 0.9) : 0,
    rim: tie ? smooth(p, 0.3, 0.6) : 0,
    tie: tie && p <= KNOT_UNTIL,
    resting: false
  };
}

/** The frame for the active beat. `q`/`e` are the hero's, `p` is the beat's own progress. */
export function frameFor(beat: Beat, p: number, q: number, e: number, m: Metrics, yawExtra: number): Frame {
  if (beat.kind === 'land') return heroFrame(q, e, m, yawExtra);
  if (beat.kind === 'travel') return travelFrame(beat.belt, p, m);
  return passageFrame(beat.from, beat.belt, p, m);
}
