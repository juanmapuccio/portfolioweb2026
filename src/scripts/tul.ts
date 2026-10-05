// The only scroll engine of the tul world. Native scroll, no smooth-scroll library.
//
// Contract for chapters (T4+):
//   [data-tul-scene]   element whose scroll span (top of element at viewport top, to its
//                      bottom at viewport bottom) writes `--p` (0..1) and `--draw`.
//   data-p-from/to     optional range (default 0..1) that --p is mapped onto for `--draw`.
//   --draw             consumed by FloorDiagram: stroke-dashoffset, stops and arrows.
//   main section[data-belt]  the chapter that sits at mid-viewport sets html[data-belt] and
//                      the header grade indicator ([data-grade-gup], [data-grade-form]).
// With reduced motion nothing is scrubbed: --p and --draw are 1, everything is drawn.
// Only GSAP's ticker schedules frames here; only CSS-driven transform, opacity, clip-path
// and stroke-dashoffset react to the variables.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Grade = { gup: string; form: string };

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

function readRange(el: HTMLElement): [number, number] {
  const from = parseFloat(el.dataset.pFrom ?? '0');
  const to = parseFloat(el.dataset.pTo ?? '1');
  return [Number.isFinite(from) ? from : 0, Number.isFinite(to) ? to : 1];
}

function write(el: HTMLElement, p: number, from: number, to: number): void {
  el.style.setProperty('--p', p.toFixed(4));
  el.style.setProperty('--draw', (from + (to - from) * p).toFixed(4));
}

function initScenes(): void {
  const scenes = document.querySelectorAll<HTMLElement>('[data-tul-scene]');

  for (const el of scenes) {
    if (reduced) {
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

function initChapters(): void {
  const indicator = document.querySelector<HTMLElement>('[data-grade-indicator]');
  const gupEl = document.querySelector<HTMLElement>('[data-grade-gup]');
  const formEl = document.querySelector<HTMLElement>('[data-grade-form]');

  let grades: Record<string, Grade> = {};
  try {
    grades = JSON.parse(indicator?.dataset.grades ?? '{}') as Record<string, Grade>;
  } catch {
    grades = {};
  }

  const sections = document.querySelectorAll<HTMLElement>('main section[data-belt]');
  if (!sections.length) return;

  const setBelt = (belt: string): void => {
    if (root.dataset.belt === belt) return;
    root.dataset.belt = belt;
    const grade = grades[belt];
    if (grade && gupEl) gupEl.textContent = grade.gup;
    if (grade && formEl) formEl.textContent = grade.form;
  };

  // A thin band at the middle of the viewport decides the active chapter.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setBelt((entry.target as HTMLElement).dataset.belt ?? 'blanco');
      }
    },
    { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
  );

  for (const section of sections) observer.observe(section);
}

initScenes();
initChapters();
