# Feature: dark-tail-polish

**Branch:** `feat/scroll-engine-consolidation` (continúa sobre la consolidación)
**Creado:** 2026-10-02
**TDD:** activo (`bun test`). **RDD:** off.
**Origen:** browser pass del usuario tras scroll-engine-consolidation.

## Feedback del usuario

1. "A partir de la sección de cinturón negro pierde smoothness el scroll."
2. "La transición entre la parte de dimensión humana y ética operativa y contacto es muy básica."

## Diagnóstico (verificado 2026-10-02)

1. **Regresión T5 confirmada:** el callback `prevent` de Lenis (`Layout.astro:427-436`)
   es axis-blind: `.pipeline-track` (ArchitectureDiagram) tiene `overflow-x:auto` SIEMPRE,
   con contenido más ancho que el contenedor → `scrollWidth > clientWidth` true a todo
   ancho → toda rueda sobre la sección de arquitectura se vuelve scroll NATIVO sin
   smoothing. Está justo después de negro → coincide con la queja.
   Además Skills/Philosophy no tiene ningún `data-fx` (solo `data-zone="dark"`) → cero
   motion scrubbeable: el tail se siente "muerto" comparado con el journey.
2. **Skills → Contacto:** el contacto entra con el reveal de cortina (opacity por `--p`),
   sin transición propia entre la sección dark de skills y el footer de contacto.

## Decisiones de diseño (prouestas del orquestador, ajustables en revisión)

1. **Fix axis-aware:** reemplazar `prevent` por `virtualScroll` en Lenis: el gesto solo
   se entrega al scroller anidado cuando SU eje coincide con un overflow real del
   elemento (rueda vertical sobre un contenedor solo-horizontal → la página sigue
   smooth). Mantiene el scroll horizontal con touchpad/shift+wheel sobre el pipeline.
2. **Skills entra al journey:** `data-fx="c"` en la sección + `registerFx`; reveals
   staggered por `--p` (opacity + translateY) usando la fórmula `clamp(0, calc((var(--p)-T)*K), 1)`
   ya establecida: categorías de skills, manifiestos de filosofía (human dimension +
   ética operativa) y grilla de principios TKD. Reduced-motion queda cubierto por el
   freeze de journey (`--p:1`).
3. **Transición Skills → Contacto:** un beat corto heredando el motivo del cinturón
   negro (línea dorada + glow que barren con `--p` al final de skills / entrada de
   contacto), no un simple fade. Sutil: una línea que se expande + glow que sube.

## Alcance

- En scope: `Layout.astro` (Lenis virtualScroll), `SkillsPhilosophySection.astro`
  (fx + reveals), `ContactSection.astro` (beat de transición), tests.
- Fuera de scope: cambiar copy, alterar el journey blanco→negro, cambio de alturas.

## Criterios de aceptación

- `bun test` 0 fail, `astro check` 0, `build` OK.
- Rueda vertical sobre la sección de arquitectura recupera smoothing de Lenis;
  el drag horizontal del pipeline y la rueda vertical de la card de proyecto en mobile
  siguen nativos (el scroller real funciona).
- Skills muestra reveals scrubbed por `--p` (categorías, filosofía, principios).
- El usuario valida feel en navegador al final.

## Tareas

- [x] **D1** Fix Lenis nested: `prevent` → `virtualScroll` axis-aware + actualización
      del test T5. Ruta: **inline** (Layout + tests).
- [x] **D2** Skills al journey (registerFx + reveals staggered CSS) + beat de transición
      Skills→Contacto. Ruta: **delegada**.
- [x] **D3** Verificación final: suite, greps, doc, memoria. Ruta: **inline**.

## Registro de progreso

| Tarea | Commit | Estado | Notas |
|-------|--------|--------|-------|
| D1 | 7dcc40c | ✅ | `virtualScroll ({deltaX, deltaY, event})`: el gesto solo se entrega al scroller anidado si SU eje coincide con un overflow real. Rueda vertical sobre pipeline-track (overflow-x-only) recupera smoothing; shift/touchpad horizontal sigue nativo; card projects mobile intacto. Suite 65/0 |
| D2 | 56b0749 | ✅ | Skills: `data-fx="c"` + registerFx; reveals staggered por --p (categorías 0.04→0.48, filosofía 0.50→0.81, principios 0.70→0.95), hover-safe vía propiedades `translate`/`scale` independientes; Contacto: barrido dorado (beam existente, T=0.02) → glow rise (T=0.2) → wrapper re-timed 0.15→0.2; todos los T+1/K ≤ 1 (reduced-motion visible); mobile sin retune (--p normalizado). Suite 69/0 |
| D3 | — | ✅ | 69 pass / 0 fail, check 0, build OK; sin cambios fuera de whitelist; docs + memoria |
