---
name: impeccable-code
description: Estándares de ingeniería de software frontend, accesibilidad semántica (a11y), rendimiento extremo (Core Web Vitals), TypeScript estricto y arquitectura modular.
---

# Skill: Impeccable Engineering

## Reglas de Implementación
1. **Rendimiento Radical (Mobile First):**
   - Zero Cumulative Layout Shift (CLS): reservar espacios para imágenes y fuentes.
   - Cero JS innecesario: HTML estático por defecto en Astro; interactividad encapsulada en islas.
2. **Semántica y Accesibilidad (WCAG AAA):**
   - Jerarquía clara de encabezados (`h1` único por página).
   - Elementos interactivos nativos (`<button>`, `<a>`, `<dialog>`).
   - Contraste de texto siempre superior a 4.5:1 para cuerpo de texto y 3:1 para elementos de interfaz.
3. **Código Limpio y Mantenible:**
   - Tipado estricto en TypeScript sin `any`.
   - Nombres de funciones y componentes descriptivos que revelen su propósito exacto.
   - Separación estricta entre capa de datos/traducciones y componentes de presentación.
