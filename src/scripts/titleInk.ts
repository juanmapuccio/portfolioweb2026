// Chapter title entrance: the letters rise out of a mask (SplitText) while the dry-brush underline under
// the title is drawn from left to right (DrawSVG). Markup: TitleInk.astro (one shape for every belt).
// The plugins are registered once in tul.ts. GSAP's ticker is the only scheduler; every tween moves
// transform, opacity or stroke-dashoffset (through DrawSVG).
//
// The real h2 stays the accessible text: SplitText marks the split pieces aria-hidden and labels the
// heading, and `revert()` puts the original text node back once the entrance has finished.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

/**
 * Plays the entrance of one `[data-split-title]` wrapper. Returns false when it could not be built,
 * so the caller shows the finished state instead (the h2 and the mark are plain markup).
 */
export function playTitleInk(wrap: HTMLElement, onDone: () => void): boolean {
  const heading = wrap.querySelector<HTMLElement>('h2');
  if (!heading) return false;

  const strokes = Array.from(wrap.querySelectorAll<SVGPathElement>('.ti [data-ink-stroke]'));

  let split: SplitText | undefined;
  try {
    split = SplitText.create(heading, { type: 'chars,words', mask: 'chars', aria: 'auto' });
    const letters = split.chars;
    const cleanUp = (): void => {
      split?.revert();
      if (strokes.length) gsap.set(strokes, { clearProps: 'strokeDasharray,strokeDashoffset,opacity,visibility' });
      onDone();
    };

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: cleanUp });
    tl.fromTo(letters, { yPercent: 105 }, { yPercent: 0, duration: 0.8, stagger: 0.03 }, 0);

    if (strokes.length) {
      // Each streak of the brush is a path that runs left to right, so DrawSVG lays the stroke down in
      // reading direction; the small stagger makes the bristles trail the main body of the stroke.
      tl.fromTo(
        strokes,
        { drawSVG: '0%', autoAlpha: 0 },
        { drawSVG: '100%', autoAlpha: 1, duration: 0.7, stagger: 0.09, ease: 'power2.out' },
        0.2
      );
    }

    // The h2 and the mark become visible only now, already in their start state: no flash.
    wrap.classList.add('is-in');
    return true;
  } catch {
    split?.revert();
    return false;
  }
}
