# tul-redesign

## Objective
Rebuild the portfolio from scratch as an immersive CV around the "Tul diagram" world. Each belt chapter is told as the floor diagram of its ITF tul: footprints, numbered arrows and a line of movement. Each movement is a CV milestone. Contact is the destination.

## Problem / why
The user asked for an immersive site of his trajectory and CV, redesigned from scratch. The manga/sumi-e world on `feat/ink-redesign` is evidence only, not authority. The ITF belt progression stays as the narrative spine (user decision). The direction was picked by the user on 2026-10-05: impeccable seed `050d9965`, the pick card. The approved plan is at `C:\Users\juanr\.claude\plans\codegraph-engram-context7-gentle-ai-snoopy-squid.md`.

## Decisions (user)
- Redesign from scratch: replace the visual world and keep product truth, content, i18n and data.
- Belts stay the narrative spine (10th gup to 1st dan).
- World: "Tul diagram". The "dojang name board" option was rejected because it is not verified as ITF practice.
- Branching: commit the WIP on `feat/ink-redesign` (`3de8f84`, PNGs excluded), then create `feat/tul-redesign` from it so that `src/data` and `src/i18n` are inherited.
- Build path: code-led, with no generated comps.

## Scope
In: tasks T0 to T8 below.
Out: push, PR and merge, which are user decisions. Changes to the CV PDF are also out.

## Constraints
- Content canon: `docs/copywriting-full.md` plus `rules/`.
  - Authorship: only NodoSur, NodoFit, Satori Dojo and Don Pizza are Juan's work. Stoky, Inmotuls and Credituls are not.
  - No Abogacía. No revenue figures. Real, immediate availability. No negative words about former employers. No em-dashes.
- Diagram movements are a design layer over the real tul shape. They are never presented as the technical execution of the form.
- Belt colours are the only chromatic inks on the site. Each chapter drenches the viewport in its colour. No shadows, cards or glow.
- Mobile first: a QR visitor gets the verdict in seconds. Zero CLS. No content depends on JS or animation. `prefers-reduced-motion` is honoured.
- Copy lives in `src/data/*` and `src/i18n/ui.ts`, in es/en/pt, never hardcoded.
- Animate only transform, opacity, clip-path and stroke-dashoffset.
- Conventional commits with no AI attribution. Generated artifacts are in English.

## Route
- Per task: delegated direct, with one bounded `sonnet` writer per task that touches 2 or more non-trivial files. The parent verifies and commits.
- TDD: not configured. Source: `odd/tasks/ink-redesign.md` and `odd/tasks/mobile-immersive-portfolio.md`. Ordinary functional checks apply.
- Runner: `bunx astro check`, `bun run build`, `bun test`.
- Delivery strategy: `ask-on-risk`. Chain strategy chosen by the user on 2026-10-05: `feature-branch-chain`. Each PR targets the previous slice, and everything integrates into `feat/tul-redesign`, which reaches `master` once.
- Slices (one PR each):
  - S1 = T0 and T1: `181152a`, `8796b6b`, `64f902d`.
  - S3 = T3: `739b965`, about 850 lines. It is the hero, the FloorDiagram primitive and the engine as one coherent unit.
  - S4 = T3b and T4: `97d7fee`, `d2d6d68`, about 1,300 lines. TulChapter is one data-driven component for all six belts, so it stays one slice.
  - S2 = T2: `3eddaac`. About 740 authored lines, which is over budget. It is one coherent foundation (tokens, layout, header, i18n, test), so it stays as a single slice.

