# Feature: scroll-fluidity

## Objective
Make the work-history journey (white → red → black belt) scroll as one fluid experience: smooth Lenis scrolling, no layout thrash, correct header/belt handoffs, robust sticky panels on mobile.

## Problem / Why
Read-only audit (2026-10-01, Engram `odd/scroll-fluidity/baseline`) found: a perpetual rAF loop with interleaved layout reads/writes, three independent rAF loops, CSS transitions that lag behind scroll-driven `--p`, an early dark header at the red→black handoff, `100vh` sticky panels that clip on mobile, dead mobile CSS selectors, and anchors that jump instead of scrolling.

## Scope
- `src/layouts/Layout.astro` (Lenis setup, header progress)
- `src/components/MartialExperienceTimeline.astro` (scroll engine `tick`, curtain CSS)
- `src/components/ManifestoScrollytelling.astro`, `ProjectsSection.astro`, `ContactSection.astro`, `SkillsPhilosophySection.astro`, `HomePage.astro` (CSS only: units, transitions, overflow)

Out of scope: content, visual design, Belt3D render loop internals.

## Constraints
- No new dependencies. Keep the existing `--p` contract (`data-fx`, `data-zone`, `data-ch`, `data-track`, `belt:change`).
- Respect `prefers-reduced-motion`.
- TDD: off (no test runner in project; source: package.json has no test script). Checks: `npx astro check`, `npm run build`.

## Tasks
- [x] T1 — Single, synced scroll engine (route: delegated writer; trigger: 2 non-trivial files Layout + Timeline)
  - Lenis driven by `gsap.ticker`, `lenis.on('scroll', ScrollTrigger.update)`, `anchors` enabled with header offset.
  - `tick` runs only when scroll/resize happen (not perpetual), caches nodes, reads all rects first then writes, skips unchanged `--p`.
  - Header progress updated once per frame (no double call).
  - Remove `transition: … linear` on `--p`-driven properties (Timeline, Projects, Contact, Manifesto words).
- [x] T2 — Red→black handoff: header/belt switch to `negro` only when the expanding circle actually covers the header (route: inline, 1 file).
- [x] T3 — Mobile robustness (route: inline/mechanical CSS across files)
  - Sticky panels: `100vh` → keep fallback + `100svh`.
  - Fix dead mobile selectors in Timeline (`curtain-meta-bottom/curtain-word/curtain-meaning` → real classes).
  - Manifesto: cap font size by viewport height on short desktops; readable without JS.
  - `data-lenis-prevent` on the nested mobile scroller in Projects.

## Acceptance criteria
- `astro check` 0 errors, `npm run build` passes.
- No perpetual rAF loop from the timeline; one rAF driver for Lenis + GSAP.
- Header stays light until the black circle covers it.
- Mobile curtain editorial block uses its intended mobile sizes.

## Delivery
Strategy: ask-on-risk. Forecast ~200 authored lines (under budget).

## Progress / Evidence
- Pre-work commit `066794b` (contact channels + QR, previously uncommitted) split out so scroll commits stay focused.
- T1 `331bebf` — delegated writer. `astro check` 0 errors, `npm run build` Complete. No self-rescheduling rAF in timeline; no `linear` transitions left on `--p` props. Review assess: medium, `under_budget`; RDD globally off → `disabled/unmanaged`.
- T2 `1e88d84` — inline. Black curtain resolves to `rojo` until circle radius (`clamp((p-0.14)*4)*2000px`) ≥ `hypot(W/2,H/2)`; `belt:change` deduped by belt key. `astro check` 0 errors.
- T3 `369531d` — inline mechanical CSS. `100svh` on sticky panels (Timeline ×4, Projects, Contact, Skills, Manifesto); mobile selectors repointed to `curtain-editorial-block` / `curtain-word-title`; manifesto `min(3.1vw, 5.2vh)`, dims only when armed (readable without JS), `scrub: true`; Lenis `allowNestedScroll`. `astro check` 0 errors, build Complete.
- Not verified: real-browser scroll feel, real-device mobile URL-bar behaviour.

## Known leftovers (out of scope)
- `Belt3D.astro` keeps its own rAF loop reading zone rects and renders while invisible.
- `belt:black-progress` listener in `Belt3D.astro` never receives a dispatch (dead code).
- Desktop curtain keeps ~85vh static tail after content completes (design pacing decision).

## Next step
Manual browser pass (desktop + phone) through white → black; then decide on Belt3D loop gating.
