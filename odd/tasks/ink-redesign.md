# ink-redesign

## Objective
Rebuild the portfolio presentation on the visual language of `design/Franjas Pincel.dc.html` and `design/franjas-pincel/` (sumi-e ink: brush strokes, seals, curtains, drips). Content, storytelling and the 3D belt come back later, incrementally.

## Problem / why
The current site has ~8,300 lines of presentation, two duplicated desktop/mobile trees and 90 string-contract tests tied to the old DOM. The user wants to redesign sections, animations and transitions first, ignoring current content. Full analysis and rationale: `C:\Users\juanr\.claude\plans\analiza-franjas-pincel-dc-html-y-sorted-gizmo.md` (approved 2026-10-03).

## Decisions (user)
- Branch strategy: new branch `feat/ink-redesign`, empty only the presentation layer. Keep `src/data`, `src/i18n`, `src/assets`, `public/*`, `Belt3D.astro` + `proceduralBelt.ts` and the lenis/gsap/three dependencies in the repo, unused for now.
- No Tailwind (the project does not use it and the catalog is CSS + variables).
- Belt colours (decided 2026-10-03): keep BOTH. Editorial design-system hex stays the base (`--belt-*`); the catalog's oklch values are added as a separate set (`--ink-belt-*`) used only by the ink animations.
- Piece selection per section is a design decision made by the user in F3 (`/lab`), not by the agent.

## Scope
In: F0 to F4 below. Out: real content, storytelling, 3D belt (F5).

## Constraints
- Only one scroll engine (`src/scripts/ink.ts` once it exists; Lenis + GSAP stay the underlying primitives).
- Animate only transform, opacity, clip-path, stroke-dashoffset. SVG filters only on static strokes, at most 1-2 filters per viewport; no `feTurbulence` on animated elements.
- `prefers-reduced-motion` handled per piece; text never depends on the animation.
- Copy from data modules, never hardcoded in components. Generated artifacts in English by default; the user converses in Spanish.
- Conventional commits, no co-author lines. Commit only the files of the task (unrelated modified files: `.gitignore`, `.vscode/settings.json`, `.htmlhintignore`, `.htmlvalidateignore`, `sonar-project.properties`).

## Route
Per phase: delegated direct (one bounded writer per phase), parent verifies and commits. TDD: not configured (source: `odd/tasks/mobile-immersive-portfolio.md`); ordinary functional checks. Runner: `bunx astro check`, `bun run build`, `bun test` (contract tests added from F2).
Known pre-existing failure on the old tree: `dark tail polish D2 ... skills reveals assemble categories` (goes away with the old tests in F1).

