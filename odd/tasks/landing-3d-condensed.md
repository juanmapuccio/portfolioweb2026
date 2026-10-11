# Condensed 3D landing (belt sprint to black)

## Objective
Replace the home pages (`/`, `/en/`, `/pt/`) with a condensed, interactive 3D landing that moves quickly through the colored belts to the black belt, using smooth scroll-synced transitions.

## Problem and rationale
The current home renders six long belt chapters (`TulChapter`, 1000+ lines) separated by ink passages, plus Principles, TechSheet and an experience panel. Recruiters arrive on a phone via QR and scan fast; the page is too long for that first pass. The detailed content already lives in `/cv/`.

## Approved structure (user approved 2026-10-11)
1. Hero: name, role, contact CTA (`#contacto`) and CV CTA. White belt lands on the tatami.
2. Belt sprint: one sticky section; scrolling ~1.5 viewports moves the belt white → yellow → green → blue → red. Each belt shows one line only (grade + key milestone).
3. Black belt: existing gold tie/flood transition; holds the real content: compact project cards + condensed stack.
4. Close: contact links and link to the full CV (`/cv/`).

Removed from home: long chapters, InkPassage between every belt, Principles, TechSheet, ExperiencePanel.

## Constraints
- No Lenis / smooth-scroll library and no raw `requestAnimationFrame` (DESIGN.md §5, enforced by tests). Native scroll + GSAP ScrollTrigger scrub.
- Three.js stays gated by `eligible.ts` (desktop ≥1024px, WebGL, no reduced motion, no saveData); phones load it only on tap. Mobile shows the static belt representation.
- All copy in i18n sources (es default, en, pt). Preserve existing copy where reused; new one-line copy is condensed from existing data.
- Zero CLS, reduced-motion fallback with all content visible, progressive enhancement (content visible without JS).
- Keep belt colors in sync with `tokens.css` (`tests/tul-belt3d.test.ts`).

## Tasks
- [x] T1 — Condensed home composition: new sprint + black-belt sections, i18n keys (es/en/pt), update the three index pages, update home-structure tests (tul-chapters, tul-close, tul-hero, tul-ink, tul-panel, tul-cv).
- [x] T2 — Motion: scroll-synced sprint (belt color + line crossfades), black-belt transition reuse, reduced-motion fallback; 3D journey beats adapted to the condensed page.
- [x] T3 — Verification: `npm test`, `astro check`, `astro build`, browser check desktop + mobile + reduced motion.
- [x] T4 — Contact + footer in one screen (100svh, no pinned track) with living ink: drops fall onto the rule and merge
  (gooey SVG filter), ambient beads/buds paused offscreen, gooey hover on channels and the CTA; reduced motion static.

## Route
- T1+T2: delegated writer (touches 2+ non-trivial files; preparation reading belongs to the writer).
- T3: parent runs focused checks and browser preview.

## Delivery
Forecast: ~800-1200 authored changed lines (exceeds the ~400 budget). Strategy: ask-on-risk — ask before the PR.

## Progress / evidence
- Exploration done (subagent map, 2026-10-11).
- T1 done — route: delegated (writer). Commit `9073879` feat(home): replace home with condensed belt sprint landing.
  New `BeltSprint.astro`, `BlackBeltWork.astro`, `beltSprint.ts`; i18n keys `tul.sprint.title`, `tul.black.title`,
  `tul.black.stack`, `tul.close.cv` (es/en/pt); Kyong-ye links to `/cv/` per language; one InkPassage (rojo to negro)
  kept for the black flood. Home tests adapted (tul-chapters, tul-close, tul-ink, tul-panel) + `tests/tul-landing.test.ts`.
- T2 done — route: delegated (writer). Commit `4f1df3a` feat(motion): scroll-synced belt sprint and 3D journey for condensed home.
  `initSprint` (tul.ts, ScrollTrigger scrub 0.6, eased hold + cubic in-out), new 3D `shift` beat (journey.ts
  `shiftFrame`, scene.ts), black section is a travel beat on black. Tests: `tests/tul-sprint-motion.test.ts`.
- Checks (writer, 2026-10-11): `npx vitest run` 83/83 pass; `bun test tests/` 462 pass, 1 fail (pre-existing:
  `tuls.test.ts` reads `rules/graduaciones_...md`, absent in this worktree); `astro check` 0 errors; `astro build` ok.
  Quick headless Edge screenshots (375 and 1440, motion and reduced) looked right; full browser check is T3.
- Note: the tul tests run with `bun test`; `vitest.config.ts` only includes i18n and data tests.

