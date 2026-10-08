import type { Lang } from '../i18n/ui';

export interface MartialBelt {
  key: 'blanco' | 'amarillo' | 'verde' | 'azul' | 'rojo' | 'negro';
  color: string;
  badgeColor: string;
  line: string;
  gup: string;
  beltName: Record<Lang, string>;
  philosophicalTitle: Record<Lang, string>;
  symbolism: Record<Lang, string>;
}

export const BELTS: Record<string, MartialBelt> = {
  blanco: {
    key: 'blanco',
    color: '#f8f6f0',
    badgeColor: '#e5e0d3',
    line: '#bdb4a4',
    gup: '10º gup',
    beltName: { es: 'Cinturón blanco', en: 'White belt', pt: 'Faixa branca' },
    philosophicalTitle: { es: 'El inicio del camino', en: 'The Beginning of the Path', pt: 'O Início do Caminho' },
    symbolism: { es: 'Inocencia: todo por aprender.', en: 'Innocence: everything still to learn.', pt: 'Inocência: tudo por aprender.' }
  },
  amarillo: {
    key: 'amarillo',
    color: 'oklch(0.84 0.15 90)',
    badgeColor: 'oklch(0.78 0.15 90)',
    line: 'oklch(0.78 0.15 90)',
    gup: '8º gup',
    beltName: { es: 'Cinturón amarillo', en: 'Yellow belt', pt: 'Faixa amarela' },
    philosophicalTitle: { es: 'Tierra & Raíces', en: 'Earth & Roots', pt: 'Terra & Raízes' },
    symbolism: { es: 'Tierra y raíces: donde empieza a crecer.', en: 'Earth and roots: where growth begins.', pt: 'Terra e raízes: onde o crescimento começa.' }
  },
  verde: {
    key: 'verde',
    color: 'oklch(0.58 0.12 150)',
    badgeColor: 'oklch(0.58 0.12 150)',
    line: 'oklch(0.58 0.12 150)',
    gup: '6º gup',
    beltName: { es: 'Cinturón verde', en: 'Green belt', pt: 'Faixa verde' },
    philosophicalTitle: { es: 'Crecimiento', en: 'Growth', pt: 'Crescimento' },
    symbolism: { es: 'Crecimiento: la planta toma forma.', en: 'Growth: the plant takes shape.', pt: 'Crescimento: a planta ganha forma.' }
  },
  azul: {
    key: 'azul',
    color: 'oklch(0.5 0.13 255)',
    badgeColor: 'oklch(0.5 0.13 255)',
    line: 'oklch(0.5 0.13 255)',
    gup: '4º gup',
    beltName: { es: 'Cinturón azul', en: 'Blue belt', pt: 'Faixa azul' },
    philosophicalTitle: { es: 'Maduración & Horizonte', en: 'Maturation & Horizon', pt: 'Maturação & Horizonte' },
    symbolism: { es: 'Cielo: hacia dónde apunta lo aprendido.', en: 'Heaven: where learning points to.', pt: 'Céu: para onde aponta o aprendizado.' }
  },
  rojo: {
    key: 'rojo',
    color: 'oklch(0.56 0.17 28)',
    badgeColor: 'oklch(0.56 0.17 28)',
    line: 'oklch(0.56 0.17 28)',
    gup: '2º gup',
    beltName: { es: 'Cinturón rojo', en: 'Red belt', pt: 'Faixa vermelha' },
    philosophicalTitle: { es: 'Control & Temple', en: 'Control & Tempering', pt: 'Controle & Têmpera' },
    symbolism: { es: 'Cautela y control: saber cuándo frenar.', en: 'Caution and control: knowing when to hold back.', pt: 'Cautela e controle: saber quando frear.' }
  },
  negro: {
    key: 'negro',
    color: '#1c1a17',
    badgeColor: '#1c1a17',
    line: '#1c1a17',
    gup: '1º dan',
    beltName: { es: 'Cinturón negro', en: 'Black belt', pt: 'Faixa preta' },
    philosophicalTitle: { es: 'Madurez & Producción', en: 'Maturity & Production', pt: 'Maturidade & Produção' },
    symbolism: { es: 'Madurez: la calma de quien ya no necesita demostrar.', en: 'Maturity: the calm of no longer needing to prove.', pt: 'Maturidade: a calma de quem não precisa provar.' }
  }
};

export interface MartialPosition {
  /** Stable id, identical across es/en/pt. Referenced by `tuls.ts` stops. */
  id: string;
  dates: string;
  role: string;
  org: string;
  /** Impact one-liner for the card surface (condensation pass): full detail lives in `description`. */
  teaser: string;
  /** Full "qué hice" detail — rendered by the T2 modal, never on the card surface. */
  description: string;
  transferableCompetency?: string;
}