## Tasks
- [x] T0 Prepare: WIP committed on `feat/ink-redesign` as `3de8f84`, and branch `feat/tul-redesign` created from it. This feature document and its Engram mirror `odd/tul-redesign/tasks` created. Surface brief with the direction contract (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM, FINISH) is in `.impeccable/` (see Progress).
- [x] T1 Data: `src/data/tuls.ts` (diagram shape per belt, stops mapped to position ids) plus CV-to-data corrections in es/en/pt:
  - Aurea Med Jan to Apr 2025.
  - NodoSur running in parallel with Repuestos JL from Jun 2025.
  - Certifications: AWS, AZ-900, GCP, CS50.
  - English B2.
  - Licenciatura en Filosofía at UNR, in progress.
  - Data integrity tests.
  - User validated (2026-10-05): one form per belt. White = Saju Jirugi, yellow = Dan-Gun, green = Won-Hyo, blue = Joong-Gun, red = Hwa-Rang. Black uses three tul as a passage through the products: Kwang-Gae for NodoFit, Po-Eun for Satori Dojo, Ge-Baek for Don Pizza, with NodoSur as the frame.
  - Route: delegated (writer trigger, 4 files). Commit `8796b6b`. CV drift: none found, data already matched the CV.
  - To confirm: 12 movements for Saju Jirugi.
- [x] T2 Base system: new tokens (belt fields, ink, variable type), layout, header with grade indicator and legend.
- [x] T3 Joon-bi hero plus the `src/scripts/tul.ts` scene engine (`--p` scenes, line tracing, reduced motion).
- [x] T3b Hero portrait (user request 2026-10-05):
  - Profile photo shown as the plate inside the measuring frame. It is served through `astro:assets` as AVIF/WebP at about 26 kB, eager with `fetchpriority=high`.
  - Cinematic entrance of about 1.6 s with a curtain, scale and blur, gated by `html.tul-intro`.
  - On scroll, the portrait becomes the path: `--q` scales and fades the portrait, then the ghost route and footprints appear.
  - The parent fixed the ghost route crossing the face: it is now hidden while the portrait is legible.
  - Checks: `astro check` 0 errors; build OK; `bun test` 139 pass, 3 skip, 13 fail (baseline).
  - Visual: rest, mid and late at 1440 and 390, plus reduced motion.
- [x] T4 Chapters 1 to 6, with a reusable FloorDiagram. One commit per chapter or per pair.
- [x] T4b NodoFit reframe (user, 2026-10-05):
  - NodoFit is presented as an integral system born from Satori Dojo, covering gyms, trainers, dojos and clubs with court bookings. All of it is in production (user confirmed).
  - Impact softened: the "a cero" claim is removed.
  - Black passage order is now origin to evolution: Kwang-Gae for Satori, Po-Eun for NodoFit, Ge-Baek for Don Pizza.
  - Canon docs updated.
  - Checks: `bun test` 158 pass, 3 skip, 13 fail (baseline). Build OK. NodoFit captured at 1440 and 390 with 0 overflow.
- [x] T5 Principles, technical sheet (stack, certifications, education, languages) and the Kyong-ye close, where the line returns to the origin.
- [x] T6 `/cv` route (es/en/pt) plus a mobile "CV in 30 s" button and the PDF download.
- [x] T7 Retire the old world: `src/components/ink/*`, `src/components/lab/*` and `/lab`, `Belt3D`, `proceduralBelt.ts`, the `three` and Lenis dependencies, and old tokens and tests.
- [x] T9a Always-white field. Add `--belt-fill` / `--belt-line` tokens; remove the drench, the tie plane, the early flip, the header field swap and `data-grade-belt`. Move the accent to strokes, stops, rows, the title cut, the header and `/cv`. Add a line hand-off transition. Update the tests. (User 2026-10-06: no full-screen belt colours.)
- [x] T9b `BeltMark.astro`: a drawn tied belt (SVG, ink outline plus belt fill, contour draw-in) in chapter heads, the header, the legend and `/cv`. It is also the 3D poster.
- [x] T9c Perspective floor in `FloorDiagram` (CSS 3D plane, upright HTML stop markers, scroll camera). Mobile gets a lighter tilt; reduced motion gets a static mild tilt.
- [x] T9d WebGL belt (desktop >=1024 only, lazy, procedural belt from `feat/ink-redesign:src/scripts/proceduralBelt.ts`):
  - Moment A: the white belt lands on the hero floor.
  - Moment B: the belt is tied red to black at 1st dan.
  - Re-add `three`. Delete the unused 5.4 MB GLBs.
