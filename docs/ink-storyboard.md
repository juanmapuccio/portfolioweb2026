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

## S1. Hero

**Desktop** (pin 150vh, scrub)
```
p=0                                  p=1
┌▔▔▔▔▔▔▔▔ barras de cine ▔▔▔▔▔▔▔▔┐     ┌─────────────────────────────┐
│   ███ (×5, muy cerca)           │ ─▶  │  유 (10f, glifo 9%)          │
│                                 │     │  Juan                        │
│▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁│     │  Manuel        [retrato]     │
└─────────────────────────────────┘     │  Puccio   염치               │
 10a pull-back: scale 5→1                │  Audito procesos             │
                                         │  de empresas                 │
                                         │  y los resuelvo con código.  │
                                         │  ~ aguada 2f en parallax ~   │
                                         │            ↓ 9j              │
                                         └─────────────────────────────┘
 titular: 10i tajo o ink-rise por líneas dentro del pull-back 10a
 salida: 10l zoom ×2.4 + destello blanco (corte de cámara) ─▶ cinturones
```

**Mobile** (enter)
```
┌──────────────┐
│ FULL STACK   │
│ Juan      ┃  │ 7i pincelada vertical (dashoffset, sin filtro)
│ Manuel    ┃  │ nombre por líneas (ink-rise, 0.12s)
│ Puccio    ┃  │ sello 염치 (ink-stamp)
│ Audito procesos│ titular por líneas (7i, como MockupMobile)
│ de empresas    │
│ y los resuelvo │
│ con código.    │
│ [retrato] ┃  │
│ DESPLÁZATE ↓ │
└──────────────┘
 salida: 7e goteo (1 sola vez) ─▶ cinturones
```
- Componentes nuevos: `HeroPullback` (10a), `GlyphBackdrop` (10f, hecho como `InkGlyphTitle`), `WashLayers` (2f raster), `MobileHeroBrush` (7i).

## S2. Cinturones (capítulo central)

**Desktop** (pin ≈ 600vh, scroll horizontal)
```
 ┌ tinta horizontal 10o: pinta un nudo por cinturón ─────────────────────────┐
 │ ●━━━━━━●━━━━━━●━━━━━━○┄┄┄┄┄┄○┄┄┄┄┄┄○                                        │
 └───────────────────────────────────────────────────────────────────────────┘
 [ CAP.01 BLANCO ] ─6b─▶ [ CAP.02 AMARILLO ] ─6b─▶ … ─6d ensō─▶ [ 1º DAN ]
  10d tarjeta de capítulo                                      6e 단 hacia cámara
  10f título con glifo                                          + 3c impact frame
  dato breve + años                                             (único hito)
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
- Componentes nuevos: `BeltRail` (10o), `ChapterCard` (10d), `BrushWipe` (6b), `EnsoFill` (6d), `DanHit` (6e+3c), `StickyBelts` (7c), `BambooGrow` (2d).

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
 salida: 10n rollo colgante
```

## S6. Fuera del código

```
 1b título con subrayado y sello
 2g cinco hanko que se estampan: 예의 염치 인내 극기 백절불굴   (bordes raster 8i)
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
| Hero → Cinturones | 10l zoom + destello | 7e goteo | scrub / enter |
| Cinturón → cinturón | 6b pincelada seca | 7e goteo | scrub / enter |
| Rojo → Negro | 6d ensō + 6e 단 + 3c | 6d | scrub + enter |
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
