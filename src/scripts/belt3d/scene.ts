// The 3D scene: the module that imports three (with proceduralBelt, poses and tatami). It is loaded lazily by
// boot.ts: after load on desktop, or on a tap of "Ver en 3D" on a phone.
//
// Architecture: ONE WebGLRenderer on ONE fixed full-viewport canvas (position: fixed, pointer-events: none,
// above the field and the black flood, below the header). Two things are drawn in ONE Scene, each by its own
// camera on its own layer, one after the other: the tatami (tatami.ts: the 3D version of the floor of
// FloorDiagram, whose isometric SVG is the fallback) and, on top, the belt (journey.ts: the thread of the journey).
// The belt lands on the hero tatami (same camera) and travels each chapter in the reserved column, where it
// unties, changes colour and ties again in every spacer; it ties red to black at 1st dan (its knot is the
// centre of the black flood) and rests on black until it fades out. The route of the belt is journey.ts (pure
// numbers); this file draws it.
//
// Reads, never layout: tul.ts writes inline custom properties and this file only reads them from `el.style`:
//   [data-belt-beat="land"]     --p, --q (portrait to path), --e (the hero scrolling away)
//   [data-belt-beat="travel"]   --bp (0..1 across the chapter)
//   [data-belt-beat="passage"]  --p (0..1 while the spacer crosses the viewport)
//   [data-tul-scene]            --p, --draw of the scene that holds a [data-tatami] diagram
//   <html>                      --belt-vw/vh (the viewport), --belt-col-x/y/w/h (the reserved column),
//                               --belt-hero-x/y/s (the hero floor box) and --belt-tat-x/y/s (a chapter map)
// The active beat is the last one that has started, so no visibility observer is needed: the belt is on
// screen exactly while a beat is in progress.
// Writes: html[data-belt3d="ready"] after the first drawn frame (the posters step aside), [data-tatami-live]
// on the scene whose tatami is drawn (its isometric SVG steps aside) and, during the tie beat only,
// --knot-x / --knot-y (viewport px) on <html>.
//
// Pointer: the canvas never takes events. A pointer move over the tatami casts ONE ray (hover: the post lights up
// and a tooltip with the role shows); a click, or a touch tap, on a post opens the experience panel. Mouse
// parallax (+-3 degrees, lerped in the ticker) is off with reduced motion and in the on-demand phone mode.
// The milestone rows in the HTML stay the accessible path; the tatami is aria-hidden.
//
// Frames: only gsap's ticker. A frame is drawn only when its inputs changed (plus a 30 fps idle sway
// while the hero belt rests). GL resources are disposed when nothing needs them for a while and rebuilt on return.
import { gsap } from 'gsap';
import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  type Texture,
  Vector3,
  WebGLRenderer
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BELT_COLORS, BELT_LINES, FIELD_DARK, FIELD_LIGHT, STITCH_GOLD, isBeltKey, type BeltKey } from './colors';
import { routeOf, type Route } from '../../data/tulRoute';
import { isBelt3dEligible } from './eligible';
import {
  FLOOR_W,
  FOV,
  PARALLAX_DEG,
  frameFor,
  pickBeat,
  stageOffset,
  stageScore,
  tapBeltFrame,
  tatamiChapterFrame,
  tatamiHeroFrame,
  tatamiLowFrame,
  type Beat,
  type Cam,
  type Frame,
  type Metrics,
  type TatamiFrame
} from './journey';
import { applyPose, blendPose } from './poses';
import { createProceduralBelt, type ProceduralBelt } from './proceduralBelt';
import { TATAMI_LAYER, createTatami, type Tatami, type TatamiData } from './tatami';
import { createTip, type Tip } from './tatamiTip';
import { openExperience } from '../experiencePanel';

interface BeatEl extends Beat {
  el: HTMLElement;
  /** The chapter's closing scene (`[data-belt-outro]`), whose progress moves the resting belt. */
  outro?: HTMLElement;
}

/** A diagram that can be drawn as a tatami: the full FloorDiagram of the hero, a chapter or a black passage. */
interface TatamiEntry {
  key: string;
  /** The scene that scrubs this diagram (`--p`, `--draw`, and `--en` / `--ex` / `--tat-*` from tul.ts). */
  scene: HTMLElement;
  hero: boolean;
  /** The low camera of the red automation beat (`data-tatami-low`): it follows `route`. */
  low: boolean;
  route: Route;
  belt: BeltKey;
  data: TatamiData;
}

