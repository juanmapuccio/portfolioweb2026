# Storyboard inmersivo: desktop y mobile (rediseño ink)

> Rama `feat/ink-redesign`. Fuente de piezas: `design/Franjas Pincel.dc.html` (139 especímenes, A–N), analizadas por valor cinematográfico, plataforma, modo y costo. Este documento se aprueba sección por sección **antes** de escribir código.

## 0. Stack

| Capa | Elección | Estado |
|---|---|---|
| Framework | Astro 7, componentes `.astro` | instalado |
| Scroll suave | Lenis 1.3 (solo en `src/scripts/ink.ts`) | instalado |
| Scroll-driven | GSAP 3.15 ScrollTrigger: pin + `--p` por escena (`[data-ink-scene]`) | instalado |
| Texto | GSAP SplitText (incluido en 3.15) para letras (10h) y posibles titulares | disponible |
| Enter-driven | IntersectionObserver de `ink.ts` + primitivas de `src/styles/ink/ink.css` | hecho (F2) |
| 3D | three.js 0.186 para Belt3D (F5) | instalado |
| Texturas | PNG/WebP pre-renderizados (washi, aguada, hanko, humo) | por hacer |
| Descartado | Tailwind, Framer/Motion, view transitions entre páginas, cursor con filtro (9i), 11o, 11q | — |

**Modos de animación**
- **Scrub (`--p`)**: la sección se pinea y el progreso 0→1 maneja la pieza. Solo piezas monótonas: 10a, 10o, 6b, 2d, 7c, 1c, 10z.
- **Enter**: una pasada al entrar (`data-ink` + `.is-in`).
- **Interactivo**: hover/tap/hold (11b, 9e, 10y, 11m).

## 1. Esqueleto

```
 0 LOADER ─▶ 1 HERO ─▶ 2 CINTURONES (6 capítulos) ─▶ 3 FRICCIÓN→CÓDIGO
   ─▶ 4 PROYECTOS ─▶ 5 STACK ─▶ 6 FUERA DEL CÓDIGO ─▶ 7 CONTACTO / CIERRE
 Persistentes: header (progreso por cinturón 1g/7b · nav con pincelada 11j desktop · idioma 11m+11t)
               CTA fijo "Contactar" (mobile, se oculta en 7)
```

Un solo árbol HTML responsive. Lo que cambia entre desktop y mobile es el layout (CSS) y qué escenas se pinean, no el contenido.

---

## S0. Loader y header

**Desktop**
```
┌────────────────────────────────────────────┐
│                                            │
│                 ◯  ensō 11c                │   el trazo avanza con la carga real
│                    67                       │   (fonts.ready + GLB si aplica)
│                                            │
│ JUAN MANUEL PUCCIO               CARGANDO  │
└────────────────────────────────────────────┘
   al 100% ─▶ el panel sube como telón (translateY -100%, 0.75s)
┌─ J. M. Puccio ●   · cimientos · calle · estado · … ·   ES EN PT ─┐
└────────────── progreso 1g (color del cinturón activo) ──────────┘
```

**Mobile**
```
┌──────────────┐
│      ●       │  11g: gota cae (1.3s)
│      │       │
│   ( onda )   │  onda elíptica
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  la tinta sube y cubre ─▶ telón
└──────────────┘
 header: nombre ● · ES EN PT · línea de progreso 7b
```
- Componentes: `InkLoaderEnso` (hecho), `InkLoaderDrop` (hecho), `InkNavStroke` (hecho), `InkLangStamp` (hecho) + sprite 11t (nuevo asset).
- Reduced motion: sin loader; header estático.

## S1. Hero (página de manga, 5a)

Decisión 2026-10-03: el hero es una página de manga (catálogo 5a, `design/Franjas Pincel.dc.html`). Sin glifos ni sellos asiáticos en toda la landing. Sin pull-back 10a, sin zoom/destello 10l. Rediseño koma-wari (misma fecha, tras feedback "no parece manga"): ver `docs/research-manga-hero.md`.

