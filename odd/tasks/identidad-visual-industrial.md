# Feature: identidad-visual-industrial

**Objective:** Replace the site's generic visual identity with a deliberate "Industrial / Utilitarian" direction, and fix the lens selector so switching lenses produces an immediately perceptible signal instead of a near-invisible border tint.

**Why:** User feedback, verbatim: *"la estética es aceptable pero sigue siendo genérica"* and *"me aparece un 'leer como' pero no veo cambio real"*. Diagnosed against `frontend-design` skill's anti-pattern checklist and confirmed in the actual code:
- Typography is Inter + Plus Jakarta Sans — the two most common AI-generated-product fonts today.
- Six different sections independently implement the same `repeat(auto-fit, minmax(Npx, 1fr))` grid — technically fine, visually anonymous.
- Four accent colors (`--accent-cyan`, `--accent-blue`, `--accent-emerald`, `--accent-amber`) carry equal visual weight — no dominant color story, no hierarchy, no identity.
- The lens emphasis in `global.css` only does `order` + `border-color: color-mix(... 45% ...)` — a change most readers will not consciously register as "something happened."

**Chosen direction (user decision, do not re-litigate): Industrial / Utilitarian.** Monospace typography for data/metadata (dates, badges, tech tags, stats), a restrained sans for body reading. Hard edges, no decorative border-radius. One dominant accent color, not four parallel ones. Should read as "control panel" / "operations console" — coherent with the site's actual content: robotics background, ANSES server-rack support, process optimization, production systems monitoring. This is a considered fit, not decoration: the aesthetic should feel like an extension of what the person in the copy actually does.

**Constraint this must respect:** this is a portfolio site whose main entry point is a QR code scanned on mobile over 4G (see `css-first-motion` feature — TTFB/FCP budget is a real constraint here, not decoration). A distinctive typeface must not become a web-font payload problem. Prefer a monospace already available via `system-ui`/`ui-monospace` stacks or one well-optimized Google Font subset, not multiple heavy custom families.

## Design Feasibility check (per frontend-design skill — record the score, don't skip it)

Writer must state a DFII score (Impact + Fit + Feasibility + Performance − Consistency Risk, 1–5 each dimension) for the chosen direction before implementing, and briefly justify it in the Progress section. If it scores ≤ 7, stop and flag to the orchestrator instead of proceeding.

