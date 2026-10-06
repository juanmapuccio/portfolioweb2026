// The 3D belt: the only module that imports three. It is loaded lazily by boot.ts.
//
// Architecture: ONE WebGLRenderer on ONE fixed canvas (position: fixed, pointer-events: none, above the field
// and the black flood, below the header). The scene is mapped to the viewport, so the belt can be anywhere on
// screen, but the canvas itself is only as big as the belt's reach (journey.ts `canvasSize`) and travels with
// the belt (a transform): a full-screen canvas costs three to seven times the pixels, and MSAA on all of them,
// for a belt that fills a tenth of it. The chapters reserve a side column for the belt, so it never lies over
// text. The belt is the thread of the journey: it lands in the hero, travels each chapter in the reserved
// column, unties, changes colour and ties again in every spacer, ties red to black at 1st dan (its knot is the
// centre of the black flood) and rests on black until it fades out. The route of the belt is journey.ts (pure
// numbers); this file draws it.
//
// Reads, never layout: tul.ts writes inline custom properties and this file only reads them from `el.style`:
//   [data-belt-beat="land"]     --p, --q (portrait to path), --e (the hero scrolling away)
//   [data-belt-beat="travel"]   --bp (0..1 across the chapter)
//   [data-belt-beat="passage"]  --p (0..1 while the spacer crosses the viewport)
//   <html>                      --belt-vw/vh (the viewport), --belt-col-x/y/w/h (the reserved column) and
//                               --belt-hero-x/y/s (the hero floor box)
// The active beat is the last one that has started, so no visibility observer is needed: the belt is on
// screen exactly while a beat is in progress.
// Writes: html[data-belt3d="ready"] after the first drawn frame (the posters step aside) and, during the
// tie beat only, --knot-x / --knot-y (viewport px) on <html>.
//
// Frames: only gsap's ticker. A frame is drawn only when its inputs changed (plus a 30 fps idle sway
// while the hero belt rests). GL resources are disposed when no beat needs the belt for a while and
// rebuilt on return.
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
import { BELT_COLORS, STITCH_GOLD, isBeltKey, type BeltKey } from './colors';
import { isBelt3dEligible } from './eligible';
import { FOV, canvasSize, frameFor, pickBeat, type Beat, type Frame, type Metrics } from './journey';
import { applyPose, blendPose } from './poses';
import { createProceduralBelt, type ProceduralBelt } from './proceduralBelt';

interface BeatEl extends Beat {
  el: HTMLElement;
}

interface View {
  scene: Scene;
  camera: PerspectiveCamera;
  belt: ProceduralBelt;
  rimLights: DirectionalLight[];
}

const PIXEL_RATIO_CAP = 1.5;
/** Dispose GL resources after the belt has not been needed for this long. */
const TEARDOWN_DELAY_MS = 4000;
const IDLE_FRAME_MS = 1000 / 30;
/** While there is no renderer, check this often whether one is needed. */
const WATCH_MS = 100;
const DEG = Math.PI / 180;
/** Where the middle of the belt is in its own space: between the band and the end of the tails (metres). */
const BELT_CENTRE_Y = -0.07;
const KEY_PROGRESS: Record<Beat['kind'], string> = { land: '--p', travel: '--bp', passage: '--p' };

