# Registro Oficial de Copywriting, Textos y Diccionario Web
**Proyecto:** `portfolioweb-puccio2026`
**Última actualización:** 2026-09-28 (11 posiciones en el timeline: se sumó Grido Helados y se corrigieron fechas de Providus/Al Natural)
**Ubicación:** `docs/Copywriting.md`
**Propósito:** Centralizar, auditar y documentar todo el copy textual del sitio en sus tres idiomas (`es`, `en`, `pt`), garantizando coherencia con el documento canónico de trayectoria (`docs/Narrativa.md`) y la estrategia de marca (`docs/Storytelling.md`).

**Fuentes vivas transcritas en este documento:** `src/i18n/ui.ts`, `src/data/experience.ts`, `src/data/projects.ts`, `src/data/skills.ts`, `src/data/contact.ts`, y los textos hardcodeados en `src/components/ProjectsSection.astro`, `src/components/ExperienceTimeline.astro` y `src/components/SkillsPhilosophySection.astro`.

**Nota técnica:** los badges/títulos/subtítulos de las secciones "Proyectos", "Trayectoria" y "Habilidades" están hardcodeados directo en sus componentes `.astro` (con ternarios `lang === 'es' ? ... : ...`), no en `ui.ts`. `ui.ts` conserva las claves `projects.title`/`projects.subtitle`/`experience.title`/`experience.subtitle`, pero no son las que se renderizan en esas secciones — hoy son texto muerto/duplicado. Este documento transcribe el texto que efectivamente se ve en el sitio (el de los componentes `.astro`) y señala la clave de `ui.ts` como referencia. No se tocó código fuente para corregir esta duplicación.

---

## 1. Hero Section (Propuesta de Valor & Presentación)

| Clave / Elemento | Español (ES) | English (EN) | Português (PT) |
|---|---|---|---|
| **Meta title** | `Juan Manuel Puccio \| Full Stack Developer & Consultor de Procesos` | `Juan Manuel Puccio \| Full Stack Developer & Process Consultant` | `Juan Manuel Puccio \| Desenvolvedor Full Stack & Consultor de Processos` |
| **Meta description** | `Desarrollador Full Stack especializado en optimización operativa, automatizaciones con Python e IA, y sistemas de gestión en producción (NodoSur).` | `Full Stack Developer focused on operational optimization, Python & AI automations, and production systems (NodoSur).` | `Desenvolvedor Full Stack focado em otimização operacional, automações com Python e IA, e sistemas em produção (NodoSur).` |
| **Nav** | Proyectos · Trayectoria · Habilidades · Contacto | Projects · Experience · Skills · Contact | Projetos · Experiência · Habilidades · Contato |
| **Badge de estado** | `Disponible` | `Available` | `Disponível` |
| **Nombre (H1)** | `Juan Manuel Puccio` | `Juan Manuel Puccio` | `Juan Manuel Puccio` |
| **Rol / Titular** | `Desarrollador Full Stack — Disponibilidad full-time` | `Full Stack Developer — Full-time availability` | `Desenvolvedor Full Stack — Disponibilidade full-time` |
| **Tagline de Valor** | `Construyo sistemas que siguen funcionando sin mí.` | `I build systems that keep running without me.` | `Construo sistemas que continuam funcionando sem mim.` |
| **Descripción / Claim** | `Diseño, despliego y estabilizo software de negocio en producción, con usuarios reales. Esa capacidad de construir sistemas confiables, que siguen funcionando una vez entregados, es la que quiero poner al servicio de un equipo, con dedicación full-time.` | `I design, ship, and stabilize production business software with real users. That ability to build reliable systems that keep running after delivery is what I want to bring to a team, full-time.` | `Projeto, implanto e estabilizo software de negócio em produção, com usuários reais. Essa capacidade de construir sistemas confiáveis, que continuam funcionando depois de entregues, é o que quero colocar a serviço de uma equipe, em dedicação full-time.` |
| **Avatar — Rol** | `Desarrollador Full Stack` | `Full Stack Developer` | `Desenvolvedor Full Stack` |
| **Avatar — Sub** | `Sistemas en producción, usuarios reales` | `Production systems, real users` | `Sistemas em produção, usuários reais` |
| **Botón Primario** | `Descargar CV` | `Download CV` | `Baixar CV` |
| **Botón Secundario** | `Ver QR Móvil` | `View Mobile QR` | `Ver QR Móvel` |

