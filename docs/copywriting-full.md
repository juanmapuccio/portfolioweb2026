# Copywriting Full: Fuente de Verdad (ES · EN · PT)

> Versión completa del copy del sitio. Es la fuente de verdad: `copywriting-desktop.md` y `copywriting-mobile.md` se derivan de este documento y referencian sus claves (`full.*`).

**Proyecto:** `portfolioweb-puccio2026`
**Bases:** `Copywriting.md` (copy vivo, sincronizado 2026-09-30), `Narrativa.md` (canónico de trayectoria), `Storytelling.md` (estrategia y reglas) y `narrativa-original.md` (voz cronológica del autor).
**Fuentes vivas en código:** `src/i18n/ui.ts`, `src/data/martialExperience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/contact.ts`.
**Nota:** los cuerpos largos EN/PT de las posiciones (§3.3.1, §3.3.2), proyectos (§4.2, §4.3) y categorías de stack (§5.1.1, §5.1.2) fueron transcritos desde `src/data/*.ts` el 2026-10-03. Las diferencias entre el ES de este documento y el código se listan en cada sección bajo "Diferencias con el código"; `src/` no se modificó.

---

## 0. Reglas de contenido (obligatorias)

1. **Audiencia primaria:** recruiter o hiring manager de un puesto asalariado full-time. No es un sitio de captación de clientes de NodoSur.
2. **Eje narrativo:** "qué puede hacer" (auditar procesos de empresas y resolverlos con código), con sistemas propios en producción como prueba de ingeniería.
3. **Autoría:** Stoky, Inmotuls y Credituls los desarrollan otros colaboradores del espacio cooperativo. Nunca se presentan como obra propia. Obra propia: NodoSur (marca e infraestructura), Satori Dojo, NodoFit y Don Pizza.
4. **Disponibilidad:** real e inmediata. Prohibido "fuera de mi horario laboral" y "no interfiere con mi trabajo actual". No afirmar que los productos "no requieren intervención". No comprometer una cifra de horas de mantenimiento.
5. **Dinero:** prohibido escribir o insinuar ingresos pasivos, ingresos recurrentes o cualquier cifra de facturación. Se habla de "sistemas en producción con usuarios reales".
6. **Don Pizza:** se presenta solo como colaboración operativa y técnica. Nunca mencionar informalidad ni situación impositiva.
7. **Empleadores anteriores:** nunca hablar mal de Repuestos JL ni de otro empleador. Hecho, decisión y motivo orientado a futuro.
8. **Formación:** sin mención de Abogacía.
9. **Voz:** primera persona, directa, sin jerga ni cifras no verificables.

## 0.1 Conflictos resueltos (`narrativa-original.md` vs documentos canónicos)

| Dice la narrativa original | Se resuelve a favor de | Criterio |
|---|---|---|
| "renunciando al sueldo fijo y la estabilidad de Repuestos JL" | `Narrativa.md` | NodoSur nació en paralelo (jun 2025). No hubo salto de renuncia para emprender. |
| "trabajando media jornada en un puesto comercial familiar de Pizzas" | `Storytelling.md` §1.0 | No se menciona informalidad ni relación laboral. Se presenta como colaboración operativa y técnica. |
| "Sanatorio Centro (Aurea MED)" | Timeline vivo | Nombre normalizado: Aurea Med S.A. |
| "Providos" | Timeline vivo | Nombre normalizado: Providus S.A. |
| Fin del contrato ANSES "abril 2019" | Timeline vivo | Mar 2019. |
| Clientes: "Seiton Motors y Satori Dojo" | Copy vivo | Se suma NodoFit y Don Pizza como producción propia. Seiton Motors figura solo como cliente de consultoría IT y base de datos. |
| Tono de queja ("sentía que mis saberes quedaban grandes") | `Narrativa.md` | Se reformula como catalizador: identifiqué el dolor administrativo y lo resolví con código. |

---

## 1. Hero (`full.hero.*`)

| Clave | ES | EN | PT |
|---|---|---|---|
| `full.hero.metaTitle` | Juan Manuel Puccio \| Desarrollador Full Stack · Auditoría y Automatización de Procesos | Juan Manuel Puccio \| Full Stack Developer · Process Auditing & Automation | Juan Manuel Puccio \| Desenvolvedor Full Stack · Auditoria e Automação de Processos |
| `full.hero.metaDescription` | Desarrollador Full Stack especializado en optimización operativa, automatizaciones con Python e IA, y sistemas de gestión en producción (NodoSur). | Full Stack Developer specialized in operational optimization, Python & AI automations, and production systems (NodoSur). | Desenvolvedor Full Stack especializado em otimização operacional, automações com Python e IA, e sistemas em produção (NodoSur). |
| `full.hero.name` | Juan Manuel Puccio | Juan Manuel Puccio | Juan Manuel Puccio |
| `full.hero.role` | Desarrollador Full Stack · Disponibilidad full-time | Full Stack Developer · Full-time availability | Desenvolvedor Full Stack · Disponibilidade full-time |
| `full.hero.status` | Disponible · full-time | Available · full-time | Disponível · full-time |
| `full.hero.location` | Rosario, Santa Fe, Argentina | Rosario, Santa Fe, Argentina | Rosário, Santa Fe, Argentina |
| `full.hero.tagline` | Audito procesos de empresas y los resuelvo con código. | I audit business processes and solve them with code. | Audito processos de empresas e os resolvo com código. |
| `full.hero.claim` | Diseño, despliego y estabilizo software de negocio en producción, con usuarios reales. Esa capacidad de construir sistemas confiables, que siguen funcionando una vez entregados, es la que quiero poner al servicio de un equipo, con dedicación full-time. | I design, deploy, and stabilize production business software with real users. That capability to build reliable systems that keep working once delivered is what I want to bring to a team, full-time. | Projeto, implanto e estabilizo software de negócios em produção, com usuários reais. Essa capacidade de construir sistemas confiáveis, que continuam funcionando após a entrega, é o que quero colocar a serviço de uma equipe, com dedicação full-time. |
| `full.hero.figure` | Fig. 01 · Rosario, 2026 | Fig. 01 · Rosario, 2026 | Fig. 01 · Rosário, 2026 |
| `full.hero.ctaPrimary` | Descargar CV | Download CV | Baixar CV |
| `full.hero.ctaSecondary` | Contacto | Contact | Contato |
| `full.hero.scroll` | Desplázate ↓ | Scroll ↓ | Role ↓ |
| `full.header.controls` | Rol · Grado · Idioma · Descargar CV | Role · Grade · Language · Download CV | Cargo · Grau · Idioma · Baixar CV |

---

## 2. Manifiesto y arco narrativo (`full.manifesto.*`)

**Perfil.** No soy un programador de laboratorio aislado del mundo comercial, ni un administrativo pasivo que solo ejecuta tareas repetitivas. Soy un perfil híbrido: cimientos técnicos tempranos (robótica y programación), con experiencia en entornos operativos exigentes (salud de alta demanda, seguridad social masiva, logística comercial y venta directa), que hoy construye software de negocio en producción.

