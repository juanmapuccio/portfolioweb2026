// The only scroll engine of the tul world. Native scroll, no smooth-scroll library.
//
// Contract for chapters (T4+):
//   [data-tul-scene]   element whose scroll span (top of element at viewport top, to its
//                      bottom at viewport bottom) writes `--p` (0..1) and `--draw`.
//   data-p-from/to     optional range (default 0..1) that --p is mapped onto for `--draw`.
//   data-q-end         optional: --q (0..1) runs over scene progress 0..q-end (the hero's portrait
//                      turning into the path).
//   data-draw-start    optional: --draw starts moving once the scene progress passes this value.
//   --draw             consumed by FloorDiagram: stroke-dashoffset, stops and arrows.
//   main section[data-belt]  the section at mid-viewport sets html[data-active-belt] and the header
//                      grade indicator ([data-grade-gup], [data-grade-form]). The belt never changes the
//                      page background: the field is white up to the red belt and flips to black once, at 1st
//                      dan (see [data-tul-passage]). The belt only drives the header belt mark (a short
//                      clip-path wipe from the previous belt) and accent colours. Sections after the black belt (principles, sheet,
//                      close) carry data-belt="negro" as their accent, so the header keeps showing 1st dan.
//   data-form-label    optional on a sub-scene (black belt passages): the header's form text shows
//                      this label while the sub-scene sits at mid-viewport.
//   [data-tul-passage] spacer between two chapters (InkPassage.astro): `--p` (0..1) while it crosses the
//                      viewport (top at the bottom edge to bottom at the top edge). The one that arrives at
//                      1st dan drives the black flood and sets html[data-field="dark"] at p >= 0.5.
// With reduced motion nothing is scrubbed: --p and --draw are 1, everything is drawn.
// Only GSAP's ticker schedules frames here; only CSS-driven transform, opacity, clip-path
// and stroke-dashoffset react to the variables.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { bootBelt3d } from './belt3d/boot';
import { playTitleInk } from './titleInk';

type Grade = { gup: string; form: string };

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// GSAP's formerly paid plugins ship free in the `gsap` package: SplitText and DrawSVG for the title ink,
// MorphSVG for the drop splat.
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, MorphSVGPlugin);

type Grades = Record<string, Grade>;

const indicator = document.querySelector<HTMLElement>('[data-grade-indicator]');
const gupEl = document.querySelector<HTMLElement>('[data-grade-gup]');
const formEl = document.querySelector<HTMLElement>('[data-grade-form]');

let grades: Grades = {};
try {
  grades = JSON.parse(indicator?.dataset.grades ?? '{}') as Grades;
} catch {
  grades = {};
}

const swatchPrev = document.querySelector<HTMLElement>('[data-swatch-prev]');
const swatchFill = document.querySelector<HTMLElement>('[data-swatch-fill]');

/** Belt whose grade the indicator currently shows. */
let shownGrade = '';

/** Line hand-off: the new belt's fill wipes over the previous one (instant with reduced motion). */
function wipeSwatch(from: string, key: string): void {
  if (reduced || !swatchFill || !swatchPrev || !swatchFill.animate) return;
  swatchPrev.style.setProperty('--belt-fill', from);
  swatchPrev.style.setProperty('--belt-key', key);
  swatchFill.animate(
    [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
    { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
  );
}

function setBelt(belt: string): void {
  if (shownGrade === belt) return;
  const header = swatchFill?.closest<HTMLElement>('.tul-header');
  const style = header ? getComputedStyle(header) : undefined;
  const from = style?.getPropertyValue('--belt-fill').trim() ?? '';
  const key = style?.getPropertyValue('--belt-key').trim() ?? '';
  const first = shownGrade === '';
  shownGrade = belt;
  root.dataset.activeBelt = belt;
  if (!first && from) wipeSwatch(from, key);
  const grade = grades[belt];
  if (grade && gupEl) gupEl.textContent = grade.gup;
  if (grade && formEl) formEl.textContent = grade.form;
}

function readRange(el: HTMLElement): [number, number] {
  const from = parseFloat(el.dataset.pFrom ?? '0');
  const to = parseFloat(el.dataset.pTo ?? '1');
  return [Number.isFinite(from) ? from : 0, Number.isFinite(to) ? to : 1];
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

function write(el: HTMLElement, p: number, from: number, to: number): void {
  const qEnd = parseFloat(el.dataset.qEnd ?? '');
  const drawStart = parseFloat(el.dataset.drawStart ?? '0') || 0;
  el.style.setProperty('--p', p.toFixed(4));
  if (Number.isFinite(qEnd) && qEnd > 0) el.style.setProperty('--q', clamp01(p / qEnd).toFixed(4));
  const d = clamp01((p - drawStart) / (1 - drawStart));
  el.style.setProperty('--draw', (from + (to - from) * d).toFixed(4));
}

function initScenes(): void {
  const scenes = document.querySelectorAll<HTMLElement>('[data-tul-scene]');

  for (const el of scenes) {
    if (reduced) {
      // A scene with a portrait phase stays in its static state (portrait shown, line undrawn).
      if (el.dataset.qEnd) continue;
      el.style.setProperty('--p', '1');
      el.style.setProperty('--draw', '1');
      continue;
    }

    const [from, to] = readRange(el);
    const state = { p: 0 };
    write(el, 0, from, to);

    gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4
      },
      onUpdate: () => write(el, state.p, from, to)
    });
  }
}

