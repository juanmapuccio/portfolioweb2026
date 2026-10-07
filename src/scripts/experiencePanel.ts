// The experience detail panel (ExperiencePanel.astro). One modal <dialog> per page; its content is cloned
// from an inert <template data-exp-template="<id>">, so nothing is fetched.
//
// Public API (for the 3D tatami and anything else that wants to open a position):
//   openExperience(id, opener?)           open the panel for a position id; false if the id is unknown
//   closeExperience()                     close it (animated; history is kept in sync)
//   window event "tul:open-experience"    detail: { id: string, opener?: HTMLElement }, same as openExperience
//
// Behaviour: showModal() traps focus; focus returns to the trigger on close; Esc, a click on the backdrop and
// the Close button close it; "#exp-<id>" opens it on load; opening pushes that hash, so the browser Back button
// closes it. The page scroll is locked with html.xp-lock (the scrollbar track is reserved, so nothing moves).
// Motion is CSS only (transform and opacity, 280 ms); with reduced motion it opens and closes at once.

const HASH = /^#exp-([\w-]+)$/;
const EXIT_MS = 280;
export const OPEN_EVENT = 'tul:open-experience';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

let trigger: HTMLElement | null = null;
/** True when this open pushed a history entry, so closing goes back instead of rewriting the URL. */
let pushed = false;
let closeTimer = 0;

const panel = (): HTMLDialogElement | null => document.querySelector<HTMLDialogElement>('dialog[data-exp-panel]');

function idFromHash(): string | null {
  return HASH.exec(location.hash)?.[1] ?? null;
}

function stripHash(): void {
  history.replaceState(history.state, '', location.pathname + location.search);
}

function show(id: string, opener: HTMLElement | null | undefined): boolean {
  const dlg = panel();
  const body = dlg?.querySelector<HTMLElement>('[data-exp-body]');
  const tpl = document.querySelector<HTMLTemplateElement>(`template[data-exp-template="${CSS.escape(id)}"]`);
  if (!dlg || !body || !tpl) return false;

  window.clearTimeout(closeTimer);
  dlg.removeAttribute('data-closing');
  body.replaceChildren(tpl.content.cloneNode(true));
  body.querySelector('[data-exp-title]')?.setAttribute('id', 'xp-title');
  dlg.setAttribute('aria-labelledby', 'xp-title');
  dlg.toggleAttribute('data-dark', tpl.dataset.belt === 'negro' || root.dataset.field === 'dark');

  if (!dlg.open) {
    trigger = opener ?? document.querySelector<HTMLElement>(`[data-exp-open="${CSS.escape(id)}"]`);
    root.classList.add('xp-lock');
    dlg.showModal();
  }
  const sheet = dlg.querySelector<HTMLElement>('.xp__sheet');
  if (sheet) sheet.scrollTop = 0;
  return true;
}

function finish(): void {
  const dlg = panel();
  if (!dlg?.open) return;
  const done = (): void => {
    dlg.close();
    dlg.removeAttribute('data-closing');
    dlg.querySelector('[data-exp-body]')?.replaceChildren();
    root.classList.remove('xp-lock');
    pushed = false;
    trigger?.focus({ preventScroll: true });
    trigger = null;
  };
  window.clearTimeout(closeTimer);
  if (reduced) {
    done();
    return;
  }
  dlg.setAttribute('data-closing', '');
  closeTimer = window.setTimeout(done, EXIT_MS);
}

/** Opens a position. Returns false when the panel or the id does not exist on this page. */
export function openExperience(id: string, opener?: HTMLElement | null): boolean {
  const dlg = panel();
  const wasOpen = !!dlg?.open;
  if (!show(id, opener)) return false;
  if (idFromHash() !== id) {
    history.pushState({ xp: id }, '', `#exp-${id}`);
    pushed = true;
  } else if (!wasOpen) {
    pushed = false;
  }
  return true;
}

export function closeExperience(): void {
  const dlg = panel();
  if (!dlg?.open || dlg.hasAttribute('data-closing')) return;
  if (pushed) {
    // popstate (below) finishes the close, so Back and the Close button share one path.
    pushed = false;
    history.back();
    return;
  }
  if (idFromHash()) stripHash();
  finish();
}

export function initExperiencePanel(): void {
  const dlg = panel();
  if (!dlg) return;

  document.addEventListener('click', (event) => {
    const button = (event.target as Element).closest<HTMLElement>('[data-exp-open]');
    if (!button?.dataset.expOpen) return;
    openExperience(button.dataset.expOpen, button);
  });

  dlg.addEventListener('click', (event) => {
    if (event.target === dlg || (event.target as Element).closest('[data-exp-close]')) closeExperience();
  });

  // Esc: take over the default close so the exit animation and the history entry stay in step.
  dlg.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeExperience();
  });

  window.addEventListener(OPEN_EVENT, (event) => {
    const detail = (event as CustomEvent<{ id?: string; opener?: HTMLElement }>).detail;
    if (detail?.id) openExperience(detail.id, detail.opener);
  });

  window.addEventListener('popstate', () => {
    const id = idFromHash();
    if (id) {
      if (show(id, null)) pushed = true;
    } else if (dlg.open) {
      finish();
    }
  });

  const initial = idFromHash();
  if (initial) show(initial, null);
}
