---
name: Take-chan Ramen (propuesta)
description: Barra de una ramen-ya Iekei. Madera oscura, papel washi, cortina noren, máquina de tickets 食券機 y un solo acento rojo laca.
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
    fontSize: "clamp(3.5rem, 21vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  gigante-ancho:
    fontFamily: "'Dela Gothic One', 'Arial Black', sans-serif"
    fontSize: "clamp(5rem, 11.4vw, 13.5rem)"
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
    lineHeight: 1.5
    letterSpacing: "-0.01em"
    fontFeature: "tnum"
  dato-chico:
    fontFamily: "'Martian Mono', ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  s: "4px"
  boton: "6px"
  m: "8px"
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
  ancho-heroe: "96rem"
components:
  boton-primario:
    backgroundColor: "{colors.laca}"
    textColor: "#ffffff"
    rounded: "{rounded.boton}"
    padding: "0 24px"
    height: "52px"
  boton-primario-hover:
    backgroundColor: "{colors.laca-hundida}"
  boton-primario-desactivado:
    backgroundColor: "{colors.madera-veta}"
    textColor: "{colors.texto-tenue}"
  boton-secundario:
    textColor: "{colors.texto}"
    rounded: "{rounded.boton}"
    padding: "0 24px"
    height: "52px"
  tecla-maquina:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
    padding: "16px 48px 16px 16px"
    height: "76px"
  tecla-apagada:
    backgroundColor: "{colors.madera-veta}"
    textColor: "{colors.texto-tenue}"
  segmentos:
    backgroundColor: "{colors.madera-canto}"
    rounded: "{rounded.boton}"
    padding: "4px"
  segmento-activo:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.s}"
    height: "44px"
  ticket:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
    typography: "{typography.dato}"
    padding: "24px 16px 32px"
  tarjeta-madera:
    backgroundColor: "{colors.madera}"
    textColor: "{colors.texto}"
    rounded: "{rounded.m}"
    padding: "24px"
  hoja-washi:
    backgroundColor: "{colors.washi}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.m}"
    padding: "24px"
  pano-noren:
    backgroundColor: "{colors.madera-canto}"
    textColor: "{colors.washi}"
    rounded: "0 0 6px 6px"
    height: "clamp(64px, 9vw, 112px)"
  campo:
    backgroundColor: "{colors.carbon}"
    textColor: "{colors.texto}"
    rounded: "{rounded.s}"
    padding: "0 16px"
    height: "48px"
  por-confirmar:
    textColor: "{colors.texto-tenue}"
    typography: "{typography.dato-chico}"
    rounded: "{rounded.s}"
    padding: "2px 8px"
---

# Design System: Take-chan Ramen (propuesta no oficial)

## Overview

**Creative North Star: "La barra de una ramen-ya Iekei"**

El sitio se lee como sentarse en la barra: madera oscura con veta como suelo, papel washi para todo lo que se "imprime" o se lee de cerca, la cortina *noren* que separa la portada del pie y, para pedir, la máquina de tickets (食券機) que en Japón está en la entrada. Se elige el platillo con teclas de máquina, sale un ticket de papel por una ranura y ese ticket es el mensaje de WhatsApp (en modo demostración).

La densidad es baja en la portada (una palabra gigante, un tazón, una frase, dos botones) y media en `/menu`, que es una herramienta: índice, teclas, panel del pedido. El texto y las sucursales son tipografía limpia; la metáfora vive en piezas concretas (noren, teclas, ticket), no en todo.

Documentado sobre lo construido el 2026-11-15. Ya no es el plan de tokens previo: donde el plan y el código difieren, manda el código.

**Key Characteristics:**
- Suelo carbón y madera con grano SVG en línea; superficies washi con fibra.
- Un solo acento: rojo laca, en el botón principal y en lo activo.
- TAKE-CHAN gigante en Dela Gothic One; mono solo para datos.
- Profundidad física: teclas con canto que se hunden 3 px, ticket con sombra y borde dentado.
- Un momento animado por página: vapor en la portada, impresión del ticket en el menú.

