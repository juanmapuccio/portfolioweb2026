// Tiny entry point, the only belt3d code the initial bundle contains besides the eligibility gate.
// Desktop: it checks eligibility and, once the page has loaded and the browser is idle, imports the scene
// (three lives only there). Phone: nothing loads until the person taps "Ver en 3D" in the hero (T12d); that tap
// checks WebGL and data saving and imports the same scene chunk on demand. "Ver en 2D" tears it down again.
import { isBelt3dEligible, isBelt3dTapAllowed } from './eligible';

const IDLE_TIMEOUT_MS = 3000;

/** The hero's phone toggle. It only exists in the markup; CSS shows it below 1024 px. */
function bindToggle(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-belt3d-toggle]');
  if (!button) return;
  const label = button.querySelector<HTMLElement>('[data-belt3d-label]');
  let on = false;
  let busy = false;
  button.addEventListener('click', () => {
    if (busy) return;
    if (!on && !isBelt3dTapAllowed()) {
      // No WebGL, or the connection asks to save data: the 2D floor stays and the button goes away.
      button.hidden = true;
      return;
    }
    busy = true;
    const next = !on;
    import('./scene')
      .then((scene) => {
        scene.setTapMode(next);
        on = next;
        button.setAttribute('aria-pressed', String(on));
        if (label) label.textContent = (on ? button.dataset.off : button.dataset.on) ?? label.textContent;
      })
      .catch(() => {
        button.hidden = true;
      })
      .finally(() => {
        busy = false;
      });
  });
}

export function bootBelt3d(): void {
  if (!document.querySelector('[data-belt-beat]')) return;
  bindToggle();
  if (!isBelt3dEligible()) return;

  const load = (): void => {
    import('./scene')
      .then((scene) => scene.mountBelt3d())
      .catch(() => {
        // The posters (the drawn belts) stay; nothing else to do.
      });
  };

  const whenIdle = (): void => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: IDLE_TIMEOUT_MS });
    else setTimeout(load, 1200);
  };

  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}
