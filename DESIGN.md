---
name: Take-chan Ramen (propuesta)
description: Barra de una ramen-ya Iekei. Madera oscura, papel washi, máquina de tickets 食券機 y un solo acento rojo laca.
colors:
  carbon: "#17120f"
  madera: "#221a15"
  madera-veta: "#2c211a"
  madera-canto: "#0d0907"
  borde: "#3e3027"
  texto: "#f0e7d8"
  texto-tenue: "#bcae9c"
  washi: "#efe6d6"
  washi-2: "#e3d6c0"
  washi-fibra: "#d5c6ad"
  tinta: "#1c1612"
  tinta-2: "#5b4d42"
  laca: "#c22f28"
  laca-hundida: "#a3261f"
  laca-texto: "#ec5b47"
typography:
  gigante:
    fontFamily: "'Dela Gothic One', 'Arial Black', sans-serif"
    fontSize: "clamp(4.25rem, 24vw, 7rem) en dos líneas (celular); clamp(6rem, 11.5vw, 12rem) en una línea (desde 900 px)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  titulo:
    fontFamily: "'Dela Gothic One', 'Arial Black', sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 2.4vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  subtitulo:
    fontFamily: "'Zen Kaku Gothic New', system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  entrada:
    fontFamily: "'Zen Kaku Gothic New', system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1rem + 0.5vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.45
  cuerpo:
    fontFamily: "'Zen Kaku Gothic New', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  dato:
    fontFamily: "'Martian Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
rounded:
  s: "4px"
  m: "8px"
  boton: "6px"
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
  ancho: "72rem"
shadows:
  tarjeta: "0 1px 0 rgba(255,240,220,.04) inset, 0 8px 24px -12px rgba(0,0,0,.6)"
  boton: "0 4px 0 var(--madera-canto), 0 8px 16px -6px rgba(0,0,0,.55)"
  boton-hundido: "0 1px 0 var(--madera-canto), 0 2px 6px -2px rgba(0,0,0,.5)"
  ticket: "0 10px 30px -10px rgba(0,0,0,.7)"
motion:
  rapido: "150ms"
  base: "200ms"
  lento: "250ms"
  salida: "cubic-bezier(.23, 1, .32, 1)"
  pulsar: "cubic-bezier(.3, .7, .4, 1)"
  vapor: "5.5s a 7s por voluta, lineal, en bucle"
components:
  boton-primario:
    backgroundColor: "{colors.laca}"
    textColor: "#ffffff"
    rounded: "{rounded.boton}"
    height: "52px"
    shadow: "{shadows.boton}"
  boton-secundario:
    textColor: "{colors.texto}"
    border: "1.5px solid {colors.texto-tenue}"
    rounded: "{rounded.boton}"
    height: "52px"
  tecla-maquina:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
    shadow: "{shadows.boton}"
  tecla-activa:
    border: "2px solid {colors.laca}"
  ticket:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
    typography: "{typography.dato}"
    shadow: "{shadows.ticket}"
  por-confirmar:
    textColor: "{colors.texto-tenue}"
    border: "1px dashed {colors.texto-tenue}"
    typography: "{typography.dato}"
    rounded: "{rounded.s}"
---

# Sistema de diseño: Take-chan Ramen (propuesta no oficial)

## Idea rectora
**La barra de una ramen-ya Iekei.** El sitio se lee como sentarse en la barra: madera oscura, papel washi, la cortina *noren* que separa las secciones y, para pedir, la máquina de tickets (食券機) que en Japón está en la entrada. Se elige el platillo con botones de máquina, sale un ticket de papel y ese ticket es el mensaje de WhatsApp.

Fecha de los tokens: 2026-11-15, antes de construir (dis-019). Al terminar se actualiza con lo que de verdad quedó.