| Clave | ES | EN | PT |
|---|---|---|---|
| `full.manifesto.notIs1` | **[retirada del sitio (2026-10-03), solo referencia de entrevista]** un programador de laboratorio | a lab-only programmer | um programador de laboratório |
| `full.manifesto.notIs2` | **[retirada del sitio (2026-10-03), solo referencia de entrevista]** ni un administrativo pasivo. | nor a passive administrator. | nem um administrativo passivo. |
| `full.manifesto.both` | **[retirada del sitio (2026-10-03), solo referencia de entrevista]** Soy los dos. A la vez. | I am both. At once. | Sou os dois. Ao mesmo tempo. |
| `full.manifesto.statement` | Cimientos en robótica y programación, y experiencia en entornos operativos exigentes. | Foundations in robotics and programming, and experience in demanding operational environments. | Fundamentos em robótica e programação, e experiência em ambientes operacionais exigentes. |
| `full.manifesto.quote` | La constancia vence a la improvisación; la templanza resuelve la urgencia. | Consistency beats improvisation; composure resolves urgency. | A constância vence a improvisação; a temperança resolve a urgência. |

### Tres arcos para distintas audiencias
- **A. Technical recruiter / Engineering manager:** cimientos técnicos tempranos; TypeScript estricto, React, Next.js, Astro, Python, Docker, PostgreSQL y servidores cloud propios; orquestación de agentes de IA con criterio humano.
- **B. Recruiter de operaciones / IT business partner:** rigor en control documental, auditoría y cumplimiento normativo (ANSES, Sanatorio Delta, Aurea Med S.A.); relevamiento de procesos y planes de contingencia; facturación médica y comercial.
- **C. Talent acquisition / psicólogo laboral:** formación humanística (Licenciatura en Filosofía, UNR); docencia y templanza (Profesor Internacional de Taekwondo ITF, +10 años); empatía con el usuario por años de atención masiva al público.

### Matriz de percepción (lectura rápida → ángulo)
| Dato biográfico | Ángulo de alto impacto |
|---|---|
| Múltiples sectores | Versatilidad de negocio 360°: conozco el ciclo comercial completo y entiendo a los stakeholders sin intermediarios. |
| Salidas de contratos estatales por reestructuración | Mérito técnico validado: aprobé concursos de mérito hasta planta permanente en ANSES y operé racks de servidores y puestos críticos. |
| Sanatorios de alta demanda | Visión de optimización: viví la ineficiencia de los sistemas de salud y la transformé en código. |
| NodoSur y colaboración en un comercio familiar | Mentalidad fundadora con tracción real: clientes usando sistemas en producción. |
| Productos propios activos | Sistemas estables y disponibilidad full-time real e inmediata. Los sistemas funcionando son la prueba de ingeniería, no un riesgo. |

---

## 3. Trayectoria: 6 cinturones y 11 posiciones (`full.belts.*`)

### 3.1 Encabezado
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.skillLabel` | Competencia transferible clave: | Key transferable asset: | Competência transferível chave: |

### 3.2 Las 6 etapas
| Clave | Cinturón | Años | ES | EN | PT |
|---|---|---|---|---|---|
| `full.belts.1` | Blanco · 10º gup | 2011 | Formación técnica | Technical foundations | Formação técnica |
| `full.belts.2` | Amarillo · 8º gup | 2012 a 2015 | Ventas y atención al cliente | Sales and customer service | Vendas e atendimento ao cliente |
| `full.belts.3` | Verde · 6º gup | 2015 a 2019 | Administración pública | Public administration | Administração pública |
| `full.belts.4` | Azul · 4º gup | 2019 a 2024 | Reconversión profesional | Career change | Reconversão profissional |
| `full.belts.5` | Rojo · 2º gup | 2024 a 2025 | Salud y logística | Healthcare and logistics | Saúde e logística |
| `full.belts.6` | Negro · 1º dan | Jun 2025 a presente | Software en producción | Software in production | Software em produção |

Línea y detalle por etapa (`full.belts.N.line`, `.detail`). La línea tiene como máximo 16 palabras y se ve en desktop y mobile; el detalle solo en desktop:

**1. Formación técnica**
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.1.line` | Secundario técnico en robótica y programación: mis primeras bases en el mundo tecnológico. | Technical high school in robotics and programming: my first foundations in the tech world. | Ensino médio técnico em robótica e programação: minhas primeiras bases no mundo da tecnologia. |
| `full.belts.1.detail` | Escuela Técnica Manuel Belgrano. Ahí entendí que la lógica también se escribe. | Manuel Belgrano Technical School. That is where I realized logic can be written, too. | Escola Técnica Manuel Belgrano. Ali percebi que a lógica também se escreve. |

**2. Ventas y atención al cliente**
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.2.line` | Atención al cliente y venta directa: aprendí a escuchar antes de responder. | Customer service and direct sales: I learned to listen before answering. | Atendimento ao cliente e venda direta: aprendi a escutar antes de responder. |
| `full.belts.2.detail` | Grido, Al Natural, Providus y AS MED. Herramientas de diálogo, negociación cara a cara y comunicación persuasiva. | Grido, Al Natural, Providus and AS MED. Tools for dialogue, face-to-face negotiation and persuasive communication. | Grido, Al Natural, Providus e AS MED. Ferramentas de diálogo, negociação presencial e comunicação persuasiva. |

**3. Administración pública**
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.3.line` | Miles de expedientes en ANSES bajo normativa previsional y de seguridad social estricta. | Thousands of case files at ANSES under strict pension and social security regulations. | Milhares de processos no ANSES sob normativa previdenciária e de seguridade social rigorosa. |
| `full.belts.3.detail` | En paralelo entrenaba Taekwon-Do en ACJ Rosario, turno noche. Esa disciplina sostuvo la responsabilidad de cada jornada. | In parallel I trained Taekwon-Do at ACJ Rosario, night shift. That discipline sustained the responsibility of every working day. | Em paralelo, treinava Taekwon-Do na ACJ Rosario, no turno da noite. Essa disciplina sustentou a responsabilidade de cada jornada. |

**4. Reconversión profesional**
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.4.line` | Emprendí como fotógrafo y filmmaker, me formé en programación y volví a ANSES por mérito. | I started as a photographer and filmmaker, trained in programming, and returned to ANSES on merit. | Empreendi como fotógrafo e filmmaker, me formei em programação e voltei ao ANSES por mérito. |
| `full.belts.4.detail` | Cubrí eventos de Santander, Federada Salud, ExpoAgro y Rooftop (ex Madame). Usé la pandemia para profundizar en programación. Convocado otra vez por ANSES, aprobé exámenes teóricos y de desempeño y pasé a planta permanente: mesa de ayuda junto al referente informático regional, soporte a PCs y servidores. | I covered events for Santander, Federada Salud, ExpoAgro and Rooftop (formerly Madame). I used the pandemic to go deeper into programming. Called back by ANSES, I passed theoretical and performance exams and moved to permanent staff: help desk alongside the regional IT lead, plus PC and server support. | Cobri eventos de Santander, Federada Salud, ExpoAgro e Rooftop (ex-Madame). Usei a pandemia para me aprofundar em programação. Convocado de novo pelo ANSES, passei em provas teóricas e de desempenho e entrei no quadro permanente: central de ajuda junto ao referente de TI regional, suporte a PCs e servidores. |

**5. Salud y logística**
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.5.line` | Salud y logística: detecté tareas repetitivas y las automaticé con Python. | Healthcare and logistics: I spotted repetitive tasks and automated them with Python. | Saúde e logística: identifiquei tarefas repetitivas e as automatizei com Python. |
| `full.belts.5.detail` | Sanatorio Delta, Aurea Med y Repuestos JL. Bot lector de extractos bancarios: de horas a segundos. | Sanatorio Delta, Aurea Med and Repuestos JL. A bank-statement reader bot: from hours to seconds. | Sanatorio Delta, Aurea Med e Repuestos JL. Bot leitor de extratos bancários: de horas a segundos. |