> Nota: el hero ya no usa el framing "Founder of NodoSur" ni el pitch orientado a cliente ("Software que resuelve el caos operativo"). Esas variantes existen solo como referencia histórica/comercial en `docs/Storytelling.md` §6.1, no están en el sitio.

---

## 2. Sección Proyectos en Producción (`#proyectos`)

### 2.1 Encabezado de Sección
Fuente: `src/components/ProjectsSection.astro` (hardcodeado con ternarios `lang === 'es' ? ... : ...`; no pasa por `ui.ts`).

- **Badge:** `PRODUCCIÓN VIVA` (texto único, no varía por idioma en el componente)
- **Título (H2):**
  - **ES:** `Sistemas en Producción & Casos Reales`
  - **EN:** `Live Production Systems & Real Cases`
  - **PT:** `Sistemas em Produção & Casos Reais`
- **Subtítulo:**
  - **ES:** `Proyectos desplegados en clientes reales, resolviendo problemas de software, logística y operación.`
  - **EN:** `Software deployed for real business clients, solving operational bottlenecks and logistics.`
  - **PT:** `Projetos implantados em clientes reais, resolvendo problemas de software, logística e operações.`

### 2.2 Proyectos Activos (Bento Grid)
Fuente: `src/data/projects.ts` (`projectsContent`).

1. **NodoSur (`https://nodosur.dev`)** — badge `Software Factory & Cloud` · destacado (`featured: true`)
   - **Rol:** Fundador & Desarrollador Principal.
   - **Categoría:** Sistemas Propios & Consultoría IT.
   - **Descripción:** Plataforma institucional y espacio de trabajo cooperativo para desplegar software a medida, sistemas de gestión y automatizaciones de negocio.
   - **Fricción:** Empresas y comercios operaban con software genérico desintegrado y altos costos de licenciamiento.
   - **Solución:** Desarrollo de sistemas propietarios desplegados en infraestructura cloud propia (Linux, Docker, GitHub Actions) con integraciones fiscales.
   - **Impacto:** Clientes activos en producción (Seiton Motors, Satori Dojo, Don Pizza) con monitoreo y control de versiones centralizado.
   - **Tech:** TypeScript, React, Docker, Linux Cloud, CI/CD.
2. **NodoFit (`https://nodofit.com.ar`)** — badge `SaaS en Producción`
   - **Rol:** Creador & Arquitecto Full Stack.
   - **Categoría:** Gestión para Dojos, Gyms & Entrenadores.
   - **Descripción:** Sistema cloud moderno para la gestión administrativa y contable de gimnasios, dojos y entrenadores personales, con control de ingresos y gestor de cuotas.
   - **Fricción:** Pérdida de cobros, registros manuales en planillas y falta de control en el acceso y estado de las membresías.
   - **Solución:** Plataforma ágil con dashboard operativo en tiempo real, alertas de cuotas vencidas y métricas de retención de alumnos.
   - **Impacto:** En producción activa reduciendo a cero las horas de conciliación manual de cobros y accesos.
   - **Tech:** Next.js, PostgreSQL, Tailwind, REST APIs, Supabase.
3. **Satori Dojo (`https://satoridojo.vercel.app`)** — badge `Gestión Deportiva & Club`
   - **Rol:** Consultor IT & Desarrollador.
   - **Categoría:** Plataforma para Artes Marciales.
   - **Descripción:** Sistema personalizado para dojo de artes marciales: gestión académica, graduaciones, aranceles y presencia institucional.
   - **Fricción:** Falta de centralización entre el progreso técnico de los practicantes, cobros de cuotas y difusión de eventos.
   - **Solución:** Portal unificado con seguimiento pedagógico marcial, control de asistencia y pasarela de comunicación con las familias.
   - **Impacto:** Implementado y en producción, optimizando el tiempo de gestión del equipo docente.
   - **Tech:** Astro, TypeScript, Responsive UI, Vercel Edge.
4. **Don Pizza Rosario (`https://donpizzarosario.vercel.app`)** — badge `Rediseño Web & Sistema de Pedidos`
   - **Rol:** Desarrollador & Consultor Operativo.
   - **Categoría:** E-commerce & Operación Gastronómica.
   - **Descripción:** Rediseño completo de la web original del local, con un sistema propio de gestión de pedidos: catálogo digital, toma de pedidos rápidos y despacho en un entorno gastronómico de alta rotación.
   - **Fricción:** Fricciones en la toma de pedidos telefónicos y cuellos de botella en horas pico de elaboración y entrega.
   - **Solución:** Aplicación ultra-rápida pensada para smartphones, con catálogo dinámico y canal directo a cocina/despacho.
   - **Impacto:** En producción real, validando UX móvil y velocidad de carga en un entorno de alta demanda.
   - **Tech:** React, Mobile First, Fast Checkout, Cloud.

