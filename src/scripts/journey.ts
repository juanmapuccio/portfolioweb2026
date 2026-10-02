/**
 * journey.ts — the single scroll-engine registry (scroll-engine-consolidation T1).
 *
 * Owns the contract the custom rAF loop in MartialExperienceTimeline.astro used
 * to implement alone: the `--p` scroll-progress custom property, the horizontal
 * `[data-track]` shift, the belt-color state machine (`belt:change`), and the
 * black-curtain tint scrub (`belt:black-progress`). Components (T2–T4) register
 * their own nodes here instead of running private loops.
 *
 * Engine: gsap ScrollTrigger is the ONLY scroll engine here. Lenis keeps driving
 * ScrollTrigger.update from Layout.astro; this module never touches Lenis.
 *
 * Bootstrap (queue-vs-direct): Astro bundles every component <script> as a
 * deferred module script, so the document is fully parsed by the time any
 * register call runs. Registrations therefore execute DIRECTLY — there is no
 * queue: the trigger instance is created immediately and the entry is appended
 * to the module lists. One deferred `kick()`, scheduled on DOMContentLoaded
 * (which fires AFTER all deferred module scripts, so it sees every startup
 * registration), runs ScrollTrigger.refresh() plus the manual initial pass that
 * mirrors the old engine's single init frame: initial --p / track writes for
 * every fx, and activation of the zone currently crossing the viewport center
 * (so belt:change fires on load exactly like today, where lastBeltKey starts
 * ''). If the module is ever evaluated after DOMContentLoaded, kick() runs
 * immediately; registrations arriving post-kick (future ClientRouter
 * astro:page-load flows) apply their own initial pass synchronously, guarded by
 * `booted`. Double registration of the same element is impossible (module-level
 * WeakSets), which makes a later re-init trivial.
 *
 * trackWidth invalidation: each fx trigger's per-instance onRefresh hook
 * re-measures track.scrollWidth, clears the transform dirty-check, and
 * re-applies the current progress. Chosen over a global refresh listener
 * because the width is per-entry state and the hook receives the trigger with
 * its freshly recomputed progress.
 *
 * Black circle radius: the single source of truth is the CSS custom property
 * --black-circle-max-radius on :root, re-read once per ScrollTrigger refresh
 * (global 'refresh' listener). T5 will add the property to global.css; until
 * then getComputedStyle returns '' and the fallback (2000) reproduces the old
 * engine's BLACK_CIRCLE_MAX_RADIUS exactly.
 *
 * T3 additive range option: registerFx accepts { start?, end? } to override
 * the default 'top top'/'bottom bottom' curtain range per node. The defaults
 * are unchanged (opts?.start ?? 'top top', opts?.end ?? 'bottom bottom');
 * the only caller passing overrides is the manifesto, whose mobile range was
 * 'top 80%'/'bottom 45%' before migrating to this registry. Nothing else in
 * the module's behavior moved.
 *
 * DEVIATION from the literal T1 text (`p = self.progress` on the black
 * curtain): the dispatched progress uses the PORTED curtain formula
 * (-rect.top / (rect.height - innerHeight), old engine line 343) rather than
 * the zone trigger's top-center→bottom-center progress. The painted circle is
 * driven by the fx --p (top-top→bottom-bottom) and resolveBeltKey (explicitly
 * ported, lines 262–270) shares that range; mixing the two ranges would desync
 * the 3D tint scrub from the circle and break the invariant "mix = 1 exactly
 * at the rojo→negro flip" (Belt3D contract comment, lines 328–337), violating
 * the pixel-identical acceptance criterion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface FxRegistrationOptions {
  /** Invoked on EVERY progress update (after the dirty-checked --p write),
   *  unconditionally, so JS subscribers (e.g. the manifesto) receive every
   *  frame without creating a second trigger. */
  onProgress?: (p: number) => void;
  /** PURELY ADDITIVE (T3): ScrollTrigger start position override. Defaults to
   *  'top top' — the curtain range the old rAF engine computed as
   *  -rect.top / (height - innerHeight). Only the manifesto's mobile range
   *  ('top 80%') passes this; every other caller keeps the default. */
  start?: string;
  /** PURELY ADDITIVE (T3): ScrollTrigger end position override. Defaults to
   *  'bottom bottom' (see `start`). Manifesto mobile passes 'bottom 45%'. */
  end?: string;
}

