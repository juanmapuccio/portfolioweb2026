# ODD Feature: text-condensation-immersion

**Route:** delegated direct (writer trigger: 5 non-trivial files — HomePage.astro, ManifestoScrollytelling.astro, MartialExperienceTimeline.astro, martialExperience.ts, tests/final-sections.test.ts)
**Branch:** feat/text-condensation-immersion
**TDD:** off (no configured TDD mode; bun test suite = ordinary functional checks). Runner: `bun test` (69/0 green at baseline e876359), build: `bun run build`.
**Delivery strategy:** ask-on-risk (forecast ~120-160 authored changed lines total — under the 400 heuristic, single coherent PR slice).

## Objective
Maximize immersion by cutting textual overload: hero breathes, manifesto reveals in one precise scroll beat, belt curtains become clean covers with the 3D belt as protagonist, job cards become scannable impact one-liners.

## Scope (user-approved plan, 2026-10-02)
- Phase 1 Hero: remove `hero-body-claim` paragraph + CSS (desktop + mobile list), tighten narrative gap.
- Phase 2 Manifesto: canonical text condensed to user-provided 21-word versions (es/en/pt), section height 260vh → 160vh.
- Phase 3 Curtains: remove `stage.lede` from curtain editorial block; relocate as intro text of the track header (`.h-intro-lede`); keep `data-nav-target="0.7"` (editorial reveal formula completes at p≈0.64 regardless of lede — verified).
- Phase 4 Data: condense 6 over-long teasers ×3 langs to impact one-liners; `description` untouched (modal detail). Update `teaser` interface doc-comment.
- Phase 5 QA: update teaser-policy invariant in tests/final-sections.test.ts:304-315 (startsWith dropped; ≤160 + single-sentence kept), `bun test` + `bun run build` clean.

## Constraints
- User copy is verbatim (ES/EN/PT manifesto strings; Grido ES one-liner).
- ANSES user example merged two real stages → split by accuracy: verde = expedientes/normativa, azul = servidores/mesa de ayuda. Disclose in final report.
- Black chapter (black-curtain-scene) untouched.
- No new factual claims; teasers derived from existing description content.

## Tasks
- [x] T1 Hero synthesis — remove body-claim + gap tighten (HomePage.astro) → commit 590b9a3
- [x] T2 Manifesto condensation — 3 locale strings + 260vh→160vh (ManifestoScrollytelling.astro) → commit 9928a6b
- [x] T3 Curtain cleanup — lede → track header, CSS move, comment fix (MartialExperienceTimeline.astro) → commit 224fd51
- [x] T4 Teaser one-liners — 6×3 langs + interface comment (martialExperience.ts) → commit 80e63dd (with T5)
- [x] T5 QA — test invariant update, bun test, bun run build, visual sanity → commit 80e63dd

## Checks (per task closure)
- `bun test` → 69 pass / 0 fail (writer-run + parent spot-check re-run, both green)
- `bun run build` → Astro static build successful, 3 pages, zero warnings (writer-run)

## Progress / evidence
- Base boundary: e876359 (feat/scroll-engine-consolidation HEAD, tests 69/0)
- Work-unit commits: 590b9a3 (hero), 9928a6b (manifesto), 224fd51 (timeline), 80e63dd (teasers+test policy)
- Total authored delta across 4 commits: 44 insertions / 62 deletions (≈106 changed lines — well under the 400 delivery heuristic; single PR slice, ask-on-risk never triggered a split prompt)
- Decisions taken during implementation: (a) data-nav-target kept at 0.7 — editorial-block reveal formula completes at p≈0.64 independent of the removed lede; test line 322 asserts 0.7. (b) ANSES user one-liner merged two real stages → split by accuracy: verde = expedientes/normativa, azul = servidores/mesa de ayuda. (c) teaser policy invariant moved from verbatim-prefix to ≤160 + single-sentence (test renamed). (d) stale script comment "260vh" fixed inline by parent post-writer.

## Next step
- Feature complete pending native review of the branch slice; visual scroll QA (desktop/mobile) is the user's browser check.