> **Nota de autoría (obligatoria):** NodoSur también comercializa Stoky, Inmotuls y Credituls, pero esos tres sistemas los desarrollan otros colaboradores del espacio cooperativo — nunca Juan. No aparecen en `projects.ts` como proyecto propio y no deben describirse como desarrollo propio en ningún documento. Seiton Motors, en cambio, sí aparece en el copy vivo (`experience.ts`, `projects.ts`) como cliente real de implementación/capacitación de NodoSur, consistente con el CV ("Implementación de sistemas de gestión y capacitación de usuarios en Seiton Motors y Satori Dojo").

Microcopy de tarjeta: botón `Ver en vivo` / `Visit live` / `Ver ao vivo`; labels `Fricción:` / `Bottleneck:` / `Fricção:`, `Solución:` / `Solution:` / `Solução:`, `Impacto:` / `Impact:` / `Impacto:`.

### 2.3 Automatizaciones Críticas Destacadas
Fuente: `src/data/projects.ts` (`automationsContent`).

- **Título de bloque:** `Automatizaciones & Bots de Negocio` / `Automations & Business Bots` / `Automações & Bots de Negócio`
- **Subtítulo:** `Resolviendo cuellos de botella reales en empresas y organismos` / `Solving real operational bottlenecks in businesses and organizations` / `Resolvendo gargalos operacionais reais em empresas e organizações`
- **Bot 1 — Lector & Conciliador de Extractos Bancarios (Python):**
  - *Descripción (ES):* Procesa PDFs bancarios heterogéneos de múltiples entidades bancarias, identifica alícuotas de IVA y totaliza movimientos automáticamente para liquidaciones contables.
  - *Resultado (ES):* Reducción de horas de marcado manual a segundos con 0% de margen de error.
- **Bot 2 — Facturación Electrónica Fiscal ARCA (ex AFIP):**
  - *Descripción (ES):* Integración vía Webservices seguros con el organismo tributario para la emisión automatizada de comprobantes fiscales, con validación humana en el loop.
  - *Resultado (ES):* 100% de cumplimiento normativo y trazabilidad contable.
  - (Ver EN/PT en `src/data/projects.ts`, mismo contenido traducido.)

---

## 3. Sección Trayectoria & Trinchera Operativa (`#trayectoria`)

### 3.1 Encabezado de Sección
Fuente: `src/components/ExperienceTimeline.astro` (hardcodeado con ternarios `lang === 'es' ? ... : ...`; no pasa por `ui.ts`).

- **Badge:** `TRAYECTORIA DE CAMPO` / `FIELD EXPERIENCE` / `TRAJETÓRIA PRÁTICA`
- **Título (H2):**
  - **ES:** `Trinchera Operativa & Evolución Técnica`
  - **EN:** `Operational Frontline & Technical Evolution`
  - **PT:** `Trincheira Operacional & Evolução Técnica`
- **Subtítulo:**
  - **ES:** `De la venta en calle, la gestión pública masiva y la salud de alta demanda, a la arquitectura de software en producción.`
  - **EN:** `From frontline sales, high-scale public administration, and healthcare to modern production software architecture.`
  - **PT:** `Das vendas em campo, administração pública e saúde de alta demanda à arquitetura de software em produção.`
- **Label de highlight:** `Competencia Transferible Clave:` / `Key Transferable Asset:` / `Competência Transferível:`

### 3.2 Las 11 Posiciones del Timeline
Fuente: `src/data/experience.ts` (`experienceData`, versión ES; EN/PT son traducciones fieles). Orden cronológico inverso (más reciente primero), una card por cada rol real.

> **Nota de transparencia:** las posiciones 8, 9, 10 y 11 (AS MED, Providus, Al Natural, Grido Helados) todavía no están en el PDF del CV actual — ver nota en `docs/Narrativa.md`.

