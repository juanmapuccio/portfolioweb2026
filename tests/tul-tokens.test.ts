import { describe, expect, test } from 'bun:test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const css = readFileSync('src/styles/tul/tokens.css', 'utf8');
const BELTS = ['blanco', 'amarillo', 'verde', 'azul', 'rojo', 'negro'] as const;
const FIELD = '#f3f8fd';

function declarations(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const decl of block.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[decl[1]] = decl[2].trim();
  return out;
}

function beltBlock(key: string): Record<string, string> {
  const match = css.match(new RegExp(String.raw`\[data-belt="${key}"\]\s*\{([^}]*)\}`));
  if (!match) throw new Error(`missing belt block for ${key}`);
  return declarations(match[1]);
}

function rootBlock(): Record<string, string> {
  const match = css.match(/:root\s*\{([^}]*)\}/);
  if (!match) throw new Error('missing :root block');
  return declarations(match[1]);
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

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

describe('tul tokens', () => {
  test('one white field with dark ink, defined once at the root', () => {
    const root = rootBlock();
    expect(root.field).toBe(FIELD);
    expect(contrast(root.ink, root.field)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(root['ink-soft'], root.field)).toBeGreaterThanOrEqual(4.5);
  });

  test('no belt block redefines the field or the ink', () => {
    for (const key of BELTS) {
      const block = beltBlock(key);
      for (const name of ['field', 'ink', 'ink-soft']) expect(block[name]).toBeUndefined();
    }
  });

  test('every belt has a fill and a grade', () => {
    for (const key of BELTS) {
      const block = beltBlock(key);
      expect(block['belt-fill']).toMatch(/^#[0-9a-f]{6}$/i);
      expect(block.grade).toBeDefined();
    }
  });

  test('grade rises from 0 at blanco to 1 at negro', () => {
    const grades = BELTS.map((k) => Number(beltBlock(k).grade));
    expect(grades[0]).toBe(0);
    expect(grades[5]).toBe(1);
    for (let i = 1; i < grades.length; i++) expect(grades[i]).toBeGreaterThan(grades[i - 1]);
  });

  for (const key of BELTS) {
    test(`${key}: the belt line holds 3:1 on the white field`, () => {
      expect(contrast(beltBlock(key)['belt-line'], FIELD)).toBeGreaterThanOrEqual(3);
    });
  }

  test('belt colours never paint a surface', () => {
    const blocks = [...css.matchAll(/(\[data-belt[^{]*)\{([^}]*)\}/g)];
    expect(blocks.length).toBeGreaterThan(0);
    for (const [, selector, body] of blocks) {
      expect(body).not.toMatch(/background(-color)?\s*:/);
      expect(selector).toContain('data-belt');
    }
  });
});

describe('no belt drench in src', () => {
  const files = walk('src').filter((f) => /\.(astro|css|ts)$/.test(f));
  const sources = files.map((f) => [f, readFileSync(f, 'utf8')] as const);

  test('no background paint on a [data-belt] rule', () => {
    for (const [file, src] of sources) {
      for (const m of src.matchAll(/([^{}]*\[data-belt[^{}]*)\{([^}]*)\}/g)) {
        if (/background(-color)?\s*:\s*var\(--field\)/.test(m[2])) throw new Error(`${file}: ${m[1].trim()}`);
      }
    }
  });

  test('no tie plane, grade-belt workaround or early flip', () => {
    for (const [file, src] of sources) {
      for (const needle of ['tc__next', 'data-grade-belt', 'TIE_AT', 'data-next-belt']) {
        if (src.includes(needle)) throw new Error(`${file} still contains ${needle}`);
      }
    }
  });
});
