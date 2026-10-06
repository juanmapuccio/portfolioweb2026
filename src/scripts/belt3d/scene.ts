// The 3D belt: the only module that imports three. It is loaded lazily by boot.ts.
//
// Architecture: ONE shared WebGLRenderer and ONE canvas, moved between the two in-flow containers
// ([data-belt3d="hero"] and [data-belt3d="tie"]). Why shared: browsers cap live WebGL contexts and a
// second context doubles GPU memory and the PMREM environment for a belt that is never on screen with
// the other one. Moving a canvas between parents keeps its context, and only the container in view
// is ever rendered. The renderer, belts and textures are disposed when no container is near the
// viewport for a while, and rebuilt on return.
//
// Each container is in flow with its box reserved by CSS (aspect-ratio), so mounting never shifts
// layout. Scroll progress comes from the engine (tul.ts), which writes `--q` / `--p` as inline custom
// properties; they are read from `el.style` (no layout or style recalculation per frame).
//
// Frames: only gsap's ticker. A frame is drawn only for the container in view and only when its
// inputs changed (plus a 30 fps idle sway while the hero belt rests).
import { gsap } from 'gsap';
import {
  ACESFilmicToneMapping,
  DirectionalLight,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  type Texture,
  Vector3,
  WebGLRenderer
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BELT_COLORS } from './colors';
import { isBelt3dEligible } from './eligible';
import { poseFloor, poseTie } from './poses';
import { createProceduralBelt, type ProceduralBelt } from './proceduralBelt';

type MomentId = 'hero' | 'tie';

interface View {
  scene: Scene;
  camera: PerspectiveCamera;
  belt: ProceduralBelt;
  resize: (w: number, h: number) => void;
  /** Returns true when a new frame must be drawn. `force` is set after a resize or a canvas move. */
  update: (time: number, force: boolean) => boolean;
}

interface Moment {
  id: MomentId;
  el: HTMLElement;
  /** Element whose inline style carries `--q` (hero) or `--p` (tie). */
  source: HTMLElement;
  w: number;
  h: number;
  near: boolean;
  visible: boolean;
  view?: View;
}

