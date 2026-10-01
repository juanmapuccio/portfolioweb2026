import type { Lang } from '../i18n/ui';

export interface SkillCategory {
  id: string;
  title: string;
  badge: string;
  description: string;
  items: string[];
}

export interface PhilosophyPillar {
  title: string;
  subtitle: string;
  description: string;
  quote: string;
}

export interface SkillsSectionContent {
  categories: SkillCategory[];
  philosophy: PhilosophyPillar[];
}

export const skillsData: Record<Lang, SkillsSectionContent> = {
  es: {
    categories: [
      {
        id: 'frontend',
        title: 'Core Frontend & Arquitectura UI',
        badge: 'UI / UX & Performance',
        description: 'Construcción de interfaces resilientes, accesibles y de carga inmediata con mínima sobrecarga de JavaScript.',
        items: ['TypeScript Estricto', 'React', 'Next.js', 'Astro 7', 'Tailwind CSS', 'HTML5 Semántico', 'Zero CLS / Web Vitals']
      },
      {
        id: 'backend',
        title: 'Backend, Automatización & Datos',
        badge: 'Lógica & Negocio',
        description: 'Resolución de fricciones operativas mediante scripts de análisis contable, APIs tipadas e integraciones gubernamentales.',
        items: ['Python', 'PostgreSQL', 'Node.js / Bun', 'REST APIs', 'Webservices ARCA (AFIP)', 'Procesamiento de PDFs & Datos']
      },
      {
        id: 'devops',
        title: 'Cloud, Infraestructura & DevOps',
        badge: 'Servidores & CI/CD',
        description: 'Despliegues autónomos en entornos cloud propios sin depender de cajas negras costosas ni arquitecturas infladas.',
        items: ['Linux (Ubuntu Server)', 'Docker & Compose', 'GitHub Actions', 'Nginx Reverse Proxy', 'Vercel Edge', 'Seguridad & SSL']
      },
      {
        id: 'business',
        title: 'Operación de Campo & Trinchera',
        badge: 'Visión de Negocio',
        description: 'Capacidad de dialogar de igual a igual con directivos de sanatorios, personal de maestranza o dueños de comercios.',
        items: ['Auditoría Médica & Nomenclador', 'Facturación Contable & IVA', 'Gestión Masiva (ANSES)', 'Logística & Stock Real', 'Living Lab Comercial']
      },
      {
        id: 'certifications',
        title: 'Certificaciones & Idiomas',
        badge: 'Formación Continua',
        description: 'Formación certificada en las tres nubes principales y una base sólida en ciencias de la computación.',
        items: ['AWS Certified Cloud Practitioner (2025)', 'Microsoft Certified: Azure Fundamentals · AZ-900 (2025)', 'Google Cloud Computing Foundations (2024)', 'CS50: Introduction to Computer Science · Harvard/edX (2023)', 'Python desde Cero a Desarrollador · Udemy (2022)', 'Inglés B2: lectura técnica fluida']
      }
    ],
    philosophy: [
      {
        title: 'Pensamiento Crítico y Ética de Sistemas',
        subtitle: 'Licenciatura en Filosofía (UNR, en curso) · Criterio Humano en el Loop',
        description: 'Ninguna automatización crítica debería correr a ciegas. En flujos sensibles —como la facturación fiscal con ARCA (ex AFIP)— el código valida, calcula y estructura, pero la última palabra siempre la tiene una persona. Construir software responsable no es acelerar procesos hasta que se rompan sin que nadie sepa por qué, sino diseñar herramientas transparentes, auditables y gobernables por quienes las operan.',
        quote: 'Un bot que automatiza sin nadie revisando el resultado no es una solución, es un riesgo nuevo.'
      },
      {
        title: 'Liderazgo, Disciplina y Templanza Marcial',
        subtitle: 'Profesor Internacional de Taekwondo ITF (+10 años) · 1º Dan en Producción',
        description: 'Más de diez años al frente de clases para niños, jóvenes y adultos enseñan lo que ningún manual de ingeniería explica: la paciencia pedagógica para traducir lo complejo a un lenguaje simple, la disciplina para sostener estándares cuando nadie está mirando, y el temple para diagnosticar y resolver con cabeza fría cuando un servicio productivo entra en crisis.',
        quote: 'La constancia vence a la improvisación; la templanza resuelve la urgencia.'
      }
    ]
  },
  en: {
    categories: [
      {
        id: 'frontend',
        title: 'Core Frontend & UI Architecture',
        badge: 'UI / UX & Performance',
        description: 'Building resilient, accessible, instant-loading interfaces with minimal JavaScript overhead.',
        items: ['Strict TypeScript', 'React', 'Next.js', 'Astro 7', 'Tailwind CSS', 'Semantic HTML5', 'Zero CLS / Web Vitals']
      },
      {
        id: 'backend',
        title: 'Backend, Automation & Data',
        badge: 'Business Logic',
        description: 'Resolving operational friction through accounting analysis scripts, typed APIs, and government integrations.',
        items: ['Python', 'PostgreSQL', 'Node.js / Bun', 'REST APIs', 'ARCA (AFIP) Webservices', 'PDF & Data Processing']
      },
      {
        id: 'devops',
        title: 'Cloud, Infrastructure & DevOps',
        badge: 'Servers & CI/CD',
        description: 'Autonomous deployments on your own cloud environments without relying on expensive black boxes or bloated architectures.',
        items: ['Linux (Ubuntu Server)', 'Docker & Compose', 'GitHub Actions', 'Nginx Reverse Proxy', 'Vercel Edge', 'Security & SSL']
      },
      {
        id: 'business',
        title: 'Field Operations & the Trenches',
        badge: 'Business Vision',
        description: 'Ability to speak on equal terms with sanatorium directors, maintenance staff, or shop owners.',
        items: ['Medical Auditing & Fee Schedule', 'Accounting Billing & VAT', 'Mass Case Management (ANSES)', 'Logistics & Real Stock', 'Commercial Living Lab']
      },
      {
        id: 'certifications',
        title: 'Certifications & Languages',
        badge: 'Continuous Learning',
        description: 'Certified across the three major clouds, with a solid computer science foundation.',
        items: ['AWS Certified Cloud Practitioner (2025)', 'Microsoft Certified: Azure Fundamentals · AZ-900 (2025)', 'Google Cloud Computing Foundations (2024)', 'CS50: Introduction to Computer Science · Harvard/edX (2023)', 'Python from Zero to Developer · Udemy (2022)', 'English B2: fluent technical reading']
      }
    ],
    philosophy: [
      {
        title: 'Critical Thinking & Systems Ethics',
        subtitle: 'Undergraduate in Philosophy (UNR, in progress) · Human in the Loop',
        description: "No mission-critical automation should ever run blind. In sensitive domains—like fiscal compliance with tax authorities (ARCA/AFIP)—code validates, formats, and speeds up the workflow, but the final verdict stays human. Responsible engineering isn't about moving fast and breaking things without an audit trail; it's about building transparent, resilient systems that empower people rather than replace oversight.",
        quote: "A bot that automates without anyone checking the output isn't a solution, it's a new risk."
      },
      {
        title: 'Leadership, Discipline & Martial Composure',
        subtitle: 'International Taekwondo ITF Instructor (+10 years) · 1st Dan in Production',
        description: 'Over a decade instructing children, youth, and adults instills what no technical manual can: the pedagogical patience to bridge complex logic with real business needs, the discipline to uphold code quality under pressure, and the absolute composure required to troubleshoot cleanly when a production outage strikes.',
        quote: 'Consistency beats improvisation; composure resolves urgency.'
      }
    ]
  },
  pt: {
    categories: [
      {
        id: 'frontend',
        title: 'Core Frontend & Arquitetura UI',
        badge: 'UI / UX & Performance',
        description: 'Construção de interfaces resilientes, acessíveis e de carregamento imediato, com sobrecarga mínima de JavaScript.',
        items: ['TypeScript Estrito', 'React', 'Next.js', 'Astro 7', 'Tailwind CSS', 'HTML5 Semântico', 'Zero CLS / Web Vitals']
      },
      {
        id: 'backend',
        title: 'Backend, Automação & Dados',
        badge: 'Lógica de Negócios',
        description: 'Resolução de fricções operacionais mediante scripts de análise contábil, APIs tipadas e integrações governamentais.',
        items: ['Python', 'PostgreSQL', 'Node.js / Bun', 'REST APIs', 'Webservices ARCA (AFIP)', 'Processamento de PDFs e Dados']
      },
      {
        id: 'devops',
        title: 'Cloud, Infraestrutura & DevOps',
        badge: 'Servidores & CI/CD',
        description: 'Implantações autônomas em ambientes cloud próprios, sem depender de caixas-pretas caras nem de arquiteturas inchadas.',
        items: ['Linux (Ubuntu Server)', 'Docker & Compose', 'GitHub Actions', 'Nginx Reverse Proxy', 'Vercel Edge', 'Segurança & SSL']
      },
      {
        id: 'business',
        title: 'Operação de Campo & Trincheira',
        badge: 'Visão de Negócio',
        description: 'Capacidade de dialogar de igual para igual com diretores de sanatórios, equipe de manutenção ou donos de comércios.',
        items: ['Auditoria Médica & Nomenclador', 'Faturamento Contábil & IVA', 'Gestão em Massa (ANSES)', 'Logística & Estoque Real', 'Living Lab Comercial']
      },
      {
        id: 'certifications',
        title: 'Certificações & Idiomas',
        badge: 'Formação Contínua',
        description: 'Formação certificada nas três principais nuvens e uma base sólida em ciência da computação.',
        items: ['AWS Certified Cloud Practitioner (2025)', 'Microsoft Certified: Azure Fundamentals · AZ-900 (2025)', 'Google Cloud Computing Foundations (2024)', 'CS50: Introduction to Computer Science · Harvard/edX (2023)', 'Python do Zero ao Desenvolvedor · Udemy (2022)', 'Inglês B2: leitura técnica fluente']
      }
    ],
    philosophy: [
      {
        title: 'Pensamento Crítico & Ética de Sistemas',
        subtitle: 'Graduação em Filosofia (UNR, em andamento) · Critério Humano no Loop',
        description: 'Nenhuma automação crítica deve rodar às cegas. Em fluxos sensíveis — como a integração fiscal com a ARCA (ex AFIP) —, o código valida, calcula e estrutura, mas a decisão final é humana. Engenharia responsável não é acelerar processos até que quebrem sem explicação; é construir sistemas auditáveis, claros e governados por quem opera.',
        quote: 'Um bot que automatiza sem ninguém revisando o resultado não é uma solução, é um risco novo.'
      },
      {
        title: 'Liderança, Disciplina & Autocontrole Marcial',
        subtitle: 'Professor Internacional de Taekwondo ITF (+10 anos) · 1º Dan em Produção',
        description: 'Mais de dez anos liderando turmas de crianças, jovens e adultos ensinam o que nenhum manual técnico traz: a paciência didática para traduzir o complexo em linguagem de negócios, a disciplina diária para manter padrões rigorosos e a serenidade para agir com clareza em incidentes de produção.',
        quote: 'A constância supera o improviso; a serenidade resolve a urgência.'
      }
    ]
  }
};
