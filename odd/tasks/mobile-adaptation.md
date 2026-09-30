# Mobile adaptation (375px) from belt wireframe, no 3D

Plan: C:\Users\juanr\.claude\plans\s-sac-las-capturas-calm-sparrow.md
Branch: `feat/mobile-adaptation` (from master 5b9d875). TDD: off. Checks: `bun test`, `bunx astro check`, `bun run build`, Playwright 375x812 + 1440.
Baseline (375px): page 30,323px; trayectoria 8,055; proyectos 12,302; stack 3,548; header wraps to 2 lines; project ACTIVE badge overlaps title.

## Tasks
- [x] M1 Header one line on mobile + belt-tinted 3px progress bar. Route: delegated writer.
- [x] M2 Compact hero on mobile (photo + CTAs in first viewport). Route: delegated writer.
- [x] M3 Trajectory as log accordion on mobile (`<details>`, 1-column competency). Route: delegated writer.
- [x] M4 Projects compact on mobile (fix badge overlap, technical detail in `<details>`) + dan bars counter. Route: delegated writer.
- [x] M5 Manifesto compact on mobile. Route: delegated writer (2+ non-trivial files).
- [x] M6 Stack/Skills scannable by family on mobile, detail in `<details>`. Route: delegated writer.
- [x] M7 Contact as obvious destination on mobile: >=44px thumb-reach actions, safe-area, persistent contact shortcut. Route: delegated writer.

## Acceptance
- Desktop unchanged; no horizontal overflow; header height <= 72px at 375; page < ~15k px at 375.
- es/en/pt for new strings; no em-dashes; reduced motion honored.

## Progress
- Implemented by delegated writer (route: delegated), not committed. Files: Layout.astro, HomePage.astro, MartialExperienceTimeline.astro, ProjectsSection.astro, new src/scripts/responsiveDetails.ts.
- Verified: bun test 5 pass; astro check 0 errors; bun run build OK.
- 375x812 (es): header 60px one line; hero photo (96px wide) + both CTAs end at y=410 (first viewport); scrollWidth 375 (no overflow); total 16,987px (baseline 30,323); trayectoria 2,804 (8,055); proyectos 5,740 (12,302); stack 3,548 (unchanged); hero 474. /en/ total 17,544 -> after black-scene fix similar, no overflow. Position and project <details> collapsed on load and open on tap.
- 1440x900: sections identical to baseline except proyectos +14px (dan band); position row geometry identical; dan bars light per project (1000 -> 1110 while scrolling).
- Pending vs acceptance: total 16,987px is above the ~15k target (manifiesto 1,624 and stack 3,548 are out of M1-M4 scope; hiding friction/solution panes on mobile would save ~1.5-2k).
- Note: Layout already had a pre-existing window scroll listener for the progress bar; left untouched. Progress bar tint already came from the timeline (belt line color).

- M1-M4 committed: 520d272.

- M5-M7 implemented by delegated writer, not committed. Files: ManifestoScrollytelling.astro (no pinning <=767px, reduced-motion honored at all widths, double-init guard), SkillsPhilosophySection.astro (human description in `<details>` via responsiveDetails, skills as chip rows per family), ContactSection.astro (44px+ actions, safe-area bottom padding, mobile fixed shortcut to #contacto shown after 0.8 viewport of scroll and hidden while contact is in view), Layout.astro (viewport-fit=cover), i18n/ui.ts (contact.shortcut, skills.readMore es/en/pt).
- Verified: bun test 5 pass; astro check 0 errors; bun run build OK.
- 375x812 es: total 14,921px (was 16,987); manifiesto 501 (1,624); stack 2,691 (3,548); contacto 1,219; scrollWidth 375. en: total 14,580, manifiesto 451, stack 2,606, contacto 1,192, scrollWidth 375. Shortcut 44px tall: hidden at top, visible mid-page, hidden at #contacto. Actions 56px / rows 86px.
- 1440x900: manifiesto 2,340, stack 2,782, contacto 1,451 (en 1,419), totals 28,668 / 28,343: identical to pre-change master build. Details open, shortcut display none.
- Pending: pt not measured; landscape notch side safe-area not handled (viewport-fit=cover added); only 2 philosophy items exist so 2 details.
- M5-M7 committed: d1e6b08. Parent re-ran bun test (5 pass) and astro check (0 errors).

## Polish
- [x] P1 Final polish pass (refinement only, not committed). Route: delegated writer. Verified: bun test 5 pass; astro check 0 errors/0 warnings/0 hints; bun run build OK; Playwright confirm round (es 375/1440 light+dark, en/pt 375) clean.
- Findings (evidence round, 375x812 + 1440x900): no horizontal overflow, no console errors (only WebGL GPU-stall perf warnings at 1440), no CLS drift while scrolling, focus-visible present on every tabbed element, reduced motion leaves all 22 reveals visible, details closed at 375 / open at 1440, contact shortcut hidden at top and at #contacto and visible mid-page (es/en/pt). Defects: touch targets under 44px (lang links 23x23, header CV 40x37, brand 44x37, project live links 102x23, NodoSur link 335x21); text-dim #7a746a 4.0:1 on paper (below 4.5); cyan text 4.1:1 on white in the architecture diagram; circuit-node text 3.45:1; dark text-dim 3.64:1 on elevated surface; 3 em-dashes in contact subtitles; unused lucide imports; two side-border stripes; width transition on dan-progress bars.
- Fixes: (1) belt stripe: `.stage-symbolism` now leads with a 28x6 belt-colour band, mobile `.position-row` uses a 44x3 belt tab on its top edge (::before), no more `border-left`. (2) `.prog-bar` animates `transform: scaleX` (origin left) instead of `width`; JS sets `transform`; measured 0.31 / 1 / 0.43 scale at 10/40/80% with the same fills as before. (3) Mobile touch targets: header brand/lang/CV min-height 44 (lang 32x44, CV 44x44), project live link and NodoSur link min-height 44, active language underline moved to text-decoration. (4) Contrast: `--text-dim` #6a645a (5.06:1 on paper, 4.58 on elevated) with the 9 hard-coded copies aligned, `--accent-cyan` light #0369a1 (5.9:1 on white), circuit-node #8a8275, dark `--text-dim` #8492a6; DESIGN.md synced. (5) Contact subtitles: em-dash replaced by a colon in es/en/pt. (6) Removed 5 unused lucide imports in ArchitectureDiagram.
- Numbers: 375px total 15,003 (was 14,921; +82 from the 44px targets); 1440 total 28,668 (unchanged, desktop heights identical).
- Intentional exception: belt colour is a binding brand metaphor, so the chapter tint stays as a horizontal stripe/tab (not a side border); the white belt keeps a 1px ink ring so it stays visible.
- Left / not fixed: dark theme is not reachable (no toggle in the UI, only localStorage `theme=dark`) and components hard-code the light palette, so dark renders as light sections; DESIGN.md section 6 describes a toggle that does not exist (needs a decision, not polish). Pre-existing em-dashes in date ranges and certification/education data (typographic ranges, not changed). Lang links are 32px wide (44 tall) to keep the header on one line.
- Untested: real devices, Safari/iOS (safe-area, viewport-fit=cover, `<details>` behavior), landscape notch, screen-reader pass, Firefox.
