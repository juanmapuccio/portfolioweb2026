# Design System: Portfolio Juan Manuel Puccio 2026

> ⚠️ **DEPRECATED / ARCHIVADO HISTÓRICO**  
> Este documento representa una iteración previa de diseño (que contemplaba tema dual y la tipografía *Anybody*).  
> **La fuente de verdad canónica y actualizada es [`DESIGN.md`](DESIGN.md)**, la cual está 100% engranada con `src/styles/global.css` y la arquitectura actual.

---

## Filosofía de Diseño (Histórica)
Portfolio de desarrollador full-stack que adopta una dirección **editorial, orgánica y de alta legibilidad**, diseñado para reclutadores y equipos técnicos con soporte de cambio de tema. Desecha IA genérica (gradientes morados, negros puros) en favor de claridad operativa inspirada en papel editorial de calidad, cerámica y lino técnico.

**Dos temas:**
- **Claro (Default)**: Tonos arena suave, blanco roto cálido, carbón profundo — máxima legibilidad diurna.
- **Oscuro (EyeCare)**: Grafito mate cálido, nunca negro absoluto — protección visual en sesiones prolongadas.

---

## 1. Paleta de Color

### Tema Claro (Warm Editorial Organic)
```
Superficies:
  --bg-primary:           #f2eee6  (Papel de lino / blanco hueso cálido)
  --bg-surface:           #ffffff  (Tarjetas elevadas)
  --bg-surface-elevated:  #f1efe9  (Badges, sub-contenedores)
  --bg-surface-hover:     #ece9e1  (Estados interactivos)

Bordes:
  --border-subtle:        #e2ded4  (Divisores suaves)
  --border-strong:        #c8c2b5  (Bordes y focus)

Tipografía:
  --text-main:            #191e24  (Carbón profundo)
  --text-muted:           #57606e  (Tono editorial intermedio)
  --text-dim:             #7d8898  (Metadatos, fechas, labels)

Acentos:
  --accent-primary:       #0284c7  (Azul cerúleo técnico — links, CTA)
  --accent-surface:       #e0f2fe  (Fondo tenue)
  --accent-emerald:       #059669  (Producción, estabilidad)
  --accent-amber:         #d97706  (Fricción, alertas de negocio)

Sombras:
  --shadow-card:          0 4px 16px rgba(0, 0, 0, 0.04)
```

### Tema Oscuro (EyeCare Muted Slate)
```
Superficies:
  --bg-primary:           #15181c  (Grafito neutro — no #000)
  --bg-surface:           #1d2127  (Tarjetas superficie mate)
  --bg-surface-elevated:  #242932  (Sub-bloques descansados)
  --bg-surface-hover:     #2c323d  (Hover suave)

Bordes:
  --border-subtle:        #2d3440  (Micro-bordes)
  --border-strong:        #434d5e

Tipografía:
  --text-main:            #edf2f7  (Blanco marfil — evita resplandor)
  --text-muted:           #a0aec0  (Gris medio equilibrado)
  --text-dim:             #718096  (Metadatos)

Acentos:
  --accent-primary:       #38bdf8  (Azul cielo suave)
  --accent-surface:       rgba(56, 189, 248, 0.12)
  --accent-emerald:       #34d399  (Esmeralda suave)
  --accent-amber:         #fbbf24  (Ámbar suave)

Sombras:
  --shadow-card:          0 6px 20px rgba(0, 0, 0, 0.25)
```

### Uso Estratégico
- **Grados del Taekwondo (Cinturones)** — escala cromática de 10º gup (blanco) a 1º dan (negro):
  - Blanco: `#ffffff`
  - Amarillo: `#fbbf24`
  - Naranja: `#fb923c`
  - Verde: `#10b981`
  - Azul: `#0284c7`
  - Rojo: `#ef4444`
  - Negro: `#1c1a17`

---

## 2. Tipografía