**Desktop** (>= 768, pin 300svh, salida con `--p`)
```
┌ marco de página negro 3px, papel entre viñetas (gutters 14px) ─┐
│ ╔══════════════════════════╗╲  ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲  ¡PUM!      │
│ ║ JUAN MANUEL PUCCIO       ║ ╲╱   ╱  focus lines  ╲  (SFX)     │
│ ║ (título, 800, mayúsc.,   ║  ╲  ╱  (shūchūsen)    ╲            │
│ ║  -2deg + speed lines →)  ║   ╲╱  ┌ retrato tinta ┐            │
│ ╚══════════════════════════╝╲  ╱   │ (PNG alfa)    │ rompe el   │
│ ┌ caption ─────────┐╲ ▓▓▓▓▓▓▓▓▓▓▓▓ │ cruza borde   │ marco      │
│ │ tagline (i18n)   │ ╲▓ ( rol · fig )▓ superior     │ y gutter   │
│ └──────────────────┘  ╲▓▓ globo + cola ▓            │            │
│ ↓ cue (9j)            ╲ viñeta negra (spot black)  └─────────────┘│
└─────────────────────────────────────────────────────────────────┘
```
- Viñetas irregulares: cada `data-panel` tiene un `clip-path: polygon()` propio (bordes inclinados, `--tilt` 26px desktop, 12px mobile). El marco negro es un `::before` con el polígono y un `::after` de papel con el mismo polígono inset `--b`, así el borde sigue el corte. Grosores distintos: nombre 6px, retrato 5px, rol 4px, tagline/cue 3px.
- Una figura rompe el marco: el retrato es un PNG de tinta con alfa (`src/assets/fotojmPerfil-ink.png`, generado por `scripts/make-ink-portrait.mjs`: gris + normalise + curva dura, luminancia a alfa) dentro de `.hero__cutout`, que desborda la viñeta (-3% arriba, -12% a la izquierda), por encima del marco. Sin trama de puntos sobre la foto, sin `filter` en runtime.
- Focus lines (shūchūsen) detrás del retrato y speed lines en el panel del nombre: `repeating-conic-gradient` estáticos con máscara radial/lineal (centro limpio). Nunca animadas.
- Caption de narración (tagline): caja rectangular, borde negro 3px, sombra dura 5px, sobre viñeta rayada. Globo de diálogo (rol + fig) con cola, sobre una viñeta negra con hatching claro. SFX en letras latinas (`hero.sfx`: ¡PUM! / BAM! / POW!), contorneado, `aria-hidden`.
- Aparición CON EL SCROLL (no hay cascada temporal): cada viñeta tiene su ventana de `--p`; opacity + translateY 32px + scale .98 -> 1, lineal, sin rebote. Nombre y cue completos en p=0; tagline .04-.26, retrato .10-.40, rol .30-.55.
- Salida (--p .65 -> 1): la página deriva hacia arriba (-6svh) y se desvanece mientras una aguada suave de papel sube. Solo transform y opacity.

**Mobile** (< 768, pin 250svh)
```
┌ marco negro ─────┐
│ ▛ NOMBRE ▜       │  mismas viñetas apiladas, cada una con
│ ▙ caption ▟      │  corte inclinado arriba/abajo (--tilt 12px),
│  retrato + focus │  bordes de distinto grosor, focus lines,
│  ¡PUM! (rompe)   │  retrato que cruza el borde superior,
│ ( globo rol )    │  stage sticky de 100svh, solo svh.
│ ↓ cue            │
└──────────────────┘
```
- Reduced motion / sin JS: viñetas visibles y estáticas, sin pin ni salida; la forma manga (clip-path, marcos, líneas, caption, globo) es CSS estático y se mantiene.
- Componentes: `HeroSection` (paneles `data-panel`), `InkScrollDrop` (9j). Ya no usa `InkGlyphTitle` ni `InkDrip`.

