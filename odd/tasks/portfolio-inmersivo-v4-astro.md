# Feature: Replicar Experiencia y Diseño de Portfolio Inmersivo v4 en Astro

## Objetivo
Portar la dirección de arte, el motor procedural Three.js del cinturón 3D y la coreografía de scrollytelling (cortinas y pistas horizontales) desde el prototipo `Portfolio Inmersivo v4(standalone).html` hacia la arquitectura modular de Astro 7, preservando el tipado estricto en TypeScript y el copywriting multi-idioma (`es`, `en`, `pt`).

## Alcance y Restricciones
- Framework: Astro 7 con TypeScript estricto.
- Malla 3D: Three.js procedural (sin assets externos pesados ni GLTF innecesarios), con Shadow DOM o canvas optimizado.
- Copy: Respetar los textos y storytelling existentes en `src/i18n/` y `src/data/`.
- Paleta y Tokens: `#F2EEE6` (editorial claro), `#1C1A17` (obsidiana oscuro), `#D4AF37` (oro), y los 6 colores de graduación marcial.
- Tipografías: `Source Serif 4`, `Hanken Grotesk`, `IBM Plex Mono`.

## Tareas

- [x] `task-1`: **Motor y Malla Procedural del Cinturón 3D** en `src/components/Belt3D.astro` y `src/scripts/proceduralBelt.ts` con textura de sarga, costuras dobles y colas dinámicas.
- [x] `task-2`: **Tokens de Diseño y Fuentes** en `src/styles/` y `src/layouts/Layout.astro` (`Source Serif 4`, `Hanken Grotesk`, `IBM Plex Mono`).
- [x] `task-3`: **Header Fijo con Nav Ticks y Hero Section** en `src/components/HomePage.astro` y `src/layouts/Layout.astro`.
- [ ] `task-4`: **Scrollytelling Marcial (Cortinas y Pistas Horizontales)** en `src/components/MartialExperienceTimeline.astro` con datos de `src/data/martialExperience.ts`.
- [ ] `task-5`: **Transición a Modo Oscuro y Proyectos en Producción** en `src/components/ProjectsSection.astro`.
- [ ] `task-6`: **Stack, Filosofía y Footer Kimono Dobok** en `src/components/SkillsPhilosophySection.astro` y `src/components/ContactSection.astro`.
