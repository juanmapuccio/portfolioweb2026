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
        items: ['TypeScript Estricto', 'React', 'Next.js', 'Astro 5', 'Tailwind CSS', 'HTML5 Semántico', 'Zero CLS / Web Vitals']
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
      }
    ],
    philosophy: [
      {
        title: 'Pensamiento Crítico y Ética de Sistemas',
        subtitle: 'Licenciatura en Filosofía (UNR — en curso)',
        description: 'No adoptar tecnologías por moda pasajera. Todo sistema de software tiene consecuencias operativas, humanas y éticas. Utilizo la IA como herramienta amplificadora dirigida con rigor humano, nunca como piloto automático acrítico.',
        quote: 'Entender el problema de raíz antes de escribir una sola línea de código.'
      },
      {
        title: 'Liderazgo, Disciplina y Templanza Marcial',
        subtitle: 'Profesor Internacional de Taekwondo ITF (+10 años)',
        description: 'Más de una década formando a niños, jóvenes y adultos. La docencia marcial forja constancia diaria, paciencia pedagógica para explicar conceptos técnicos a usuarios de negocio y calma bajo situaciones de alta demanda o caída de servicios.',
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
        items: ['Strict TypeScript', 'React', 'Next.js', 'Astro 5', 'Tailwind CSS', 'Semantic HTML5', 'Zero CLS / Web Vitals']
      },
      {
        id: 'backend',
        title: 'Backend, Automation & Data',
        badge: 'Business Logic',
        description: 'Eliminating manual bottlenecks through automated accounting parsers, typed APIs, and fiscal integrations.',
        items: ['Python', 'PostgreSQL', 'Node.js / Bun', 'REST APIs', 'ARCA (AFIP) Webservices', 'PDF & Data Processing']
      },
      {
        id: 'devops',
        title: 'Cloud, Infrastructure & DevOps',
        badge: 'Servers & CI/CD',
        description: 'Autonomous deployments on self-hosted cloud instances without expensive black-box lock-in.',
        items: ['Linux (Ubuntu Server)', 'Docker & Compose', 'GitHub Actions', 'Nginx Reverse Proxy', 'Vercel Edge', 'Security & SSL']
      },
      {
        id: 'business',
        title: 'Frontline Operations & Business Reality',
        badge: 'Business Acumen',
        description: 'Speaking directly with healthcare directors, warehouse clerks, and business owners without middleman noise.',
        items: ['Healthcare Billing & Auditing', 'Commercial Logistics & VAT', 'Massive Operations (ANSES)', 'Inventory Control', 'Commercial Living Lab']
      }
    ],
    philosophy: [
      {
        title: 'Critical Thinking & Systems Ethics',
        subtitle: 'Undergraduate in Philosophy (UNR — in progress)',
        description: 'Rejecting hype-driven development. Every piece of software carries human and business consequences. I treat AI as a powerful force multiplier guided by human judgment, never as an uncritical autopilot.',
        quote: 'Understand the root friction before writing a single line of code.'
      },
      {
        title: 'Leadership, Discipline & Martial Composure',
        subtitle: 'International Taekwondo ITF Instructor (+10 years)',
        description: 'Over a decade teaching youth and adults. Martial instruction builds daily consistency, pedagogical patience for non-technical stakeholders, and composure during critical operational pressure.',
        quote: 'Discipline outperforms improvisation; composure resolves urgency.'
      }
    ]
  },
  pt: {
    categories: [
      {
        id: 'frontend',
        title: 'Core Frontend & Arquitetura UI',
        badge: 'UI / UX & Performance',
        description: 'Construção de interfaces resilientes, acessíveis e ultrarrápidas com sobrecarga mínima de JavaScript.',
        items: ['TypeScript Estrito', 'React', 'Next.js', 'Astro 5', 'Tailwind CSS', 'HTML5 Semântico', 'Zero CLS / Web Vitals']
      },
      {
        id: 'backend',
        title: 'Backend, Automação & Dados',
        badge: 'Lógica de Negócios',
        description: 'Resolução de fricções operacionais com robôs em Python, APIs tipadas e integrações governamentais.',
        items: ['Python', 'PostgreSQL', 'Node.js / Bun', 'REST APIs', 'Webservices Fiscais (ARCA)', 'Processamento de PDFs e Dados']
      },
      {
        id: 'devops',
        title: 'Cloud, Infraestrutura & DevOps',
        badge: 'Servidores & CI/CD',
        description: 'Implantações autônomas em servidores cloud próprios sem dependência de plataformas proprietárias caras.',
        items: ['Linux (Ubuntu Server)', 'Docker & Compose', 'GitHub Actions', 'Nginx Reverse Proxy', 'Vercel Edge', 'Segurança & SSL']
      },
      {
        id: 'business',
        title: 'Operação de Campo & Vivência Comercial',
        badge: 'Visão Prática',
        description: 'Comunicação direta com diretores hospitalares, equipes operacionais e empresários locais sem intermediários.',
        items: ['Auditoria Hospitalar e Faturamento', 'Gestão Financeira & Impostos', 'Operação em Massa (ANSES)', 'Logística & Estoque Real', 'Living Lab Gastronômico']
      }
    ],
    philosophy: [
      {
        title: 'Pensamento Crítico & Ética de Sistemas',
        subtitle: 'Graduação em Filosofia (UNR — em andamento)',
        description: 'Recusa ao desenvolvimento motivado por modismos. Todo sistema carrega impactos humanos e éticos. Utilizo IA como ferramenta amplificadora com critério humano inegociável.',
        quote: 'Compreender a raiz do problema antes de escrever qualquer linha de código.'
      },
      {
        title: 'Liderança, Disciplina & Autocontrole Marcial',
        subtitle: 'Professor Internacional de Taekwondo ITF (+10 anos)',
        description: 'Mais de uma década formando crianças e adultos. A docência marcial constrói constância diária, didática com usuários não técnicos e serenidade em situações de alta pressão.',
        quote: 'A disciplina supera o improviso; o autocontrole resolve a urgência.'
      }
    ]
  }
};
