import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://juanpuccio.vercel.app',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});
