# mobile-ink-phase2

## Objective
Phase 2 of integrating the `design/MockupMobile.dc.html` ink language into the mobile immersive tree (`src/components/MobileImmersive.astro`): hero entrance + dry-brush stroke + 염치 seal, and a fixed "Contactar" CTA.

## Problem / why
Mobile hero only has scroll-linked exit motion and no entrance. Mobile has no persistent path to contact (header shortcut is `display:none` at ≤768px). The prototype defines both; user chose to KEEP the current hero (name "Juan / Manuel / Puccio" + portrait) and layer the ink effects on top (decision recorded 2026-10-03, option 1).

## Scope
In:
- Tokens `--seal-red:#b91c1c`, `--ok-green:#047857`, `--paper:#f4efe4` in `src/styles/global.css` ONLY if used by this phase (use `--seal-red` for the seal; add the others only if consumed).
- Hero: line-by-line reveal of the name lines (translateY 110%→0 in overflow:hidden wrapper, 0.8s, 0.12s stagger, ease cubic-bezier(.16,1,.3,1)); vertical dry-brush stroke drawn with SVG `stroke-dashoffset` (pathLength=1, 1.3s, same ease), NO per-frame SVG filter; 염치 seal (stamp scale 1.6→1, 0.9s) reusing the look of `.principle-seal-box` and the hangul from `src/data/principles.ts`.
- Fixed CTA bottom-right (48px tall, ink bg, paper text, mono 11px, label from `ui.ts` `contact.shortcut` + "→"), shown from the hero, hidden when the contact scene is reached; click goes to `#contacto` (existing global handler resolves it to `m-contacto`).
Out: loader, drip, smoke sprite, copy changes, desktop tree, Belt3D.

## Constraints (from tests/final-sections.test.ts L1075-1260 and journey.ts)
- MobileImmersive must NOT contain: `blur(`, `--mx`, `data-nested-scroll`, `ScrollTrigger.create`, `registerPlugin`, `new Lenis`, `requestAnimationFrame`, `addEventListener`, `-100vh`, `.scene-x { height: Nvh;`, ids without `m-` prefix. Six `data-scene` exact and in order; `.layer` rule must not contain `will-change`; use `svh` only.
- No new listeners/rAF. CTA visibility via `toggleAttribute` in `journey.ts` `writeScene`/`syncSceneBelt` area + CSS, or CSS on `--p` only.
- Reduced motion (block ≈ MobileImmersive 724-768): `.scene *` already gets `transform:none; opacity:1 !important`, but NOT pseudo-elements nor `stroke-dashoffset`; the new path/seal must set `animation:none` and `stroke-dashoffset:0`. CTA must live outside `.scene` and carry its own reduced-motion rule.
- Copy from data modules/ui.ts, never hardcoded (except strings the file already inlines per language).
- Min 44px touch target; CTA is 48px.
- Animate only transform, opacity, stroke-dashoffset, clip-path.

## Route
Delegated direct: one bounded writer (MobileImmersive.astro + journey.ts + global.css + tests = 2+ non-trivial files). Parent verifies with the checks below.
TDD: not configured (source: `odd/tasks/mobile-immersive-portfolio.md`). Ordinary functional checks.
Runner: `bun test`, `bunx astro check`, `bun run build`.
Known pre-existing failure: `dark tail polish D2 … skills reveals assemble categories…` (tests/final-sections.test.ts ≈ L1015) fails on baseline; not part of this task.

## Tasks
- [x] T1 Hero entrance (line reveal) + seal + brush stroke, with reduced-motion rules
- [x] T2 Fixed CTA + visibility hook + reduced-motion rule
- [x] T3 Tests for the new contract; `bun test`, `astro check`, `build`

## Acceptance criteria
- Hero keeps name + portrait + copy unchanged; entrance plays once on load; seal and stroke visible; nothing hidden under reduced motion.
- CTA visible on hero/manifesto/projects/belts/stack, hidden on contact, navigates to contact via the existing `#contacto` handler.
- All checks green except the known pre-existing failure.

## Progress / evidence
Route: delegated writer (files: MobileImmersive.astro, journey.ts, global.css, tests/final-sections.test.ts).
Checks: `bun test` 89 pass / 1 fail (only the known pre-existing D2 skills-reveals test); `bunx astro check` 0 errors, 0 warnings, 3 hints; `bun run build` OK (3 pages).
Deviations: brush uses stroke-opacity 0.1 (faint wash behind copy, survives the reduced-motion `.scene *` opacity reset); under reduced motion journey.ts writes no scene state, so the CTA stays visible. Not verified in a browser (visuals/timing unchecked).
Engram mirror `odd/mobile-ink-phase2/tasks`: pending.
Commit: none yet.

## Next step
Run the writer for T1-T3, then verify.
