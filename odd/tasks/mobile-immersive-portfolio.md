# mobile-immersive-portfolio

## Objective
Integrate the "Portfolio 3D inmersive" Claude Design (reference: `design/portfolio-inmersivo.dc.html`) as the mobile-only (<=767px) experience. Desktop (>767px) stays exactly as is.

## Constraints
- Branch: `feat/mobile-immersive` (from `feat/scroll-engine-consolidation` line).
- Single scroll engine: `ScrollTrigger.create`/`registerPlugin` only in `src/scripts/journey.ts`; Lenis only in `Layout.astro`; no new rAF/wheel loops.
- No copy duplication: read from `src/data/*` (es/en/pt).
- Conventional Commits, no AI attribution (user rule).
- Plan: `C:\Users\juanr\.claude\plans\deberiamos-integrarlo-al-proyecto-glowing-flask.md`

## Resolved config
- TDD: not configured (source: no project/session setting found). Ordinary functional checks.
- Runner: `bun test` (string-assertion tests in `tests/final-sections.test.ts`), `bunx astro check`, `bun run build`.
- RDD review: assess per work-unit commit when enabled.
- Delivery strategy: ask-on-risk. Forecast ~600 changed lines (new component dominates).

## Tasks
- [x] T1 Tokens: add `--belt-*`, `--panel-dark(-fg)` to `src/styles/global.css` (additive).
- [x] T2 Engine: add `registerScene` (`--p/--v/--e`) to `journey.ts`; register `[data-scene]` only <=767px, skip desktop `[data-fx]/[data-zone]` there and vice versa.
- [x] T3 Component: `src/components/MobileImmersive.astro` with 6 scenes, data from `src/data/*`.
- [x] T4 Wiring: mount in `HomePage.astro`, CSS swap at 767px, mobile ids + `Layout.astro` nav target resolution.
- [x] T5 Tests: string tests for the new contract; `bun test`, `astro check`, `build` green.
- [ ] T6 Browser verification: 375 immersive; 768/1024/1440 unchanged; reduced motion.

## Route declaration
- T1-T4: delegated writer (2+ non-trivial files, writer trigger). T5-T6: inline checks.

## Progress / evidence
- T1 480181f style(tokens). T2 24b800c feat(scroll) registerScene + 767px gate (parked registrations replayed on breakpoint change). T3+T4 315f685 feat(mobile) (combined: intermediate state would not build/swap). T5 dd11e79 test(mobile).
- Checks (after T5): bun test 76 pass / 0 fail; bunx astro check 0 errors; bun run build exit 0 (one transient Windows EBUSY-style rename failure on the first T3/T4 build, passed on immediate rerun, unrelated to code).
- Deviations: manifesto copy moved to src/data/manifesto.ts (desktop ManifestoScrollytelling now imports it, frontmatter only) to avoid duplicating copy; journey.ts also syncs header belt ticks from the mobile belts/contact scenes (syncSceneBelt); Layout maps #blanco..#negro ticks to belts-scene rows on mobile.
- T6 pending (parent).

## Next step
T6 browser verification (parent).
