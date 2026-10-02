# Feature: immersive-journey

**Branch:** `feat/immersive-journey` (se crea en T1)
**Creado:** 2026-10-01
**TDD:** activo (runner: `bun test`, tests string-assertion sobre fuentes `.astro`/`.ts`)
**RDD:** off (global disabled → checks funcionales nomrales, sin review nativa)

## Objetivo

Convertir el trayecto de cinturones (blanco → negro) en una experiencia inmersiva de
scroll con ritmo narrativo: corta filosófica → track de cards de trabajos → detalle bajo
demand (modal). Reducir la lectura obligada, arreglar los defectos de interacción y
definir el comportamiento mobile.

## Decisiones de producto (usuario, 2026-10-01)

1. **Patrón por capítulo (NO horizontal monótono):** cada cinturón presenta
   - *Beat 1 — Aparece:* cortina con mensaje filosófico/resumen (el lede actual).
   - *Beat 2 — Juega:* los trabajos de esa etapa como cards en track sticky+horizontal.
   - *Beat 3 — Profundiza:* click en card → **modal overlay** con qué hice + aprendizaje.
2. **Detalle = modal overlay** (no inline ni drawer). Cierra y volvés a la posición exacta.
3. Copy visible se reduce estructuralmente (detalle detrás del modal); NO se borra copy
   sin aprobación explícita.

## Alcance

### En scope
- Reestructurar los 5 capítulos al patrón decisión #1 (blanco/verde/rojo dejan split vertical).
- Modal overlay de detalle de trabajo (es/en/pt, a11y, Lenis pause/resume).
- Selector rápido del header: aterrizar con el reveal ya terminado (punto 1).
- Tuning de Lenis para scroll reactivo (punto 7).
- Reducir movimiento excesivo del 3D en scroll (punto 6).
- Transición rojo→negro: activar `belt:black-progress` (contrato muerto) + pulir (punto 8).
- Hero: foto de perfil más grande, mejor uso de la columna derecha (punto 9).
- Responsive mobile: primera dirección definida e implementada (punto 10).
- Tests: reconciliar `tests/final-sections.test.ts` con la arquitectura nueva.

### Fuera de scope
- Borrar/traducir copy existente sin aprobación.
- Delivery (push/PR): decisión del usuario bajo política ordinaria del repo.
- Punto 4 (vista compacta con toggle): queda cancelado si T1+T8 acortan el trayecto
  suficiente; se revisa al cierre con métrica de altura total.

## Criterios de aceptación globales

- `bun test` verde · `astro check` 0 errores · `npm run build` OK.
- Click en tick del header: al detenerse el scroll, el capítulo se ve revelado (no en blanco).
- Scroll de rueda responde con poco movimiento (sin tener que "patear" la rueda).
- El 3D no se desplaza bruscamente entre beats.
- Transición rojo→negro: tint del modelo 3D en scrub (no hard-switch).
- Hero: columna derecha con foto sustancialmente mayor.
- Mobile: patrón definido (tracks, modal, ticks del header) y sin regressions 767px.

## Tareas

- [x] **T1** Estructura: beat 1 cortina + beat 2 track horizontal por capítulo (5 capítulos al mismo componente; data → cards con blurb corto). Ruta: **delegada** (writer, 3+ archivos: `MartialExperienceTimeline.astro`, nuevo componente de track, `martialExperience.ts` si hace falta tipo). Fijar `data-nav-target` por capítulo para T3.
- [x] **T2** Modal overlay de detalle (nuevo `JobDetailModal.astro`, a11y focus-trap/Esc/aria-modal, Lenis stop/resume, i18n es/en/pt, abre desde card). Ruta: **delegada** (writer, 2+ archivos).
- [x] **T3** Header selector: handler click → `lenis.scrollTo` al beat revelado; eliminar doble offset (scroll-padding 80px + anchors offset -80). Ruta: delegada si toca 2+ archivos, si no inline.
- [x] **T4** Lenis tuning: `wheelMultiplier`/`duration`/`lerp` para reactividad. Archivo: `Layout.astro`. Ruta: **inline** (1 archivo, mecánico). Validación de "feel" la hace el usuario.
- [x] **T5** Belt3D: reducir amplitud/velocidad del sway y suavizar persecución de slots (`k=0.08`). Archivo: `Belt3D.astro`. Ruta: **inline**. Validación de "feel" la hace el usuario.
- [x] **T6** Rojo→negro: dispatch `belt:black-progress` desde el timeline (hoy listener huérfano en Belt3D) + pulir tiempos de la cortina negra. Ruta: **delegada** si toca 2+ archivos.
- [x] **T7** Hero: foto más grande (`max-width 310px` → mayor), reequilibrar grid. Archivo: `HomePage.astro`. Ruta: **inline** (1 archivo).
- [x] **T8** Mobile: implementar dirección responsive (tracks, modal bottom-sheet, ticks del header que hoy NO tienen media queries, cortinas, hero). Ruta: **delegada**.
- [x] **T9** Tests: actualizar `tests/final-sections.test.ts` a la arquitectura nueva (hoy falla: espera `BeltKnot`, `scrub:true`, `belt:black-progress` dispatch, etc.); correr `bun test` + `astro check` + `build`. Ruta: **delegada**.

