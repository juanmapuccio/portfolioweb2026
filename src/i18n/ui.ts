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
    'header.role': 'Desarrollador Full Stack',
    'header.grade': 'Grado',
    'header.lang': 'Idioma',
    'header.name': 'Juan Manuel Puccio',
    'header.nameShort': 'J. M. Puccio',
    'header.status': 'DISPONIBLE · FULL-TIME',
    'nav.label': 'Navegación principal',
    'nav.hero': 'Inicio',
    'nav.belts': 'Cinturones',
    'nav.friction': 'Fricción',
    'nav.projects': 'Proyectos',
    'nav.stack': 'Stack',
    'nav.principles': 'Principios',
    'nav.contact': 'Contacto',
    'loader.loading': 'CARGANDO',
    'loader.name': 'JUAN MANUEL PUCCIO',
    'loader.eyebrow': 'FULL STACK · ROSARIO',
    'skills.readMore': 'Leer más',
  },
  en: {
    'meta.title': 'Juan Manuel Puccio | Full Stack Developer · Process Auditing & Automation',
    'meta.description': 'Full Stack Developer specialized in operational optimization, Python & AI automations, and production systems (NodoSur).',
    'hero.btn.cv': 'Download CV',
    'contact.shortcut': 'Contact',
    'header.role': 'Full Stack Developer',
    'header.grade': 'Grade',
    'header.lang': 'Language',
    'header.name': 'Juan Manuel Puccio',
    'header.nameShort': 'J. M. Puccio',
    'header.status': 'AVAILABLE · FULL-TIME',
    'nav.label': 'Main navigation',
    'nav.hero': 'Home',
    'nav.belts': 'Belts',
    'nav.friction': 'Friction',
    'nav.projects': 'Projects',
    'nav.stack': 'Stack',
    'nav.principles': 'Principles',
    'nav.contact': 'Contact',
    'loader.loading': 'LOADING',
    'loader.name': 'JUAN MANUEL PUCCIO',
    'loader.eyebrow': 'FULL STACK · ROSARIO',
    'skills.readMore': 'Read more',
  },
  pt: {
    'meta.title': 'Juan Manuel Puccio | Desenvolvedor Full Stack · Auditoria e Automação de Processos',
    'meta.description': 'Desenvolvedor Full Stack especializado em otimização operacional, automações com Python e IA, e sistemas em produção (NodoSur).',
    'hero.btn.cv': 'Baixar CV',
    'contact.shortcut': 'Contato',
    'header.role': 'Desenvolvedor Full Stack',
    'header.grade': 'Grau',
    'header.lang': 'Idioma',
    'header.name': 'Juan Manuel Puccio',
    'header.nameShort': 'J. M. Puccio',
    'header.status': 'DISPONÍVEL · FULL-TIME',
    'nav.label': 'Navegação principal',
    'nav.hero': 'Início',
    'nav.belts': 'Cinturões',
    'nav.friction': 'Fricção',
    'nav.projects': 'Projetos',
    'nav.stack': 'Stack',
    'nav.principles': 'Princípios',
    'nav.contact': 'Contato',
    'loader.loading': 'CARREGANDO',
    'loader.name': 'JUAN MANUEL PUCCIO',
    'loader.eyebrow': 'FULL STACK · ROSÁRIO',
    'skills.readMore': 'Ler mais',
  }
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}