**6. Software en producción**
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.belts.6.line` | Hoy diseño, despliego y sostengo sistemas que usan personas reales: Satori Dojo, NodoFit y Don Pizza. | Today I design, deploy and maintain systems real people use: Satori Dojo, NodoFit and Don Pizza. | Hoje projeto, implanto e sustento sistemas usados por pessoas reais: Satori Dojo, NodoFit e Don Pizza. |
| `full.belts.6.closing` | En Taekwon-Do, el cinturón negro no es la meta: es el primer grado de quien se toma el camino en serio. Llego con oficio, y con ganas de seguir aprendiendo en equipo. | In Taekwon-Do, the black belt isn't the finish line: it's the first rank of those who take the path seriously. I bring craft, and the will to keep learning on a team. | No Taekwon-Do, a faixa preta não é a linha de chegada: é o primeiro grau de quem leva o caminho a sério. Chego com ofício, e com vontade de seguir aprendendo em equipe. |

Etapa negra, cierre en pantalla: `Fundador & Arquitecto de Software` · `NodoSur · nodosur.dev` · `Hoy cuento con disponibilidad full-time real para sumarme a un equipo.` (EN: `Founder & Software Architect` · `Today I have real full-time availability to join a team.` · PT: `Fundador & Arquiteto de Software` · `Hoje conto com disponibilidade full-time real para me somar a uma equipe.`)

### 3.3 Las 11 posiciones (más reciente primero)
Cuerpos EN/PT transcritos desde `src/data/martialExperience.ts` el 2026-10-03 (§3.3.1 y §3.3.2).

| Clave | Período · Cinturón | Rol · Organización | Descripción (ES) | Competencia transferible (ES) |
|---|---|---|---|---|
| `full.pos.11` | Jun 2025 a presente · Negro | Fundador y Desarrollador · NodoSur | Software factory de soluciones a medida, servidores cloud autoadministrados en Linux con Docker y flujo CI/CD con GitHub Actions. Plataformas vivas: Satori Dojo, NodoFit (SaaS) y Don Pizza. Consultoría IT y gestión de base de datos para Seiton Motors. Disponibilidad full-time real para sumarme a un equipo. | Arquitectura de software en producción, capacidad de entregar y sostener sistemas confiables, liderazgo y disciplina ética. |
| `full.pos.10` | Jun a Oct 2025 · Rojo | Administrativo Contable y Logística · Repuestos JL SRL | Despacho de mercadería, stock, facturación y cobranzas. Desarrollé en Python un bot lector de extractos bancarios en PDF que detecta alícuotas de IVA y totaliza liquidaciones en segundos en lugar de horas manuales. | Resolución de cuellos de botella administrativos con código en Python e iniciativa de mejora continua. |
| `full.pos.9` | Ene a Abr 2025 · Rojo | Administrativo, Gestión en Salud · Aurea Med S.A. | Continuidad en sanatorios de alta demanda: gestión de pacientes, turnos y facturación con DATATECH, control documental y estricto cumplimiento normativo. | Auditoría administrativa en salud, atención al detalle y manejo de sistemas médicos. |
| `full.pos.8` | May 2024 a Ene 2025 · Rojo | Administrativo, Gestión en Salud · Sanatorio Delta | Admisión general, turnos, admisión de oncología, recepción de laboratorios y caja con el sistema Algoritmo y nomenclador nacional de salud. | Auditoría médica, tolerancia a la alta demanda y visión de optimización de procesos. |
| `full.pos.7` | Dic 2021 a Mar 2024 · Azul | Administrativo Integral y Gestión de Datos (planta permanente) · ANSES | Reconvocado tras la etapa freelance, rendí y aprobé concursos de mérito hasta efectivizarme en planta permanente. Mesa de ayuda regional, soporte a racks de servidores del Estado Nacional y desarrollo de un sistema interno de métricas. | Tolerancia a la alta demanda masiva, infraestructura de red y servidores, y rigor normativo. |
| `full.pos.6` | Mar 2019 a Ene 2020 · Azul | Fotógrafo y Filmmaker Freelance · emprendimiento propio | Producción audiovisual y cobertura corporativa para clientes de primera línea (Santander, Federada Salud, ExpoAgro). Profundización autodidacta intensiva en programación moderna durante la pandemia. | Autogestión, resiliencia frente a la incertidumbre y reinvención técnica autodidacta. |
| `full.pos.5` | Dic 2015 a Mar 2019 · Verde | Administrativo Integral (contratado) · ANSES | Primera etapa en ANSES: gestión de miles de expedientes, control documental estricto y aplicación de normativa legal previsional. Etapa cerrada por reestructuración de contratos del Estado. | Rigor normativo, gestión documental masiva y servicio al ciudadano en entornos regulados. |
| `full.pos.4` | Mar a Sep 2015 · Amarillo | Vendedor Viajante de Servicios de Salud · AS MED S.A. | Venta puerta a puerta de planes y servicios de salud, con negociación directa cara a cara. | Negociación directa, empatía con el cliente y comunicación cara a cara. |
| `full.pos.3` | May 2013 a Ene 2014 · Amarillo | Vendedor Viajante de Planes de Ahorro · Providus S.A. | Venta directa puerta a puerta de planes de capitalización y ahorro con seguimiento comercial de cartera. | Persuasión ética, constancia diaria y resiliencia comercial. |
| `full.pos.2` | Feb a Abr 2013 · Amarillo | Gastronómico · Al Natural | Atención al público en un local de comida saludable, despacho ágil y trabajo en equipo bajo presión. | Coordinación operativa y templanza en momentos de pico de atención. |
| `full.pos.1` | Ene 2012 a Ene 2013 · Amarillo | Vendedor y Atención al Público · Grido Helados | Mi primer trabajo formal: atención en local de alto tránsito, arqueo de caja y alta rotación de clientes. | Responsabilidad de caja, velocidad de despacho y empatía. |

#### 3.3.1 English
| Clave | Period · Role · Organization | Description | Key transferable asset |
|---|---|---|---|
| `full.pos.11` | Jun 2025 — Present · Founder and Developer · NodoSur | Bespoke software factory with self-managed cloud servers on Linux, Docker containers, and GitHub Actions CI/CD. Production systems: Satori Dojo, NodoFit (SaaS), and Don Pizza. IT consulting and database management for Seiton Motors. Real full-time availability to join a team. | Production software architecture, ability to deliver and sustain reliable systems, leadership, and ethical discipline. |
| `full.pos.10` | Jun 2025 — Oct 2025 · Accounting and Logistics Administrator · Repuestos JL SRL | Merchandise dispatch, inventory, invoicing, and collections. Built in Python a bot that reads bank statement PDFs, detects VAT rates, and totals settlements in seconds instead of manual hours. | Automating administrative bottlenecks with Python code and proactive process optimization. |
| `full.pos.9` | Jan 2025 — Apr 2025 · Healthcare Administrator · Aurea Med S.A. | Continuity in high-demand sanatoriums: patient management, scheduling, and billing with DATATECH, document control, and strict regulatory compliance. | Healthcare administrative auditing, regulatory precision, and patient management workflows. |
| `full.pos.8` | May 2024 — Jan 2025 · Healthcare Administrator · Sanatorio Delta | General admissions, scheduling, oncology admissions, laboratory reception, and cashier with the Algoritmo system and the national health fee schedule. | Medical auditing, operational tolerance under heavy patient volume, and systems optimization. |
| `full.pos.7` | Dec 2021 — Mar 2024 · Full-Cycle Administrator & Data Management (permanent staff) · ANSES | Called back after the freelance stage, I passed merit competitions until becoming permanent staff. Regional help desk, support for National State server racks, and development of an internal metrics system. | Resilience under high-volume pressure, server rack infrastructure management, and compliance rigor. |
| `full.pos.6` | Mar 2019 — Jan 2020 · Freelance Photographer and Filmmaker · Self-employed | Audiovisual production and corporate coverage for top-tier clients (Santander, Federada Salud, ExpoAgro). Intensive self-taught study of modern programming during the pandemic. | Autonomous business management, career resilience, and self-directed technical education. |
| `full.pos.5` | Dec 2015 — Mar 2019 · Operations Administrator (contract) · ANSES | First stage at ANSES: handling thousands of case files, strict document control, and application of social security regulations. Stage closed due to a restructuring of state contracts. | Regulatory compliance, massive case file handling, and citizen service in regulated environments. |
| `full.pos.4` | Mar 2015 — Sep 2015 · Field Sales Representative, Healthcare Services · AS MED S.A. | Door-to-door sales of healthcare plans, handling face-to-face commercial closing. | Direct negotiation, client empathy, and resilient communication. |
| `full.pos.3` | May 2013 — Jan 2014 · Field Sales Representative, Savings Plans · Providus S.A. | Direct sales of capitalization and savings plans with active pipeline follow-up. | Ethical persuasion, daily discipline, and sales resilience. |
| `full.pos.2` | Feb 2013 — Apr 2013 · Food Service Attendant · Al Natural | Customer service at a fast-paced health food establishment, working under rush-hour demand. | Operational coordination and composure during peak service pressure. |
| `full.pos.1` | Jan 2012 — Jan 2013 · Customer Service & Cashier · Grido Helados | My first formal job: service at a high-traffic shop, cash register reconciliation, and high customer turnover. | Cash register accountability, order dispatch speed, and hospitality. |

Starting point (white belt, 2011): Technical High School: Robotics & Programming · Instituto Belgrano (formerly Technical School No. 2060). Description: Foundational engineering: circuit design, educational robotics, and early structured coding. Key transferable asset: Logical reasoning, structured problem solving, and hardware-level understanding.

#### 3.3.2 Português
| Clave | Período · Cargo · Organização | Descrição | Competência transferível |
|---|---|---|---|
| `full.pos.11` | Jun 2025 — Presente · Fundador e Desenvolvedor · NodoSur | Software factory com servidores Linux próprios, Docker e pipelines CI/CD com GitHub Actions. Sistemas em produção: Satori Dojo, NodoFit (SaaS) e Don Pizza. Consultoria de TI e gestão de banco de dados para a Seiton Motors. Disponibilidade full-time real para me somar a uma equipe. | Arquitetura de software em produção, capacidade de entregar e sustentar sistemas confiáveis, liderança e ética. |
| `full.pos.10` | Jun 2025 — Out 2025 · Administrativo Contábil e Logística · Repuestos JL SRL | Expedição de mercadorias, estoque, faturamento e cobranças. Desenvolvi em Python um bot leitor de extratos bancários em PDF que detecta alíquotas de IVA e totaliza liquidações em segundos, em vez de horas manuais. | Eliminação de gargalos burocráticos com Python e iniciativa de melhoria contínua. |
| `full.pos.9` | Jan 2025 — Abr 2025 · Administrativo Hospitalar · Aurea Med S.A. | Continuidade em sanatórios de alta demanda: gestão de pacientes, agendamentos e faturamento com DATATECH, controle documental e estrito cumprimento normativo. | Auditoria administrativa médica, precisão regulatória e gestão de sistemas hospitalares. |
| `full.pos.8` | Mai 2024 — Jan 2025 · Administrativo Hospitalar · Sanatorio Delta | Admissão geral, agendamentos, admissão de oncologia, recepção de laboratórios e caixa com o sistema Algoritmo e nomenclador nacional de saúde. | Auditoria médica, tolerância à alta rotina hospitalar e otimização de rotinas. |
| `full.pos.7` | Dez 2021 — Mar 2024 · Administrativo e Gestão de Dados (efetivo) · ANSES | Reconvocado após a etapa freelance, prestei e fui aprovado em concursos de mérito até ser efetivado no quadro permanente. Central de ajuda regional, suporte a racks de servidores do Estado Nacional e desenvolvimento de sistema interno de métricas. | Resiliência sob alta demanda, suporte a servidores/redes e rigor regulatório. |
| `full.pos.6` | Mar 2019 — Jan 2020 · Fotógrafo e Produtor Audiovisual Freelance · Empreendimento próprio | Produção audiovisual e cobertura corporativa para clientes de primeira linha (Santander, Federada Salud, ExpoAgro). Aprofundamento autodidata intensivo em programação moderna durante a pandemia. | Autogestão, resiliência profissional e aprendizado técnico autodidata. |
| `full.pos.5` | Dez 2015 — Mar 2019 · Administrativo Operacional (contratado) · ANSES | Primeira etapa no ANSES: gestão de milhares de processos, controle documental rigoroso e aplicação da normativa legal previdenciária. Etapa encerrada por reestruturação de contratos do Estado. | Rigor documental, gestão de processos em massa e atendimento público regulado. |
| `full.pos.4` | Mar 2015 — Set 2015 · Representante Comercial, Serviços de Saúde · AS MED S.A. | Vendas presenciais porta a porta de planos de saúde e fechamento comercial direto. | Negociação direta, empatia com o cliente e comunicação interpessoal. |
| `full.pos.3` | Mai 2013 — Jan 2014 · Representante Comercial, Planos de Capitalização · Providus S.A. | Venda direta porta a porta de planos de capitalização e poupança, com acompanhamento comercial de carteira. | Persuasão ética, disciplina diária e resiliência comercial. |
| `full.pos.2` | Fev 2013 — Abr 2013 · Atendente Gastronômico · Al Natural | Atendimento ao público em restaurante de alimentação saudável e trabalho em equipe sob pressão. | Coordenação operacional e equilíbrio em momentos de pico. |
| `full.pos.1` | Jan 2012 — Jan 2013 · Atendente e Operador de Caixa · Grido Helados | Meu primeiro emprego formal: atendimento em loja de alto fluxo, fechamento de caixa e alta rotação de clientes. | Responsabilidade financeira, agilidade de atendimento e empatia. |

Ponto de partida (faixa branca, 2011): Ensino Médio Técnico: Robótica e Programação · Instituto Belgrano (ex Escola Técnica Nº 2060). Descrição: Formação técnica inicial: projeto de circuitos, robótica educacional e primeiros algoritmos estruturados. Competência transferível: Raciocínio lógico, estruturação técnica e resolução prática de problemas desde o hardware.

#### Diferencias con el código (§3.3)
- `full.pos.5` descripción ES: alineado con el código (ES/EN/PT): cierra con la frase neutra sobre la reestructuración de contratos del Estado.
- `full.pos.7` descripción ES: el doc dice "desarrollo de un sistema interno de métricas"; el código, "desarrollo de sistema interno de métricas".
- `full.pos.7` competencia ES: el doc dice "infraestructura de red y servidores"; el código, "infraestructura de red/servidores".
- Formato de períodos: el doc ES usa "Jun a Oct 2025"; el código usa "Jun 2025 — Oct 2025" (idéntico en ES/EN/PT salvo abreviaturas de mes).
- Sin textos EN/PT que violen §0.

Punto de partida (etapa blanca, 2011): Secundario Técnico, Robótica y Programación, Instituto Belgrano (ex Escuela Técnica Nº 2060).

**Cronología clave (coherencia del relato):** NodoSur no surge después de dejar Repuestos JL. Ambos comenzaron en junio de 2025: era una idea que venía madurando y se materializó en paralelo, sin afectar al trabajo formal. Esa etapa también fue donde nació el bot de extractos bancarios.

**Pendiente de acción de Juan:** las posiciones AS MED, Providus, Al Natural y Grido Helados todavía no están en el PDF del CV actual.

---

## 4. Proyectos en producción (`full.projects.*`)

| Clave | ES | EN | PT |
|---|---|---|---|
| `full.projects.badge` | Producción viva | Live production | Produção viva |
| `full.projects.title` | Sistemas en Producción & Casos Reales | Live Production Systems & Real Cases | Sistemas em Produção & Casos Reais |
| `full.projects.subtitle` | Proyectos desplegados en clientes reales, resolviendo problemas de software, logística y operación. | Projects deployed for real clients, solving software, logistics, and operations problems. | Projetos implantados em clientes reais, resolvendo problemas de software, logística e operações. |
| `full.projects.headline` | Solo muestro lo que construí. | I only show what I built. | Só mostro o que construí. |
| `full.projects.cta` | Ver en vivo | Visit live | Ver ao vivo |
| `full.projects.detail` | Ver detalle técnico | View technical detail | Ver detalhe técnico |
| `full.projects.steps` | 01 Fricción · 02 Solución · 03 Impacto | 01 Bottleneck · 02 Solution · 03 Impact | 01 Fricção · 02 Solução · 03 Impacto |

| Clave | Proyecto · badge | Rol | Descripción (ES) | Fricción | Solución | Impacto | Tech |
|---|---|---|---|---|---|---|---|
| `full.projects.1` | NodoSur · nodosur.dev · Software Factory & Cloud | Fundador & Desarrollador Principal | Plataforma institucional y espacio de trabajo cooperativo para desplegar software a medida, sistemas de gestión y automatizaciones de negocio. | Empresas y comercios operaban con software genérico desintegrado y altos costos de licenciamiento. | Sistemas propietarios en infraestructura cloud propia (Linux, Docker, GitHub Actions) con integraciones fiscales. | Clientes activos en producción (Satori Dojo, Don Pizza) con monitoreo y control de versiones centralizado, y consultoría IT y gestión de base de datos para Seiton Motors. | Astro, TypeScript, React, GSAP |
| `full.projects.2` | NodoFit · nodofit.com.ar · SaaS en Producción | Creador & Arquitecto Full Stack | Sistema integral nacido de la experiencia con Satori Dojo, al ver que el producto tenía que crecer. Gestiona gimnasios, entrenadores personales, dojos y clubes con reservas de canchas (fútbol, pádel, tenis), con control de ingresos y gestor de cuotas. | Pérdida de cobros, registros manuales en planillas, reservas de canchas sin control y falta de seguimiento del acceso y del estado de cuotas y membresías. | Plataforma ágil con dashboard operativo en tiempo real, reservas de canchas, alertas de cuotas y membresías vencidas y métricas de retención. | En producción con usuarios reales: centraliza cobros, cuotas, accesos y reservas que antes se llevaban a mano. | Next.js, PostgreSQL, Tailwind, Supabase, REST APIs |
| `full.projects.3` | Satori Dojo · satoridojo.vercel.app · Gestión Deportiva & Club | Consultor IT & Desarrollador | Sistema para dojo de artes marciales: gestión académica, graduaciones, aranceles y presencia institucional. | Progreso técnico, cobro de cuotas y difusión de eventos sin centralizar. | Portal unificado con seguimiento pedagógico, control de asistencia y comunicación con las familias. | Implementado y en producción, optimizando el tiempo de gestión del equipo docente. | Next.js, Supabase, Supabase Edge, Cron Jobs |
| `full.projects.4` | Don Pizza Rosario · donpizzarosario.vercel.app · Rediseño Web & Sistema de Pedidos | Desarrollador & Consultor Operativo | Rediseño de la web del local con sistema de gestión de pedidos: catálogo digital, toma rápida y despacho en un entorno gastronómico de alta rotación. | Fricción en pedidos telefónicos y cuellos de botella en horas pico. | Aplicación ultra-rápida para smartphones, con catálogo dinámico y canal directo a cocina y despacho. | En producción real, validando UX móvil y velocidad de carga en alta demanda. | Next.js, Mobile First, Fast Checkout, Cloud |

**Nota de autoría:** NodoSur también comercializa Stoky, Inmotuls y Credituls, desarrollados por otros colaboradores. No son obra propia y no se describen como tal. Seiton Motors aparece solo como cliente de consultoría IT y base de datos, sin tarjeta de proyecto.

### 4.1 Automatizaciones críticas
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.auto.kicker` | Resolviendo cuellos de botella reales | Solving real bottlenecks | Resolvendo gargalos reais |
| `full.auto.title` | Automatizaciones & Bots de Negocio | Automations & Business Bots | Automações & Bots de Negócio |
| `full.auto.1.name` | Lector & Conciliador de Extractos Bancarios (Python) | Bank Statement Reader & Reconciler (Python) | Leitor & Conciliador de Extratos Bancários (Python) |
| `full.auto.1.desc` | Procesa PDFs bancarios heterogéneos de múltiples entidades, identifica alícuotas de IVA y totaliza movimientos para liquidaciones contables. | Processes heterogeneous bank PDFs from multiple institutions, identifies VAT rates and totals movements for accounting settlements. | Processa PDFs bancários heterogêneos de várias instituições, identifica alíquotas de IVA e totaliza movimentos para liquidações contábeis. |
| `full.auto.1.result` | De horas de marcado manual a segundos. | From hours of manual marking to seconds. | De horas de marcação manual a segundos. |
| `full.auto.2.name` | Facturación Electrónica Fiscal ARCA (ex AFIP) | ARCA (ex AFIP) Electronic Tax Invoicing | Faturamento Eletrônico Fiscal ARCA (ex AFIP) |
| `full.auto.2.desc` | Integración vía webservices seguros con el organismo tributario para emitir comprobantes fiscales, con validación humana en el loop. | Secure webservice integration with the tax authority to issue invoices, with a human in the loop. | Integração via webservices seguros com o órgão tributário para emitir comprovantes fiscais, com validação humana no loop. |
| `full.auto.2.result` | Cumplimiento normativo y trazabilidad contable. | Regulatory compliance and accounting traceability. | Conformidade normativa e rastreabilidade contábil. |

