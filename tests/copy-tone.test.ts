import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIRS = ['src/data', 'src/i18n', 'src/components'];
const BANNED = ['arcaic', 'trinchera', 'timidez', 'la calle'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe('career copy tone', () => {
  test('no slang or critical wording about former employers in data, i18n or components', () => {
    const hits: string[] = [];
    for (const dir of DIRS) {
      for (const file of walk(join(ROOT, dir))) {
        const text = readFileSync(file, 'utf8').toLowerCase();
        for (const word of BANNED) {
          if (text.includes(word)) hits.push(`${file.slice(ROOT.length + 1)}: "${word}"`);
        }
      }
    }
    expect(hits).toEqual([]);
  });
});