- [x] T10a Brush kit: own SVGs in `src/assets/brush/` (rule, drop, dry, drip, enso, vertical) plus `InkPassage.astro` (props `from`, `to`). `35c1750`.
- [x] T10b Ink passages mounted between the six chapters in es/en/pt and scrubbed by `initPassages()` in `tul.ts` (`[data-tul-passage]`, ScrollTrigger only). `c2e4cea`.
- [x] T10c Brush detail on white: dry brush title-cut rule in `--belt-line`, ensō behind the chapter BeltMark, bristle-masked route stroke in FloorDiagram. Paper grain skipped (the contract forbids decoration). `396ef8f`.
- [x] T10d Direction contract (OWN-WORLD sumi-e ink, memorable moment with ink passages) and this document. Commit: the one that adds this line (`docs(tul): ...`, see git log).
- [x] T11a Ink only under titles plus GSAP plugins: SplitText, DrawSVG and MorphSVG registered from the installed `gsap` 3.15 (free since 3.13, no bump). The fixed full-screen ink layer is gone and `InkPassage` is an in-flow spacer. Each chapter title gets its own sumi-e underline (`TitleInk.astro`). `303cc3e`.
- [x] T11b Black flood at 1st dan: `[data-field="dark"]` tokens with measured contrast, a `clip-path` circle flood scrubbed by `--p`, `html[data-field]` set at p >= 0.5, CSS fallback for no JS and reduced motion. `67154ef`.
- [x] T11c `BeltDrawing.astro`: detailed tied belt (pespunte, weave, knot folds, frayed cut tails, gold on 1st dan) mounted in every spacer; it unties and ties with DrawSVG scrubbed by `--p`, and the band wipes to the next belt colour. Mobile always, desktop poster until `html[data-belt3d="ready"]`. Commit: the one that adds this line (`feat(tul): ...`, see git log).
- [ ] T11d Persistent 3D canvas (desktop), beats, `--knot-x` / `--knot-y`, posters. Not started.
- [ ] T11e Direction contract (`.impeccable/surfaces/src-pages-index-astro.md`) and this document. Not started.
- [ ] T8 Finish: `impeccable detect`, then the finish reviewer at desktop 1440 and mobile 390, one fix round, and the documenter rewriting `DESIGN.md` and `.impeccable/design.json`.

## Acceptance criteria
- The first viewport shows the name, the hook, "Contactame" and "Descargar CV" with no scroll, on both 390 and 1440 widths.
- Six belt chapters each show their tul floor diagram, drawn by scroll, with fixed date, role and org columns per milestone.
- The close returns the line to the start point and lands on contact.
- With JS disabled and with reduced motion, all content is visible as a semantic `<ol>`.
- es, en and pt are complete. `astro check`, `bun test` and `bun run build` are green.
- Text contrast is AA on every belt field.
- Copy follows the authorship and money rules.

## Open decisions (user)
- Unreferenced public assets: `public/fotojmPerfil.PNG`, `public/models/*.glb`, and `public/fonts/` (27 MB of old fonts). There is also a stale `package-lock.json` and untracked PNGs under `tests/`.
- Whether to add the "IA y agentes" skills category from the CV to `skills.ts`.
- The white-belt (10th gup) exercise, and which 1st dan tul to use (Kwang-Gae, Po-Eun or Ge-Baek).
- The chain-PR strategy once the work passes about 400 lines.
- Whether to add the roles missing from the CV PDF (Grido, Al Natural, Providus, AS MED).

