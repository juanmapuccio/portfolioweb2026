// The belt drawing of a passage (BeltDrawing.astro) unties and ties again while the passage crosses the
// viewport. The timeline is paused and tul.ts drives its progress with the passage's own `--p`, so the
// scrub is the same one that moves the black flood. DrawSVG erases and redraws the outlines, opacity
// fades the fills and details, clip-path wipes the band to the next belt colour. Nothing else moves.
//
//   0.00 - 0.15  the `from` belt, tied
//   0.15 - 0.45  untie: outlines erased (last stroke first), knot and tail fills fade
//   0.35 - 0.65  the band's fill moves to the next belt colour (wipe, left to right)
//   0.55 - 0.90  tie: outlines drawn again, fills fade in; the 1st dan gold appears last
//   0.90 - 1.00  the `to` belt, tied
//
// Plugins are registered once in tul.ts. Without JS or with reduced motion nothing here runs and the
// drawing is the finished `to` belt.
import { gsap } from 'gsap';

/** Builds the paused timeline of one drawing, or null when its parts are missing or it cannot be drawn. */
export function buildBeltTimeline(svg: SVGSVGElement): gsap.core.Timeline | null {
  const fromLayer = svg.querySelector<SVGGElement>('[data-bd-from]');
  const bandTo = svg.querySelector<SVGUseElement>('[data-bd-band-to]');
  const ktFrom = svg.querySelector<SVGUseElement>('[data-bd-kt-from]');
  const ktTo = svg.querySelector<SVGUseElement>('[data-bd-kt-to]');
  const detail = svg.querySelector<SVGGElement>('[data-bd-detail]');
  const outlines = Array.from(svg.querySelectorAll<SVGPathElement>('[data-bd-draw]'));
  const gold = svg.querySelector<SVGGElement>('[data-bd-gold]');
  if (!fromLayer || !bandTo || !ktFrom || !ktTo || !detail || !outlines.length) return null;

  try {
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

    // The belt of the chapter that just ended is the starting state.
    gsap.set(fromLayer, { opacity: 1 });

    // Untie.
    tl.to(ktFrom, { opacity: 0, duration: 0.3 }, 0.15);
    tl.to(detail, { opacity: 0, duration: 0.25 }, 0.15);
    tl.to(outlines, { drawSVG: '0%', duration: 0.3, stagger: { each: 0.03, from: 'end' } }, 0.15);

    // The band changes colour while the belt is untied.
    tl.fromTo(bandTo, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3 }, 0.35);

    // Tie again, in the new colour.
    tl.fromTo(ktTo, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.58);
    tl.to(outlines, { drawSVG: '100%', duration: 0.3, stagger: 0.03 }, 0.55);
    tl.to(detail, { opacity: 1, duration: 0.25 }, 0.65);
    if (gold) tl.fromTo(gold, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.85);

    return tl;
  } catch {
    return null;
  }
}