## Cartas aplicadas
| Carta | Decisión |
|---|---|
| dis-019 (tokens antes de construir) | Este archivo y `src/styles.css` con variables antes de cualquier componente. Espaciado en múltiplos de 8 px (con 4 px como medio paso). |
| dis-023 (un solo momento animado) | Portada: el vapor del tazón. Todo lo demás, transiciones de 150 a 250 ms. En `/menu` el momento es la impresión del ticket. Con `prefers-reduced-motion` el vapor queda quieto y el ticket aparece sin deslizarse. |
| dis-050 (metáfora del negocio) | La máquina de tickets: teclas de washi con canto físico, ticket impreso. Secundarios: el *noren* como separador y el tazón como ícono. No se fuerza en todo: el texto y las sucursales son tipografía limpia. |
| dis-009 (un material) | Madera oscura (suelo y superficies) y papel washi (tickets, teclas y tarjetas). Grano sutil con un SVG de ruido en línea, menos de 2 KB. Nada de vidrio ni `backdrop-filter`. |
| dis-006 (monocromo y un acento) | Carbón cálido, madera y washi. Un acento: rojo laca, solo en el botón principal y en lo activo (tecla elegida, sección activa del índice). "Abierto ahora" no usa verde: punto lleno en washi; cerrado, punto hueco. Si el negocio da su color, sustituye a `--laca`. |
| dis-005 y dis-090 (palabra gigante y 6 claves) | TAKE-CHAN gigante en Dela Gothic One. Seis niveles: gigante, título, subtítulo, entrada, cuerpo y dato. |
| dis-054 (héroe de un mensaje) | "Ramen Iekei en Guadalajara. Caldo y fideo traídos de Japón." con el tazón. Sin carrusel. |
| dis-051 (un botón sólido) | `.boton-primario` laca, uno por pantalla: "Arma tu pedido". "Cómo llegar" en `.boton-secundario` (contorno). |
| dis-040 (bento) | Favoritos: Iekei clásico en la tarjeta grande (2x2) y extras (panceta, huevo, fideo extra) más chicos y distintos entre sí. |
| dis-044 (índice con el scroll) | En `/menu`, índice de categorías que marca la activa con IntersectionObserver y un signal. |
| dis-072 y dis-059 (configurar y apartar, objeto real) | Máquina de tickets en 3 pasos (ramen y extras, sucursal, hora). La tecla baja 3 px y pierde canto al presionarla (150 ms). |
| dis-073 (bajo compromiso) | "¿Primera vez? Empieza por el Iekei clásico", más chico que los favoritos. |
| dis-039 (microetiquetas con datos) | Martian Mono solo para horario, "abierto ahora", dirección, precios y folio del ticket. |
| dis-052 y dis-091 (pie real y consistencia) | Pie con las dos sucursales, horario, TikTok y mapa. Los mismos datos salen de `negocio.json` en pantalla y en el JSON-LD. |
| dis-020 (presentación) | Capturas en mockup de celular para la visita. |

## Color
- **Estrategia:** restringida. Suelo carbón y madera, superficies washi, un acento.
- **Escena física:** se abre en el celular a mediodía, a veces en la calle o dentro del local; la barra de una ramen-ya es oscura y cálida. Por eso fondo oscuro con texto claro, y washi claro para lo que se "imprime".
- **Contraste (AA):** `texto` sobre `carbon` 15.2:1; `texto-tenue` sobre `carbon` 8.6:1 y sobre `madera` 7.9:1; blanco sobre `laca` 5.6:1; `laca-texto` sobre `carbon` 5.5:1 y sobre `madera` 5.0:1; `tinta` sobre `washi` 14.5:1; `tinta-2` sobre `washi` 6.6:1 y sobre `washi-2` 5.7:1; `laca` sobre `washi` 4.6:1 (tecla activa).
- La selección de texto, el foco y el caret usan la paleta: selección washi sobre laca, anillo de foco de 2 px en `texto` con 2 px de separación.

## Tipografía
- **Dela Gothic One** (display, Latin y los pocos kanji y kana usados). Gruesa y de rótulo, diseñada en Japón, sin caricatura.
- **Zen Kaku Gothic New** (texto, 400 y 700). Gótica japonesa con buena Latin.
- **Martian Mono** (datos, 400 y 500).
- Subconjuntos woff2 autohospedados con `herramientas/fuentes.mjs` (Latin, acentos y 家系ラーメン食券機のれん): unos 47 KB en total.
- Japonés permitido: 家系ラーメン (en el héroe, como apoyo), 食券 (en la máquina) y のれん solo si nombra el separador. Siempre con `lang="ja"`.

## Espaciado y forma
- Escala de 8 px; más espacio arriba de un título que abajo.
- Radios pequeños (4, 6 y 8 px): madera y papel cortados, no píldoras.
- Sombras con desplazamiento y desenfoque suave; el canto de las teclas es la única sombra con desplazamiento marcado, porque imita un objeto real.

## Movimiento
- Un momento por página. Portada: vapor (3 volutas SVG que suben y se desvanecen, `transform` y `opacity`, 5.5 a 7 s). Menú: el ticket sale de la ranura (250 ms, `salida`).
- Transiciones de interfaz de 150 a 250 ms con `salida`.
- `prefers-reduced-motion: reduce`: sin vapor en movimiento ni deslizamientos; solo cambios de opacidad.

## Datos por confirmar
Etiqueta `.por-confirmar` en mono con borde punteado tenue. Visible pero discreta. Se usa en precios, nombres de platillos propuestos, sucursal de la Americana y cualquier campo con `confirmado: false`.

## Lo que no se usa
Carruseles, 3D, partículas, vidrio, cursores especiales, ASCII, fotos de TikTok, más de un acento, más de un momento animado, emojis.
