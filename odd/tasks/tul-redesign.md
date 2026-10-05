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
- Delivery strategy: `ask-on-risk`. The forecast is well over 400 authored lines, so the chain strategy is asked before the first commit that crosses the budget.

## Tasks
- [x] T0 Prepare: WIP committed on `feat/ink-redesign` as `3de8f84`, and branch `feat/tul-redesign` created from it. This feature document and its Engram mirror `odd/tul-redesign/tasks` created. Surface brief with the direction contract (THESIS, OWN-WORLD, STORY, FIRST VIEWPORT, FORM, FINISH) is in `.impeccable/` (see Progress).
- [ ] T1 Data: `src/data/tuls.ts` (diagram shape per belt, stops mapped to position ids) plus CV-to-data corrections in es/en/pt:
  - Aurea Med Jan to Apr 2025.
  - NodoSur running in parallel with Repuestos JL from Jun 2025.
  - Certifications: AWS, AZ-900, GCP, CS50.
  - English B2.
  - Licenciatura en Filosofía at UNR, in progress.
  - Data integrity tests.
  - Blocked on the user validating the white-belt exercise and the 1st dan tul.
- [ ] T2 Base system: new tokens (belt fields, ink, variable type), layout, header with grade indicator and legend.
- [ ] T3 Joon-bi hero plus the `src/scripts/tul.ts` scene engine (`--p` scenes, line tracing, reduced motion).
- [ ] T4 Chapters 1 to 6, with a reusable FloorDiagram. One commit per chapter or per pair.
- [ ] T5 Principles, technical sheet (stack, certifications, education, languages) and the Kyong-ye close, where the line returns to the origin.
- [ ] T6 `/cv` route (es/en/pt) plus a mobile "CV in 30 s" button and the PDF download.
- [ ] T7 Retire the old world: `src/components/ink/*`, `src/components/lab/*` and `/lab`, `Belt3D`, `proceduralBelt.ts`, the `three` and Lenis dependencies, and old tokens and tests.
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
- The white-belt (10th gup) exercise, and which 1st dan tul to use (Kwang-Gae, Po-Eun or Ge-Baek).
- The chain-PR strategy once the work passes about 400 lines.
- Whether to add the roles missing from the CV PDF (Grido, Al Natural, Providus, AS MED).

## Progress / evidence
- 2026-10-05 T0: `3de8f84` on `feat/ink-redesign`. Branch `feat/tul-redesign` created. Doc and mirror written.

## Next step
T1, once the user answers the tul validation question.
