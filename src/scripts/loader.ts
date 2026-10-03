// Loader logic (S0), imported by ink.ts so the "single engine" contract holds: no
// frame loop here, only a coarse interval for the counter and CSS transitions for
// the visuals. Lenis is reached through window.__lenis (created in ink.ts).
//
// Progress is tied to real readiness (document.fonts.ready + window load) but never
// completes faster than the variant minimum nor slower than MAX_MS.
type LenisLike = { stop(): void; start(): void };
type LenisWindow = Window & { __lenis?: LenisLike };

const MIN_MS = { desktop: 1200, mobile: 2400 } as const; // mobile: the 11g drop needs ~2.4s to land
const MAX_MS = 3000;
const HOLD_MS = 150;
const EXIT_MS = 750;
const TICK_MS = 40;
const PENDING_CAP = 0.9; // the counter waits at 90% until the page is actually ready

// The hero manga entrance (HeroSection.astro) waits for `html.hero-ready`: added when the
// loader curtain starts to leave, at once without a loader (reduced motion, no markup), and by
// a safety timer so the hero can never stay hidden.
const HERO_FALLBACK_MS = 6000;
function markHeroReady(): void {
  document.documentElement.classList.add('hero-ready');
}

const easeInOut = (t: number): number => 0.5 - Math.cos(Math.PI * t) / 2;

let readiness: Promise<unknown> | null = null;
function whenReady(): Promise<unknown> {
  readiness ??= Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true })),
  ]);
  return readiness;
}

function isMobile(el: HTMLElement): boolean {
  const variant = el.dataset.variant ?? 'auto';
  if (variant === 'mobile') return true;
  if (variant === 'desktop') return false;
  return !matchMedia('(min-width: 768px)').matches;
}

function createPlayer(el: HTMLElement, preview: boolean, reduced: boolean) {
  const strokes = el.querySelectorAll<SVGPathElement>('[data-loader-stroke]');
  const counts = el.querySelectorAll<HTMLElement>('[data-loader-count]');
  const drops = el.querySelectorAll<HTMLElement>('.ink-11g');
  const page = document.documentElement;
  const main = document.querySelector('main');

  let ticker = 0;
  let exitTimer = 0;
  let run = 0;

  const render = (p: number): void => {
    const label = String(Math.round(p * 100)).padStart(2, '0');
    counts.forEach((node) => (node.textContent = label));
    strokes.forEach((node) => (node.style.strokeDashoffset = (1 - p).toFixed(3)));
  };

  const setBusy = (busy: boolean): void => {
    if (preview) return;
    for (const node of [page, main]) {
      if (!node) continue;
      if (busy) node.setAttribute('aria-busy', 'true');
      else node.removeAttribute('aria-busy');
    }
  };

  const finish = (id: number): void => {
    if (id !== run) return;
    el.classList.add('is-done');
    if (preview) return;
    markHeroReady();
    (window as LenisWindow).__lenis?.start();
    setBusy(false);
    // After the curtain is gone, take it out of the accessibility tree and the DOM.
    exitTimer = window.setTimeout(() => {
      el.hidden = true;
      el.remove();
    }, EXIT_MS + 100);
  };

  const play = (): void => {
    const id = ++run;
    window.clearInterval(ticker);
    window.clearTimeout(exitTimer);
    el.classList.remove('is-done');
    el.hidden = false;
    render(0);

    if (preview && reduced) {
      render(1);
      return;
    }

    drops.forEach((node) => node.classList.remove('is-in'));
    void el.offsetWidth;
    drops.forEach((node) => node.classList.add('is-in'));

    if (!preview) {
      (window as LenisWindow).__lenis?.stop();
      setBusy(true);
    }

    const minMs = isMobile(el) ? MIN_MS.mobile : MIN_MS.desktop;
    const startedAt = performance.now();
    let ready = false;
    let progress = 0;
    whenReady().then(() => {
      if (id === run) ready = true;
    });

    ticker = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const cap = ready || elapsed >= MAX_MS ? 1 : PENDING_CAP;
      const eased = easeInOut(Math.min(1, elapsed / minMs));
      progress = Math.max(progress, Math.min(eased, cap));
      render(progress);
      if (progress < 1) return;
      window.clearInterval(ticker);
      exitTimer = window.setTimeout(() => finish(id), HOLD_MS);
    }, TICK_MS);
  };

  return { play };
}

export function initLoader(reduced: boolean): void {
  const loaders = Array.from(document.querySelectorAll<HTMLElement>('[data-site-loader]'));
  if (reduced || !loaders.some((el) => !el.hasAttribute('data-loader-preview'))) markHeroReady();
  else window.setTimeout(markHeroReady, HERO_FALLBACK_MS);
  loaders.forEach((el) => {
    const preview = el.hasAttribute('data-loader-preview');
    if (reduced && !preview) {
      el.remove();
      return;
    }
    const player = createPlayer(el, preview, reduced);
    player.play();
    if (preview) el.addEventListener('loader:replay', () => player.play());
  });
}
