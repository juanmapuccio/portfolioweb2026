import type { Lang } from '../i18n/ui';

export interface MartialBelt {
  key: 'blanco' | 'amarillo' | 'verde' | 'azul' | 'rojo' | 'negro';
  color: string;
  badgeColor: string;
  line: string;
  gup: string;
  beltName: Record<Lang, string>;
  symbolism: Record<Lang, string>;
}

export const BELTS: Record<string, MartialBelt> = {
  blanco: { key: 'blanco', color: '#f8f6f0', badgeColor: '#e5e0d3', line: '#bdb4a4', gup: '10º gup', beltName: { es: 'Cinturón blanco', en: 'White belt', pt: 'Faixa branca' }, symbolism: { es: 'Inocencia: todo por aprender.', en: 'Innocence: everything still to learn.', pt: 'Inocência: tudo por aprender.' } },
  amarillo: { key: 'amarillo', color: 'oklch(0.84 0.15 90)', badgeColor: 'oklch(0.78 0.15 90)', line: 'oklch(0.78 0.15 90)', gup: '8º gup', beltName: { es: 'Cinturón amarillo', en: 'Yellow belt', pt: 'Faixa amarela' }, symbolism: { es: 'Tierra y raíces: donde empieza a crecer.', en: 'Earth and roots: where growth begins.', pt: 'Terra e raízes: onde o crescimento começa.' } },
  verde: { key: 'verde', color: 'oklch(0.58 0.12 150)', badgeColor: 'oklch(0.58 0.12 150)', line: 'oklch(0.58 0.12 150)', gup: '6º gup', beltName: { es: 'Cinturón verde', en: 'Green belt', pt: 'Faixa verde' }, symbolism: { es: 'Crecimiento: la planta toma forma.', en: 'Growth: the plant takes shape.', pt: 'Crescimento: a planta ganha forma.' } },
  azul: { key: 'azul', color: 'oklch(0.5 0.13 255)', badgeColor: 'oklch(0.5 0.13 255)', line: 'oklch(0.5 0.13 255)', gup: '4º gup', beltName: { es: 'Cinturón azul', en: 'Blue belt', pt: 'Faixa azul' }, symbolism: { es: 'Cielo: hacia dónde apunta lo aprendido.', en: 'Heaven: where learning points to.', pt: 'Céu: para onde aponta o aprendizado.' } },
  rojo: { key: 'rojo', color: 'oklch(0.56 0.17 28)', badgeColor: 'oklch(0.56 0.17 28)', line: 'oklch(0.56 0.17 28)', gup: '2º gup', beltName: { es: 'Cinturón rojo', en: 'Red belt', pt: 'Faixa vermelha' }, symbolism: { es: 'Cautela y control: saber cuándo frenar.', en: 'Caution and control: knowing when to hold back.', pt: 'Cautela e controle: saber quando frear.' } },
  negro: { key: 'negro', color: '#1c1a17', badgeColor: '#1c1a17', line: '#1c1a17', gup: '1º dan', beltName: { es: 'Cinturón negro', en: 'Black belt', pt: 'Faixa preta' }, symbolism: { es: 'Madurez: la calma de quien ya no necesita demostrar.', en: 'Maturity: the calm of no longer needing to prove.', pt: 'Maturidade: a calma de quem não precisa provar.' } }
};

export interface MartialPosition {
  dates: string;
  role: string;
  org: string;
  description: string;
  transferableCompetency?: string;
}

export interface MartialStage {
  beltKey: 'blanco' | 'amarillo' | 'verde' | 'azul' | 'rojo' | 'negro';
  years: string;
  title: string;
  lede: string;
  positions: MartialPosition[];
}

export interface MartialExperienceContent {
  sectionBadge: string;
  title: string;
  subtitle: string;
  competencyLabel: string;
  stages: MartialStage[];
}

