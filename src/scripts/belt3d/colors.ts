// Belt colours, mirroring `--belt-fill` in src/styles/tul/tokens.css (tests/tul-belt3d.test.ts keeps
// the two in sync). No three import: plain hex strings.

export const BELT_COLORS = {
  blanco: '#ffffff',
  amarillo: '#f4c62b',
  verde: '#1d6a44',
  azul: '#1d4a99',
  rojo: '#b3312a',
  negro: '#111418'
} as const;

/** Thread colour the black belt's stitches end on. */
export const STITCH_GOLD = '#d4a72c';
/** Natural thread tone of an undyed belt. */
export const STITCH_NEUTRAL = '#d2ccbe';