## Registro de progreso

| Tarea | Commit | Estado | Notas |
|-------|--------|--------|-------|
| T1 | 7c6f49c | ✅ | 5 capítulos = cortina + track horizontal; teaser trilingüe; `data-nav-target` fracción (0.7 / negro 0.97); cortinas 240vh/110vh; `--h-section-h` con compresión mobile ×0.57 |
| T2 | 6da7fe2 | ✅ | `JobDetailModal.astro` nativo `<dialog>`; detail = `description` + `transferableCompetency`; Lenis stop/start + fallback overflow; bottom-sheet ≤767px |
| T3 | 189f40b | ✅ | Handler click → `lenis.scrollTo` al frame revelado; `anchors.offset` -80→0 (doble offset); realign de hash en load; `#contacto` p=0.55 |
| T4 | d5b0acb | ✅ | Lenis `duration 0.9`, `wheelMultiplier 1.5`; lerp deliberadamente ausente (duration+easing lo pisa) |
| T5 | 64c633c | ✅ | Lerp de slot normalizado a dt (`1-exp(-4.5*dt)`, clamps dt≤50ms); sway ±10°→±5° @0.35rad/s; breathing 0.01→0.005 |
| T6 | ba032b7 | ✅ | Dispatch `belt:black-progress` con `mix = min(1, radio/hypot)`; sin pelea con `belt:change` (mix=1 idéntico en el flip); flash rojo fade 0.3→0.39 (no se corta), glow 0.4→0.32 (sin beat muerto); guard de `getInitialColor` en zona negra. +51a647d fix de tipos `toBeNull` |
| T7 | 179c561 | ✅ | Grid hero 1.35fr/1fr → 1fr/1fr; foto `clamp(300px,30vw,470px)` (era 310); +tipos `toBeGreaterThanOrEqual` |
| T8 | 858edd9 | ✅ | Ticks compactados ≤767/≤640 con hit-area 44px (math 360px: 316≤328 ✓, sin fallback ≤400); QR min-height 44; modal bottom-sheet + safe-area + close 44; guard `max-height:700px` (cortinas −15%); T7 no filtra a mobile |
| T9 | 0d8ee25 | ✅ | 39 pass / 0 fail. 11 tests reconciliados (A/B/C/D/E); BeltKnot = remoción intencional en 054f0fd (no regresión, con evidencia git log -S); sin tests borrados |

## Forecast de entrega

Forecast conservador: 900–1500 changed lines (additions+deletions) → **supera 400**.
Estrategia de delivery: aún no solicitada; si el usuario pide push/PR, aplicar
`ask-on-risk` en ese momento (preguntar stacked-to-main vs feature-branch-chain).
Commits work-unit por tarea en `feat/immersive-journey` de todos modos.

## Hechos técnicos de referencia (mapa 2026-10-01)

- Cortinas hoy: 340vh desktop / 140vh mobile; negra 460vh / 240vh.
- `h-section` (amarillo/azul): altura inline `120 + n*105 vh` → **no overridable por media query**.
- Driver: rAF propio `frame()` en `MartialExperienceTimeline.astro:305-361`, NO ScrollTrigger.
- Ticks header sin ningún media query (Layout.astro:100-108).
- `resolveBeltKey`: negro entra recién cuando el círculo tapa las esquinas (radio 2000px).
- Belt3D: sway por reloj `sin(t*0.6)*10°` (Belt3D.astro:354); posición con lerp 0.08 (:334-340);
  listener `belt:black-progress` (:253-263) **sin dispatcher**.
- Lenis: duration 1.2, defaults de wheel (Layout.astro:306-314).
- Hero foto: `max-width: clamp(260px, 22vw, 310px)` (HomePage.astro:494).