## Cartas aplicadas
| Carta | Decisión (como quedó construida) |
|---|---|
| dis-019 (tokens antes de construir) | Los tokens se fijaron antes de los componentes y viven en `sitio/src/styles.css`; este archivo se reescribió después con lo que quedó. Espaciado en múltiplos de 8 px, con 4 px como medio paso. |
| dis-023 (un solo momento animado) | Portada: el vapor del tazón (3 volutas, 5.6 a 7 s, en bucle). `/menu`: la impresión del ticket (420 ms, `clip-path` y 16 px de caída, curva `salida`). Todo lo demás, 150 a 250 ms. Con `prefers-reduced-motion` el vapor queda quieto y el ticket aparece sin animación. |
| dis-050 (metáfora del negocio) | La máquina de tickets: teclas washi con canto físico, rótulo 食券 en madera, ranura y ticket impreso. Secundario: el *noren* de 6 paños como separador sobre el pie, y el tazón ilustrado. El texto y las sucursales no se disfrazan. |
| dis-009 (un material) | Madera oscura (suelo, tarjetas, pie, máquina) y papel washi (teclas, ticket, hoja "Qué es el Iekei", diálogo). Grano y fibra con SVG de ruido en línea, menos de 1 KB cada uno. Nada de vidrio ni `backdrop-filter`. |
| dis-006 (monocromo y un acento) | Carbón cálido, madera y washi. Un acento: rojo laca en el botón principal, la tecla elegida, el contador de la tecla, el subrayado de la sección activa de la cabecera y el punto del índice. "Abierto ahora" no usa verde: punto lleno; cerrado, punto hueco. Si el negocio da su color, sustituye a `--laca`. |
| dis-005 y dis-090 (palabra gigante y 6 claves) | TAKE-CHAN gigante en Dela Gothic One: dos líneas en celular, una sola línea a todo el ancho desde 900 px. Seis claves: gigante, título, subtítulo, entrada, cuerpo y dato. |
| dis-054 (héroe de un mensaje) | "Ramen Iekei en Guadalajara. Caldo y fideo traídos de Japón." con el tazón y su vapor. Sin carrusel y sin rótulo encima del título. |
| dis-051 (un botón sólido) | `.boton-primario` laca, uno por pantalla: "Arma tu pedido" en portada, "Imprimir ticket" en el menú, que al imprimir se reemplaza por "Enviar por WhatsApp" (demostración). "Cómo llegar" y "Pedir este" en `.boton-secundario` (contorno). |
| dis-040 (bento) | Favoritos: Iekei clásico en la celda grande (2x2) y panceta (washi), huevo (veta) y fideo (madera, a lo ancho) distintos entre sí. |
| dis-044 (índice con el scroll) | En `/menu`, índice de categorías fijo (barra horizontal en celular, columna a la izquierda desde 1000 px) que marca la activa con un punto `laca-texto`, vía IntersectionObserver y un signal. |
| dis-072 y dis-059 (configurar y apartar, objeto real) | Máquina en pasos: ramen y extras en teclas, "Al gusto" en control segmentado de 3 opciones, sucursal y hora en el panel. La tecla baja 3 px y pierde canto al presionarla (150 ms). |
| dis-073 (bajo compromiso) | "¿Primera vez? Empieza por el Iekei clásico" en hoja `washi-2`, más chica que el bento y alineada a la derecha. |
| dis-039 (microetiquetas con datos) | Martian Mono solo para horario, "abierto ahora", dirección, precios, sub-líneas de tecla, folio y contenido del ticket, y etiquetas "por confirmar". |
| dis-052 y dis-091 (pie real y consistencia) | Pie con las dos sucursales, horario, TikTok y mapa, desde `negocio.json`. El JSON-LD sale de los mismos datos y solo para sucursales confirmadas: no se afirma en datos estructurados lo no verificado. |
| dis-020 (presentación) | Capturas en mockup de celular para la visita. |

## Colors

Restringida: suelo carbón y madera, superficies washi, un acento rojo laca. La barra de una ramen-ya es oscura y cálida; lo que se imprime es claro.