1. **Jun 2025 — Presente · Producción & Consultoría** — Fundador y Desarrollador, NodoSur.
   - **Resumen:** Fundé NodoSur, la marca y software factory bajo la que diseño, despliego y mantengo sistemas propios: NodoFit, la facturación fiscal con ARCA y el trabajo que hago para clientes como Satori Dojo y Don Pizza. Tomó forma en paralelo con mi último empleo en relación de dependencia, no después de dejarlo.
   - **Highlights:** SaaS NodoFit y sistemas para clientes (Seiton Motors, Satori Dojo); integración ARCA con validación humana; soporte a Don Pizza Rosario como Living Lab; más de una década como Profesor de Taekwondo ITF y estudiante de Filosofía (UNR).
   - **Competencia transferible:** Arquitectura de software en producción, liderazgo y disciplina ética.
2. **Jun 2025 — Oct 2025 · Logística & Contabilidad** — Administrativo Contable y Logística, Repuestos JL SRL.
   - **Resumen:** Empecé el mismo mes que fundé NodoSur, en paralelo. Despacho de mercadería, stock, facturación y cobranzas; desarrollé un bot en Python lector de extractos bancarios que detecta alícuotas de IVA y liquida en segundos.
   - **Competencia transferible:** Resolución de cuellos de botella administrativos con Python e iniciativa de mejora continua.
3. **Ene 2025 — Abr 2025 · Salud & Gestión** — Administrativo, Gestión en Salud, Aurea Med S.A.
   - **Resumen:** Continuidad y profundización de la etapa sanitaria de alta demanda: gestión de pacientes, turnos y facturación con DATATECH, control documental y cumplimiento normativo.
   - **Competencia transferible:** Auditoría administrativa en salud y manejo de sistemas de gestión de pacientes.
4. **May 2024 — Ene 2025 · Salud & Alta Demanda** — Administrativo, Gestión en Salud, Sanatorio Delta.
   - **Resumen:** Admisión general, admisión de oncología, turnos, laboratorios y caja con el sistema Algoritmo y el nomenclador nacional de salud. Vivir la burocracia y los errores de facturación de un sistema arcaico confirmó que mi aporte real estaba en automatizar.
   - **Competencia transferible:** Auditoría médica y tolerancia a la alta demanda operativa.
5. **Dic 2021 — Mar 2024 · Infraestructura & Estado** — Administrativo Integral y Gestión de Datos, ANSES (planta permanente).
   - **Resumen:** Reconvocado tras la etapa freelance, rendí y aprobé concursos de mérito hasta la efectivización en planta permanente. Mesa de ayuda regional, soporte a racks de servidores del Estado Nacional y sistema propio de métricas de trámites.
   - **Competencia transferible:** Tolerancia a la alta demanda masiva, infraestructura de red/servidores y rigor normativo.
6. **Mar 2019 — Ene 2020 · Emprendimiento & Producción Audiovisual** — Fotógrafo y Filmmaker Freelance.
   - **Resumen:** Tras el cierre del primer contrato en ANSES por reestructuración de nómina estatal (no por desempeño), emprendí en fotografía y filmmaking corporativo (Santander, Federada Salud, ExpoAgro) y aproveché la pandemia para profundizar en programación moderna.
   - **Competencia transferible:** Autogestión, resiliencia y reconversión técnica autodidacta.
7. **Dic 2015 — Mar 2019 · Infraestructura & Estado** — Administrativo Integral, ANSES (contratado).
   - **Resumen:** Primera etapa en ANSES: gestión de expedientes masivos, control documental estricto y legislación previsional vigente. Terminó por reestructuración de nómina del Estado, no por decisión propia ni por desempeño.
   - **Competencia transferible:** Rigor normativo y gestión documental masiva.
8. **Mar 2015 — Sep 2015 · Ventas & Negociación** — Vendedor Viajante de Servicios de Salud, AS MED S.A.
   - **Resumen:** Venta puerta a puerta de servicios de salud, con negociación directa cara a cara.
9. **May 2013 — Ene 2014 · Ventas & Negociación** — Vendedor Viajante de Planes de Capitalización y Ahorro, Providus S.A.
   - **Resumen:** Venta directa puerta a puerta de planes de capitalización y ahorro.
10. **Feb 2013 — Abr 2013 · Atención al Público** — Gastronómico, Al Natural.
    - **Resumen:** Atención al público en un local de comidas saludables (ensaladas y platos preparados), trabajo en equipo bajo presión.
11. **Ene 2012 — Ene 2013 · Atención al Público** — Vendedor y Atención al Público, Grido Helados.
    - **Resumen:** Mi primer trabajo formal — atención al público y venta en una heladería de alto tránsito, con manejo de caja.