interface TatamiView {
  entry: TatamiEntry;
  frame: TatamiFrame;
  /** 0..1 of the route. */
  draw: number;
  /** Show every post whatever `draw` is (the on-demand phone view has no scroll-drawn route). */
  all: boolean;
  /** The hero scene while it is still leaving: its floor was drawn in 3D, so its SVG must not pop up as it goes. */
  keep?: HTMLElement;
}

interface View {
  scene: Scene;
  camera: PerspectiveCamera;
  /** Camera of the tatami. */
  tcam: PerspectiveCamera;
  belt: ProceduralBelt;
  tatami: Tatami;
  rimLights: DirectionalLight[];
}

const PIXEL_RATIO_CAP = 1.5;
/** Dispose GL resources after nothing has needed them for this long. */
const TEARDOWN_DELAY_MS = 4000;
const IDLE_FRAME_MS = 1000 / 30;
/** While there is no renderer, check this often whether one is needed. */
const WATCH_MS = 100;
const DEG = Math.PI / 180;
const KEY_PROGRESS: Record<Beat['kind'], string> = { land: '--p', travel: '--bp', passage: '--p' };
/** A touch that moves further than this (px) is a scroll, not a tap. */
const TAP_SLOP = 10;
/** The tatami answers the pointer from this opacity up. */
const TATAMI_ACTIVE = 0.5;