### Primary
- **Rojo laca** (`laca`): botón principal, borde de la tecla elegida, contador de la tecla, subrayado del enlace activo de la cabecera, `accent-color` de radios y fondo de la selección de texto. Blanco sobre laca 5.6:1.
- **Laca hundida** (`laca-hundida`): hover del botón principal. Blanco encima 7.4:1.
- **Laca para texto** (`laca-texto`): versión clara del acento sobre fondo oscuro: punto del índice activo, borde de la opción elegida, caret. 5.4:1 sobre carbón, 5.0:1 sobre madera.

### Neutral
- **Carbón cálido** (`carbon`): fondo de página con grano; fondo de campos de formulario; índice fijo en celular.
- **Madera** (`madera`): tarjetas de sucursal, celdas del bento, máquina, panel del pedido, pie, aviso de prototipo.
- **Veta** (`madera-veta`): celda del huevo, barra del noren, tecla apagada y botón principal desactivado.
- **Canto** (`madera-canto`): el canto físico de teclas y botón principal, paños del noren, rótulo de la máquina, ranura, pista del control segmentado.
- **Borde** (`borde`): líneas de 1 px entre superficies de madera y bajo la cabecera.
- **Texto** (`texto`): texto sobre madera y carbón, 15.2:1 sobre carbón; color del anillo de foco.
- **Texto tenue** (`texto-tenue`): secundario, navegación en reposo, "por confirmar"; 8.6:1 sobre carbón, 7.9:1 sobre madera.
- **Washi** (`washi`): teclas, ticket, hoja "Qué es el Iekei", celda de panceta, segmento activo, diálogo, barra del pedido en celular; letras del noren (16:1 sobre canto).
- **Washi 2** (`washi-2`): hoja "Primera vez" y caja del mensaje en el diálogo.
- **Fibra** (`washi-fibra`): líneas sobre washi y hover de las teclas.
- **Tinta** (`tinta`): texto sobre washi, 14.5:1.
- **Tinta 2** (`tinta-2`): secundario sobre washi (6.6:1) y washi-2 (5.7:1); "por confirmar" sobre washi.

### Named Rules
**The Un Solo Rojo Rule.** El rojo laca marca acción o estado activo y nada más; ningún fondo de sección, título ni ilustración lo usa como decoración.

**The Sin Verde Rule.** El estado abierto/cerrado se dice con un punto lleno o hueco en el color del texto, nunca con verde ni rojo semáforo.

## Typography

**Display Font:** Dela Gothic One (con Arial Black)
**Body Font:** Zen Kaku Gothic New 400 y 700 (con system-ui, Segoe UI)
**Label/Mono Font:** Martian Mono 400 y 500 (con ui-monospace, Cascadia Mono, Consolas)

**Character:** Rótulo grueso diseñado en Japón para la marca y los kanji, gótica japonesa sobria para leer, mono de máquina para lo que se imprime o se cuenta. Subconjuntos woff2 autohospedados (`herramientas/fuentes.mjs`), Dela Gothic One y Zen Kaku 400 precargadas, `font-display: swap`.

### Hierarchy
- **Gigante** (400, `gigante` en celular en dos líneas; `gigante-ancho` desde 900 px en una línea sin cortes, 0.86): solo TAKE-CHAN en el héroe. En sucursal, el nombre usa la misma voz a menor tamaño (hasta 6rem, 0.9).
- **Título** (400 display, `titulo`, 1.05): títulos de sección y nombre del platillo protagonista.
- **Subtítulo** (700 sans, 1.25rem): categorías del menú, celdas chicas del bento, columnas del pie.
- **Entrada** (400 sans, `entrada`, 1.45): la frase del héroe y la entrada de `/menu`, de 30 a 46ch.
- **Cuerpo** (400 sans, 1rem/1.6): texto corrido, hasta 70ch.
- **Dato** (400 mono, 0.8125rem, cifras tabulares): horarios, direcciones, precios, ticket. **Dato chico** (0.6875rem): sub-línea de tecla, "por confirmar", hueco de foto, notas del ticket.

### Named Rules
**The Mono Es Dato Rule.** Martian Mono solo lleva información que se lee como dato (hora, dirección, precio, folio, estado de confirmación). Nunca títulos ni párrafos.

**The Japonés Con Sentido Rule.** Japonés solo donde nombra algo real: 家系 y 家 en la explicación del Iekei, 家系ラーメン en el noren y el pie, 食券 en el rótulo de la máquina y en el ticket. Siempre con `lang="ja"`; nunca como rótulo decorativo sobre un título.

