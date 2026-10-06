# Copywriting Mobile: Versión Mínima (ES · EN · PT)

> Derivado de `copywriting-full.md`. Cada fila referencia su clave full en la columna **Mapea a**.

**Filosofía.** El copy es deliberadamente mínimo para que la atención visual quede en la cinemática, las transiciones, la animación y el scroll inmersivo. El texto nunca carga el significado por sí solo y nunca depende de la animación para poder leerse (con `prefers-reduced-motion` las escenas se aplanan y todo se lee estático).

**Presupuesto.** Titulares ≤ 4 líneas cortas. **Una** frase por bloque. Etiquetas mono ≤ 3 palabras. **Sin párrafos.** Los chips de stack son nombres propios.

**Base visual:** `design/MockupMobile.dc.html` (iPhone 14 Pro, 393 × 852) y escenas `data-scene` de `src/components/MobileImmersive.astro`. **Reglas de contenido:** las de `copywriting-full.md` §0 (aplican íntegras).

---

## M0. Header y microcopy global (`mob.ui.*`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `mob.ui.brand` | J. M. Puccio | J. M. Puccio | J. M. Puccio | `full.hero.name` |
| `mob.ui.langs` | ES · EN · PT | ES · EN · PT | ES · EN · PT | (selector) |
| `mob.ui.cta` | CONTACTAR → | CONTACT → | CONTATO → | `full.contact.shortcut` |
| `mob.ui.loading` | CARGANDO | LOADING | CARREGANDO | (loader) |
| `mob.ui.loaderName` | JUAN MANUEL PUCCIO | JUAN MANUEL PUCCIO | JUAN MANUEL PUCCIO | `full.hero.name` |

## M1. Escena Hero (`mob.hero.*`, `data-scene` hero)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `mob.hero.role` | FULL STACK · ROSARIO | FULL STACK · ROSARIO | FULL STACK · ROSÁRIO | `full.hero.role` |
| `mob.hero.h1` | Audito | I audit | Audito | `full.hero.tagline` |
| `mob.hero.h2` | procesos | processes | processos | `full.hero.tagline` |
| `mob.hero.h3` | y los resuelvo | and solve them | e os resolvo | `full.hero.tagline` |
| `mob.hero.h4` | con código. | with code. | com código. | `full.hero.tagline` |
| `mob.hero.scroll` | DESPLÁZATE ↓ | SCROLL ↓ | DESLIZE ↓ | `full.hero.scroll` |
| `mob.hero.seal` | 염치 | 염치 | 염치 | (sello, glifo) |

## M2. Escena Manifiesto (`mob.manifesto.*`, `m-manifesto`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `mob.manifesto.label` | 01 — MANIFIESTO | 01 — MANIFESTO | 01 — MANIFESTO | `full.manifesto.statement` |
| `mob.manifesto.line` | Cimientos en robótica y programación, y experiencia en entornos operativos exigentes. | Foundations in robotics and programming, and experience in demanding operational environments. | Fundamentos em robótica e programação, e experiência em ambientes operacionais exigentes. | `full.manifesto.statement` |
| `mob.manifesto.quote` | La constancia vence a la improvisación; la templanza resuelve la urgencia. | Consistency beats improvisation; composure resolves urgency. | A constância vence a improvisação; a temperança resolve a urgência. | `full.manifesto.quote` |

## M3. Escena Cinturones (`mob.belts.*`, `m-belts`)
Una fila por cinturón: grado, título y **una** línea. El detalle (`full.belts.N.detail`) no se muestra en mobile; el cierre del negro (`full.belts.6.closing`) sí.
| Clave | Grado | ES (símbolo · título · línea) | EN | PT | Mapea a |
|---|---|---|---|---|---|
| `mob.belts.label` | | 02 — CINTURONES | 02 — BELTS | 02 — FAIXAS | `ui.ts` (`tul.*`) |
| `mob.belts.1` | 10º GUP | Formación técnica · Secundario técnico en robótica y programación: mis primeras bases en el mundo tecnológico. | Technical foundations · Technical high school in robotics and programming: my first foundations in the tech world. | Formação técnica · Ensino médio técnico em robótica e programação: minhas primeiras bases no mundo da tecnologia. | `full.belts.1` |
| `mob.belts.2` | 8º GUP | Ventas y atención al cliente · Atención al cliente y venta directa: aprendí a escuchar antes de responder. | Sales and customer service · Customer service and direct sales: I learned to listen before answering. | Vendas e atendimento ao cliente · Atendimento ao cliente e venda direta: aprendi a escutar antes de responder. | `full.belts.2` |
| `mob.belts.3` | 6º GUP | Administración pública · Miles de expedientes en ANSES bajo normativa previsional y de seguridad social estricta. | Public administration · Thousands of case files at ANSES under strict pension and social security regulations. | Administração pública · Milhares de processos no ANSES sob normativa previdenciária e de seguridade social rigorosa. | `full.belts.3` |
| `mob.belts.4` | 4º GUP | Reconversión profesional · Emprendí como fotógrafo y filmmaker, me formé en programación y volví a ANSES por mérito. | Career change · I started as a photographer and filmmaker, trained in programming, and returned to ANSES on merit. | Reconversão profissional · Empreendi como fotógrafo e filmmaker, me formei em programação e voltei ao ANSES por mérito. | `full.belts.4` |
| `mob.belts.5` | 2º GUP | Salud y logística · Salud y logística: detecté tareas repetitivas y las automaticé con Python. | Healthcare and logistics · Healthcare and logistics: I spotted repetitive tasks and automated them with Python. | Saúde e logística · Saúde e logística: identifiquei tarefas repetitivas e as automatizei com Python. | `full.belts.5` |
| `mob.belts.6` | 1º DAN | Software en producción · Hoy diseño, despliego y sostengo sistemas que usan personas reales: Satori Dojo, NodoFit y Don Pizza. | Software in production · Today I design, deploy and maintain systems real people use: Satori Dojo, NodoFit and Don Pizza. | Software em produção · Hoje projeto, implanto e sustento sistemas usados por pessoas reais: Satori Dojo, NodoFit e Don Pizza. | `full.belts.6` |