const readNum = (el: HTMLElement, name: string, fallback: number): number => {
  const v = parseFloat(el.style.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

const root = document.documentElement;
const beats: BeatEl[] = [];
const tatamis: TatamiEntry[] = [];
const progress: number[] = [];
const metrics: Metrics = {
  w: 0,
  h: 0,
  col: { x: 0, y: 0, w: 0, h: 0 },
  hero: { x: 0, y: 0, s: 0 }
};
const colour = new Map<BeltKey, Color>();
const goldColour = new Color(STITCH_GOLD);
const knotWorld = new Vector3();
const postWorld = new Vector3();
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

let started = false;
let ticking = false;
/** On-demand phone mode (the "Ver en 3D" button): the hero tatami and belt only, no scroll journey. */
let tap = false;
/** tul.ts has published the viewport and the boxes the scene needs. */
let columnOk = false;
let heroAnchor: HTMLElement | undefined;
let renderer: WebGLRenderer | undefined;
let canvas: HTMLCanvasElement | undefined;
let tip: Tip | undefined;
/** `w x h` the drawing buffer was sized for. */
let sized = '';
let envTexture: Texture | undefined;
let view: View | undefined;
let lost = false;
let force = true;
let ready = false;
let knotPublished = false;
let lastKey = '';
let lastOpacity = -1;
/** Last time a frame was drawn, or the last look at the beats while there is no renderer. */
let lastTime = 0;
let parTime = 0;
let activeIdx = 0;
let teardownTimer: ReturnType<typeof setTimeout> | undefined;
/** The tatami drawn by the last frame; the pointer handlers read it. */
let lastView: TatamiView | undefined;
let live: HTMLElement[] = [];
let hoverIdx = -1;
let pointerBound = false;
let touchStart: { x: number; y: number } | undefined;

// Hero drag: rotation about Y with an elastic return.
const drag = { y: 0, pointerX: 0, base: 0, down: false };
// Mouse parallax: `t*` is where the pointer is (-1..1), the others follow it.
const par = { x: 0, y: 0, tx: 0, ty: 0 };

const paletteOf = (key: BeltKey): Color => {
  let c = colour.get(key);
  if (!c) {
    c = new Color(BELT_COLORS[key]);
    colour.set(key, c);
  }
  return c;
};

function readMetrics(): void {
  metrics.w = readNum(root, '--belt-vw', 0);
  metrics.h = readNum(root, '--belt-vh', 0);
  metrics.col.x = readNum(root, '--belt-col-x', 0);
  metrics.col.y = readNum(root, '--belt-col-y', 0);
  metrics.col.w = readNum(root, '--belt-col-w', 0);
  metrics.col.h = readNum(root, '--belt-col-h', 0);
  metrics.hero.x = readNum(root, '--belt-hero-x', 0);
  metrics.hero.y = readNum(root, '--belt-hero-y', 0);
  metrics.hero.s = readNum(root, '--belt-hero-s', 0);
  // The phone view only needs the hero floor; the desktop journey needs the reserved column.
  columnOk = metrics.w > 0 && metrics.h > 0 && (tap ? metrics.hero.s > 0 : metrics.col.w > 0);
}

function lights(scene: Scene, env: Texture | undefined): DirectionalLight[] {
  scene.environment = env ?? null;
  scene.environmentIntensity = 0.4;
  const key = new DirectionalLight(0xffffff, 1.9);
  key.position.set(-0.8, 1.3, 0.9);
  const fill = new DirectionalLight(0xdfe8ff, 0.2);
  fill.position.set(1, 0.4, 0.6);
  // Key and fill also light the tatami (layer 1).
  for (const l of [key, fill]) {
    l.layers.enable(TATAMI_LAYER);
    scene.add(l);
  }
  // Rim lights from behind and from the sides: off on white, they outline the black belt on the black field.
  const rimBack = new DirectionalLight(0xe4ecff, 0);
  rimBack.position.set(-0.7, 0.8, -1.2);
  scene.add(rimBack);
  const rimSide = new DirectionalLight(0xfff1dd, 0);
  rimSide.position.set(1.2, 0.5, -0.5);
  scene.add(rimSide);
  return [rimBack, rimSide];
}

function createView(): View {
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.05, 10);
  const tcam = new PerspectiveCamera(FOV, 1, 0.05, 10);
  tcam.layers.set(TATAMI_LAYER);
  const belt = createProceduralBelt({ color: BELT_COLORS.blanco });
  scene.add(belt.group);
  const tatami = createTatami();
  scene.add(tatami.group);
  const rimLights = lights(scene, envTexture);
  return { scene, camera, tcam, belt, tatami, rimLights };
}

function setReady(on: boolean): void {
  if (on === ready) return;
  ready = on;
  if (on) root.dataset.belt3d = 'ready';
  else delete root.dataset.belt3d;
}

/** The scene whose tatami is on screen hides its isometric floor (FloorDiagram) and shows it again when it leaves. */
function setLive(el: HTMLElement | undefined, also?: HTMLElement): void {
  const next = [el, also].filter((e): e is HTMLElement => !!e);
  if (next.length === live.length && next.every((e, i) => e === live[i])) return;
  for (const e of live) e.removeAttribute('data-tatami-live');
  live = next;
  for (const e of live) e.setAttribute('data-tatami-live', '');
}

function clearKnot(): void {
  if (!knotPublished) return;
  knotPublished = false;
  root.style.removeProperty('--knot-x');
  root.style.removeProperty('--knot-y');
}

/** The tie beat: the knot's place on screen is the centre of the black flood. */
function publishKnot(v: View, f: Frame): void {
  if (!f.tie) {
    clearKnot();
    return;
  }
  v.belt.group.updateMatrixWorld(true);
  knotWorld.setFromMatrixPosition(v.belt.parts.knot.matrixWorld).project(v.camera);
  // With a unit: the flood uses them inside calc() next to lengths.
  root.style.setProperty('--knot-x', `${((knotWorld.x * 0.5 + 0.5) * metrics.w).toFixed(1)}px`);
  root.style.setProperty('--knot-y', `${((-knotWorld.y * 0.5 + 0.5) * metrics.h).toFixed(1)}px`);
  knotPublished = true;
}

/**
 * The camera orbits the target. `setViewOffset` slides the frustum so the target lands at (sx, sy) of the
 * viewport; pixels per metre at the target are `ppm`. The canvas covers the viewport, so the sub-window is the
 * viewport itself.
 */
function aim(camera: PerspectiveCamera, c: Cam): void {
  const full = 2 * c.dist * Math.tan((FOV / 2) * DEG) * c.ppm;
  camera.aspect = 1;
  camera.position.set(c.target[0], c.target[1] + c.dist * Math.sin(c.elevation), c.target[2] + c.dist * Math.cos(c.elevation));
  camera.lookAt(c.target[0], c.target[1], c.target[2]);
  camera.setViewOffset(full, full, full / 2 - c.sx, full / 2 - c.sy, metrics.w, metrics.h);
  camera.updateMatrixWorld();
}

/** Poses the belt and aims its camera. */
function applyFrame(v: View, f: Frame): void {
  const { belt, camera } = v;
  if (f.poseB && f.blend > 0) blendPose(belt, f.pose, f.poseB, f.blend);
  else applyPose(belt, f.pose);
  belt.group.visible = true;

  belt.setColors(paletteOf(f.from), paletteOf(f.to), f.mix);
  if (f.gold > 0) belt.materials.stitch.color.lerp(goldColour, f.gold);

  // On black the sheen would wash the cloth to grey; the rim lights outline it instead.
  v.rimLights[0].intensity = 1.5 * f.rim;
  v.rimLights[1].intensity = 1.0 * f.rim;
  v.scene.environmentIntensity = 0.4 + 0.15 * f.rim;
  belt.materials.cloth.sheen = 1 - 0.7 * f.rim;

  aim(camera, f.cam);
}

/** Aims the tatami camera (with the mouse parallax) and turns the floor by its yaw. */
function applyTatami(v: View, tv: TatamiView): void {
  const c = tv.frame.cam;
  aim(v.tcam, { ...c, elevation: c.elevation + par.y * PARALLAX_DEG * DEG });
  v.tatami.setYaw(tv.frame.yaw + par.x * PARALLAX_DEG * DEG);
  v.tatami.show(tv.entry.key, tv.entry.data, BELT_LINES[tv.entry.belt], tv.entry.belt === 'negro' ? FIELD_DARK : FIELD_LIGHT);
  v.tatami.look(tv.frame.opacity, tv.draw, tv.all);
}

function activeFrame(time: number): Frame | undefined {
  if (!beats.length) return undefined;
  for (let i = 0; i < beats.length; i++) progress[i] = readNum(beats[i].el, KEY_PROGRESS[beats[i].kind], 0);
  const idx = pickBeat(progress);
  activeIdx = idx;
  // The phone view shows the hero only.
  if (tap && (idx !== 0 || beats[0].kind !== 'land')) return undefined;
  const beat = beats[idx];
  const hero = beats[0].kind === 'land' ? beats[0].el : beat.el;
  // On demand, the hero is already landed: the portrait is covered by the tatami.
  const q = tap ? 1 : readNum(hero, '--q', 0);
  const e = readNum(hero, '--e', 0);
  // Idle sway while the hero belt rests, plus the drag.
  const sway = beat.kind === 'land' && q >= 1 ? Math.sin(time * 0.9) * 4 * DEG : 0;
  // On demand the belt stays on its floor and leaves with it; it never flies to a column the phone does not have.
  if (tap) return tapBeltFrame(e, metrics, sway + drag.y);
  const outro = beat.kind === 'travel' && beat.outro ? readNum(beat.outro, '--p', 0) : undefined;
  return frameFor(beat, progress[idx], q, e, metrics, sway + drag.y, outro);
}

/**
 * The diagram on screen. The tatami does not depend on the belt's beat: every stage with a diagram owns it from
 * the moment it starts to enter until it has left, at its place on screen (tul.ts writes the exact entry and exit
 * progress, `--en` / `--ex`, and the box of the figure, `--tat-*`, on the scene). Where two stages are on screen
 * (the hero and the first chapter, adjacent scenes) the one most in place draws; they hand over when both are half
 * away. The hero's floor is the first candidate (it rides up with `--e`).
 */
function tatamiView(): TatamiView | undefined {
  if (!tatamis.length || !beats.length) return undefined;
  const heroBeat = beats[0].kind === 'land' ? beats[0] : undefined;
  const heroEntry = tatamis.find((t) => t.hero);
  let best: TatamiView | undefined;
  let bestScore = 0;
  if (heroBeat && heroEntry) {
    const q = tap ? 1 : readNum(heroBeat.el, '--q', 0);
    const e = readNum(heroBeat.el, '--e', 0);
    best = { entry: heroEntry, frame: tatamiHeroFrame(q, e, metrics), draw: readNum(heroEntry.scene, '--draw', 0), all: tap };
    bestScore = 1 - Math.min(1, Math.max(0, e));
  }
  // The phone view is the hero only.
  if (tap) return best;
  for (const t of tatamis) {
    if (t.hero) continue;
    const en = readNum(t.scene, '--en', 0);
    const ex = readNum(t.scene, '--ex', 0);
    const score = stageScore(en, ex);
    // Handoff threshold: require the stage to be legitimately in place before replacing the previous one
    if (score <= 0 || score < bestScore) continue;
    const box = {
      x: readNum(t.scene, '--tat-x', 0),
      y: readNum(t.scene, '--tat-y', 0),
      s: readNum(t.scene, '--tat-s', 0),
      h: readNum(t.scene, '--tat-h', 0)
    };
    if (box.s <= 0) continue;
    const off = stageOffset(en, ex, metrics.h, readNum(t.scene, '--tat-t', 0));
    const p = readNum(t.scene, '--p', 0);
    const frame = t.low ? tatamiLowFrame(p, box.h > 0 ? box : { x: box.x, y: box.y, s: box.s }, t.route, off) : tatamiChapterFrame(p, box, off);
    best = { entry: t, frame, draw: readNum(t.scene, '--draw', 1), all: false };
    bestScore = score;
  }
  if (best && heroEntry && heroBeat && best.entry !== heroEntry && readNum(heroBeat.el, '--e', 0) < 1 && readNum(heroBeat.el, '--q', 0) > 0.3) {
    best.keep = heroEntry.scene;
  }
  return best;
}

/** Does anything need GL resources right now? Close to the hero's landing, or while a beat shows something. */
function needed(f: Frame | undefined, tv: TatamiView | undefined): boolean {
  if (!columnOk) return false;
  if (f && f.opacity > 0) return true;
  if (tv && tv.frame.opacity > 0) return true;
  return activeIdx === 0 && beats.length > 0 && (tap || readNum(beats[0].el, '--q', 0) > 0.02);
}

function setCanvasOpacity(o: number): void {
  if (!canvas || o === lastOpacity) return;
  lastOpacity = o;
  canvas.style.opacity = o >= 1 ? '' : o.toFixed(3);
}

/** The canvas covers the viewport (CSS); the drawing buffer follows the metrics tul.ts publishes. */
function fitCanvas(): void {
  if (!renderer) return;
  const next = `${metrics.w}x${metrics.h}`;
  if (next === sized) return;
  sized = next;
  renderer.setSize(metrics.w, metrics.h, false);
  force = true;
}

// ---- Pointer: hover, tooltip, click -----------------------------------------------------------------------------

function hoverTo(index: number): number {
  if (index === hoverIdx) return index;
  hoverIdx = index;
  view?.tatami.setHover(index);
  if (index < 0) tip?.hide();
  document.body.style.cursor = index >= 0 && view?.tatami.stopOf(index)?.id ? 'pointer' : '';
  force = true;
  return index;
}

/** Moves the tooltip to the hovered post, projected with the camera of the frame just drawn. */
function placeTip(v: View): void {
  const stop = hoverIdx >= 0 ? v.tatami.stopOf(hoverIdx) : undefined;
  if (!stop?.l || !tip) return;
  v.tatami.postTop(hoverIdx, postWorld).project(v.tcam);
  tip.show(stop.l, (postWorld.x * 0.5 + 0.5) * metrics.w, (-postWorld.y * 0.5 + 0.5) * metrics.h, metrics.w);
}

/**
 * The one ray of the page: called by pointer moves (and by a touch tap, which has no move) and nowhere else.
 * Only over the tatami's own area, and only while it is shown, and never behind the open panel.
 */
function pickAt(x: number, y: number): number {
  const tv = lastView;
  if (!view || !tv || lost || tv.frame.opacity < TATAMI_ACTIVE || root.classList.contains('xp-lock')) return hoverTo(-1);
  const c = tv.frame.cam;
  const clip = tv.frame.clip;
  if (clip ? x < clip.x || x > clip.x + clip.w || y < clip.y || y > clip.y + clip.h : Math.hypot(x - c.sx, y - c.sy) > c.ppm * FLOOR_W * 0.75) {
    return hoverTo(-1);
  }
  return hoverTo(view.tatami.pick(x, y, metrics.w, metrics.h, view.tcam));
}

function activate(index: number): void {
  const id = view?.tatami.stopOf(index)?.id;
  if (id) openExperience(id, null);
}

function onPointerMove(e: PointerEvent): void {
  if (!renderer) return;
  if (e.pointerType === 'touch') return;
  if (!tap && !reducedMotion.matches && metrics.w > 0) {
    par.tx = (e.clientX / metrics.w) * 2 - 1;
    par.ty = (e.clientY / metrics.h) * 2 - 1;
  }
  pickAt(e.clientX, e.clientY);
}

function onPointerLeave(): void {
  par.tx = par.ty = 0;
  hoverTo(-1);
}

function onClick(e: MouseEvent): void {
  if (hoverIdx < 0 || (e as PointerEvent).pointerType === 'touch') return;
  if ((e.target as Element | null)?.closest('a, button, input, select, textarea, dialog')) return;
  activate(hoverIdx);
}

function onPointerDown(e: PointerEvent): void {
  if (e.pointerType === 'touch') touchStart = { x: e.clientX, y: e.clientY };
}

function onPointerUp(e: PointerEvent): void {
  if (e.pointerType !== 'touch' || !touchStart || !renderer) return;
  const moved = Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y) > TAP_SLOP;
  touchStart = undefined;
  if (moved) return;
  const index = pickAt(e.clientX, e.clientY);
  if (index >= 0) activate(index);
  hoverTo(-1);
}

