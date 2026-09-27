# Feature: css-first-motion

**Objective:** Add scroll-reveal motion and cross-document page transitions using CSS-first primitives, with no animation library dependency.

**Problem:** `docs/ANALISIS_STACK_TECNOLOGICO.md` closes with an open decision: "Animaciones / efectos interactivos: tipo y biblioteca (GSAP, Motion One, CSS puro, etc.) pendiente de definición". The site currently has zero entry motion, which reads as flat/unfinished next to peer portfolios.

**Why CSS-first (decision evidence):** Web research (2026-09-27) confirmed the canonical award-winning Astro portfolio stack is GSAP + SplitText/Flip/ScrollTrigger + Lenis + Three.js + Swup (~150-250KB JS). That stack conflicts with this project's core constraint — TTFB/FCP < 300ms on 4G mobile via QR access — and with the owner's positioning (process optimization, zero friction). Lenis specifically exists to frame-sync DOM with WebGL render loops; with no WebGL, it is dead weight. Verdict: CSS-first, ~1KB of own JS, one optional GSAP island later only if a single hero moment justifies it.

**TDD:** off (no test runner configured). Checks: `npm run build`, `npm run check`.
**Route:** delegated direct (writer trigger: 2+ non-trivial files).
**Delivery strategy:** single-pr (forecast well under 400 authored changed lines).

## Tasks

- [x] T1 Add motion primitives to `src/styles/global.css`: `@keyframes` for fade-up/fade-in, `[data-reveal]` initial + `.is-revealed` end states, staggering via `--reveal-delay` custom property, tokens for duration/easing, and a `@media (prefers-reduced-motion: reduce)` guard that disables all of it (including the existing `scroll-behavior: smooth`).
- [x] T2 Add native cross-document view transitions via the `@view-transition { navigation: auto; }` CSS at-rule in `global.css`. Zero JS, zero Astro `<ClientRouter />`; unsupported browsers ignore the rule. Covers es -> /en -> /pt locale switching.
- [x] T3 Add the `IntersectionObserver` reveal script to `src/layouts/Layout.astro` (target: under ~1KB, no dependencies). Must add `.is-revealed` once, unobserve after firing, and no-op safely when `prefers-reduced-motion: reduce` or when `IntersectionObserver` is unavailable.
- [x] T4 Apply `data-reveal` (with stagger indices where a list/grid benefits) to the section components: `HomePage.astro` hero, `ProjectsSection.astro`, `ExperienceTimeline.astro`, `SkillsPhilosophySection.astro`, `ContactSection.astro`. Content must remain visible with JS disabled — reveal is progressive enhancement, never a visibility gate.
- [x] T5 Close the open decision in `docs/ANALISIS_STACK_TECNOLOGICO.md` (replace the "Pendiente de Decisión" section with the resolved choice and its rationale); align `AGENTS.md` if it references animation strategy.

## Authorized scope

`src/styles/global.css`, `src/layouts/Layout.astro`, the five section components listed in T4, `docs/ANALISIS_STACK_TECNOLOGICO.md`, `AGENTS.md`, and this task file. No new runtime dependencies.

## Acceptance

- `npm run build` and `npm run check` both pass.
- Zero new entries in `package.json` dependencies.
- All page content is present and visible in built HTML without JS (reveal is enhancement only).
- `prefers-reduced-motion: reduce` disables reveals, stagger, and smooth scroll.
- Added JS stays roughly at or under 1KB before minification.

## Progress

**T1** — Added `--reveal-duration` (0.5s), `--reveal-easing` (matches existing
`--transition` curve), `--reveal-distance` (12px), `--reveal-stagger-step`
(60ms) tokens to `:root` in `src/styles/global.css`. Added `reveal-fade-up`
and `reveal-fade-in` `@keyframes`, `[data-reveal]`/`.is-revealed` states gated
behind `html.js-reveal`, and a `prefers-reduced-motion: reduce` block that
disables reveal animation, resets `scroll-behavior` to `auto`, and disables
the view transition.

