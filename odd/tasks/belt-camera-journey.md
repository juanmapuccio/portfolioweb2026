# Feature: belt-camera-journey

**Branch:** feat/belt-camera-journey (off master @ 94441c2 + CodeQL merge)
**Creado:** 2026-10-08
**TDD:** por definir por tarea (sin runner determinístico para verificación visual de cámara 3D; se usa verificación funcional/visual con Playwright + capturas en su lugar).
**RDD:** por confirmar (`gentle-ai review mode status`).

## Objetivo

Reemplazar el sistema de cámara 3D actual — un objeto (cinturón + tatami) que cambia de pose mientras la cámara se reencuadra con `setViewOffset` alrededor de un target casi fijo — por una cámara que viaja realmente por un espacio 3D con profundidad, recorriendo los 6 capítulos de cinturón (blanco → amarillo → verde → azul → rojo → negro) en orden, con estética editorial constante. Al llegar a cinturón negro, el copy de esa sección se reduce al mínimo posible (solo lo imprescindible).

## Por qué

Pedido explícito del usuario tras una auditoría visual en vivo del sitio deployado: la narrativa visual existe y el diseño ya está resuelto, pero no hay movimiento de cámara real — es una animación de pose, no un recorrido. El usuario viene buscando esto hace tiempo ("es una búsqueda que vengo haciendo").

## Estado actual (evidencia, no suposición — mapeado por exploración previa)

- Cámara: `PerspectiveCamera`, reposicionada desde cero cada frame por `aim()` (`src/scripts/belt3d/scene.ts`) alrededor de 3 constantes de target casi idénticas (`HERO_TARGET`, `TRAVEL_TARGET`, `CHAPTER_TARGET` en `journey.ts`). No hay interpolación de posición 3D real entre waypoints — solo un escalar de progreso (0-1) por GSAP ScrollTrigger que se traduce a ángulo/distancia.
- `Cam` struct (`target`, `dist`, `elevation`) + `lerpCam()` ya existen — es la base reutilizable, hoy solo interpola 2 estados (hero<->viaje).
- Todo el contenido 3D vive en ~1m3 cerca del origen — sin profundidad real entre capítulos, sin niebla.
- La cámara "piso bajo" del capítulo rojo (automatizaciones) ya sigue una ruta 2D del piso — es el prototipo más cercano a "cámara que viaja", confinado a una caja chica.
- `setViewOffset` mantiene el texto encuadrado en su columna — tensión directa con movimiento de cámara real; decisión de diseño pendiente (ver T3).
- Three.js `^0.186.1` ya instalado, sin postprocessing/fog en uso actualmente.

## Scope

**Incluye:**
- Generalizar el sistema de cámara a N waypoints 3D reales, uno (o más) por capítulo de cinturón.
- Agregar profundidad de escena (offset en Z por capítulo) + niebla (`fog` nativo de Three.js) para sensación de recorrido.
- Resolver la tensión `setViewOffset` vs. movimiento real: híbrido — viaje real de cámara en los tramos *entre* capítulos, reencuadre de columna solo *dentro* de cada capítulo mientras hay texto que leer.
- Capítulo cinturón negro: reducir el copy al mínimo imprescindible (coordinar qué contenido se corta/resume con el usuario antes de tocar `src/data/martialExperience.ts` u otros datos de contenido).
- Mantener gating existente (`prefers-reduced-motion`, `<1024px`, WebGL, data-saver) y el fallback mobile ("Ver en 3D" on-demand).

**No incluye (fuera de alcance, explícitamente):**
- Rediseño de contenido/copy de los otros 5 capítulos (solo negro).
- Cambios a `TulHeader.astro` más allá de lo estrictamente necesario para convivir con el nuevo canvas.
- Nueva geometría de "salas" por capítulo más allá de offset en profundidad + niebla (no se modela mobiliario 3D nuevo salvo que surja como necesidad durante la tarea 2).

## Restricciones

- Performance real-GPU sin medir hasta ahora (solo swiftshader headless) — validar en dispositivo real antes de cerrar.
- El cálculo de stage-offset asume `top: 3rem` en el sticky — frágil a cambios de CSS, cuidar en T1/T2.
- Zoom y swing de la cámara baja (capítulo rojo) están afinados a ojo solo en 1440px — revisar si el nuevo sistema de waypoints lo hace obsoleto o hay que generalizarlo también.

## Checklist

- [ ] **T1 — Generalizar waypoints de cámara.** Reemplazar las 3 constantes de target por una tabla de waypoints `{ beltKey, position, lookAt }[]`, uno por capítulo como mínimo. Generalizar `lerpCam()` para interpolar entre N waypoints según el progreso de scroll *global* de la página (no solo el progreso local por capítulo). Ruta: inline o delegado directo (archivo único `journey.ts` + ajustes en `scene.ts`).
- [ ] **T2 — Profundidad de escena + niebla.** Dar a cada capítulo su propio offset en Z, agregar `fog` nativo de Three.js para profundidad visual entre capítulos. Verificar que el tatami/cinturón de cada capítulo no se solape visualmente con el del capítulo vecino.
- [ ] **T3 — Híbrido viaje real / reencuadre de texto.** Implementar la transición: cámara con movimiento 3D real en los tramos "passage" (entre capítulos), reencuadre `setViewOffset` solo activo durante el tramo "travel" (dentro de un capítulo, con texto en pantalla). Decisión de diseño ya tomada por el usuario en la conversación — documentar el resultado acá tras implementar.
- [ ] **T4 — Cinturón negro: reducir texto al mínimo.** Coordinar con el usuario qué contenido del capítulo negro se recorta antes de editar `src/data/martialExperience.ts` (o el archivo de datos correspondiente al capítulo negro). Aplicar el recorte + ajustar el layout de esa sección para que funcione con mucho menos texto.
- [ ] **T5 — Verificación visual y de performance.** Recorrer las 6 etapas en navegador real (Playwright/browser pane) en >=1024px, confirmar que la cámara viaja (no solo reposa), confirmar fallback mobile/reduced-motion intacto, medir performance en GPU real (no swiftshader).
- [ ] **T6 — Generalizar o retirar la cámara "piso bajo" del capítulo rojo** según si el nuevo sistema de waypoints la vuelve redundante o si conviene mantenerla como caso especial dentro del nuevo sistema.

## Criterios de aceptación

- La cámara interpola posición 3D real entre waypoints de capítulos consecutivos durante el scroll — no solo reencuadre `setViewOffset` de un target fijo.
- Progresión visual blanco -> negro coherente y con estilo editorial constante (tipografía, paleta, espaciado ya establecidos en el redesign actual, sin regresiones).
- Cinturón negro con texto reducido al mínimo, aprobado por el usuario antes de mergear.
- `astro check`, tests existentes (83 Vitest + suite `tul-*` bun:test) y build pasan sin romper nada fuera de scope.
- Gating de accesibilidad/performance (reduced-motion, mobile, data-saver, WebGL ausente) se comporta igual que antes.

## Progreso

- 2026-10-08: Feature document creado tras exploración previa (mapeo de `scene.ts`/`journey.ts`/`tul.ts` completado en la conversación). Branch `feat/belt-camera-journey` creada off `master` (post-merge de tul-redesign + tests/CI/SEO + CodeQL). Próximo paso: T1.
