// Chapter title entrance: the letters rise out of a mask (SplitText) while the sumi-e mark under or
// beside the title draws (DrawSVG strokes, a MorphSVG splat, scaling spatter). Markup: TitleInk.astro.
// The plugins are registered once in tul.ts. GSAP's ticker is the only scheduler; every tween moves
// transform, opacity, stroke-dashoffset (through DrawSVG) or the path data of one decorative splat.
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

  const ink = wrap.querySelector<SVGSVGElement>('.ti');
  const strokes = ink ? Array.from(ink.querySelectorAll<SVGPathElement>('[data-ink-stroke]')) : [];
  const dots = ink ? Array.from(ink.querySelectorAll<SVGCircleElement>('[data-ink-dot]')) : [];
  const morph = ink?.querySelector<SVGPathElement>('[data-ink-morph]') ?? null;

  const finalShape = morph?.getAttribute('d') ?? '';
  let split: SplitText | undefined;
  try {
    split = SplitText.create(heading, { type: 'chars,words', mask: 'chars', aria: 'auto' });
    const letters = split.chars;
    const cleanUp = (): void => {
      split?.revert();
      gsap.set(strokes, { clearProps: 'strokeDasharray,strokeDashoffset,opacity,visibility' });
      gsap.set(dots, { clearProps: 'transform' });
      onDone();
    };

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: cleanUp });
    tl.fromTo(letters, { yPercent: 105 }, { yPercent: 0, duration: 0.8, stagger: 0.03 }, 0);

    if (strokes.length) {
      tl.fromTo(
        strokes,
        { drawSVG: '0%', autoAlpha: 0 },
        { drawSVG: '100%', autoAlpha: 1, duration: 0.7, stagger: 0.09, ease: 'power2.out' },
        0.2
      );
    }

    if (morph) {
      const thin = morph.dataset.from;
      if (thin && finalShape) {
        morph.setAttribute('d', thin);
        tl.to(morph, { morphSVG: finalShape, duration: 0.7 }, 0.2);
      }
    }

    if (dots.length) {
      tl.fromTo(
        dots,
        { scale: 0, transformOrigin: '50% 50%' },
        { scale: 1, duration: 0.45, stagger: 0.04, ease: 'back.out(2.2)' },
        0.5
      );
    }

    // The h2 and the mark become visible only now, already in their start state: no flash.
    wrap.classList.add('is-in');
    return true;
  } catch {
    split?.revert();
    if (morph && finalShape) morph.setAttribute('d', finalShape);
    return false;
  }
}
