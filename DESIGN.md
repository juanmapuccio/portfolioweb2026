# Design System & Creative Direction (v3: Editorial Organic)

**Proyecto:** Portfolio 2026 — Juan Manuel Puccio (`portfolioweb-puccio2026`)
**Dirección:** Editorial, orgánica y de alta legibilidad, orientada a reclutadores y equipos técnicos.
**Fuente de verdad:** `src/styles/global.css`, `src/layouts/Layout.astro` y los componentes en `src/components/`.

---

## 1. Filosofía de Diseño

Portfolio de desarrollador full-stack con una dirección **editorial, orgánica y de alta legibilidad**. Se descartan los patrones genéricos de IA (gradientes morados, negros puros, cards con sombra + borde) en favor de una claridad operativa inspirada en papel editorial de calidad, cerámica y lino técnico.

**Tema único (Warm Editorial Organic):** arena suave, blanco roto cálido, tinta carbón. Máxima legibilidad diurna. No hay tema oscuro.

**Ejes de identidad:**
- El cinturón de Taekwondo ITF como metáfora narrativa del progreso técnico (10º gup → 1º dan).
- Tipografía editorial (serif para titulares de peso) + monospace para el registro de datos.
- Esquinas duras (`radius: 0px`) y bordes de tinta translúcida: editorial, no "app".

---

## 2. Tipografía

Cargadas desde Google Fonts en `Layout.astro`:

| Rol | Fuente | Peso | Notas |
|-----|--------|------|-------|
| **Titulares de display / sección** | Source Serif 4 | 300–700 | Serif editorial para nombres y encabezados de sección |
| **Encabezados por defecto (h1–h4)** | Hanken Grotesk | 800 | `letter-spacing: -0.02em` |
| **Cuerpo** | Hanken Grotesk | 300–700 | Alta legibilidad, kerning excelente |
| **Datos, labels, fechas, tags** | IBM Plex Mono | 400 / 600 | Uppercase + `letter-spacing` |

```css
--font-serif: 'Source Serif 4', Georgia, serif;
--font-sans:  'Hanken Grotesk', system-ui, -apple-system, sans-serif;
--font-mono:  'IBM Plex Mono', ui-monospace, monospace;
```

Reglas de aplicación:
- `h1, h2, h3, h4` por defecto usan `--font-sans` con `font-weight: 800` y tracking `-0.02em`.
- Los titulares de display y de sección se sobreescriben por componente a `--font-serif` (hero, dimensión humana, stack, contacto, trayectoria, proyectos).
- El registro de datos (badges, fechas, tags, status, canales) usa `--font-mono`.

---

## 3. Paleta de Color (CSS Custom Properties)

Valores verificados contra `src/styles/global.css`.

### Tema Claro (default)

```css
:root {
  color-scheme: light;

  --bg-primary:          #f2eee6;  /* Papel de lino / blanco hueso cálido */
  --bg-surface:          #ffffff;  /* Tarjetas elevadas limpias */
  --bg-surface-elevated: #e8e3d8;  /* Badges y sub-contenedores */
  --bg-surface-hover:    #ded8cb;  /* Estados interactivos */

  --border-subtle: rgba(28, 26, 23, 0.12); /* Delimitador sutil (tinta) */
  --border-strong: rgba(28, 26, 23, 0.28); /* Bordes destacados y focus */

  --text-main:  #1c1a17;  /* Tinta carbón profunda */
  --text-muted: #4a463f;  /* Tono intermedio editorial */
  --text-dim:   #6a645a;  /* Metadatos, fechas, etiquetas */

  --accent-cyan:    #0369a1;            /* Azul técnico refinado */
  --accent-blue:    #2563eb;            /* Confiabilidad */
  --accent-emerald: oklch(0.58 0.12 150); /* Producción y estabilidad */
  --accent-amber:   oklch(0.84 0.15 90);  /* Fricción y alertas */

  --shadow-card: 0 4px 20px rgba(28, 26, 23, 0.04);

  --qr-bg: #ffffff;
  --qr-fg: #1c1a17;

  --max-width: 1600px;
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --transition: 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Escala de cinturones (narrativa marcial)

| Grado | Color |
|-------|-------|
| 10º gup — Blanco | `#ffffff` |
| Amarillo | `#fbbf24` |
| Naranja | `#fb923c` |
| Verde | `#10b981` |
| Azul | `#0284c7` |
| Rojo | `#ef4444` |
| 1º dan — Negro | `#1c1a17` |

---

## 4. Espaciado, Layout y Composición

- **Contenedor:** `max-width: 1600px`, padding horizontal `clamp(20px, 5vw, 72px)`.
- **Esquinas:** `0px` en toda la escala — estética editorial de líneas limpias, sin pills.
- **Bordes:** tinta translúcida (`rgba` del `--text-main`) en lugar de grises fríos.
- **Grid responsive:** `minmax(min(100%, 340px), 1fr)` para agrupaciones de cards/columnas.
- **Parallax/sticky:** secciones sticky con progreso por scroll (`--p`, `--v`) para la narrativa de cinturones.
- **Sombra:** una sola elevación declarada (`--shadow-card`), sin combinar borde + sombra.

---

## 5. Movimiento e Interacción (CSS-first)

- **Reveal nativo por scroll:** `data-reveal` + `IntersectionObserver` como mejora progresiva; sin JS el contenido queda visible.
- **View transitions nativas** (`@view-transition`) entre documentos, sin librerías.
- **Transiciones:** `0.25s cubic-bezier(0.16, 1, 0.3, 1)` para colores y opacidades.
- **Reveal tokens:** duración `0.5s`, distancia `16px`, stagger `60ms`.
- **`prefers-reduced-motion`:** anula reveal, view-transitions y `scroll-behavior`.
- **Sin Lenis / smooth-scroll secuestrado:** se respeta el scroll nativo.

---

## 6. Accesibilidad

- Contraste mínimo 4.5:1 (texto) y 3:1 (display).
- `::selection` invierte tinta/fondo.
- `scroll-padding-top` para anclas bajo el header fijo.
- Enlaces y controles con estados `:hover`/`:focus-visible`.
- `hyphens: auto` y `text-wrap` para evitar líneas huérfanas.
- Elementos interactivos nativos (`<a>`, `<button>`, `<dialog>`).

---

## 7. Decisiones de Marca

- **Sin emoji**: solo tipografía e iconografía vectorial consistente.
- **Monospace para meta**: fechas, labels y referencias en IBM Plex Mono.
- **Grid + gap > margen textual**: layout por grid/flex, no espacios manuales.
- **Cinturón como narrativa**: la progresión marcial organiza trayectoria y scrollytelling.
- **Estilo editorial industrial**: esquinas duras, bordes de tinta, tipografía serif de peso.

---

**Última actualización:** Sept 2026
**Estado:** sincronizado con `src/styles/global.css` y las fuentes de `src/layouts/Layout.astro`.