Para las posiciones 8 a 11, la competencia transferible es compartida: negociación directa, empatía con el cliente y comunicación cara a cara.

---

## 4. Sección Habilidades, Stack & Filosofía (`#stack-filosofia`)

### 4.1 Encabezado de Sección
Fuente: `src/components/SkillsPhilosophySection.astro` (hardcodeado con ternarios `lang === 'es' ? ... : ...`; nunca tuvo claves equivalentes en `ui.ts`).

- **Badge:** `CRITERIO & HERRAMIENTAS` / `MINDSET & TOOLING` / `CRITÉRIO & FERRAMENTAS`
- **Título (H2):**
  - **ES:** `Stack Tecnológico & Filosofía de Trabajo`
  - **EN:** `Tech Stack & Engineering Mindset`
  - **PT:** `Stack Tecnológico & Filosofia de Trabalho`
- **Subtítulo:**
  - **ES:** `El software como medio para resolver fricciones de negocio, con código tipado, arquitectura limpia y criterio humano en el loop.`
  - **EN:** `Software as a business-enabler: strictly typed code, clean architecture, and critical human-in-the-loop oversight.`
  - **PT:** `Software como habilitador de negócios: código tipado, arquitetura limpa e critério humano no loop.`
- **Título del bloque de filosofía:** `La Dimensión Humana & Ética Operativa` / `The Human Dimension & Operational Ethics` / `A Dimensão Humana & Ética Operacional`

### 4.2 Categorías de Habilidades (ES)
Fuente: `src/data/skills.ts` (`skillsData`).

1. **Core Frontend & Arquitectura UI** (badge: `UI / UX & Performance`) — Construcción de interfaces resilientes, accesibles y de carga inmediata con mínima sobrecarga de JavaScript. Items: TypeScript Estricto, React, Next.js, Astro 7, Tailwind CSS, HTML5 Semántico, Zero CLS / Web Vitals.
2. **Backend, Automatización & Datos** (badge: `Lógica & Negocio`) — Resolución de fricciones operativas mediante scripts de análisis contable, APIs tipadas e integraciones gubernamentales. Items: Python, PostgreSQL, Node.js / Bun, REST APIs, Webservices ARCA (AFIP), Procesamiento de PDFs & Datos.
3. **Cloud, Infraestructura & DevOps** (badge: `Servidores & CI/CD`) — Despliegues autónomos en entornos cloud propios sin depender de cajas negras costosas ni arquitecturas infladas. Items: Linux (Ubuntu Server), Docker & Compose, GitHub Actions, Nginx Reverse Proxy, Vercel Edge, Seguridad & SSL.
4. **Operación de Campo & Trinchera** (badge: `Visión de Negocio`) — Capacidad de dialogar de igual a igual con directivos de sanatorios, personal de maestranza o dueños de comercios. Items: Auditoría Médica & Nomenclador, Facturación Contable & IVA, Gestión Masiva (ANSES), Logística & Stock Real, Living Lab Comercial.
5. **Certificaciones & Idiomas** (badge: `Formación Continua`) — Formación certificada en las tres nubes principales y una base sólida en ciencias de la computación. Items: AWS Certified Cloud Practitioner (2025), Microsoft Certified: Azure Fundamentals — AZ-900 (2025), Google Cloud Computing Foundations (2024), CS50: Introduction to Computer Science — Harvard/edX (2023), Python desde Cero a Desarrollador — Udemy (2022), Inglés B2 — lectura técnica fluida.

(Ver EN/PT completos en `src/data/skills.ts`; misma estructura y significado, traducidos.)

### 4.3 Filosofía Práctica (ES)
1. **Pensamiento Crítico y Ética de Sistemas** — *Licenciatura en Filosofía (UNR — en curso)*
   - Descripción: La facturación fiscal con ARCA (ex AFIP) que integré nunca corre sola: cada comprobante pasa por validación humana antes de emitirse. Prefiero un sistema más lento y auditable a uno rápido que nadie entiende cuando falla.
   - Cita: "Un bot que automatiza sin nadie revisando el resultado no es una solución, es un riesgo nuevo."
2. **Liderazgo, Disciplina y Templanza Marcial** — *Profesor Internacional de Taekwondo ITF (+10 años)*
   - Descripción: Más de una década formando a niños, jóvenes y adultos. La docencia marcial forja constancia diaria, paciencia pedagógica para explicar conceptos técnicos a usuarios de negocio y calma bajo situaciones de alta demanda o caída de servicios.
   - Cita: "La constancia vence a la improvisación; la templanza resuelve la urgencia."