## Layout

Columna central `.envoltura` de 72rem con margen lateral fluido (`gutter`). El héroe es la excepción: su envoltura crece a 96rem desde 900 px para que TAKE-CHAN ocupe el ancho en una sola línea y el tazón quede a la derecha del texto, montado 90 a 150 px sobre la palabra. En celular el orden es palabra (dos líneas), tazón alineado a la derecha y montado 64 px, texto.

Ritmo vertical en la escala de 8 px: secciones separadas por 96 px (`e-8`), hoja washi con 64 a 96 px de relleno, más espacio arriba de un título que abajo. Cortes: 720 px (bento de 3 columnas, sucursales a 2), 900 px (héroe y sucursal a dos columnas), 1000 px (`/menu` a tres columnas: índice 10rem, máquina, panel 22rem fijo). Sin scroll horizontal en 360 px: el `body` recorta en x y el héroe también.

La cabecera es fija (aviso de prototipo y navegación, carbón al 94%). En `/menu` en celular, una barra washi flotante abajo lleva al pedido y se oculta cuando el panel está a la vista.

## Elevation & Depth

Profundidad física, no flotante. Las superficies de madera se separan con borde de 1 px y una sombra suave hacia abajo; lo que es un objeto real (tecla, botón principal, ticket) tiene sombra de objeto. Sin vidrio ni desenfoque de fondo.

### Shadow Vocabulary
- **Tarjeta** (`--sombra-tarjeta`): celdas del bento y máquina; filo de luz interior de 4% y caída suave.
- **Canto** (`--sombra-boton`): teclas y botón principal; 4 px de canto en `madera-canto` más caída suave. Es el borde físico de una tecla de máquina.
- **Canto hundido** (`--sombra-boton-hundido`): estado presionado; el canto baja a 1 px y la pieza baja 3 px.
- **Ticket** (`--sombra-ticket`): ticket, diálogo de demostración y barra del pedido en celular: papel que se levanta.
- **Hundido** (interior): ranura de la máquina y paños del noren reciben sombra interior arriba, como lo que queda bajo una barra.

### Named Rules
**The Canto Solo En Teclas Rule.** La sombra con desplazamiento marcado (canto) es exclusiva de lo que se presiona como tecla de máquina: botón principal y teclas. Tarjetas, hojas y avisos no la usan.

## Shapes

Madera y papel cortados, no píldoras: radios de 4 px (campos, etiquetas, segmentos), 6 px (botones, teclas, pista segmentada, puntas de los paños) y 8 px (tarjetas, hojas, máquina). Las únicas formas redondas son puntos de estado, contadores y la ranura. El ticket no tiene radio: su borde inferior es dentado con una máscara de círculos de 6 px cada 14 px, papel arrancado de la máquina. Lo tentativo se marca con borde punteado (sucursal de la Americana, aviso de sucursal tentativa, hueco de foto, "por confirmar").

## Components

### Buttons
- **Shape:** esquinas de 6 px, 52 px de alto, 24 px de relleno lateral, sans 700.
- **Primary:** laca con texto blanco y canto; uno por pantalla.
- **Hover / Focus:** hover a `laca-hundida`; al presionar baja 3 px y el canto se reduce (150 ms, `pulsar`). Foco: anillo de 2 px en `texto` con 2 px de separación.
- **Secondary:** contorno de 1.5 px en `texto-tenue`, fondo transparente; hover a `texto`. Sobre washi el contorno pasa a `tinta-2` y el texto a `tinta`.
- **Desactivado:** veta con texto tenue, sin canto.

### Chips
- **Por confirmar:** mono 0.6875rem, borde punteado de 1 px en el color del texto, radio 4 px; `texto-tenue` sobre madera, `tinta-2` sobre washi. Discreto pero siempre visible junto al dato que califica.
- **Estado:** mono con punto de 8 px; lleno si está abierto, hueco si está cerrado.

