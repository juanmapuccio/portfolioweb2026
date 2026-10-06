// Tiny entry point, the only belt3d code the initial bundle contains besides the eligibility gate.
// It checks eligibility and, once the page has loaded and the browser is idle, imports the scene
// (three lives only there).
import { isBelt3dEligible } from './eligible';

const IDLE_TIMEOUT_MS = 3000;

export function bootBelt3d(): void {
  if (!document.querySelector('[data-belt3d]')) return;
  if (!isBelt3dEligible()) return;

  const load = (): void => {
    import('./scene')
      .then((scene) => scene.mountBelt3d())
      .catch(() => {
        // The poster (or the plain hero) stays; nothing else to do.
      });
  };

  const whenIdle = (): void => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: IDLE_TIMEOUT_MS });
    else setTimeout(load, 1200);
  };

  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
}