#### Diferencias con el código (§4.1)
El ES, EN y PT de esta tabla no coinciden literalmente con `automationsContent` en `src/data/projects.ts`. Doc sin cambios; valores del código:
- Subtítulo ES/EN/PT: "Resolviendo cuellos de botella reales en empresas y organismos" / "Solving real operational bottlenecks in businesses and organizations" / "Resolvendo gargalos operacionais reais em empresas e organizações".
- Bot 1 nombre EN: "Bank Statement Parser & Reconciliation Bot (Python)". PT igual que el doc.
- Bot 1 desc ES: "Procesa PDFs bancarios heterogéneos de múltiples entidades bancarias, identifica alícuotas de IVA y totaliza movimientos automáticamente para liquidaciones contables." EN: "Processes heterogeneous bank PDF statements across multiple banks, identifies VAT rates, and automatically totals transactions for accounting settlements." PT: "Processa extratos bancários em PDF de múltiplas instituições, identifica alíquotas de IVA e totaliza movimentações automaticamente para liquidações contábeis."
- Bot 1 métrica: alineada con el código el 2026-10-03. `src/data/projects.ts` se corrigió para quitar "0% de margen de error" (cifra no verificable, §0.9); ya coincide con `full.auto.1.result` en ES, EN y PT.
- Bot 2 nombre EN: "Fiscal Electronic Invoicing ARCA (ex AFIP)". PT: "Faturamento Eletrônico Fiscal ARCA (ex AFIP)" (igual al doc).
- Bot 2 desc ES: "Integración vía Webservices seguros con el organismo tributario para la emisión automatizada de comprobantes fiscales, con validación humana en el loop." EN: "Integration via secure webservices with the tax authority for automated issuance of fiscal receipts, with human validation in the loop." PT: "Integração via Webservices seguros com o órgão tributário para emissão automatizada de comprovantes fiscais, com validação humana no loop."
- Bot 2 métrica: alineada con el código el 2026-10-03. `src/data/projects.ts` se corrigió para quitar "100%" (cifra no verificable, §0.9); ya coincide con `full.auto.2.result` en ES, EN y PT.

