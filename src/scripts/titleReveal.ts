// Chapter title entrance: the letters rise out of a mask (SplitText). There is no mark under the title.
// The plugin is registered once in tul.ts. GSAP's ticker is the only scheduler; the tween moves
// transform only.
//
// The real h2 stays the accessible text: SplitText marks the split pieces aria-hidden and labels the
// heading, and `revert()` puts the original text node back once the entrance has finished.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

/**
 * Plays the entrance of one `[data-split-title]` wrapper. Returns false when it could not be built,
 * so the caller shows the finished state instead (the h2 is plain markup).
 */
export function playTitleReveal(wrap: HTMLElement, onDone: () => void): boolean {
  const heading = wrap.querySelector<HTMLElement>('h2');
  if (!heading) return false;

  let split: SplitText | undefined;
  try {
    split = SplitText.create(heading, { type: 'chars,words', mask: 'chars', aria: 'auto' });
    const letters = split.chars;
    const cleanUp = (): void => {
      split?.revert();
      onDone();
    };

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: cleanUp });
    tl.fromTo(letters, { yPercent: 105 }, { yPercent: 0, duration: 0.8, stagger: 0.03 }, 0);

    // The h2 becomes visible only now, already in its start state: no flash.
    wrap.classList.add('is-in');
    return true;
  } catch {
    split?.revert();
    return false;
  }
}
