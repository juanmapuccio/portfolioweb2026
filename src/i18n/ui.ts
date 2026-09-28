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
    'nav.projects': 'Proyectos',
    'nav.experience': 'Trayectoria',
    'nav.skills': 'Habilidades',
    'nav.education': 'Formación',
    'nav.contact': 'Contacto',
    'hero.badge': 'Disponible',
    'hero.name': 'Juan Manuel Puccio',
    'hero.role': 'Desarrollador Full Stack — Disponibilidad full-time',
    'hero.tagline': 'Construyo sistemas que siguen funcionando sin mí.',
    'hero.description': 'Diseño, despliego y estabilizo software de negocio en producción, con usuarios reales. Esa capacidad de construir sistemas confiables, que siguen funcionando una vez entregados, es la que quiero poner al servicio de un equipo, con dedicación full-time.',
    'hero.avatar.role': 'Desarrollador Full Stack',
    'hero.avatar.sub': 'Sistemas en producción, usuarios reales',
    'hero.btn.cv': 'Descargar CV',
    'hero.btn.qr': 'Ver QR Móvil',
    'qr.modal.title': 'Acceso Rápido Móvil',
    'qr.modal.desc': 'Escaneá este código QR para abrir el portfolio o guardarlo en tu smartphone.',
    'qr.modal.close': 'Cerrar'
  },
  en: {
    'meta.title': 'Juan Manuel Puccio | Full Stack Developer & Process Consultant',
    'meta.description': 'Full Stack Developer focused on operational optimization, Python & AI automations, and production systems (NodoSur).',
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.skills': 'Skills',
    'nav.education': 'Education',
    'nav.contact': 'Contact',
    'hero.badge': 'Available',
    'hero.name': 'Juan Manuel Puccio',
    'hero.role': 'Full Stack Developer — Full-time availability',
    'hero.tagline': 'I build systems that keep running without me.',
    'hero.description': 'I design, ship, and stabilize production business software with real users. That ability to build reliable systems that keep running after delivery is what I want to bring to a team, full-time.',
    'hero.avatar.role': 'Full Stack Developer',
    'hero.avatar.sub': 'Production systems, real users',
    'hero.btn.cv': 'Download CV',
    'hero.btn.qr': 'View Mobile QR',
    'qr.modal.title': 'Quick Mobile Access',
    'qr.modal.desc': 'Scan this QR code to view this portfolio or save it on your smartphone.',
    'qr.modal.close': 'Close'
  },
  pt: {
    'meta.title': 'Juan Manuel Puccio | Desenvolvedor Full Stack & Consultor de Processos',
    'meta.description': 'Desenvolvedor Full Stack focado em otimização operacional, automações com Python e IA, e sistemas em produção (NodoSur).',
    'nav.projects': 'Projetos',
    'nav.experience': 'Experiência',
    'nav.skills': 'Habilidades',
    'nav.education': 'Formação',
    'nav.contact': 'Contato',
    'hero.badge': 'Disponível',
    'hero.name': 'Juan Manuel Puccio',
    'hero.role': 'Desenvolvedor Full Stack — Disponibilidade full-time',
    'hero.tagline': 'Construo sistemas que continuam funcionando sem mim.',
    'hero.description': 'Projeto, implanto e estabilizo software de negócio em produção, com usuários reais. Essa capacidade de construir sistemas confiáveis, que continuam funcionando depois de entregues, é o que quero colocar a serviço de uma equipe, em dedicação full-time.',
    'hero.avatar.role': 'Desenvolvedor Full Stack',
    'hero.avatar.sub': 'Sistemas em produção, usuários reais',
    'hero.btn.cv': 'Baixar CV',
    'hero.btn.qr': 'Ver QR Móvel',
    'qr.modal.title': 'Acesso Móvel Rápido',
    'qr.modal.desc': 'Escaneie este código QR para abrir o portfólio ou salvá-lo em seu smartphone.',
    'qr.modal.close': 'Fechar'
  }
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang]?.[key] || ui[defaultLang][key];
  };
}