## Progress / evidence
- 2026-10-06 T11a to T11c (user: ink only under titles, black flood at 1st dan, detailed belt drawing; plan `codegraph-engram-context7-gentle-ai-snoopy-squid.md`). Route: delegated, one writer for the three tasks in order (writer trigger: 2+ non-trivial files per task). TDD: off. Runner: `bunx astro check`, `bun test`, `bun run build`.
  - T11a `303cc3e`: the six full-screen brush SVGs in `src/assets/brush/` are now unreferenced (the underlines are authored paths in `TitleInk.astro` so DrawSVG and MorphSVG can drive them). Deleting them was refused by the shell policy, so they remain on disk and need a user decision.
  - T11a design: the real h2 is split by SplitText (`aria: 'auto'`, masked chars), reverted when the entrance ends. Amarillo splat morphs from a thin shape with MorphSVG; spatter scales in. Tween props: transform, opacity, stroke-dashoffset (DrawSVG), path data of one decorative splat.
  - T11b `67154ef`: flood layer is a fixed viewport layer (z-index 10, under the header) on the passage that arrives at negro. Radius is `--f * --f * 150vmax` with `--f` 0 at p 0.2 and 1 at p 0.5; centre is `--knot-x/--knot-y` when published, otherwise the drawn knot computed from `--p`. Static feTurbulence edge on desktop only.
  - T11b contrast (tests): dark ink 17:1, soft ink about 9:1, light line about 10:1 on `#0a0d11`. Negro belt line is now the light line.
  - T11b fallbacks verified at 1440: no JS and reduced motion give black negro, principles, sheet and close with no flood; the header goes dark with the active negro belt.
  - T11c: spacer static height is 12rem (was 8rem) so the static drawing fits. Drawing is 480x260 with the knot at its centre (`KNOT_AT` in `beltDrawing.ts`, exposed as `--knot-fx/--knot-fy` on the passage).
  - Checks: `bunx astro check` 0 errors; `bun test` 215 pass, 0 fail; `bun run build` 6 pages; `rg "[가-힯]"` over `src/components`, `src/scripts`, `src/pages` finds nothing.
  - Captures (Playwright, 1440 and 390): all six title underlines, animation frames, flood at p 0.1 to 0.8, principles and close on black, no-JS and reduced motion, mobile spacer mid-scroll. A software-rendered sweep of the flood gave 17 ms frames and no long tasks. Not measured: a real GPU (the displacement edge filter re-runs per frame on desktop).
- 2026-10-06 T10 (user: sumi-e ink passages and brush detail; plan `codegraph-engram-context7-gentle-ai-snoopy-squid.md`). Route: delegated, one writer for T10a to T10d (writer trigger: 2+ non-trivial files per task). TDD: off (explicit in the request). Runner: `bunx astro check`, `bun test`, `bun run build`.
  - T10a `35c1750`: kit and component. Each arriving belt has its own piece: yellow drop, green dry sweep, blue drip curtain, red ensō, black single vertical stroke. No text, no hangul.
  - T10b `c2e4cea`: passages mounted in the three pages; the engine writes `--p` per passage (top at the bottom edge to bottom at the top edge). CSS derives `--k` (0, 1, 0).
  - T10c `396ef8f`: brush detail. The old straight `<line>` stays but is stroked 6 wide under a static bristle mask (selector still matches the existing chapter test, so no test was edited for it).
  - Design decisions:
    - The passage box is in flow (60svh, 40svh mobile). Its ink layer is a fixed viewport overlay at z-index 10 (header is 50), invisible when `--k` is 0, so the field is white at both ends. First attempt with an absolute layer centred on the passage left ink over the previous chapter at p=0; replaced.
    - Peak scale was reduced after the first capture (a flat full-screen fill read as a drench).
    - Static SVG displacement filters only on dry, drip and vertical; they sit on the SVG and the HTML wrapper animates (transform, opacity, clip-path). Drop and ensō animate inside the SVG, so they have no filter. On mobile `filter: none`.
    - Reduced motion or no JS: static 8rem divider (verified: 128 px, no overflow).
  - Checks: `bunx astro check` 0 errors; `bun test` 171 pass, 0 fail (14 new in `tests/tul-ink.test.ts`); `bun run build` 6 pages; `rg "[가-힯]" src` matches only the pre-existing, unrendered `hangul` data fields in `src/data/principles.ts` (none in dist).
  - Captures (Playwright, 1440 and 390): scroll sweeps of all five passages gave `--p` 0, 0.5 and 1 with no horizontal overflow; peak and recede frames reviewed for drop, drip, ensō, dry sweep and vertical stroke.
  - Not measured: scroll performance trace on a real GPU; mobile peak captures were taken, not individually judged.