**T2** — Added `@view-transition { navigation: auto; }` plus a short,
guarded `::view-transition-old(root)/::view-transition-new(root)` cross-fade
using the same duration/easing tokens, in `global.css`. No Astro
`<ClientRouter />`.

**T3** — Two scripts in `src/layouts/Layout.astro`: (1) an `is:inline` head
script that adds `html.js-reveal` only when `prefers-reduced-motion` is not
`reduce` and `IntersectionObserver` exists — this runs before body paint, so
the CSS hidden state (`html.js-reveal [data-reveal]`) never causes a no-JS
flash: without this class, `[data-reveal]` elements have no special CSS rule
and stay at normal opacity/position. (2) a body-level script (module-less,
plain) that observes `[data-reveal]` elements, adds `.is-revealed` and
unobserves each element once, only if `js-reveal` is set. Placed as a plain
head `is:inline` + body script rather than deferring everything to the body,
specifically to avoid the flash-of-hidden-content the feature doc warned
about — the class-setting must happen before first paint, which only a head
script (before body render) or a `blocking` strategy can guarantee reliably
pre-paint; splitting head (gate) / body (behavior) kept each script minimal
and readable rather than cramming both concerns into one `is:inline` block.

**T4** — Added `data-reveal` to: hero content + hero media (2-step stagger)
in `HomePage.astro`; section header, each bento card (stagger by index), and
the automations box in `ProjectsSection.astro`; section header and each
timeline item (stagger by index) in `ExperienceTimeline.astro`; section
header, each skill card (stagger by index), and the philosophy wrapper in
`SkillsPhilosophySection.astro`; the contact card and each channel link
(stagger by index) in `ContactSection.astro`. No attribute is used as a
visibility gate on its own — visibility only changes under `html.js-reveal`.

**T5** — Replaced the "Pendiente de Decisión" section in
`docs/ANALISIS_STACK_TECNOLOGICO.md` with a resolved "Decisión: Animaciones /
Efectos Interactivos" section restating the CSS-first rationale and summarizing
the implementation. `AGENTS.md` was checked (`rg -in "anima|gsap|motion|lenis"`)
and contains no animation-strategy references, so no changes were needed there.

### Verification evidence (observed)

- `npm run build` → completed successfully, 3 pages built (`/`, `/en`, `/pt`), no errors.
- `npm run check` → `Result (16 files): 0 errors, 0 warnings, 0 hints`.
- `package.json` dependencies unchanged: `astro`, `lucide-astro`, `qrcode` only (no git repo initialized in this checkout, so `git diff --stat` was not usable; verified by direct inspection instead — file was never touched).
- `dist/index.html` contains section text as static HTML (e.g. "Sistemas en Producción", "Trinchera Operativa" both present via `grep`), and 27 occurrences of `data-reveal` in the built markup — confirms content and attributes ship in HTML, not JS-injected.
- Reduced-motion coverage: one `@media (prefers-reduced-motion: reduce)` block in `global.css` sets `html { scroll-behavior: auto }`, `@view-transition { navigation: none }`, and neutralizes `html.js-reveal [data-reveal]` (opacity 1, no transform, no animation) — covers reveals, stagger (stagger only exists via animation-delay, which is removed), and smooth scroll in one place.
- Added JS size: two inline scripts in `Layout.astro`, measured pre-minification via a Node script counting the exact script-tag contents — 179 bytes (head gate) + 542 bytes (body observer) = **721 bytes total**, under the ~1KB target.

### T6 (orchestrator review fix) — above-the-fold reveal decoupled from JS

**Defect found during parent spot check:** the hero (`.hero-content`, `.hero-media`)
used the scroll-driven `data-reveal` path. The head gate adds `html.js-reveal`
synchronously, but the observer lives in a deferred module script. If that script
ever fails to run (CSP, a JS error, a browser quirk), the hero would stay at
`opacity: 0` permanently — the first thing a QR visitor sees would be a blank page.
Scroll-revealing content that is already on screen at load is also the wrong
behavior on its own terms.

