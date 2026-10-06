# Copywriting Desktop: Versión Acotada (ES · EN · PT)

> Derivado de `copywriting-full.md`. Cada fila referencia su clave full en la columna **Mapea a**.

**Filosofía.** El copy es deliberadamente corto para que la atención visual quede en la cinemática, las transiciones, la animación y la experiencia de scroll inmersivo. El texto nunca carga el significado por sí solo y nunca depende de la animación para poder leerse (con `prefers-reduced-motion` todo se lee estático).

**Presupuesto por bloque.** Un titular y, como máximo, **una** línea de apoyo. Etiquetas mono ≤ 4 palabras. Proyectos: Fricción e Impacto en una línea cada uno. Sin párrafos.

**Base visual:** `design/Landing Inmersiva v2.dc.html`. **Reglas de contenido:** las de `copywriting-full.md` §0 (aplican íntegras).

---

## D1. Header (`desk.header.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.header.name` | Juan Manuel Puccio | Juan Manuel Puccio | Juan Manuel Puccio | `full.hero.name` |
| `desk.header.status` | DISPONIBLE · FULL-TIME | AVAILABLE · FULL-TIME | DISPONÍVEL · FULL-TIME | `full.hero.status` |

## D2. Hero (`desk.hero.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.hero.fig` | ROSARIO, AR — FIG. 01 | ROSARIO, AR — FIG. 01 | ROSÁRIO, AR — FIG. 01 | `full.hero.figure` |
| `desk.hero.l1` | Audito procesos | I audit | Audito processos | `full.hero.tagline` |
| `desk.hero.l2` | de empresas | business processes | de empresas | `full.hero.tagline` |
| `desk.hero.l3` | y los resuelvo con código. | and solve them with code. | e os resolvo com código. | `full.hero.tagline` |
| `desk.hero.role` | DESARROLLADOR FULL STACK | FULL STACK DEVELOPER | DESENVOLVEDOR FULL STACK | `full.hero.role` |
| `desk.hero.scroll` | DESPLÁZATE ↓ | SCROLL ↓ | ROLE ↓ | `full.hero.scroll` |
| `desk.hero.seal` | 염치 | 염치 | 염치 | (sello, glifo) |