- 2026-10-06 T9 (user: always-white field plus hybrid 3D). Route: delegated, one writer per task in order. The parent reviewed every capture.
  - T9a `df69be8`: one white field. Per-belt `--belt-fill`, and a `--belt-line` stroke that passes ≥4.5:1 on all six belts (yellow becomes ochre `#8a6700`). Removed the tie plane, early flip, header field swap and `data-grade-belt`. The header swatch wipes on chapter change.
  - T9b `c2f5587`: `BeltMark.astro`, a drawn tied belt with ink outline and flat fill. Negro gets a light knot keyline. It is used in the chapter heads, header (mini), legend and `/cv`, with an outline draw-in.
  - T9c `3a7d769`: FloorDiagram is a CSS 3D perspective plane with HTML stop posts that counter-rotate.
    - Tilt follows `--p`: 58° to 44° on desktop, 34° fixed on mobile, 30° static under reduced motion. The hero floor tilts in as the portrait fades.
  - T9d `d6af3c7`: WebGL belt, lazy and desktop-only. The gate checks width ≥1024, no reduced motion, WebGL available and no saveData.
    - three is loaded only through a dynamic import after `load` plus idle. The scene chunk is 145 KB gzip.
    - One shared renderer serves both moments: the white belt lands on the hero floor, and the belt ties red to black with gold stitches at 1st dan. It handles context loss and disposes when off-screen.
    - The unused 5.4 MB GLBs were deleted.
    - Network checks (Playwright): mobile requests no three chunk; desktop requests it after `load`; reduced motion requests none.
  - Direction contract updated (OWN-WORLD is now restrained white plus drawn belts and perspective). Checks: `bun test` 157 pass, 0 fail; build 6 pages.
  - Risks to review in T8: real-GPU performance is unmeasured (headless swiftshader only); the white 3D belt has modest contrast on white; the negro seal box reserves 15rem on desktop even when 3D is off.
- 2026-10-06 T7c and T7d, commit `135e922`. Route: delegated; the parent verified deep entry.
  - The user picked 2 of 4 candidates from the `/lab` shortlist: the horizontal cut for chapter titles (two halves plus a drawn underline) and the word-by-word reveal for the principles. They were ported without any ink look: only transform, opacity, clip-path and stroke-dashoffset, with no filters.
  - The title keeps a single real `h2`; the split copies are `aria-hidden` and are removed after the animation.
  - T7d: the negro beats and the rojo stage are now top-aligned. The 330 px gap on amarillo could not be reproduced at 1920x900.
  - Parent check: loading the page already deep inside a chapter leaves every visible title and word at full opacity; only off-screen words stay dimmed until reached.
  - Checks: `bun test` 119 pass, 0 fail; build OK.
  - Rejected from `/lab`: the bar burst between chapters, hold-to-send CTA and the per-row mark. They stay available if wanted.
  - Next: T8.
- 2026-10-06 T7b (user feedback round), route delegated in two writers.
  - T7b-1 `4836b44`: chapter titles are now by professional area (Formación técnica, Ventas y atención al cliente, Administración pública, Reconversión profesional, Salud y logística, Software en producción). Career copy was neutralized: "sistemas arcaicos", "trinchera" and "la calle" removed, which also fixes a breach of the no-criticism-of-employers rule. Unused fields (`kicker`, `sectionBadge`, general title and subtitle) were removed. `tests/copy-tone.test.ts` guards the tone.
  - T7b-2: tul are shown by grade ("Tul 8º gup · Diagrama de piso · 21 movimientos", "Tul 1º dan · 2 de 3"). The header shows grade plus area title, or the product name in the black passages. No Korean tul names appear on any screen; they live only in `src/data/tuls.ts`. CV buttons say "Ver CV" and use a new external-document icon, with a hidden new-tab hint.
  - Checks: `bun test` 110 pass, 0 fail; build 6 pages.
  - Pending from the plan: T7c (choose `/lab` animations; `/lab` is recoverable from `feat/ink-redesign` at `3de8f84` and `design/franjas-pincel/`), T7d (top-align the pinned stages on wide screens), then T8.
  - Not touched: `rules/Narrativa.md`, `Storytelling.md` and `Copywriting.md` still contain "trinchera" and "La calle".