export interface MartialStage {
  beltKey: 'blanco' | 'amarillo' | 'verde' | 'azul' | 'rojo' | 'negro';
  years: string;
  title: string;
  /** One-line summary shown on the landing (desktop and mobile). */
  line: string;
  /** 2-3 sentence detail, desktop only. */
  detail?: string;
  /** Black belt closing statement, shown after the ensō/bloom. */
  closing?: string;
  lede: string;
  positions: MartialPosition[];
}

export interface MartialExperienceContent {
  competencyLabel: string;
  stages: MartialStage[];
}

export const martialExperienceData: Record<Lang, MartialExperienceContent> = {
  es: {
    competencyLabel: 'Competencia transferible clave:',
    stages: [
      {
        beltKey: 'blanco',
        years: '2011',
        title: 'Formación técnica',
        line: 'Secundario técnico en robótica y programación: mis primeras bases en el mundo tecnológico.',
        detail: 'Escuela Técnica Manuel Belgrano. Ahí entendí que la lógica también se escribe.',
        lede: 'Egresé de la Escuela Técnica Manuel Belgrano con orientación en Robótica y Programación. Primeros cimientos de hardware, circuitos y lógica de control.',
        positions: [
          {
            id: 'secundario-belgrano',
            dates: '2011',
            role: 'Secundario Técnico: Robótica y Programación',
            org: 'Instituto Belgrano (ex Escuela Técnica Nº 2060)',
            teaser: 'Formación técnica inicial: diseño de circuitos, robótica educativa y primeros algoritmos estructurados.',
            description: 'Formación técnica inicial: diseño de circuitos, robótica educativa y primeros algoritmos estructurados.',
            transferableCompetency: 'Pensamiento lógico, estructuración técnica y resolución de problemas desde el hardware.'
          }
        ]
      },
      {
        beltKey: 'amarillo',
        years: '2012 — 2015',
        title: 'Ventas y atención al cliente',
        line: 'Atención al cliente y venta directa: aprendí a escuchar antes de responder.',
        detail: 'Grido, Al Natural, Providus y AS MED. Herramientas de diálogo, negociación cara a cara y comunicación persuasiva.',
        lede: 'Desarrollé negociación directa, empatía con el cliente, capacidad de persuasión y comprensión de la cadena comercial a través de la atención presencial diaria.',
        positions: [
          {
            id: 'grido',
            dates: 'Ene 2012 — Ene 2013',
            role: 'Vendedor y Atención al Público',
            org: 'Grido Helados',
            teaser: 'Atención y venta en local de alto tránsito con arqueo de caja y alta rotación diaria.',
            description: 'Mi primer trabajo formal: atención en local de alto tránsito, arqueo de caja y alta rotación de clientes.',
            transferableCompetency: 'Responsabilidad de caja, velocidad de despacho y empatía.'
          },
          {
            id: 'al-natural',
            dates: 'Feb 2013 — Abr 2013',
            role: 'Gastronómico',
            org: 'Al Natural',
            teaser: 'Atención al público en un local de comida saludable, despacho ágil y trabajo en equipo bajo presión.',
            description: 'Atención al público en un local de comida saludable, despacho ágil y trabajo en equipo bajo presión.',
            transferableCompetency: 'Coordinación operativa y templanza en momentos de pico de atención.'
          },
          {
            id: 'providus',
            dates: 'May 2013 — Ene 2014',
            role: 'Vendedor Viajante de Planes de Ahorro',
            org: 'Providus S.A.',
            teaser: 'Venta directa puerta a puerta de planes de capitalización y ahorro con seguimiento comercial de cartera.',
            description: 'Venta directa puerta a puerta de planes de capitalización y ahorro con seguimiento comercial de cartera.',
            transferableCompetency: 'Persuasión ética, constancia diaria y resiliencia comercial.'
          },
          {
            id: 'as-med',
            dates: 'Mar 2015 — Sep 2015',
            role: 'Vendedor Viajante de Servicios de Salud',
            org: 'AS MED S.A.',
            teaser: 'Venta puerta a puerta de planes y servicios de salud, con negociación directa cara a cara.',
            description: 'Venta puerta a puerta de planes y servicios de salud, con negociación directa cara a cara.',
            transferableCompetency: 'Negociación directa, empatía con el cliente y comunicación cara a cara.'
          }
        ]
      },
      {
        beltKey: 'verde',
        years: '2015 — 2019',
        title: 'Administración pública',
        line: 'Miles de expedientes en ANSES bajo normativa previsional y de seguridad social estricta.',
        detail: 'En paralelo entrenaba Taekwon-Do en ACJ Rosario, turno noche. Esa disciplina sostuvo la responsabilidad de cada jornada.',
        lede: 'Me formé en la gestión de expedientes masivos, control documental estricto y legislaciones vigentes en materia previsional y social.',
        positions: [
          {
            id: 'anses-contract',
            dates: 'Dic 2015 — Mar 2019',
            role: 'Administrativo Integral (contratado)',
            org: 'ANSES',
            teaser: 'Administración masiva de expedientes, control documental estricto y normativa previsional.',
            description: 'Primera etapa en ANSES: gestión de miles de expedientes, control documental estricto y aplicación de normativa legal previsional. Etapa cerrada por reestructuración de contratos del Estado.',
            transferableCompetency: 'Rigor normativo, gestión documental masiva y servicio al ciudadano en entornos regulados.'
          }
        ]
      },
      {
        beltKey: 'azul',
        years: '2019 — 2024',
        title: 'Reconversión profesional',
        line: 'Emprendí como fotógrafo y filmmaker, me formé en programación y volví a ANSES por mérito.',
        detail: 'Cubrí eventos de Santander, Federada Salud, ExpoAgro y Rooftop (ex Madame). Usé la pandemia para profundizar en programación. Convocado otra vez por ANSES, aprobé exámenes teóricos y de desempeño y pasé a planta permanente: mesa de ayuda junto al referente informático regional, soporte a PCs y servidores.',
        lede: 'Frente a la reestructuración estatal, emprendí de forma autónoma en el rubro audiovisual corporativo, y luego reingresé a ANSES por concurso de mérito a planta permanente, dando soporte técnico a racks de servidores.',
        positions: [
          {
            id: 'freelance-media',
            dates: 'Mar 2019 — Ene 2020',
            role: 'Fotógrafo y Filmmaker Freelance',
            org: 'Emprendimiento propio',
            teaser: 'Producción audiovisual y cobertura corporativa para clientes de primera línea (Santander, Federada Salud, ExpoAgro).',
            description: 'Producción audiovisual y cobertura corporativa para clientes de primera línea (Santander, Federada Salud, ExpoAgro). Profundización autodidacta intensiva en programación moderna durante la pandemia.',
            transferableCompetency: 'Autogestión, resiliencia frente a la incertidumbre y reinvención técnica autodidacta.'
          },
          {
            id: 'anses-permanent',
            dates: 'Dic 2021 — Mar 2024',
            role: 'Administrativo Integral y Gestión de Datos (planta permanente)',
            org: 'ANSES',
            teaser: 'Planta permanente por concurso de mérito: mesa de ayuda regional y soporte a servidores del Estado.',
            description: 'Reconvocado tras la etapa freelance, rendí y aprobé concursos de mérito hasta efectivizarme en planta permanente. Mesa de ayuda regional, soporte a racks de servidores del Estado Nacional y desarrollo de sistema interno de métricas.',
            transferableCompetency: 'Tolerancia a la alta demanda masiva, infraestructura de red/servidores y rigor normativo.'
          }
        ]
      },
      {
        beltKey: 'rojo',
        years: '2024 — 2025',
        title: 'Salud y logística',
        line: 'Salud y logística: detecté tareas repetitivas y las automaticé con Python.',
        detail: 'Sanatorio Delta, Aurea Med y Repuestos JL. Bot lector de extractos bancarios: de horas a segundos.',
        lede: 'Trabajar con sistemas de gestión heterogéneos en salud y comercio me mostró cuánto tiempo insume la tarea manual repetitiva y confirmó que mi aporte está en la automatización con software e integraciones.',
        positions: [
          {
            id: 'sanatorio-delta',
            dates: 'May 2024 — Ene 2025',
            role: 'Administrativo, Gestión en Salud',
            org: 'Sanatorio Delta',
            teaser: 'Admisión, turnos, oncología y caja con el sistema Algoritmo y nomenclador nacional de salud.',
            description: 'Admisión general, turnos, admisión de oncología, recepción de laboratorios y caja con el sistema Algoritmo y nomenclador nacional de salud.',
            transferableCompetency: 'Auditoría médica, tolerancia a la alta demanda y visión de optimización de procesos.'
          },
          {
            id: 'aurea-med',
            dates: 'Ene 2025 — Abr 2025',
            role: 'Administrativo, Gestión en Salud',
            org: 'Aurea Med S.A.',
            teaser: 'Gestión de pacientes, turnos y facturación con DATATECH bajo estricto cumplimiento normativo.',
            description: 'Continuidad en sanatorios de alta demanda: gestión de pacientes, turnos y facturación con DATATECH, control documental y estricto cumplimiento normativo.',
            transferableCompetency: 'Auditoría administrativa en salud, atención al detalle y manejo de sistemas médicos.'
          },
          {
            id: 'repuestos-jl',
            dates: 'Jun 2025 — Oct 2025',
            role: 'Administrativo Contable y Logística',
            org: 'Repuestos JL SRL',
            teaser: 'Despacho de mercadería, stock, facturación y cobranzas.',
            description: 'Despacho de mercadería, stock, facturación y cobranzas. Desarrollé en Python un bot lector de extractos bancarios en PDF que detecta alícuotas de IVA y totaliza liquidaciones en segundos en lugar de horas manuales.',
            transferableCompetency: 'Resolución de cuellos de botella administrativos con código en Python e iniciativa de mejora continua.'
          }
        ]
      },
      {
        beltKey: 'negro',
        years: 'Jun 2025 — Presente',
        title: 'Software en producción',
        line: 'Hoy diseño, despliego y sostengo sistemas que usan personas reales: Satori Dojo, NodoFit y Don Pizza.',
        closing: 'En Taekwon-Do, el cinturón negro no es la meta: es el primer grado de quien se toma el camino en serio. Llego con oficio y con ganas de seguir aprendiendo en equipo.',
        lede: 'Fundé NodoSur, la marca y software factory bajo la que diseño, despliego y mantengo sistemas propios: NodoFit, un sistema integral con gestión administrativa y contable integrando webservices de ARCA para gimnasios, entrenadores, dojos y clubes con reservas de canchas, y el trabajo que hago para clientes como Satori Dojo, Don Pizza y Seiton Motors.',
        positions: [
          {
            id: 'nodosur',
            dates: 'Jun 2025 — Presente',
            role: 'Fundador y Desarrollador',
            org: 'NodoSur',
            teaser: 'Software factory propia: soluciones a medida, cloud Linux autoadministrado con Docker y CI/CD.',
            description: 'Software factory de soluciones a medida, servidores cloud autoadministrados en Linux con Docker y flujo CI/CD con GitHub Actions. Plataformas vivas: Satori Dojo, NodoFit (SaaS) y Don Pizza. Consultoría IT y gestión de base de datos para Seiton Motors. Disponibilidad full-time real para sumarme a un equipo.',
            transferableCompetency: 'Arquitectura de software en producción, capacidad de entregar y sostener sistemas confiables, liderazgo y disciplina ética.'
          }
        ]
      }
    ]
  },
  en: {
    competencyLabel: 'Key transferable asset:',
    stages: [
      {
        beltKey: 'blanco',
        years: '2011',
        title: 'Technical foundations',
        line: 'Technical high school in robotics and programming: my first foundations in the tech world.',
        detail: 'Manuel Belgrano Technical School. That is where I realized logic can be written, too.',
        lede: 'Graduated from Manuel Belgrano Technical High School with a focus on Robotics and Programming. First foundations in hardware, circuits, and control logic.',
        positions: [
          {
            id: 'secundario-belgrano',
            dates: '2011',
            role: 'Technical High School: Robotics & Programming',
            org: 'Instituto Belgrano (formerly Technical School No. 2060)',
            teaser: 'Foundational engineering: circuit design, educational robotics, and early structured coding.',
            description: 'Foundational engineering: circuit design, educational robotics, and early structured coding.',
            transferableCompetency: 'Logical reasoning, structured problem solving, and hardware-level understanding.'
          }
        ]
      },
      {
        beltKey: 'amarillo',
        years: '2012 — 2015',
        title: 'Sales and customer service',
        line: 'Customer service and direct sales: I learned to listen before answering.',
        detail: 'Grido, Al Natural, Providus and AS MED. Tools for dialogue, face-to-face negotiation and persuasive communication.',
        lede: 'Built direct negotiation skills, client empathy, persuasion, and an understanding of the commercial chain through daily in-person customer service.',
        positions: [
          {
            id: 'grido',
            dates: 'Jan 2012 — Jan 2013',
            role: 'Customer Service & Cashier',
            org: 'Grido Helados',
            teaser: 'Sales and service in a high-traffic shop with daily cash reconciliation and fast customer turnover.',
            description: 'My first formal job: service at a high-traffic shop, cash register reconciliation, and high customer turnover.',
            transferableCompetency: 'Cash register accountability, order dispatch speed, and hospitality.'
          },
          {
            id: 'al-natural',
            dates: 'Feb 2013 — Apr 2013',
            role: 'Food Service Attendant',
            org: 'Al Natural',
            teaser: 'Customer service at a fast-paced health food establishment, working under rush-hour demand.',
            description: 'Customer service at a fast-paced health food establishment, working under rush-hour demand.',
            transferableCompetency: 'Operational coordination and composure during peak service pressure.'
          },
          {
            id: 'providus',
            dates: 'May 2013 — Jan 2014',
            role: 'Field Sales Representative, Savings Plans',
            org: 'Providus S.A.',
            teaser: 'Direct sales of capitalization and savings plans with active pipeline follow-up.',
            description: 'Direct sales of capitalization and savings plans with active pipeline follow-up.',
            transferableCompetency: 'Ethical persuasion, daily discipline, and sales resilience.'
          },
          {
            id: 'as-med',
            dates: 'Mar 2015 — Sep 2015',
            role: 'Field Sales Representative, Healthcare Services',
            org: 'AS MED S.A.',
            teaser: 'Door-to-door sales of healthcare plans, handling face-to-face commercial closing.',
            description: 'Door-to-door sales of healthcare plans, handling face-to-face commercial closing.',
            transferableCompetency: 'Direct negotiation, client empathy, and resilient communication.'
          }
        ]
      },
      {
        beltKey: 'verde',
        years: '2015 — 2019',
        title: 'Public administration',
        line: 'Thousands of case files at ANSES under strict pension and social security regulations.',
        detail: 'In parallel I trained Taekwon-Do at ACJ Rosario, night shift. That discipline sustained the responsibility of every working day.',
        lede: 'I trained in mass case-file management, strict document control, and current social security and welfare legislation.',
        positions: [
          {
            id: 'anses-contract',
            dates: 'Dec 2015 — Mar 2019',
            role: 'Operations Administrator (contract)',
            org: 'ANSES',
            teaser: 'Mass case-file administration, strict document control, and pension regulation enforcement.',
            description: 'First stage at ANSES: handling thousands of case files, strict document control, and application of social security regulations. Stage closed due to a restructuring of state contracts.',
            transferableCompetency: 'Regulatory compliance, massive case file handling, and citizen service in regulated environments.'
          }
        ]
      },
      {
        beltKey: 'azul',
        years: '2019 — 2024',
        title: 'Career change',
        line: 'I started as a photographer and filmmaker, trained in programming, and returned to ANSES on merit.',
        detail: 'I covered events for Santander, Federada Salud, ExpoAgro and Rooftop (formerly Madame). I used the pandemic to go deeper into programming. Called back by ANSES, I passed theoretical and performance exams and moved to permanent staff: help desk alongside the regional IT lead, plus PC and server support.',
        lede: 'Faced with state restructuring, I went independent in corporate audiovisual work, then rejoined ANSES through a merit competition into a permanent position, providing technical support for server racks.',
        positions: [
          {
            id: 'freelance-media',
            dates: 'Mar 2019 — Jan 2020',
            role: 'Freelance Photographer and Filmmaker',
            org: 'Self-employed',
            teaser: 'Audiovisual production and corporate coverage for top-tier clients (Santander, Federada Salud, ExpoAgro).',
            description: 'Audiovisual production and corporate coverage for top-tier clients (Santander, Federada Salud, ExpoAgro). Intensive self-taught study of modern programming during the pandemic.',
            transferableCompetency: 'Autonomous business management, career resilience, and self-directed technical education.'
          },
          {
            id: 'anses-permanent',
            dates: 'Dec 2021 — Mar 2024',
            role: 'Full-Cycle Administrator & Data Management (permanent staff)',
            org: 'ANSES',
            teaser: 'Permanent staff via merit competitions: regional help desk and state server technical support.',
            description: 'Called back after the freelance stage, I passed merit competitions until becoming permanent staff. Regional help desk, support for National State server racks, and development of an internal metrics system.',
            transferableCompetency: 'Resilience under high-volume pressure, server rack infrastructure management, and compliance rigor.'
          }
        ]
      },
      {
        beltKey: 'rojo',
        years: '2024 — 2025',
        title: 'Healthcare and logistics',
        line: 'Healthcare and logistics: I spotted repetitive tasks and automated them with Python.',
        detail: 'Sanatorio Delta, Aurea Med and Repuestos JL. A bank-statement reader bot: from hours to seconds.',
        lede: 'Working with varied management systems in healthcare and commerce showed me how much time repetitive manual work takes, and confirmed that my contribution lies in automation with software and integrations.',
        positions: [
          {
            id: 'sanatorio-delta',
            dates: 'May 2024 — Jan 2025',
            role: 'Healthcare Administrator',
            org: 'Sanatorio Delta',
            teaser: 'Admissions, scheduling, oncology intake, and cashier with the Algoritmo system and national fee schedule.',
            description: 'General admissions, scheduling, oncology admissions, laboratory reception, and cashier with the Algoritmo system and the national health fee schedule.',
            transferableCompetency: 'Medical auditing, operational tolerance under heavy patient volume, and systems optimization.'
          },
          {
            id: 'aurea-med',
            dates: 'Jan 2025 — Apr 2025',
            role: 'Healthcare Administrator',
            org: 'Aurea Med S.A.',
            teaser: 'Patient management, scheduling, and billing with DATATECH under strict regulatory compliance.',
            description: 'Continuity in high-demand sanatoriums: patient management, scheduling, and billing with DATATECH, document control, and strict regulatory compliance.',
            transferableCompetency: 'Healthcare administrative auditing, regulatory precision, and patient management workflows.'
          },
          {
            id: 'repuestos-jl',
            dates: 'Jun 2025 — Oct 2025',
            role: 'Accounting and Logistics Administrator',
            org: 'Repuestos JL SRL',
            teaser: 'Merchandise dispatch, inventory, invoicing, and collections.',
            description: 'Merchandise dispatch, inventory, invoicing, and collections. Built in Python a bot that reads bank statement PDFs, detects VAT rates, and totals settlements in seconds instead of manual hours.',
            transferableCompetency: 'Automating administrative bottlenecks with Python code and proactive process optimization.'
          }
        ]
      },
      {
        beltKey: 'negro',
        years: 'Jun 2025 — Present',
        title: 'Software in production',
        line: 'Today I design, deploy and maintain systems real people use: Satori Dojo, NodoFit and Don Pizza.',
        closing: "In Taekwon-Do, the black belt isn't the finish line: it's the first rank of those who take the path seriously. I bring craft and the will to keep learning on a team.",
        lede: 'Founded NodoSur, the brand and software factory under which I design, deploy, and maintain custom systems: NodoFit, an integral system with administrative and accounting management using ARCA fiscal APIs for gyms, trainers, dojos, and clubs with court bookings, and client solutions for Satori Dojo, Don Pizza, and Seiton Motors.',
        positions: [
          {
            id: 'nodosur',
            dates: 'Jun 2025 — Present',
            role: 'Founder and Developer',
            org: 'NodoSur',
            teaser: 'Bespoke software factory: self-managed Linux cloud, Docker, and CI/CD pipelines.',
            description: 'Bespoke software factory with self-managed cloud servers on Linux, Docker containers, and GitHub Actions CI/CD. Production systems: Satori Dojo, NodoFit (SaaS), and Don Pizza. IT consulting and database management for Seiton Motors. Real full-time availability to join a team.',
            transferableCompetency: 'Production software architecture, ability to deliver and sustain reliable systems, leadership, and ethical discipline.'
          }
        ]
      }
    ]
  },
  pt: {
    competencyLabel: 'Competência transferível chave:',
    stages: [
      {
        beltKey: 'blanco',
        years: '2011',
        title: 'Formação técnica',
        line: 'Ensino médio técnico em robótica e programação: minhas primeiras bases no mundo da tecnologia.',
        detail: 'Escola Técnica Manuel Belgrano. Ali percebi que a lógica também se escreve.',
        lede: 'Formado na Escola Técnica Manuel Belgrano com habilitação em Robótica e Programação. Primeiros alicerces de hardware, circuitos e lógica de controle.',
        positions: [
          {
            id: 'secundario-belgrano',
            dates: '2011',
            role: 'Ensino Médio Técnico: Robótica e Programação',
            org: 'Instituto Belgrano (ex Escola Técnica Nº 2060)',
            teaser: 'Formação técnica inicial: projeto de circuitos, robótica educacional e primeiros algoritmos estruturados.',
            description: 'Formação técnica inicial: projeto de circuitos, robótica educacional e primeiros algoritmos estruturados.',
            transferableCompetency: 'Raciocínio lógico, estruturação técnica e resolução prática de problemas desde o hardware.'
          }
        ]
      },
      {
        beltKey: 'amarillo',
        years: '2012 — 2015',
        title: 'Vendas e atendimento ao cliente',
        line: 'Atendimento ao cliente e venda direta: aprendi a escutar antes de responder.',
        detail: 'Grido, Al Natural, Providus e AS MED. Ferramentas de diálogo, negociação presencial e comunicação persuasiva.',
        lede: 'Desenvolvi negociação direta, empatia com o cliente, capacidade de persuasão e compreensão da cadeia comercial no atendimento presencial do dia a dia.',
        positions: [
          {
            id: 'grido',
            dates: 'Jan 2012 — Jan 2013',
            role: 'Atendente e Operador de Caixa',
            org: 'Grido Helados',
            teaser: 'Vendas e atendimento em loja de alto fluxo com fechamento de caixa diário e alta rotação de clientes.',
            description: 'Meu primeiro emprego formal: atendimento em loja de alto fluxo, fechamento de caixa e alta rotação de clientes.',
            transferableCompetency: 'Responsabilidade financeira, agilidade de atendimento e empatia.'
          },
          {
            id: 'al-natural',
            dates: 'Fev 2013 — Abr 2013',
            role: 'Atendente Gastronômico',
            org: 'Al Natural',
            teaser: 'Atendimento ao público em restaurante de alimentação saudável e trabalho em equipe sob pressão.',
            description: 'Atendimento ao público em restaurante de alimentação saudável e trabalho em equipe sob pressão.',
            transferableCompetency: 'Coordenação operacional e equilíbrio em momentos de pico.'
          },
          {
            id: 'providus',
            dates: 'Mai 2013 — Jan 2014',
            role: 'Representante Comercial, Planos de Capitalização',
            org: 'Providus S.A.',
            teaser: 'Venda direta porta a porta de planos de capitalização e poupança, com acompanhamento comercial de carteira.',
            description: 'Venda direta porta a porta de planos de capitalização e poupança, com acompanhamento comercial de carteira.',
            transferableCompetency: 'Persuasão ética, disciplina diária e resiliência comercial.'
          },
          {
            id: 'as-med',
            dates: 'Mar 2015 — Set 2015',
            role: 'Representante Comercial, Serviços de Saúde',
            org: 'AS MED S.A.',
            teaser: 'Vendas presenciais porta a porta de planos de saúde e fechamento comercial direto.',
            description: 'Vendas presenciais porta a porta de planos de saúde e fechamento comercial direto.',
            transferableCompetency: 'Negociação direta, empatia com o cliente e comunicação interpessoal.'
          }
        ]
      },
      {
        beltKey: 'verde',
        years: '2015 — 2019',
        title: 'Administração pública',
        line: 'Milhares de processos no ANSES sob normativa previdenciária e de seguridade social rigorosa.',
        detail: 'Em paralelo, treinava Taekwon-Do na ACJ Rosario, no turno da noite. Essa disciplina sustentou a responsabilidade de cada jornada.',
        lede: 'Formei-me na gestão de processos em massa, controle documental rigoroso e legislação vigente em matéria previdenciária e social.',
        positions: [
          {
            id: 'anses-contract',
            dates: 'Dez 2015 — Mar 2019',
            role: 'Administrativo Operacional (contratado)',
            org: 'ANSES',
            teaser: 'Administração massiva de processos, controle documental rigoroso e normativa previdenciária.',
            description: 'Primeira etapa no ANSES: gestão de milhares de processos, controle documental rigoroso e aplicação da normativa legal previdenciária. Etapa encerrada por reestruturação de contratos do Estado.',
            transferableCompetency: 'Rigor documental, gestão de processos em massa e atendimento público regulado.'
          }
        ]
      },
      {
        beltKey: 'azul',
        years: '2019 — 2024',
        title: 'Reconversão profissional',
        line: 'Empreendi como fotógrafo e filmmaker, me formei em programação e voltei ao ANSES por mérito.',
        detail: 'Cobri eventos de Santander, Federada Salud, ExpoAgro e Rooftop (ex-Madame). Usei a pandemia para me aprofundar em programação. Convocado de novo pelo ANSES, passei em provas teóricas e de desempenho e entrei no quadro permanente: central de ajuda junto ao referente de TI regional, suporte a PCs e servidores.',
        lede: 'Diante da reestruturação estatal, empreendi de forma autônoma na área audiovisual corporativa e depois reingressei no ANSES por concurso de mérito para o quadro permanente, dando suporte técnico a racks de servidores.',
        positions: [
          {
            id: 'freelance-media',
            dates: 'Mar 2019 — Jan 2020',
            role: 'Fotógrafo e Produtor Audiovisual Freelance',
            org: 'Empreendimento próprio',
            teaser: 'Produção audiovisual e cobertura corporativa para clientes de primeira linha (Santander, Federada Salud, ExpoAgro).',
            description: 'Produção audiovisual e cobertura corporativa para clientes de primeira linha (Santander, Federada Salud, ExpoAgro). Aprofundamento autodidata intensivo em programação moderna durante a pandemia.',
            transferableCompetency: 'Autogestão, resiliência profissional e aprendizado técnico autodidata.'
          },
          {
            id: 'anses-permanent',
            dates: 'Dez 2021 — Mar 2024',
            role: 'Administrativo e Gestão de Dados (efetivo)',
            org: 'ANSES',
            teaser: 'Efetivo por concurso de mérito: central de ajuda regional e suporte técnico a servidores do Estado.',
            description: 'Reconvocado após a etapa freelance, prestei e fui aprovado em concursos de mérito até ser efetivado no quadro permanente. Central de ajuda regional, suporte a racks de servidores do Estado Nacional e desenvolvimento de sistema interno de métricas.',
            transferableCompetency: 'Resiliência sob alta demanda, suporte a servidores/redes e rigor regulatório.'
          }
        ]
      },
      {
        beltKey: 'rojo',
        years: '2024 — 2025',
        title: 'Saúde e logística',
        line: 'Saúde e logística: identifiquei tarefas repetitivas e as automatizei com Python.',
        detail: 'Sanatorio Delta, Aurea Med e Repuestos JL. Bot leitor de extratos bancários: de horas a segundos.',
        lede: 'Trabalhar com sistemas de gestão heterogêneos em saúde e comércio mostrou quanto tempo a tarefa manual repetitiva consome e confirmou que minha contribuição está na automação com software e integrações.',
        positions: [
          {
            id: 'sanatorio-delta',
            dates: 'Mai 2024 — Jan 2025',
            role: 'Administrativo Hospitalar',
            org: 'Sanatorio Delta',
            teaser: 'Admissão, agendamentos, oncologia e caixa com o sistema Algoritmo e nomenclador nacional de saúde.',
            description: 'Admissão geral, agendamentos, admissão de oncologia, recepção de laboratórios e caixa com o sistema Algoritmo e nomenclador nacional de saúde.',
            transferableCompetency: 'Auditoria médica, tolerância à alta rotina hospitalar e otimização de rotinas.'
          },
          {
            id: 'aurea-med',
            dates: 'Jan 2025 — Abr 2025',
            role: 'Administrativo Hospitalar',
            org: 'Aurea Med S.A.',
            teaser: 'Gestão de pacientes, agendamentos e faturamento com DATATECH sob estrito cumprimento normativo.',
            description: 'Continuidade em sanatórios de alta demanda: gestão de pacientes, agendamentos e faturamento com DATATECH, controle documental e estrito cumprimento normativo.',
            transferableCompetency: 'Auditoria administrativa médica, precisão regulatória e gestão de sistemas hospitalares.'
          },
          {
            id: 'repuestos-jl',
            dates: 'Jun 2025 — Out 2025',
            role: 'Administrativo Contábil e Logística',
            org: 'Repuestos JL SRL',
            teaser: 'Expedição de mercadorias, estoque, faturamento e cobranças.',
            description: 'Expedição de mercadorias, estoque, faturamento e cobranças. Desenvolvi em Python um bot leitor de extratos bancários em PDF que detecta alíquotas de IVA e totaliza liquidações em segundos, em vez de horas manuais.',
            transferableCompetency: 'Eliminação de gargalos burocráticos com Python e iniciativa de melhoria contínua.'
          }
        ]
      },
      {
        beltKey: 'negro',
        years: 'Jun 2025 — Presente',
        title: 'Software em produção',
        line: 'Hoje projeto, implanto e sustento sistemas usados por pessoas reais: Satori Dojo, NodoFit e Don Pizza.',
        closing: 'No Taekwon-Do, a faixa preta não é a linha de chegada: é o primeiro grau de quem leva o caminho a sério. Chego com ofício e com vontade de seguir aprendendo em equipe.',
        lede: 'Fundei a NodoSur, a marca e software factory sob a qual projeto, implanto e mantenho sistemas próprios: NodoFit, um sistema integral com gestão administrativa e contábil integrando webservices da ARCA para academias, treinadores, dojos e clubes com reservas de quadras, e o trabalho que faço para clientes como Satori Dojo, Don Pizza e Seiton Motors.',
        positions: [
          {
            id: 'nodosur',
            dates: 'Jun 2025 — Presente',
            role: 'Fundador e Desenvolvedor',
            org: 'NodoSur',
            teaser: 'Software factory própria: cloud Linux autoadministrado, Docker e pipelines CI/CD.',
            description: 'Software factory com servidores Linux próprios, Docker e pipelines CI/CD com GitHub Actions. Sistemas em produção: Satori Dojo, NodoFit (SaaS) e Don Pizza. Consultoria de TI e gestão de banco de dados para a Seiton Motors. Disponibilidade full-time real para me somar a uma equipe.',
            transferableCompetency: 'Arquitetura de software em produção, capacidade de entregar e sustentar sistemas confiáveis, liderança e ética.'
          }
        ]
      }
    ]
  }
};
