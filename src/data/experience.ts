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
      title: 'Fundador y Desarrollador',
      organization: 'NodoSur',
      summary: 'Fundé NodoSur, la marca y software factory bajo la que diseño, despliego y mantengo sistemas propios: NodoFit, la facturación fiscal con ARCA y el trabajo que hago para clientes como Satori Dojo y Don Pizza — todos con usuarios reales y desplegados en infraestructura cloud propia. Tomó forma en paralelo con mi último empleo en relación de dependencia, no después de dejarlo. Hoy es mi ocupación principal, con disponibilidad full-time real para sumarme a un equipo.',
      highlights: [
        'Desarrollo y mantenimiento activo de plataformas SaaS como NodoFit y sistemas para clientes (Seiton Motors, Satori Dojo).',
        'Integración con webservices de ARCA (ex AFIP) para facturación electrónica con validación humana en el loop.',
        'Soporte operativo y tecnológico en Don Pizza Rosario: sincronización de la app de delivery con el sistema propio del local, además de funcionar como Living Lab para testear UX móvil y pedidos en horas pico.',
        'Más de una década como Profesor Internacional de Taekwondo ITF (disciplina y pedagogía) y estudiante de Licenciatura en Filosofía en la UNR (pensamiento crítico y ética).'
      ],
      transferableSkill: 'Arquitectura de software en producción, capacidad de entregar y sostener sistemas confiables, liderazgo y disciplina ética.'
    },
    {
      period: 'Jun 2025 — Oct 2025',
      badge: 'Logística & Contabilidad',
      title: 'Administrativo Contable y Logística',
      organization: 'Repuestos JL SRL',
      summary: 'Empecé en Repuestos JL el mismo mes que fundé NodoSur, en paralelo, no como consecuencia de dejar un empleo anterior. Mientras cubría despacho de mercadería, control de stock, facturación y cobranzas, identifiqué un cuello de botella real en la conciliación contable y lo resolví con código propio.',
      highlights: [
        'Despacho de mercadería, control de stock y facturación, con seguimiento hasta el cobro.',
        'Desarrollo en Python de un bot lector de extractos bancarios en PDF: detecta y discrimina alícuotas de IVA y totaliza montos para liquidaciones contables en segundos, sustituyendo horas de marcado manual.',
        'Gestión de cobranzas y conciliación entre proveedores y clientes mayoristas.'
      ],
      transferableSkill: 'Resolución de cuellos de botella administrativos con código en Python e iniciativa de mejora continua.'
    },
    {
      period: 'Ene 2025 — Abr 2025',
      badge: 'Salud & Gestión',
      title: 'Administrativo, Gestión en Salud',
      organization: 'Aurea Med S.A.',
      summary: 'Profundicé la etapa de gestión sanitaria de alta demanda que había empezado en Sanatorio Delta, ahora con foco en pacientes, turnos y facturación con el sistema DATATECH, sosteniendo el mismo estándar de control documental y cumplimiento normativo.',
      highlights: [
        'Gestión de pacientes, turnos y facturación con el sistema DATATECH.',
        'Control documental y cumplimiento normativo en un entorno de salud regulado.',
        'Continuidad directa de la experiencia adquirida en Sanatorio Delta, con mayor autonomía operativa.'
      ],
      transferableSkill: 'Auditoría administrativa en salud, atención al detalle normativo y manejo de sistemas de gestión de pacientes.'
    },
    {
      period: 'May 2024 — Ene 2025',
      badge: 'Salud & Alta Demanda',
      title: 'Administrativo, Gestión en Salud',
      organization: 'Sanatorio Delta',
      summary: 'Trabajé en admisión general, turnos, admisión de oncología, recepción de laboratorios y caja, con el sistema Algoritmo y el nomenclador nacional de salud, en un entorno de alta demanda. Vivir de cerca la burocracia en papel y los errores de facturación de un sistema arcaico me confirmó que mi aporte real estaba en automatizar, no en ejecutar tareas manuales.',
      highlights: [
        'Admisión general y admisión de oncología en un entorno de alta demanda.',
        'Turnos médicos, recepción de laboratorios y manejo de caja.',
        'Facturación con el sistema Algoritmo y el nomenclador nacional de salud.'
      ],
      transferableSkill: 'Auditoría médica, tolerancia a la alta demanda operativa y visión de optimización de procesos.'
    },
    {
      period: 'Dic 2021 — Mar 2024',
      badge: 'Infraestructura & Estado',
      title: 'Administrativo Integral y Gestión de Datos',
      organization: 'ANSES (planta permanente)',
      summary: 'Me convocaron de nuevo tras la etapa freelance, rendí y aprobé concursos de mérito hasta la efectivización en planta permanente. Di soporte directo a racks de servidores del Estado Nacional y desarrollé un sistema propio de métricas para el seguimiento de trámites masivos.',
      highlights: [
        'Mesa de ayuda informática regional: instalación de puestos de trabajo, actualización de software y conexionado con racks de servidores del Estado Nacional.',
        'Desarrollo de un sistema interno para visualización y monitoreo de métricas individuales de trámites mensuales.',
        'Procesamiento y control documental de miles de expedientes con estricto apego a leyes previsionales y normativas vigentes.'
      ],
      transferableSkill: 'Tolerancia a la alta demanda masiva, trabajo en infraestructura de red/servidores y rigor normativo.'
    },
    {
      period: 'Mar 2019 — Ene 2020',
      badge: 'Emprendimiento & Producción Audiovisual',
      title: 'Fotógrafo y Filmmaker Freelance',
      organization: 'Emprendimiento propio',
      summary: 'Cuando una reestructuración de nómina del Estado cerró mi primer contrato en ANSES, no me quedé esperando: armé mi propio negocio de fotografía y filmmaking corporativo, cubriendo eventos empresariales de primera línea en Rosario. Aproveché también la pandemia para profundizar de forma intensiva en programación moderna.',
      highlights: [
        'Emprendí en fotografía y filmmaking corporativo para clientes como Santander, Federada Salud y ExpoAgro.',
        'Gestioné de forma autónoma la relación comercial con cada cliente, desde la propuesta hasta la entrega final.',
        'Profundicé de forma intensiva en cursos y herramientas modernas de programación durante la pandemia.'
      ],
      transferableSkill: 'Autogestión, resiliencia frente a la incertidumbre laboral y capacidad de reconversión técnica autodidacta.'
    },
    {
      period: 'Dic 2015 — Mar 2019',
      badge: 'Infraestructura & Estado',
      title: 'Administrativo Integral',
      organization: 'ANSES (contratado)',
      summary: 'Entré contratado en 2015 y me forjé en gestión de expedientes masivos y control documental estricto, bajo la legislación previsional y social vigente. Esta primera etapa terminó por una reestructuración de nómina del Estado, no por decisión propia ni por desempeño.',
      highlights: [
        'Procesamiento y control documental de miles de expedientes con estricto apego a legislación previsional y social vigente.',
        'Atención directa al público en trámites de alta sensibilidad y volumen masivo.',
        'Aplicación rigurosa de normativa previsional en cada expediente gestionado.'
      ],
      transferableSkill: 'Rigor normativo, gestión documental masiva y trato directo con público en contextos regulados.'
    },
    {
      period: 'Mar 2015 — Sep 2015',
      badge: 'Ventas & Negociación',
      title: 'Vendedor Viajante de Servicios de Salud',
      organization: 'AS MED S.A.',
      summary: 'Vendí servicios de salud puerta a puerta, con negociación directa y cara a cara con cada cliente potencial.',
      highlights: [
        'Venta puerta a puerta de servicios de salud.',
        'Negociación directa y cierre de venta cara a cara.'
      ],
      transferableSkill: 'Negociación directa, empatía con el cliente y comunicación cara a cara.'
    },
    {
      period: 'May 2013 — Ene 2014',
      badge: 'Ventas & Negociación',
      title: 'Vendedor Viajante de Planes de Capitalización y Ahorro',
      organization: 'Providus S.A.',
      summary: 'Vendí planes de capitalización y ahorro en la calle, con el mismo tipo de venta directa puerta a puerta.',
      highlights: [
        'Venta directa puerta a puerta de planes de capitalización y ahorro.',
        'Negociación cara a cara y seguimiento comercial de cada cliente.'
      ],
      transferableSkill: 'Negociación directa, empatía con el cliente y comunicación cara a cara.'
    },
    {
      period: 'Feb 2013 — Abr 2013',
      badge: 'Atención al Público',
      title: 'Gastronómico',
      organization: 'Al Natural',
      summary: 'Atención al público en un local de comidas saludables, con venta de ensaladas y platos preparados, en un ritmo de trabajo en equipo bajo presión.',
      highlights: [
        'Atención al público y venta en un local especializado en ensaladas y comida saludable.',
        'Trabajo en equipo bajo presión en horarios de alta demanda.'
      ],
      transferableSkill: 'Negociación directa, empatía con el cliente y comunicación cara a cara.'
    },
    {
      period: 'Ene 2012 — Ene 2013',
      badge: 'Atención al Público',
      title: 'Vendedor y Atención al Público',
      organization: 'Grido Helados',
      summary: 'Mi primer trabajo formal: atención al público y venta en un local de heladería, con manejo de caja y ritmo de alta rotación en las horas pico.',
      highlights: [
        'Atención al público y venta directa en un local de heladería de alto tránsito.',
        'Manejo de caja y organización del local en horarios de alta demanda.'
      ],
      transferableSkill: 'Negociación directa, empatía con el cliente y comunicación cara a cara.'
    }
  ],
  en: [
    {
      period: 'Jun 2025 — Present',
      badge: 'Production & Consulting',
      title: 'Founder and Developer',
      organization: 'NodoSur',
      summary: "I founded NodoSur, the brand and software factory under which I design, ship, and maintain my own systems: NodoFit, ARCA fiscal invoicing, and the work I do for clients like Satori Dojo and Don Pizza — all with real users, deployed on self-managed cloud infrastructure. It took shape in parallel with my last salaried role, not after leaving it. Today it's my main occupation, with real full-time availability to join a team.",
      highlights: [
        'Active development and maintenance of SaaS platforms like NodoFit and client systems (Seiton Motors, Satori Dojo).',
        'Integration with ARCA (ex AFIP) fiscal webservices for automated electronic invoicing with human validation in the loop.',
        'Operational and technical support at Don Pizza Rosario: syncing the delivery app with the in-house system, while also serving as a real-world Living Lab to validate mobile UX and rush-hour orders.',
        'Over a decade as an International Taekwondo ITF Instructor (leadership and pedagogy) and Philosophy undergraduate student at UNR (critical thinking and ethics).'
      ],
      transferableSkill: 'Production software architecture, the ability to ship and sustain reliable systems, leadership, and ethical discipline.'
    },
    {
      period: 'Jun 2025 — Oct 2025',
      badge: 'Logistics & Accounting',
      title: 'Accounting and Logistics Administrator',
      organization: 'Repuestos JL SRL',
      summary: 'I started at Repuestos JL the same month I founded NodoSur, in parallel, not as a consequence of leaving a previous job. While covering merchandise dispatch, inventory control, billing, and collections, I spotted a real bottleneck in accounting reconciliation and solved it with my own code.',
      highlights: [
        'Merchandise dispatch, inventory control, and billing, through to collections.',
        'Developed a Python bank statement PDF parser: detects and breaks down VAT rates and totals amounts for accounting settlements in seconds, replacing hours of manual work.',
        'Managed collections and reconciliation between suppliers and wholesale clients.'
      ],
      transferableSkill: 'Solving administrative bottlenecks with Python code and a continuous-improvement mindset.'
    },
    {
      period: 'Jan 2025 — Apr 2025',
      badge: 'Healthcare & Administration',
      title: 'Healthcare Administrator',
      organization: 'Aurea Med S.A.',
      summary: 'I deepened the high-demand healthcare administration stage I had started at Sanatorio Delta, now focused on patients, scheduling, and billing with the DATATECH system, keeping the same standard of documentation control and regulatory compliance.',
      highlights: [
        'Patient management, scheduling, and billing with the DATATECH system.',
        'Documentation control and regulatory compliance in a regulated healthcare environment.',
        'Direct continuation of the experience gained at Sanatorio Delta, with greater operational autonomy.'
      ],
      transferableSkill: 'Healthcare administrative auditing, attention to regulatory detail, and patient management systems.'
    },
    {
      period: 'May 2024 — Jan 2025',
      badge: 'Healthcare & High Demand',
      title: 'Healthcare Administrator',
      organization: 'Sanatorio Delta',
      summary: 'I worked in general admissions, scheduling, oncology admissions, lab reception, and cash handling, with the Algoritmo system and the national healthcare billing code, in a high-demand environment. Seeing firsthand the paper-based bureaucracy and billing errors of a legacy system confirmed that my real contribution belonged in automation, not manual execution.',
      highlights: [
        'General admissions and oncology admissions in a high-demand environment.',
        'Medical scheduling, lab reception, and cash handling.',
        'Billing with the Algoritmo system and the national healthcare billing code.'
      ],
      transferableSkill: 'Medical auditing, tolerance for high operational demand, and a process-optimization mindset.'
    },
    {
      period: 'Dec 2021 — Mar 2024',
      badge: 'Infrastructure & Public Sector',
      title: 'Full-Cycle Administrator & Data Management',
      organization: 'ANSES (permanent staff)',
      summary: 'I was brought back after my freelance stage, passed competitive merit examinations, and reached permanent tenure. I provided direct support for National Government server racks and built an internal metrics system to track large-scale case processing.',
      highlights: [
        'Regional IT Helpdesk: workstation setup, software deployments, and network connectivity with National Government server racks.',
        'Built an internal metrics dashboard to track and visualize monthly procedure processing times.',
        'Processed and verified thousands of case files under strict social security compliance and government regulations.'
      ],
      transferableSkill: 'Resilience under high-volume pressure, server rack infrastructure management, and compliance rigor.'
    },
    {
      period: 'Mar 2019 — Jan 2020',
      badge: 'Entrepreneurship & Audiovisual Production',
      title: 'Freelance Photographer and Filmmaker',
      organization: 'Self-employed',
      summary: "When a national payroll restructuring closed out my first contract at ANSES, I didn't wait it out: I built my own corporate photography and filmmaking business, covering top-tier corporate events in Rosario. I also used the pandemic to go deep on modern programming.",
      highlights: [
        'Ran a corporate photography and filmmaking business for clients like Santander, Federada Salud, and ExpoAgro.',
        'Independently managed the client relationship for each project, from proposal to final delivery.',
        'Used the pandemic period for intensive, self-directed study of modern programming tools and courses.'
      ],
      transferableSkill: 'Self-management, resilience through career uncertainty, and self-taught technical reinvention.'
    },
    {
      period: 'Dec 2015 — Mar 2019',
      badge: 'Infrastructure & Public Sector',
      title: 'Full-Cycle Administrator',
      organization: 'ANSES (contract)',
      summary: 'I was hired on contract in 2015 and was shaped by high-volume case management and strict document control, under current social security regulation. This first stage ended due to a national payroll restructuring, not by my own decision or performance.',
      highlights: [
        'Processed and verified thousands of case files under current social security regulation.',
        'Direct public-facing service on high-sensitivity, high-volume procedures.',
        'Rigorous application of social security regulation on every case processed.'
      ],
      transferableSkill: 'Regulatory rigor, large-scale document management, and direct public service in regulated settings.'
    },
    {
      period: 'Mar 2015 — Sep 2015',
      badge: 'Sales & Negotiation',
      title: 'Field Sales Representative — Healthcare Services',
      organization: 'AS MED S.A.',
      summary: 'I sold healthcare services door-to-door, with direct, face-to-face negotiation with every prospective client.',
      highlights: [
        'Door-to-door sales of healthcare services.',
        'Direct, face-to-face negotiation and closing.'
      ],
      transferableSkill: 'Direct negotiation, customer empathy, and face-to-face communication.'
    },
    {
      period: 'May 2013 — Jan 2014',
      badge: 'Sales & Negotiation',
      title: 'Field Sales Representative — Savings & Capitalization Plans',
      organization: 'Providus S.A.',
      summary: 'I sold savings and capitalization plans on the street, with the same kind of door-to-door direct sales.',
      highlights: [
        'Door-to-door direct sales of savings and capitalization plans.',
        'Face-to-face negotiation and commercial follow-up with each client.'
      ],
      transferableSkill: 'Direct negotiation, customer empathy, and face-to-face communication.'
    },
    {
      period: 'Feb 2013 — Apr 2013',
      badge: 'Customer Service',
      title: 'Food Service',
      organization: 'Al Natural',
      summary: 'Customer service at a healthy food spot, selling salads and prepared meals, in a fast-paced team environment.',
      highlights: [
        'Customer-facing sales at a salad and healthy-food spot.',
        'Teamwork under pressure during peak-demand hours.'
      ],
      transferableSkill: 'Direct negotiation, customer empathy, and face-to-face communication.'
    },
    {
      period: 'Jan 2012 — Jan 2013',
      badge: 'Customer Service',
      title: 'Sales and Customer Service',
      organization: 'Grido Helados',
      summary: 'My first formal job: customer service and sales at an ice cream shop, handling cash register duties and a high-turnover pace during peak hours.',
      highlights: [
        'Customer-facing sales at a high-traffic ice cream shop.',
        'Cash register handling and store organization during peak-demand hours.'
      ],
      transferableSkill: 'Direct negotiation, customer empathy, and face-to-face communication.'
    }
  ],
  pt: [
    {
      period: 'Jun 2025 — Presente',
      badge: 'Produção & Consultoria',
      title: 'Fundador e Desenvolvedor',
      organization: 'NodoSur',
      summary: 'Fundei a NodoSur, a marca e software factory sob a qual projeto, implanto e mantenho sistemas próprios: NodoFit, a faturação fiscal com ARCA, e o trabalho que faço para clientes como Satori Dojo e Don Pizza — todos com usuários reais e hospedados em infraestrutura cloud própria. Tomou forma em paralelo com meu último vínculo empregatício, não depois de sair dele. Hoje é minha ocupação principal, com disponibilidade full-time real para ingressar em uma equipe.',
      highlights: [
        'Desenvolvimento e manutenção ativa de plataformas SaaS como NodoFit e sistemas para clientes (Seiton Motors, Satori Dojo).',
        'Integração fiscal com webservices da ARCA (ex AFIP) para emissão de notas fiscais com validação humana.',
        'Suporte operacional e tecnológico na Don Pizza Rosario: sincronização do app de delivery com o sistema próprio do local, além de funcionar como Living Lab para testar UX móvel e pedidos em horário de pico.',
        'Mais de uma década como Professor Internacional de Taekwondo ITF (disciplina e liderança) e estudante de Filosofia na UNR.'
      ],
      transferableSkill: 'Arquitetura de software em produção, capacidade de entregar e sustentar sistemas confiáveis, liderança e ética.'
    },
    {
      period: 'Jun 2025 — Out 2025',
      badge: 'Logística & Contabilidade',
      title: 'Administrativo Contábil e Logística',
      organization: 'Repuestos JL SRL',
      summary: 'Comecei na Repuestos JL no mesmo mês em que fundei a NodoSur, em paralelo, não como consequência de sair de um emprego anterior. Enquanto cobria expedição de mercadorias, controle de estoque, faturamento e cobranças, identifiquei um gargalo real na conciliação contábil e o resolvi com código próprio.',
      highlights: [
        'Expedição de mercadorias, controle de estoque e faturamento, até o recebimento.',
        'Desenvolvimento em Python de um bot leitor de extratos bancários em PDF: identifica alíquotas de imposto e totaliza valores para liquidações contábeis em segundos, substituindo horas de trabalho manual.',
        'Gestão de cobranças e conciliação entre fornecedores e clientes atacadistas.'
      ],
      transferableSkill: 'Resolução de gargalos administrativos com código em Python e iniciativa de melhoria contínua.'
    },
    {
      period: 'Jan 2025 — Abr 2025',
      badge: 'Saúde & Gestão',
      title: 'Administrativo, Gestão em Saúde',
      organization: 'Aurea Med S.A.',
      summary: 'Aprofundei a etapa de gestão hospitalar de alta demanda que havia começado no Sanatorio Delta, agora com foco em pacientes, agendamento e faturamento com o sistema DATATECH, mantendo o mesmo padrão de controle documental e conformidade normativa.',
      highlights: [
        'Gestão de pacientes, agendamento e faturamento com o sistema DATATECH.',
        'Controle documental e conformidade normativa em um ambiente de saúde regulado.',
        'Continuidade direta da experiência adquirida no Sanatorio Delta, com maior autonomia operacional.'
      ],
      transferableSkill: 'Auditoria administrativa em saúde, atenção ao detalhe normativo e domínio de sistemas de gestão de pacientes.'
    },
    {
      period: 'Mai 2024 — Jan 2025',
      badge: 'Saúde & Alta Demanda',
      title: 'Administrativo, Gestão em Saúde',
      organization: 'Sanatorio Delta',
      summary: 'Trabalhei na admissão geral, agendamento, admissão de oncologia, recepção de laboratórios e caixa, com o sistema Algoritmo e o nomenclador nacional de saúde, em ambiente de alta demanda. Vivenciar de perto a burocracia em papel e os erros de faturamento de um sistema ultrapassado confirmou que minha contribuição real estava em automatizar, não em executar tarefas manuais.',
      highlights: [
        'Admissão geral e admissão de oncologia em ambiente de alta demanda.',
        'Agendamento médico, recepção de laboratórios e manejo de caixa.',
        'Faturamento com o sistema Algoritmo e o nomenclador nacional de saúde.'
      ],
      transferableSkill: 'Auditoria hospitalar, tolerância à alta demanda operacional e visão de otimização de processos.'
    },
    {
      period: 'Dez 2021 — Mar 2024',
      badge: 'Infraestrutura & Setor Público',
      title: 'Administrativo Integral e Gestão de Dados',
      organization: 'ANSES (quadro permanente)',
      summary: 'Fui convocado novamente após a etapa freelance, fui aprovado em concursos de mérito até a efetivação no quadro permanente. Dei suporte direto aos racks de servidores do Estado Nacional e desenvolvi um sistema próprio de métricas para o acompanhamento de processos em massa.',
      highlights: [
        'Suporte técnico regional: configuração de estações de trabalho, atualização de software e conexão com os racks de servidores do Estado Nacional.',
        'Desenvolvimento de sistema interno para visualização e monitoramento de métricas individuais de processos mensais.',
        'Processamento e validação documental de milhares de processos com estrito rigor normativo e legal.'
      ],
      transferableSkill: 'Resistência à alta pressão de atendimento, infraestrutura de redes/servidores e precisão normativa.'
    },
    {
      period: 'Mar 2019 — Jan 2020',
      badge: 'Empreendedorismo & Produção Audiovisual',
      title: 'Fotógrafo e Filmmaker Freelance',
      organization: 'Negócio próprio',
      summary: 'Quando uma reestruturação da folha do Estado encerrou meu primeiro contrato na ANSES, não fiquei esperando: montei meu próprio negócio de fotografia e filmmaking corporativo, cobrindo eventos empresariais de primeira linha em Rosario. Também aproveitei a pandemia para me aprofundar intensivamente em programação moderna.',
      highlights: [
        'Empreendi em fotografia e filmmaking corporativo para clientes como Santander, Federada Salud e ExpoAgro.',
        'Gerenciei de forma autônoma o relacionamento comercial com cada cliente, da proposta até a entrega final.',
        'Aprofundei-me de forma intensiva em cursos e ferramentas modernas de programação durante a pandemia.'
      ],
      transferableSkill: 'Autogestão, resiliência diante da incerteza profissional e capacidade de reconversão técnica autodidata.'
    },
    {
      period: 'Dez 2015 — Mar 2019',
      badge: 'Infraestrutura & Setor Público',
      title: 'Administrativo Integral',
      organization: 'ANSES (contratado)',
      summary: 'Fui contratado em 2015 e fui forjado na gestão de processos em massa e no controle documental estrito, sob a legislação previdenciária e social vigente. Essa primeira etapa terminou por uma reestruturação da folha do Estado, não por decisão própria nem por desempenho.',
      highlights: [
        'Processamento e validação documental de milhares de processos sob a legislação previdenciária e social vigente.',
        'Atendimento direto ao público em processos de alta sensibilidade e volume massivo.',
        'Aplicação rigorosa da normativa previdenciária em cada processo gerenciado.'
      ],
      transferableSkill: 'Rigor normativo, gestão documental em massa e atendimento direto ao público em contextos regulados.'
    },
    {
      period: 'Mar 2015 — Set 2015',
      badge: 'Vendas & Negociação',
      title: 'Vendedor Externo de Serviços de Saúde',
      organization: 'AS MED S.A.',
      summary: 'Vendi serviços de saúde porta a porta, com negociação direta e cara a cara com cada cliente em potencial.',
      highlights: [
        'Venda porta a porta de serviços de saúde.',
        'Negociação direta e fechamento de venda cara a cara.'
      ],
      transferableSkill: 'Negociação direta, empatia com o cliente e comunicação cara a cara.'
    },
    {
      period: 'Mai 2013 — Jan 2014',
      badge: 'Vendas & Negociação',
      title: 'Vendedor Externo de Planos de Capitalização e Poupança',
      organization: 'Providus S.A.',
      summary: 'Vendi planos de capitalização e poupança na rua, com o mesmo tipo de venda direta porta a porta.',
      highlights: [
        'Venda direta porta a porta de planos de capitalização e poupança.',
        'Negociação cara a cara e acompanhamento comercial de cada cliente.'
      ],
      transferableSkill: 'Negociação direta, empatia com o cliente e comunicação cara a cara.'
    },
    {
      period: 'Fev 2013 — Abr 2013',
      badge: 'Atendimento ao Público',
      title: 'Gastronômico',
      organization: 'Al Natural',
      summary: 'Atendimento ao público em um local de comida saudável, com venda de saladas e pratos prontos, em um ritmo de trabalho em equipe sob pressão.',
      highlights: [
        'Atendimento ao público e vendas em um local especializado em saladas e comida saudável.',
        'Trabalho em equipe sob pressão em horários de alta demanda.'
      ],
      transferableSkill: 'Negociação direta, empatia com o cliente e comunicação cara a cara.'
    },
    {
      period: 'Jan 2012 — Jan 2013',
      badge: 'Atendimento ao Público',
      title: 'Vendedor e Atendimento ao Público',
      organization: 'Grido Helados',
      summary: 'Meu primeiro emprego formal: atendimento ao público e vendas em uma sorveteria, com manejo de caixa e ritmo de alta rotatividade nos horários de pico.',
      highlights: [
        'Atendimento ao público e vendas em uma sorveteria de alto movimento.',
        'Manejo de caixa e organização da loja em horários de alta demanda.'
      ],
      transferableSkill: 'Negociação direta, empatia com o cliente e comunicação cara a cara.'
    }
  ]
};