// ---------------------------------------------------------------------------
// Chapter constants — single source of truth, ported verbatim from the rAF
// engine (MartialExperienceTimeline.astro:233-241). They live ONLY here.
// ---------------------------------------------------------------------------

/** Indexed by the zone's data-ch attribute. */
const CHAPTER_KEYS = ['blanco', 'blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'];
const CHAPTER_COLORS: Record<string, string> = {
  blanco: '#ffffff',
  amarillo: '#fbbf24',
  verde: '#10b981',
  azul: '#0284c7',
  rojo: '#ef4444',
  negro: '#1c1a17',
};

/** Fallback for --black-circle-max-radius. T5 adds the property to
 *  global.css; until then 2000 keeps today's exact behavior (it equals the
 *  old engine's BLACK_CIRCLE_MAX_RADIUS). */
const BLACK_CIRCLE_MAX_RADIUS_FALLBACK = 2000;

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

interface FxEntry {
  el: HTMLElement;
  track: HTMLElement | null;
  trackWidth: number;
  lastP: string;
  lastTransform: string;
  onProgress?: (p: number) => void;
}

interface ZoneEntry {
  el: HTMLElement;
}

interface SceneEntry {
  el: HTMLElement;
  index: number;
  last: boolean;
  lastP: string;
  lastV: string;
  lastE: string;
  lastActive: boolean;
  /** Needs one more write even though its trigger is no longer active (final state). */
  settle: boolean;
  trigger: ScrollTrigger | null;
}

const IS_BROWSER = typeof window !== 'undefined';

if (IS_BROWSER) {
  // Idempotent by GSAP contract; explicit here so journey.ts is the single
  // place the plugin is registered once components stop importing it (T3).
  gsap.registerPlugin(ScrollTrigger);
}

// One read at module evaluation, exactly like the old engine's init-time
// matchMedia call (runtime mq changes were never handled upstream).
const isReduced = IS_BROWSER && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile (<=767px) swaps the desktop scroll tree for the immersive scenes
// (MobileImmersive.astro). The breakpoint mirrors the CSS swap in HomePage.astro:
// on mobile only `[data-scene]` nodes register, on desktop only the `[data-fx]` /
// `[data-zone]` nodes do, so the hidden tree is never measured. Registrations
// skipped by the gate are parked and replayed if the viewport crosses the
// breakpoint later (see onBreakpointChange).
const mobileMq = IS_BROWSER ? window.matchMedia('(max-width: 767px)') : null;
const isMobileViewport = (): boolean => mobileMq?.matches ?? false;
const deferredForDesktop: Array<() => void> = [];
const deferredForMobile: Array<() => void> = [];

// Idempotency guards: no element can be registered twice — the WeakSet the
// spec mandates for future ClientRouter / astro:page-load re-init flows.
const registeredFx = new WeakSet<HTMLElement>();
const registeredZones = new WeakSet<HTMLElement>();
const registeredScenes = new WeakSet<Element>();

// Strong lists backing the initial pass and late-registration catch-up. The
// elements are page-lifetime nodes — the same assumption as the old engine's
// init-time querySelectorAll — so holding them adds no leak.
const fxEntries: FxEntry[] = [];
const zoneEntries: ZoneEntry[] = [];

let lastBeltKey = '';
let booted = false;

// Cache re-read once per ScrollTrigger refresh (global listener below).
let blackCircleMaxRadius = BLACK_CIRCLE_MAX_RADIUS_FALLBACK;

// ---------------------------------------------------------------------------
// Progress math (ported from the rAF engine)
// ---------------------------------------------------------------------------

/** Curtain scrub range: 0 when the element top reaches the viewport top, 1
 *  when its bottom reaches the viewport bottom (old engine line 294). */
function curtainProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const H = window.innerHeight;
  return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - H)));
}

/** True when the expanding black circle covers the viewport corners at p
 *  (old engine lines 266-267 / 344-348 share this math). */
function blackCircleCoversViewport(p: number): boolean {
  const radius = Math.min(1, Math.max(0, (p - 0.14) * 4)) * blackCircleMaxRadius;
  const corner = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
  return radius >= corner;
}

/** Maps a zone to its belt key. The black curtain stays "rojo" until its
 *  expanding circle covers the viewport corners, so the header never turns
 *  dark over a cream background (old engine resolveBeltKey, lines 262-270). */
