// The tooltip of a tatami post (T12c): one small HTML label, placed from coordinates the scene projects.
// It is a pointer helper only: the milestone rows and their "see detail" buttons stay the accessible path,
// so the tooltip is aria-hidden and never takes focus or pointer events. No three, no layout reads: the scene
// hands it viewport pixels, and it writes a transform.

export interface Tip {
  /** Show `text` above the viewport point (x, y); `w` clamps it inside the viewport. */
  show: (text: string, x: number, y: number, w: number) => void;
  hide: () => void;
  dispose: () => void;
}

const EDGE = 12;

export function createTip(): Tip {
  const el = document.createElement('div');
  el.className = 'tatami-tip';
  el.setAttribute('aria-hidden', 'true');
  document.body.append(el);
  let text = '';
  let shown = false;

  return {
    show(next, x, y, w) {
      if (next !== text) {
        text = next;
        el.textContent = next;
      }
      // The label is centred on x by CSS; keep half of it (at most) inside the viewport.
      const half = Math.min(el.offsetWidth, w - 2 * EDGE) / 2;
      const cx = Math.min(w - EDGE - half, Math.max(EDGE + half, x));
      el.style.transform = `translate3d(${cx.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      if (!shown) {
        shown = true;
        el.classList.add('is-on');
      }
    },
    hide() {
      if (!shown) return;
      shown = false;
      el.classList.remove('is-on');
    },
    dispose() {
      el.remove();
    }
  };
}