// [data-tul-scrub]  an element that only needs its own `--p` (0..1) while it travels up the viewport
//                   (top at 90% to top at 25%). The 3D tie of the black belt reads it from the inline
//                   style. Nothing else (`--draw`, `--q`) is written, so no row or label reacts.
function initScrubs(): void {
  // The 3D belt only exists from 1024 px up; below that the scrub would drive nothing.
  if (!matchMedia('(min-width: 1024px)').matches) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-tul-scrub]')) {
    if (reduced) {
      el.style.setProperty('--p', '1');
      continue;
    }
    const state = { p: 0 };
    el.style.setProperty('--p', '0');
    gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 25%', scrub: 0.4 },
      onUpdate: () => el.style.setProperty('--p', state.p.toFixed(4))
    });
  }
}

// [data-tul-passage]  an in-flow spacer between two chapters. It only needs its own `--p` (the CSS of the
//                     flood and, later, the belt drawing read it). With reduced motion nothing is written and
//                     the CSS shows a static gap.
// The passage that arrives at 1st dan (data-belt="negro") also owns the field flip: once its progress passes
// FLOOD_FULL the black flood covers the whole view, so the page tokens are switched to the dark field
// underneath it (html[data-field="dark"], tokens.css) and switched back when scrolling up past it. Both read
// the same scrubbed `p`, so the flip always happens while the flood is fully opaque. Keep FLOOD_FULL equal to
// the 0.5 in InkPassage.astro.
const FLOOD_FULL = 0.5;

function setField(dark: boolean): void {
  if (dark) {
    if (root.dataset.field !== 'dark') root.dataset.field = 'dark';
  } else if (root.dataset.field) {
    delete root.dataset.field;
  }
}

function initPassages(): void {
  if (reduced) return;
  for (const el of document.querySelectorAll<HTMLElement>('[data-tul-passage]')) {
    const flips = el.dataset.belt === 'negro';
    const state = { p: 0 };
    el.style.setProperty('--p', '0');
    gsap.to(state, {
      p: 1,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
      onUpdate: () => {
        el.style.setProperty('--p', state.p.toFixed(4));
        if (flips) setField(state.p >= FLOOD_FULL);
      }
    });
  }
}

function initChapters(): void {
  const sections = document.querySelectorAll<HTMLElement>('main section[data-belt]');
  if (!sections.length) return;

  // A thin band at the middle of the viewport decides the active chapter.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        const belt = target.dataset.belt ?? 'blanco';
        setBelt(belt);
      }
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  );

  for (const section of sections) observer.observe(section);

  // Black belt passages: the header's form text follows the sub-scene at mid-viewport and falls
  // back to the chapter's own text when none is there.
  const passages = document.querySelectorAll<HTMLElement>('[data-form-label]');
  if (!passages.length || !formEl) return;

  const passageObserver = new IntersectionObserver(
    (entries) => {
      // Exits first, so moving from one passage to the next never ends on the fallback.
      for (const entry of entries) {
        if (entry.isIntersecting) continue;
        const fallback = grades[shownGrade]?.form;
        if (fallback) formEl.textContent = fallback;
      }
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const label = (entry.target as HTMLElement).dataset.formLabel;
        if (label) formEl.textContent = label;
      }
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  );

  for (const passage of passages) passageObserver.observe(passage);
}

// The entrance is pure CSS keyed on html.tul-intro (set by the layout's inline script).
// Clear it once it has played so the frame returns to solid strokes.
function endIntro(): void {
  if (!root.classList.contains('tul-intro')) return;
  gsap.delayedCall(2.4, () => root.classList.remove('tul-intro'));
}

// Entrances, once per element. Without motion, or without IntersectionObserver, nothing is
// hidden: the CSS "from" states exist only under html.js with motion allowed, and the plain
// state (visible title, full-opacity words) is what is left when this does not run.
//   [data-split-title]  chapter title ink (titleInk.ts): `.is-in` once the entrance has been built and starts
//                       (letters rise out of a SplitText mask while the TitleInk mark draws), `.is-done` when
//                       it has finished and the real h2 is back.
//   [data-words]        build-time word spans (`--i`): `.is-in` lets them settle, staggered by CSS.
//   [data-rise]         a block that rises with opacity: `.is-in`.
//   [data-belt-mark]    chapter belt mark: `.is-in` draws the outline in (700 ms), then fades the fill.
function initEntrances(): void {
  const titles = document.querySelectorAll<HTMLElement>('[data-split-title]');
  const reveals = document.querySelectorAll<HTMLElement>('[data-words], [data-rise], [data-belt-mark]');
  if (!titles.length && !reveals.length) return;

  const finish = (el: HTMLElement): void => {
    el.classList.add('is-in', 'is-done');
  };
  if (reduced || !('IntersectionObserver' in window)) {
    for (const el of titles) finish(el);
    for (const el of reveals) el.classList.add('is-in');
    return;
  }

  const titleObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        titleObserver.unobserve(el);
        if (!playTitleInk(el, () => el.classList.add('is-done'))) finish(el);
      }
    },
    { threshold: 0.4 }
  );
  for (const el of titles) titleObserver.observe(el);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealObserver.unobserve(entry.target);
        entry.target.classList.add('is-in');
      }
    },
    { threshold: 0.4 }
  );
  for (const el of reveals) revealObserver.observe(el);
}

initScenes();
initScrubs();
initPassages();
initChapters();
initEntrances();
endIntro();
// Desktop only, after load and idle: the 3D belt (three never loads otherwise).
bootBelt3d();
