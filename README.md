# Juan Manuel Puccio — Portfolio & CV

**Live:** [juanpuccio.vercel.app](https://juanpuccio.vercel.app)  
**Languages:** Spanish (es) · English (en) · Portuguese (pt)

---

## 🎯 About

An interactive portfolio and CV website for Juan Manuel Puccio, Full Stack Developer & Process Optimization Specialist. Built with **Astro 7** for ultra-fast static rendering, optimized for mobile access via QR code.

**Positioning:** 
- Formed in robotics and programming, tested in operations (ANSES, healthcare, logistics, food commerce)
- Full Stack with TypeScript, Python automations, fiscal API integrations
- Builds and stabilizes production software with real, paying customers (NodoSur, Stoky, NodoFit)

**Four production systems showcased:**
1. **NodoSur** — Software factory & cloud infrastructure
2. **NodoFit** — SaaS for gym/sports facility management
3. **Satori Dojo** — Martial arts school management & brand site
4. **Don Pizza** — Real-time POS & logistics for food service

---

## 🏗️ Stack

- **Framework:** [Astro 7](https://astro.build) — zero JS by default, Islands Architecture
- **Language:** TypeScript (strict, no `any`)
- **Styling:** CSS modules with semantic tokens
- **i18n:** Native `astro:i18n` for ES/EN/PT routes
- **QR Code:** Generated locally at build time (no external API dependency)
- **Deploy:** Vercel (static output, Edge network)
- **Dev checks:** `astro check` (TypeScript 6), `npm run build`

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 22.12.0
- bun (recommended) or npm/pnpm

### Local Development

```bash
# Clone the repo
git clone https://github.com/juanmapuccio/portfolioweb2026.git
cd portfolioweb2026

# Install dependencies
npm install  # or: bun install

# Start dev server
npm run dev
# Open http://localhost:4321
```

### Build & Check

```bash
# Type-check Astro files
npm run check

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── HomePage.astro                  # Hero, sections, QR modal (all locales)
│   ├── ProjectsSection.astro           # Bento grid of 4 production systems
│   ├── MartialExperienceTimeline.astro # Martial & career timeline scrollytelling
│   ├── SkillsPhilosophySection.astro
│   └── ContactSection.astro
├── pages/
│   ├── index.astro                     # Spanish (/), imports HomePage
│   ├── en/index.astro                  # English (/en), imports HomePage
│   └── pt/index.astro                  # Portuguese (/pt), imports HomePage
├── data/
│   ├── projects.ts                     # 4 systems + automations
│   ├── martialExperience.ts            # Career milestones & TKD belts
│   ├── skills.ts                       # Tech stack & soft skills
│   └── contact.ts                      # Links, CV URL
├── i18n/
│   └── ui.ts                           # Copy & header dictionary
├── layouts/
│   └── Layout.astro                    # HTML boilerplate & font imports
└── styles/
    └── global.css                      # Design tokens (Warm Editorial)
```

---

## 💡 Key Features

- **Fast & Accessible:** Static HTML, semantic markup, WCAG-compliant
- **Mobile-First:** Optimized for QR code access, <300ms TTFB on 4G
- **Multilingual:** Route-based i18n (no slug in URL for default locale)
- **Local QR:** Generated at build time, no external dependency
- **Centralized Content:** Translations and data in single sources (`ui.ts`, `data/`)
- **Type-Safe:** TypeScript strict mode, no implicit `any`

---

## 📄 Documentation

- **[AGENTS.md](AGENTS.md)** — Engineering criteria, architecture rules, skills registry
- **[DESIGN.md](DESIGN.md)** — Design system: warm editorial light theme, color tokens (canonical source)
- **[PRODUCT.md](PRODUCT.md)** — Product positioning, audiences, and strategy
- **[rules/Copywriting.md](rules/Copywriting.md)** — All page copy (ES/EN/PT)

---

## 📥 CV & Downloads

**The CV is hosted externally** (Google Drive link). PDFs are not committed to this repo.  
Update the CV URL in [src/data/contact.ts](src/data/contact.ts) → `CV_URL` constant.

---

## 🔗 Links

- **GitHub:** [juanmapuccio/portfolioweb2026](https://github.com/juanmapuccio/portfolioweb2026)
- **Live Site:** [juanpuccio.vercel.app](https://juanpuccio.vercel.app)
- **LinkedIn:** [LinkedIn Profile](https://linkedin.com/in/juanmapuccio)
- **Email:** [juan.pucciom@gmail.com](mailto:juan.pucciom@gmail.com)

---

## 📝 License & Usage Terms

**Code & Architecture:** MIT License — freely use, modify, and reuse the technical structure, components, styling, and build configuration for your own projects.

**Personal Data:** ⚠️ **Prohibited.** All personal information is **proprietary and exclusive to Juan Manuel Puccio**:
- Name, email, and contact information
- Professional photo and biometric data
- CV, work experience, and career narrative
- Project descriptions and business information
- All textual content and translations

You may **fork this repo and adapt it for your own portfolio**, but you must:
1. Remove or replace all personal data with your own
2. Update configuration, styling, and copy to reflect your identity
3. Not use Juan's name, image, professional history, or content in any public context

**In short:** Use the code and architecture freely; the personal story is his alone.

---

**Built with Astro, TypeScript & ❤️**
