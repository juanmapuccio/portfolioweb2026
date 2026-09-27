# Stack Tecnológico — portfolioweb-puccio2026

**Decisión final: Astro 7**  
**Dominio:** `https://juanpuccio.vercel.app`  
**Deploy:** Vercel (static output)  
**Última actualización:** 2026-09-27

---

## Decisión

**Astro 7** — cerrado. No se evalúan alternativas.

**Motivos:**
- Islands Architecture: cero JS por defecto, interactividad quirúrgica donde se necesita
- i18n nativo (`astro:i18n`) para ES / EN / PT sin dependencias extra
- Static output + Vercel Edge: TTFB y FCP < 300ms en móvil 4G (crítico para acceso vía QR)
- Sin backend, bases de datos ni serverless functions requeridos para el caso de uso
- Componentes de islas en Svelte, Vue, React o Vanilla TS según necesidad puntual

---

## Estructura de Proyecto

```
portfolioweb-puccio2026/
├── src/
│   ├── components/        # Componentes Astro e islas interactivas (Bento, Timeline, Skills, Contact)
│   ├── pages/
│   │   ├── index.astro    # Página principal canónica en Español (/)
│   │   ├── en/
│   │   │   └── index.astro# Versión en Inglés (/en)
│   │   └── pt/
│   │       └── index.astro# Versión en Portugués (/pt)
│   ├── i18n/
│   │   └── ui.ts          # Diccionario de traducción base y helpers
│   ├── data/
│   │   ├── projects.ts    # Proyectos en producción y casos reales
│   │   ├── experience.ts  # Hitos de trayectoria operativa & técnica
│   │   ├── skills.ts      # Stack tecnológico, herramientas y filosofía
│   │   └── contact.ts     # Canales directos y estado de disponibilidad
│   ├── layouts/
│   │   └── Layout.astro   # Layout global (Navbar, SEO, Toggle EyeCare, Footer)
│   └── styles/
│       └── global.css     # Design tokens semánticos (DESIGN.md)
├── public/
│   ├── CV-Juan-Manuel-Puccio-2026-1.pdf
│   ├── fotojmPerfil.PNG
│   └── favicon.svg
├── docs/                  # Documentación canónica de narrativa, copy y arquitectura
├── astro.config.mjs       # Configuración i18n y build estático
└── tsconfig.json          # TypeScript estricto
```

---

## Configuración Base

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://juanpuccio.vercel.app',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: {
      prefixDefaultLocale: false, // / → ES, /en → EN, /pt → PT
    },
  },
});
```

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strictest"
}
```

---

## Islands Strategy

| Componente | Island necesaria | Directiva | Motivo |
|---|---|---|---|
| Hero (texto estático) | No | — | Sin estado |
| Theme toggle | Sí | `client:load` | Interacción inmediata |
| QR Modal | Sí | `client:load` | Apertura por click |
| Animaciones scroll | Sí | `client:visible` | Solo cuando entra en viewport |
| Cards de proyectos | No | — | Hover puro en CSS |
| Selector de idioma | Sí | `client:load` | Estado de UI |

Las islas interactivas se implementan en **Vanilla TS** por defecto. Solo se incorpora un framework (Svelte) si la complejidad de un componente puntual lo justifica.

---

## Dependencias Previstas

```json
{
  "dependencies": {
    "astro": "^5.x"
  },
  "devDependencies": {
    "typescript": "^5.x"
  }
}
```

Librerías de animación: a definir según efectos requeridos (ver pendiente abajo).

---

## Decisión: Animaciones / Efectos Interactivos (resuelto 2026-09-27)

**Elegido: CSS-first, sin biblioteca de animación.**

Investigación web (2026-09-27) confirmó que el stack canónico de portfolios Astro
premiados es GSAP + SplitText/Flip/ScrollTrigger + Lenis + Three.js + Swup
(~150-250KB de JS). Ese stack entra en conflicto directo con la restricción
central del proyecto — TTFB/FCP < 300ms en 4G móvil vía acceso QR — y con el
posicionamiento del propio autor (optimización de procesos, fricción cero).
Lenis en particular existe para sincronizar el DOM con loops de render WebGL;
sin WebGL en este sitio, es peso muerto.

Implementación:

- `@keyframes` + `[data-reveal]` / `.is-revealed` en `src/styles/global.css`,
  con stagger vía la custom property `--reveal-delay`.
- `@view-transition { navigation: auto; }` (at-rule CSS nativa) para
  transiciones cross-document entre locales — cero JS, sin `<ClientRouter />`.
- Un script `IntersectionObserver` vanilla (~0.7KB antes de minificar, sin
  imports) en `src/layouts/Layout.astro` que agrega `.is-revealed`.
- Progressive enhancement estricto: sin JS, todo el contenido es visible; el
  estado oculto solo se activa vía la clase `html.js-reveal`, añadida
  tempranamente por el propio script.
- `prefers-reduced-motion: reduce` desactiva reveals, stagger, view
  transitions y el `scroll-behavior: smooth` existente.

Si en el futuro un momento hero puntual lo justifica, se evaluará una
"isla" GSAP aislada — no una migración total del sitio.