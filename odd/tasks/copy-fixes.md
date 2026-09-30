# Copy fixes es/en/pt

Plan: C:/Users/juanr/.claude/plans/quiero-seguir-modificando-el-eager-fiddle.md (approved; full finding list there).
Branch: feat/mobile-adaptation. TDD: off (no config). Checks: bun test, bunx astro check, bun run build, rg leftovers, preview es/en/pt 375+1440.
Decisions: remove fake mockup metrics; es register neutral/tuteo.

## Tasks
- [x] C1 Visible errors: pt gender, mockup metrics removed + localized, Desplázate. Route: delegated writer.
- [x] C2 en/pt/es parity with es meaning. Route: delegated writer.
- [x] C3 Em-dashes in prose (date ranges exempt). Route: delegated writer.
- [x] C4 Consolidation: CV label via t(), contact labels from contactData, dead copy, curly quotes. Route: delegated writer.

## Flag only (awaiting user facts)
T16 dates overlap, T17 pandemic range, P11 Seiton Motors, P4/P10 quantified claims, S10 +10 years, M2 Process Consultant, M4 og:image.

## Progress
- C1 done: skills.ts (pt gender), ProjectsSection.astro (fake 99.98%/<45ms/HTTP 200 OK removed; STACK/STATUS/ENV cards + terminal strings localized), HomePage.astro (Desplázate). Checks: bun test 5 pass, astro check 0 errors, build ok. Commit: 190893d
- C2 done: ui.ts, contact.ts, skills.ts, projects.ts, martialExperience.ts, principles.ts, ArchitectureDiagram/HomePage/Manifesto/Timeline/Skills/Projects components. en/pt aligned to es (removed added claims), es meta title and Presente, pt Rosário, Taekwondo, Linter label localized. Checks: bun test 5 pass, astro check 0 errors, build ok. Commit: a1e9577
- C3 done: prose em-dashes replaced in skills.ts (certs ' · ', B2 ':', UNR ', ', quote), HomePage hero role, martialExperience roles; test expectation updated (UNR, en curso). Date-range dashes kept. Checks: bun test 5 pass, astro check 0 errors, build ok. Commit: 548d121
- C4 done: Layout.astro and ContactSection.astro use t('hero.btn.cv'); WhatsApp label and URL from contactData (primary channel); dead statusText/locationText removed; curly quotes in ProjectsSection; test updated. Checks: bun test 5 pass, astro check 0 errors, build ok. Commit: 1009daa
- Verification: rg leftovers clean (sozinha, Boutique, TAEKWON-DO, 99.98, 45ms, Desplazá, literal Descargar CV outside ui.ts, prose em-dashes). Preview es/en/pt at 375 and 1440: no horizontal overflow, 0 console errors; es heights 375=15003, 1440=28668 (unchanged).
- [x] C5 Hero headline -> 'Audito procesos de empresas y los resuelvo con código' (es/en/pt); Seiton Motors as IT consulting + database management client. Route: inline (mechanical). Checks: bun test 5 pass, astro check 0 errors, build OK. Commit 059b5f1.
- Flags resolved by user: T16, T17, P4/P10, S10 confirmed as-is; M2, M4 still open.
- [x] O1 Meta title aligned (es/en/pt). Commit 8b0d8bf.
- [x] O2+O3 OG image public/og/og-juan-puccio.png (1200x630, JMP Portfolio + photo, legible at 300px) and og/twitter image tags. Checks: bun test 5 pass, astro check 0 errors, build OK, absolute URLs confirmed in dist es/en/pt. Commit dd3c775. Pending user step: LinkedIn Post Inspector after deploy.
- [x] F1 Favicon: belt icon replaced by outlined serif J monogram (svg, ico 16/32/48, apple-touch 180). Checks: bun test 5 pass, astro check 0 errors, build OK. Commit 8ba0b18.
