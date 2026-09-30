export const languages = {
  es: 'Español',
  en: 'English',
  pt: 'Português',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'es';

export const ui = {
  es: {
    'meta.title': 'Juan Manuel Puccio | Desarrollador Full Stack · Auditoría y Automatización de Procesos',
    'meta.description': 'Desarrollador Full Stack especializado en optimización operativa, automatizaciones con Python e IA, y sistemas de gestión en producción (NodoSur).',
    'hero.btn.cv': 'Descargar CV',
    'contact.shortcut': 'Contactar',
    'skills.readMore': 'Leer más',
  },
  en: {
    'meta.title': 'Juan Manuel Puccio | Full Stack Developer · Process Auditing & Automation',
    'meta.description': 'Full Stack Developer specialized in operational optimization, Python & AI automations, and production systems (NodoSur).',
    'hero.btn.cv': 'Download CV',
    'contact.shortcut': 'Contact',
    'skills.readMore': 'Read more',
  },
  pt: {
    'meta.title': 'Juan Manuel Puccio | Desenvolvedor Full Stack · Auditoria e Automação de Processos',
    'meta.description': 'Desenvolvedor Full Stack especializado em otimização operacional, automações com Python e IA, e sistemas em produção (NodoSur).',
    'hero.btn.cv': 'Baixar CV',
    'contact.shortcut': 'Contato',
    'skills.readMore': 'Ler mais',
  }
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}
