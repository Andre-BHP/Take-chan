---
name: Take-chan Ramen (propuesta, rediseño)
description: Una ramen-ya de Yokohama de noche. Fotografía oscura con vapor, negro sumi, papel washi, 家系 vertical y un solo acento bermellón.
colors:
  sumi: "#121110"
  sumi-2: "#1b1917"
  sumi-3: "#262320"
  linea: "#37322d"
  ceniza: "#a59c90"
  washi: "#f3eee4"
  washi-2: "#e9e2d4"
  washi-linea: "#d6ccba"
  tinta: "#1a1714"
  tinta-2: "#5c544b"
  bermellon: "#d9381e"
  bermellon-hundido: "#b52c15"
  metal: "#2e2f31"
  metal-claro: "#4a4c4f"
  led: "#ffb347"
typography:
  kanji:
    fontFamily: "'Shippori Mincho B1', serif"
    fontSize: "clamp(6rem, 22vw, 15rem), vertical (writing-mode: vertical-rl)"
    fontWeight: 800
    lineHeight: 1
  display:
    fontFamily: "'Shippori Mincho B1', 'Times New Roman', serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  titulo:
    fontFamily: "'Shippori Mincho B1', serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.8vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.1
  subtitulo:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  cuerpo:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  pequeno:
    fontFamily: "'Geist', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.45
  dato:
    fontFamily: "'Geist Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    fontFeature: "tnum"
rounded:
  s: "3px"
  m: "6px"
  l: "12px"
spacing:
  e-1: "4px"
  e-2: "8px"
  e-3: "16px"
  e-4: "24px"
  e-5: "32px"
  e-6: "48px"
  e-7: "64px"
  e-8: "96px"
  e-9: "128px"
  gutter: "clamp(16px, 4vw, 48px)"
  ancho: "76rem"
components:
  boton-primario:
    backgroundColor: "{colors.bermellon}"
    textColor: "#ffffff"
    rounded: "{rounded.m}"
    height: "52px"
  boton-contorno:
    textColor: "{colors.washi}"
    rounded: "{rounded.m}"
    height: "52px"
  tecla-maquina:
    backgroundColor: "{colors.sumi-3}"
    textColor: "{colors.washi}"
    rounded: "{rounded.m}"
  precio-led:
    textColor: "{colors.led}"
    typography: "{typography.dato}"
  hoja-washi:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
---

# Sistema de diseño: Take-chan Ramen (rediseño)

Sustituye al de la primera versión. Tokens fijados antes de construir (dis-019); al terminar se actualiza con lo construido.

## Idea rectora
**Una ramen-ya de Yokohama de noche.** Se entra por una foto oscura de un tazón con vapor. El kanji 家系 vertical, en mincho, es la marca visual. Lo claro es papel washi (la hoja de pedido, el ticket térmico); lo oscuro es negro sumi. Un solo color vivo, el bermellón (朱), marca lo que se presiona. Las fotos ponen el resto del color.

## Cartas aplicadas
| Carta | Decisión |
|---|---|
| dis-064 (wireframe primero) | Wireframe gris de inicio y menú a 360 y 1440 px antes de decorar: `wireframe/`. |
| dis-019 (tokens antes) | Este archivo y `sitio/src/styles.css`. |
| dis-043 (dos bases y un acento) | Sumi `#121110` y washi `#f3eee4`. Bermellón `#d9381e` solo en el botón principal y en lo activo; nunca en títulos ni fondos. |
| dis-006 (monocromo con acento) | Todo en la escala de sumi a washi; el color lo ponen las fotos. |
| dis-009 (un material) | Washi con grano sutil en las secciones claras; la madera solo aparece en las fotos. Sin vidrio ni degradados decorativos. La máquina de tickets es de metal porque así es el objeto real. |
| dis-005 (palabra gigante) | 家系 vertical gigante (`writing-mode: vertical-rl`) junto al texto del héroe; TAKE-CHAN más chico. |
| dis-090 (6 claves) | Kanji, display, título, subtítulo, cuerpo y dato. Una sola display: Shippori Mincho B1. |
| dis-054 (un mensaje) | Foto a sangre y una frase: "Ramen Iekei en Tlaquepaque. Caldo y fideo traídos de Japón." |
| dis-023 (un momento animado) | Portada: vapor en 3 capas sobre la foto. Menú: el ticket térmico que sale de la ranura. Lo demás, de 150 a 250 ms. |
| dis-051 (un botón sólido) | "Arma tu pedido" en bermellón; "Cómo llegar" en contorno. |
| dis-040 (bento) | Bento con fotos, del mismo material: el clásico en grande y tres más. La nota de primera vez va dentro de la tarjeta del clásico. |
| dis-032 (escena al pasar el cursor) | En el bento, al pasar el cursor la foto se acerca con paralaje leve; en táctil queda fija. |
| dis-028 (scroll horizontal) | "Cómo se hace un Iekei" en 4 pasos: fija en escritorio, scroll-snap en celular. |
| dis-073 (primera vez) | "¿Primera vez? Pide el clásico, todo normal." dentro del bento. |
| dis-050 y dis-059 (máquina de tickets, objeto real) | `/menu`: panel de metal con letrero iluminado, teclas con foto, nombre y precio LED, ranura de monedas. La tecla se hunde. |
| dis-072 (configurar y apartar) | Pedido, al gusto, sucursal y hora en la misma página. |
| dis-044 (índice con el scroll) | En `/menu`. |
| dis-025 (estados de carga) | Fotos con su color promedio de fondo y una versión diminuta borrosa que se desvanece al cargar; nada de cajas vacías. |
| dis-039 (datos en mono) | Mono solo en horario, "abierto ahora", dirección corta y precios. |
| dis-052 y dis-091 (pie real) | Pie compacto con 2 sucursales, horario, TikTok, mapa y créditos de fotos, con los mismos datos que el JSON-LD. |

**Fuera:** franja de katakana en cajas, tazón de clip-art, cajas "Foto pendiente", grotesca extendida y mono en textos.

## Color
- **Escena:** se abre en el celular, a mediodía o de noche, a veces en la calle frente al local. El sumi deja que la foto brille; el washi se usa para lo que se "imprime" o se lee con calma.
- **Contraste AA (a verificar con axe):** washi sobre sumi, ceniza sobre sumi, tinta y tinta-2 sobre washi, blanco sobre bermellón (botón de 16 px en negritas) y LED ámbar sobre metal.

## Tipografía
- **Shippori Mincho B1** (700 y 800): kanji, display y títulos, en latino y japonés. Mincho japonesa con remates, sin caricatura.
- **Geist** (400, 500 y 600): texto.
- **Geist Mono** (500): horario y precios.
- Subconjuntos autohospedados con `herramientas/fuentes.mjs`, que incluyen 家系ラーメン食券機硬め普通柔らかめ濃いめ薄め多め少なめのれん.

## Movimiento
- Vapor: 3 capas de humo semitransparente que suben y se desvanecen en 6 a 9 s, solo con `transform` y `opacity`.
- Tecla: baja 3 px en 120 ms.
- Ticket: sale de la ranura en 600 ms con `cubic-bezier(.23, 1, .32, 1)`.
- `prefers-reduced-motion`: sin vapor en movimiento; el ticket solo aparece.

## Datos de ejemplo
Una sola nota por página: "Propuesta: menú, precios y fotos de ejemplo hasta que Take-chan confirme los suyos". Cada foto lleva un rótulo pequeño "Imagen ilustrativa". Solo la sucursal Americana lleva su marca "por confirmar".