---

## 5. Sección Contacto & Call to Action (`#contacto`)

Fuente: `src/data/contact.ts` (`contactData`).

### 5.1 Encabezado y Propuesta de Conexión
- **Badge:** `DISPONIBILIDAD & CONTRATACIÓN` / `CAREER & HIRING` / `CONTRATAÇÃO & DISPONIBILIDADE`
- **Título (H2):**
  - **ES:** `Busco sumarme a un equipo técnico con desafíos reales.`
  - **EN:** `Looking to join a technical team with real challenges.`
  - **PT:** `Busco ingressar em uma equipe técnica com desafios reais.`
- **Subtítulo:**
  - **ES:** `Busco sumarme como Desarrollador Full Stack en un equipo técnico de alto impacto, con disponibilidad full-time. Diseño, despliego y estabilizo software de negocio en producción — esa es la prueba de ingeniería que quiero poner al servicio de tu equipo.`
  - **EN:** `Looking to join an ambitious engineering team as a Full Stack Developer, with full-time availability. I design, ship, and stabilize production business software — that is the engineering proof I want to bring to your team.`
  - **PT:** `Busco ingressar como Desenvolvedor Full Stack em uma equipe técnica de alto impacto, com disponibilidade full-time. Projeto, implanto e estabilizo software de negócio em produção — essa é a prova de engenharia que quero colocar a serviço da sua equipe.`
- **Botón CTA:** `Conversar por WhatsApp` / `Chat on WhatsApp` / `Conversar no WhatsApp`
- **Status text:** `Disponible para incorporación a equipos de producto & ingeniería` / `Available for full-time engineering & product roles` / `Disponível para contratação em equipes de produto & engenharia`
- **Ubicación:** `Rosario, Santa Fe, Argentina · Modalidad Remota / Híbrida / On-site` / `Rosario, Argentina · Remote / Hybrid / On-site` / `Rosário, Argentina · Remoto / Híbrido / Presencial`

> Nota: el título de esta sección ya NO es un pitch de captación de cliente ("¿Tenés un cuello de botella...?"). Ese framing quedó reemplazado por el pitch de búsqueda de empleo full-time citado arriba.

### 5.2 Canales de Contacto Directo
| Canal | Detalle | Enlace / Identificador |
|---|---|---|
| **WhatsApp Directo** (primary) | `+54 9 341 319-2179` | `https://wa.me/5493413192179` |
| **Email Directo** | `juan.pucciom@gmail.com` | `mailto:juan.pucciom@gmail.com` |
| **LinkedIn** | `in/jmpuc92` | `https://www.linkedin.com/in/jmpuc92` |
| **GitHub** | `github.com/juanmapuccio` | `https://github.com/juanmapuccio` |
| **NodoSur** | ES: "NodoSur (Prueba de Producción)" · EN: "NodoSur (Production Evidence)" · PT: "NodoSur (Evidência de Produção)" | `https://nodosur.dev/` |

---

## 6. Modal de Código QR y Accesibilidad

Fuente: `src/i18n/ui.ts` (`qr.modal.*`).

| Elemento | Español (ES) | English (EN) | Português (PT) |
|---|---|---|---|
| **Título del Modal** | `Acceso Rápido Móvil` | `Quick Mobile Access` | `Acesso Móvel Rápido` |
| **Descripción** | `Escaneá este código QR para abrir el portfolio o guardarlo en tu smartphone.` | `Scan this QR code to view this portfolio or save it on your smartphone.` | `Escaneie este código QR para abrir o portfólio ou salvá-lo em seu smartphone.` |
| **Botón Cerrar** | `Cerrar` | `Close` | `Fechar` |

---

## 7. Regla de Mantenimiento de Contenido
Cada vez que se ajuste o refine un texto en:
- `src/i18n/ui.ts`
- `src/data/experience.ts`
- `src/data/projects.ts`
- `src/data/skills.ts`
- `src/data/contact.ts`
- O en cualquier componente visual (`src/pages/*.astro`, `src/components/*.astro`)

**Se debe actualizar inmediatamente este documento**, y verificar que siga siendo consistente con `docs/Narrativa.md` y `docs/Storytelling.md`, para mantener la coherencia narrativa entre el storytelling de carrera y la interfaz en vivo.
