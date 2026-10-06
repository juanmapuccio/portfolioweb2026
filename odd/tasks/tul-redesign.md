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
T8: finish review (impeccable detect, finish reviewer at 1440 and 390, one fix round, documenter rewrites DESIGN.md). Before deploy, the user decides whether the CV PDF gets tracked (see Open decisions).