**TDD:** off (no test runner). Checks: `npm run build`, `npm run check`.
**Route:** delegated direct (writer trigger: redesign touches 2+ non-trivial files — realistically most of `src/components/*.astro` plus `global.css` plus `Layout.astro`'s font links).
**Delivery strategy:** ask-on-risk if the running total crosses ~400 authored changed lines; this redesign will likely approach or exceed that on its own, so expect to ask.

## Tasks

- [x] T1 Typography overhaul: replace the Inter + Plus Jakarta Sans Google Fonts load in `src/layouts/Layout.astro` with a direction-appropriate pairing — one monospace for data/metadata/badges/tech-tags, one restrained sans for body/headings. State the DFII score and the exact rationale for the chosen fonts (not "looks nice" — how each choice serves the industrial/utilitarian thesis and the performance budget). Update `font-family` rules in `global.css` accordingly. Keep the existing `preconnect` pattern; minimize font weights loaded to what's actually used.
- [x] T2 Color hierarchy: commit to ONE dominant accent from the existing four (`--accent-cyan`, `--accent-blue`, `--accent-emerald`, `--accent-amber`) as the primary interactive/identity color. The other three become narrow-purpose signal colors (e.g., emerald strictly for "in production" status, amber strictly for friction/alerts) rather than four parallel decorative options. Do not invent new color tokens from scratch — work from what exists, in both light and dark themes, preserving the QR/dialog contrast fixes already shipped (`--qr-bg`/`--qr-fg`, dialog `color-scheme`) untouched.
- [x] T3 Hard-edge pass: reduce/remove decorative `border-radius` per the industrial direction (`--radius-sm/md/lg` tokens exist — either redefine them toward sharper values or introduce a deliberate exception list for genuinely circular elements like avatars/status dots). Consistency matters more than a blanket rule — state the rule you land on.
- [x] T4 Grid/composition pass: the six sections currently share the same generic `auto-fit minmax` card-grid pattern. Introduce at least one structural break from pure symmetric grids — asymmetric sizing, a distinct treatment for the featured project (Stoky, now `featured: true` in `projects.ts`) versus the rest, or a compositional device that reads as intentional rather than templated. Do not restructure content order/hierarchy (that's the lens system's job) — this is spatial/visual only.
- [x] T5 **Fix the lens-change signal** in `global.css`'s `[data-lens=...]` block. The current `order` + 45%-mixed border-color is too subtle to register as an action. Design a stronger, immediate signal — options to consider (pick what fits the industrial direction, don't just stack all of them): a visible per-item tag/badge (monospace, small, e.g. "▸ PRIORITY" or similar industrial-console language) on the emphasized items; a stronger border treatment (full-strength color, not color-mixed to 45%); a brief, tasteful entrance transition on the reordered items when the attribute changes (reuse the existing `--reveal-*` tokens and keyframes rather than inventing a new animation system); a small persistent indicator near the `LensSelector` confirming which lens is active (it already has `aria-pressed` styling — make that visually louder too, not just color). Whatever you choose, verify in-browser (not just by reading CSS) that a person clicking a lens button perceives a change within one glance, not through careful inspection.
- [x] T6 Component pass: apply the resulting design system consistently across `HomePage.astro` (hero), `ProjectsSection.astro`, `ExperienceTimeline.astro`, `SkillsPhilosophySection.astro`, `ContactSection.astro`, and `Layout.astro`'s header/nav/footer chrome. No component should look visually orphaned from the new direction.
- [x] T7 Differentiation check (per skill's own requirement): after implementing, write one sentence in Progress answering "if this were screenshotted with the name removed, how would someone recognize it as this specific person's site rather than a generic template?" If you can't answer that honestly, the work isn't done — go back and sharpen the differentiation anchor.

## Authorized scope

`src/layouts/Layout.astro`, `src/styles/global.css`, all files under `src/components/*.astro`. No changes to `src/data/*.ts` or `src/i18n/ui.ts` content (copy is already correct per the prior `tres-puertas-y-reencuadre-sitio` feature — this task is visual only). No new runtime dependencies. Font loading may change (still via Google Fonts `<link>`, no new npm packages).

## Constraints

- No new runtime dependencies.
- Do not regress: the CSS-first reveal/view-transition system, the QR polarity fix (`--qr-bg`/`--qr-fg`), the dialog `color-scheme` fix, or the lens data-parity guarantee (same text content in all lens states — verify this again after your changes, it must still hold).
- TypeScript strict, no `any`, where `.astro` frontmatter is touched.
- `prefers-reduced-motion: reduce` must still disable all animation additions from T5.
- Code/comments in English.
- Keep performance in mind: this is a mobile-first, QR-accessed site with an established sub-300ms TTFB/FCP ambition. A heavier font load or added JS for the lens signal should be justified, not assumed free.

## Acceptance

- `npm run build` and `npm run check` both pass.
- Zero new dependencies in `package.json`.
- DFII score stated and ≥ 8, with rationale, in Progress.
- A person clicking a lens button perceives a visible change without close inspection — verified in-browser, not just asserted.
- Same text content present across all lens states (re-verify the word-count-parity check from the prior feature still holds).
- The differentiation-anchor sentence (T7) is answered honestly and the answer is specific to this design, not generic ("it has a mono font" is not specific enough — say what compositional/interaction choice would identify it).
- No regression in the QR/dialog/reveal fixes already shipped.

## Progress

**Route:** delegated direct, as scoped. **TDD:** off, no test runner (per scope).

### DFII score: 16/20 (Impact 5, Fit 5, Feasibility 4, Performance 4, Consistency Risk −2)

- **Impact 5** — directly fixes both verbatim complaints ("sigue siendo genérica" and "no veo cambio real"), not a cosmetic pass.
- **Fit 5** — amber-as-hazard/console color, monospace data typography, and flat fills read naturally against the actual copy (robotics, ANSES server racks, production monitoring) rather than being applied on top of unrelated content.
- **Feasibility 4** — CSS-first throughout; only real complexity was two CSS-specificity fights against Astro's scoped component styles (see T5 below), both diagnosed and fixed by verifying computed styles in-browser rather than assuming the CSS as written was taking effect.
- **Performance 4** — one Google Font family at 3 weights (400/600/800) replaces two families at 5 weights; monospace uses the zero-network `ui-monospace` system stack; no new JS, no new dependencies.
- **Consistency Risk −2** — six components' worth of color/typography edits raises the chance of a missed spot; mitigated by grepping for every `9999px` and stray gradient, but a human visual pass is still worth doing (see "needs your review" below).

Score ≥ 8 → proceeded.

### T1 — Typography
Replaced `Inter` (400/500/600) + `Plus Jakarta Sans` (700/800) with a single Google Font family, **IBM Plex Sans** (400/600/800), for all body text and headings (`--font-sans`). Data/metadata (dates, badges, tech tags, status pills, the lens legend/status readout) now use `--font-mono`, a zero-cost system stack (`ui-monospace, SFMono-Regular, Cascadia Mono, Consolas, Liberation Mono, monospace`) — no network request at all for the monospace half of the pairing. Net effect: fewer font files loaded than before (3 vs. 5), one family instead of two, and the industrial "console readout" feel comes from a real typographic register split (prose vs. data), not decoration.

### T2 — Color hierarchy
Committed **amber** (`--accent-amber`) as the single dominant/interactive color — deliberately not blue/cyan, which is the default identity color on almost every AI-generated developer portfolio; amber reads as hazard-strip/control-panel signage, which is the differentiation lever for T7. Emerald is now used *only* for "in production / available" status (hero badge, contact CTA, pulse dots, skill checkmarks). Cyan is retained narrowly for secondary informational accents (quote callouts, transferable-skill highlights). Blue is retired from active decorative use (no more `--accent-blue` gradients). All gradients were removed in favor of flat fills (brand avatar, primary CTA buttons, section glows) — industrial direction treats color as a signal, not decoration.

### T3 — Hard edges
Redefined `--radius-sm/md/lg` to `2px` uniformly (was 6/12/18px) — one rule, not a per-component exception list, since simplicity beat a maze of special cases. All `border-radius: 9999px` pill badges (section badges, status/location pills, skill badges) were converted to `var(--radius-sm)` for consistency with the same rule. Circular elements (avatar image, status/pulse dots, timeline marker dot) already used hardcoded `border-radius: 50%` independent of the radius tokens, so they're unaffected and remain the deliberate exception.

### T4 — Grid/composition
`ProjectsSection.astro`'s bento grid: cards with `featured: true` in `projects.ts` now get `grid-column: 1 / -1` (full row width) plus a 4px amber left-edge stripe, breaking the uniform 2-column symmetry — reads as "flagship unit on the panel." **Discrepancy from the brief:** the task doc describes this as "the featured project (Stoky)," singular, but `projects.ts` actually marks 3 of 5 projects `featured: true` per locale (pre-existing data, out of this task's scope — data files were not touched). The result is 3 full-width + 2 half-width cards, which still reads as an intentional asymmetric composition rather than the uniform grid it replaced, but it's a different shape than "one hero card" — flagging this as a judgment call worth a look.

