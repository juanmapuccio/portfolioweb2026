// Pure pose functions for the two moments. Every call starts from the modelled rest transform
// (`resetPose`), so a pose depends only on its inputs and scrubbing back and forth is exact.
// No physics: part transforms and colours are interpolated.
import { Color } from 'three';
import { BELT_COLORS, STITCH_GOLD } from './colors';
import type { ProceduralBelt } from './proceduralBelt';

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
const smooth = (x: number, a: number, b: number): number => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number): number => {
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const RED = new Color(BELT_COLORS.rojo);
const BLACK = new Color(BELT_COLORS.negro);
const GOLD = new Color(STITCH_GOLD);
const tmp = new Color();

/**
 * Moment A: a white belt falls from above the frame and lies on the floor.
 * `landed` 0..1 is the drop (0 = above the frame, 1 = resting); `up` is the screen-up direction in
 * model space, so the fall always starts off the top edge whatever the camera tilt is.
 */
export function poseFloor(
  belt: ProceduralBelt,
  landed: number,
  up: { y: number; z: number },
  yaw: number
): void {
  belt.resetPose();
  const fall = 1 - easeOutCubic(clamp01(landed));
  const { group, parts } = belt;

  group.position.set(0, up.y * fall * 1.15, up.z * fall * 1.15);
  group.rotation.set(fall * 0.9, yaw, fall * -0.45, 'YXZ');

  // The tails flop down flat in the last part of the drop.
  const flat = smooth(landed, 0.45, 0.95);
  parts.tailL.rotation.x += -Math.PI / 2 * flat;
  parts.tailR.rotation.x += -Math.PI / 2 * flat;
  // A little flutter while still in the air.
  const flutter = fall * (1 - flat);
  parts.tailL.rotation.z += -0.25 * flutter;
  parts.tailR.rotation.z += 0.3 * flutter;
}

/**
 * Moment B: a red, loosely open belt is tied and turns black.
 * k 0..1: colour (red to black), wraps settle, knot pops tight (scale, rotate, settle), flaps and
 * tails fall into place, stitches turn gold at the end.
 */
export function poseTie(belt: ProceduralBelt, k: number): void {
  belt.resetPose();
  const { parts, materials } = belt;

  tmp.copy(RED).lerp(BLACK, smooth(k, 0.12, 0.55));
  belt.setColors(tmp);
  materials.stitch.color.lerp(GOLD, smooth(k, 0.8, 1));

  // Wraps settle onto the band.
  const wr = smooth(k, 0.05, 0.5);
  parts.wraps.position.z += 0.035 * (1 - wr);
  parts.wraps.position.y += 0.012 * (1 - wr);
  parts.wraps.rotation.y += 0.28 * (1 - wr);

  // Knot: loose and small, then pops tight (overshoot), rotating into place.
  const kp = smooth(k, 0.22, 0.62);
  const pop = easeOutBack(kp);
  const s = 0.62 + 0.38 * pop;
  parts.knot.scale.setScalar(s);
  parts.knot.rotation.z += 0.45 * (1 - pop);
  parts.knot.rotation.x += 0.3 * (1 - kp);
  parts.knot.position.y += -0.014 * (1 - kp);
  parts.knot.position.z += 0.012 * (1 - kp);

  // Flaps drop from a splayed, drooping position.
  const fl = smooth(k, 0.3, 0.75);
  const flop = 1 - easeOutBack(fl);
  parts.flapL.rotation.z += 0.9 * flop;
  parts.flapR.rotation.z += -0.9 * flop;
  parts.flapL.rotation.y += 0.5 * flop;
  parts.flapR.rotation.y += -0.5 * flop;

  // Tails start splayed out and swung forward, then fall into place.
  const tl = smooth(k, 0.35, 0.92);
  const fall = 1 - easeOutBack(tl);
  parts.tailL.rotation.z += -0.7 * fall;
  parts.tailR.rotation.z += 0.7 * fall;
  parts.tailL.rotation.x += -0.45 * fall;
  parts.tailR.rotation.x += -0.35 * fall;
}
