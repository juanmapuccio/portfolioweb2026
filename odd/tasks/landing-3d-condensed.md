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