function resolveBeltKey(zone: HTMLElement): string {
  const ch = parseInt(zone.dataset.ch || '0', 10);
  if (zone.classList.contains('black-curtain-scene') && !isReduced) {
    if (!blackCircleCoversViewport(curtainProgress(zone))) return CHAPTER_KEYS[5];
  }
  return CHAPTER_KEYS[ch] || 'blanco';
}

/** Activation write + deduped belt:change (old engine lines 317-326). The
 *  dataset assignment is unconditional (cheap and idempotent — the engine
 *  wrote it every frame); the event fires only on real key transitions, so
 *  fast scrolls across boundaries never emit duplicate or intermediate keys. */
function applyBelt(beltKey: string): void {
  const color = CHAPTER_COLORS[beltKey] || '#ffffff';
  document.documentElement.dataset.activeBeltColor = color;
  if (beltKey !== lastBeltKey) {
    lastBeltKey = beltKey;
    window.dispatchEvent(new CustomEvent('belt:change', { detail: { beltKey, color } }));
  }
}

/** Dirty-checked --p + horizontal track write + unconditional subscriber
 *  notify (old engine lines 297-310). */
function applyFxProgress(entry: FxEntry, p: number): void {
  const pStr = p.toFixed(4);
  if (pStr !== entry.lastP) {
    entry.lastP = pStr;
    entry.el.style.setProperty('--p', pStr);
  }
  if (entry.track) {
    const shift = -p * Math.max(0, entry.trackWidth - window.innerWidth);
    const transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
    if (transform !== entry.lastTransform) {
      entry.lastTransform = transform;
      entry.track.style.transform = transform;
    }
  }
  entry.onProgress?.(p);
}

/** Reduced-motion freeze for non-horizontal fx: --p: 1 once, no trigger,
 *  subscriber notified once (old engine line 295). */
function freezeFx(entry: FxEntry): void {
  entry.lastP = '1';
  entry.el.style.setProperty('--p', '1');
  entry.onProgress?.(1);
}

/** Black-curtain tint scrub payload (old engine lines 339-350). Dispatching
 *  every update inside the zone (no change-throttle) is a deliberate conflict
 *  guard: Belt3D registers belt:change before belt:black-progress, so on the
 *  frame where both fire the scrub has the last word and mix = 1 at the flip
 *  makes the hard switch identical to the scrub result. */
function dispatchBlackProgress(p: number): void {
  const radius = Math.min(1, Math.max(0, (p - 0.14) * 4)) * blackCircleMaxRadius;
  const corner = Math.hypot(window.innerWidth / 2, window.innerHeight / 2);
  // Degenerate viewport (0×0 during teardown): treat as fully covered
  // instead of dividing by zero.
  const mix = corner > 0 ? Math.min(1, radius / corner) : 1;
  window.dispatchEvent(new CustomEvent('belt:black-progress', { detail: { progress: p, mix, from: CHAPTER_COLORS.rojo, to: CHAPTER_COLORS.negro } }));
}

/** Enter/enterBack activation for a zone. */
function activateZone(entry: ZoneEntry): void {
  applyBelt(resolveBeltKey(entry.el));
}

/** Continuous belt re-resolution while the black curtain is the active zone:
 *  the old engine re-resolved the center zone every frame, so the tint scrub
 *  and the header flip stay in lockstep while the circle grows — or shrinks,
 *  scrolling back up across the flip point. */
function updateBlackZone(entry: ZoneEntry, p: number): void {
  dispatchBlackProgress(p);
  // Keep returning `rojo` (CHAPTER_KEYS[5]) until radius >= corner, then the
  // chapter key — same semantics as resolveBeltKey, from the p in hand.
  const ch = parseInt(entry.el.dataset.ch || '0', 10);
  const beltKey = isReduced || blackCircleCoversViewport(p) ? CHAPTER_KEYS[ch] || 'blanco' : CHAPTER_KEYS[5];
  applyBelt(beltKey);
}

// ---------------------------------------------------------------------------
// Registry API
// ---------------------------------------------------------------------------

/** Registers one scroll-linked fx node: writes `--p` (4 decimals,
 *  dirty-checked) and, when the node contains `[data-track]`, the horizontal
 *  translate3d shift. One ScrollTrigger per element, idempotent. */