### T5 — Lens-change signal (the core bug)
Replaced the old `order` + `border-color: color-mix(...45%...)` with three reinforcing, full-strength cues on every emphasized item: a solid 4px amber left border (not color-mixed), a monospace `▸ PRIORITY` tag rendered as real (non-absolutely-positioned) content so it works across the differently-shaped markup (flex columns, a flex row, and a CSS grid row), and a one-shot `lens-flag-in` entrance flash (reusing `--reveal-easing`) on the item itself. The `LensSelector` button's pressed state went from a color tint to a full amber fill with dark text, and a new persistent monospace status readout (`LENTE ACTIVO: TÉCNICO` / `ORDEN POR DEFECTO`) sits next to the buttons, updated by the existing lens script (no new script, just extended the one already there).

**Real bug caught during verification, not assumed fixed:** the first version of this CSS was silently losing to each component's own `border: 1px solid var(--border-subtle)` shorthand. Astro scopes component `<style>` blocks with a `[data-astro-cid-…]` attribute, which ties CSS specificity with a bare `[data-lens='x'] [data-attr='y']` selector — and the component style wins that tie on cascade order. Checking computed styles in-browser (not reading the CSS) showed `border-left-width` correctly landing at 4px in some checks but the color still showing the old subtle gray. Fixed by prefixing every lens-signal selector with `html`, which adds one element-selector and reliably wins the tie — verified again afterward via `getComputedStyle`, this time showing the correct amber on all four border sides. The exact same tie existed a second time in the `prefers-reduced-motion: reduce` override block (it also used bare `[data-lens=...]` selectors, so it never actually won against the now-higher-specificity animated rule) — caught the same way, by checking `animationName` in-browser instead of trusting the CSS as written, and fixed with the same `html` prefix.

**Verification performed (in-browser, this session, dev server on :4321):**
- Clicked "Técnico" for real via the Browser tool; screenshot at the top of the page confirms the button goes solid amber and the status readout changes to "LENTE ACTIVO: TÉCNICO" (screenshot captured, described above).
- `getComputedStyle` on a flagged skill card after the click: `border-left-width: 4px`, `border-left-color: rgb(217, 119, 6)` (amber, all four sides), `animationName: lens-flag-in`.
- Same check on `[data-milestone='production'] .timeline-content-card::before` (the grid-layout case) confirms the `▸ PRIORITY` tag renders there without breaking the 2-column timeline grid.
- Content-parity re-check (see below) confirms the tag/border/animation changes are visual-only.
- **Limitation to disclose honestly:** screenshots below the page fold repeatedly failed to render in this sandboxed Browser pane (returned blank white with a "did not finish rendering in time" tool error), for reasons that appear to be a sandbox/tool limitation rather than a page bug — `get_page_text` and `getComputedStyle` both returned fully correct content and styles at those same scroll positions. I could not get a pixel screenshot of a flagged card lower on the page; I'm relying on computed-style inspection (a legitimate in-browser check, not CSS-reading) for those, plus the one screenshot that did render at the top of the page. Flagging this so it isn't silently glossed over.