| Elemento | Fuente | Peso | Stretch | Tamaño Base | Notas |
|----------|--------|------|---------|------------|-------|
| **Títulos (H1–H3)** | Anybody | 700–800 | 130–150% | 30–96px clamp | Rotunda, legible, weight-driven |
| **Cuerpo** | Hanken Grotesk | 400–600 | 100% | 16–20px | Alta legibilidad, kerning excelente |
| **Datos, labels** | IBM Plex Mono | 400–500 | 100% | 11–13px | Monospace editorial, uppercase + letter-spacing |
| **Meta (fechas, refs)** | IBM Plex Mono | 400 | 100% | 11px | `letter-spacing: 0.06–0.1em` |

### Jerarquía de Escala
- **H1 (Nombre)**: `clamp(40px, 7vw, 140px)` — titular heroico, stretch 150%
- **H2 (Sección)**: `clamp(30px, 4.8vw, 80px)` — encabezados de etapa, stretch 150%
- **H3 (Subsección)**: `clamp(20px, 3vw, 44px)` — proyectos y detalles
- **Párrafo largo**: `clamp(20px, 1.8vw, 26px)` — lede descriptivo
- **Cuerpo normal**: `17px` — lectura fluida, `line-height: 1.55`
- **Caption**: `13–16px` — roles, orgs, textos supp.

### Tipografía Accesible
- Mínimo contraste: 4.5:1 (texto normal), 3:1 (headlines)
- Sin justificación; `text-wrap: pretty` en párrafos largos
- `hyphens: auto` en contenedor raíz

---

## 3. Espaciado & Layout

### Gaps y Paddings (CSS clamp)
- **Horizontal padding**: `clamp(20px, 5vw, 72px)` — responsive margen de contenedor
- **Vertical padding (secciones)**: `clamp(72px, 11vh, 92px)` — hero top; `clamp(32px, 6vh, 56px)` — sections
- **Gap entre elementos**: `gap: clamp(12px, 2.5vh, 24px)` (flex/grid)
- **Border-radius**: Raramente usado (diseño editorial, líneas limpias)

### Grid y Flex
- Layout principal: **Flex column** con secciones sticky para parallax
- Rail de cinturones + contenido: **CSS Grid** `grid-template-columns: [rail] [content]`
- Responsive breakpoint implícito: `minmax(min(100%, 340px), 1fr)` para cards

### Altura de Secciones
- **Hero**: `180vh` (sticky en `100vh`, scrollable)
- **Perfil**: `260vh` (palabras animadas en reveal)
- **Trayectoria**: `min-height: 70vh` (sticky en `100vh` para rail)
- **Cinturón negro**: `280vh` (fondo que sube de abajo, overlay)
- **Proyectos**: `min-height: 90vh` por proyecto

---

## 4. Componentes y Patrones

### Header Fijo
```
Position: fixed, top, z-index: 50
Height: 60px
Blend: rgba(fondo, 0.92) + backdrop-filter: blur(8px)
Border-bottom: 1px solid rgba(text, 0.12)
```

### Cinturones Timeline
- **Visual**: Barras horizontales stacked, `repeating-linear-gradient` diagonal en fondo
- **Color dinámico**: Sigue el cinturón actual vía `{{ cur.color }}`
- **Indicator**: Puntos de 6 colores (escala completa de grados) con `opacity` dinámica

### Secciones Sticky
- Contenedor sticky top 0, altura 100vh
- Contenido internal con scroll parallax vía CSS custom properties `--p` (0–1)
- Fade-in/slide-in en visible con `data-in` y `opacity: var(--v)`

### Proyectos (Cinturón Negro)
- Fondo negro con micro-patrón diagonal (`repeating-linear-gradient`)
- Overlay texto en fade y slide desde abajo (opacity 0 → 1 a scroll ~55%)
- Duotono opcional en screenshots (cinturón color + escala de grises)

### Foto de Perfil
- Aspect-ratio: 4/5
- `filter: {{ photoFilter }}` (duotono o escala de grises dinámicamente)
- `mix-blend-mode: multiply` para integración en tema claro

---

## 5. Movimiento & Interacción

### Scroll Parallax
- **Custom properties**: `--p` (0–1 progress), `--v` (visibility fade), `--m` (media query mobile flag)
- **Hero name**: `transform: translateY(calc(var(--p) * -12vh))` + fade out
- **Cinturones**: Cada etapa se activa en su scroll position
- **Secciones**: Slide-in `translateY(40px)` → full opacity en visibility

