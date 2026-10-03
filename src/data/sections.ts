import type { ui } from '../i18n/ui';

type UiKey = keyof (typeof ui)['es'];

// Page sections in scroll order. `id` is the anchor target, `label` the i18n key
// of the nav label, `belt` the value of data-belt (read by src/scripts/ink.ts to
// colour the header progress line) and `token` the matching --ink-belt-* suffix.
export const siteSections = [
  { id: 'hero', label: 'nav.hero', belt: 'blanco', token: 'white' },
  { id: 'cinturones', label: 'nav.belts', belt: 'amarillo', token: 'yellow' },
  { id: 'friccion', label: 'nav.friction', belt: 'verde', token: 'green' },
  { id: 'proyectos', label: 'nav.projects', belt: 'azul', token: 'blue' },
  { id: 'stack', label: 'nav.stack', belt: 'rojo', token: 'red' },
  { id: 'principios', label: 'nav.principles', belt: 'negro', token: 'black' },
  { id: 'contacto', label: 'nav.contact', belt: 'negro', token: 'black' },
] as const satisfies readonly { id: string; label: UiKey; belt: string; token: string }[];
