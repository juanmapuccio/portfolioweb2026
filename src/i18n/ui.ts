export const languages = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    'meta.title': 'Juan Manuel Puccio | Full Stack Developer & Consultor de Procesos',
    'meta.description': 'Desarrollador Full Stack especializado en optimización operativa, automatizaciones con Python e IA, y sistemas de gestión en producción (NodoSur).',
    'hero.btn.cv': 'Descargar CV',
  },
  en: {
    'meta.title': 'Juan Manuel Puccio | Full Stack Developer & Process Consultant',
    'meta.description': 'Full Stack Developer focused on operational optimization, Python & AI automations, and production systems (NodoSur).',
    'hero.btn.cv': 'Download CV',
  },
  pt: {
    'meta.title': 'Juan Manuel Puccio | Desenvolvedor Full Stack & Consultor de Processos',
    'meta.description': 'Desenvolvedor Full Stack focado em otimização operacional, automações com Python e IA, e sistemas em produção (NodoSur).',
    'hero.btn.cv': 'Baixar CV',
  }
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}
