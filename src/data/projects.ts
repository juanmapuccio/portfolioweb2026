import type { Lang } from '../i18n/ui';

export interface ProjectData {
  id: string;
  badge: string;
  name: string;
  role: string;
  category: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  url: string;
  tech: string[];
  featured?: boolean;
}

export const projectsContent: Record<Lang, ProjectData[]> = {
  es: [
    {
      id: 'nodosur',
      badge: 'Software Factory & Cloud',
      name: 'NodoSur',
      role: 'Fundador & Desarrollador Principal',
      category: 'Sistemas Propios & Consultoría IT',
      description: 'Plataforma institucional y espacio de trabajo cooperativo para desplegar software a medida, sistemas de gestión y automatizaciones de negocio.',
      problem: 'Empresas y comercios operaban con software genérico desintegrado y altos costos de licenciamiento.',
      solution: 'Desarrollo de sistemas propietarios desplegados en infraestructura cloud propia (Linux, Docker, GitHub Actions) con integraciones fiscales.',
      impact: 'Clientes activos en producción (Seiton Motors, Satori Dojo, Don Pizza) con monitoreo y control de versiones centralizado.',
      url: 'https://nodosur.dev',
      tech: ['TypeScript', 'React', 'Docker', 'Linux Cloud', 'CI/CD'],
      featured: true
    },
    {
      id: 'nodofit',
      badge: 'SaaS en Producción',
      name: 'NodoFit',
      role: 'Creador & Arquitecto Full Stack',
      category: 'Gestión para Dojos, Gyms & Entrenadores',
      description: 'Plataforma SaaS en producción para la administración operativa, membresías, asistencias y flujo de caja en centros de entrenamiento, dojos y gimnasios.',
      problem: 'Pérdida de cobros, registros manuales en planillas y falta de control en el acceso y estado de las membresías.',
      solution: 'Plataforma ágil con dashboard operativo en tiempo real, alertas de cuotas vencidas y métricas de retención de alumnos.',
      impact: 'En producción activa reduciendo a cero las horas de conciliación manual de cobros y accesos.',
      url: 'https://nodofit.com.ar',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'REST APIs', 'Supabase'],
      featured: true
    },
    {
      id: 'satori',
      badge: 'Gestión Deportiva & Club',
      name: 'Satori Dojo',
      role: 'Consultor IT & Desarrollador',
      category: 'Plataforma para Artes Marciales',
      description: 'Sistema web de gestión académica, graduaciones, aranceles y presencia institucional para el dojo de Taekwondo y disciplinas afines.',
      problem: 'Falta de centralización entre el progreso técnico de los practicantes, cobros de cuotas y difusión de eventos.',
      solution: 'Portal unificado con seguimiento pedagógico marcial, control de asistencia y pasarela de comunicación con las familias.',
      impact: 'Implementado y en producción, optimizando el tiempo de gestión del equipo docente.',
      url: 'https://satoridojo.vercel.app',
      tech: ['Astro', 'TypeScript', 'Responsive UI', 'Vercel Edge'],
      featured: false
    },
    {
      id: 'donpizza',
      badge: 'Living Lab Operativo',
      name: 'Don Pizza Rosario',
      role: 'Desarrollador & Consultor Operativo',
      category: 'E-commerce & Operación Gastronómica',
      description: 'Plataforma viva para catálogo digital, toma de pedidos rápidos y despacho en tiempo real en un entorno gastronómico de alta rotación.',
      problem: 'Fricciones en la toma de pedidos telefónicos y cuellos de botella en horas pico de elaboración y entrega.',
      solution: 'Aplicación ultra-rápida pensada para smartphones, con catálogo dinámico y canal directo a cocina/despacho.',
      impact: 'En producción real, actuando además como banco de pruebas para validar UX móvil y velocidad de carga.',
      url: 'https://donpizzarosario.vercel.app',
      tech: ['React', 'Mobile First', 'Fast Checkout', 'Cloud'],
      featured: false
    }
  ],
  en: [
    {
      id: 'nodosur',
      badge: 'Software Factory & Cloud',
      name: 'NodoSur',
      role: 'Founder & Lead Developer',
      category: 'Proprietary Systems & IT Consulting',
      description: 'Corporate brand and collaborative workspace delivering custom business software, operational ERPs, and automation.',
      problem: 'Small and medium businesses struggled with disconnected generic tools and high licensing fees.',
      solution: 'In-house software deployed on self-managed cloud infrastructure (Linux, Docker, GitHub Actions) with fiscal APIs.',
      impact: 'Active production clients (Seiton Motors, Satori Dojo, Don Pizza) with centralized versioning and monitoring.',
      url: 'https://nodosur.dev',
      tech: ['TypeScript', 'React', 'Docker', 'Linux Cloud', 'CI/CD'],
      featured: true
    },
    {
      id: 'nodofit',
      badge: 'Production SaaS',
      name: 'NodoFit',
      role: 'Creator & Full Stack Architect',
      category: 'Gym Management Platform',
      description: 'Comprehensive SaaS platform for fitness centers handling membership management, attendance tracking, and cash flow.',
      problem: 'Lost revenue, manual spreadsheet tracking, and zero visibility into member retention and expiring fees.',
      solution: 'Streamlined web app with real-time operational dashboard, expiration reminders, and attendance analytics.',
      impact: 'Running live in production, eliminating manual reconciliation overhead for owners and coaches.',
      url: 'https://nodofit.com.ar',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'REST APIs', 'Supabase'],
      featured: true
    },
    {
      id: 'satori',
      badge: 'Sports & Club Management',
      name: 'Satori Dojo',
      role: 'IT Consultant & Developer',
      category: 'Martial Arts Platform',
      description: 'Web management system and institutional presence for a martial arts academy, tracking curriculum progress and dues.',
      problem: 'Fragmented record-keeping between student belt advancements, monthly fees, and student communications.',
      solution: 'Centralized portal combining pedagogical martial tracking, attendance validation, and family engagement.',
      impact: 'Live in production, saving hours of weekly administrative overhead for the teaching staff.',
      url: 'https://satoridojo.vercel.app',
      tech: ['Astro', 'TypeScript', 'Responsive UI', 'Vercel Edge'],
      featured: false
    },
    {
      id: 'donpizza',
      badge: 'Operational Living Lab',
      name: 'Don Pizza Rosario',
      role: 'Developer & Operational Consultant',
      category: 'Food Delivery & Real-time Orders',
      description: 'Live ordering and digital catalog system designed for peak rush hours in a high-demand culinary business.',
      problem: 'Bottlenecks during peak phone order hours and miscommunication between front counter and kitchen staff.',
      solution: 'Ultra-fast mobile-first ordering app with direct kitchen dispatch and clear item customizers.',
      impact: 'Live in production, serving as a real-world testing ground for mobile UX and instant load performance.',
      url: 'https://donpizzarosario.vercel.app',
      tech: ['React', 'Mobile First', 'Fast Checkout', 'Cloud'],
      featured: false
    }
  ],
  pt: [
    {
      id: 'nodosur',
      badge: 'Software Factory & Cloud',
      name: 'NodoSur',
      role: 'Fundador & Desenvolvedor Principal',
      category: 'Sistemas Próprios & Consultoria IT',
      description: 'Plataforma corporativa e espaço de trabalho colaborativo para implantação de software sob medida e automações de negócio.',
      problem: 'Empresas e comércios utilizavam ferramentas genéricas desconectadas e com altos custos de licença.',
      solution: 'Sistemas próprios hospedados em infraestrutura cloud autogerenciada (Linux, Docker, GitHub Actions) com APIs fiscais.',
      impact: 'Clientes ativos em produção (Seiton Motors, Satori Dojo, Don Pizza) com controle de versões e monitoramento.',
      url: 'https://nodosur.dev',
      tech: ['TypeScript', 'React', 'Docker', 'Linux Cloud', 'CI/CD'],
      featured: true
    },
    {
      id: 'nodofit',
      badge: 'SaaS em Produção',
      name: 'NodoFit',
      role: 'Criador & Arquiteto Full Stack',
      category: 'Gestão Completa para Academias',
      description: 'Plataforma SaaS abrangente para administração de academias, controle de membros, frequências e fluxo de caixa.',
      problem: 'Perda de receitas, controle manual em planilhas e falta de acompanhamento de mensalidades a vencer.',
      solution: 'Dashboard operacional em tempo real com alertas de vencimento e relatórios de assiduidade.',
      impact: 'Em produção ativa, eliminando o retrabalho de conciliação financeira para gestores.',
      url: 'https://nodofit.com.ar',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'REST APIs', 'Supabase'],
      featured: true
    },
    {
      id: 'satori',
      badge: 'Gestão Esportiva & Clube',
      name: 'Satori Dojo',
      role: 'Consultor IT & Desenvolvedor',
      category: 'Plataforma para Artes Marciais',
      description: 'Sistema web de gestão acadêmica, graduações, mensalidades e presença institucional para dojo de artes marciais.',
      problem: 'Falta de centralização entre o avanço de faixas dos alunos, cobranças e divulgação.',
      solution: 'Portal unificado com acompanhamento marcial, registro de frequência e canal com as famílias.',
      impact: 'Implantado e em produção, otimizando a rotina administrativa da equipe docente.',
      url: 'https://satoridojo.vercel.app',
      tech: ['Astro', 'TypeScript', 'Responsive UI', 'Vercel Edge'],
      featured: false
    },
    {
      id: 'donpizza',
      badge: 'Living Lab Operacional',
      name: 'Don Pizza Rosario',
      role: 'Desenvolvedor & Consultor Operacional',
      category: 'E-commerce & Operação Gastronômica',
      description: 'Plataforma viva para catálogo digital, pedidos rápidos e expedição em tempo real em um comércio gastronômico de alta demanda.',
      problem: 'Fricções no atendimento telefônico e gargalos durante os horários de pico da cozinha.',
      solution: 'Aplicação móvel ultra-rápida com envio direto de pedidos e catálogo interativo.',
      impact: 'Em produção real, funcionando como laboratório prático para validar UX móvel e velocidade.',
      url: 'https://donpizzarosario.vercel.app',
      tech: ['React', 'Mobile First', 'Fast Checkout', 'Cloud'],
      featured: false
    }
  ]
};

