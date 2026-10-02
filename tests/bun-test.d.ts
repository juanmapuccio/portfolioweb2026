declare module 'bun:test' {
  interface Matchers {
    readonly not: Matchers;
    toBe(expected: unknown): void;
    toBeLessThan(expected: number): void;
    toBeGreaterThan(expected: number): void;
    toBeLessThanOrEqual(expected: number): void;
    toContain(expected: unknown): void;
    toEqual(expected: unknown): void;
    toHaveLength(expected: number): void;
    toMatch(expected: RegExp): void;
  }

  export function describe(name: string, callback: () => void): void;
  export function test(name: string, callback: () => void): void;
  export function expect(value: unknown): Matchers;
}