export function registerFx(el: HTMLElement, opts?: FxRegistrationOptions): void {
  if (typeof window === 'undefined') return;
  if (isMobileViewport()) {
    deferredForDesktop.push(() => registerFx(el, opts));
    return;
  }
  if (registeredFx.has(el)) return;
  registeredFx.add(el);

  const entry: FxEntry = {
    el,
    track: el.querySelector<HTMLElement>('[data-track]'),
    trackWidth: 0,
    lastP: '',
    lastTransform: '',
    onProgress: opts?.onProgress,
  };
  fxEntries.push(entry);

  // Reduced motion freezes non-horizontal nodes at their final frame;
  // horizontal nodes keep scrubbing (the track shift is the content itself).
  if (isReduced && el.dataset.fx !== 'h') {
    freezeFx(entry);
    return;
  }

  ScrollTrigger.create({
    trigger: el,
    // Range is the curtain default; T3 added the purely additive start/end
    // overrides (only the manifesto's mobile range passes them). Behavior,
    // --p contract, and reduced-motion freeze are unchanged for defaults.
    start: opts?.start ?? 'top top',
    end: opts?.end ?? 'bottom bottom',
    onUpdate: (self: ScrollTrigger) => {
      applyFxProgress(entry, self.progress);
    },
    // trackWidth invalidation: re-measure on every refresh (resize, font
    // load, layout change), force the transform dirty-check to miss, and
    // re-apply with the fresh width.
    onRefresh: (self: ScrollTrigger) => {
      if (entry.track) {
        entry.trackWidth = entry.track.scrollWidth;
        entry.lastTransform = '';
        applyFxProgress(entry, self.progress);
      }
    },
  });

  // Late registration (after the boot pass): apply the initial state now so
  // the node never sits at a stale --p until the next scroll.
  if (booted) {
    if (entry.track) entry.trackWidth = entry.track.scrollWidth;
    applyFxProgress(entry, curtainProgress(el));
  }
}

/** Registers one belt zone: a center-crossing ScrollTrigger that activates
 *  the chapter color on enter/enterBack (deduped `belt:change`), and — for
 *  the black curtain — also scrubs `belt:black-progress` on every update. */
export function registerZone(el: HTMLElement): void {
  if (typeof window === 'undefined') return;
  if (isMobileViewport()) {
    deferredForDesktop.push(() => registerZone(el));
    return;
  }
  if (registeredZones.has(el)) return;
  registeredZones.add(el);

  const entry: ZoneEntry = { el };
  zoneEntries.push(entry);

  const isBlackCurtain = el.classList.contains('black-curtain-scene');
  ScrollTrigger.create({
    trigger: el,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => activateZone(entry),
    onEnterBack: () => activateZone(entry),
    // The black curtain re-resolves continuously while active (see
    // updateBlackZone). `p` is the ported curtain progress, NOT the zone
    // trigger's own progress — see the DEVIATION note in the header.
    ...(isBlackCurtain
      ? {
          onUpdate: () => {
            updateBlackZone(entry, isReduced ? 1 : curtainProgress(el));
          },
        }
      : {}),
  });

  // Late registration: if this zone already crosses the viewport center,
  // run the activation path now (belt:change dedupe makes it safe).
  if (booted) {
    const rect = el.getBoundingClientRect();
    const mid = window.innerHeight / 2;
    if (rect.top <= mid && rect.bottom > mid) activateZone(entry);
  }
}

// ---------------------------------------------------------------------------
// Mobile immersive scenes
// ---------------------------------------------------------------------------

const clamp01 = (x: number): number => Math.min(1, Math.max(0, x));
const fmt = (x: number): string => clamp01(x).toFixed(4);

// Every registered mobile scene, in document order. One batched pass
// (flushScenes) reads all active rects first and only then writes.
const sceneEntries: SceneEntry[] = [];
let lastFlushY = Number.NaN;
// Stable viewport height for the scene math: a hidden fixed 100svh probe in the
// mobile tree (same unit the layers use), re-measured on every refresh. Falls
// back to innerHeight when the probe is absent.
let sceneViewportH = 0;

function measureSceneViewport(): void {
  const probe = document.querySelector<HTMLElement>('[data-vh-probe]');
  sceneViewportH = probe?.offsetHeight || window.innerHeight;
}

/** Dirty-checked --p / --v / --e write from an already-read rect. Same math as
 *  the reference design: p = progress through the pinned span (height - 2
 *  viewports, 1 for the last scene), v = entrance (the layer wipes in as its
 *  top crosses the viewport), e = exit (the layer recedes as its bottom
 *  leaves). Pure write phase: no layout reads happen here. */