export const martialExperienceData: Record<Lang, MartialExperienceContent> = {
  es: {
    sectionBadge: 'TRAYECTORIA DE CAMPO · 10º GUP → 1º DAN',
    title: 'Trinchera Operativa & Evolución Técnica',
    subtitle: 'De la venta en calle, la gestión pública masiva y la salud de alta demanda, a la arquitectura de software en producción.',
    competencyLabel: 'Competencia transferible clave:',
    stages: [
      {
        beltKey: 'blanco',
        years: '2011',
        title: 'Cimientos',
        lede: 'Egresé de la Escuela Técnica Manuel Belgrano con orientación en Robótica y Programación. Primeros cimientos de hardware, circuitos y lógica de control.',
        positions: [
          {
            dates: '2011',
            role: 'Secundario Técnico: Robótica y Programación',
            org: 'Instituto Belgrano (ex Escuela Técnica Nº 2060)',
            description: 'Formación técnica inicial: diseño de circuitos, robótica educativa y primeros algoritmos estructurados.',
            transferableCompetency: 'Pensamiento lógico, estructuración técnica y resolución de problemas desde el hardware.'
          }
        ]
      },
      {
        beltKey: 'amarillo',
        years: '2012 — 2015',
        title: 'La calle',
        lede: 'Desarrollé habilidades de negociación directa en la calle, empatía inmediata con el cliente, capacidad de persuasión y un entendimiento profundo de la cadena comercial sin timidez operativa.',
        positions: [
          {
            dates: 'Mar 2015 — Sep 2015',
            role: 'Vendedor Viajante de Servicios de Salud',
            org: 'AS MED S.A.',
            description: 'Venta puerta a puerta de planes y servicios de salud, con negociación directa cara a cara.',
            transferableCompetency: 'Negociación directa, empatía con el cliente y comunicación cara a cara.'
          },
          {
            dates: 'May 2013 — Ene 2014',
            role: 'Vendedor Viajante de Planes de Ahorro',
            org: 'Providus S.A.',
            description: 'Venta directa puerta a puerta de planes de capitalización y ahorro con seguimiento comercial de cartera.',
            transferableCompetency: 'Persuasión ética, constancia diaria y resiliencia comercial.'
          },
          {
            dates: 'Feb 2013 — Abr 2013',
            role: 'Gastronómico',
            org: 'Al Natural',
            description: 'Atención al público en un local de comida saludable, despacho ágil y trabajo en equipo bajo presión.',
            transferableCompetency: 'Coordinación operativa y templanza en momentos de pico de atención.'
          },
          {
            dates: 'Ene 2012 — Ene 2013',
            role: 'Vendedor y Atención al Público',
            org: 'Grido Helados',
            description: 'Mi primer trabajo formal: atención en local de alto tránsito, arqueo de caja y alta rotación de clientes.',
            transferableCompetency: 'Responsabilidad de caja, velocidad de despacho y empatía.'
          }
        ]
      },
      {
        beltKey: 'verde',
        years: '2015 — 2019',
        title: 'El Estado',
        lede: 'Me forjé en la gestión de expedientes masivos, control documental estricto y legislaciones vigentes en materia previsional y social.',
        positions: [
          {
            dates: 'Dic 2015 — Mar 2019',
            role: 'Administrativo Integral (contratado)',
            org: 'ANSES',
            description: 'Primera etapa en ANSES: gestión de miles de expedientes, control documental estricto y aplicación de normativa legal previsional. Salida por reestructuración estatal de contratos, no por desempeño.',
            transferableCompetency: 'Rigor normativo, gestión documental masiva y servicio al ciudadano en entornos regulados.'
          }
        ]
      },
      {
        beltKey: 'azul',
        years: '2019 — 2024',
        title: 'Reconversión',
        lede: 'Frente a la reestructuración estatal, emprendí de forma autónoma en el rubro audiovisual corporativo, y luego reingresé a ANSES por concurso de mérito a planta permanente, dando soporte técnico a racks de servidores.',
        positions: [
          {
            dates: 'Dic 2021 — Mar 2024',
            role: 'Administrativo Integral y Gestión de Datos (planta permanente)',
            org: 'ANSES',
            description: 'Reconvocado tras la etapa freelance, rendí y aprobé concursos de mérito hasta efectivizarme en planta permanente. Mesa de ayuda regional, soporte a racks de servidores del Estado Nacional y desarrollo de sistema interno de métricas.',
            transferableCompetency: 'Tolerancia a la alta demanda masiva, infraestructura de red/servidores y rigor normativo.'
          },
          {
            dates: 'Mar 2019 — Ene 2020',
            role: 'Fotógrafo y Filmmaker Freelance',
            org: 'Emprendimiento propio',
            description: 'Producción audiovisual y cobertura corporativa para clientes de primera línea (Santander, Federada Salud, ExpoAgro). Profundización autodidacta intensiva en programación moderna durante la pandemia.',
            transferableCompetency: 'Autogestión, resiliencia frente a la incertidumbre y reinvención técnica autodidacta.'
          }
        ]
      },
      {
        beltKey: 'rojo',
        years: '2024 — 2025',
        title: 'La fricción',
        lede: 'Vivir en primera persona la ineficiencia de los sistemas arcaicos de salud y comercio me confirmó que mi verdadero aporte estaba en la automatización con software moderno e integraciones.',
        positions: [
          {
            dates: 'Jun 2025 — Oct 2025',
            role: 'Administrativo Contable y Logística',
            org: 'Repuestos JL SRL',
            description: 'Despacho de mercadería, stock, facturación y cobranzas. Desarrollé en Python un bot lector de extractos bancarios en PDF que detecta alícuotas de IVA y totaliza liquidaciones en segundos en lugar de horas manuales.',
            transferableCompetency: 'Resolución de cuellos de botella administrativos con código en Python e iniciativa de mejora continua.'
          },
          {
            dates: 'Ene 2025 — Abr 2025',
            role: 'Administrativo, Gestión en Salud',
            org: 'Aurea Med S.A.',
            description: 'Continuidad en sanatorios de alta demanda: gestión de pacientes, turnos y facturación con DATATECH, control documental y estricto cumplimiento normativo.',
            transferableCompetency: 'Auditoría administrativa en salud, atención al detalle y manejo de sistemas médicos.'
          },
          {
            dates: 'May 2024 — Ene 2025',
            role: 'Administrativo, Gestión en Salud',
            org: 'Sanatorio Delta',
            description: 'Admisión general, turnos, admisión de oncología, recepción de laboratorios y caja con el sistema Algoritmo y nomenclador nacional de salud.',
            transferableCompetency: 'Auditoría médica, tolerancia a la alta demanda y visión de optimización de procesos.'
          }
        ]
      },
      {
        beltKey: 'negro',
        years: 'Jun 2025 — Presente',
        title: 'Producción',
        lede: 'Fundé NodoSur, la marca y software factory bajo la que diseño, despliego y mantengo sistemas propios: NodoFit, gestión administrativa y contable integrando webservices de ARCA, y el trabajo que hago para clientes como Satori Dojo, Don Pizza y Seiton Motors.',
        positions: [
          {
            dates: 'Jun 2025 — Presente',
            role: 'Fundador y Desarrollador',
            org: 'NodoSur',
            description: 'Software factory de soluciones a medida, servidores cloud autoadministrados en Linux con Docker y flujo CI/CD con GitHub Actions. Plataformas vivas: NodoFit (SaaS), Satori Dojo, Don Pizza y Seiton Motors. Disponibilidad full-time real para sumarme a un equipo.',
            transferableCompetency: 'Arquitectura de software en producción, capacidad de entregar y sostener sistemas confiables, liderazgo y disciplina ética.'
          }
        ]
      }
    ]
  },
  en: {
    sectionBadge: 'FIELD TIMELINE · 10TH GUP → 1ST DAN',
    title: 'Operational Frontline & Technical Evolution',
    subtitle: 'From door-to-door sales, high-scale public administration, and healthcare to modern production software architecture.',
    competencyLabel: 'Key transferable asset:',
    stages: [
      {
        beltKey: 'blanco',
        years: '2011',
        title: 'Foundations',
        lede: 'Graduated from Manuel Belgrano Technical High School specializing in Robotics and Programming. Core foundations in hardware, electronic circuits, and logic control.',
        positions: [
          {
            dates: '2011',
            role: 'Technical High School: Robotics & Programming',
            org: 'Instituto Belgrano (Technical School Nº 2060)',
            description: 'Foundational engineering: circuit design, educational robotics, and early structured coding.',
            transferableCompetency: 'Logical reasoning, structured problem solving, and hardware-level understanding.'
          }
        ]
      },
      {
        beltKey: 'amarillo',
        years: '2012 — 2015',
        title: 'The Streets',
        lede: 'Built direct negotiation skills in frontline sales, active listening, client empathy, and a deep understanding of commercial business reality without operational hesitation.',
        positions: [
          {
            dates: 'Mar 2015 — Sep 2015',
            role: 'Field Sales Representative — Healthcare Services',
            org: 'AS MED S.A.',
            description: 'Door-to-door sales of healthcare plans, handling face-to-face commercial closing.',
            transferableCompetency: 'Direct negotiation, client empathy, and resilient communication.'
          },
          {
            dates: 'May 2013 — Jan 2014',
            role: 'Field Sales Representative — Savings Plans',
            org: 'Providus S.A.',
            description: 'Direct sales of capitalization and savings plans with active pipeline follow-up.',
            transferableCompetency: 'Ethical persuasion, daily discipline, and sales resilience.'
          },
          {
            dates: 'Feb 2013 — Apr 2013',
            role: 'Food Service Attendant',
            org: 'Al Natural',
            description: 'Customer service at a fast-paced health food establishment, working under rush-hour demand.',
            transferableCompetency: 'Operational coordination and composure during peak service pressure.'
          },
          {
            dates: 'Jan 2012 — Jan 2013',
            role: 'Customer Service & Cashier',
            org: 'Grido Helados',
            description: 'First formal job: high-traffic ice cream retail, register management, and rapid order turnover.',
            transferableCompetency: 'Cash register accountability, order dispatch speed, and hospitality.'
          }
        ]
      },
      {
        beltKey: 'verde',
        years: '2015 — 2019',
        title: 'The State',
        lede: 'Shaped by massive case file management, strict documentation compliance, and social security statutory legislation.',
        positions: [
          {
            dates: 'Dec 2015 — Mar 2019',
            role: 'Operations Administrator (contract)',
            org: 'ANSES',
            description: 'Initial tenure at ANSES: thousands of case files processed under strict regulatory frameworks. Departure driven by nationwide payroll restructuring, not performance.',
            transferableCompetency: 'Regulatory compliance, massive case file handling, and citizen service in regulated environments.'
          }
        ]
      },
      {
        beltKey: 'azul',
        years: '2019 — 2024',
        title: 'Reinvention',
        lede: 'Following public sector restructuring, built a corporate audiovisual business, then rejoined ANSES via competitive examination to permanent tenure supporting critical server infrastructure.',
        positions: [
          {
            dates: 'Dec 2021 — Mar 2024',
            role: 'Full-Cycle Administrator & Data Management (permanent staff)',
            org: 'ANSES',
            description: 'Reappointed through competitive merit examination. Regional IT helpdesk, server rack support for National Government systems, and internal metrics dashboard development.',
            transferableCompetency: 'Resilience under high-volume pressure, server rack infrastructure management, and compliance rigor.'
          },
          {
            dates: 'Mar 2019 — Jan 2020',
            role: 'Freelance Photographer and Filmmaker',
            org: 'Self-employed',
            description: 'Corporate filmmaking for tier-1 corporate clients (Santander, Federada Salud, ExpoAgro). Intensive self-directed study of modern software development during the pandemic.',
            transferableCompetency: 'Autonomous business management, career resilience, and self-directed technical education.'
          }
        ]
      },
      {
        beltKey: 'rojo',
        years: '2024 — 2025',
        title: 'Friction',
        lede: 'Experiencing legacy inefficiencies in healthcare and commerce firsthand convinced me that my greatest value lay in modern automation and custom software integrations.',
        positions: [
          {
            dates: 'Jun 2025 — Oct 2025',
            role: 'Accounting and Logistics Administrator',
            org: 'Repuestos JL SRL',
            description: 'Merchandise dispatch, inventory, and invoicing. Engineered a Python bank statement PDF parser calculating VAT totals in seconds instead of hours of manual marking.',
            transferableCompetency: 'Automating administrative bottlenecks with Python code and proactive process optimization.'
          },
          {
            dates: 'Jan 2025 — Apr 2025',
            role: 'Healthcare Administrator',
            org: 'Aurea Med S.A.',
            description: 'High-demand medical administration: patient admission, scheduling, and billing with DATATECH under strict documentation control.',
            transferableCompetency: 'Healthcare administrative auditing, regulatory precision, and patient management workflows.'
          },
          {
            dates: 'May 2024 — Jan 2025',
            role: 'Healthcare Administrator',
            org: 'Sanatorio Delta',
            description: 'General and oncology admissions, lab intake, cash handling, and Algoritmo medical billing with the national health code.',
            transferableCompetency: 'Medical auditing, operational tolerance under heavy patient volume, and systems optimization.'
          }
        ]
      },
      {
        beltKey: 'negro',
        years: 'Jun 2025 — Present',
        title: 'Production',
        lede: 'Founded NodoSur, the brand and software factory under which I design, deploy, and maintain custom systems: NodoFit, administrative and accounting management with ARCA fiscal APIs, and client solutions for Satori Dojo, Don Pizza, and Seiton Motors.',
        positions: [
          {
            dates: 'Jun 2025 — Present',
            role: 'Founder and Developer',
            org: 'NodoSur',
            description: 'Bespoke software factory with self-managed cloud servers on Linux, Docker containers, and GitHub Actions CI/CD. Production systems: NodoFit (SaaS), Satori Dojo, Don Pizza, and Seiton Motors. Full-time availability to join an engineering team.',
            transferableCompetency: 'Production software architecture, ability to deliver and sustain reliable systems, leadership, and ethical discipline.'
          }
        ]
      }
    ]
  },
  pt: {
    sectionBadge: 'TRAJETÓRIA PRÁTICA · 10º GUP → 1º DAN',
    title: 'Trincheira Operacional & Evolução Técnica',
    subtitle: 'Das vendas em campo, administração pública e saúde de alta demanda à arquitetura de software em produção.',
    competencyLabel: 'Competência transferível chave:',
    stages: [
      {
        beltKey: 'blanco',
        years: '2011',
        title: 'Fundamentos',
        lede: 'Formado na Escola Técnica Manuel Belgrano com habilitação em Robótica e Programação. Bases em eletrônica, circuitos e lógica de controle.',
        positions: [
          {
            dates: '2011',
            role: 'Ensino Médio Técnico: Robótica e Programação',
            org: 'Instituto Belgrano (ex Escola Técnica Nº 2060)',
            description: 'Formação técnica inicial: circuitos eletrônicos, robótica e primeiros algoritmos estruturados.',
            transferableCompetency: 'Raciocínio lógico, estruturação técnica e resolução prática de problemas desde o hardware.'
          }
        ]
      },
      {
        beltKey: 'amarillo',
        years: '2012 — 2015',
        title: 'A Rua',
        lede: 'Desenvolvi habilidades de negociação direta, escuta ativa, empatia e compreensão profunda do ciclo comercial sem hesitação operacional.',
        positions: [
          {
            dates: 'Mar 2015 — Set 2015',
            role: 'Representante Comercial — Serviços de Saúde',
            org: 'AS MED S.A.',
            description: 'Vendas presenciais porta a porta de planos de saúde e fechamento comercial direto.',
            transferableCompetency: 'Negociação direta, empatia com o cliente e comunicação interpessoal.'
          },
          {
            dates: 'Mai 2013 — Jan 2014',
            role: 'Representante Comercial — Planos de Capitalização',
            org: 'Providus S.A.',
            description: 'Vendas presenciais de planos de previdência e acompanhamento de carteira de clientes.',
            transferableCompetency: 'Persuasão ética, disciplina diária e resiliência comercial.'
          },
          {
            dates: 'Fev 2013 — Abr 2013',
            role: 'Atendente Gastronômico',
            org: 'Al Natural',
            description: 'Atendimento ao público em restaurante de alimentação saudável e trabalho em equipe sob pressão.',
            transferableCompetency: 'Coordenação operacional e equilíbrio em momentos de pico.'
          },
          {
            dates: 'Jan 2012 — Jan 2013',
            role: 'Atendente e Operador de Caixa',
            org: 'Grido Helados',
            description: 'Primeiro emprego formal: atendimento em sorveteria de alto fluxo e controle de caixa.',
            transferableCompetency: 'Responsabilidade financeira, agilidade de atendimento e empatia.'
          }
        ]
      },
      {
        beltKey: 'verde',
        years: '2015 — 2019',
        title: 'O Estado',
        lede: 'Experiência sólida na tramitação massiva de processos, controle documental e cumprimento estrito de normas previdenciárias.',
        positions: [
          {
            dates: 'Dez 2015 — Mar 2019',
            role: 'Administrativo Operacional (contratado)',
            org: 'ANSES',
            description: 'Primeira fase no órgão: tramitação de milhares de processos e rigor normativo. Saída decorrente de reestruturação do quadro estatal.',
            transferableCompetency: 'Rigor documental, gestão de processos em massa e atendimento público regulado.'
          }
        ]
      },
      {
        beltKey: 'azul',
        years: '2019 — 2024',
        title: 'Reconversão',
        lede: 'Empreendi de forma autônoma na produção audiovisual corporativa e, posteriormente, retornei ao ANSES por concurso público de mérito com foco em suporte a servidores.',
        positions: [
          {
            dates: 'Dez 2021 — Mar 2024',
            role: 'Administrativo e Gestão de Dados (efetivo)',
            org: 'ANSES',
            description: 'Reingresso por concurso público. Suporte a racks de servidores governamentais e criação de painel interno para controle de prazos e metas.',
            transferableCompetency: 'Resiliência sob alta demanda, suporte a servidores/redes e rigor regulatório.'
          },
          {
            dates: 'Mar 2019 — Jan 2020',
            role: 'Fotógrafo e Produtor Audiovisual Freelance',
            org: 'Empreendimento próprio',
            description: 'Produção audiovisual para clientes corporativos (Santander, Federada Salud, ExpoAgro). Dedicação intensiva a estudos de desenvolvimento web durante a pandemia.',
            transferableCompetency: 'Autogestão, resiliência profissional e aprendizado técnico autodidata.'
          }
        ]
      },
      {
        beltKey: 'rojo',
        years: '2024 — 2025',
        title: 'A Fricção',
        lede: 'Convivência com a lentidão e burocracia de sistemas hospitalares arcaicos, confirmando que minha contribuição real está na automação e integração de software moderno.',
        positions: [
          {
            dates: 'Jun 2025 — Out 2025',
            role: 'Administrativo Contábil e Logística',
            org: 'Repuestos JL SRL',
            description: 'Expedição, estoque e conciliação. Criei um leitor em Python para extratos bancários em PDF que discrimina impostos e totaliza lançamentos em segundos.',
            transferableCompetency: 'Eliminação de gargalos burocráticos com Python e iniciativa de melhoria contínua.'
          },
          {
            dates: 'Jan 2025 — Abr 2025',
            role: 'Administrativo Hospitalar',
            org: 'Aurea Med S.A.',
            description: 'Admissão de pacientes, autorizações e faturamento DATATECH com estrito controle de conformidade.',
            transferableCompetency: 'Auditoria administrativa médica, precisão regulatória e gestão de sistemas hospitalares.'
          },
          {
            dates: 'Mai 2024 — Jan 2025',
            role: 'Administrativo Hospitalar',
            org: 'Sanatorio Delta',
            description: 'Admissão geral, oncologia, autorização de exames e faturamento com sistema Algoritmo e tabela médica nacional.',
            transferableCompetency: 'Auditoria médica, tolerância à alta rotina hospitalar e otimização de rotinas.'
          }
        ]
      },
      {
        beltKey: 'negro',
        years: 'Jun 2025 — Presente',
        title: 'Produção',
        lede: 'Fundei a NodoSur, marca e software factory para desenvolvimento de sistemas próprios: NodoFit, faturamento fiscal com ARCA e soluções para clientes como Satori Dojo, Don Pizza e Seiton Motors.',
        positions: [
          {
            dates: 'Jun 2025 — Presente',
            role: 'Fundador e Desenvolvedor',
            org: 'NodoSur',
            description: 'Software factory com servidores Linux próprios, Docker e pipelines CI/CD com GitHub Actions. Sistemas em produção: NodoFit (SaaS), Satori Dojo, Don Pizza e Seiton Motors. Disponibilidade full-time para equipes de engenharia.',
            transferableCompetency: 'Arquitetura de software em produção, capacidade de entregar e sustentar sistemas confiáveis, liderança e ética.'
          }
        ]
      }
    ]
  }
};
