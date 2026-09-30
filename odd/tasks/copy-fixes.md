# Copy fixes es/en/pt

Plan: C:/Users/juanr/.claude/plans/quiero-seguir-modificando-el-eager-fiddle.md (approved; full finding list there).
Branch: feat/mobile-adaptation. TDD: off (no config). Checks: bun test, bunx astro check, bun run build, rg leftovers, preview es/en/pt 375+1440.
Decisions: remove fake mockup metrics; es register neutral/tuteo.

## Tasks
- [x] C1 Visible errors: pt gender, mockup metrics removed + localized, Desplázate. Route: delegated writer.
- [x] C2 en/pt/es parity with es meaning. Route: delegated writer.
- [ ] C3 Em-dashes in prose (date ranges exempt). Route: delegated writer.
- [ ] C4 Consolidation: CV label via t(), contact labels from contactData, dead copy, curly quotes. Route: delegated writer.

## Flag only (awaiting user facts)
T16 dates overlap, T17 pandemic range, P11 Seiton Motors, P4/P10 quantified claims, S10 +10 years, M2 Process Consultant, M4 og:image.

## Progress
- C1 done: skills.ts (pt gender), ProjectsSection.astro (fake 99.98%/<45ms/HTTP 200 OK removed; STACK/STATUS/ENV cards + terminal strings localized), HomePage.astro (Desplázate). Checks: bun test 5 pass, astro check 0 errors, build ok. Commit: 190893d
- C2 done: ui.ts, contact.ts, skills.ts, projects.ts, martialExperience.ts, principles.ts, ArchitectureDiagram/HomePage/Manifesto/Timeline/Skills/Projects components. en/pt aligned to es (removed added claims), es meta title and Presente, pt Rosário, Taekwondo, Linter label localized. Checks: bun test 5 pass, astro check 0 errors, build ok. Commit: PENDING_C2
