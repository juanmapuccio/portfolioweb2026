# Wireframe cinturones: principios TKD, recorrido, hero e iconografía

Source plan: Claude Design project "Portfolio con cinturones de progresión" (wireframe 1d, 1e, 1f, 1k, 1n, 1o).
TDD: off (no project TDD config). Runner: `bun test`. Checks: `bun test`, `astro check`, `bun run build`.
Branch: `Asentamiento-web`. Delivery: ask-on-risk.

## Scope
- Out of scope: gup tips, 3D belt, glyph iconography (1l).

## Tasks
- [x] T1 Hero redesign (1e + 1f): editorial hero, 4:5 photo, CSS belt crossing photo + SVG knot (`BeltKnot.astro`), scrub color on scroll, reduced motion static, cleanup of legacy hero CSS. Route: delegated writer.
- [x] T2 Knot monogram (1o): header brand + `public/favicon.svg`. Route: delegated writer.
- [x] T3 Recorrido as color chapters (1d + light 1k): ITF symbolism title per belt + subtle tint, no new content blocks. Route: delegated writer.
- [x] T4 TKD principles (1n): `src/data/principles.ts`, 5 hangul seals in the human block of `SkillsPhilosophySection`, ES/EN/PT. Route: delegated writer.
- T1 hero belt/knot reverted at user request (HomePage.astro restored from HEAD). Red belt symbolism changed to "Cautela y control".
- [x] T5 3D belt (Belt3D.astro), desktop only (>=1024px, WebGL, no reduced motion), visible ONLY inside #trayectoria (fade/scale in-out via ScrollTrigger, left side, 0.5 scale), color follows active belt via CustomEvent belt:change and turns black in the black-belt scene, drag Y with return, lazy dynamic import of three. Not in hero/projects/contact. Route: delegated writer.

## Acceptance
- One theme per page; radius 0; no em-dashes; motion honors `prefers-reduced-motion`.
- Hero fits the initial viewport with at most 4 text elements.
- All checks pass.

## Progress
- Delegated writer, 2026-09-29: T1-T4 implemented in order, not committed.
- T1: HomePage.astro hero rewritten (belt as CSS grid row, opacity scrub tint, reduced-motion static), BeltKnot.astro added, dead CSS removed.
- T2: knot monogram in Layout.astro header brand, public/favicon.svg rewritten, Noto Sans KR added to fonts link.
- T3: `symbolism` es/en/pt in BELTS, shown under each chapter title with a color-mix 7% tint (MartialExperienceTimeline.astro).
- T4: src/data/principles.ts + 5 hangul seals at top of the human block (SkillsPhilosophySection.astro).
- Evidence: `bun test`: 5 pass, 0 fail. `bunx astro check`: 0 errors, 0 warnings, 5 hints (unused imports in ArchitectureDiagram.astro, pre-existing, untouched). `bun run build`: 3 pages built, Complete.
- Not verified: visual check in browser (dev server not run by writer).
- Next: manual check with `bun run dev` (desktop/mobile, es/en/pt, light/dark, reduced motion).

- T5 (delegated writer, not committed): added three + @types/three, src/components/Belt3D.astro (mounted in HomePage.astro), timeline dispatches belt:change and sets documentElement.dataset.activeBeltColor. Reference belt3d.js was truncated (only three.js bundle present), so geometry is original (ellipse loop, crossed-box knot, 2 swept tails). Color change: 0.6s lerp + 360deg spin (not 180, avoids knot ending at the back).
- T5 evidence: bun test 5 pass; astro check 0 errors, 5 hints; build Complete. three chunk 736589 B raw / 184591 B gzip (lazy, only loaded on desktop+WebGL+motion ok); Belt3D script 7169 B / 3356 B gzip.
- T5 not verified: visual in browser (position/overlap with stage text on the left, lighting on both themes, drag feel).

## T6 evidence - GLB belt model
- Belt3D.astro now loads `public/models/cinturon-itf.glb` (GLTFLoader, lazy, desktop-only). The ORIGINAL uncompressed model is used as-is at the user's request (no compression/optimization/texture resize).
- Only `belt_cloth` is tinted (color + sheenColor); `belt_stitch` untouched. RoomEnvironment + PMREM env at intensity 0.4, ACES tone mapping exposure 0.9 (matte cotton look).
- 3D belt left edge aligns to `#monitor-strap` left edge (ResizeObserver + ScrollTrigger refresh); verified at 1440 (x=72) and 1280 (x=64).
- Checks: bun test 5 pass; astro check 0 errors; build ok.

## i18n (ES / EN / PT) - evidence

Plan: C:\Users\juanr\.claude\plans\de-ese-wireframe-que-stateful-flame.md (steps 1-5). Not committed.

- [x] 1. `beltName` is `Record<Lang,string>`; timeline badge, tooltip, `data-belt-name`, initial h3 and "Negro" label localized.
- [x] 2. ProjectsSection: PT branch for UPTIME / CORE LATENCY / INFRA; aria-label localized ("Ver X ao vivo" in PT).
- [x] 3. Layout: canonical, hreflang es/en/pt/x-default, og:locale, og:url. `site` already set in astro.config (https://juanpuccio.vercel.app), no placeholder used.
- [x] 4. Language switcher: role=group + aria-label, aria-current="page", hreflang/lang per link, hash preserved on click.
- [x] 5. skills.ts "faturamento"; hero "Scroll" cue localized (Desplazá / Scroll / Role).

Checks:
- `bun test`: 5 pass, 0 fail
- `bunx astro check`: 0 errors, 0 warnings
- `bun run build`: 3 pages built
- dist grep (en/pt): "Cinturón" 0 (an HTML comment was translated), ">Negro<" 0, " de la " 0, "UPTIME" pt 0 (en 1, legit English), "Ver " en 0 / pt 1 line (legit "Ver X ao vivo" aria-label in Portuguese).
- Playwright (/en/, /pt/): monitor names White/Yellow/Green/Blue/Red belt (EN), Faixa branca/vermelha (PT); black label Black/Preta; aria-current on the active link only; clicking EN at #contacto goes to /en#contacto.
