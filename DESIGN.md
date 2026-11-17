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

## Lo que quedó construido (2026-11-16)
Diferencias con los tokens de arriba, después de las revisiones de impeccable, design-taste-frontend y better-typography:
- **Héroe:** en escritorio la foto ocupa la derecha a sangre y se funde con el sumi hacia el texto; en celular ocupa la parte de arriba. Sin rótulo encima del título; 家系 a `clamp(5.75rem, 26vw, 13rem)`.
- **Máquina de tickets (券売機):** cuerpo de esmalte oscuro, letrero washi iluminado, teclas claras tipo botón iluminado con foto, nombre y precio LED ámbar; columna de cobro (千円札, 硬貨, 合計, 返却, おつり) y boca de salida 発券口. Sombras difusas, sin canto duro.
- **Noren:** tela washi con 家系ラーメン en sumi, una sola vez, al cierre de la portada; se mece al pasar el cursor.
- **WhatsApp en demostración:** el mensaje aparece en línea como globo bajo el botón, sin ventana modal.
- **Mono:** solo horario, estado y precios; las direcciones van en Geist.
- **Pesos cargados:** Shippori 700 y 800, Geist 400, 500 y 600 (las negritas usan 600), Geist Mono 500. El subconjunto japonés se arma solo con los caracteres de `sitio/src`.
- **Sucursal Americana:** solo la marca "por confirmar"; sin estado abierto o cerrado, sin horario supuesto y sin JSON-LD.

## Sistema de movimiento (PLAN_MOVIMIENTO, 2026-11-16)
dis-023 se reinterpreta: **un momento firma por página** (la noren que se abre al entrar; el ticket que se imprime y se corta en `/menu`) dentro de un sistema de movimiento con los mismos tokens.
- **Duraciones:** `--t-1` 120 ms, `--t-2` 200 ms, `--t-3` 320 ms, `--t-4` 560 ms, `--t-5` 900 ms.
- **Curvas:** `--ease-out: cubic-bezier(.22, 1, .36, 1)` (entradas), `--ease-in-out: cubic-bezier(.65, 0, .35, 1)` (cortinas y transiciones), `--ease-tela: cubic-bezier(.33, 1.3, .5, 1)` (rebote leve de la tela). En GSAP: `expo.out` y `back.out(1.3)`.
- **Base:** Lenis (`lerp` 0.1) y GSAP con ScrollTrigger y SplitText, cargados solo en el navegador cuando la página ya terminó de cargar (`servicios/movimiento.ts`). Nada de esto existe en el prerender.
- **Reglas:** solo `transform`, `opacity` y `clip-path`; el contenido es visible por defecto; con `prefers-reduced-motion` no se carga Lenis ni GSAP y todo queda quieto.

### Lo que quedó construido del movimiento (M0 a M8)
- **Intro de la noren** (solo la primera visita, CSS en `index.html`): 家系 se dibuja y se entinta, se desvanece y la noren se abre en dos mitades con `--ease-tela`; 1.2 s, botón "Saltar".
- **Entre páginas:** telón de noren (`componentes/telon.ts`): tres paños índigo caen escalonados (60 ms), la página cambia debajo y se separan hacia los lados; unos 600 ms. En escritorio, la foto del platillo tocado en el bento vuela a su tecla con View Transitions.
- **Portada:** entrada del héroe en CSS (foto 1.08 → 1, titular por líneas, trazo de 家系), paralaje del héroe, washi rasgado, títulos por líneas (SplitText), cifra de Google que rueda de 4.0 a 4.8, bento con paralaje del puntero, medidor del tazón por capas, sucursales escalonadas y noren índigo que se mece y se abre al menú.
- **Menú:** encendido de la máquina, tecla que se hunde y rebota, miniatura que vuela al pedido, LED en odómetro, marcos deslizantes (índice y al gusto), ticket que sale en tres jalones con la luz de 発券口 y se corta al enviarlo; hoja inferior en celular.
- **Reglas medidas:** CLS 0 (fuentes de respaldo con `size-adjust` y alto reservado en el héroe), 59–60 fps al hacer scroll, vapor sin recálculo de layout y en pausa fuera de vista, bucles limitados.

