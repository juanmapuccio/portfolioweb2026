// The only scroll/animation engine: reveal observer, Lenis smooth scroll and
// scene progress, site header state (active link, belt, progress, hide on scroll),
// the loader (./loader), the 7h contact sheet and the 10y hold-to-send. Lenis is driven by
// the GSAP ticker so smooth scroll and ScrollTrigger share one frame loop; nothing else may
// schedule frames.
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

// 11k: header hides once scrolled down, and only returns when returning to the very top (scroll < 100)
// or when the user hovers over the top edge (CSS hover trigger).
const HEADER_HIDE_AFTER = 120;
function updateHeaderVisibility(scroll: number, _direction: number): void {
  if (!desktop.matches) return;
  const hide = scroll > HEADER_HIDE_AFTER;
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
    wheelMultiplier: 1.25,
    touchMultiplier: 1,
    syncTouch: false,
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
  // Keep smooth responsiveness across 120Hz/144Hz monitors while cushioning GC pauses
  gsap.ticker.lagSmoothing(500, 33);
}

function initScenes(): void {
  const scenes = document.querySelectorAll<HTMLElement>('[data-ink-scene]');
  if (scenes.length === 0) return;

  if (reduced) {
    scenes.forEach((el) => el.style.setProperty('--p', '1'));
    return;
  }

  scenes.forEach((el) => {
    let last = -1;
    const write = (progress: number): void => {
      // Throttle sub-pixel micro calculations below perceptual threshold (0.0005)
      if (Math.abs(progress - last) < 0.0005 && progress !== 0 && progress !== 1) return;
      last = progress;
      el.style.setProperty('--p', progress.toFixed(4));
    };

    // [data-ink-smooth] scenes ease --p toward the scroll progress with a short tween on a proxy
    // (the GSAP ticker drives it; no rAF or scroll listener of our own). Other scenes are exact.
    const smooth = el.hasAttribute('data-ink-smooth');
    const proxy = { v: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (!smooth) {
          write(self.progress);
          return;
        }
        gsap.to(proxy, { v: self.progress, duration: 0.6, ease: 'power2.out', overwrite: true, onUpdate: () => write(proxy.v) });
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

  // Set default initial state for hero if at page top
  if (window.scrollY < 100) {
    root.setAttribute('data-in-hero', '');
    setActive('hero');
  }

  document.querySelectorAll<HTMLElement>('main section[id]').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          setActive(section.id);
          root.toggleAttribute('data-in-hero', section.id === 'hero');
        }
      },
    });
  });

  // Belt scenes own their belt while the scrub runs (initBeltScenes); under reduced
  // motion their chapters are plain stacked blocks and use the generic rule below.
  const sceneOwned = (el: HTMLElement): boolean => !reduced && el.matches('[data-belt-scene], [data-belt-chapter]');
  document.querySelectorAll<HTMLElement>('[data-belt]').forEach((el) => {
    if (sceneOwned(el)) return;
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

// Belt scenes ([data-belt-scene] with [data-belt-chapter] children): chapter i is the
// active one when the scene progress is nearest to i / (n - 1), on the desktop horizontal
// track and on the mobile sticky stack alike. Sets <html data-belt> (header progress
// colour) and data-chapter on the scene. Skipped under reduced motion (no scrub there).
function initBeltScenes(): void {
  if (reduced) return;

  document.querySelectorAll<HTMLElement>('[data-belt-scene]').forEach((scene) => {
    const chapters = Array.from(scene.querySelectorAll<HTMLElement>('[data-belt-chapter]'));
    if (chapters.length === 0) return;

    let current = -1;
    const apply = (): void => {
      const belt = chapters[current]?.dataset.belt;
      if (belt) root.dataset.belt = belt;
    };

    ScrollTrigger.create({
      trigger: scene,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const index = Math.round(self.progress * (chapters.length - 1));
        if (index === current) return;
        current = index;
        scene.dataset.chapter = String(index);
        apply();
      },
      onToggle: (self) => {
        if (self.isActive && current >= 0) apply();
      },
    });
  });
}

// 7h bottom sheet: a button opens the native <dialog> it points at ([data-sheet-open]).
// showModal() gives the focus trap and Esc; the close button is a <form method="dialog">, so
// no handler is needed for it. Here: page scroll is paused while it is open and a click on
// the backdrop (the dialog element itself) closes it.
function initChannelSheet(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-sheet-open]').forEach((button) => {
    const dialog = document.getElementById(button.dataset.sheetOpen ?? '');
    if (!(dialog instanceof HTMLDialogElement)) return;
    button.addEventListener('click', () => {
      dialog.showModal();
      (window as LenisWindow).__lenis?.stop();
    });
    dialog.addEventListener('close', () => {
      (window as LenisWindow).__lenis?.start();
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

// 10y hold-to-send, only as a confirm for the WhatsApp link (no form, no backend): holding
// the button for HOLD_MS fills it (CSS, .is-holding) and then opens the link. Releasing early
// cancels. Keyboard and assistive activation (click with detail 0) opens it directly.
const HOLD_MS = 1200;
function initHoldToSend(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-hold-to-send]').forEach((button) => {
    const href = button.dataset.holdHref;
    if (!href) return;
    let timer: number | undefined;
    const cancel = (): void => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
      button.classList.remove('is-holding');
    };
    button.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      button.classList.add('is-holding');
      timer = window.setTimeout(() => {
        cancel();
        window.location.assign(href);
      }, HOLD_MS);
    });
    for (const type of ['pointerup', 'pointerleave', 'pointercancel']) button.addEventListener(type, cancel);
    button.addEventListener('contextmenu', (event) => event.preventDefault());
    button.addEventListener('click', (event) => {
      if (event.detail === 0) window.location.assign(href);
    });
  });
}

initReveal();
initScroll();
initLoader(reduced);
initScenes();
initSiteHeader();
initBeltScenes();
initChannelSheet();
initHoldToSend();
