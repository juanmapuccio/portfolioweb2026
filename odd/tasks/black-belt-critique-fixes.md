# Black-belt critique fixes

## Objective
Act on the Impeccable critique of the home from the black belt onward (score 25/32, snapshot `.impeccable/critique/2026-10-11T22-44-41Z__src-pages-index-astro.md`): no broken-looking screen for a QR recruiter, the black belt as the strongest chapter, and a close with one clear action.

## Plan
Approved plan: `C:/Users/juanr/.claude/plans/por-donde-recomendarias-empezar-cosmic-barto.md`. User decision: the lead-case redesign uses no screenshots for now (built from `problem` / `solution` / `impact` in `src/data/projects.ts`).

## Constraints
- All copy via i18n/data sources in es/en/pt; Spanish keeps the existing voseo register.
- No Lenis, no raw requestAnimationFrame; tokens only; no gradients/shadows/blend modes in the close (tests).
- Reduced motion / no JS: legible static path. Zero CLS. Mobile first.
- Test contracts: `tests/tul-landing.test.ts:75-87`, `tests/tul-close.test.ts`, `tests/tul-passage.test.ts`, `tests/data/*`.

## Tasks
- [x] P1 — Corrections: shorten the post-flood tail so "Primer dan" rises as the field flips; hide sprint band outlines and phone belt mark on the dark field; fixed 2-column project grid at ≥48rem; static ink edge on the reduced-motion light→dark cut; de-duplicate the close pitch copy (es/en/pt).
- [ ] P2 — Close improvements: WhatsApp co-primary on phone, remove email duplicate, NodoSur to colophon (4 channels 2×2); title tracking, mobile title size, channel value size, thinner mobile ink rule, CTA bead hidden at rest, 44px language targets; hidden "new tab" text and name/value separator on channels.
- [ ] P3 — Redesign of the project block: `shape` first, then one lead case (problem → system → result + crisp SVG flow) and a compact index of the other three; belt ties to the lead case via the existing travel beat.
- [ ] P4 — Finish: `polish`, refresh `DESIGN.md` (`document`), re-run `critique` and read the trend.

## Route
- P1: delegated writer (2+ non-trivial files).
- P2: delegated writer.
- P3: `shape` inline (decision with user), then delegated writer.
- P4: inline.

## Delivery
Forecast ~700-1000 authored lines over four phases (above the ~400 budget). Strategy: one phase = one work-unit commit = one PR, chained to master in order.

## Progress / evidence
- 2026-10-11: branch `feat/black-belt-critique-fixes` from `master` (658b260).

- 2026-10-11: P1 done in `7688726` (route: delegated writer; trigger: 2+ non-trivial files). FLOOD_FULL 0.8 -> 0.88 (KNOT_UNTIL 0.9); BlackBeltWork pulled up by `--tail` (1 - FLOOD_FULL, from passage.ts) x `--pass-h` + 20svh with `--space-l` top padding in motion mode; `.bw__head` hidden until `html[data-field='dark']`, then rises (700ms); sprint `.bs__band` and `.bs__mark > *` fade out on the dark field; project grid 1 col / 2 cols from 48rem; static `.ink__edge` seep polygon (`--edge: 0.7`) on the reduced-motion/no-JS cut; close `subtitle` rewritten in es/en/pt.
  - Black stretch (scroll from field flip to the "Primer dan" heading top entering the viewport): before 0.42 vh desktop / 0.40 vh phone, after -0.13 / -0.12 (heading already in the lower view, revealed by the flip). Flip to heading at 60% of the view: before 0.82 / 0.80, after 0.27 / 0.28.
  - Checks: `bun test tests/` 509 pass / 1 known fail (tuls movement counts); `bun run check` 0 errors; `bun run test` 83 pass; `bun run build` ok; impeccable detect [] on the three .astro files; headless frames 1440x900, 375x812 and reduced motion (no page errors, no overflow, es/en/pt copy ok, reverse scroll and deep reload keep the flip). RDD review: not run by the writer (parent decides).

## Next step
P2.
