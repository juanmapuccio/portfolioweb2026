# Investigación: página de manga B/N llevada a la web (hero)

Fecha: 2026-10-03. Objetivo: que el hero se lea como una página de manga y no como una grilla con foto en gris. Restricciones del usuario: sin trama de puntos sobre la foto, sin texto japonés/coreano/chino.

## Técnicas (con fuente)

1. **Koma-wari: viñetas irregulares y gutters con intención.** Los gutters horizontales son más grandes que los verticales y agrupan viñetas; gutter angosto = corte rápido, ancho = pausa. Una página tiene una viñeta dominante (la más grande). Fuentes: [GlobalComix, Komawari](https://globalcomix.com/news/details/254), [Clip Studio, layouts y paneles](https://clipstudio.net/how-to-draw/archives/160963).
2. **Bordes diagonales.** Muy comunes en manga; Tezuka usó bordes diagonales, formas irregulares y viñetas superpuestas para guiar el ojo y marcar el ritmo. Fuente: [Clip Studio](https://clipstudio.net/how-to-draw/archives/160963). Web: `grid` solo da rectángulos, pero `clip-path: polygon()` da la ilusión de cualquier forma; las viñetas pueden solaparse. Fuentes: [Level Up Coding, grid + CSS shapes](https://levelup.gitconnected.com/super-hero-layout-combining-css-grid-and-css-shapes-26a60acef643) (el artículo devolvió 403 al fetch directo; contenido leído en el resumen de búsqueda), [Anton Ball, Super Hero Layouts](https://noti.st/antonball/mXfa8e).
3. **Grosor de borde (wakusen) variable.** Los bordes van de 0,5 mm a 2 mm; el grosor y su ausencia controlan el ritmo. Fuentes: [GlobalComix](https://globalcomix.com/news/details/254), [Clip Studio](https://clipstudio.net/how-to-draw/archives/160963).
4. **Figura que rompe el marco (broken panel) y objetos sin marco.** Un personaje o acción que excede el borde marca movimiento intenso; los inset panels y elementos hasta el borde del papel suben la intensidad. Fuente: [Clip Studio](https://clipstudio.net/how-to-draw/archives/160963).
5. **Focus lines (shūchūsen) y speed lines.** Líneas del borde de la viñeta hacia el sujeto, o paralelas para velocidad; guían la mirada y resaltan el objeto. Se dibujan con snap radial y se afinan hacia el centro. Fuentes: [MediBang, focus/effect lines y lettering](https://medibangpaint.com/en/use/2022/10/mangatutorialforbeginners13), [Clip Studio Tips, efectos de velocidad](https://tips.clip-studio.com/en-us/articles/3372). Web: varias capas de `repeating-conic-gradient()` con anchos distintos dan irregularidad ([ICS MEDIA](https://ics.media/en/entry/18966/), [MDN](https://developer.mozilla.org/docs/Web/CSS/repeating-conic-gradient())); una máscara radial deja el centro limpio.
6. **Cajas de narración y globos.** Convención: diálogo en globos redondeados, pensamiento en nubes, narración en caja rectangular; el grito, en globo dentado. Fuente: [Comicraft Glossary of Lettering Terms](https://balloontales.com/?p=418). Web: la cola del globo se resuelve con un `clip-path: polygon()` ([FreeFrontend, speech bubbles](https://freefrontend.com/css-speech-bubbles/)).
7. **SFX (lettering de sonido).** El tamaño comunica volumen/distancia; la forma comunica textura (angular = áspero, redondeada = suave); en primer plano lleva borde blanco; debe seguir legible. Fuente: [MediBang](https://medibangpaint.com/en/use/2022/10/mangatutorialforbeginners13).
8. **Contraste de tinta: spot blacks, grosor de línea y hatching.** Áreas de negro sólido (spot blacks) dan peso y clima; líneas más gruesas al frente; hatching/cross-hatching para valor; el screentone es una de varias opciones, no la única. Fuentes: [Comics Kingdom, black ink white paper](https://comicskingdom.com/trending/blog/2024/08/05/do-you-speak-comics-part-3-black-ink-white-paper), [Clip Studio Tips, contraste](https://tips.clip-studio.com/en-us/articles/10029), [Clip Studio Tips, inking](https://tips.clip-studio.com/en-us/articles/3842).
9. **Silueta/recorte para despejar la escena.** Una silueta o recorte "declutters" y concentra la atención (Clip Studio, arriba).

Ejemplos web reales: no se encontró un sitio premiado de manga-hero verificable en la búsqueda (Awwwards devolvió heros genéricos); lo verificable son los demos de CSS de comics (Anton Ball, CodePen `antonjb/mYyJvj` y `antonjb/EJOLMx`, citados en los resultados, no abiertos) y los snippets de [Speckyboy](https://speckyboy.com/comic-inspired-css-javascript-snippets/). No se afirma nada más de sitios concretos.

## Qué se aplicó al hero

| Técnica | Aplicación |
|---|---|
| Viñetas irregulares (2, 3) | `clip-path: polygon()` por panel, bordes inclinados; marco = `::before` negro + `::after` papel inset `--b`; `--b` de 3 a 6 px |
| Gutters sobre papel (1) | fondo papel, marco de página negro 3px, gap 14px |
| Figura que rompe el marco (4) | retrato PNG de tinta con alfa, superpuesto fuera del clip del panel; el pelo cruza el borde superior y el gutter |
| Focus / speed lines (5) | `repeating-conic-gradient` estático detrás del retrato (máscara radial) y en el panel del nombre; sin animación |
| Caja de narración (6) | tagline en caja rectangular, borde 3px, sombra dura |
| Globo (6) | rol + fig en globo con cola sobre viñeta negra (spot black, 8) |
| SFX (7) | `hero.sfx` en i18n (¡PUM! / BAM! / POW!), letras latinas, contorno |
| Tinta (8) | retrato pre-procesado en build (`scripts/make-ink-portrait.mjs`): gris, normalise, curva dura, luminancia a alfa. Sin puntos; hatching de líneas en fondos |

## No aplicado a propósito

- Trama de puntos sobre la foto (rechazada por el usuario).
- Texto o onomatopeyas japonesas/coreanas/chinas (prohibido); el SFX usa español/inglés/portugués.
- Líneas o filtros animados: las líneas son estáticas; el movimiento sigue siendo solo `transform`/`opacity` por `--p`.
- Sentido de lectura derecha-a-izquierda: la web se lee izquierda-a-derecha, se mantiene el orden del DOM.

## Sin verificar

No hubo navegador: proporciones del recorte del retrato, paralelismo real de los gutters inclinados (los bordes vecinos tienen la misma inclinación en px, pero no el mismo largo) y ajuste en 393x852 quedan para revisión visual.
