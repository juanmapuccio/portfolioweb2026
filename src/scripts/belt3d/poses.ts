// Pure pose functions for the belt. Every call starts from the modelled rest transform
// (`resetPose`), so a pose depends only on its inputs and scrubbing back and forth is exact.
// No physics: part transforms are interpolated. Colours are not set here: the scene sets them from the
// frame (journey.ts), so one pose serves every belt colour.
import { Quaternion, Vector3, type Object3D } from 'three';
import type { Pose } from './journey';
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

/**
 * The hero beat: a white belt falls from above the frame and lies on the floor.
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
  group.scale.setScalar(1);

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
 * The knot geometry, k 0..1: loose and open at 0, tied at 1 (the rest pose). Wraps settle onto the band,
 * the knot pops tight (scale, rotate, settle) and the flaps and tails fall into place.
 * Used by the tie beat (red to black), by every untie and retie, and as the base of the hanging pose.
 */
export function poseTie(belt: ProceduralBelt, k: number): void {
  belt.resetPose();
  const { parts } = belt;

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

/**
 * The belt standing, as it hangs in the column and rides the spacers: turned by `yaw` about its axis,
 * knot tightness `k`, and the tails swung toward the route (to the left on screen) by `lean` 0..1.
 */
export function poseHang(belt: ProceduralBelt, spec: { yaw: number; k: number; lean: number }): void {
  poseTie(belt, spec.k);
  const { group, parts } = belt;
  group.position.set(0, 0, 0);
  group.scale.setScalar(1);
  group.rotation.set(0, spec.yaw, 0, 'YXZ');
  parts.tailL.rotation.z += -0.38 * spec.lean;
  parts.tailR.rotation.z += -0.58 * spec.lean;
}

export function applyPose(belt: ProceduralBelt, pose: Pose): void {
  if (pose.kind === 'floor') poseFloor(belt, pose.landed, pose.up, pose.yaw);
  else poseHang(belt, pose);
}

interface Snap {
  p: Vector3;
  q: Quaternion;
  s: Vector3;
}

const nodesOf = (belt: ProceduralBelt): Object3D[] => {
  const { parts } = belt;
  return [belt.group, parts.band, parts.wraps, parts.knot, parts.flapL, parts.flapR, parts.tailL, parts.tailR];
};

const snapshot = (nodes: Object3D[]): Snap[] =>
  nodes.map((o) => ({ p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone() }));

/** Draws the belt between two poses (the hero floor to the hanging pose of the column): `t` 0 is `a`, 1 is `b`. */
export function blendPose(belt: ProceduralBelt, a: Pose, b: Pose, t: number): void {
  const nodes = nodesOf(belt);
  applyPose(belt, a);
  const sa = snapshot(nodes);
  applyPose(belt, b);
  const sb = snapshot(nodes);
  nodes.forEach((o, i) => {
    o.position.lerpVectors(sa[i].p, sb[i].p, t);
    o.quaternion.slerpQuaternions(sa[i].q, sb[i].q, t);
    o.scale.lerpVectors(sa[i].s, sb[i].s, t);
  });
}
