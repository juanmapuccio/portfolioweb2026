/**
 * Native <details> accordions that are always open on desktop (>= 768px)
 * and collapsed by default on mobile. Markup ships with `open`, so no-JS
 * and desktop render fully expanded; on mobile the script collapses them.
 */
const MOBILE_QUERY = '(max-width: 767px)';

export function initResponsiveDetails(selector: string): void {
  const items = document.querySelectorAll<HTMLDetailsElement>(selector);
  if (!items.length) return;

  const mq = window.matchMedia(MOBILE_QUERY);

  const sync = () => {
    items.forEach((el) => {
      el.open = !mq.matches;
    });
  };

  // On desktop the summary must not collapse the content.
  items.forEach((el) => {
    el.querySelector('summary')?.addEventListener('click', (event) => {
      if (!mq.matches) event.preventDefault();
    });
  });

  sync();
  mq.addEventListener('change', sync);
}
