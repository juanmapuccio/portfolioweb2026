import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/tul/tokens.css', 'utf8');
const BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'] as const;

function fieldBlock(key: string): Record<string, string> {
  const match = css.match(new RegExp(`\\[data-belt="${key}"\\]\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`missing field block for ${key}`);
  const out: Record<string, string> = {};
  for (const decl of match[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[decl[1]] = decl[2].trim();
  return out;
}

function channel(v: number): number {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) throw new Error(`token is not a 6-digit hex: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('tul tokens', () => {
  test('all six belt fields exist with field, ink, ink-soft and grade', () => {
    for (const key of BELTS) {
      const block = fieldBlock(key);
      for (const name of ['field', 'ink', 'ink-soft', 'grade']) expect(block[name]).toBeDefined();
    }
  });

  test('grade rises from 0 at blanco to 1 at negro', () => {
    const grades = BELTS.map((k) => Number(fieldBlock(k).grade));
    expect(grades[0]).toBe(0);
    expect(grades[5]).toBe(1);
    for (let i = 1; i < grades.length; i++) expect(grades[i]).toBeGreaterThan(grades[i - 1]);
  });

  for (const key of BELTS) {
    test(`${key}: ink and ink-soft reach AA (4.5:1) on the field`, () => {
      const { field, ink, 'ink-soft': soft } = fieldBlock(key);
      expect(contrast(ink, field)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(soft, field)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