function bindPointer(on: boolean): void {
  if (on === pointerBound) return;
  pointerBound = on;
  const listen = (target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions): void => {
    if (on) target.addEventListener(type, fn, opts);
    else target.removeEventListener(type, fn, opts);
  };
  listen(window, 'pointermove', onPointerMove as EventListener, { passive: true });
  listen(window, 'pointerdown', onPointerDown as EventListener, { passive: true });
  listen(window, 'pointerup', onPointerUp as EventListener, { passive: true });
  listen(window, 'click', onClick as EventListener);
  listen(root, 'pointerleave', onPointerLeave);
  if (!on) {
    par.tx = par.ty = 0;
    hoverTo(-1);
  }
}

/** The parallax follows the pointer with an exponential ease, so it is the same at any frame rate. */
function stepParallax(time: number): void {
  const dt = Math.min(0.1, Math.max(0, time - parTime));
  parTime = time;
  const k = 1 - Math.exp(-dt * 7);
  const on = !tap && !reducedMotion.matches;
  const tx = on ? par.tx : 0;
  const ty = on ? par.ty : 0;
  par.x += (tx - par.x) * k;
  par.y += (ty - par.y) * k;
  if (Math.abs(tx - par.x) < 1e-3) par.x = tx;
  if (Math.abs(ty - par.y) < 1e-3) par.y = ty;
}

