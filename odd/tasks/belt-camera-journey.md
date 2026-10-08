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

**Pivot de diseño (2026-10-08, tras validar T1/T2 en vivo):** T1/T2 demostraron que con una sola malla de cinturón/tatami compartida, moverla junto a la cámara no genera sensación de recorrido — solo la niebla cambia de color, nada queda "atrás". Decisión del usuario: construir un **entorno de dojo real** — una estación fija por cinturón (piso + cinturón propio, geometría editorial minimalista), todas coexistiendo en el espacio 3D a lo largo del eje Z, con la cámara recorriendo el pasillo entre estaciones. Esto reemplaza el enfoque de T2 de co-ubicar cinturón/tatami con la cámara (ver T8).

**Incluye:**
- Generalizar el sistema de cámara a N waypoints 3D reales, uno (o más) por capítulo de cinturón. *(T1, hecho)*
- Profundidad de escena (offset en Z por capítulo) + niebla (`fog` nativo de Three.js). *(T2, hecho — base reutilizable, el co-location se revisita en T8)*
- **Entorno de dojo con estaciones fijas por cinturón**: geometría de piso + marco/paredes minimalistas por estación, una instancia de tatami+cinturón por estación (no una malla compartida), estética editorial (líneas finas, paleta neutra, acento del color de cinturón) coherente con el resto del sitio. *(T7, nuevo)*
- Desacoplar cinturón/tatami de la cámara: cada estación queda fija en su Z; la cámara viaja por el pasillo y las estaciones anteriores quedan atrás (recesión real vía posición + niebla), no solo cambian de color. *(T8, nuevo)*
- Resolver la tensión `setViewOffset` vs. movimiento real: dentro de cada estación, reencuadre de columna para que el texto no se pise con el 3D; en el pasillo entre estaciones, viaje de cámara libre. *(T3/T9)*
- Capítulo cinturón negro: reducir el copy al mínimo imprescindible (coordinar qué contenido se corta/resume con el usuario antes de tocar `src/data/martialExperience.ts` u otros datos de contenido).
- Mantener gating existente (`prefers-reduced-motion`, `<1024px`, WebGL, data-saver) y el fallback mobile ("Ver en 3D" on-demand).
- Presupuesto de performance: con hasta 6 estaciones potencialmente en escena a la vez (aunque sea con culling/fog ocultando las lejanas), revisar drawcalls/triángulos — ya hubo un pase previo que bajó el cinturón de 168k a 44k triángulos; no reventar ese presupuesto multiplicando mallas sin culling.

**No incluye (fuera de alcance, explícitamente):**
- Rediseño de contenido/copy de los otros 5 capítulos (solo negro).
- Cambios a `TulHeader.astro` más allá de lo estrictamente necesario para convivir con el nuevo canvas.
- Mobiliario 3D detallado/realista tipo "museo de trofeos" — el dojo se mantiene minimalista/editorial (líneas, planos, tipografía), no es un diorama fotorrealista.

## Restricciones

- Performance real-GPU sin medir hasta ahora (solo swiftshader headless) — validar en dispositivo real antes de cerrar.
- El cálculo de stage-offset asume `top: 3rem` en el sticky — frágil a cambios de CSS, cuidar en T1/T2.
- Zoom y swing de la cámara baja (capítulo rojo) están afinados a ojo solo en 1440px — revisar si el nuevo sistema de waypoints lo hace obsoleto o hay que generalizarlo también.

## Checklist

- [x] **T1 — Generalizar waypoints de cámara.** Reemplazar las 3 constantes de target por una tabla de waypoints `{ beltKey, position, lookAt }[]`, uno por capítulo como mínimo. Generalizar `lerpCam()` para interpolar entre N waypoints según el progreso de scroll *global* de la página (no solo el progreso local por capítulo). Ruta: inline o delegado directo (archivo único `journey.ts` + ajustes en `scene.ts`).
- [x] **T2 — Profundidad de escena + niebla.** Dar a cada capítulo su propio offset en Z, agregar `fog` nativo de Three.js para profundidad visual entre capítulos. Verificar que el tatami/cinturón de cada capítulo no se solape visualmente con el del capítulo vecino.
- [ ] **T7 — Construir el entorno de dojo (geometría por estación).** Diseñar y construir, en `src/scripts/belt3d/`, una estación 3D por cinturón: piso (reusar/derivar de `tatami.ts`), marco/paredes minimalistas editoriales, cinturón propio de esa estación (instancia independiente, no la malla compartida actual). 6 estaciones mínimo, ubicadas en su Z correspondiente (reusar `beltDepth()` de T1). Mantener la estética ya establecida (industrial/editorial: líneas finas, paleta neutra + acento de color de cinturón, sin gradientes ni foto-realismo).
- [ ] **T8 — Desacoplar estaciones de la cámara y habilitar recesión real.** Revertir el co-location de T2 (`belt.group.position.z`/`tatami.group.position.z` ya no siguen a `cam.target.z`): cada estación queda fija en su lugar. La cámara recorre el pasillo entre estaciones (usando los waypoints de T1); la estación anterior queda atrás (se desvanece con la niebla de T2 + occlusion/culling si hace falta por performance) y la siguiente se revela adelante. Verificar que esto sí genere parallax/recesión visible (no solo cambio de color de niebla) — criterio de aceptación explícito más abajo.
- [ ] **T9 — Híbrido viaje real / reencuadre de texto por estación.** Dentro de cada estación (tramo "travel", con texto en pantalla), mantener el reencuadre `setViewOffset` para que el texto no se pise con el 3D. En el pasillo entre estaciones (tramo "passage"), cámara libre sin reencuadre forzado. Documentar cómo quedó resuelta la composición.
- [ ] **T10 — Cinturón negro: reducir texto al mínimo.** Coordinar con el usuario qué contenido del capítulo negro se recorta antes de editar `src/data/martialExperience.ts` (o el archivo de datos correspondiente al capítulo negro). Aplicar el recorte + ajustar el layout de esa sección para que funcione con mucho menos texto.
- [ ] **T11 — Verificación visual y de performance.** Recorrer las 6 estaciones en navegador real (Playwright/browser pane) en >=1024px, confirmar que la cámara viaja por un pasillo con estaciones visibles adelante/atrás (no solo cambia de color), confirmar fallback mobile/reduced-motion intacto, medir drawcalls/triángulos con hasta 6 estaciones en escena y aplicar culling si el presupuesto de performance se resiente.
- [ ] **T12 — Reconciliar la cámara "piso bajo" del capítulo rojo** (`tatamiLowFrame`) con el nuevo sistema de estaciones — ¿sigue siendo una estación especial dentro del pasillo, o se integra como cualquier otra?

