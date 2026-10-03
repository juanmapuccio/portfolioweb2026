// The only scroll/animation engine: reveal observer, Lenis smooth scroll and
// scene progress. Lenis is driven by the GSAP ticker so smooth scroll and
// ScrollTrigger share one frame loop; nothing else may schedule frames.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type LenisWindow = Window & { __lenis?: Lenis };

const root = document.documentElement;
root.classList.add('js');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-ink]');
  if (targets.length === 0) return;

  if (reduced || typeof IntersectionObserver === 'undefined') {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => io.observe(el));
}

function initScroll(): void {
  if (reduced) return;

  const lenis = new Lenis({
    duration: 0.9,
    wheelMultiplier: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: false,
    anchors: { offset: 0 },
    // Nested scrollers only get the gesture when their overflow matches the
    // gesture axis; otherwise the page keeps the smoothed scroll.
    virtualScroll: ({ deltaX, deltaY, event }) => {
      const target = event.target;
      const el = target instanceof Element ? target.closest<HTMLElement>('[data-nested-scroll]') : null;
      if (!el) return true;
      const isVertical = Math.abs(deltaY) >= Math.abs(deltaX);
      if (isVertical) return el.scrollHeight <= el.clientHeight + 1;
      return el.scrollWidth <= el.clientWidth + 1;
    },
  });

  (window as LenisWindow).__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function initScenes(): void {
  const scenes = document.querySelectorAll<HTMLElement>('[data-ink-scene]');
  if (scenes.length === 0) return;

  if (reduced) {
    scenes.forEach((el) => el.style.setProperty('--p', '1'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  scenes.forEach((el) => {
    let last = '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const value = self.progress.toFixed(4);
        if (value === last) return;
        last = value;
        el.style.setProperty('--p', value);
      },
    });
  });
}

initReveal();
initScroll();
initScenes();