### Cards / Containers
- **Corner Style:** 8 px.
- **Background:** madera con borde (sucursal, celda protagonista, fideo, panel, máquina), veta (huevo), washi con fibra (panceta, "Primera vez" en washi-2).
- **Shadow Strategy:** sombra de tarjeta en celdas del bento y máquina; el resto solo borde.
- **Border:** 1 px `borde`; punteado `texto-tenue` y sin fondo para lo tentativo.
- **Internal Padding:** 24 px; 16 px en celdas chicas en celular.

### Inputs / Fields
- **Style:** fondo carbón, borde de 1.5 px `borde`, radio 4 px, 48 px de alto.
- **Focus:** el borde pasa a `texto`, sin anillo extra.
- **Opción (radio en tarjeta):** borde 1 px `borde`, radio 4 px; elegida con borde `laca-texto` y radio en `accent-color` laca.

### Navigation
- **Cabecera:** aviso fijo "Propuesta no oficial…" en franja de madera (sans 500, 0.75rem), luego marca TAKE-CHAN RAMEN en display 1.125rem ("RAMEN" en tenue, se oculta bajo 400 px) y enlaces sans 700 de 44 px. Reposo tenue, hover texto, activo con subrayado interior de 2 px en laca.
- **Índice del menú:** mismos enlaces tenues de 44 px con un punto de 6 px que se llena de `laca-texto` en la categoría activa; horizontal con desplazamiento en celular, columna fija desde 1000 px.

### Tecla de máquina
Washi con fibra, texto tinta, nombre sans 700 y sub-línea mono chica, 76 px de alto mínimo (96 px y ancho completo para el primer ramen). Canto de botón; hover con borde `washi-fibra`; presionada baja 3 px; elegida con borde de 2 px laca y contador redondo laca con cifra mono blanca arriba a la derecha. Apagada: veta con borde interior y texto tenue.

### Control segmentado (Al gusto)
Pista de canto con 4 px de relleno y tres segmentos iguales de 44 px; el elegido se vuelve washi con texto tinta (200 ms). Radios nativos invisibles encima; foco visible sobre el segmento.

### Ticket
Rótulo 食券 en franja de canto sobre la máquina; abajo, una ranura hundida de la que sale el ticket: washi con fibra, mono 0.8125rem, marca en display, líneas separadas por raya punteada `tinta-2`, total en 500, notas de "al gusto" en dato chico. Borde inferior dentado por máscara. Se imprime en 420 ms con `clip-path` de arriba abajo; es el momento animado de `/menu`.

### Noren
Separador decorativo sobre el pie (`aria-hidden`): barra de veta de 8 px con sombra y seis paños de tela oscura (canto con fibra, borde de 1 px, puntas de 6 px, sombra interior arriba), separados 3 px, cada uno con un carácter de 家系ラーメン en Dela Gothic One washi. Alto de 64 a 112 px.

### Hueco de foto
Lugar reservado para la foto que se tomará en el local: borde punteado de 1.5 px, radio 4 px, ícono de cámara SVG de 24 px y texto en dato chico tenue. Nunca se rellena con fotos de terceros.

## Do's and Don'ts

### Do:
- **Do** tomar todo color, espacio, radio, sombra y curva de las variables de `sitio/src/styles.css`.
- **Do** usar un solo `boton-primario` por pantalla; lo demás en contorno.
- **Do** marcar todo dato no confirmado con la etiqueta "por confirmar" junto al dato, en mono chico y borde punteado.
- **Do** limitar el movimiento a un momento por página (vapor en portada, impresión del ticket en menú) y a transiciones de 150 a 250 ms con `salida` o `pulsar`; respetar `prefers-reduced-motion`.
- **Do** dar a lo tentativo borde punteado y fondo transparente.
- **Do** mantener objetivos táctiles de 44 px o más.

### Don't:
- **Don't** usar vidrio, `backdrop-filter`, carruseles, 3D, partículas ni cursores especiales.
- **Don't** introducir un segundo color de acento ni verde para "abierto".
- **Don't** poner el canto (sombra de 4 px) fuera de teclas y botón principal.
- **Don't** usar fotos de TikTok ni de directorios; las ilustraciones y huecos rotulados ocupan su lugar.
- **Don't** usar tipografías caricaturescas "estilo oriental" ni japonés decorativo sin significado.
- **Don't** usar emojis.
