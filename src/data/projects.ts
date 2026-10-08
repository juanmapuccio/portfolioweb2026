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
      impact: 'Clientes activos en producción (Satori Dojo, Don Pizza) con monitoreo y control de versiones centralizado, y consultoría IT y gestión de base de datos para Seiton Motors.',
      url: 'https://nodosur.dev',
      tech: ['Astro', 'TypeScript', 'React', 'GSAP'],
      featured: true
    },
    {
      id: 'nodofit',
      badge: 'SaaS en Producción',
      name: 'NodoFit',
      role: 'Creador & Arquitecto Full Stack',
      category: 'Gestión para Gyms, Dojos, Entrenadores & Clubes con Canchas',
      description: 'Sistema integral nacido de la experiencia con Satori Dojo, al ver que el producto tenía que crecer. Gestiona gimnasios, entrenadores personales, dojos y clubes con reservas de canchas (fútbol, pádel, tenis), con control de ingresos y gestor de cuotas.',
      problem: 'Pérdida de cobros, registros manuales en planillas, reservas de canchas sin control y falta de seguimiento del acceso y del estado de cuotas y membresías.',
      solution: 'Plataforma ágil con dashboard operativo en tiempo real, reservas de canchas, alertas de cuotas y membresías vencidas y métricas de retención.',
      impact: 'En producción con usuarios reales: centraliza cobros, cuotas, accesos y reservas que antes se llevaban a mano.',
      url: 'https://nodofit.com.ar',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'Supabase', 'REST APIs'],
      featured: false
    },
    {
      id: 'satori',
      badge: 'Gestión Deportiva & Club',
      name: 'Satori Dojo',
      role: 'Consultor IT & Desarrollador',
      category: 'Plataforma para Artes Marciales',
      description: 'Sistema personalizado para dojo de artes marciales: gestión académica, graduaciones, aranceles y presencia institucional.',
      problem: 'Falta de centralización entre el progreso técnico de los practicantes, cobros de cuotas y difusión de eventos.',
      solution: 'Portal unificado con seguimiento pedagógico marcial, control de asistencia y pasarela de comunicación con las familias.',
      impact: 'Implementado y en producción, optimizando el tiempo de gestión del equipo docente.',
      url: 'https://satoridojo.vercel.app',
      tech: ['Next.js', 'Supabase', 'Supabase Edge', 'Cron Jobs'],
      featured: false
    },
    {
      id: 'donpizza',
      badge: 'Rediseño Web & Sistema de Pedidos',
      name: 'Don Pizza Rosario',
      role: 'Desarrollador & Consultor Operativo',
      category: 'E-commerce & Operación Gastronómica',
      description: 'Rediseño completo de la web original del local, con un sistema propio de gestión de pedidos: catálogo digital, toma de pedidos rápidos y despacho en un entorno gastronómico de alta rotación.',
      problem: 'Fricciones en la toma de pedidos telefónicos y cuellos de botella en horas pico de elaboración y entrega.',
      solution: 'Aplicación ultra-rápida pensada para smartphones, con catálogo dinámico y canal directo a cocina/despacho.',
      impact: 'En producción real, validando UX móvil y velocidad de carga en un entorno de alta demanda.',
      url: 'https://donpizzarosario.vercel.app',
      tech: ['Next.js', 'Mobile First', 'Fast Checkout', 'Cloud'],
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
      description: 'Institutional platform and cooperative workspace to deploy custom software, business systems, and business automation.',
      problem: 'Companies and shops operated with disconnected generic software and high licensing costs.',
      solution: 'Proprietary systems deployed on our own cloud infrastructure (Linux, Docker, GitHub Actions) with fiscal integrations.',
      impact: 'Active production clients (Satori Dojo, Don Pizza) with centralized versioning and monitoring, plus IT consulting and database management for Seiton Motors.',
      url: 'https://nodosur.dev',
      tech: ['Astro', 'TypeScript', 'React', 'GSAP'],
      featured: true
    },
    {
      id: 'nodofit',
      badge: 'Production SaaS',
      name: 'NodoFit',
      role: 'Creator & Full Stack Architect',
      category: 'Management for Gyms, Dojos, Trainers & Clubs with Courts',
      description: 'An integral system born from the Satori Dojo experience, which showed the product had to grow. It manages gyms, personal trainers, dojos, and clubs with court bookings (football, padel, tennis), with revenue control and a dues manager.',
      problem: 'Lost payments, manual spreadsheet records, unmanaged court bookings, and no tracking of access or of dues and membership status.',
      solution: 'Agile platform with a real-time operational dashboard, court bookings, overdue dues and membership alerts, and retention metrics.',
      impact: 'Live in production with real users: it centralizes payments, dues, access, and bookings that used to be handled by hand.',
      url: 'https://nodofit.com.ar',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'Supabase', 'REST APIs'],
      featured: false
    },
    {
      id: 'satori',
      badge: 'Sports & Club Management',
      name: 'Satori Dojo',
      role: 'IT Consultant & Developer',
      category: 'Martial Arts Platform',
      description: 'Custom-built system for a martial arts dojo: academic management, belt advancements, dues, and institutional presence.',
      problem: "Lack of centralization between practitioners' technical progress, fee collection, and event promotion.",
      solution: 'Unified portal with martial pedagogical tracking, attendance control, and a communication channel with families.',
      impact: "Implemented and live in production, optimizing the teaching staff's management time.",
      url: 'https://satoridojo.vercel.app',
      tech: ['Next.js', 'Supabase', 'Supabase Edge', 'Cron Jobs'],
      featured: false
    },
    {
      id: 'donpizza',
      badge: 'Website Redesign & Ordering System',
      name: 'Don Pizza Rosario',
      role: 'Developer & Operational Consultant',
      category: 'E-commerce & Food Service Operations',
      description: 'Full redesign of the original website, paired with a custom order-management system: digital catalog, fast ordering, and dispatch for peak rush hours in a high-demand culinary business.',
      problem: 'Friction in taking phone orders and bottlenecks at peak preparation and delivery hours.',
      solution: 'Ultra-fast smartphone-first app with a dynamic catalog and a direct channel to kitchen/dispatch.',
      impact: 'Live in production, validating mobile UX and load performance under real high-demand conditions.',
      url: 'https://donpizzarosario.vercel.app',
      tech: ['Next.js', 'Mobile First', 'Fast Checkout', 'Cloud'],
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
      description: 'Plataforma institucional e espaço de trabalho cooperativo para implantar software sob medida, sistemas de gestão e automações de negócio.',
      problem: 'Empresas e comércios operavam com software genérico desintegrado e altos custos de licenciamento.',
      solution: 'Sistemas proprietários implantados em infraestrutura cloud própria (Linux, Docker, GitHub Actions) com integrações fiscais.',
      impact: 'Clientes ativos em produção (Satori Dojo, Don Pizza) com monitoramento e controle de versões centralizado, e consultoria de TI e gestão de banco de dados para a Seiton Motors.',
      url: 'https://nodosur.dev',
      tech: ['Astro', 'TypeScript', 'React', 'GSAP'],
      featured: true
    },
    {
      id: 'nodofit',
      badge: 'SaaS em Produção',
      name: 'NodoFit',
      role: 'Criador & Arquiteto Full Stack',
      category: 'Gestão para Academias, Dojos, Treinadores & Clubes com Quadras',
      description: 'Sistema integral nascido da experiência com o Satori Dojo, que mostrou que o produto precisava crescer. Gerencia academias, personal trainers, dojos e clubes com reservas de quadras (futebol, padel, tênis), com controle de receitas e gestor de mensalidades.',
      problem: 'Perda de cobranças, registros manuais em planilhas, reservas de quadras sem controle e falta de acompanhamento do acesso e do status das mensalidades.',
      solution: 'Plataforma ágil com dashboard operacional em tempo real, reservas de quadras, alertas de mensalidades vencidas e métricas de retenção.',
      impact: 'Em produção com usuários reais: centraliza cobranças, mensalidades, acessos e reservas que antes eram feitos à mão.',
      url: 'https://nodofit.com.ar',
      tech: ['Next.js', 'PostgreSQL', 'Tailwind', 'Supabase', 'REST APIs'],
      featured: false
    },
    {
      id: 'satori',
      badge: 'Gestão Esportiva & Clube',
      name: 'Satori Dojo',
      role: 'Consultor IT & Desenvolvedor',
      category: 'Plataforma para Artes Marciais',
      description: 'Sistema personalizado para dojo de artes marciais: gestão acadêmica, graduações, mensalidades e presença institucional.',
      problem: 'Falta de centralização entre o progresso técnico dos praticantes, cobrança de mensalidades e divulgação de eventos.',
      solution: 'Portal unificado com acompanhamento pedagógico marcial, controle de frequência e canal de comunicação com as famílias.',
      impact: 'Implantado e em produção, otimizando o tempo de gestão da equipe docente.',
      url: 'https://satoridojo.vercel.app',
      tech: ['Next.js', 'Supabase', 'Supabase Edge', 'Cron Jobs'],
      featured: false
    },
    {
      id: 'donpizza',
      badge: 'Redesenho Web & Sistema de Pedidos',
      name: 'Don Pizza Rosario',
      role: 'Desenvolvedor & Consultor Operacional',
      category: 'E-commerce & Operação Gastronômica',
      description: 'Redesenho completo do site original, com um sistema próprio de gestão de pedidos: catálogo digital, pedidos rápidos e expedição em um comércio gastronômico de alta demanda.',
      problem: 'Fricções na tomada de pedidos por telefone e gargalos nos horários de pico de preparo e entrega.',
      solution: 'Aplicação ultra-rápida pensada para smartphones, com catálogo dinâmico e canal direto com cozinha/expedição.',
      impact: 'Em produção real, validando UX móvel e velocidade em um ambiente de alta demanda.',
      url: 'https://donpizzarosario.vercel.app',
      tech: ['Next.js', 'Mobile First', 'Fast Checkout', 'Cloud'],
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
    bot1Metric: 'De horas de marcado manual a segundos.',
    bot2Title: 'Facturación Electrónica Fiscal ARCA (ex AFIP)',
    bot2Desc: 'Integración vía Webservices seguros con el organismo tributario para la emisión automatizada de comprobantes fiscales, con validación humana en el loop.',
    bot2Metric: 'Cumplimiento normativo y trazabilidad contable.'
  },
  en: {
    title: 'Automations & Business Bots',
    subtitle: 'Solving real operational bottlenecks in businesses and organizations',
    bot1Title: 'Bank Statement Parser & Reconciliation Bot (Python)',
    bot1Desc: 'Processes heterogeneous bank PDF statements across multiple banks, identifies VAT rates, and automatically totals transactions for accounting settlements.',
    bot1Metric: 'From hours of manual marking to seconds.',
    bot2Title: 'Fiscal Electronic Invoicing ARCA (ex AFIP)',
    bot2Desc: 'Integration via secure webservices with the tax authority for automated issuance of fiscal receipts, with human validation in the loop.',
    bot2Metric: 'Regulatory compliance and accounting traceability.'
  },
  pt: {
    title: 'Automações & Bots de Negócio',
    subtitle: 'Resolvendo gargalos operacionais reais em empresas e organizações',
    bot1Title: 'Leitor & Conciliador de Extratos Bancários (Python)',
    bot1Desc: 'Processa extratos bancários em PDF de múltiplas instituições, identifica alíquotas de IVA e totaliza movimentações automaticamente para liquidações contábeis.',
    bot1Metric: 'De horas de marcação manual a segundos.',
    bot2Title: 'Faturamento Eletrônico Fiscal ARCA (ex AFIP)',
    bot2Desc: 'Integração via Webservices seguros com o órgão tributário para emissão automatizada de comprovantes fiscais, com validação humana no loop.',
    bot2Metric: 'Conformidade normativa e rastreabilidade contábil.'
  }
};