> Nota: mobile usa los mismos títulos y líneas que `full.belts.N`; solo omite el detalle.

## M4. Escena Proyectos (`mob.projects.*`, `m-projects`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `mob.projects.label` | 03 — PROYECTOS | 03 — PROJECTS | 03 — PROJETOS | `full.projects.badge` |
| `mob.projects.status` | EN PRODUCCIÓN | IN PRODUCTION | EM PRODUÇÃO | `full.projects.badge` |
| `mob.projects.flow` | PROBLEMA → SOLUCIÓN → IMPACTO | PROBLEM → SOLUTION → IMPACT | PROBLEMA → SOLUÇÃO → IMPACTO | `full.projects.steps` |
| `mob.projects.swipe` | DESLIZÁ → | SWIPE → | DESLIZE → | (hint de carrusel) |
| `mob.projects.1` | NodoSur | NodoSur | NodoSur | `full.projects.1` |
| `mob.projects.2` | NodoFit | NodoFit | NodoFit | `full.projects.2` |
| `mob.projects.3` | Satori Dojo | Satori Dojo | Satori Dojo | `full.projects.3` |
| `mob.projects.4` | Don Pizza | Don Pizza | Don Pizza | `full.projects.4` |

## M5. Escena Stack (`mob.stack.*`, `m-stack`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `mob.stack.label` | 04 — STACK | 04 — STACK | 04 — STACK | `full.stack.badge` |
| `mob.stack.1` | Core Frontend & Arquitectura UI | Core Frontend & UI Architecture | Core Frontend & Arquitetura UI | `full.stack.1` |
| `mob.stack.2` | Backend, Automatización & Datos | Backend, Automation & Data | Backend, Automação & Dados | `full.stack.2` |
| `mob.stack.3` | Cloud, Infraestructura & DevOps | Cloud, Infrastructure & DevOps | Cloud, Infraestrutura & DevOps | `full.stack.3` |
| `mob.stack.4` | Operación de Campo | Field Operations | Operação de Campo | `full.stack.4` |
| `mob.stack.5` | Certificaciones & Idiomas | Certifications & Languages | Certificações & Idiomas | `full.stack.5` |

Chips (nombres propios, no se traducen salvo la categoría 4):
| Clave | Chips | Mapea a |
|---|---|---|
| `mob.stack.1.chips` | TypeScript · React · Next.js · Astro 7 | `full.stack.1` |
| `mob.stack.2.chips` | Python · PostgreSQL · Node.js / Bun · REST APIs | `full.stack.2` |
| `mob.stack.3.chips` | Docker & Compose · GitHub Actions · Nginx · Vercel Edge | `full.stack.3` |
| `mob.stack.4.chips` | ES: Auditoría Médica · Facturación & IVA · Logística & Stock · EN: Medical Auditing · Billing & VAT · Logistics & Stock · PT: Auditoria Médica · Faturamento & IVA · Logística & Estoque | `full.stack.4` |
| `mob.stack.5.chips` | AWS CCP · AZ-900 · GCP Foundations · CS50 | `full.stack.5` |

## M6. Escena Contacto (`mob.contact.*`, `m-contact`)
| Clave | ES | EN | PT | Mapea a |
|---|---|---|---|---|
| `mob.contact.label` | 05 — CONTACTO | 05 — CONTACT | 05 — CONTATO | `full.contact.badge` |
| `mob.contact.avail` | DISPONIBILIDAD & CONTRATACIÓN | AVAILABILITY & HIRING | DISPONIBILIDADE & CONTRATAÇÃO | `full.contact.badge` |
| `mob.contact.title` | Busco sumarme a un equipo técnico con desafíos reales. | Looking to join a technical team with real challenges. | Busco ingressar em uma equipe técnica com desafios reais. | `full.contact.title` |
| `mob.contact.email` | EMAIL · juan.pucciom@gmail.com | EMAIL · juan.pucciom@gmail.com | EMAIL · juan.pucciom@gmail.com | `full.contact.email` |
| `mob.contact.whatsapp` | WHATSAPP · +54 9 341 319 2179 | WHATSAPP · +54 9 341 319 2179 | WHATSAPP · +54 9 341 319 2179 | `full.contact.whatsapp` |
| `mob.contact.linkedin` | LINKEDIN · in/jmpuc92 ↗ | LINKEDIN · in/jmpuc92 ↗ | LINKEDIN · in/jmpuc92 ↗ | `full.contact.linkedin` |
| `mob.contact.github` | GITHUB · juanmapuccio ↗ | GITHUB · juanmapuccio ↗ | GITHUB · juanmapuccio ↗ | `full.contact.github` |
| `mob.contact.footer` | © 2026 JUAN MANUEL PUCCIO | © 2026 JUAN MANUEL PUCCIO | © 2026 JUAN MANUEL PUCCIO | `full.contact.footer` |

---

## Mantenimiento
Editar primero `copywriting-full.md`; luego reflejar aquí. Mismas claves en ES, EN y PT.