const PIXEL_RATIO_CAP = 1.5;
/** Dispose GL resources after no container has been near the viewport for this long. */
const TEARDOWN_DELAY_MS = 4000;
const IDLE_FRAME_MS = 1000 / 30;
const DEG = Math.PI / 180;

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));
const readNum = (el: HTMLElement, name: string, fallback: number): number => {
  const v = parseFloat(el.style.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

const moments: Moment[] = [];
let started = false;
let renderer: WebGLRenderer | undefined;
let canvas: HTMLCanvasElement | undefined;
let envTexture: Texture | undefined;
let active: Moment | undefined;
let lost = false;
let force = true;
let teardownTimer: ReturnType<typeof setTimeout> | undefined;

// Hero drag: rotation about Y with an elastic return.
const drag = { y: 0, pointerX: 0, base: 0, down: false };

function lights(scene: Scene, env: Texture | undefined): void {
  scene.environment = env ?? null;
  scene.environmentIntensity = 0.4;
  const key = new DirectionalLight(0xffffff, 1.9);
  key.position.set(-0.8, 1.3, 0.9);
  scene.add(key);
  const fill = new DirectionalLight(0xdfe8ff, 0.2);
  fill.position.set(1, 0.4, 0.6);
  scene.add(fill);
}

/** Moment A: a white belt lands on the floor of the hero diagram. Mirrors the CSS camera in FloorDiagram. */
function createHeroView(m: Moment): View {
  const scene = new Scene();
  const camera = new PerspectiveCamera(24, 1, 0.05, 10);
  const belt = createProceduralBelt({ color: BELT_COLORS.blanco });
  belt.setColors(BELT_COLORS.blanco, '#cfcabd');
  scene.add(belt.group);
  lights(scene, envTexture);

  // The camera looks slightly right of the belt, so it lies left of the "ready" label.
  const target = new Vector3(0.07, -0.02, 0.08);
  const DIST = 2.05;
  let lastQ = -1;
  let lastT = 0;

  return {
    scene,
    camera,
    belt,
    resize(w, h) {
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    },
    update(time, forced) {
      const q = readNum(m.source, '--q', 0);
      const reveal = clamp01((q - 0.3) / 0.7);
      // The drop starts once the portrait is mostly gone, and lands as the line starts tracing.
      const landed = clamp01((q - 0.6) / 0.38);
      const resting = landed >= 1;
      const swayDue = resting && (time - lastT) * 1000 >= IDLE_FRAME_MS;
      if (!(forced || drag.down || q !== lastQ || swayDue || drag.y !== 0)) return false;
      lastQ = q;
      lastT = time;

      belt.group.visible = landed > 0;
      // Same numbers as the CSS floor: tilt 50 deg * reveal, yaw -8 deg * reveal (desktop).
      const tv = 50 * reveal;
      const elevation = (90 - tv) * DEG;
      camera.position.set(0, target.y + DIST * Math.sin(elevation), target.z + DIST * Math.cos(elevation));
      camera.lookAt(target);

      const sway = resting ? Math.sin(time * 0.9) * 4 * DEG : 0;
      const yaw = 8 * reveal * DEG + sway + drag.y;
      // Screen-up in model space, so the drop starts above the frame for any tilt.
      poseFloor(belt, landed, { y: Math.cos(elevation), z: -Math.sin(elevation) }, yaw);
      return true;
    }
  };
}

/** Moment B: the belt is tied, red to black, scrubbed by the chapter's progress. */
function createTieView(m: Moment): View {
  const scene = new Scene();
  const camera = new PerspectiveCamera(22, 1, 0.05, 10);
  const belt = createProceduralBelt({ color: BELT_COLORS.rojo });
  scene.add(belt.group);
  lights(scene, envTexture);

  const target = new Vector3(0, -0.1, 0.05);
  const DIST = 1.45;
  const elevation = 12 * DEG;
  camera.position.set(0, target.y + DIST * Math.sin(elevation), target.z + DIST * Math.cos(elevation));
  camera.lookAt(target);
  let lastP = -1;

  return {
    scene,
    camera,
    belt,
    resize(w, h) {
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    },
    update(_time, forced) {
      const p = readNum(m.source, '--p', 0);
      if (!forced && p === lastP) return false;
      lastP = p;
      poseTie(belt, p);
      return true;
    }
  };
}

function ensureView(m: Moment): View | undefined {
  if (!renderer) return undefined;
  if (!m.view) {
    m.view = m.id === 'hero' ? createHeroView(m) : createTieView(m);
    if (m.w > 0 && m.h > 0) m.view.resize(m.w, m.h);
  }
  return m.view;
}

function setState(m: Moment, state: 'idle' | 'ready' | 'lost'): void {
  if (m.el.dataset.state !== state) m.el.dataset.state = state;
}

function attachDrag(c: HTMLCanvasElement): void {
  c.style.cursor = 'grab';
  c.addEventListener('pointerdown', (e) => {
    if (active?.id !== 'hero') return;
    gsap.killTweensOf(drag);
    drag.down = true;
    drag.pointerX = e.clientX;
    drag.base = drag.y;
    c.setPointerCapture(e.pointerId);
    c.style.cursor = 'grabbing';
  });
  c.addEventListener('pointermove', (e) => {
    if (!drag.down) return;
    drag.y = drag.base + (e.clientX - drag.pointerX) * 0.012;
  });
  const release = (): void => {
    if (!drag.down) return;
    drag.down = false;
    c.style.cursor = 'grab';
    gsap.to(drag, { y: 0, duration: 1.3, ease: 'elastic.out(1, 0.45)' });
  };
  c.addEventListener('pointerup', release);
  c.addEventListener('pointercancel', release);
}

function tick(time: number): void {
  if (!renderer || !active || lost) return;
  const view = ensureView(active);
  if (!view) return;
  const needs = view.update(time, force);
  if (!needs) return;
  force = false;
  renderer.render(view.scene, view.camera);
  setState(active, 'ready');
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

  attachDrag(canvas);
  canvas.addEventListener('webglcontextlost', (e) => {
    // Keep the browser from discarding the context for good, hide the canvas, fall back to the poster.
    e.preventDefault();
    lost = true;
    if (canvas) canvas.style.display = 'none';
    for (const m of moments) setState(m, 'lost');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    // Rebuild everything from scratch: simplest way to re-upload every buffer and texture.
    teardown();
    lost = false;
    sync();
  });

  gsap.ticker.add(tick);
  force = true;
  pickActive();
}

function teardown(): void {
  gsap.ticker.remove(tick);
  gsap.killTweensOf(drag);
  drag.y = 0;
  drag.down = false;
  for (const m of moments) {
    if (m.view) {
      m.view.belt.dispose();
      m.view.scene.clear();
      m.view = undefined;
    }
    setState(m, 'idle');
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
  active = undefined;
}

function pickActive(): void {
  const next = moments.find((m) => m.visible);
  if (next !== active) {
    if (active) setState(active, 'idle');
    active = next;
  }
  // The owner may have been chosen before the renderer existed: attach whenever the canvas is elsewhere.
  if (active && canvas && renderer && canvas.parentElement !== active.el) {
    active.el.append(canvas);
    canvas.style.display = lost ? 'none' : '';
    renderer.setSize(active.w, active.h, false);
    const view = ensureView(active);
    view?.resize(active.w, active.h);
    force = true;
  }
}

/** Decide whether GL resources should exist right now. */
function sync(): void {
  const eligible = isBelt3dEligible();
  const wanted = eligible && !lost && moments.some((m) => m.near);

  if (!eligible) {
    clearTimeout(teardownTimer);
    teardownTimer = undefined;
    if (renderer) teardown();
    return;
  }
  if (wanted) {
    clearTimeout(teardownTimer);
    teardownTimer = undefined;
    mountGl();
    return;
  }
  if (renderer && teardownTimer === undefined) {
    teardownTimer = setTimeout(() => {
      teardownTimer = undefined;
      if (!moments.some((m) => m.near)) teardown();
    }, TEARDOWN_DELAY_MS);
  }
}

function collect(): void {
  for (const el of document.querySelectorAll<HTMLElement>('[data-belt3d]')) {
    const id: MomentId = el.dataset.belt3d === 'tie' ? 'tie' : 'hero';
    const source = id === 'hero' ? (el.closest<HTMLElement>('[data-tul-scene]') ?? el) : el;
    moments.push({ id, el, source, w: 0, h: 0, near: false, visible: false });
  }
}

/** Called once by boot.ts, after load and an idle moment. */
export function mountBelt3d(): void {
  if (started) return;
  started = true;
  collect();
  if (!moments.length) return;

  const byEl = new Map(moments.map((m) => [m.el, m]));

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const m = byEl.get(entry.target as HTMLElement);
      if (!m) continue;
      m.w = Math.round(entry.contentRect.width);
      m.h = Math.round(entry.contentRect.height);
      m.view?.resize(m.w, m.h);
      if (m === active && renderer) {
        renderer.setSize(m.w, m.h, false);
        force = true;
      }
    }
  });
  for (const m of moments) resizeObserver.observe(m.el);

  // "Near" decides whether GL resources exist; "visible" decides which container owns the canvas.
  const nearObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const m = byEl.get(entry.target as HTMLElement);
        if (m) m.near = entry.isIntersecting;
      }
      sync();
    },
    { rootMargin: '150% 0px 150% 0px' }
  );
  const viewObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const m = byEl.get(entry.target as HTMLElement);
        if (m) m.visible = entry.isIntersecting;
      }
      pickActive();
    },
    { rootMargin: '10% 0px 10% 0px' }
  );
  for (const m of moments) {
    nearObserver.observe(m.el);
    viewObserver.observe(m.el);
  }

  // Leaving the desktop / motion conditions tears everything down and the poster takes over.
  matchMedia('(min-width: 1024px)').addEventListener('change', sync);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', sync);
}