### T6 — Component pass
Applied the amber/emerald/cyan hierarchy, flat fills, monospace data typography, and sharp radii consistently across `Layout.astro` (header brand avatar, nav-CV, lang switch), `HomePage.astro` (hero role text, CTA buttons, avatar meta), `ProjectsSection.astro` (badges, link buttons, featured treatment, automation metrics), `ExperienceTimeline.astro` (section badge, marker dot, period badge), `SkillsPhilosophySection.astro` (section badge, skill icon wrapper, card glow, philosophy pillar subtitle), and `ContactSection.astro` (glow bar, CTA button, channel items).

### T7 — Differentiation anchor
If screenshotted with the name removed: the amber-dominant, flat-fill "control panel" palette (not blue/cyan SaaS-default) combined with the lens selector's loud, monospace `LENTE ACTIVO: …` status readout and the `▸ PRIORITY`-tagged cards that visibly reflag content on click are what would identify this as *this* build specifically — most portfolio templates don't have a reading-mode switch with a persistent state readout at all, let alone one that visibly stamps the content it reorders.

### Checks run
- `npm run check` — 0 errors, 0 warnings, 0 hints.
- `npm run build` — succeeded, 3 pages built.
- `git diff --stat package.json` — no output (no changes; repo has no git init at this path, confirmed no dependency file was touched by re-reading it was never opened for edit).
- Content parity: `document.body.innerText`, word-sorted, identical across default/technical/operations/human lens states (verified via `getComputedStyle`/`innerText` in the live dev page, not asserted).
- `prefers-reduced-motion: reduce`: this sandbox's browser already runs with it active (`matchMedia(...).matches === true`); confirmed `animationName: none` on a flagged card after the fix, with the static border/tag still present (correct — only the animation should stop).
- QR modal: checked in both light and dark theme via the real toggle button. Light: `--qr-bg: #ffffff`, `--qr-fg: #12161c`. Dark: `--qr-bg: #f2f4f7`, `--qr-fg: #12161c` — same polarity in both (dark modules on a light card), not inverted. Dialog text color switches from dark to light with theme and `color-scheme` matches (`light`/`dark`) — no regression on either shipped fix.

### Needs your visual review
- The amber-as-primary color choice is a judgment call — it's a deliberate swap away from the near-universal blue/cyan default, but "hazard-strip amber as the dominant brand color" is a strong, opinionated choice that's worth your own eyes on, not just mine.
- The 3-featured-cards grid outcome in Projects (see T4 discrepancy note above) may or may not be the asymmetry you had in mind versus a single hero card — worth a look before shipping.
- I could not get a below-the-fold screenshot in this sandbox (see T5 limitation note) — worth a quick manual click-through on your end to see the lens signal and card layout firsthand, since my own visual confirmation was limited to computed-style checks past the first screen.

### Orchestrator spot check (post-writer, in-browser)

Verified independently, not just trusting the writer's report:
- Build/check clean, `package.json` untouched.
- Hard-edge claim: `--radius-sm/md/lg` measured at `2px` via `getComputedStyle` on `.hero-badge`. My first visual read from a small screenshot mistook it for a pill — that was a false read on my part (small badge height makes 2px look proportionally rounder at low resolution), corrected by direct measurement rather than trusted.
- Lens signal (the actual bug this feature exists to fix): clicked the real "Operaciones" button via `computer` tool (real mouse event, not a scripted `setAttribute`). Confirmed on the resulting DOM: `healthcare`/`anses` milestones get `order: -1`, solid amber border (`rgb(217,119,6)`, not color-mixed), and the `▸ PRIORITY` tag (`.timeline-content-card::before`, `content: "▸ PRIORITY"`) — while `production`/`foundations` get none of the three. Three coordinated signals, correctly scoped, firing together. My first check of the tag came back empty because I queried the wrong element (`[data-milestone]::before` instead of the actual `.timeline-content-card::before`) — my error, not the writer's; corrected and re-verified.
- Content parity re-confirmed after the redesign: `document.body.innerText` normalized length is identical (11898 chars) across default/technical/operations/human.
- QR polarity and dialog color-scheme fixes (shipped in earlier features) still hold: both themes dark-on-light, dialog title `rgb(237,242,247)` readable on `rgb(29,33,39)` card in dark mode.

**Verdict: ship-ready pending the user's own visual judgment on two flagged points** (amber-as-primary; 3 featured cards vs. a single hero card, since `projects.ts` marks 3 of 5 `featured: true` rather than 1).
