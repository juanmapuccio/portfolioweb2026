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
//   main section[data-belt]  the chapter that sits at mid-viewport sets html[data-belt] and
//                      the header grade indicator ([data-grade-gup], [data-grade-form]).
//   data-next-belt     optional on a scene: once its tie-in plane has risen (--p past TIE_AT) the
//                      header flips to that belt early, so the bar never shows the old field on the
//                      new one. The plane itself is CSS-only (clip-path driven by --p).
//   data-grade-belt    optional on a chapter section: the header indicator text (gup, form) comes from
//                      this belt while html[data-belt] still follows the field. Used by the white-field
//                      close (principles, sheet, Kyong-ye), which the visitor reaches as 1st dan.
//   data-next-grade-belt  optional on a scene with data-next-belt: the grade shown once the tie-in flips.
//   data-form-label    optional on a sub-scene (black belt passages): the header's form text shows
//                      this label while the sub-scene sits at mid-viewport.
// With reduced motion nothing is scrubbed: --p and --draw are 1, everything is drawn.
// Only GSAP's ticker schedules frames here; only CSS-driven transform, opacity, clip-path
// and stroke-dashoffset react to the variables.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Grade = { gup: string; form: string };

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

type Grades = Record<string, Grade>;

/** Scene progress at which the next belt's plane has fully risen (see TulChapter's tie-in). */
const TIE_AT = 0.985;

const indicator = document.querySelector<HTMLElement>('[data-grade-indicator]');
const gupEl = document.querySelector<HTMLElement>('[data-grade-gup]');
const formEl = document.querySelector<HTMLElement>('[data-grade-form]');

let grades: Grades = {};
try {
  grades = JSON.parse(indicator?.dataset.grades ?? '{}') as Grades;
} catch {
  grades = {};
}

/** Belt whose grade the indicator currently shows (can differ from the field belt). */
let shownGrade = '';

function setBelt(belt: string, gradeBelt: string = belt): void {
  if (root.dataset.belt !== belt) root.dataset.belt = belt;
  if (shownGrade === gradeBelt) return;
  shownGrade = gradeBelt;
  const grade = grades[gradeBelt];
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

    // Early flip, driven by raw scroll (not the smoothed scrub) so fast jumps cannot race.
    const nextBelt = el.dataset.nextBelt;
    const ownSection = el.closest<HTMLElement>('[data-belt]');
    const ownBelt = ownSection?.dataset.belt;
    const ownGrade = ownSection?.dataset.gradeBelt ?? ownBelt;
    const nextGrade = el.dataset.nextGradeBelt ?? nextBelt;
    if (nextBelt && ownBelt) {
      gsap.to({}, {
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            if (self.progress <= 0 || self.progress >= 1) return;
            if (self.progress >= TIE_AT) setBelt(nextBelt, nextGrade);
            else setBelt(ownBelt, ownGrade);
          },
          onLeave: () => setBelt(nextBelt, nextGrade)
        }
      });
    }
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
        setBelt(belt, target.dataset.gradeBelt ?? belt);
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
        const fallback = grades[shownGrade || (root.dataset.belt ?? '')]?.form;
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
//   [data-split-title]  chapter title cut: `.is-in` starts the CSS animation, `.is-done` (after the
//                       rule has drawn) swaps the decorative halves for the real h2.
//   [data-words]        build-time word spans (`--i`): `.is-in` lets them settle, staggered by CSS.
//   [data-rise]         a block that rises with opacity: `.is-in`.
function initEntrances(): void {
  const titles = document.querySelectorAll<HTMLElement>('[data-split-title]');
  const reveals = document.querySelectorAll<HTMLElement>('[data-words], [data-rise]');
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
        el.classList.add('is-in');
        const line = el.querySelector('.tc__slash line');
        if (line) line.addEventListener('animationend', () => el.classList.add('is-done'), { once: true });
        else el.classList.add('is-done');
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
initChapters();
initEntrances();
endIntro();