- 2026-10-05 T0 commit `181152a` (doc, surface brief).
- 2026-10-05 T1 commit `8796b6b`. Checks:
  - `bunx astro check`: 0 errors.
  - `bun run build`: OK.
  - `bun test tests/tuls.test.ts`: 7 pass (parent re-ran it).
  - Full `bun test`: 108 pass, 13 fail. The 13 failures pre-exist on the base and are ink-redesign scroll-engine contract tests. They go away in T7.
- RDD: off (global). Delivery is unmanaged.
- 2026-10-05 T2 commit `3eddaac`. Route: delegated (writer trigger).
  - Fonts: `@fontsource-variable/archivo` (wdth.css: wght 100 to 900, width 62 to 125%) and `@fontsource-variable/atkinson-hyperlegible-next`.
  - Belt field contrast: all pairs at or above 4.86:1.
  - Checks: `astro check` 0 errors; build OK; `bun test` 113 pass, 3 skip, 13 fail (the same baseline names).
  - Skipped, to be removed in T7: the 3 old-world page-composition assertions in `ink-s0`, `ink-sections-a` and `ink-sections-b`.
  - No visual check yet; it is batched after T3.
- 2026-10-05 T3 commit `739b965`. Route: delegated (writer trigger).
  - Files: FloorDiagram (ghost line, `pathLength=1`, `--draw`, lateral arrow offsets, ready label), HeroJoonbi, the `tul.ts` engine (ScrollTrigger `--p` and `--draw`, IntersectionObserver chapter tracking, no Lenis), font preload and metric fallbacks.
  - Checks: `astro check` 0 errors; build OK; `bun test` 134 pass, 3 skip, 13 fail (baseline).
  - Visual: 2 rounds at 1440x900 and 390x844 (the limit reached). Round 1 fixes: role line, ghost route, overlapping arrows, desktop composition, ready label. The "10°" in the screenshot is the Archivo glyph for U+00BA, so the source was already correct; a test now guards it.
  - Deferred to the T8 review: the "Listo" label touches the ghost line, and there is idle space in the middle of the left column on desktop.
- 2026-10-05 T4 commit `d2d6d68`. Route: delegated (writer trigger).
  - TulChapter: a pinned stage holding head, compact `<ol>` and diagram; rows activate as `--draw` passes their `t`; the h2 type grows with grade.
  - Rojo: friction-to-code notation from `automationsContent`.
  - Negro: NodoSur frame plus Kwang-Gae/NodoFit, Po-Eun/Satori and Ge-Baek/Don Pizza sub-scenes.
  - Next-belt tie plane is driven by clip-path over the last 12% of `--p`.
  - Checks: `astro check` 0 errors; build OK; `bun test` 157 pass, 3 skip, 13 fail (baseline).
  - Visual, 2 rounds. Round 1 fix: the whole stage is pinned instead of 58svh row spacing, which removed the blank screens and lost context. Final captures (amarillo, NodoFit, rojo, azul in reduced motion) all show content together with 0 overflow.
  - Deferred to T8:
    - Arrowheads read like text chevrons.
    - Spare space under the negro and rojo desktop stages.
    - On mobile the rojo friction stage scrolls with no pin between scenes.
- Black mapping changed in T4b: Kwang-Gae/satori, Po-Eun/nodofit. Engine API for T4 (T3b adds `data-q-end` and `data-draw-start`; the hero pin is 220svh):
  - `[data-tul-scene]` gets `--p` and `--draw` (top top to bottom bottom, scrub 0.4), with `data-p-from` and `data-p-to`.
  - The hero exposes `data-draw-end=0.25`.
  - Each `main section[data-belt]` sets `html[data-belt]` and the grade indicator.
- Running authored lines (before T2): about 500, past the budget, so the chain strategy is pending (ask-on-risk).
- 2026-10-05 T0: `3de8f84` on `feat/ink-redesign`. Branch `feat/tul-redesign` created. Doc and mirror written.

## Next step
T11d (3D canvas) and T11e (contract), then T8: finish review (impeccable detect, finish reviewer at 1440 and 390, one fix round, documenter rewrites DESIGN.md). Before deploy, the user decides whether the CV PDF gets tracked (see Open decisions).