## Tasks
- [x] F0 Preserve and branch: phase 2 committed as `1de9874` on `feat/mobile-immersive`, branch `feat/ink-redesign` created from it.
- [x] F1 Empty the presentation (pages, section components, journey.ts, old tests); minimal Layout shell
- [x] F2 Foundation: tokens.css, InkDefs.astro, src/styles/ink/*.css (one-shot keyframes + reduced-motion), ink.ts engine, contract tests
- [ ] F3 Piece lab (`/lab`): port chosen specimens, user picks per section
  - [x] F3a Porting: 25 components in `src/components/ink/` + `/lab` page + `tests/ink-lab.test.ts` (not committed yet)
  - [ ] F3b User review on `/lab` (desktop and 393x852, with and without reduced motion) and per-section selection (pending, user decision)
- [x] F3b Storyboard: full A–N catalog analysed; per-section desktop/mobile diagrams, transitions, perf budget and stack in `docs/ink-storyboard.md` (2026-10-03). Pending: user approval per section.
- [ ] F4 Sections in one responsive tree, one sub-phase and commit each: S0 loader+header, S1 hero, S2 "No soy", S3 belts, S4 friction, S5 projects, S6 stack, S7 principles, S8 contact (details in `docs/ink-storyboard.md` §5)
- [ ] F5 (later) Reintroduce content, storytelling, Belt3D

## Acceptance criteria
- F1: `bunx astro check` and `bun run build` pass with the shell; no references to deleted components; data/i18n/Belt3D files untouched.
- F2: single engine, tokens present, reduced-motion rules, contract tests pass.
- F3: every ported piece reviewed by the user on `/lab` (desktop and 393x852, with and without reduced motion).

## Progress / evidence
- F0 (2026-10-03): `1de9874 feat(mobile): ink entrance on hero and fixed contact CTA` on `feat/mobile-immersive` (89 pass / 1 known fail, astro check 0 errors, build ok). Branch `feat/ink-redesign` created from it. Known gaps carried in that commit: faint brush stroke (stroke-opacity 0.1), CTA stays visible under reduced motion. They die with the old tree.
- F1 (2026-10-03, route: delegated writer, not committed yet): deleted 13 files (10 components, journey.ts, responsiveDetails.ts (no remaining importers), tests/final-sections.test.ts). Layout.astro reduced to head meta + fonts + global.css + lenis.css + `<slot />` (removed QR/qrcode, header, ticks, Lenis/GSAP, js-reveal). 3 index pages render one `<main><h1>` placeholder with meta from i18n. Belt3D.astro and proceduralBelt.ts untouched (no imports of deleted files). Deviation: one comment in `src/styles/global.css` line 9 reworded (it mentioned journey.ts). Checks: `bunx astro check` 0 errors, 0 warnings, 3 hints (pre-existing, from design/ files); `bun run build` ok, 3 pages built; `bun test` exits 1 with "0 test files matching" (no tests exist, expected); dangling-reference rg over src tests returns nothing. Unverified: no browser check.
- F2 (2026-10-03, route: delegated writer, not committed yet): created `src/styles/tokens.css` (moved whole :root out of global.css; hex `--belt-*` base + `--belt-orange`, oklch `--ink-belt-*`, `--seal-red`, `--ok-green`, `--paper`, `--fs-*`, `--lh-body`, `--tracking-*`, `--gutter`, `--section-pad`, `--gap`, `--header-h`; removed `--black-circle-max-radius`), `src/components/ink/InkDefs.astro` (filters dryH, dryV, dryM, bleedF, wash, brushS; revealMask and washi NOT ported, mask depends on a looping animation), `src/styles/ink/ink.css` (5 keyframes, utilities gated by `html.js` + `.is-in`, reduced-motion block), `src/scripts/ink.ts` (reveal observer, Lenis+GSAP, scene `--p`), `tests/ink-foundation.test.ts`. global.css now imports tokens.css and ink/ink.css; Layout renders `<InkDefs />` and one `<script>` importing ink.ts; 3 pages: h1 got `class="ink-rise" data-ink`. Checks: `bunx astro check` 0 errors, 0 warnings, 3 hints; `bun run build` ok, 3 pages; `bun test` 10 pass, 0 fail. Deviations: no ink-belt orange (catalog defines none); `.ink-rise` has no overflow mask on the h1 (smoke use only). Unverified: no browser check (animation, Lenis feel, reduced motion).
- F3a (2026-10-03, route: delegated writer, not committed yet): 25 components + `inkIcons.ts` in `src/components/ink/` (C: 1a 1b 2c 1f 4a 2i 10f 10g 10h 10i; J: 4b 3e 3f 11c 11g 11j 11l 11m; M: 9a InkIcon with 24 names, 9c 9d 9e 9f 9g 9j), `src/components/lab/LabCard.astro`, `src/pages/lab.astro` (noindex via new `Layout` prop `noindex`), `tests/ink-lab.test.ts`. Every loop converted to one pass via `.is-in`; filters only on bare static `<g>` (dashoffset draws under a filter became clip-path wipes; 11c ensō is unfiltered). Not ported: 11k (needs scroll engine, F4), 11d/e/f/h/i, 9b, 9h, 9i, 9k, 9f loading state. Checks: `bunx astro check` 0 errors, 0 warnings, 3 hints; `bun run build` ok, 4 pages (incl. `/lab`, robots noindex present); `bun test` 23 pass, 0 fail. Unverified: no browser check (animation feel, filter cost under CPU 4x, reduced motion, 393px layout).
- Engram mirror `odd/ink-redesign/tasks`: pending.

## Next step
F3a: parent reviews and commits; user reviews `/lab` and picks pieces per section (F3b); then F4.