### Transitions
- **Color changes**: `transition: background 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)`
- **Fade**: `0.4s ease` para opcities
- **Suave sin jarring**: Cubic-bezier personalizado para cinturones

### Behaviors
- **Header**: Badge de cinturón actual actualiza en tiempo real
- **Selector de tema**: LocalStorage + `prefers-color-scheme` auto-detect
- **CV download**: Google Drive link en header y hero

---

## 6. Mobile & Responsive

### Breakpoints
- **Tablet (<680px)**: Párrafos supp. ocultos (`display: none`), foto lado derecho ocultada si no hay espacio
- **Mobile**: Fuentes se reducen a mínimos clamp, padding contenedor ajustado
- **Flag `--m`**: En CSS queries, se inyecta valor 1 (mobile) o 0 (desktop) para ajustes de transformación

### Densidad
- **Desktop**: Gap 32–64px, padding 72px
- **Mobile**: Gap 12–24px, padding 20px

---

## 7. Accesibilidad

- **Contraste**: Todo texto 4.5:1+ (claro/oscuro) o 3:1+ (headlines)
- **Selección**: `::selection { background: text, color: bg }` (inversión)
- **Font smoothing**: `-webkit-font-smoothing: antialiased`
- **Hiphenation**: `hyphens: auto` en `lang="es"`
- **Links**: Color heredado de contexto, hover opacity 0.7
- **Focus**: `border-strong` en inputs (no mostrados en este portfolio, pero heredado)

---

## 8. Exportables & Formatos

### Standalone HTML
- Una sola página con Google Fonts inlined en `<helmet>`
- Standalone `support.js` para lógica de animación parallax
- Funciona offline salvo tipografías (cached en browser)

### Modo Oscuro
- Toggle en header vía data-attribute `[data-theme="dark"]`
- Fallback a `prefers-color-scheme: dark` del OS
- Persistencia en localStorage

### Exportación a PPTX
- Slides: Hero, Perfil, Trayectoria (por etapa), Cinturón Negro, Proyectos
- Modo `editable` (shapes + text nativos en PowerPoint)
- Duotonos en screenshots de proyectos si es needed

---

## 9. Uso de Variables CSS

```css
:root {
  /* Dinámicas vía JS */
  --g: escala de cinturón (0–1)
  --p: parallax progress (0–1)
  --v: visibility fade (0–1)
  --m: mobile flag (0 o 1)
  
  /* Colores y tokens */
  --bg-primary, --text-main, etc. (ver §1)
}

[data-theme="dark"] {
  /* Override todos los tokens */
}
```

---

## 10. Componentes Reutilizables (Design Components)

Si vas a refactorizar como design system completo:

- **`CinturonBelt.dc.html`**: Strip visual de cinturón + metadata
- **`ProjectCard.dc.html`**: Card de proyecto con duotono y diagrama
- **`TimelineStage.dc.html`**: Etapa de trayectoria (sticky + contenido)
- **`ThemeToggle.dc.html`**: Selector claro/oscuro con persistencia

**Props comunes:**
```json
{
  "color": "hex",
  "title": "string",
  "description": "string",
  "theme": "light|dark",
  "responsive": "boolean"
}
```

---

## 11. Decisiones de Marca

- **No emoji**: Editorial profesional, solo tipografía
- **Monospace para meta**: IBM Plex Mono en labels, dates, refs — coherencia técnica
- **Grids > margen**: Layout con `gap` en flex/grid, no espacios textuales
- **Pallax suave**: Cubic-bezier personal, no jump animations
- **Cinturón como narrativa**: Metáfora visual del progreso técnico (10º gup → 1º dan)

---

## 12. Referencias de Archivo

- **`Portfolio Dojo v2.dc.html`** — Componente interactivo completo (Design Component)
- **`Portfolio Juan Puccio v2.html`** — Export standalone (HTML puro)
- **`support.js`** — Runtime para parallax y logic del portfolio
- **`assets/foto-juan.png`** — Imagen de perfil (4:5)

---

**Última actualización**: Sept 2026  
**Estado**: Producción viva, tema dual, responsive mobile
