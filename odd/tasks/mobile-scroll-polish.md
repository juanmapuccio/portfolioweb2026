# mobile-scroll-polish

## Objective
Improve scroll feel, smoothness and interactivity of the mobile (<=767px) immersive experience. Desktop (>767px) stays untouched.

## Constraints
- Branch `feat/mobile-immersive`. Single scroll engine (ScrollTrigger only in `journey.ts`, Lenis only in `Layout.astro`).
- `MobileImmersive.astro` must keep passing the existing string tests (no `addEventListener`, `requestAnimationFrame`, `blur(`, `--mx`, `data-nested-scroll`, `ScrollTrigger.create`, `new Lenis`).
- Existing assertions must not be weakened.
- Conventional Commits, no AI attribution (user rule).

## Resolved config
- TDD: not configured. Ordinary functional checks. Runner: `bun test`, `bunx astro check`, `bun run build`.
- RDD: off (global). Delivery: ask-on-risk.
- Performance baseline: no reliable metric available in headless Chromium (no real frames; CDP metrics read 0). Validation is by code review, tests and screenshots, not numbers.

## Tasks
- [x] P1 `journey.ts`: batch reads before writes across scenes (read all rects first, then write), keeping the pinned math strings.
- [x] P2 Unify viewport units in the mobile tree (svh/vh/innerHeight mismatch) via one stable measured height.
- [x] P3 Promote layers only while active (replace permanent `will-change` on 6 layers).
- [x] P4 Lengthen too-short scenes (hero, manifesto, stack) and check nav fractions.
- [x] P5 Touch feedback: tap highlight, `:active`, `touch-action: manipulation`, `:focus-visible`.
- [x] P6 `overflow: clip` on layers (focus no longer scrolls the clipped carousel) + minimal focus-to-scroll mapping if it fits the test constraints.
- [x] P7 `overscroll-behavior-y: none` scoped to <=767px; distance-scaled anchor duration on mobile only (desktop branch string kept).
- [x] P8 Browser verification (375): scenes, nav taps, focus, reduced motion; 768/1024/1440 unchanged.

## Out of scope (needs user decision)
Horizontal swipe on the carousel, replacing filter/clip-path effects, scroll-driven animations, skipping Lenis on touch.

## Route declaration
- P1-P7: delegated writer (2+ non-trivial files). P8: inline.

## Progress / evidence
P1-P7 done. Commits: 94c45c6 (engine, svh, will-change, CSS, Layout nav/duration), 3ac7e59 (overscroll), 09321bd (tests).
Checks: bun test 83 pass/0 fail; astro check 0 errors; build OK.

P8 (parent, Playwright/Chromium vs the existing preview on :4322 serving the rebuilt dist): 375x812 probe height == innerHeight (812); `data-active` toggles only on the 1-2 scenes in range (hero; hero+manifesto; ...; stack+contact); header tick taps land on the belts scene (rojo y=6836, negro y=7035, ~2.6 s); keyboard focus on project card 3 scrolls the page to y=4439 with the card fully visible at left 20 and the carousel container scrollLeft staying 0 (overflow: clip works); no console/page errors; reduced motion, es/en and 768/1024/1440 structurally unchanged (mobile tree display:none, same docH as before).
Defect found and fixed in P8: the stack scene opened with a 24% cream box popping over the trayectoria scene (clip-path inset 38% at v=0). Changed to 50% so it opens from a point; commit below.
Limits: no real-device or throttled-frame measurement (headless gives no real frames), Safari not tested, pt not opened, desktop not pixel-diffed.

## Next step
Decide the out-of-scope items (carousel swipe, effect cost swaps), then push/PR under ordinary repository policy.
