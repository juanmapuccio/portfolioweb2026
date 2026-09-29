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
    'hero.tagline': 'Desarrollo software que resuelve cuellos de botella operativos reales.',
    'hero.description': 'Vengo de la trinchera administrativa en salud, seguridad social y logística. Construyo sistemas full stack y automatizaciones con foco en la operación diaria del negocio, listo para sumarme a un equipo técnico con dedicación full-time.',
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
    'hero.tagline': 'I build software that resolves real operational bottlenecks.',
    'hero.description': 'Shaped by frontline administration across healthcare, social security, and logistics. I build production-grade full stack applications and automations focused on daily business operations, ready to join an engineering team full-time.',
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
    'hero.tagline': 'Desenvolvo software que resolve gargalos operacionais reais.',
    'hero.description': 'Forjado na rotina administrativa de saúde, seguridade social e logística. Construo aplicações full stack e automações com foco na operação real de negócios, pronto para integrar uma equipe técnica em regime full-time.',
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