### 4.2 Proyectos: English
Transcrito desde `src/data/projects.ts` el 2026-10-03.

| Clave | Project · badge | Role | Description | Bottleneck | Solution | Impact |
|---|---|---|---|---|---|---|
| `full.projects.1` | NodoSur · nodosur.dev · Software Factory & Cloud | Founder & Lead Developer | Institutional platform and cooperative workspace to deploy custom software, business systems, and business automation. | Companies and shops operated with disconnected generic software and high licensing costs. | Proprietary systems deployed on our own cloud infrastructure (Linux, Docker, GitHub Actions) with fiscal integrations. | Active production clients (Satori Dojo, Don Pizza) with centralized versioning and monitoring, plus IT consulting and database management for Seiton Motors. |
| `full.projects.2` | NodoFit · nodofit.com.ar · Production SaaS | Creator & Full Stack Architect | An integral system born from the Satori Dojo experience, which showed the product had to grow. It manages gyms, personal trainers, dojos, and clubs with court bookings (football, padel, tennis), with revenue control and a dues manager. | Lost payments, manual spreadsheet records, unmanaged court bookings, and no tracking of access or of dues and membership status. | Agile platform with a real-time operational dashboard, court bookings, overdue dues and membership alerts, and retention metrics. | Live in production with real users: it centralizes payments, dues, access, and bookings that used to be handled by hand. |
| `full.projects.3` | Satori Dojo · satoridojo.vercel.app · Sports & Club Management | IT Consultant & Developer | Custom-built system for a martial arts dojo: academic management, belt advancements, dues, and institutional presence. | Lack of centralization between practitioners' technical progress, fee collection, and event promotion. | Unified portal with martial pedagogical tracking, attendance control, and a communication channel with families. | Implemented and live in production, optimizing the teaching staff's management time. |
| `full.projects.4` | Don Pizza Rosario · donpizzarosario.vercel.app · Website Redesign & Ordering System | Developer & Operational Consultant | Full redesign of the original website, paired with a custom order-management system: digital catalog, fast ordering, and dispatch for peak rush hours in a high-demand culinary business. | Friction in taking phone orders and bottlenecks at peak preparation and delivery hours. | Ultra-fast smartphone-first app with a dynamic catalog and a direct channel to kitchen/dispatch. | Live in production, validating mobile UX and load performance under real high-demand conditions. |

