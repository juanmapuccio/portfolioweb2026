# Design System & Creative Direction (v2: Organic Light & EyeCare Dark)
**Proyecto:** Landing / CV Interactivo 2026 — Juan Manuel Puccio (`portfolioweb-puccio2026`)  
**Filosofía:** *Editorial Organic Clarity & EyeCare Ergonomics*

---

## 1. Dirección Estética: Editorial, Orgánico y Profesional
Se descartan los temas oscuros genéricos de IA (fondos `#000` o gradientes morados estridentes). El portfolio adopta un diseño **editorial, orgánico y de alta legibilidad**, diseñado específicamente para la lectura rápida y cómoda de reclutadores, con soporte de cambio de tema:

1. **Tema Claro Principal (Default - Organic Warm Light):**
   - Inspirado en papel editorial de calidad, cerámica y lino técnico.
   - Tonos arena suave, hueso y blanco roto cálido que evitan el blanco puro cegador (`#ffffff`).
   - Tipografía con contraste nítido y descansado (carbón profundo `#1a1f26`).
2. **Tema Oscuro Alternativo (EyeCare Muted Dark):**
   - Filosofía de protección visual (baja fatiga ocular en sesiones prolongadas).
   - Fondos grafito mate cálido y pizarra neutra (`#181a1f` / `#20232a`), nunca negro absoluto.
   - Acentos atenuados que no generan resplandor molesto.

---

## 2. Tokens Semánticos de Color (CSS Custom Properties)

```css
/* =========================================================
   TEMA CLARO (Default - Warm Editorial Organic)
   ========================================================= */
:root {
  /* Superficies */
  --bg-primary: #f8f7f4;       /* Papel de lino / blanco hueso cálido */
  --bg-surface: #ffffff;       /* Tarjetas elevadas limpias */
  --bg-surface-elevated: #f1efe9; /* Sub-contenedores y badges */
  --bg-surface-hover: #ece9e1; /* Estados interactivos */

  /* Bordes y Divisores */
  --border-subtle: #e2ded4;    /* Delimitador suave orgánico */
  --border-strong: #c8c2b5;    /* Bordes destacados y focus */

  /* Tipografía */
  --text-main: #191e24;        /* Carbón profundo para máxima legibilidad */
  --text-muted: #57606e;       /* Tono intermedio editorial */
  --text-dim: #7d8898;         /* Fechas, metadatos y etiquetas */

  /* Acentos de Marca (NodoSur & Precisión Técnica) */
  --accent-primary: #0284c7;   /* Azul cerúleo técnico */
  --accent-surface: #e0f2fe;   /* Fondo tenue de acento */
  --accent-emerald: #059669;   /* Estado en producción y estabilidad */
  --accent-amber: #d97706;     /* Fricción y alertas de negocio */
  --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.04);
}

/* =========================================================
   TEMA OSCURO (EyeCare Muted Slate & Warm Graphite)
   ========================================================= */
[data-theme='dark'] {
  /* Superficies de descanso visual */
  --bg-primary: #15181c;       /* Grafito neutro suave (no negro #000) */
  --bg-surface: #1d2127;       /* Tarjetas de superficie mate */
  --bg-surface-elevated: #242932; /* Sub-bloques con contraste descansado */
  --bg-surface-hover: #2c323d; /* Hover suave */

  /* Bordes */
  --border-subtle: #2d3440;    /* Micro-bordes sutiles */
  --border-strong: #434d5e;

  /* Tipografía */
  --text-main: #edf2f7;        /* Blanco marfil descansado (evita resplandor) */
  --text-muted: #a0aec0;       /* Gris medio equilibrado */
  --text-dim: #718096;         /* Metadatos */

  /* Acentos EyeCare */
  --accent-primary: #38bdf8;   /* Azul cielo suave */
  --accent-surface: rgba(56, 189, 248, 0.12);
  --accent-emerald: #34d399;   /* Esmeralda suave */
  --accent-amber: #fbbf24;     /* Ámbar suave */
  --shadow-card: 0 6px 20px rgba(0, 0, 0, 0.25);
}
```

---

## 3. Tipografía & Jerarquía de Lectura
- **Titulares:** Fuente sans-serif contemporánea, rotunda y legible (*Plus Jakarta Sans* / *Outfit*).
- **Cuerpo de lectura:** Sans-serif neutral con excelente kerning (*Inter*).
- **Datos técnicos:** Monospace editorial (*JetBrains Mono* / monospace nativo del sistema).

---

## 4. Selector de Tema (EyeCare Toggle)
- Botón accesible en el header para alternar entre **Modo Claro (Orgánico)** y **Modo Oscuro (EyeCare)**.
- Persistencia automática de la preferencia del usuario en `localStorage` con detección automática de `prefers-color-scheme`.