## D4. Cinturones (`desk.belts.*`)
Una pantalla por cinturón: etiqueta, años, símbolo (kicker), título grande, **una** línea (≤ 16 palabras), detalle de 2 a 3 frases (solo desktop, `full.belts.N.detail`) y organizaciones. El negro suma el cierre `full.belts.6.closing` tras el ensō.
| Clave | GUP · años | ES (símbolo · título · línea · donde) | EN | PT | Mapea a |
|---|---|---|---|---|---|
| `desk.belts.1` | 10º GUP · BLANCO · 2011 | MENTE EN BLANCO · Cimientos · Secundario técnico en robótica y programación: mis primeras bases en el mundo tecnológico. · Instituto Belgrano | EMPTY MIND · Foundations · Technical high school in robotics and programming: my first foundations in the tech world. · Instituto Belgrano | MENTE EM BRANCO · Fundamentos · Ensino médio técnico em robótica e programação: minhas primeiras bases no mundo da tecnologia. · Instituto Belgrano | `full.belts.1` |
| `desk.belts.2` | 8º GUP · AMARILLO · 2012 — 2015 | TIERRA Y RAÍCES · La calle · Atención al público y venta en frío: aprendí a escuchar antes de responder. · Grido · Al Natural · Providus · AS MED | EARTH AND ROOTS · The Streets · Customer service and cold sales: I learned to listen before answering. · Grido · Al Natural · Providus · AS MED | TERRA E RAÍZES · A Rua · Atendimento ao público e venda a frio: aprendi a escutar antes de responder. · Grido · Al Natural · Providus · AS MED | `full.belts.2` |
| `desk.belts.3` | 6º GUP · VERDE · 2015 — 2019 | CRECIMIENTO · El Estado · Miles de expedientes en ANSES bajo normativa previsional y de seguridad social estricta. · ANSES | GROWTH · The State · Thousands of case files at ANSES under strict pension and social security regulations. · ANSES | CRESCIMENTO · O Estado · Milhares de processos no ANSES sob normativa previdenciária e de seguridade social rigorosa. · ANSES | `full.belts.3` |
| `desk.belts.4` | 4º GUP · AZUL · 2019 — 2024 | HACIA EL CIELO · Reconversión · Emprendí como fotógrafo y filmmaker, me formé en programación y volví a ANSES por mérito. · Freelance · ANSES | TOWARD THE SKY · Reinvention · I started as a photographer and filmmaker, trained in programming, and returned to ANSES on merit. · Freelance · ANSES | RUMO AO CÉU · Reconversão · Empreendi como fotógrafo e filmmaker, me formei em programação e voltei ao ANSES por mérito. · Freelance · ANSES | `full.belts.4` |
| `desk.belts.5` | 2º GUP · ROJO · 2024 — 2025 | CONTROL · La fricción · Salud de alta demanda y logística: viví sistemas arcaicos desde adentro y los automaticé con Python. · Sanatorio Delta · Aurea Med · Repuestos JL | CONTROL · Friction · High-demand healthcare and logistics: I lived archaic systems from the inside and automated them with Python. · Sanatorio Delta · Aurea Med · Repuestos JL | CONTROLE · A Fricção · Saúde de alta demanda e logística: vivi sistemas arcaicos por dentro e os automatizei com Python. · Sanatorio Delta · Aurea Med · Repuestos JL | `full.belts.5` |
| `desk.belts.6` | 1º DAN · NEGRO · 2025 — HOY | MADUREZ · Producción · Hoy diseño, despliego y sostengo sistemas que usan personas reales: Satori Dojo, NodoFit y Don Pizza. · NodoSur · nodosur.dev | MATURITY · Production · Today I design, deploy and maintain systems real people use: Satori Dojo, NodoFit and Don Pizza. · NodoSur · nodosur.dev | MATURIDADE · Produção · Hoje projeto, implanto e sustento sistemas usados por pessoas reais: Satori Dojo, NodoFit e Don Pizza. · NodoSur · nodosur.dev | `full.belts.6` |

## D5. Fricción a código (`desk.chaos.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.chaos.words` | PDF · IVA 21% · IVA 10,5% · EXPEDIENTE · TURNO · NOMENCLADOR · CAJA · STOCK · PLANILLA · FACTURA · EXTRACTO · COBRANZA · REMITO · CONCILIACIÓN | PDF · VAT 21% · VAT 10.5% · CASE FILE · APPOINTMENT · TARIFF CODES · CASH · STOCK · SPREADSHEET · INVOICE · STATEMENT · COLLECTIONS · DELIVERY NOTE · RECONCILIATION | PDF · IVA 21% · IVA 10,5% · PROCESSO · CONSULTA · NOMENCLADOR · CAIXA · ESTOQUE · PLANILHA · FATURA · EXTRATO · COBRANÇA · REMESSA · CONCILIAÇÃO | `full.auto.1.desc` |
| `desk.chaos.kicker` | BOT EN PYTHON · EXTRACTOS BANCARIOS | PYTHON BOT · BANK STATEMENTS | BOT EM PYTHON · EXTRATOS BANCÁRIOS | `full.auto.1.name` |
| `desk.chaos.title` | De horas a segundos. | From hours to seconds. | De horas a segundos. | `full.auto.1.result` |

## D6. Producción (`desk.projects.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.projects.kicker` | PRODUCCIÓN VIVA | LIVE PRODUCTION | PRODUÇÃO VIVA | `full.projects.badge` |
| `desk.projects.title` | Solo muestro lo que construí. | I only show what I built. | Só mostro o que construí. | `full.projects.headline` |
| `desk.projects.cta` | VER EN VIVO ↗ | VISIT LIVE ↗ | VER AO VIVO ↗ | `full.projects.cta` |
| `desk.projects.labelF` | FRICCIÓN | BOTTLENECK | FRICÇÃO | `full.projects.steps` |
| `desk.projects.labelI` | IMPACTO | IMPACT | IMPACTO | `full.projects.steps` |

