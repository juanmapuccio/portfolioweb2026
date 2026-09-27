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
    'nav.contact': 'Contacto',
    'hero.badge': 'Disponible para sumarme a tu equipo de ingeniería',
    'hero.name': 'Juan Manuel Puccio',
    'hero.role': 'Desarrollador Full Stack · Especialista Administrativo · Creador de NodoSur',
    'hero.tagline': 'Software de producto y automatizaciones que resuelven fricciones operativas reales.',
    'hero.description': 'Desarrollador enfocado en producto con cimientos técnicos y trinchera operativa en salud masiva, logística y sector público. Construyo sistemas web resilientes con TypeScript, bots en Python e integraciones fiscales para equipos que necesitan impacto y estabilidad.',
    'hero.avatar.role': 'Desarrollador Full Stack',
    'hero.avatar.sub': 'Creador de NodoFit',
    'hero.btn.cv': 'Descargar CV',
    'hero.btn.qr': 'Ver QR Móvil',
    'projects.title': 'Proyectos en Producción & Casos Reales',
    'projects.subtitle': 'Sistemas reales desplegados con usuarios activos que demuestran mi capacidad de arquitectura, entrega y resolución.',
    'experience.title': 'Trayectoria & Trinchera Operativa',
    'experience.subtitle': 'Desde la gestión pública y la salud de alta demanda, hasta el desarrollo de software a medida.',
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
    'nav.contact': 'Contact',
    'hero.badge': 'Open to engineering & product roles',
    'hero.name': 'Juan Manuel Puccio',
    'hero.role': 'Full Stack Developer · Operations Specialist · Founder of NodoSur',
    'hero.tagline': 'Product software and automations that resolve real operational bottlenecks.',
    'hero.description': 'Product-focused engineer combining technical foundations with frontline operations across healthcare, logistics, and government systems. I build resilient web apps with TypeScript, Python automations, and fiscal APIs.',
    'hero.avatar.role': 'Full Stack Developer',
    'hero.avatar.sub': 'Creator of NodoFit',
    'hero.btn.cv': 'Download CV',
    'hero.btn.qr': 'View Mobile QR',
    'projects.title': 'Production Projects & Case Studies',
    'projects.subtitle': 'Live production software with paying users demonstrating end-to-end architecture, delivery, and reliability.',
    'experience.title': 'Journey & Operational Experience',
    'experience.subtitle': 'From high-demand healthcare and public administration to custom software engineering.',
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
    'nav.contact': 'Contato',
    'hero.badge': 'Disponível para ingressar na sua equipe',
    'hero.name': 'Juan Manuel Puccio',
    'hero.role': 'Desenvolvedor Full Stack · Especialista Operacional · Criador da NodoSur',
    'hero.tagline': 'Software de produto e automações que resolvem gargalos operacionais reais.',
    'hero.description': 'Desenvolvedor orientado a produto com formação técnica e vivência prática em saúde, logística e gestão pública. Construo aplicações web resilientes com TypeScript, automações em Python e integrações fiscais.',
    'hero.avatar.role': 'Desenvolvedor Full Stack',
    'hero.avatar.sub': 'Criador do NodoFit',
    'hero.btn.cv': 'Baixar CV',
    'hero.btn.qr': 'Ver QR Móvel',
    'projects.title': 'Projetos em Produção & Casos Reais',
    'projects.subtitle': 'Sistemas em produção com usuários ativos que comprovam capacidade de entrega, arquitetura e estabilidade.',
    'experience.title': 'Trajetória & Vivência Operacional',
    'experience.subtitle': 'Da gestão pública e saúde de alta demanda ao desenvolvimento de software sob medida.',
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