export const automationsContent = {
  es: {
    title: 'Automatizaciones & Bots de Negocio',
    subtitle: 'Resolviendo cuellos de botella reales en empresas y organismos',
    bot1Title: 'Lector & Conciliador de Extractos Bancarios (Python)',
    bot1Desc: 'Procesa PDFs bancarios heterogéneos de múltiples entidades bancarias, identifica alícuotas de IVA y totaliza movimientos automáticamente para liquidaciones contables.',
    bot1Metric: 'Reducción de horas de marcado manual a segundos con 0% de margen de error.',
    bot2Title: 'Facturación Electrónica Fiscal ARCA (ex AFIP)',
    bot2Desc: 'Integración vía Webservices seguros con el organismo tributario para la emisión automatizada de comprobantes fiscales, con validación humana en el loop.',
    bot2Metric: '100% de cumplimiento normativo y trazabilidad contable.'
  },
  en: {
    title: 'Automations & Business Bots',
    subtitle: 'Solving real operational bottlenecks in businesses and organizations',
    bot1Title: 'Bank Statement Parser & Reconciliation Bot (Python)',
    bot1Desc: 'Processes heterogeneous bank PDF statements across multiple banks, identifies VAT rates, and automatically summarizes transactions for accounting settlement.',
    bot1Metric: 'Cut down hours of manual ledger checks to seconds with zero error rate.',
    bot2Title: 'Fiscal Electronic Invoicing ARCA (ex AFIP)',
    bot2Desc: 'Integration via secure web services with the tax authority for automated invoice generation with human validation in the loop.',
    bot2Metric: '100% regulatory compliance and accounting traceability.'
  },
  pt: {
    title: 'Automações & Bots de Negócio',
    subtitle: 'Resolvendo gargalos operacionais reais em empresas e organizações',
    bot1Title: 'Leitor & Conciliador de Extratos Bancários (Python)',
    bot1Desc: 'Processa extratos bancários em PDF de múltiplas instituições, detecta alíquotas de imposto e totaliza valores automaticamente para fechamento contábil.',
    bot1Metric: 'Redução de horas de conciliação manual para segundos com 0% de erro.',
    bot2Title: 'Faturamento Eletrônico Fiscal ARCA (ex AFIP)',
    bot2Desc: 'Integração via Webservices com a autoridade tributária para emissão automatizada de notas fiscais com validação humana no processo.',
    bot2Metric: '100% de conformidade regulatória e rastreabilidade contábil.'
  }
};