## S2. Cinturones (capítulo central)

**Desktop** (pin ≈ 600vh, scroll horizontal)
```
 ┌ tinta horizontal 10o: pinta un nudo por cinturón ─────────────────────────┐
 │ ●━━━━━━●━━━━━━●━━━━━━○┄┄┄┄┄┄○┄┄┄┄┄┄○                                        │
 └───────────────────────────────────────────────────────────────────────────┘
 [ CAP.01 BLANCO ] ─6b─▶ [ CAP.02 AMARILLO ] ─6b─▶ … ─6d ensō─▶ [ 1º DAN ]
  10d tarjeta de capítulo                                      floración de tinta suave
  título 1a (subrayado)                                         (sin glifo, sin destello)
  dato breve + años                                             sello de iniciales JMP
```
- Cada tramo de `--p` ≈ 1/6. 6b (pincelada seca) hace el cambio de color en el punto medio del tramo.

**Mobile** (scrub, sin pin horizontal)
```
┌──────────────┐
│▔▔ blanco ▔▔▔▔│ ← canto visible
│▔▔ amarillo ▔▔│
│┌────────────┐│ 7c tarjetas sticky que se apilan
││ VERDE      ││
││ El Estado  ││
│└────────────┘│
│   ┃ ╱ bambú  │ 2d crece por nudos (raster washi detrás)
└──────────────┘
 1 goteo 7e por cambio de cinturón, nunca dos seguidos
```
- Componentes nuevos: `BeltRail` (10o), `ChapterCard` (10d), `BrushWipe` (6b), `EnsoFill` (6d), `InkBloom` (6e, floración de tinta sin texto), `StickyBelts` (7c), `BambooGrow` (2d).

## S3. Fricción → código

```
desktop y mobile (pin 120vh, scrub)
  PDF   IVA 21%      EXPEDIENTE        p 0→0.6: las palabras convergen al centro (7j)
     FACTURA   CAJA       STOCK
                 ⟶  De horas ─────────  p 0.6→1: tajo horizontal 10i
                    a segundos.
 salida: 10m ráfaga de barras con los colores de cinturón
```

## S4. Proyectos

**Desktop**
```
 5d: tinta negra inunda ─▶ emergen las fichas
 ┌──────── pergamino 3b ────────┐   ┌──────────────────────────────┐
 │ MISIÓN 01 · NodoSur           │   │ caso estrella: 3g versus     │
 │ fricción · impacto            │   │ PROBLEMA ⟋ SOLUCIÓN          │
 │ [EN PRODUCCIÓN] 5e    ver ↗ 9e│   └──────────────────────────────┘
 └───────────────────────────────┘
```

**Mobile**
```
┌──────────────┐
│ ┌──────────┐┌│ 7d carrusel con scroll-snap (asoma 30px)
│ │ NodoSur  ││
│ │ [EN PROD]││ 3b al entrar, 5e sello
│ └──────────┘└│
│   ● ○ ○ ○    │
└──────────────┘
```
- Salida: 1c franja guiada por `--p`.

## S5. Stack

```
desktop: 10r cinco pergaminos que bajan (enter, stagger)
 ┃Front┃ ┃Back ┃ ┃Cloud┃ ┃Campo┃ ┃Certs┃
mobile: los mismos rollos apilados en una columna (o 10u rueda si hay poco alto)
 salida: 10n rollo colgante (marca latina "06" en vez de glifo)
```

## S6. Fuera del código

```
 1b título con subrayado y sello
 2g cinco sellos de tinta que se estampan, con el NOMBRE del principio en el idioma de la página
    (Cortesía, Integridad, Perseverancia, Autocontrol, Espíritu indomable; sin hangul; bordes raster 8i)
 1b título con sello de iniciales JMP
 desktop: fila de 5 · mobile: grilla 3+2
 salida: 6g katana revela el cierre
```