## Nivel 3 (PLAN_NIVEL_3, 2026-11-16)
- **Una sola mirada fotográfica:** todas las fotos pasan por `herramientas/gradear.mjs` (balance cálido, negros profundos, saturación contenida y capa ámbar) antes de convertirse. Encima, en `app-foto`, van una viñeta y un grano de película (PNG de 2 KB en `overlay`). Una foto nueva entra con el mismo tratamiento sin tocar nada más.
- **Rótulo "Imagen ilustrativa":** siempre arriba a la derecha, mismo tamaño y estilo. Abajo van los textos de tarjetas y héroe.
- **Mapas en lugar de fotos de lugares:** `herramientas/mapas.mjs` dibuja las calles de OpenStreetMap en tonos de sumi, con "© OpenStreetMap" visible. El sello marca el punto y cae una vez.
- **Sello hanko 家系:** es el logo de la propuesta y el único rojo junto al botón principal. Es un raster con poros de tinta, hecho en `herramientas/sello.mjs` con la fuente real. Aparece en el favicon, el héroe, el pie y estampado en el ticket.
- **Títulos de sección:** `.t-seccion`, hasta 64 px. El kanji va vertical al lado (`.con-kanji` + `.kanji-v`), nunca encima como antetítulo.
- **Ritmo:** cada sección tiene otra composición. Qué es el Iekei lleva japonés vertical y la foto hasta el borde; el 4.8 tiene sección propia; "Para pedir" lleva el bento a sangre; hay una pausa a sangre con una frase; Cómo se hace muestra el tazón visto desde arriba; luego TikTok con fachada, Sucursales con mapas y la noren al cierre.
- **Noren índigo:** el azul (#1e2b45) queda fuera de la paleta sumi, washi y bermellón a propósito, porque es el color tradicional de la noren. Solo aparece en la tela (intro, cierre y telón).
- **Fuentes:** sin precargas. En Edge las precargas bloquean el primer pintado: con ellas el LCP pasaba de 2.5 s y sin ellas queda en 1 a 2 s. Las fuentes de respaldo tienen `size-adjust` y `ascent-override`/`descent-override` medidos, y las medidas del héroe no dependen de la fuente, así que el CLS queda en menos de 0.002.
- **Menú:** máquina o lista (se recuerda en el navegador), detalle de tecla en un `<dialog>` con View Transition, y la sugerencia de huevo después del primer ramen, que desaparece al imprimir.

## Nivel 4 (PLAN_NIVEL_4, 2026-11-16): listo para ser el sitio real
- **Modo:** `src/entornos/` decide propuesta u oficial; ningún componente pregunta por el dominio o el número, solo por `PROPUESTA`/`OFICIAL` y `ENTORNO`.
- **Idiomas:** el texto fuente es el español de las plantillas; `t()` lo traduce con `i18n/en.ts`, que se carga solo en `/en`. El japonés no se traduce. El mensaje de WhatsApp siempre va en español (lo lee el local).
- **Datos vivos:** la hoja de Google cambia los mismos objetos de `MENU` y `SUCURSALES` y sube `VERSION_DATOS`; las plantillas que leen datos declaran `@let datos = version()` para redibujarse.
- **Agotado 売切:** la tecla se apaga en gris con un letrero bermellón girado, como el sello; no se puede pedir.
- **Banda de aviso:** ámbar LED (el mismo de los precios), nunca bermellón: el rojo sigue siendo solo del botón principal y el sello.
- **/links:** página estática fuera de Angular, para pesar menos de 150 KB.
- **Precarga:** solo el menú, 3 s después de la carga; el resto se baja al visitarlo.
