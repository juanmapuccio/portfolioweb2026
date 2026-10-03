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

## D3. No soy… (`desk.not.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `desk.not.kicker` | NO SOY | I AM NOT | NÃO SOU | `full.manifesto.notIs1` |
| `desk.not.l1` | un programador de laboratorio | a lab-only programmer | um programador de laboratório | `full.manifesto.notIs1` |
| `desk.not.l2` | ni un administrativo pasivo. | nor a passive administrator. | nem um administrativo passivo. | `full.manifesto.notIs2` |
| `desk.not.both` | Soy los dos. A la vez. | I am both. At once. | Sou os dois. Ao mesmo tempo. | `full.manifesto.both` |

## D4. Cinturones (`desk.belts.*`)
Una pantalla por cinturón: etiqueta, años, título grande, **una** línea y organizaciones.
| Clave | GUP · años | ES (título · línea · donde) | EN | PT | Mapea a |
|---|---|---|---|---|---|
| `desk.belts.1` | 10º GUP · BLANCO · 2011 | Cimientos · Secundario técnico en robótica y programación. · Instituto Belgrano | Foundations · Technical high school in robotics and programming. · Instituto Belgrano | Fundamentos · Ensino médio técnico em robótica e programação. · Instituto Belgrano | `full.belts.1` |
| `desk.belts.2` | 8º GUP · AMARILLO · 2012 — 2015 | La calle · Venta puerta a puerta. Negociación cara a cara. · Grido · Al Natural · Providus · AS MED | The Streets · Door-to-door sales. Face-to-face negotiation. · Grido · Al Natural · Providus · AS MED | A Rua · Venda porta a porta. Negociação cara a cara. · Grido · Al Natural · Providus · AS MED | `full.belts.2` |
| `desk.belts.3` | 6º GUP · VERDE · 2015 — 2019 | El Estado · Miles de expedientes bajo normativa previsional. · ANSES | The State · Thousands of case files under social-security regulation. · ANSES | O Estado · Milhares de processos sob normativa previdenciária. · ANSES | `full.belts.3` |
| `desk.belts.4` | 4º GUP · AZUL · 2019 — 2024 | Reconversión · Concurso de mérito, planta permanente y racks de servidores. · Freelance · ANSES | Reinvention · Merit exams, permanent staff and server racks. · Freelance · ANSES | Reconversão · Concurso de mérito, quadro permanente e racks de servidores. · Freelance · ANSES | `full.belts.4` |
| `desk.belts.5` | 2º GUP · ROJO · 2024 — 2025 | La fricción · Sistemas arcaicos en salud. Los puestos me quedaban chicos. · Sanatorio Delta · Aurea Med · Repuestos JL | Friction · Archaic healthcare systems. The roles were too small for me. · Sanatorio Delta · Aurea Med · Repuestos JL | A Fricção · Sistemas arcaicos na saúde. Os cargos ficavam pequenos para mim. · Sanatorio Delta · Aurea Med · Repuestos JL | `full.belts.5` |
| `desk.belts.6` | 1º DAN · NEGRO · 2025 — HOY | Producción · Diseño, despliego y estabilizo software de negocio con usuarios reales. · NodoSur · nodosur.dev | Production · I design, deploy and stabilize business software with real users. · NodoSur · nodosur.dev | Produção · Projeto, implanto e estabilizo software de negócio com usuários reais. · NodoSur · nodosur.dev | `full.belts.6` |

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
| `desk.projects.2` | NodoFit · SAAS EN PRODUCCIÓN | Cobros perdidos y planillas manuales. · Lost payments and manual spreadsheets. · Cobranças perdidas e planilhas manuais. | Cero horas de conciliación manual. · Zero hours of manual reconciliation. · Zero horas de conciliação manual. | `full.projects.2` |
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
