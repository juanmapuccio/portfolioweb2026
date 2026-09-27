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

## Pendiente de Decisión

- **Animaciones / efectos interactivos:** tipo y biblioteca (GSAP, Motion One, CSS puro, etc.) pendiente de definición de referencias visuales.