### 4.3 Projetos: Português
| Clave | Projeto · badge | Cargo | Descrição | Fricção | Solução | Impacto |
|---|---|---|---|---|---|---|
| `full.projects.1` | NodoSur · nodosur.dev · Software Factory & Cloud | Fundador & Desenvolvedor Principal | Plataforma institucional e espaço de trabalho cooperativo para implantar software sob medida, sistemas de gestão e automações de negócio. | Empresas e comércios operavam com software genérico desintegrado e altos custos de licenciamento. | Sistemas proprietários implantados em infraestrutura cloud própria (Linux, Docker, GitHub Actions) com integrações fiscais. | Clientes ativos em produção (Satori Dojo, Don Pizza) com monitoramento e controle de versões centralizado, e consultoria de TI e gestão de banco de dados para a Seiton Motors. |
| `full.projects.2` | NodoFit · nodofit.com.ar · SaaS em Produção | Criador & Arquiteto Full Stack | Sistema integral nascido da experiência com o Satori Dojo, que mostrou que o produto precisava crescer. Gerencia academias, personal trainers, dojos e clubes com reservas de quadras (futebol, padel, tênis), com controle de receitas e gestor de mensalidades. | Perda de cobranças, registros manuais em planilhas, reservas de quadras sem controle e falta de acompanhamento do acesso e do status das mensalidades. | Plataforma ágil com dashboard operacional em tempo real, reservas de quadras, alertas de mensalidades vencidas e métricas de retenção. | Em produção com usuários reais: centraliza cobranças, mensalidades, acessos e reservas que antes eram feitos à mão. |
| `full.projects.3` | Satori Dojo · satoridojo.vercel.app · Gestão Esportiva & Clube | Consultor IT & Desenvolvedor | Sistema personalizado para dojo de artes marciais: gestão acadêmica, graduações, mensalidades e presença institucional. | Falta de centralização entre o progresso técnico dos praticantes, cobrança de mensalidades e divulgação de eventos. | Portal unificado com acompanhamento pedagógico marcial, controle de frequência e canal de comunicação com as famílias. | Implantado e em produção, otimizando o tempo de gestão da equipe docente. |
| `full.projects.4` | Don Pizza Rosario · donpizzarosario.vercel.app · Redesenho Web & Sistema de Pedidos | Desenvolvedor & Consultor Operacional | Redesenho completo do site original, com um sistema próprio de gestão de pedidos: catálogo digital, pedidos rápidos e expedição em um comércio gastronômico de alta demanda. | Fricções na tomada de pedidos por telefone e gargalos nos horários de pico de preparo e entrega. | Aplicação ultra-rápida pensada para smartphones, com catálogo dinâmico e canal direto com cozinha/expedição. | Em produção real, validando UX móvel e velocidade em um ambiente de alta demanda. |

#### Diferencias con el código (§4)
El ES del doc en §4 es una versión condensada; el ES del código (`projectsContent.es`) difiere en:
- `full.projects.1` solución: "Desarrollo de sistemas propietarios desplegados en infraestructura cloud propia (Linux, Docker, GitHub Actions) con integraciones fiscales."
- `full.projects.2` descripción: "Sistema cloud moderno para..." (el doc omite "moderno"); fricción: "...y falta de control en el acceso y estado de las membresías."; solución: "Plataforma ágil con dashboard operativo en tiempo real, alertas de cuotas vencidas y métricas de retención de alumnos."; impacto: "En producción activa reduciendo..." (sin coma).
- `full.projects.3` descripción: "Sistema personalizado para dojo..."; fricción: "Falta de centralización entre el progreso técnico de los practicantes, cobros de cuotas y difusión de eventos."; solución: "Portal unificado con seguimiento pedagógico marcial, control de asistencia y pasarela de comunicación con las familias."
- `full.projects.4` descripción: "Rediseño completo de la web original del local, con un sistema propio de gestión de pedidos: catálogo digital, toma de pedidos rápidos y despacho en un entorno gastronómico de alta rotación."; fricción: "Fricciones en la toma de pedidos telefónicos y cuellos de botella en horas pico de elaboración y entrega."; solución: "...pensada para smartphones, con catálogo dinámico y canal directo a cocina/despacho."; impacto: "...en un entorno de alta demanda."
- Sin textos EN/PT que violen §0.