function writeScene(entry: SceneEntry, rect: DOMRect, ih: number): void {
  const span = rect.height - ih * (entry.last ? 1 : 2);
  const p = span > 0 ? fmt(-rect.top / span) : '0.0000';
  const v = entry.index === 0 ? '1.0000' : fmt(1 - rect.top / ih);
  const e = entry.last ? '0.0000' : fmt((ih * 2 - rect.bottom) / ih);
  if (p !== entry.lastP) {
    entry.lastP = p;
    entry.el.style.setProperty('--p', p);
  }
  if (v !== entry.lastV) {
    entry.lastV = v;
    entry.el.style.setProperty('--v', v);
  }
  if (e !== entry.lastE) {
    entry.lastE = e;
    entry.el.style.setProperty('--e', e);
  }
  // Layer promotion only while the scene is visible and not yet fully covered.
  const active = Number(v) > 0 && Number(e) < 1;
  if (active !== entry.lastActive) {
    entry.lastActive = active;
    entry.el.toggleAttribute('data-active', active);
  }
  syncSceneBelt(entry, Number(p), Number(v));
}

/** One batched pass: READ phase (rects of every active or settling scene),
 *  then WRITE phase. Several scene triggers fire per scroll update; the
 *  scroll-position guard makes all but the first a no-op. */
function flushScenes(force = false): void {
  const y = window.scrollY;
  if (!force && y === lastFlushY) return;
  lastFlushY = y;
  if (!sceneViewportH) measureSceneViewport();
  const ih = sceneViewportH;
  const batch = sceneEntries.filter((entry) => entry.settle || entry.trigger?.isActive);
  // READ phase.
  const rects = batch.map((entry) => entry.el.getBoundingClientRect());
  // WRITE phase.
  batch.forEach((entry, i) => {
    entry.settle = false;
    writeScene(entry, rects[i], ih);
  });
}

/** Re-measure the viewport probe and repaint every scene once (also the
 *  off-screen before/after range state). */
function refreshScenes(): void {
  if (!sceneEntries.length) return;
  measureSceneViewport();
  for (const entry of sceneEntries) entry.settle = true;
  flushScenes(true);
}

/** Keeps the header chapter ticks meaningful on mobile, where the desktop belt
 *  zones are not registered: the belts scene walks blanco -> rojo with its own
 *  progress (negro is held back so the header never turns dark over the cream
 *  scene) and the dark contact panel flips the header once its reveal covers
 *  the viewport. belt:change stays deduped by applyBelt. */
function syncSceneBelt(entry: SceneEntry, p: number, v: number): void {
  const kind = entry.el.dataset.scene;
  if (kind === 'belts') {
    applyBelt(v >= 1 ? CHAPTER_KEYS[Math.min(5, Math.floor(p * 6.5) + 1)] : CHAPTER_KEYS[0]);
  } else if (kind === 'contact' && v >= 0.7) {
    applyBelt(CHAPTER_KEYS[6]);
  }
}

/** Registers one mobile immersive scene (`[data-scene]` inside
 *  `.mobile-immersive`): writes `--p`, `--v` and `--e`. One ScrollTrigger per
 *  element, idempotent, mobile-only (parked on desktop). Reduced motion freezes
 *  the scene at its final state (--p: 1, --v: 1, --e: 0) with no trigger. */
export function registerScene(el: HTMLElement): void {
  if (typeof window === 'undefined') return;
  if (!isMobileViewport()) {
    deferredForMobile.push(() => registerScene(el));
    return;
  }
  if (registeredScenes.has(el)) return;
  registeredScenes.add(el);

  const scenes = Array.from((el.closest('.mobile-immersive') ?? document).querySelectorAll<HTMLElement>('[data-scene]'));
  const index = Math.max(0, scenes.indexOf(el));
  const entry: SceneEntry = {
    el,
    index,
    last: index === scenes.length - 1,
    lastP: '',
    lastV: '',
    lastE: '',
    lastActive: false,
    settle: false,
    trigger: null,
  };

  if (isReduced) {
    entry.lastP = '1.0000';
    entry.lastV = '1.0000';
    entry.lastE = '0.0000';
    el.style.setProperty('--p', '1');
    el.style.setProperty('--v', '1');
    el.style.setProperty('--e', '0');
    return;
  }

  sceneEntries.push(entry);
  entry.trigger = ScrollTrigger.create({
    trigger: el,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: () => flushScenes(),
    // Leaving the range needs one final write of the clamped state.
    onToggle: () => {
      entry.settle = true;
      flushScenes(true);
    },
  });

  if (!focusBound) {
    focusBound = true;
    document.addEventListener('focusin', onSceneFocusIn);
  }

  if (booted) {
    measureSceneViewport();
    entry.settle = true;
    flushScenes(true);
  }
}