// ---- Frames ------------------------------------------------------------------------------------------------------

function drawIfChanged(f: Frame | undefined, tv: TatamiView | undefined, time: number): void {
  if (!renderer || !canvas || lost || !columnOk) return;
  fitCanvas();
  const beltOn = !!f && f.opacity > 0;
  const tatOn = !!tv && tv.frame.opacity > 0;
  if (!beltOn && !tatOn) {
    // Nothing to show: clear whatever the last frame left once, then stay idle.
    if (lastKey !== 'empty') {
      renderer.clear();
      lastKey = 'empty';
      lastView = undefined;
      clearKnot();
      setLive(undefined);
      hoverTo(-1);
    }
    return;
  }
  if (!view) view = createView();

  const bKey =
    beltOn && f
      ? `${activeIdx}|${progress[activeIdx]}|${f.pose.kind}|${f.blend.toFixed(4)}|${f.cam.sx.toFixed(1)}|${f.cam.sy.toFixed(1)}|${f.cam.ppm.toFixed(1)}|${f.cam.elevation.toFixed(4)}|${f.mix.toFixed(4)}|${f.opacity.toFixed(3)}|${
          f.pose.kind === 'floor' ? f.pose.yaw.toFixed(4) + f.pose.landed.toFixed(4) : ''
        }`
      : '';
  const tKey =
    tatOn && tv
      ? `${tv.entry.key}|${tv.frame.opacity.toFixed(3)}|${tv.frame.cam.sy.toFixed(1)}|${tv.frame.cam.ppm.toFixed(1)}|${tv.frame.cam.elevation.toFixed(4)}|${tv.frame.yaw.toFixed(4)}|${tv.draw.toFixed(4)}|${par.x.toFixed(4)}|${par.y.toFixed(4)}|${hoverIdx}|${tv.frame.cam.sx.toFixed(1)}|${tv.frame.cam.target[0].toFixed(3)}|${tv.frame.cam.target[2].toFixed(3)}`
      : '';
  const key = `${metrics.w}x${metrics.h}|${bKey}|${tKey}`;
  const swayDue = beltOn && !!f && f.resting && time - lastTime >= IDLE_FRAME_MS / 1000;
  if (!(force || key !== lastKey || swayDue || drag.down)) return;
  lastKey = key;
  lastTime = time;
  force = false;

  renderer.clear();
  if (tatOn && tv) {
    applyTatami(view, tv);
    // The low camera of the automation beat only draws inside its figure box (y is from the bottom in GL).
    const clip = tv.frame.clip;
    if (clip) {
      renderer.setScissorTest(true);
      renderer.setScissor(clip.x, metrics.h - (clip.y + clip.h), clip.w, clip.h);
    }
    renderer.render(view.scene, view.tcam);
    if (clip) renderer.setScissorTest(false);
    lastView = tv;
    // Live as soon as it is drawn, at any opacity: its isometric SVG is gone from that moment (never both).
    setLive(tv.entry.scene, tv.keep);
    placeTip(view);
  } else {
    lastView = undefined;
    setLive(undefined);
    hoverTo(-1);
  }
  if (beltOn && f) {
    // The belt is drawn over the floor: its own depth.
    renderer.clearDepth();
    applyFrame(view, f);
    renderer.render(view.scene, view.camera);
    publishKnot(view, f);
  } else {
    clearKnot();
  }
  // The belt fades by the canvas opacity (rest on black); a tatami is faded by its own materials.
  setCanvasOpacity(tatOn || !f ? 1 : f.opacity);
  setReady(true);
}

