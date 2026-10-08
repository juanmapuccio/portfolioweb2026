# Feature: scroll-engine-consolidation

**Branch:** `feat/scroll-engine-consolidation` (stacked sobre `feat/immersive-journey`)
**Creado:** 2026-10-02
**TDD:** activo (`bun test`, string-assertion tests). **RDD:** global off.
**Aprobado por el usuario:** "ok, seguir recomendación" → Lenis se queda; el motor custom
muere; ScrollTrigger pasa a ser el único motor de scroll; Belt3D deja de tener rAF propio.

## Objetivo

Consolidar los cuatro loops de scroll de la landing en UNO solo (gsap.ticker → Lenis +
ScrollTrigger), eliminar el motor rAF custom del timeline y el rAF permanente de Belt3D,
y romper los contratos frágiles entre componentes (consultas globales, eventos huérfanos,
constantes duplicadas) mediante un módulo registry único y explícito.

## Diagnóstico (verificado 2026-10-02)

Hoy conviven cuatro loops:
1. **Lenis** en `gsap.ticker` (`Layout.astro:433`) — correcto, se queda.
2. **ScrollTrigger** — solo lo usa el manifesto (`ManifestoScrollytelling.astro:55`).
3. **rAF custom del timeline** (`MartialExperienceTimeline.astro:272-369`) — on-demand
   (scroll/resize/load → 1 rAF), calcula `--p` para TODOS los `[data-fx]` del documento
   (incluidos los de Projects y Contact, que no saben que el timeline los maneja),
   resuelve zonas por centro de viewport, despacha `belt:change` + `belt:black-progress`.
4. **rAF propio de Belt3D** (`Belt3D.astro:365-388`) — SIEMPRE on, renderiza WebGL aunque
   el cinturón esté opacity 0; re-querya `[data-zone]` global cada frame (:316) y lee el
   `--p` inline que escribe el loop #3 (acoplamiento cruzado por DOM sin contrato tipado).

Fragilidades consecuencia de esta arquitectura:
- `belt:black-progress` estuvo muerto semanas (listener sin dispatcher) — mismo class de
  bug puede repetirse porque el dispatcher vive en otro componente que el listener.
- `BLACK_CIRCLE_MAX_RADIUS = 2000` (JS :261) duplica la matemática del CSS
  (`.black-expanding-circle` 10px × scale 400) — dos fuentes de verdad.
- Projects/Contact/Hero son manejados por un script ajeno (silent dependency).
- Perf medido OK (p50/p99 4.2/4.3ms @240Hz) — el problema NO es rendimiento, es
  fragilidad y costo de cada feature futura.

## Decisiones de arquitectura (fijadas)

1. **Módulo único `src/scripts/journey.ts`** dueña del motor:
   - `registerFx(el, opts?)` → crea un ScrollTrigger por nodo: `start: 'top top'`,
     `end: 'bottom bottom'`, `onUpdate: self => escribe --p` (dirty-check interno) y,
     si el nodo tiene `[data-track]`, el transform X (`shift = -p * max(0, scrollWidth - W)`,
     scrollWidth cacheado, invalidado en refresh). `opts.onProgress(p)` permite suscripción
     JS (manifesto) sin crear un segundo trigger.
   - `registerZone(el)` → ScrollTrigger `start: 'top center'`, `end: 'bottom center'`,
     `onEnter`/`onEnterBack` → resuelve beltKey (con la lógica del círculo negro),
     escribe `document.documentElement.dataset.activeBeltColor`, despacha `belt:change`
     (dedupe por key) y, mientras la zona negra es activa, `belt:black-progress`
     (payload idéntico al actual: `{progress, mix, from, to}`).
   - Constantes `CHAPTER_KEYS`/`CHAPTER_COLORS` viven SOLO aquí.
   - Radio máximo del círculo negro: fuente única = custom property CSS
     `--black-circle-max-radius: 2000` (unitless) en `global.css`; el CSS del círculo la
     consume (`scale(calc(clamp(...) * var(--black-circle-max-radius) / 5))`) y el JS la
     lee UNA vez por refresh vía `getComputedStyle`.
   - Reduced motion: `registerFx` fija `--p: 1` en nodos no-h (igual que hoy); los h y las
     zonas mantienen scrub.
   - `document.fonts.ready.then(() => ScrollTrigger.refresh())` dentro del módulo.
2. **Cada componente registra LO SUYO** (elimina silent dependencies):
   - Timeline: sus 6 cortinas + 2 h-sections + black curtain (fx) y sus zonas.
   - Projects: su `[data-fx="h"]` + zona `h` + 2 zonas `dark`.
   - Contact: su `[data-fx="c"]` + zona `curtain`.
   - Skills: zona `dark`. Hero: zona `hero`.
   - Manifesto: pasa a `registerFx(section, { onProgress })` y BORRA su import directo de
     ScrollTrigger (una dependencia menos en el bundle de ese componente).