## Criterios de aceptación

- La cámara interpola posición 3D real entre waypoints de capítulos consecutivos durante el scroll — no solo reencuadre `setViewOffset` de un target fijo.
- **Hay un entorno real recorrible**: al menos la estación actual y la anterior/siguiente son visibles simultáneamente en algún punto del recorrido (parallax/recesión verificable en captura, no solo cambio de color de niebla).
- Progresión visual blanco -> negro coherente y con estilo editorial constante (tipografía, paleta, espaciado ya establecidos en el redesign actual, sin regresiones).
- Cinturón negro con texto reducido al mínimo, aprobado por el usuario antes de mergear.
- `astro check`, tests existentes (83 Vitest + suite `tul-*` bun:test) y build pasan sin romper nada fuera de scope.
- Gating de accesibilidad/performance (reduced-motion, mobile, data-saver, WebGL ausente) se comporta igual que antes.
- Performance real-GPU validada con hasta 6 estaciones potencialmente en escena (no solo swiftshader headless).

## Progreso

- 2026-10-08: Feature document creado tras exploración previa (mapeo de `scene.ts`/`journey.ts`/`tul.ts` completado en la conversación). Branch `feat/belt-camera-journey` creada off `master` (post-merge de tul-redesign + tests/CI/SEO + CodeQL). Próximo paso: T1.
- 2026-10-08: T1 y T2 implementados (`src/scripts/belt3d/journey.ts`, `src/scripts/belt3d/scene.ts`).
  - **T1**: `beltDepth(belt)` mapea cada uno de los 6 cinturones (`BELT_KEYS` de `colors.ts`, ya en orden blanco→negro) a su propio waypoint de profundidad en Z (-1.1 m por capítulo). `travelCam()` ahora toma el `belt` activo y ubica el target (y por lo tanto la cámara, vía la matemática esférica existente de `Cam`) en ese Z. `passageFrame()` (el tramo "entre capítulos") interpola el target.z en tiempo real entre `beltDepth(from)` y `beltDepth(to)` según `p`: es un dolly 3D real, no solo un reencuadre. `lerpCam()` se exportó (ya generalizaba N estados, solo era privada). Se optó por *no* agregar un `--global-p` nuevo en `tul.ts`: el progreso ya existente por beat (`pickBeat` + `from`/`to` de cada passage) alcanza exactamente para interpolar entre los dos waypoints que corresponden al tramo activo, así que se reusó en vez de sumar un ScrollTrigger global adicional.
  - **T2**: `createView()` agrega `scene.fog = new Fog(...)`; `applyFrame()` actualiza color (claro→oscuro, según `f.rim`, sincronizado con el flip de campo que ya hace `tul.ts`) y near/far (relativos a `cam.dist`) cada frame. Dado que solo existe una malla de cinturón y una de tatami compartidas (nunca dos capítulos dibujados a la vez — ver `tatamiView()`), no hay geometría vecina que se solape: se decidió co-ubicar `belt.group.position.z` y `tatami.group.position.z` con `cam.target[2]` en cada frame, para que ambas mallas viajen realmente por Z junto con la cámara entre waypoints (en vez de quedar ancladas al origen mientras la cámara solo rota). Decisión documentada en el commit y en el reporte al orquestador.
  - Híbrido T3 (no roto, no implementado todavía): `travelFrame()` (dentro de un capítulo, con texto en pantalla) sigue devolviendo un `Cam` que pasa por `aim()` → `setViewOffset` sin cambios de comportamiento; solo cambia el Z de su `target`. `passageFrame()` es el único lugar donde el Z se anima de forma continua. Ambos siguen componiendo con el reencuadre de columna existente.
  - Verificación: `bun run check` 0 errores; `bun run build` OK; `bun run test` (vitest) 83/83; `bun test tests/tul-belt3d.test.ts tests/tul-hero.test.ts` 63/63. Verificación visual con el Browser pane en 1536x960 (dev server propio en :4325 para no interferir con el :4321 de otra sesión/worktree): recorridas las 6 etapas (blanco→amarillo→verde→azul→rojo→negro), sin errores de consola, cámara baja del cinturón rojo (`tatamiLowFrame`) intacta, flip de campo oscuro + rim light del cinturón negro intacto. Gating de accesibilidad (`eligible.ts`) y el modo táctil (`setTapMode`) no se tocaron — verificado por lectura de código, no probado en vivo (sin forma de emular `prefers-reduced-motion` en el Browser pane).
