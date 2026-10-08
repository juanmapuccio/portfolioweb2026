# Feature: visual-audit-and-ai-feedback

**Branch:** actual
**Creado:** 2026-10-04
**TDD:** activo (`bun test`). **RDD:** off (`receipt-driven development: off`).
**Origen:** Auditoría visual end-to-end con Playwright y evaluación de herramientas de feedback visual asistido por IA (Midscene.js / Playwright).

## Contexto y Motivación

Se ejecutó una revisión visual automatizada de la web completa (Desktop 1440x900 y Mobile 390x844) contra el servidor de desarrollo local Astro (`http://localhost:4321/`), capturando evidencias en `tests/visual-audit/`.
Se evaluaron además herramientas open-source gratuitas para proveer feedback visual directo a la IA.

## Diagnóstico Visual Detectado

1. **Hero Desktop (`desktop-01-hero.png`):**
   - El canvas WebGL y los textos del hero no se aprecian en el primer frame estático previo al inicio del scroll/hidratación de GSAP ticker.
2. **Sección Cinturones Desktop (`desktop-cinturones.png`):**
   - El slot interactivo (`.koma-belt3d-container`) muestra el anillo punteado de reserva (`.koma-belt3d-ghost`), confirmando que `Belt3D` no se fijó a las coordenadas exactas de la viñeta Koma-wari en el estado capturado.
   - Existe solapamiento asimétrico entre paneles adyacentes durante el scroll horizontal.
3. **Hero Mobile (`mobile-01-hero.png`):**
   - Badge superior (`96 · CARGANDO`) pegado al margen superior izquierdo; espacio central sin equilibrar.
4. **Sección Cinturones Mobile (`mobile-cinturones.png`):**
   - El contenedor del cinturón 3D permanece como un círculo vacío en mobile porque `Belt3D.astro` está deshabilitado por diseño en `< 1024px` (`display: none !important`), sin contar con un fallback gráfico 2D/SVG representativo del cinturón correspondiente.

## Herramientas de Feedback Visual para IA Evaluadas

- **Playwright Headless Local (Implementado en `tests/visual-audit.mjs`):**
  - Gratuito, sin dependencias de API keys externas.
  - Genera capturas de pantalla de alta resolución consumibles directamente por agentes con capacidades de visión.
- **Midscene.js:**
  - Automatización basada en modelos multimodales (UI assertions por lenguaje natural).
  - Requiere endpoint con modelo de visión (OpenAI GPT-4o o local vía Ollama con `llama3.2-vision` / `qwen2.5-vl`).

## Tareas

- [x] **V1** Script de auditoría visual automatizado multi-viewport (`tests/visual-audit.mjs`).
- [x] **V2** Captura e inspección visual de Hero, Cinturones y Contacto en Desktop y Mobile.
- [x] **V3** Fallback visual 2D para el slot de cinturón en dispositivos móviles (< 1024px).
- [x] **V4** Ajuste del anclaje y visibilidad del modelo 3D en las viñetas Koma-wari.