function tick(time: number): void {
  if (document.hidden) return;
  if (!renderer) {
    // No GL yet (or any more): look at the beats only a few times a second.
    if (time - lastTime < WATCH_MS / 1000) return;
    lastTime = time;
    readMetrics();
    if (!lost && needed(activeFrame(time), tatamiView())) mountGl();
    return;
  }
  if (lost) return;
  readMetrics();
  stepParallax(time);
  const f = activeFrame(time);
  const tv = tatamiView();
  if (needed(f, tv)) {
    clearTimeout(teardownTimer);
    teardownTimer = undefined;
  } else if (teardownTimer === undefined) {
    teardownTimer = setTimeout(() => {
      teardownTimer = undefined;
      if (!needed(activeFrame(performance.now() / 1000), tatamiView())) teardown();
    }, TEARDOWN_DELAY_MS);
  }
  if (f || tv) drawIfChanged(f, tv, time);
}

function attachDrag(el: HTMLElement): void {
  el.addEventListener('pointerdown', (e) => {
    if (!renderer || activeIdx !== 0) return;
    gsap.killTweensOf(drag);
    drag.down = true;
    drag.pointerX = e.clientX;
    drag.base = drag.y;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = 'grabbing';
  });
  el.addEventListener('pointermove', (e) => {
    if (!drag.down) return;
    drag.y = drag.base + (e.clientX - drag.pointerX) * 0.012;
  });
  const release = (): void => {
    if (!drag.down) return;
    drag.down = false;
    el.style.cursor = '';
    gsap.to(drag, { y: 0, duration: 1.3, ease: 'elastic.out(1, 0.45)' });
  };
  el.addEventListener('pointerup', release);
  el.addEventListener('pointercancel', release);
}

