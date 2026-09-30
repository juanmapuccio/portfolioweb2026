# Mobile adaptation (375px) from belt wireframe, no 3D

Plan: C:\Users\juanr\.claude\plans\s-sac-las-capturas-calm-sparrow.md
Branch: `feat/mobile-adaptation` (from master 5b9d875). TDD: off. Checks: `bun test`, `bunx astro check`, `bun run build`, Playwright 375x812 + 1440.
Baseline (375px): page 30,323px; trayectoria 8,055; proyectos 12,302; stack 3,548; header wraps to 2 lines; project ACTIVE badge overlaps title.

## Tasks
- [x] M1 Header one line on mobile + belt-tinted 3px progress bar. Route: delegated writer.
- [x] M2 Compact hero on mobile (photo + CTAs in first viewport). Route: delegated writer.
- [x] M3 Trajectory as log accordion on mobile (`<details>`, 1-column competency). Route: delegated writer.
- [x] M4 Projects compact on mobile (fix badge overlap, technical detail in `<details>`) + dan bars counter. Route: delegated writer.

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
