import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/i18n.test.ts', 'tests/data/*.test.ts'],
  },
});
