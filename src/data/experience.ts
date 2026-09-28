import type { Lang } from '../i18n/ui';

export interface Milestone {
  period: string;
  badge: string;
  title: string;
  organization: string;
  summary: string;
  highlights: string[];
  transferableSkill: string;
}

export const experienceData: Record<Lang, Milestone[]> = {
  es: [
    {
      period: '2025 — Presente',
      badge: 'Producción & Consultoría',
      title: 'Sistemas en Producción, Docencia & Filosofía',
      organization: 'NodoSur · Don Pizza Rosario · Filosofía (UNR) · Taekwondo ITF',
      summary: 'Sistemas propios en producción, con usuarios reales pagando, desplegados en servidores cloud propios (Linux, Docker, GitHub Actions) — tomaron forma en paralelo mientras trabajaba en relación de dependencia, no después de dejarla.',
      highlights: [
        'Desarrollo y mantenimiento activo de plataformas SaaS como NodoFit y sistemas para clientes (Seiton Motors, Satori Dojo).',
        'Integración con webservices de ARCA (ex AFIP) para facturación electrónica con validación humana en el loop.',
        'Operación de media jornada en Don Pizza Rosario como Living Lab comercial para testear UX móvil, stock y pedidos en horas pico de demanda.',
        'Más de una década como Profesor Internacional de Taekwondo ITF (disciplina y pedagogía) y estudiante de Licenciatura en Filosofía en la UNR (pensamiento crítico y ética).'
      ],
      transferableSkill: 'Arquitectura de software en producción, capacidad de entregar y sostener sistemas confiables, liderazgo y disciplina ética.'
    },
    {
      period: '2024 — 2025',
      badge: 'Salud & Logística',
      title: 'Gestión Sanitaria, Auditoría & Automatización',
      organization: 'Sanatorio Delta · Sanatorio Centro (Aurea MED) · Repuestos JL',
      summary: 'Inmersión en la trinchera de salud de alta exigencia y logística comercial mayorista, identificando la fricción de software que impulsó la creación de herramientas propias.',
      highlights: [
        'Admisión oncológica, recepción de laboratorios, manejo de nomenclador nacional de salud, auditoría médica y sistema Algoritmo.',
        'Despacho y control integral de stock, cobranzas y facturación en Repuestos JL.',
        'Desarrollo en Python de un bot lector de extractos bancarios en PDF: detecta y discrimina alícuotas de IVA y totaliza montos para liquidaciones contables en segundos, sustituyendo horas de marcado manual.'
      ],
      transferableSkill: 'Auditoría médica/contable, resolución de cuellos de botella con código en Python e iniciativa de mejora continua.'
    },
    {
      period: '2015 — 2024',
      badge: 'Infraestructura & Estado',
      title: 'Planta Permanente, Mesa de Ayuda & Expedientes',
      organization: 'Administración Nacional de la Seguridad Social (ANSES)',
      summary: 'Ingreso como contratado y posterior efectivización en planta permanente tras superar concursos de mérito. Gestión masiva e infraestructura tecnológica crítica.',
      highlights: [
        'Mesa de ayuda informática regional: instalación de puestos de trabajo, actualización de software y conexionado con racks de servidores del Estado Nacional.',
        'Desarrollo de un sistema interno para visualización y monitoreo de métricas individuales de trámites mensuales.',
        'Procesamiento y control documental de miles de expedientes con estricto apego a leyes previsionales y normativas vigentes.',
        'En la pausa entre contrataciones (2019-2020), emprendió en fotografía y filmmaking empresarial (Santander, Federada Salud, ExpoAgro) y aprovechó la pandemia para profundizar en programación moderna.'
      ],
      transferableSkill: 'Tolerancia a la alta demanda masiva, trabajo en infraestructura de red/servidores y rigor normativo.'
    },
    {
      period: '2011 — 2015',
      badge: 'Bases & Negocio',
      title: 'Formación Técnica & Venta en Campo',
      organization: 'Escuela Técnica Manuel Belgrano · Providus S.A. · AS MED S.A.',
      summary: 'Cimientos técnicos tempranos combinados con una rápida inserción laboral en ventas de calle y contacto comercial directo.',
      highlights: [
        'Egresado secundario técnico con especialización en Robótica y Programación (fundamentos tempranos de lógica e ingeniería).',
        'Vendedor viajante de servicios de salud en AS MED S.A. y planes de capitalización y ahorro en Providus S.A.',
        'Atención gastronómica y dinamismo en Al Natural (2013).'
      ],
      transferableSkill: 'Fundamentos de ingeniería, negociación directa en la calle, empatía y comunicación con el cliente final.'
    }
  ],
  en: [
    {
      period: '2025 — Present',
      badge: 'Production & Consulting',
      title: 'Production Systems, Teaching & Philosophy',
      organization: 'NodoSur · Don Pizza Rosario · Philosophy (UNR) · Taekwondo ITF',
      summary: 'Production systems with real paying users, deployed on self-managed cloud infrastructure (Linux, Docker, GitHub Actions) — built in parallel while holding a full-time job, not after leaving one.',
      highlights: [
        'Active development and maintenance of SaaS platforms like NodoFit and client systems (Seiton Motors, Satori Dojo).',
        'Integration with ARCA (ex AFIP) fiscal webservices for automated electronic invoicing with human validation in the loop.',
        'Half-day commercial operation at Don Pizza Rosario acting as a real-world Living Lab to validate mobile UX and kitchen dispatch under rush hours.',
        'Over a decade as an International Taekwondo ITF Instructor (leadership and pedagogy) and Philosophy undergraduate student at UNR (critical thinking and ethics).'
      ],
      transferableSkill: 'Production software architecture, the ability to ship and sustain reliable systems, leadership, and ethical discipline.'
    },
    {
      period: '2024 — 2025',
      badge: 'Healthcare & Logistics',
      title: 'Healthcare Management, Audit & Automation',
      organization: 'Sanatorio Delta · Sanatorio Centro (Aurea MED) · Repuestos JL',
      summary: 'High-demand healthcare admissions and commercial wholesale logistics, pinpointing operational bottlenecks that directly catalyzed custom software engineering.',
      highlights: [
        'Oncology patient admissions, laboratory reception, medical coding (national healthcare nomenclature), and Algoritmo system administration.',
        'Warehouse dispatch, wholesale inventory control, and payment processing at Repuestos JL.',
        'Developed a Python automated bank PDF parser: detects VAT rates and summarizes transactions for accounting reconciliations in seconds, replacing hours of manual work.'
      ],
      transferableSkill: 'Medical and financial auditing, Python process automation, and continuous improvement initiative.'
    },
    {
      period: '2015 — 2024',
      badge: 'Infrastructure & Public Sector',
      title: 'Permanent Staff, IT Helpdesk & Data Processing',
      organization: 'ANSES (National Social Security Administration)',
      summary: 'Started on contract and earned permanent tenure through competitive merit examinations. Massive operational scale and critical IT server infrastructure.',
      highlights: [
        'Regional IT Helpdesk: workstation setup, software deployments, and network connectivity with National Government server racks.',
        'Built an internal metrics dashboard to track and visualize monthly procedure processing times.',
        'Processed and verified thousands of critical files under strict social security compliance and government regulations.',
        'During contract transition (2019-2020), ran a corporate filmmaking and photography business (Santander, Federada Salud, ExpoAgro) and utilized the pandemic period for intensive software programming mastery.'
      ],
      transferableSkill: 'Resilience under high-volume pressure, server rack infrastructure management, and compliance rigor.'
    },
    {
      period: '2011 — 2015',
      badge: 'Foundations & Sales',
      title: 'Technical Education & Field Sales',
      organization: 'Manuel Belgrano Technical High School · Providus S.A. · AS MED S.A.',
      summary: 'Early technical engineering foundations combined with frontline door-to-door sales and direct customer negotiations.',
      highlights: [
        'Graduated from Technical High School specialized in Robotics and Programming (solid early foundations in logic and systems).',
        'Field sales representative for healthcare plans at AS MED S.A. and savings/capitalization programs at Providus S.A.',
        'Fast-paced food service operations at Al Natural (2013).'
      ],
      transferableSkill: 'Core engineering logic, direct field negotiation, persuasion, and empathetic user communication.'
    }
  ],
  pt: [
    {
      period: '2025 — Presente',
      badge: 'Produção & Consultoria',
      title: 'Sistemas em Produção, Docência & Filosofia',
      organization: 'NodoSur · Don Pizza Rosario · Filosofia (UNR) · Taekwondo ITF',
      summary: 'Sistemas próprios em produção, com usuários reais pagando, hospedados em infraestrutura cloud própria (Linux, Docker, GitHub Actions) — tomaram forma em paralelo enquanto trabalhava em vínculo empregatício, não depois de sair dele.',
      highlights: [
        'Desenvolvimento e manutenção ativa de plataformas SaaS como NodoFit e sistemas para clientes (Seiton Motors, Satori Dojo).',
        'Integração fiscal com webservices da ARCA (ex AFIP) para emissão de notas fiscais com validação humana.',
        'Atuação comercial em Don Pizza Rosario como Living Lab para testar UX móvel, estoque e pedidos em horário de pico.',
        'Mais de uma década como Professor Internacional de Taekwondo ITF (disciplina e liderança) e estudante de Filosofia na UNR.'
      ],
      transferableSkill: 'Arquitetura de software em produção, capacidade de entregar e sustentar sistemas confiáveis, liderança e ética.'
    },
    {
      period: '2024 — 2025',
      badge: 'Saúde & Logística',
      title: 'Gestão Hospitalar, Auditoria & Automação',
      organization: 'Sanatorio Delta · Sanatorio Centro (Aurea MED) · Repuestos JL',
      summary: 'Vivência prática em hospitais de alta demanda e logística comercial, identificando gargalos operacionais que motivaram o desenvolvimento de software.',
      highlights: [
        'Admissão oncológica, recepção de exames laboratoriais, faturamento médico e operação do sistema Algoritmo.',
        'Expedição de mercadorias, controle de estoque e cobrança em Repuestos JL.',
        'Desenvolvimento em Python de um bot leitor de extratos bancários em PDF: identifica alíquotas de imposto e totaliza conciliações contábeis em segundos.'
      ],
      transferableSkill: 'Auditoria hospitalar e contábil, automação em Python e visão pragmática de processos.'
    },
    {
      period: '2015 — 2024',
      badge: 'Infraestrutura & Setor Público',
      title: 'Quadro Permanente, Suporte IT & Gestão de Dados',
      organization: 'ANSES (Previdência Social Nacional)',
      summary: 'Ingresso por contrato e efetivação no quadro permanente após aprovação em concursos de mérito. Operação em escala massiva e infraestrutura de servidores.',
      highlights: [
        'Suporte técnico regional: configuração de estações de trabalho e conexão direta com os racks de servidores do Estado.',
        'Desenvolvimento de sistema interno para visualização de métricas de produtividade mensal de processos.',
        'Análise e validação documental de milhares de processos com estrito rigor normativo e legal.',
        'No intervalo entre contratos (2019-2020), fundou produtora audiovisual (Santander, Federada Salud, ExpoAgro) e aprofundou estudos em programação moderna na pandemia.'
      ],
      transferableSkill: 'Resistência à alta pressão de atendimento, infraestrutura de redes/servidores e precisão normativa.'
    },
    {
      period: '2011 — 2015',
      badge: 'Fundamentos & Negócios',
      title: 'Formação Técnica & Vendas em Campo',
      organization: 'Escola Técnica Manuel Belgrano · Providus S.A. · AS MED S.A.',
      summary: 'Bases técnicas de robótica combinadas com inserção precoce no mercado de vendas externas e contato direto com clientes.',
      highlights: [
        'Ensino técnico com especialização em Robótica e Programação (lógica de sistemas e engenharia desde cedo).',
        'Vendedor externo de planos de saúde na AS MED S.A. e planos de capitalização na Providus S.A.',
        'Operação e dinamismo em atendimento no Al Natural (2013).'
      ],
      transferableSkill: 'Fundamentos de programação, negociação direta, empatía com o cliente e desenvoltura comercial.'
    }
  ]
};
