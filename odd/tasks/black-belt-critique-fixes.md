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
- [x] P2 — Close improvements: WhatsApp co-primary on phone, remove email duplicate, NodoSur to colophon (4 channels 2×2); title tracking, mobile title size, channel value size, thinner mobile ink rule, CTA bead hidden at rest, 44px language targets; hidden "new tab" text and name/value separator on channels.
- [ ] P3 — Redesign of the project block: `shape` first, then one lead case (problem → system → result + crisp SVG flow) and a compact index of the other three; belt ties to the lead case via the existing travel beat.
- [ ] P4 — Finish: `polish`, refresh `DESIGN.md` (`document`), re-run `critique` and read the trend.

## Route
- P1: delegated writer (2+ non-trivial files).
- P2: delegated writer (2+ non-trivial files).
- P3: `shape` inline (decision with user), then delegated writer.
- P4: inline.

## Delivery
Forecast ~700-1000 authored lines over four phases (above the ~400 budget). Strategy: one phase = one work-unit commit = one PR, chained to master in order.

## Progress / evidence
- 2026-10-11: branch `feat/black-belt-critique-fixes` from `master` (658b260).

- 2026-10-11: P1 done in `7688726` (route: delegated writer; trigger: 2+ non-trivial files). FLOOD_FULL 0.8 -> 0.88 (KNOT_UNTIL 0.9); BlackBeltWork pulled up by `--tail` (1 - FLOOD_FULL, from passage.ts) x `--pass-h` + 20svh with `--space-l` top padding in motion mode; `.bw__head` hidden until `html[data-field='dark']`, then rises (700ms); sprint `.bs__band` and `.bs__mark > *` fade out on the dark field; project grid 1 col / 2 cols from 48rem; static `.ink__edge` seep polygon (`--edge: 0.7`) on the reduced-motion/no-JS cut; close `subtitle` rewritten in es/en/pt.
  - Black stretch (scroll from field flip to the "Primer dan" heading top entering the viewport): before 0.42 vh desktop / 0.40 vh phone, after -0.13 / -0.12 (heading already in the lower view, revealed by the flip). Flip to heading at 60% of the view: before 0.82 / 0.80, after 0.27 / 0.28.
  - Checks: `bun test tests/` 509 pass / 1 known fail (tuls movement counts); `bun run check` 0 errors; `bun run test` 83 pass; `bun run build` ok; impeccable detect [] on the three .astro files; headless frames 1440x900, 375x812 and reduced motion (no page errors, no overflow, es/en/pt copy ok, reverse scroll and deep reload keep the flip). RDD review: not run by the writer (parent decides).

- 2026-10-11: P2 done in `d5058a2` (route: delegated writer; trigger: 2+ non-trivial files). `closeChannels(lang)` / `CLOSE_CHANNEL_IDS` in `contact.ts` select WhatsApp, LinkedIn, GitHub for the close; the data keeps all five channels (QuickCv on `/cv/` lists them). Email lives only in its CTA; NodoSur is a small new-tab link in the colophon row. Decision: removing Email and NodoSur leaves three channels, so the fourth item of the 2x2 is the CV of the language (the plain CV link left the actions row, no duplicate). Phones (<48rem): email CTA + outlined WhatsApp CTA side by side (arrow hidden, `text-wrap: balance`); from 48rem one CTA and four channels in a row. WhatsApp stays in the channels on every viewport (hiding it on phones would break the 2x2). Title `letter-spacing: -0.01em`, `min(var(--step-3), 5.5svh)`; channel values 0.875rem; phone channel cell: icon by the name, value full width; language links 44x44; CTA drip bead `opacity: 0` at rest, 1 on hover/focus-visible; phone ink rule `var(--line)` with beads/film x0.7 (`--bead`), full weight from 48rem; map row min `min(7.5rem, 14svh)` and `row-gap: var(--space-2xs)` on short phones (max-height 44rem) keep 375x667 on one screen. A11y: external channels `target=_blank` + `rel="noopener noreferrer"` + hidden `tul.cv.newTab`; a visually hidden " · " between name and value (names read "LinkedIn · in/jmpuc92 (opens in a new tab)"); the separator is not visible because name and value sit on two lines. New key `tul.close.whatsapp` (es/en/pt).
  - RED: `bun test tests/tul-close.test.ts tests/tul-close-fixes.test.ts` -> 23 pass, 2 fail, 1 error (missing `CLOSE_CHANNEL_IDS`/`closeChannels` exports, `items.map(` absent); after the KyongYe-only GREEN step 37 pass / 1 fail (ink rule test), then all green.
  - Checks: `bun test tests/` 523 pass / 1 known fail (tuls movement counts); `bun run check` 0 errors 0 warnings; `bun run test` 83 pass; `bun run build` ok; impeccable detect [] on KyongYe/InkDrops; headless Edge (astro preview :4392) `/`, `/en/`, `/pt/` at 1440x900, 375x812, 375x667 + reduced motion 375x812/1440x900: section height = viewport in every case, no horizontal overflow, 4 channels (2 cols x 2 rows on phone, 4x1 desktop), 0 page errors.

## Next step
P3.