---

## 5. Stack, criterio y filosofía (`full.stack.*`)

| Clave | ES | EN | PT |
|---|---|---|---|
| `full.stack.badge` | Criterio & Herramientas | Mindset & Tooling | Critério & Ferramentas |
| `full.stack.title` | Stack Tecnológico & Filosofía de Trabajo | Tech Stack & Engineering Mindset | Stack Tecnológico & Filosofia de Trabalho |
| `full.stack.subtitle` | El software como medio para resolver fricciones de negocio, con código tipado, arquitectura limpia y criterio humano en el loop. | Software as a means to solve business friction, with typed code, clean architecture, and human judgment in the loop. | O software como meio para resolver fricções de negócio, com código tipado, arquitetura limpa e critério humano no loop. |

### 5.1 Categorías
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.stack.1` | Core Frontend & Arquitectura UI | Core Frontend & UI Architecture | Core Frontend & Arquitetura UI |
| `full.stack.2` | Backend, Automatización & Datos | Backend, Automation & Data | Backend, Automação & Dados |
| `full.stack.3` | Cloud, Infraestructura & DevOps | Cloud, Infrastructure & DevOps | Cloud, Infraestrutura & DevOps |
| `full.stack.4` | Operación de Campo | Field Operations | Operação de Campo |
| `full.stack.5` | Certificaciones & Idiomas | Certifications & Languages | Certificações & Idiomas |

Descripciones e ítems (ES; EN/PT transcritos en §5.1.1 y §5.1.2 desde `src/data/skills.ts` el 2026-10-03):
1. **Frontend:** interfaces resilientes, accesibles y de carga inmediata con mínima sobrecarga de JavaScript. TypeScript estricto, React, Next.js, Astro 7, Tailwind CSS, HTML5 semántico, Zero CLS / Web Vitals.
2. **Backend:** resolución de fricciones operativas con scripts de análisis contable, APIs tipadas e integraciones gubernamentales. Python, PostgreSQL, Node.js / Bun, REST APIs, webservices ARCA (AFIP), procesamiento de PDFs y datos.
3. **Cloud:** despliegues autónomos en entornos cloud propios sin cajas negras costosas. Linux (Ubuntu Server), Docker & Compose, GitHub Actions, Nginx Reverse Proxy, Vercel Edge, seguridad y SSL.
4. **Campo:** capacidad de dialogar de igual a igual con directivos de sanatorios, personal de maestranza o dueños de comercios. Auditoría médica y nomenclador, facturación contable e IVA, gestión masiva (ANSES), logística y stock real, living lab comercial.
5. **Certificaciones:** AWS Certified Cloud Practitioner (2025), Microsoft Azure Fundamentals · AZ-900 (2025), Google Cloud Computing Foundations (2024), CS50 Harvard/edX (2023), Python desde Cero a Desarrollador · Udemy (2022), Inglés B2 con lectura técnica fluida.

#### 5.1.1 English
| Clave | Title | Description | Items |
|---|---|---|---|
| `full.stack.1` | Core Frontend & UI Architecture | Building resilient, accessible, instant-loading interfaces with minimal JavaScript overhead. | Strict TypeScript, React, Next.js, Astro 7, Tailwind CSS, Semantic HTML5, Zero CLS / Web Vitals |
| `full.stack.2` | Backend, Automation & Data | Resolving operational friction through accounting analysis scripts, typed APIs, and government integrations. | Python, PostgreSQL, Node.js / Bun, REST APIs, ARCA (AFIP) Webservices, PDF & Data Processing |
| `full.stack.3` | Cloud, Infrastructure & DevOps | Autonomous deployments on your own cloud environments without relying on expensive black boxes or bloated architectures. | Linux (Ubuntu Server), Docker & Compose, GitHub Actions, Nginx Reverse Proxy, Vercel Edge, Security & SSL |
| `full.stack.4` | Field Operations | Ability to speak on equal terms with sanatorium directors, maintenance staff, or shop owners. | Medical Auditing & Fee Schedule, Accounting Billing & VAT, Mass Case Management (ANSES), Logistics & Real Stock, Commercial Living Lab |
| `full.stack.5` | Certifications & Languages | Certified across the three major clouds, with a solid computer science foundation. | AWS Certified Cloud Practitioner (2025), Microsoft Certified: Azure Fundamentals · AZ-900 (2025), Google Cloud Computing Foundations (2024), CS50: Introduction to Computer Science · Harvard/edX (2023), Python from Zero to Developer · Udemy (2022), English B2: fluent technical reading |

#### 5.1.2 Português
| Clave | Título | Descrição | Itens |
|---|---|---|---|
| `full.stack.1` | Core Frontend & Arquitetura UI | Construção de interfaces resilientes, acessíveis e de carregamento imediato, com sobrecarga mínima de JavaScript. | TypeScript Estrito, React, Next.js, Astro 7, Tailwind CSS, HTML5 Semântico, Zero CLS / Web Vitals |
| `full.stack.2` | Backend, Automação & Dados | Resolução de fricções operacionais mediante scripts de análise contábil, APIs tipadas e integrações governamentais. | Python, PostgreSQL, Node.js / Bun, REST APIs, Webservices ARCA (AFIP), Processamento de PDFs e Dados |
| `full.stack.3` | Cloud, Infraestrutura & DevOps | Implantações autônomas em ambientes cloud próprios, sem depender de caixas-pretas caras nem de arquiteturas inchadas. | Linux (Ubuntu Server), Docker & Compose, GitHub Actions, Nginx Reverse Proxy, Vercel Edge, Segurança & SSL |
| `full.stack.4` | Operação de Campo | Capacidade de dialogar de igual para igual com diretores de sanatórios, equipe de manutenção ou donos de comércios. | Auditoria Médica & Nomenclador, Faturamento Contábil & IVA, Gestão em Massa (ANSES), Logística & Estoque Real, Living Lab Comercial |
| `full.stack.5` | Certificações & Idiomas | Formação certificada nas três principais nuvens e uma base sólida em ciência da computação. | AWS Certified Cloud Practitioner (2025), Microsoft Certified: Azure Fundamentals · AZ-900 (2025), Google Cloud Computing Foundations (2024), CS50: Introduction to Computer Science · Harvard/edX (2023), Python do Zero ao Desenvolvedor · Udemy (2022), Inglês B2: leitura técnica fluente |

#### Diferencias con el código (§5.1)
ES del doc sin cambios; el ES del código (`skillsData.es`) difiere en:
- `full.stack.2` descripción: "Resolución de fricciones operativas mediante scripts..." (el doc dice "con").
- `full.stack.3` descripción: "Despliegues autónomos en entornos cloud propios sin depender de cajas negras costosas ni arquitecturas infladas." (el doc está abreviado).
- `full.stack.5`: el doc no incluye descripción; el código dice "Formación certificada en las tres nubes principales y una base sólida en ciencias de la computación." Ítems ES del código: "Microsoft Certified: Azure Fundamentals · AZ-900 (2025)", "CS50: Introduction to Computer Science · Harvard/edX (2023)", "Inglés B2: lectura técnica fluida" (el doc: "Microsoft Azure Fundamentals...", "CS50 Harvard/edX (2023)", "Inglés B2 con lectura técnica fluida").
- Diferencias solo de mayúsculas en ítems (p. ej. "TypeScript Estricto", "HTML5 Semántico") omitidas.
- Sin textos EN/PT que violen §0.
- Código PT de filosofía (`skillsData.pt.philosophy[1].quote`): "A constância supera o improviso; a serenidade resolve a urgência." difiere del PT del doc §2/§5.2 ("A constância vence a improvisação; a temperança resolve a urgência."). Idem EN de la filosofía (títulos/cuerpos) no coinciden literalmente con §5.2.

### 5.2 Filosofía práctica
| Clave | ES | EN | PT |
|---|---|---|---|
| `full.phil.kicker` | Fuera del código | Beyond the code | Além do código |
| `full.phil.title` | La Dimensión Humana & Ética Operativa | The Human Dimension & Operational Ethics | A Dimensão Humana & Ética Operacional |
| `full.phil.1.tag` | Licenciatura en Filosofía · UNR (en curso) | BA in Philosophy · UNR (in progress) | Licenciatura em Filosofia · UNR (em curso) |
| `full.phil.1.body` | La facturación fiscal con ARCA que integré nunca corre sola: cada comprobante pasa por validación humana antes de emitirse. Prefiero un sistema más lento y auditable a uno rápido que nadie entiende cuando falla. | The ARCA tax invoicing I integrated never runs alone: every invoice passes human validation before being issued. I prefer a slower, auditable system over a fast one nobody understands when it fails. | A faturação fiscal com ARCA que integrei nunca roda sozinha: cada comprovante passa por validação humana antes de ser emitido. Prefiro um sistema mais lento e auditável a um rápido que ninguém entende quando falha. |
| `full.phil.1.quote` | "Un bot que automatiza sin nadie revisando el resultado no es una solución, es un riesgo nuevo." | "A bot that automates with nobody checking the result is not a solution, it is a new risk." | "Um bot que automatiza sem ninguém revisar o resultado não é uma solução, é um novo risco." |
| `full.phil.2.tag` | Profesor Internacional de Taekwondo ITF (+10 años) | International Taekwondo ITF Instructor (10+ years) | Professor Internacional de Taekwondo ITF (+10 anos) |
| `full.phil.2.body` | Más de una década formando a niños, jóvenes y adultos. La docencia marcial forja constancia diaria, paciencia pedagógica para explicar conceptos técnicos a usuarios de negocio y calma bajo alta demanda o caída de servicios. | Over a decade teaching children, teenagers and adults. Martial teaching builds daily consistency, pedagogical patience to explain technical concepts to business users, and calm under high demand or outages. | Mais de uma década formando crianças, jovens e adultos. A docência marcial forja constância diária, paciência pedagógica para explicar conceitos técnicos a usuários de negócio e calma sob alta demanda ou queda de serviços. |
| `full.phil.2.quote` | "La constancia vence a la improvisación; la templanza resuelve la urgencia." | "Consistency beats improvisation; composure resolves urgency." | "A constância vence a improvisação; a temperança resolve a urgência." |

### 5.3 Formación (referencia)
Licenciatura en Filosofía, UNR (2024 a presente, en curso) · Secundario Técnico en Robótica y Programación, Instituto Belgrano (2011) · AWS CCP (2025) · Azure AZ-900 (2025) · Google Cloud Foundations (2024) · CS50 (2023) · Python, Udemy (2022).

---

## 6. Contacto (`full.contact.*`)

| Clave | ES | EN | PT |
|---|---|---|---|
| `full.contact.badge` | Disponibilidad & Contratación | Availability & Hiring | Disponibilidade & Contratação |
| `full.contact.title` | Busco sumarme a un equipo técnico con desafíos reales. | Looking to join a technical team with real challenges. | Busco ingressar em uma equipe técnica com desafios reais. |
| `full.contact.subtitle` | Busco sumarme como Desarrollador Full Stack en un equipo técnico de alto impacto, con disponibilidad full-time. Diseño, despliego y estabilizo software de negocio en producción: esa es la prueba de ingeniería que quiero poner al servicio de tu equipo. | Looking to join a high-impact technical team as a Full Stack Developer, with full-time availability. I design, ship, and stabilize production business software: that is the engineering proof I want to bring to your team. | Busco ingressar como Desenvolvedor Full Stack em uma equipe técnica de alto impacto, com disponibilidade full-time. Projeto, implanto e estabilizo software de negócio em produção: essa é a prova de engenharia que quero colocar a serviço da sua equipe. |
| `full.contact.ctaPrimary` | Conversar por WhatsApp | Chat on WhatsApp | Conversar pelo WhatsApp |
| `full.contact.ctaSecondary` | Descargar CV | Download CV | Baixar CV |
| `full.contact.shortcut` | Contactar | Contact | Contato |
| `full.contact.footer` | Rosario, Argentina · © 2026 Juan Manuel Puccio | Rosario, Argentina · © 2026 Juan Manuel Puccio | Rosário, Argentina · © 2026 Juan Manuel Puccio |

| Clave | Canal | Valor | Enlace |
|---|---|---|---|
| `full.contact.whatsapp` | WhatsApp directo | +54 9 341 319-2179 | https://wa.me/5493413192179 |
| `full.contact.email` | Email directo | juan.pucciom@gmail.com | mailto:juan.pucciom@gmail.com |
| `full.contact.linkedin` | LinkedIn | in/jmpuc92 | https://www.linkedin.com/in/jmpuc92 |
| `full.contact.github` | GitHub | github.com/juanmapuccio | https://github.com/juanmapuccio |
| `full.contact.nodosur` | NodoSur (Prueba de Producción) | nodosur.dev | https://nodosur.dev/ |

---

## 7. Guía de respuestas para selección (referencia de entrevista)

| Pregunta | Enfoque |
|---|---|
| ¿Por qué cambiaste de rubro varias veces? | Cada rubro me dio una pieza de la operación: la venta, negociación; ANSES, rigor legal e infraestructura; los sanatorios, las fallas del software legacy; Repuestos JL, automatizar procesos financieros con Python. No cambio por dispersión: integro la visión de negocio al código. |
| ¿Por qué saliste de ANSES? | Entré dos veces; la segunda, por concurso de mérito hasta planta permanente. Ambas salidas respondieron a reestructuraciones de nómina del Estado Nacional. Criterio: el mérito va primero; la reestructuración es contexto, no defensa. |
| Si tenés NodoSur, ¿por qué un equipo? | Los sistemas ya están en producción y estabilizados. No tengo otro empleo en relación de dependencia: mi disponibilidad es real. Busco crecer en un entorno de mayor escala con tareas y requisitos concretos. |
| ¿Cuánto tiempo te demanda NodoSur? | Sistemas estables y documentados; queda mantenimiento puntual. No dar cifra de horas. |
| ¿Por qué dejaste Repuestos JL? | Ingresé con una transición acordada hacia tareas técnicas que no llegó a concretarse. Prefiero un lugar donde el rol técnico sea real desde el inicio. Nunca hablar mal del empleador. |

---

## 8. Mantenimiento
Cada cambio de texto en `src/i18n/ui.ts`, `src/data/*.ts` o componentes debe reflejarse aquí primero y luego en `copywriting-desktop.md` y `copywriting-mobile.md`. Mantener las mismas claves en ES, EN y PT en los tres documentos.