| Clave | Nombre · badge | Fricción (ES · EN · PT) | Impacto (ES · EN · PT) | Mapea a |
|---|---|---|---|---|
| `desk.projects.1` | NodoSur · SOFTWARE FACTORY & CLOUD | Software genérico desintegrado y licencias caras. · Fragmented generic software and costly licenses. · Software genérico desintegrado e licenças caras. | Clientes activos en producción. · Active clients in production. · Clientes ativos em produção. | `full.projects.1` |
| `desk.projects.2` | NodoFit · SAAS EN PRODUCCIÓN | Cobros perdidos y planillas manuales. · Lost payments and manual spreadsheets. · Cobranças perdidas e planilhas manuais. | Cobros, cuotas y reservas en un solo lugar. · Payments, dues, and bookings in one place. · Cobranças, mensalidades e reservas em um só lugar. | `full.projects.2` |
| `desk.projects.3` | Satori Dojo · GESTIÓN DEPORTIVA & CLUB | Progreso, cuotas y eventos dispersos. · Progress, fees and events scattered. · Progresso, mensalidades e eventos dispersos. | Menos tiempo de gestión docente. · Less teacher admin time. · Menos tempo de gestão docente. | `full.projects.3` |
| `desk.projects.4` | Don Pizza · SISTEMA DE PEDIDOS | Cuellos de botella en horas pico. · Bottlenecks at peak hours. · Gargalos em horários de pico. | UX móvil validada en alta demanda. · Mobile UX validated under high demand. · UX mobile validada em alta demanda. | `full.projects.4` |

## D7. Fuera del código (`desk.tenets.*`)
| Clave | Sello · etiqueta · cita (ES) | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.tenets.1` | 극기 · PROFESOR INTERNACIONAL DE TAEKWONDO ITF · "La constancia vence a la improvisación; la templanza resuelve la urgencia." | 극기 · INTERNATIONAL TAEKWONDO ITF INSTRUCTOR · "Consistency beats improvisation; composure resolves urgency." | 극기 · PROFESSOR INTERNACIONAL DE TAEKWONDO ITF · "A constância vence a improvisação; a temperança resolve a urgência." | `full.phil.2.*` |
| `desk.tenets.2` | 염치 · LICENCIATURA EN FILOSOFÍA · UNR · "Un bot que automatiza sin nadie revisando el resultado no es una solución, es un riesgo nuevo." | 염치 · BA IN PHILOSOPHY · UNR · "A bot that automates with nobody checking the result is not a solution, it is a new risk." | 염치 · LICENCIATURA EM FILOSOFIA · UNR · "Um bot que automatiza sem ninguém revisar o resultado não é uma solução, é um novo risco." | `full.phil.1.*` |

## D8. Contacto (`desk.contact.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.contact.kicker` | DISPONIBILIDAD & CONTRATACIÓN | AVAILABILITY & HIRING | DISPONIBILIDADE & CONTRATAÇÃO | `full.contact.badge` |
| `desk.contact.title` | Busco sumarme a un equipo técnico con desafíos reales. | Looking to join a technical team with real challenges. | Busco ingressar em uma equipe técnica com desafios reais. | `full.contact.title` |
| `desk.contact.cta1` | CONVERSAR POR WHATSAPP → | CHAT ON WHATSAPP → | CONVERSAR PELO WHATSAPP → | `full.contact.ctaPrimary` |
| `desk.contact.cta2` | DESCARGAR CV | DOWNLOAD CV | BAIXAR CV | `full.contact.ctaSecondary` |
| `desk.contact.links` | juan.pucciom@gmail.com · LINKEDIN ↗ · GITHUB ↗ · NODOSUR.DEV ↗ | juan.pucciom@gmail.com · LINKEDIN ↗ · GITHUB ↗ · NODOSUR.DEV ↗ | juan.pucciom@gmail.com · LINKEDIN ↗ · GITHUB ↗ · NODOSUR.DEV ↗ | `full.contact.*` |
| `desk.contact.footer` | © 2026 JUAN MANUEL PUCCIO | © 2026 JUAN MANUEL PUCCIO | © 2026 JUAN MANUEL PUCCIO | `full.contact.footer` |

---

## Mantenimiento
Editar primero `copywriting-full.md`; luego reflejar aquí. Mismas claves en ES, EN y PT.
