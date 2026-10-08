# copywriting-versions

## Objective
Create three trilingual (ES/EN/PT) copywriting documents under `docs/`: `copywriting-full.md` (source of truth), `copywriting-desktop.md` and `copywriting-mobile.md` (short versions that keep visual attention on cinematics, transitions and immersive scroll).

## Problem / why
Copy is scattered across `src/data/*.ts`, `src/i18n/ui.ts` and component ternaries. Prototypes in `design/` use their own short copy. We need one canonical full copy and two derived, bounded versions.

## Scope
- In: three new docs in `docs/`. Sources: Claude Design project uploads (Copywriting, Narrativa, Storytelling, narrativa-original), `design/MockupMobile.dc.html`, `design/Landing Inmersiva v2.dc.html`.
- Out: any change to `src/`, tests, or components.

## Constraints
- Follow `Storytelling.md` §1.0 rules (recruiter audience, no passive income, no hours, no Stoky/Inmotuls/Credituls as own work, no Don Pizza informality, no "fuera de mi horario laboral", no Abogacía).
- `narrativa-original.md` conflicts are resolved in favor of `Narrativa.md` / `Storytelling.md`.
- File names use a single "t": `copywriting-*` (requested spelling "copywritting-full" assumed a typo).

## Route
Delegated direct: one bounded writer (3 non-trivial files). TDD: not applicable (docs). Checks: field-length budgets, key parity ES/EN/PT, forbidden-term `rg`.

## Tasks
- [x] T1 `docs/copywriting-full.md`
- [x] T2 `docs/copywriting-desktop.md` (derived from T1 + Landing Inmersiva v2)
- [x] T3 `docs/copywriting-mobile.md` (derived from T1 + MockupMobile)
- [x] T4 Verification (forbidden terms, key mapping; budgets checked by reading, not mechanically)

## Acceptance criteria
- Every short string in desktop/mobile maps to a key in full.
- ES/EN/PT have identical keys in all three docs.
- No forbidden terms; mobile has no paragraphs.

## Progress / evidence
- Route deviation: the delegated writer could not reach DesignSync (not available to subagents), so the parent wrote the three docs inline; the sources were already in the parent context.
- Verified: `rg` of forbidden terms matches only rule text and the manifesto phrase "administrativo pasivo"; every `full.*` key referenced by desktop/mobile exists in full; line counts 254/91/100.
- Not verified: per-field character budgets measured mechanically.
- 2026-10-03: EN/PT of the 11 timeline positions (§3.3.1/§3.3.2), 4 project bodies (§4.2/§4.3) and 5 stack categories (§5.1.1/§5.1.2) transcribed verbatim from `src/data/*.ts` into `docs/copywriting-full.md` (now 358 lines); each section lists "Diferencias con el código" (ES doc vs code, plus unverifiable 0%/100% figures in code automation metrics). `src/` untouched. Forbidden-terms `rg` still matches only rule text and "administrativo pasivo".
- 2026-10-03 (user-authorized): removed unverifiable figures ("0% de margen de error", "100%") from `automationsContent` in `src/data/projects.ts` (ES/EN/PT, 6 lines). `astro check` 0 errors; `bun test` 82 pass / 1 fail. The failing test (`skills reveals assemble…`, `tests/final-sections.test.ts:1019`) also fails without this change (verified with `git stash`), so it is a pre-existing test/component drift, not addressed here. §4.1 notes in `copywriting-full.md` updated.
- Engram mirror `odd/copywriting-versions/tasks`: pending.
- Commit: none (docs only; not requested).

## Next step
Review the docs; commit when you decide.
