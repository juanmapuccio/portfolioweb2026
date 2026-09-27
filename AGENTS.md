# Workspace Guidelines & Agent Operating System (AGENTS.md)
**Workspace Path:** `C:\Users\juanr\OneDrive\Escritorio\Proyectos\apps\porfolio-online-juan-puccio-2026`  
**Canonical Project ID (Engram & CodeGraph):** `portfolioweb-puccio2026`  
**Owner:** Juan Manuel Puccio  
**Propósito:** Definir las directrices de ingeniería, reglas de codificación, criterios de diseño e instrucciones operativas para agentes en este repositorio. Toda memoria en Engram y grafo en CodeGraph debe almacenarse y consultarse bajo este ID canónico.

---

## 1. Criterios de Implementación y Arquitectura

1. **Stack Tecnológico:**
   - **Framework:** Astro 7 con TypeScript estricto.
   - **Estilizado:** CSS limpio, modular o Tailwind (según convención definida), priorizando tokens semánticos definidos en `DESIGN.md`.
   - **Internacionalización (i18n):** Uso nativo de `astro:i18n` para soportar `es` (default), `en` y `pt` con rutas canónicas y persistencia fluida.
   - **Arquitectura de Islas:** HTML estático renderizado en build por defecto; reservar componentes interactivos (`client:visible`, `client:idle`) solo para widgets que requieran estado (ej. modal QR, selector dinámico).

2. **Criterios Estéticos y Calidad (Taste & Impeccable Standards):**
   - Nunca entregar interfaces genéricas o que parezcan plantillas prediseñadas baratas.
   - Respetar la paleta de colores de `DESIGN.md` (Obsidian, Slate, Cyan, Emerald).
   - Tipografía con jerarquía estricta y sin saltos acumulativos de diseño (Zero CLS).
   - Mobile-First obligatorio: la experiencia al abrirse desde un lector de QR móvil debe ser instantánea y visualmente impecable.

3. **Gestión de Contenido y Datos:**
   - Todo el contenido de textos y traducciones debe residir en archivos estructurados (ej. `/src/i18n/ui.ts` o colecciones de contenido en `src/content/`).
   - El storytelling debe respetar rigurosamente la base estratégica definida en `DOCUMENTACION_STORYTELLING_Y_OBJETIVOS.md`.

---

## 2. Convenciones de Código y Commits

- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `chore:`.
- **Sin atribuciones:** Nunca agregar firmas de IA o `Co-Authored-By` en commits.
- **Tipado estricto:** Cero `any` implícitos en TypeScript. Definir interfaces para proyectos, experiencias, traducciones y metadatos.

---

## 3. Skills Locales Disponibles en el Workspace

- `.agents/skills/brainstorming/SKILL.md`: Protocolo para refinar ideas, cuestionar asunciones de diseño y explorar alternativas de producto antes de implementar.
- `.agents/skills/taste-design/SKILL.md`: Criterios avanzados de composición visual, espaciado, contraste, micro-interacciones y jerarquía estética.
- `.agents/skills/impeccable-code/SKILL.md`: Estándares de calidad de código frontend, accesibilidad (a11y), rendimiento web (Core Web Vitals) y orden de componentes.