3. **Belt3D**: elimina su rAF propio → `gsap.ticker.add(cb)` (mismo loop que Lenis;
   deltaTime del ticker para el lerp dt-normalizado existente). **Gate de render**:
   si `curSlot.o < 0.01` y no hay slot visible → `updateBeltPosition()` igual corre
   (matemática barata) pero `renderer.render()` se saltea. Zonas cacheadas al init
   (ya no re-query global por frame); el color lo sigue dando `belt:change` /
   `belt:black-progress` (ahora garantizados por un solo dispatcher).
4. **Lenis**: `allowNestedScroll: true` → fuera (chequea DOM tree cada scroll event).
   `data-lenis-prevent` explícito en los 2 scrollers anidados reales
   (`ProjectsSection` card overflow-y, `ArchitectureDiagram` overflow-x).
5. **Layout**: `updateHeaderProgress` sigue como está (coalesced, barato). El handler de
   ticks del header (T3 de immersive-journey) NO cambia — consume `data-nav-target`,
   que sigue existiendo.

## Política de transiciones y animaciones (respuesta a la pregunta del usuario)

- **Entre páginas (es↔en↔pt):** View Transitions nativas (MPA, cero JS) — candidato futuro,
  NO en esta feature. Si algún día se necesita estado compartido entre páginas, `<ClientRouter />`
  y entonces TODO módulo de scroll debe re-inicializarse en `astro:page-load` y destruirse en
  `astro:before-preparation` (los bundled scripts no re-ejecutan). Journey.ts debe diseñarse
  idempotente (guard de registro por elemento) para hacer eso trivial.
- **Scroll-linked (beats, cortinas, tracks, tint 3D):** journey.ts registry (esta feature).
- **Discretas (drag del 3D, elastic return, modal fade):** GSAP tweens sobre el ticker.
- **Estado/hover/focus:** CSS puro.
- **Reduced motion:** el registry lo respeta; Belt3D ya se desactiva; manifesto queda legible.

## Alcance

### En scope
- T1–T6 abajo.
### Fuera de scope
- ClientRouter / view transitions entre páginas.
- Cambios visuales (el resultado debe ser pixel-idéntico en scroll; cualquier diferencia es bug).
- Cambios de copy/idiomas.
- ScrollSmoother (no se adopta; Lenis queda).

## Criterios de aceptación

- `bun test` verde (0 fail), `npx astro check` 0 errores, `npm run build` OK.
- Un ÚNICO rAF conduce todo el motion scroll-linked (gsap.ticker). Greps de control:
  - `requestAnimationFrame(` en `src/` solo aparece en Layout (header progress + hash align)
    y en el propio ticker de GSAP (vendor). Timeline y Belt3D: cero.
  - `new Lenis` / `ScrollTrigger.create` / `registerPlugin` solo en Layout + journey.ts.
- Ningún componente importa ScrollTrigger directamente (solo `journey.ts`).
- `belt:black-progress` tiene un solo dispatcher (journey.ts) y el listener de Belt3D lo consume.
- El radius del círculo negro tiene una sola fuente (`--black-circle-max-radius`).
- Belt3D no llama `renderer.render()` cuando el cinturón está opacity < 0.01.
- Comportamiento observable idéntico: cortinas/track/tint/nav ticks/modal — el usuario valida
  en navegador al final.

## Tareas

- [x] **T1** Crear `src/scripts/journey.ts` (registry completo + belt resolution + eventos +
      fonts refresh + reduced motion + idempotencia) con sus tests string-assertion.
      No se cablea todavía ningún componente. Ruta: **delegada**.
- [x] **T2** Timeline migra al registry: borrar el script rAF completo (:230-377), registrar
      sus fx/zonas vía journey.ts. `data-nav-target` intacto. Ruta: **delegada**.
- [x] **T3** Projects + Contact + Skills + Hero + Manifesto migran al registry (cada uno
      registra lo suyo; manifesto pierde su import de ScrollTrigger). Ruta: **delegada**.
- [x] **T4** Belt3D: rAF propio → `gsap.ticker.add`, gate de render por opacity/slot,
      zonas cacheadas, consumir radio desde la custom property. Ruta: **delegada**.
- [x] **T5** Lenis hygiene: fuera `allowNestedScroll`, `data-lenis-prevent` en los 2
      scrollers reales; `--black-circle-max-radius` a `global.css` + CSS del círculo lo
      consume. Ruta: **inline** (mecánico, 3-4 archivos chicos) — la parte del CSS es
      la que fija la fuente única del radio.