const readNum = (el: HTMLElement, name: string, fallback: number): number => {
  const v = parseFloat(el.style.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

const root = document.documentElement;
const beats: BeatEl[] = [];
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
const centreWorld = new Vector3();

let started = false;
let ticking = false;
/** tul.ts has published the viewport and the reserved column. */
let columnOk = false;
let heroAnchor: HTMLElement | undefined;
let renderer: WebGLRenderer | undefined;
let canvas: HTMLCanvasElement | undefined;
/** Side of the square canvas in CSS px (0 until it is sized). */
let side = 0;
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
let activeIdx = 0;
let teardownTimer: ReturnType<typeof setTimeout> | undefined;

// Hero drag: rotation about Y with an elastic return.
const drag = { y: 0, pointerX: 0, base: 0, down: false };

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
  columnOk = metrics.w > 0 && metrics.h > 0 && metrics.col.w > 0;
}

function lights(scene: Scene, env: Texture | undefined): DirectionalLight[] {
  scene.environment = env ?? null;
  scene.environmentIntensity = 0.4;
  const key = new DirectionalLight(0xffffff, 1.9);
  key.position.set(-0.8, 1.3, 0.9);
  scene.add(key);
  const fill = new DirectionalLight(0xdfe8ff, 0.2);
  fill.position.set(1, 0.4, 0.6);
  scene.add(fill);
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
  const belt = createProceduralBelt({ color: BELT_COLORS.blanco });
  scene.add(belt.group);
  const rimLights = lights(scene, envTexture);
  return { scene, camera, belt, rimLights };
}

function setReady(on: boolean): void {
  if (on === ready) return;
  ready = on;
  if (on) root.dataset.belt3d = 'ready';
  else delete root.dataset.belt3d;
}

function clearKnot(): void {
  if (!knotPublished) return;
  knotPublished = false;
  root.style.removeProperty('--knot-x');
  root.style.removeProperty('--knot-y');
}

/** The tie beat: the knot's place on screen is the centre of the black flood. `left`/`top` place the canvas. */
function publishKnot(v: View, f: Frame, left: number, top: number): void {
  if (!f.tie) {
    clearKnot();
    return;
  }
  v.belt.group.updateMatrixWorld(true);
  knotWorld.setFromMatrixPosition(v.belt.parts.knot.matrixWorld).project(v.camera);
  // With a unit: the flood uses them inside calc() next to lengths.
  root.style.setProperty('--knot-x', `${(left + (knotWorld.x * 0.5 + 0.5) * side).toFixed(1)}px`);
  root.style.setProperty('--knot-y', `${(top + (-knotWorld.y * 0.5 + 0.5) * side).toFixed(1)}px`);
  knotPublished = true;
}

/** Poses the belt and aims the camera; returns where the canvas has to sit (its top-left, in viewport px). */
function applyFrame(v: View, f: Frame): { left: number; top: number } {
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

  // The camera orbits the target. `setViewOffset` slides the frustum so the target lands at (sx, sy) of the
  // viewport; pixels per metre at the target are `ppm`. First over the whole viewport, to find where the belt
  // is on screen, then over the small canvas that is moved onto it.
  const c = f.cam;
  const full = 2 * c.dist * Math.tan((FOV / 2) * DEG) * c.ppm;
  camera.aspect = 1;
  camera.position.set(c.target[0], c.target[1] + c.dist * Math.sin(c.elevation), c.target[2] + c.dist * Math.cos(c.elevation));
  camera.lookAt(c.target[0], c.target[1], c.target[2]);
  camera.setViewOffset(full, full, full / 2 - c.sx, full / 2 - c.sy, metrics.w, metrics.h);
  camera.updateMatrixWorld();
  belt.group.updateMatrixWorld(true);
  centreWorld.set(0, BELT_CENTRE_Y, 0);
  belt.group.localToWorld(centreWorld);
  centreWorld.project(camera);
  const left = Math.round((centreWorld.x * 0.5 + 0.5) * metrics.w - side / 2);
  const top = Math.round((-centreWorld.y * 0.5 + 0.5) * metrics.h - side / 2);
  camera.setViewOffset(full, full, full / 2 - c.sx + left, full / 2 - c.sy + top, side, side);
  return { left, top };
}

function activeFrame(time: number): Frame | undefined {
  if (!beats.length) return undefined;
  for (let i = 0; i < beats.length; i++) progress[i] = readNum(beats[i].el, KEY_PROGRESS[beats[i].kind], 0);
  const idx = pickBeat(progress);
  activeIdx = idx;
  const beat = beats[idx];
  const hero = beats[0].kind === 'land' ? beats[0].el : beat.el;
  const q = readNum(hero, '--q', 0);
  const e = readNum(hero, '--e', 0);
  // Idle sway while the hero belt rests, plus the drag.
  const sway = beat.kind === 'land' && q >= 1 ? Math.sin(time * 0.9) * 4 * DEG : 0;
  return frameFor(beat, progress[idx], q, e, metrics, sway + drag.y);
}

/** Does the belt need GL resources right now? Close to the hero's landing, or while a beat shows it. */
function needed(f: Frame | undefined): boolean {
  if (!f || !columnOk) return false;
  if (f.opacity > 0) return true;
  return activeIdx === 0 && readNum(beats[0].el, '--q', 0) > 0.02;
}

function setCanvasOpacity(o: number): void {
  if (!canvas || o === lastOpacity) return;
  lastOpacity = o;
  canvas.style.opacity = o >= 1 ? '' : o.toFixed(3);
}

/** The canvas is a square sized from the viewport metrics; resize it only when they change. */
function fitCanvas(): void {
  if (!renderer || !canvas) return;
  const next = canvasSize(metrics);
  if (next === side) return;
  side = next;
  renderer.setSize(side, side, false);
  canvas.style.width = `${side}px`;
  canvas.style.height = `${side}px`;
  force = true;
}

function drawIfChanged(f: Frame, time: number): void {
  if (!renderer || !canvas || lost || !columnOk) return;
  fitCanvas();
  if (f.opacity <= 0) {
    // Nothing to show: clear whatever the last frame left once, then stay idle.
    if (lastKey !== 'empty') {
      renderer.clear();
      lastKey = 'empty';
      clearKnot();
    }
    return;
  }
  if (!view) view = createView();

  const key = `${metrics.w}x${metrics.h}|${activeIdx}|${progress[activeIdx]}|${f.pose.kind}|${f.blend.toFixed(4)}|${f.cam.sx.toFixed(1)}|${f.cam.sy.toFixed(1)}|${f.cam.ppm.toFixed(1)}|${f.cam.elevation.toFixed(4)}|${f.mix.toFixed(4)}|${f.opacity.toFixed(3)}|${
    f.pose.kind === 'floor' ? f.pose.yaw.toFixed(4) + f.pose.landed.toFixed(4) : ''
  }`;
  const swayDue = f.resting && time - lastTime >= IDLE_FRAME_MS / 1000;
  if (!(force || key !== lastKey || swayDue || drag.down)) return;
  lastKey = key;
  lastTime = time;
  force = false;

  const { left, top } = applyFrame(view, f);
  canvas.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  setCanvasOpacity(f.opacity);
  renderer.render(view.scene, view.camera);
  publishKnot(view, f, left, top);
  setReady(true);
}

function tick(time: number): void {
  if (!renderer) {
    // No GL yet (or any more): look at the beats only a few times a second.
    if (time - lastTime < WATCH_MS / 1000) return;
    lastTime = time;
    readMetrics();
    if (!lost && needed(activeFrame(time))) mountGl();
    return;
  }
  if (lost) return;
  readMetrics();
  const f = activeFrame(time);
  if (needed(f)) {
    clearTimeout(teardownTimer);
    teardownTimer = undefined;
  } else if (teardownTimer === undefined) {
    teardownTimer = setTimeout(() => {
      teardownTimer = undefined;
      if (!needed(activeFrame(performance.now() / 1000))) teardown();
    }, TEARDOWN_DELAY_MS);
  }
  if (f) drawIfChanged(f, time);
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
    clearKnot();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    // Rebuild everything from scratch: simplest way to re-upload every buffer and texture.
    teardown();
    lost = false;
  });

  document.body.append(canvas);
  side = 0;
  force = true;
  lastKey = '';
  lastOpacity = -1;
}