function mountGl(): void {
  if (renderer) return;
  try {
    canvas = document.createElement('canvas');
    canvas.className = 'belt3d__canvas';
    canvas.setAttribute('aria-hidden', 'true');
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    renderer = undefined;
    canvas = undefined;
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP));
  renderer.setClearColor(0x000000, 0);
  // Two passes (tatami, then belt) share one canvas: the frame clears it by hand.
  renderer.autoClear = false;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  const pmrem = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  envTexture = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();

  canvas.addEventListener('webglcontextlost', (e) => {
    // Keep the browser from discarding the context for good, hide the canvas, let the posters return.
    e.preventDefault();
    lost = true;
    if (canvas) canvas.style.display = 'none';
    setReady(false);
    setLive(undefined);
    hoverTo(-1);
    clearKnot();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    // Rebuild everything from scratch: simplest way to re-upload every buffer and texture.
    teardown();
    lost = false;
  });
  document.addEventListener('visibilitychange', onVisibility);

  tip = createTip();
  document.body.append(canvas);
  sized = '';
  force = true;
  lastKey = '';
  lastOpacity = -1;
}

/** Back from a hidden tab: the next tick draws a fresh frame. */
function onVisibility(): void {
  if (!document.hidden) force = true;
}

function teardown(): void {
  clearTimeout(teardownTimer);
  teardownTimer = undefined;
  gsap.killTweensOf(drag);
  drag.y = 0;
  drag.down = false;
  hoverTo(-1);
  lastView = undefined;
  setLive(undefined);
  document.removeEventListener('visibilitychange', onVisibility);
  tip?.dispose();
  tip = undefined;
  if (view) {
    view.belt.dispose();
    view.tatami.dispose();
    view.scene.clear();
    view = undefined;
  }
  envTexture?.dispose();
  envTexture = undefined;
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
  }
  canvas?.remove();
  renderer = undefined;
  canvas = undefined;
  setReady(false);
  clearKnot();
  sized = '';
  lastKey = '';
}

