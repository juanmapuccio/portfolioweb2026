# Belt-led portfolio reorganization

## Objective
Reorganize the existing portfolio around the Taekwon-Do belt progression, using the Claude Design v3 prototype as a composition and interaction reference: a navigable belt rail, existing content in the main column, and a prominent sticky 3D belt on desktop; mobile uses a static compact belt representation.

## Problem and rationale
The current 3D belt is decorative and separate from the page's main reading flow. The prototype gives the belt a meaningful role as the visual anchor for the existing progression and makes each chapter easier to navigate. The mobile entry is primarily QR-driven, so it must not download the 5.66 MB GLB or initialize Three.js.

## Authorized scope
- Reorganize the shared Astro page composition and existing section layout/navigation.
- Promote the existing Belt3D viewer into a persistent desktop sticky presentation.
- Reuse the existing `BeltKnot.astro` vector as a compact static mobile belt representation, tinting it from the active belt state; no Three.js or GLB request on mobile.
- Synchronize the desktop model and grade navigation with the existing belt progression, including the black-belt transition.
- Add or update focused regression tests and visual verification evidence.

## Constraints
- Preserve all existing copy verbatim in Spanish, English, and Portuguese, including Spanish voseo. Do not reuse or rewrite the prototype's copy.
- The prototype is a bundled reference, not a source-code base. Do not port its runtime, introduce its retired Education section, or copy unverified claims.
- Keep existing products, section content, links, and translation data intact; use the existing `BELTS` and section data as the source of truth.
- Maintain the current editorial design system, semantics, accessibility, reduced-motion behavior, and progressive enhancement.
- Mobile must render the existing static `BeltKnot.astro` representation without downloading `/models/cinturon-itf.glb` or importing Three.js. The desktop viewer remains gated by viewport, WebGL capability, and reduced-motion preference.
- Current branch: `feat/mobile-adaptation`. The existing branch diff against `master` is already far above 400 authored lines; default delivery strategy is `ask-on-risk`, with `stacked-to-main` selected before the first work-unit commit.

## TDD and verification
- TDD: enabled by explicit user choice for this feature.
- Test runner: `bun test`.
- Required functional checks: `bun test`, `bun run check`, and `bun run build`.
- Visual/runtime checks: desktop at 1440px and mobile at 375/390px across es/en/pt; verify sticky boundaries, belt state changes, no horizontal overflow, no console errors, no layout shift, static mobile belt visibility, and no mobile Three.js/GLB network request. Record unavailable device/browser checks honestly.
- Receipt-driven development: global mode currently reports off; ordinary checks apply, with no review lifecycle started.

## Work-unit plan
- [x] BLR-1 — Build the desktop belt-led page shell: left navigation rail based only on existing belt stages, current content in the main column, and the existing 3D viewer in a sticky right column. Preserve section order and copy. Route: delegated writer (mapping spans 4+ files; implementation changes multiple non-trivial files). Acceptance: 1024px+ layout is structurally coherent, sticky content respects the fixed header and ends with the page content, existing content remains reachable, and the viewer is no longer a floating overlay. Runtime screenshots remain pending in BLR-4.
- [x] BLR-2 — Synchronize belt navigation and 3D state: scroll/anchor navigation tracks existing stages; entering the black-belt scene updates the viewer and active rail state. Route: delegated writer (multiple non-trivial component/test files). Acceptance: all existing belt stages and black transition are represented without inventing ranks; keyboard navigation and focus remain usable; localized copy is unchanged. Runtime screenshots remain pending in BLR-4.
- [x] BLR-3 — Add the mobile static belt treatment: reuse `BeltKnot.astro` as a compact active-color vector, retain the current mobile-first reading/contact flow, and ensure the viewer's Three.js imports and GLB fetch never run below the desktop breakpoint. Route: delegated writer (layout and regression test changes). Acceptance: static belt is present and changes tint from existing belt state; mobile has no WebGL initialization or GLB network request; runtime fit remains pending in BLR-4.
- [ ] BLR-4 — Finish bounded verification and record evidence: run the required checks, test all three locales at desktop/mobile, fix observed defects in-scope, and record evidence. Route: inline structural readback plus bounded check workers as needed. Acceptance: checks and visual findings are recorded; source strings are unchanged; task evidence and mirror match.

