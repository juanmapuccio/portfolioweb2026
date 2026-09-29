# Match the final portfolio sections to the reference

## Objective
Reproduce the supplied reference screenshots in the portfolio's final human/ethics, technology stack, availability/contact, and footer sections while preserving Astro, localization, accessibility, and existing contact behavior.

## Problem and rationale
The current final sections use centered headings and card grids, while the reference uses an editorial composition: an oversized serif heading and separated human/ethics rows with large italic quotations; a left-aligned stack heading followed by five open columns; and a full-width dark availability/contact section with a large display statement, two actions, five horizontal contact rows, and a minimal footer.

## Scope and constraints
- Work in the current Astro application in the repository root; do not alter reference HTML files or unrelated untracked assets.
- Keep existing Spanish, English, and Portuguese content and destinations functional; use the supplied Spanish screenshots as visual authority.
- Preserve the existing warm paper palette and serif/sans/monospace type system while matching the screenshot's dark contact panel and restrained green status mark.
- Make the layout responsive and keep semantic links, keyboard focus, and reduced-motion/accessibility behavior intact.
- TDD is explicitly enabled for this feature by the user; use Bun's built-in test runner (`bun test`) without adding a testing dependency.
- Route: delegated direct implementation. Evidence: the cohesive UI work touches multiple non-trivial component, data, and layout files and requires reading the code that prepares the write.
- Advisory authored-change heuristic: approximately 400 lines; advisory only, never a cap.

## Acceptance criteria
- The human/ethics section matches the reference's title, thin horizontal separators, two-column text/quote rows, scale, whitespace, and responsive stacking.
- The stack section matches the reference's left-aligned heading and five open columns with top rules, compact labels, headings, and plain lists rather than boxed cards.
- Availability/contact matches the reference's near-black panel, green availability marker, large left-aligned serif headline, supporting copy, WhatsApp/CV actions, full-width channel rows, and bottom location/copyright line.
- All supported locales retain correct content and valid links; small screens have no horizontal overflow.
- Bun regression tests demonstrate RED before implementation and GREEN after; `bun run check` and `bun run build` pass.

## Applicable checks
- `bun test`
- `bun run check`
- `bun run build`
- Structural readback of the changed Astro/CSS and locale data.

## Tasks
- [x] **FSR-1 — Rebuild the final portfolio sections to match the reference.** Added focused Bun tests first, then updated the human/ethics, skills, availability/contact, and footer presentation; all applicable checks passed.

## Progress and evidence
- TDD mode: on (explicit user choice); runner: Bun built-in test runner.
- Baseline: package.json had no test script or test framework; existing Astro validation/build scripts are available.
- Implementation: rebuilt the human/ethics block and five skill columns; replaced the card-based contact design with the dark editorial panel and moved the compact location/copyright footer into it. Added four Bun regression tests (25 assertions). The writer reported RED before implementation and GREEN after; the independent verifier could not independently inspect that earlier RED result.
- Verification: parent `bun test` passed (4 tests, 25 assertions); independent `bun test`, `bun run check` (0 errors; existing unrelated warnings/hints), and `bun run build` passed. The Impeccable detector reported no findings. `git diff --check` passed.
- Risk assessment: native assessment returned `high` / `unassessable` because existing untracked files were undeclared; an independent read-only verification found no actionable defects. RDD is off globally, so no native review transaction was started.
- Branch: `feat/match-final-sections-to-reference`.
- Work-unit commit: `8d4ba0c` (`feat: match final portfolio sections to reference`).
- Next step: none.
