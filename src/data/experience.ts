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
      period: 'Jun 2025 — Presente',
      badge: 'Producción & Consultoría',
      title: 'Sistemas en Producción, Docencia & Filosofía',
      organization: 'NodoSur · Don Pizza Rosario · Filosofía (UNR) · Taekwondo ITF',
      summary: 'NodoSur reúne los sistemas que diseña y mantiene: Stoky (su producto más maduro, un ERP/POS para comercios), NodoFit y la facturación fiscal con ARCA (incluye además los sistemas Inmotuls y Credituls), todos con usuarios reales pagando y desplegados en infraestructura cloud propia — tomaron forma en paralelo con su último empleo en relación de dependencia, no después de dejarlo. Hoy son su ocupación principal, con disponibilidad full-time real para sumarse a un equipo.',
      highlights: [
        'Desarrollo y mantenimiento activo de plataformas SaaS como NodoFit y sistemas para clientes (Seiton Motors, Satori Dojo).',
        'Integración con webservices de ARCA (ex AFIP) para facturación electrónica con validación humana en el loop.',
        'Soporte operativo y tecnológico en Don Pizza Rosario: sincronización de la app de delivery con el sistema propio del local, además de funcionar como Living Lab para testear UX móvil y pedidos en horas pico.',
        'Más de una década como Profesor Internacional de Taekwondo ITF (disciplina y pedagogía) y estudiante de Licenciatura en Filosofía en la UNR (pensamiento crítico y ética).'
      ],
      transferableSkill: 'Arquitectura de software en producción, capacidad de entregar y sostener sistemas confiables, liderazgo y disciplina ética.'
    },
    {
      period: 'May 2024 — Oct 2025',
      badge: 'Salud & Logística',
      title: 'Gestión Sanitaria, Auditoría & Automatización',
      organization: 'Sanatorio Delta · Aurea Med S.A. · Repuestos JL',
      summary: 'Admisión, turnos y facturación en salud de alta demanda (Sanatorio Delta, Aurea Med), viendo de cerca la burocracia en papel y los errores de facturación de sistemas arcaicos. Esa fricción real confirmó que el aporte que podía dar estaba en automatizar, no en ejecutar tareas manuales. Después, en logística y finanzas de Repuestos JL, construyó un bot en Python que lee extractos bancarios heterogéneos y liquida IVA en segundos — la semilla técnica de lo que hoy es NodoSur, que empezó a tomar forma en paralelo, en los mismos meses.',
      highlights: [
        'Admisión, turnos médicos y facturación con el sistema Algoritmo en Sanatorio Delta, en entorno de alta demanda.',
        'Gestión de pacientes, turnos y facturación con DATATECH en Aurea Med S.A.',
        'Despacho de mercadería, control de stock y facturación en Repuestos JL, con seguimiento hasta el cobro.',
        'Desarrollo en Python de un bot lector de extractos bancarios en PDF: detecta y discrimina alícuotas de IVA y totaliza montos para liquidaciones contables en segundos, sustituyendo horas de marcado manual.'
      ],
      transferableSkill: 'Auditoría médica/contable, resolución de cuellos de botella con código en Python e iniciativa de mejora continua.'
    },
    {
      period: 'Dic 2015 — Mar 2024',
      badge: 'Infraestructura & Estado',
      title: 'Infraestructura Crítica & Gestión Masiva',
      organization: 'Administración Nacional de la Seguridad Social (ANSES)',
      summary: 'Contratado en 2015, forjado en gestión de expedientes masivos y marco normativo previsional hasta que una reestructuración de nómina del Estado cerró esa etapa en 2019. En la pausa no se quedó esperando: armó un negocio propio de fotografía y filmmaking corporativo (Santander, Federada Salud, ExpoAgro) y aprovechó la pandemia para profundizar en programación moderna. Convocado de nuevo en 2021, rindió y aprobó concursos de mérito hasta la efectivización en planta permanente, con soporte directo a racks de servidores del Estado Nacional.',
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
      summary: 'Egresado técnico en Robótica y Programación, con una inserción laboral inmediata en ventas de calle: servicios de salud en AS MED S.A. y planes de capitalización en Providus S.A., después de un primer contacto con la atención al público en Al Natural. Los cimientos técnicos y la negociación directa cara a cara se construyeron en simultáneo, no en secuencia.',
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
      period: 'Jun 2025 — Present',
      badge: 'Production & Consulting',
      title: 'Production Systems, Teaching & Philosophy',
      organization: 'NodoSur · Don Pizza Rosario · Philosophy (UNR) · Taekwondo ITF',
      summary: 'NodoSur brings together the systems he designs and maintains: Stoky (his most mature product, an ERP/POS for small businesses), NodoFit, and ARCA fiscal invoicing (also including the Inmotuls and Credituls systems) — all with real paying users, deployed on self-managed cloud infrastructure. They took shape in parallel with his last salaried role, not after leaving it. Today they are his main occupation, with real full-time availability to join a team.',
      highlights: [
        'Active development and maintenance of SaaS platforms like NodoFit and client systems (Seiton Motors, Satori Dojo).',
        'Integration with ARCA (ex AFIP) fiscal webservices for automated electronic invoicing with human validation in the loop.',
        'Operational and technical support at Don Pizza Rosario: syncing the delivery app with the in-house system, while also serving as a real-world Living Lab to validate mobile UX and rush-hour orders.',
        'Over a decade as an International Taekwondo ITF Instructor (leadership and pedagogy) and Philosophy undergraduate student at UNR (critical thinking and ethics).'
      ],
      transferableSkill: 'Production software architecture, the ability to ship and sustain reliable systems, leadership, and ethical discipline.'
    },
    {
      period: 'May 2024 — Oct 2025',
      badge: 'Healthcare & Logistics',
      title: 'Healthcare Management, Audit & Automation',
      organization: 'Sanatorio Delta · Aurea Med S.A. · Repuestos JL',
      summary: 'Admissions, scheduling, and billing in high-demand healthcare (Sanatorio Delta, Aurea Med), seeing firsthand the paper-based bureaucracy and billing errors of legacy systems. That real friction confirmed his contribution belonged in automation, not manual execution. Afterward, running logistics and finance at Repuestos JL, he built a Python bot that parses heterogeneous bank statements and settles VAT in seconds — the technical seed of what is now NodoSur, which started taking shape in parallel, in those same months.',
      highlights: [
        'Admissions, medical scheduling, and billing with the Algoritmo system at Sanatorio Delta, in a high-demand environment.',
        'Patient, scheduling, and billing management with DATATECH at Aurea Med S.A.',
        'Merchandise dispatch, inventory control, and billing at Repuestos JL, through to collections.',
        'Developed a Python automated bank PDF parser: detects VAT rates and summarizes transactions for accounting reconciliations in seconds, replacing hours of manual work.'
      ],
      transferableSkill: 'Medical and financial auditing, Python process automation, and continuous improvement initiative.'
    },
    {
      period: 'Dec 2015 — Mar 2024',
      badge: 'Infrastructure & Public Sector',
      title: 'Critical Infrastructure & Large-Scale Operations',
      organization: 'ANSES (National Social Security Administration)',
      summary: 'Hired on contract in 2015, shaped by high-volume case management and strict social-security regulation until a national payroll restructuring closed that chapter in 2019. He didn\'t wait it out: he built a corporate photography and filmmaking business (Santander, Federada Salud, ExpoAgro) and used the pandemic to go deep on modern programming. Brought back in 2021, he passed competitive merit examinations into permanent tenure, with direct support for National Government server racks.',
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
      summary: 'Technical high school graduate in Robotics and Programming, moving straight into door-to-door sales: healthcare services at AS MED S.A. and savings plans at Providus S.A., after a first taste of customer-facing work at Al Natural. The technical foundations and face-to-face negotiation were built side by side, not in sequence.',
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
      period: 'Jun 2025 — Presente',
      badge: 'Produção & Consultoria',
      title: 'Sistemas em Produção, Docência & Filosofia',
      organization: 'NodoSur · Don Pizza Rosario · Filosofia (UNR) · Taekwondo ITF',
      summary: 'A NodoSur reúne os sistemas que projeta e mantém: Stoky (seu produto mais maduro, um ERP/POS para comércios), NodoFit e a faturação fiscal com ARCA (inclui também os sistemas Inmotuls e Credituls), todos com usuários reais pagando e hospedados em infraestrutura cloud própria — tomaram forma em paralelo com seu último vínculo empregatício, não depois de sair dele. Hoje são sua ocupação principal, com disponibilidade full-time real para ingressar em uma equipe.',
      highlights: [
        'Desenvolvimento e manutenção ativa de plataformas SaaS como NodoFit e sistemas para clientes (Seiton Motors, Satori Dojo).',
        'Integração fiscal com webservices da ARCA (ex AFIP) para emissão de notas fiscais com validação humana.',
        'Suporte operacional e tecnológico na Don Pizza Rosario: sincronização do app de delivery com o sistema próprio do local, além de funcionar como Living Lab para testar UX móvel e pedidos em horário de pico.',
        'Mais de uma década como Professor Internacional de Taekwondo ITF (disciplina e liderança) e estudante de Filosofia na UNR.'
      ],
      transferableSkill: 'Arquitetura de software em produção, capacidade de entregar e sustentar sistemas confiáveis, liderança e ética.'
    },
    {
      period: 'Mai 2024 — Out 2025',
      badge: 'Saúde & Logística',
      title: 'Gestão Hospitalar, Auditoria & Automação',
      organization: 'Sanatorio Delta · Aurea Med S.A. · Repuestos JL',
      summary: 'Admissão, agendamento e faturamento em saúde de alta demanda (Sanatorio Delta, Aurea Med), vendo de perto a burocracia em papel e os erros de faturamento de sistemas ultrapassados. Essa fricção real confirmou que sua contribuição estava em automatizar, não em executar tarefas manuais. Depois, na logística e finanças da Repuestos JL, construiu um bot em Python que lê extratos bancários heterogêneos e liquida impostos em segundos — a semente técnica do que hoje é a NodoSur, que começou a tomar forma em paralelo, nos mesmos meses.',
      highlights: [
        'Admissão, agendamento médico e faturamento com o sistema Algoritmo no Sanatorio Delta, em ambiente de alta demanda.',
        'Gestão de pacientes, agendamento e faturamento com DATATECH na Aurea Med S.A.',
        'Expedição de mercadorias, controle de estoque e faturamento em Repuestos JL, até o recebimento.',
        'Desenvolvimento em Python de um bot leitor de extratos bancários em PDF: identifica alíquotas de imposto e totaliza conciliações contábeis em segundos.'
      ],
      transferableSkill: 'Auditoria hospitalar e contábil, automação em Python e visão pragmática de processos.'
    },
    {
      period: 'Dez 2015 — Mar 2024',
      badge: 'Infraestrutura & Setor Público',
      title: 'Infraestrutura Crítica & Operação em Larga Escala',
      organization: 'ANSES (Previdência Social Nacional)',
      summary: 'Contratado em 2015, forjado na gestão de processos em massa e no rigor normativo previdenciário até que uma reestruturação da folha do Estado encerrou essa etapa em 2019. Na pausa, não ficou esperando: montou um negócio próprio de fotografia e filmmaking corporativo (Santander, Federada Salud, ExpoAgro) e aproveitou a pandemia para se aprofundar em programação moderna. Convocado novamente em 2021, foi aprovado em concursos de mérito até a efetivação no quadro permanente, com suporte direto aos racks de servidores do Estado Nacional.',
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
      summary: 'Formado em ensino técnico com especialização em Robótica e Programação, partiu direto para vendas externas: planos de saúde na AS MED S.A. e planos de capitalização na Providus S.A., depois de um primeiro contato com atendimento ao público na Al Natural. As bases técnicas e a negociação direta cara a cara se construíram lado a lado, não em sequência.',
      highlights: [
        'Ensino técnico com especialização em Robótica e Programação (lógica de sistemas e engenharia desde cedo).',
        'Vendedor externo de planos de saúde na AS MED S.A. e planos de capitalização na Providus S.A.',
        'Operação e dinamismo em atendimento no Al Natural (2013).'
      ],
      transferableSkill: 'Fundamentos de programação, negociação direta, empatía com o cliente e desenvoltura comercial.'
    }
  ]
};