// Keyboard focus on a card that sits off-screen inside the translated carousel:
// map it to the page scroll position where the carousel shows that card. The
// carousel is overflow: clip, so the browser cannot scroll it by itself.
let focusBound = false;

interface LenisLike {
  scrollTo: (target: number, options?: { immediate?: boolean; duration?: number }) => void;
}

function onSceneFocusIn(event: FocusEvent): void {
  if (!isMobileViewport() || isReduced) return;
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.matches(':focus-visible')) return;
  const card = target.closest<HTMLElement>('.mobile-immersive .card');
  const scene = card?.closest<HTMLElement>('[data-scene="projects"]');
  if (!card || !scene) return;
  const cards = Array.from(scene.querySelectorAll<HTMLElement>('.card'));
  const index = cards.indexOf(card);
  if (index < 0 || cards.length < 2) return;
  const cardRect = card.getBoundingClientRect();
  if (cardRect.left >= 0 && cardRect.right <= window.innerWidth) return;
  const ih = sceneViewportH || window.innerHeight;
  const span = Math.max(0, scene.offsetHeight - ih * 2);
  const y = scene.getBoundingClientRect().top + window.scrollY + (index / (cards.length - 1)) * span;
  const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (lenis) lenis.scrollTo(y, { duration: 0.6 });
  else window.scrollTo({ top: y, behavior: 'auto' });
}

/** Crossing the 767px breakpoint after load: replay the registrations the gate
 *  parked for the new mode, then re-measure. Already-registered nodes of the
 *  other mode stay registered but sit in a display:none tree (zero rects), so
 *  they are inert. */
function onBreakpointChange(): void {
  const queue = isMobileViewport() ? deferredForMobile : deferredForDesktop;
  queue.splice(0).forEach((run) => run());
  ScrollTrigger.refresh();
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

/** Manual initial pass over the registry (old engine line 369: one frame on
 *  init). Runs AFTER ScrollTrigger.refresh() so every trigger has current
 *  measurements; reads are batched before writes exactly like the engine's
 *  READ/WRITE phases. */
function initialPass(): void {
  const H = window.innerHeight;
  const mid = H / 2;

  // READ phase.
  const fxStates = fxEntries.map((entry) => {
    const rect = entry.el.getBoundingClientRect();
    return { entry, p: curtainProgressFromRect(rect, H) };
  });
  const zoneRects = zoneEntries.map((entry) => entry.el.getBoundingClientRect());

  // WRITE phase.
  for (const { entry, p } of fxStates) {
    if (entry.track) entry.trackWidth = entry.track.scrollWidth;
    applyFxProgress(entry, p);
  }
  const activeIdx = zoneRects.findIndex((r) => r.top <= mid && r.bottom > mid);
  if (activeIdx !== -1) {
    activateZone(zoneEntries[activeIdx]);
  }
}

/** curtainProgress specialized to an already-read rect (batched reads). */
function curtainProgressFromRect(rect: DOMRect, H: number): number {
  return Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - H)));
}

function kick(): void {
  if (typeof window === 'undefined' || booted) return;
  booted = true;
  ScrollTrigger.refresh();
  initialPass();
}

if (IS_BROWSER) {
  // Single-source black circle radius: re-read the CSS custom property once
  // per refresh (never per frame).
  ScrollTrigger.addEventListener('refresh', () => {
    refreshScenes();
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--black-circle-max-radius')
      .trim();
    const parsed = Number.parseFloat(raw);
    blackCircleMaxRadius = Number.isFinite(parsed) && parsed > 0 ? parsed : BLACK_CIRCLE_MAX_RADIUS_FALLBACK;
  });

  mobileMq?.addEventListener('change', onBreakpointChange);

  // Web fonts change text metrics and section heights; re-measure trigger
  // positions once (same hook the manifesto used before T3 absorbs it).
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  // Deferred kick: DOMContentLoaded fires after every deferred module script,
  // so all startup registrations are visible by then.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', kick, { once: true });
  } else {
    kick();
  }
}
