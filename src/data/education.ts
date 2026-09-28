import type { Lang } from '../i18n/ui';

export type EducationCategory = 'all' | 'cloud' | 'academic' | 'foundations';

export interface EducationItem {
  id: string;
  category: 'cloud' | 'academic' | 'foundations';
  title: string;
  issuer: string;
  period: string;
  status: 'completed' | 'in_progress';
  credentialBadge?: string;
  description: string;
  highlights: string[];
}

export interface EducationContent {
  sectionBadge: string;
  title: string;
  subtitle: string;
  filterLabels: Record<EducationCategory, string>;
  items: EducationItem[];
}

export const educationData: Record<Lang, EducationContent> = {
  es: {
    sectionBadge: 'FORMACIÓN & CERTIFICACIONES',
    title: 'Educación Formal, Certificaciones & Aprendizaje Continuo',
    subtitle: 'Cimientos técnicos formales en robótica, rigor conceptual en filosofía y certificaciones oficiales en las nubes líderes.',
    filterLabels: {
      all: 'Todas las credenciales',
      cloud: 'Cloud & DevOps',
      academic: 'Formación Académica',
      foundations: 'Fundamentos & Código'
    },
    items: [
      {
        id: 'aws-cloud-practitioner',
        category: 'cloud',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services (AWS)',
        period: '2025',
        status: 'completed',
        credentialBadge: 'Cloud Certified',
        description: 'Validación integral de arquitectura en la nube de AWS, modelos de seguridad compartida, optimización de costos y servicios de cómputo, almacenamiento y redes.',
        highlights: [
          'Arquitectura y servicios de cómputo en AWS',
          'Seguridad, IAM y gobernanza de infraestructura',
          'Facturación y optimización de costos cloud'
        ]
      },
      {
        id: 'azure-fundamentals-az900',
        category: 'cloud',
        title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
        issuer: 'Microsoft',
        period: '2025',
        status: 'completed',
        credentialBadge: 'Cloud Certified',
        description: 'Fundamentos de infraestructura de nube híbrida, alta disponibilidad, seguridad en entornos empresariales y gobernanza en Microsoft Azure.',
        highlights: [
          'Conceptos de nube e infraestructura global de Azure',
          'Seguridad, identidad (Azure AD/Entra ID) y cumplimiento',
          'Gestión y monitoreo de recursos empresariales'
        ]
      },
      {
        id: 'gcp-foundations',
        category: 'cloud',
        title: 'Google Cloud Computing Foundations',
        issuer: 'Google Cloud Skills Boost',
        period: '2024',
        status: 'completed',
        credentialBadge: 'Cloud Foundations',
        description: 'Capacitación en computación elástica, contenedores, big data y despliegue de soluciones escalables en Google Cloud Platform.',
        highlights: [
          'Infraestructura de cómputo y contenedores en GCP',
          'Gestión de datos relacionales y NoSQL en la nube',
          'Fundamentos de escalabilidad y redes'
        ]
      },
      {
        id: 'harvard-cs50',
        category: 'foundations',
        title: 'CS50: Introduction to Computer Science',
        issuer: 'Harvard University (edX)',
        period: '2023',
        status: 'completed',
        credentialBadge: 'Computer Science',
        description: 'El programa insignia de ciencias de la computación de Harvard: pensamiento algorítmico, estructuras de datos, gestión manual de memoria en C y desarrollo de aplicaciones web.',
        highlights: [
          'Algoritmos, complejidad temporal y estructuras de datos',
          'Gestión de memoria y punteros en lenguaje C',
          'Cimientos sólidos antes de la abstracción de frameworks'
        ]
      },
      {
        id: 'python-dev',
        category: 'foundations',
        title: 'Python desde Cero a Desarrollador: Frameworks & Automatización',
        issuer: 'Udemy',
        period: '2022',
        status: 'completed',
        credentialBadge: 'Programming & Automation',
        description: 'Especialización en programación orientada a objetos, scripting de automatización operativa, manipulación de archivos y estructuración de proyectos productivos.',
        highlights: [
          'Automatización de procesos y scripting operativo',
          'Manejo avanzado de archivos (PDFs, Excel, CSVs)',
          'Estructura de código modular y testeable'
        ]
      },
      {
        id: 'unr-filosofia',
        category: 'academic',
        title: 'Licenciatura en Filosofía',
        issuer: 'Universidad Nacional de Rosario (UNR)',
        period: '2024 — Presente',
        status: 'in_progress',
        credentialBadge: 'En curso',
        description: 'Formación universitaria en lógica formal, teoría de la argumentación, epistemología y ética aplicada a los sistemas de información y la inteligencia artificial.',
        highlights: [
          'Lógica formal y estructuras de razonamiento riguroso',
          'Ética aplicada al software y automatización con IA',
          'Claridad conceptual y pensamiento crítico sistémico'
        ]
      },
      {
        id: 'instituto-belgrano-tecnica',
        category: 'academic',
        title: 'Secundario Técnico: Robótica y Programación',
        issuer: 'Instituto Belgrano (ex Escuela Técnica Nº 2060)',
        period: '2011',
        status: 'completed',
        credentialBadge: 'Cimientos Técnicos',
        description: 'Cimientos tempranos de ingeniería: electrónica básica, hardware, arquitectura de sistemas embebidos, lógica de control y primeras líneas de código estructurado.',
        highlights: [
          'Lógica de programación y diseño de circuitos',
          'Robótica y automatismos electromecánicos',
          'Resolución de problemas técnicos desde la base'
        ]
      }
    ]
  },
  en: {
    sectionBadge: 'EDUCATION & CERTIFICATIONS',
    title: 'Formal Education, Certifications & Lifelong Learning',
    subtitle: 'Technical high school foundations in robotics, rigorous analytical philosophy, and official cloud certifications.',
    filterLabels: {
      all: 'All Credentials',
      cloud: 'Cloud & DevOps',
      academic: 'Academic Degrees',
      foundations: 'CS Foundations & Code'
    },
    items: [
      {
        id: 'aws-cloud-practitioner',
        category: 'cloud',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services (AWS)',
        period: '2025',
        status: 'completed',
        credentialBadge: 'Cloud Certified',
        description: 'Comprehensive validation of AWS cloud architecture, shared responsibility security models, cost optimization, compute, storage, and networking.',
        highlights: [
          'AWS core compute, storage, and networking services',
          'Security, IAM, and infrastructure governance',
          'Billing management and cloud cost optimization'
        ]
      },
      {
        id: 'azure-fundamentals-az900',
        category: 'cloud',
        title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
        issuer: 'Microsoft',
        period: '2025',
        status: 'completed',
        credentialBadge: 'Cloud Certified',
        description: 'Foundations of hybrid cloud infrastructure, high availability, enterprise security models, and compliance within Microsoft Azure.',
        highlights: [
          'Cloud architecture & Azure global infrastructure',
          'Security, identity (Azure AD/Entra ID), and compliance',
          'Enterprise resource governance and monitoring'
        ]
      },
      {
        id: 'gcp-foundations',
        category: 'cloud',
        title: 'Google Cloud Computing Foundations',
        issuer: 'Google Cloud Skills Boost',
        period: '2024',
        status: 'completed',
        credentialBadge: 'Cloud Foundations',
        description: 'Hands-on training across compute engines, containers, big data pipelines, and scalable deployments in Google Cloud Platform.',
        highlights: [
          'Compute engines and containerized workloads in GCP',
          'Relational and NoSQL cloud data management',
          'Scalability and global cloud networking foundations'
        ]
      },
      {
        id: 'harvard-cs50',
        category: 'foundations',
        title: 'CS50: Introduction to Computer Science',
        issuer: 'Harvard University (edX)',
        period: '2023',
        status: 'completed',
        credentialBadge: 'Computer Science',
        description: 'Harvard university flagship computer science curriculum: algorithmic thinking, data structures, manual memory management in C, and web software development.',
        highlights: [
          'Algorithms, time complexity, and low-level data structures',
          'Pointers and manual memory management in C',
          'Deep conceptual grounding prior to high-level framework abstraction'
        ]
      },
      {
        id: 'python-dev',
        category: 'foundations',
        title: 'Python from Zero to Developer: Frameworks & Automation',
        issuer: 'Udemy',
        period: '2022',
        status: 'completed',
        credentialBadge: 'Programming & Automation',
        description: 'Specialization in object-oriented programming, operational automation scripts, PDF/data parsing, and production-grade project structuring.',
        highlights: [
          'Business process automation and shell/script tooling',
          'Advanced data and document parsing (PDFs, Excel, CSVs)',
          'Modular, testable application architecture'
        ]
      },
      {
        id: 'unr-filosofia',
        category: 'academic',
        title: 'Bachelor of Philosophy (Licenciatura)',
        issuer: 'National University of Rosario (UNR)',
        period: '2024 — Present',
        status: 'in_progress',
        credentialBadge: 'In Progress',
        description: 'University degree in formal logic, argumentation theory, epistemology, and applied ethics in software systems and AI automation.',
        highlights: [
          'Formal logic and rigorous analytical reasoning',
          'Applied ethics for AI systems and automation',
          'Conceptual clarity and systemic problem-solving'
        ]
      },
      {
        id: 'instituto-belgrano-tecnica',
        category: 'academic',
        title: 'Technical High School: Robotics & Programming',
        issuer: 'Instituto Belgrano (Technical School Nº 2060)',
        period: '2011',
        status: 'completed',
        credentialBadge: 'Technical Foundations',
        description: 'Early engineering foundations: applied electronics, hardware architectures, embedded logic control, and structured programming fundamentals.',
        highlights: [
          'Control logic and electronic circuit architecture',
          'Robotics and electromechanical automation',
          'Hardware-level problem-solving mindset'
        ]
      }
    ]
  },
  pt: {
    sectionBadge: 'FORMAÇÃO & CERTIFICAÇÕES',
    title: 'Educação Formal, Certificações & Aprendizado Contínuo',
    subtitle: 'Bases técnicas formais em robótica, rigor analítico em filosofia e certificações oficiais nas principais nuvens.',
    filterLabels: {
      all: 'Todas as credenciais',
      cloud: 'Cloud & DevOps',
      academic: 'Formação Acadêmica',
      foundations: 'Fundamentos & Código'
    },
    items: [
      {
        id: 'aws-cloud-practitioner',
        category: 'cloud',
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services (AWS)',
        period: '2025',
        status: 'completed',
        credentialBadge: 'Cloud Certified',
        description: 'Validação completa de arquitetura em nuvem AWS, modelo de responsabilidade compartilhada, otimização de custos e serviços de computação e redes.',
        highlights: [
          'Arquitetura e serviços essenciais de computação AWS',
          'Segurança, IAM e governança de infraestrutura',
          'Faturamento e otimização de custos em nuvem'
        ]
      },
      {
        id: 'azure-fundamentals-az900',
        category: 'cloud',
        title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
        issuer: 'Microsoft',
        period: '2025',
        status: 'completed',
        credentialBadge: 'Cloud Certified',
        description: 'Fundamentos de infraestrutura de nuvem híbrida, alta disponibilidade, modelos de segurança corporativa e conformidade no Microsoft Azure.',
        highlights: [
          'Conceitos de nuvem e infraestrutura global do Azure',
          'Segurança, identidade (Azure AD/Entra ID) e conformidade',
          'Governança e monitoramento de recursos corporativos'
        ]
      },
      {
        id: 'gcp-foundations',
        category: 'cloud',
        title: 'Google Cloud Computing Foundations',
        issuer: 'Google Cloud Skills Boost',
        period: '2024',
        status: 'completed',
        credentialBadge: 'Cloud Foundations',
        description: 'Treinamento prático em computação elástica, contêineres, pipelines de dados e implantação de soluções escaláveis no Google Cloud Platform.',
        highlights: [
          'Infraestrutura de computação e contêineres no GCP',
          'Gerenciamento de dados relacionais e NoSQL na nuvem',
          'Fundamentos de escalabilidade e redes globais'
        ]
      },
      {
        id: 'harvard-cs50',
        category: 'foundations',
        title: 'CS50: Introduction to Computer Science',
        issuer: 'Harvard University (edX)',
        period: '2023',
        status: 'completed',
        credentialBadge: 'Ciência da Computação',
        description: 'O curso de ciência da computação de Harvard: pensamento algorítmico, estruturas de dados, gerenciamento manual de memória em C e desenvolvimento web.',
        highlights: [
          'Algoritmos, complexidade temporal e estruturas de dados',
          'Ponteiros e gerenciamento manual de memória em C',
          'Bases sólidas antes da abstração de frameworks'
        ]
      },
      {
        id: 'python-dev',
        category: 'foundations',
        title: 'Python do Zero ao Desenvolvedor: Frameworks & Automação',
        issuer: 'Udemy',
        period: '2022',
        status: 'completed',
        credentialBadge: 'Programação & Automação',
        description: 'Especialização em programação orientada a objetos, scripts de automação operacional, processamento de dados e estruturação de projetos produtivos.',
        highlights: [
          'Automação de processos operacionais com scripts',
          'Manipulação avançada de arquivos (PDFs, planilhas, CSVs)',
          'Estrutura de código modular e sustentável'
        ]
      },
      {
        id: 'unr-filosofia',
        category: 'academic',
        title: 'Licenciatura em Filosofia',
        issuer: 'Universidade Nacional de Rosário (UNR)',
        period: '2024 — Presente',
        status: 'in_progress',
        credentialBadge: 'Em andamento',
        description: 'Formação universitária em lógica formal, teoria da argumentação, epistemologia e ética aplicada a sistemas de informação e IA.',
        highlights: [
          'Lógica formal e estruturas de raciocínio rigoroso',
          'Ética aplicada ao software e automação com IA',
          'Clareza conceitual e pensamento sistêmico'
        ]
      },
      {
        id: 'instituto-belgrano-tecnica',
        category: 'academic',
        title: 'Ensino Médio Técnico: Robótica e Programação',
        issuer: 'Instituto Belgrano (ex Escola Técnica Nº 2060)',
        period: '2011',
        status: 'completed',
        credentialBadge: 'Fundamentos Técnicos',
        description: 'Bases de engenharia: eletrônica aplicada, hardware, arquitetura de sistemas embarcados, lógica de controle e desenvolvimento estruturado.',
        highlights: [
          'Lógica de programação e circuitos eletrônicos',
          'Robótica e automação eletromecânica',
          'Resolução prática de problemas desde a base'
        ]
      }
    ]
  }
};
