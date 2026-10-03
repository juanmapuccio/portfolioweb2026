// Specimen 9a: 24 UI icons on a 32 grid, brush-stroke set (catalog cat-M).
// Values are the inner SVG markup (paths/circles only), rendered by InkIcon.astro.
export const inkIcons = {
  menu: '<path d="M4 8c6-1 16 1 24-1"/><path d="M4 16c8 1 14-1 24 0"/><path d="M6 24c6-1 14 1 20-1"/>',
  close: '<path d="M6 5L27 27"/><path d="M26 6L5 26"/>',
  search: '<path d="M22 13a9 9 0 1 1-4-7.5"/><path d="M20 20l8 8"/>',
  external: '<path d="M7 25L25 7"/><path d="M12 6h14v14"/><path d="M4 22l3 3M6 18l2 2"/>',
  download: '<path d="M16 4v18"/><path d="M8 15l8 8 8-8"/><path d="M4 28c8-1 16 1 24 0"/>',
  email: '<path d="M4 8h24v17H4z"/><path d="M4 8l12 10 12-10"/>',
  chat: '<path d="M5 6h22v15H14l-7 6v-6H5z"/><path d="M10 13h12"/>',
  code: '<path d="M11 9l-7 7 7 7"/><path d="M21 9l7 7-7 7"/><path d="M18 5l-4 22"/>',
  profile: '<circle cx="16" cy="11" r="5"/><path d="M5 28c2-7 6-9 11-9s9 2 11 9"/>',
  language: '<path d="M6 5h20v22H6z"/><path d="M3 5h6M23 5h6M3 27h6M23 27h6"/><path d="M11 12h10M16 10v2M12 20c3-2 5-5 6-8M14 15c2 3 4 5 7 5"/>',
  home: '<path d="M3 14L16 4l13 10"/><path d="M2 14h28"/><path d="M7 14v13h18V14"/><path d="M13 27v-7h6v7"/>',
  location: '<path d="M16 29s-9-9-9-16a9 9 0 0 1 18 0c0 7-9 16-9 16z"/><circle cx="16" cy="13" r="3"/>',
  calendar: '<path d="M5 7h22v20H5z"/><path d="M5 13h22M11 4v6M21 4v6"/><path d="M11 19h3M18 19h3M11 23h3"/>',
  ok: '<path d="M27 15a11 11 0 1 1-6-9.8"/><path d="M10 16l5 5 13-14"/>',
  alert: '<path d="M16 4L29 27H3z"/><path d="M16 12v7M16 23v.5"/>',
  settings: '<circle cx="16" cy="16" r="4"/><path d="M16 3v5M16 24v5M3 16h5M24 16h5M7 7l3.5 3.5M21.5 21.5L25 25M25 7l-3.5 3.5M10.5 21.5L7 25"/>',
  phone: '<path d="M9 3h14v26H9z"/><path d="M14 25h4"/>',
  play: '<path d="M10 6l16 10-16 10z"/>',
  next: '<path d="M4 16h22"/><path d="M19 9l7 7-7 7"/><path d="M3 11h6M3 21h4"/>',
  share: '<circle cx="8" cy="16" r="3"/><circle cx="24" cy="7" r="3"/><circle cx="24" cy="25" r="3"/><path d="M11 14.5l10-6M11 17.5l10 6"/>',
  cv: '<path d="M7 3h13l6 6v20H7z"/><path d="M20 3v6h6"/><path d="M11 15h11M11 19h11M11 23h7"/>',
  project: '<path d="M4 6h11v9H4zM18 6h10v20H18zM4 18h11v8H4z"/>',
  stack: '<path d="M16 4l13 6-13 6-13-6z"/><path d="M3 16l13 6 13-6"/><path d="M3 22l13 6 13-6"/>',
  production: '<circle cx="16" cy="16" r="4"/><path d="M16 4a12 12 0 0 1 12 12M16 28A12 12 0 0 1 4 16"/>',
} as const;

export type InkIconName = keyof typeof inkIcons;
export const inkIconNames = Object.keys(inkIcons) as InkIconName[];