- T4 done — route: delegated (writer; 2+ non-trivial files). Commit `cba547a` feat(contact): single-viewport close
  with living ink drops. `KyongYe.astro` (one 100svh grid stage: copy, floor, ink rule, channels, colophon; no sticky,
  no `--n` track), new `InkDrops.astro` (`#ky-goo`: feGaussianBlur + feColorMatrix alpha threshold + feComposite atop),
  `tul.ts` (`data-scene-span="enter"` draws the return line while the close scrolls in; `initInkDrops` IO toggles
  `is-live` / adds `is-in` once). Tests: `tests/tul-close.test.ts` "single-viewport close with living ink (T4)".
  Checks: `bun test tests/` 470 pass, 1 fail (pre-existing `tuls.test.ts` rules file); `astro check` 0 errors;
  `astro build` ok; headless Edge: section height = innerHeight at 1440x900, 1280x720, 375x812 and reduced motion,
  no horizontal overflow, no page errors.

## Next step
Ask the delivery strategy (single PR vs chained) before opening the PR.

## T5 — Sprint pacing and ink drops between belts (user request 2026-10-11, option B)
- [x] Each belt change gets 90svh of scroll (was 37.5svh) and holds 30% at each end (was 20%) so every line can be read. Revised below.
- [x] A light cousin of the red-to-black flood at every change: a drop of the new belt colour falls onto the band, spreads over the stage while the text hands over, then soaks away (`.bs__ink`, CSS only, driven by `--fill`).
- Route: inline (parent). RED: 4 new tests in `tests/tul-sprint-motion.test.ts` failed first; GREEN after. Checks: `bun test tests/` 474 pass / 1 pre-existing fail (missing rules/ file); `astro check` 0 errors; headless Edge sequence 1440 and 375, no page errors.
- [x] Revision (user: more animation time, a bit more scroll): 120svh per change, hold 20% each end, sine in-out instead of cubic. Motion scroll doubles (36svh to 72svh) and is spread evenly; reading pause 54svh to 48svh. Route: inline. Tests updated first (sine curve + 120svh RED), then GREEN; `bun test tests/` 475 pass / 1 pre-existing fail; `astro check` 0 errors; headless sequence shows even steps (pos 1.10, 1.25, 1.45, 1.66, 1.90).
- [x] Smoothing (user: scroll-to-animation coupling too fast): sprint ScrollTrigger scrub 1.2 to 2.5. Measured with 3 wheel ticks: before, 75% of the move in ~350ms and settled under 1s; after, an even deceleration settling in ~2s. Route: inline. `bun test tests/` 475 pass / 1 pre-existing fail; `astro check` 0 errors.

## T6 — Organic red-to-black passage, seamless with the sprint (user request 2026-10-11, impeccable animate)
- [x] The belt turns black organically while the field is still light: the 3D noise mask is now led by each cloth
  vertex's baked distance from the knot (`aSeep`) plus noise and fibres, so the ink enters at the knot and runs along
  the cloth. Mix is the shared seep (0.06-0.46 of the passage), black before the flood starts (0.5).
- [x] Phones / no 3D: the red step carries a black twin of its band and of its BeltMark, revealed from the knot by a
  build-time seep polygon (`clip-path: polygon(calc(...var(--seep)...))`) driven by `--pass` from the engine.
- [x] No seam: the flood passage (`.ink--flood`, `--pass-h` 140svh desktop / 120svh phone) overlaps the tail of the
  sprint track, the sprint's ScrollTrigger ends at the passage (`endTrigger`), so the stage stays pinned on the red
  belt throughout; the words fade (0.56-0.78) and the belt stays.
- [x] Flood from the knot: centre = 3D knot (published until 0.82), else the drawn knot of the stage (`--ink-ox/oy`,
  measured on refresh), else mid-view; edge is a seep polygon (short fibres) on every width plus the static
  feTurbulence displacement on desktop. FLOOD_FULL = 0.8 (shared constant in `src/scripts/belt3d/passage.ts`, passed
  to the CSS as inline custom properties); field flip unchanged in principle (only under full coverage).
- Design decisions: the 3D belt no longer flies to the middle (the pinned stage has text); gold stitches come up on the
  light field (0.3-0.6), the rim light during the flood (0.5-0.8); flood passage scrub 1.5 (calmer); the passage's own
  BeltDrawing is hidden in motion mode (the stage holds the belt). BlackBeltWork unchanged: it follows the unpinned
  stage directly (no empty screen beyond a short black-belt hold).
- Route: delegated writer (2+ non-trivial files). Test-first: `tests/tul-passage.test.ts` (25 tests) RED (module
  missing) then GREEN; adjusted `tul-flood`, `tul-belt3d`, `tul-sprint-motion` to the new contract.
- Checks: `bun test tests/` 500 pass / 1 pre-existing fail (`tuls.test.ts` rules file); `astro check` 0 errors;
  `astro build` ok; impeccable detect `[]`; headless Edge 1440x900, 375x812 and reduced motion: no page errors, no
  horizontal overflow, field flips at p 0.8, back to light on reverse scroll, dark after a reload deep in the page.
  One fix round: the flood fibres were shortened (`lead: 0.22`) after they read as spikes on the phone.
- Note: the dev server served stale BeltSprint CSS to the browser once (Vite HMR); re-saving the file fixed it.