/** Start or stop the ticker with the gate (viewport width, reduced motion) or the on-demand phone mode. */
function sync(): void {
  if (tap || isBelt3dEligible()) {
    if (!ticking) {
      gsap.ticker.add(tick);
      ticking = true;
    }
    bindPointer(true);
    return;
  }
  if (ticking) {
    gsap.ticker.remove(tick);
    ticking = false;
  }
  bindPointer(false);
  teardown();
}

function collect(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-belt-beat]')) {
    const kind = el.dataset.beltBeat;
    if (kind !== 'land' && kind !== 'travel' && kind !== 'passage') continue;
    const belt = isBeltKey(el.dataset.belt) ? el.dataset.belt : 'blanco';
    const from = isBeltKey(el.dataset.from) ? el.dataset.from : belt;
    const outro = kind === 'travel' ? (el.querySelector<HTMLElement>('[data-belt-outro]') ?? undefined) : undefined;
    beats.push({ kind, belt, from, el, outro });
  }
}

function isTatamiData(v: unknown): v is TatamiData {
  const d = v as TatamiData | null;
  return !!d && Array.isArray(d.p) && d.p.length > 1 && Array.isArray(d.s);
}

/**
 * Every full FloorDiagram carries its route and stops as data-tatami (build time), so the scene fetches nothing.
 * The diagram belongs to the `[data-tul-scene]` that scrubs it; the belt colour is the nearest `[data-belt]`.
 */
function collectTatami(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-tatami]')) {
    const scene = el.closest<HTMLElement>('[data-tul-scene]');
    const beat = el.closest<HTMLElement>('[data-belt]');
    if (!scene || !beat) continue;
    let data: unknown;
    try {
      data = JSON.parse(el.dataset.tatami ?? '');
    } catch {
      continue;
    }
    if (!isTatamiData(data)) continue;
    const belt = isBeltKey(beat.dataset.belt) ? beat.dataset.belt : 'blanco';
    const hero = !!el.closest('[data-belt-beat="land"]');
    tatamis.push({
      key: String(tatamis.length),
      scene,
      hero,
      low: scene.hasAttribute('data-tatami-low'),
      route: routeOf(data.p),
      belt,
      data
    });
  }
}

/** Called once by boot.ts, after load and an idle moment. */
export function mountBelt3d(): void {
  if (started) {
    sync();
    return;
  }
  started = true;
  collect();
  if (!beats.length) return;
  collectTatami();

  heroAnchor = document.querySelector<HTMLElement>('[data-belt-anchor="hero"]') ?? undefined;
  if (heroAnchor) {
    attachDrag(heroAnchor);
    // Micro-cue: gentle spring settle once ready so visitors discover the tactile drag affordance
    gsap.fromTo(drag, { y: -0.06 }, { y: 0, duration: 1.6, delay: 0.8, ease: 'elastic.out(1, 0.45)' });
  }

  // Leaving the desktop / motion conditions stops the ticker, tears everything down and the posters take over.
  matchMedia('(min-width: 1024px)').addEventListener('change', sync);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', sync);
  sync();
}

/**
 * The phone's "Ver en 3D" button (boot.ts): the hero tatami and belt on demand. On: mounts the scene if it is not
 * mounted yet; off: tears everything down again (the isometric floor and the portrait come back).
 */
export function setTapMode(on: boolean): void {
  if (on) mountBelt3d();
  if (tap === on) return;
  tap = on;
  if (on) root.dataset.belt3dTap = 'on';
  else delete root.dataset.belt3dTap;
  // tul.ts measures the hero floor box again: it only exists on a phone once this attribute is set.
  window.dispatchEvent(new Event('tul:belt3d-tap'));
  force = true;
  lastKey = '';
  sync();
}