## Workload and delivery
- Initial authored-change forecast: approximately 500–700 lines (additions plus deletions, excluding generated assets), to be revised after BLR-1 mapping. This is a planning estimate, not a code-size cap.
- Delivery strategy: `ask-on-risk` (default). Chain strategy: `stacked-to-main` (selected by the user); future PR slices merge into `main` sequentially. This does not authorize push, PR creation, or merge; delivery remains user-owned.
- Commit each completed work unit with tests/docs alongside its behavior and record its commit identity below.

## Progress and evidence
- Branch: `feat/mobile-adaptation`.
- Current base: `master` at `5b9d875`; working tree was clean at feature start.
- Existing branch diff against master: 46 files, 2,708 insertions, 3,176 deletions (5,884 authored changed lines; binary files excluded).
- Prototype context was inspected in the parent session. The delegated mapper could not access the gitignored prototype path; use the parent-held analysis and do not treat that transport limitation as a repository change.
- Candidate diff was accepted by the user and completed by the delegated writer: `Belt3D.astro`, `HomePage.astro`, `MartialExperienceTimeline.astro`, `tests/final-sections.test.ts`; 246 additions/177 deletions (423 changed lines). The origin of the initial candidate remains unconfirmed; corrective changes were delegated.
- TDD evidence: BLR-1's sticky-viewer regression went RED (5 pass/1 fail) then GREEN (6 pass/0 fail); the heading-order regression went RED (6 pass/1 fail) then GREEN (7 pass/0 fail).
- Verification: parent `bun test` spot-check 7 pass/0 fail (71 assertions); `bun run check` 0 errors/warnings/hints; `bun run build` successful (3 routes, existing >500 kB chunk warning); `git diff --check` clean. Checks were run sequentially after the earlier concurrent `check`/`build` attempt hit Vite-cache EPERM.
- Risk/independent check: native assessment with the declared untracked ODD doc excluded reported medium, 4 paths/423 lines, `review_due: true` / `slice_budget_reached`; global RDD is off, so no review transaction was started. Independent source validator found no blocker and noted coverage is source-level rather than rendered-route proof.
- Copy/render: no locale/data files changed; the three existing belt-caption translations were moved intact. Built es/en/pt output passed static checks for shell, caption, rail anchors, black-belt target, and one h1. Browser screenshots, runtime sticky behavior, and mobile network observation remain pending in BLR-4.
- [x] BLR-1 evidence / commit: checks above; commit `d11b047`.
- [x] BLR-2 evidence / commit: stage rail updates on enter/enter-back; black metadata is data-backed; threshold crossing/reversal updates monitor and rail once. RED for missing rail identity (7 pass/1 fail), GREEN (8 pass), then black metadata regression added against existing bindings. Parent `bun test`: 9 pass/0 fail (98 assertions); writer ran `bun run check` with 0 errors/warnings/hints and `bun run build` successfully (3 routes, >500 kB warning); `git diff --check` clean. Native assess: medium, 5 paths/163 lines, `under_budget`; global RDD off. Commit `188f51d`.
- [x] BLR-3 evidence / commit: static `BeltKnot` SVG in the mobile grade pill inherits the active belt color; swatch hides at <=1023px and header is non-wrapping. TDD RED then GREEN; parent `bun test` 11 pass/0 fail (123 assertions); writer ran `bun run check` (0 errors/warnings/hints), `bun run build` (3 routes, >500 kB warning), and `rtk git diff --check` clean. Native assess: medium, 3 paths/84 lines, `under_budget`; global RDD off. Built es/en/pt HTML contains the aria-hidden SVG and no GLB preload. Browser width/overflow and mobile network request remain unverified. Commit identity pending.
- [ ] BLR-4 evidence:

## Next step
BLR-3 implementation and source-level checks are complete; commit this work unit with the task-document progress, record the commit identity, then proceed to BLR-4. Capture desktop/mobile browser evidence and verify mobile network behavior if a browser harness is available. Keep the user-selected `stacked-to-main` strategy recorded for future delivery planning.