- [x] **T6** Tests: reconcilar/actualizar suite + greps de control del §criterios +
      `bun test`/`check`/`build` + evidencia en el doc. Ruta: **inline** (verificación).

### Orden y dependencias
T1 → T2 → T3 → T4 → T5 → T6. T5 toca el CSS del círculo que T4/T1 asumen; si T5 se hace
último antes de T6, T1/T4 leen la constant con fallback (2000) mientras no exista la
custom property — el writer de T1 debe implementar ese fallback y documentarlo.
(Ejecutado: T5 cayó al final; journey.ts ya leía la property con fallback.)

## Registro de progreso

| Tarea | Commit | Estado | Notas |
|-------|--------|--------|-------|
| T1 | b222a15 | ✅ | `journey.ts` (394 líneas): registerFx/registerZone, WeakSet idempotencia, dirty-check --p, track transform, reduced-motion freeze, dedupe belt:change, black-progress con hypot mix, radio desde CSS con fallback 2000, fonts refresh, kick() diferido. Deviación justa: p del black zone usa fórmula de cortina (spec se contradecía; preserva mix=1 en el flip) |
| T2 | 541eeb6 | ✅ | 148 líneas de rAF borradas del timeline; registro scoped al container. Cero gaps en journey. Nota: orden de dispatch en flip frames (scrub→change vs change→scrub) — invariante por dedupe, 1 frame sub-perceptible |
| T3 | 88bb14e | ✅ | Projects (por nodo, sin root único), Contact (fx+zone mismo nodo), Skills, Hero (script nuevo mínimo), Manifesto → registerFx con `start/end` aditivo (nueva API opcional, defaults intactos); manifesto sin imports de gsap/ST; belt:change vuelve a disparar al load |
| T4 | f677a9d | ✅ | Belt3D → gsap.ticker (deltaTime→dt clamp 50ms), render gate `curSlot===null || o<0.01`, zonas cacheadas al init, onVis solo rebase de t0; T5-tests de sway intactos |
| T5 | 30d1a48 | ✅ | Inline. `prevent` condicional por callback (NO data-lenis-prevent plano: evitaba zona-muerta sin smoothing en desktop) sobre `[data-nested-scroll]` (card projects + pipeline); `--black-circle-max-radius: 2000` en global.css; círculo lo consume (`/5`); journey ya lo leía |
| T6 | — | ✅ | Inline. Suite **65 pass / 0 fail**; `astro check` 0 errores; build OK. Grep de control: rAF solo en Layout (progress bar + hash align, no loops); `new Lenis`/`ScrollTrigger.create`/`registerPlugin` solo en Layout+journey; dispatcher único de belt:black-progress |

## Nuances de comportamiento conocidas (aceptadas, post-migración)

1. **Manifesto perdía `scrub:true`** (sub-frame smoothing de GSAP): ahora el progreso lo
   da `onUpdate` de ScrollTrigger alimentado por Lenis. Diferencia ≤1 frame durante fling;
   en reposo, idéntico. Mismo contrato que los demás beats.
2. **Deep-load en mobile a mitad del manifesto**: el pass inicial usa la fórmula de
   cortina; hasta el primer scroll event no se aplica el rango custom. El código viejo
   compartía esta clase de edge (tween de scrub arrancaba en 0).
3. **Orden de dispatch en frames de flip negro**: journey despacha `black-progress` antes
   que `belt:change` (el engine viejo al revés). Inofensivo: mix=1 exacto en el flip y el
   dedupe hace que change dispare una sola vez; la ventana de discrepancia es 1 frame.

## Forecast de entrega

~600–900 changed lines → supera 400. Delivery no solicitada; si el usuario pide push/PR,
`ask-on-risk` (preguntar chain strategy). Precedente en memoria: el usuario eligió
stacked-to-main para la reorg anterior.

## Referencias técnicas

- Motor actual a reemplazar: `MartialExperienceTimeline.astro:230-377`.
- Belt3D loop: `Belt3D.astro:292-388` (frame, updateBeltPosition, lerp SMOOTH_RATE 4.5).
- Lenis wiring: `Layout.astro:406-435`.
- Manifesto ST: `ManifestoScrollytelling.astro:39-76`.
- Zonas: hero (HomePage:30), curtains+h+black (timeline:95,123,174), projects
  (ProjectsSection:19,111,150), contact (ContactSection:22), skills (SkillsPhilosophySection:24).
- Docs oficiales usados: Lenis README (gsap ScrollTrigger recipe, allowNestedScroll perf
  warning, data-lenis-prevent, respectReducedMotion), GSAP ScrollSmoother docs
  (por qué NO: wrapper/content + fixed afuera), Astro view-transitions docs
  (script re-ejecución, astro:page-load, MPA nativo).