function teardown(): void {
  clearTimeout(teardownTimer);
  teardownTimer = undefined;
  gsap.killTweensOf(drag);
  drag.y = 0;
  drag.down = false;
  if (view) {
    view.belt.dispose();
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
  side = 0;
  lastKey = '';
}

/** Start or stop the ticker with the gate (viewport width, reduced motion). */
function sync(): void {
  if (isBelt3dEligible()) {
    if (!ticking) {
      gsap.ticker.add(tick);
      ticking = true;
    }
    return;
  }
  if (ticking) {
    gsap.ticker.remove(tick);
    ticking = false;
  }
  teardown();
}

function collect(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-belt-beat]')) {
    const kind = el.dataset.beltBeat;
    if (kind !== 'land' && kind !== 'travel' && kind !== 'passage') continue;
    const belt = isBeltKey(el.dataset.belt) ? el.dataset.belt : 'blanco';
    const from = isBeltKey(el.dataset.from) ? el.dataset.from : belt;
    beats.push({ kind, belt, from, el });
  }
}

/** Called once by boot.ts, after load and an idle moment. */
export function mountBelt3d(): void {
  if (started) return;
  started = true;
  collect();
  if (!beats.length) return;

  heroAnchor = document.querySelector<HTMLElement>('[data-belt-anchor="hero"]') ?? undefined;
  if (heroAnchor) attachDrag(heroAnchor);

  // Leaving the desktop / motion conditions stops the ticker, tears everything down and the posters take over.
  matchMedia('(min-width: 1024px)').addEventListener('change', sync);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', sync);
  sync();
}