## S7. Contacto y cierre

**Desktop**
```
┌──────────────────────────────────────────┐
│ RESULTADO 10v                     [1º DAN]│
│ 04 sistemas en producción · +10 años ITF  │
│ ─ canales 10w: email · whatsapp · in · gh │
│ [ CONVERSAR ]  ← aura 11b en hover        │
│ ── créditos 10z suben con el scroll ──    │
│ Fin del capítulo. Hablemos.               │
└──────────────────────────────────────────┘
```

**Mobile**
```
┌──────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ 7k la tinta sube con borde irregular (path estático)
│ Busco sumarme│
│ a un equipo… │
│ [CANALES ▲]  │ 7h bottom sheet
│ [mantener ●] │ 10y mantener para enviar
└──────────────┘
```

---

## 2. Transiciones entre secciones

| De → a | Desktop | Mobile | Modo |
|---|---|---|---|
| Loader → hero | telón | telón | enter |
| Hero → Cinturones | deriva + desvanecido de viñetas, aguada suave sube | igual (sin goteo) | scrub corto |
| Cinturón → cinturón | 6b pincelada seca | 7e goteo | scrub / enter |
| Rojo → Negro | 6d ensō + floración de tinta (sin glifo) | 6d | scrub + enter |
| Cinturones → Fricción | 10m barras de cinturón | 10m | enter |
| Fricción → Proyectos | 5d nacer del negro | 5d | scrub |
| Proyectos → Stack | 1c franja `--p` | 1c | scrub |
| Stack → Principios | 10n rollo colgante | 10n | scrub |
| Principios → Contacto | 6g katana | 7k telón | scrub |

## 3. Presupuesto de rendimiento

- Máximo **1–2 filtros SVG por viewport**, siempre sobre elementos estáticos. Nunca `dashoffset` ni `r` animado bajo filtro: usar `clip-path` (como en 1a, 1b, 11j).
- Mobile: solo `transform`, `opacity`, `clip-path`, `stroke-dashoffset` sin filtro.
- Rasterizar (WebP, @1x y @2x):
  - `washi` (2a): tile 512×512.
  - Aguada (2f, 8d): 3 capas a 1920×1080, una por tono.
  - Bordes hanko (8i): 5 PNG de 128×128 con alpha.
  - Humo 11t: sprite de 6 frames 360×60 (@2x 720×120).
- Validación por sección: DevTools Performance con CPU 4× y viewport 393×852.

## 4. Accesibilidad

- `prefers-reduced-motion`: sin loader, sin pin horizontal (cinturones en columna), cortes secos y fade de 200 ms; 3c sin parpadeo.
- El texto nunca depende de la animación para leerse; sin JS todo queda visible.

## 5. Sub-fases de implementación (F4)

| Sub-fase | Contenido | Componentes nuevos |
|---|---|---|
| S0 | Loader + header persistente | sprite 11t, `InkHeader` |
| S1 | Hero | `HeroPullback`, `WashLayers`, `MobileHeroBrush` |
| S2 | Cinturones | `BeltRail`, `ChapterCard`, `BrushWipe`, `EnsoFill`, `DanHit`, `StickyBelts`, `BambooGrow` |
| S3 | Fricción → código | `ConvergeWords` (7j + 10i) |
| S4 | Proyectos | `ScrollCard` (3b + 5e), `VersusPanel` (3g), `InkFlood` (5d) |
| S5 | Stack | `TechScrolls` (10r) |
| S6 | Principios | `HankoRow` (2g) |
| S7 | Contacto | `ResultScreen` (10v), `ChannelScroll` (10w), `EndCredits` (10z), `InkCurtain` (7k), `ChannelSheet` (7h), `HoldToSend` (10y) |

Cada sub-fase: `/lab` primero, revisión del usuario, después a la página; un commit por sub-fase.