**Fix:** added a `data-reveal="load"` variant in `src/styles/global.css` that runs
the reveal as a pure CSS animation on load (`forwards` fill, stagger still honored
via `--reveal-delay`), with no JS involvement at all. The observer in
`src/layouts/Layout.astro` now selects
`[data-reveal]:not([data-reveal="load"])` so load-driven elements are never
double-animated. `src/components/HomePage.astro` hero blocks switched to
`data-reveal="load"`. The existing `prefers-reduced-motion` block already matches
the variant (attribute-presence selector, later in the cascade) and still
neutralizes it.

**Verified in a real browser** (dev server, Claude browser pane):
- `npm run build` → 3 pages, `Complete!`, no errors.
- `npm run check` → `0 errors, 0 warnings, 0 hints`.
- 25 `[data-reveal]` elements in the DOM, 2 of them the `load` variant.
- Browser reports `prefers-reduced-motion: reduce`; the head gate correctly
  withheld `js-reveal` and `stuckInvisible` was **0** — the no-motion fallback
  leaves every element fully visible.
- Catastrophic-path simulation (gate forced on, observer never run):
  hero computed opacity = **1**. Before this fix that path left the hero at 0.

**Not verified (tooling limit, disclosed):** the animation playing visually. The
browser pane forces reduced motion at the engine level, so `animationstart` never
fires there and computed durations read `0s`. Motion tokens were confirmed
correct by readback: duration `0.5s`, easing `cubic-bezier(0.16, 1, 0.3, 1)`
(same curve as the existing `--transition`), distance `12px`, stagger `60ms`.
Both `@keyframes` (`reveal-fade-up`, `reveal-fade-in`) are present in the CSSOM.
Worth a human look on a normal machine.

### T7 (user-reported) — QR rendered inverted in dark mode

**Reported:** "el generador de QR estatico se ve mal en modo oscuro".

**Root cause (functional, not cosmetic):** the build-time SVG post-processing in
`HomePage.astro` mapped the generator's `fill="#ffffff"` to `var(--bg-surface)`
and `stroke="#000000"` to `var(--text-main)`. Those two tokens swap polarity
between themes, so in dark mode the code rendered as light modules on a dark
field. Measured in-browser: background `#1d2127` (luminance 0.015), modules
`#edf2f7` (luminance 0.882) — an inverted code. Reading inverted QR codes is an
optional scanner capability, not a guaranteed one; many native phone cameras
fail on them. Since QR access is this site's primary entry point, dark mode was
plausibly shipping an unscannable code.

**Fix:** introduced dedicated `--qr-bg` / `--qr-fg` tokens in `global.css` that
never invert. Light: `#ffffff` on `#12161c`. Dark: `#f2f4f7` on `#12161c` — the
background softens slightly so a 220px panel does not glare against the EyeCare
dark theme, while polarity is preserved. `.qr-image` now uses `--qr-bg` and gains
`0.5rem` padding, widening the quiet zone the generator only renders one module
wide.

**Verified in-browser, both themes:**
- light: `#ffffff` / `#12161c`, contrast **18.1:1**, dark-on-light
- dark: `#f2f4f7` / `#12161c`, contrast **16.5:1**, dark-on-light
- `npm run build` 3 pages OK, `npm run check` 0 errors.

### T8 (found while verifying T7) — QR modal not centered

The `<dialog>` rendered pinned to the top-left in both themes. Cause: the global
reset `*, *::before, *::after { margin: 0 }` in `global.css` strips the
`margin: auto` the user-agent stylesheet gives a modal `<dialog>`, which is the
mechanism that centers it. `showModal()` was being called correctly.

**Fix:** `margin: auto` restored on `.qr-dialog`.

**Verified:** dialog center X = 633, layout viewport center X = 633, offset **0px**
(measured against `document.documentElement.clientWidth`; an earlier 8px reading
was `innerWidth` counting the 15px scrollbar, not a real offset).
