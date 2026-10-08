import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const belt = readFileSync('src/scripts/belt3d/proceduralBelt.ts', 'utf8');

describe('belt tessellation (T12b)', () => {
  test('the triangle budget is 60k or less, counted from the real geometry', async () => {
    const m60 = belt.match(/BELT_TRIANGLE_BUDGET\s*=\s*(\d+)/);
    expect(Number(m60?.[1])).toBeLessThanOrEqual(60000);
    // The procedural belt only needs a canvas for the weave texture: a stub is enough to build the geometry.
    (globalThis as unknown as { document: unknown }).document = {
      createElement: () => ({ getContext: () => null, width: 0, height: 0 })
    };
    const mod = await import('../src/scripts/belt3d/proceduralBelt');
    const built = mod.createProceduralBelt();
    const triangles = mod.beltTriangleCount(built);
    built.dispose();
    expect(triangles).toBeGreaterThan(20000);
    expect(triangles).toBeLessThanOrEqual(mod.BELT_TRIANGLE_BUDGET);
  });
});
