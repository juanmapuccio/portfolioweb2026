// The only scroll/animation engine: reveal observer, Lenis smooth scroll and
// scene progress, site header state (active link, belt, progress, hide on scroll)
// and the loader (./loader). Lenis is driven by the GSAP ticker so smooth scroll
// and ScrollTrigger share one frame loop; nothing else may schedule frames.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLoader } from './loader';

type LenisWindow = Window & { __lenis?: Lenis };

const root = document.documentElement;
root.classList.add('js');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = matchMedia('(min-width: 768px)');

gsap.registerPlugin(ScrollTrigger);

// 11k: header hides on scroll down and returns on scroll up (desktop only).
const HEADER_HIDE_AFTER = 160;
function updateHeaderVisibility(scroll: number, direction: number): void {
  if (!desktop.matches || direction === 0) return;
  const hide = direction > 0 && scroll > HEADER_HIDE_AFTER;
  if (root.hasAttribute('data-header-hidden') !== hide) root.toggleAttribute('data-header-hidden', hide);
}

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

  lenis.on('scroll', (instance: Lenis) => {
    ScrollTrigger.update();
    updateHeaderVisibility(instance.scroll, instance.direction);
  });
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

// Site header state, all through ScrollTrigger (no extra scroll listeners):
// page progress -> --page-p on the header, section in view -> active nav link,
// nearest [data-belt] in view -> data-belt on <html>.
function initSiteHeader(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;

  let lastProgress = '';
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const value = self.progress.toFixed(4);
      if (value === lastProgress) return;
      lastProgress = value;
      header.style.setProperty('--page-p', value);
    },
  });

  const links = Array.from(header.querySelectorAll<HTMLAnchorElement>('.ink-11j__link'));
  const setActive = (id: string): void => {
    for (const link of links) {
      const on = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };

  document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) setActive(section.id);
      },
    });
  });

  document.querySelectorAll<HTMLElement>('[data-belt]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive && el.dataset.belt) root.dataset.belt = el.dataset.belt;
      },
    });
  });
}

initReveal();
initScroll();
initLoader(reduced);
initScenes();
initSiteHeader();
