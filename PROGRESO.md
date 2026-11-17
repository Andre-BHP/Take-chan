# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-17 13:21 (hora de Guadalajara)

## Rediseño (2026-11-15)
André revisó la primera versión: "quedó muy feo y muy mal". Este rediseño cambia la dirección a "una ramen-ya de Yokohama de noche": fotos de ejemplo rotuladas, negro sumi y papel washi, 家系 vertical y un solo acento bermellón.

- [x] R0. Capturas de "antes"
- [x] R1. `DESIGN.md` nuevo y wireframe gris de inicio y menú
- [x] R2. Fotos de Unsplash (AVIF y WebP en 3 tamaños, blurhash) y créditos
- [x] R3. Tipografías, tokens y portada nueva
- [x] R4. `/menu` con una máquina de tickets de verdad
- [x] R5. Sucursales y pie
- [x] R6. Revisión de impeccable y design-taste-frontend, y correcciones
- [x] R7. Pruebas, comparativa antes y después, mockups de visita
- [x] R8. Reporte

## QR con identidad (2026-11-17)
Regla de André: todo QR usa las cartas de Gambit dis-094 y dis-081.

- [x] Q1. QR de tinta con el sello, tent card con ticket 食券, QR animado en /menu y pruebas de escaneo

## Nivel 4 (2026-11-16)
Plan de Arthemis: todo lo que no depende del negocio, para publicar el sitio oficial en menos de una hora.

- [x] P0. Interruptor de modo, propuesta u oficial
- [x] P1. Vista previa al compartir y `/links`
- [x] P2. Datos editables desde CSV, aviso y agotado 売切
- [x] P3. Preguntas frecuentes y SEO local
- [x] P4. Versión en inglés
- [x] P5. PWA y menú sin conexión
- [x] P6. Impresos con QR
- [x] P7. Estadísticas preparadas y plantilla de reporte
- [x] P8. Privacidad, accesibilidad y créditos
- [x] P9. Calidad final, guías probadas y reporte

## Nivel 3 (2026-11-16)
Plan de Arthemis para pasar de "bien hecho" a "de premio".

- [x] N0. Crítica y diferencias con el plan (`entregables/N0_critica.md`)
- [x] N1. Una sola mirada fotográfica: tratamiento de color, grano y viñeta
- [x] N2. Mapas propios de OpenStreetMap en lugar de fotos de las sucursales
- [x] N3. "Cómo se hace un Iekei": tazón visto desde arriba y pasos 一二三四
- [x] N4. Sello hanko de la propuesta
- [x] N5. Héroe legible y saludo いらっしゃいませ
- [x] N6. Ritmo editorial: títulos, 4.8 con sección propia y pausa a sangre
- [x] N7. Menú que vende: sugerencia, detalle de tecla y vista de lista
- [x] N8. Reloj en vivo, TikTok bajo demanda, contraste AA y detalles
- [x] N9. Guion de fotos para André
- [x] N10. Pruebas, pulido, videos y reporte

## Movimiento (2026-11-16)
André: "mejor animación, más transiciones, mejor diseño, mejor todo". Metáfora: entrar a la ramen-ya apartando la noren. Cada paso con video (MP4) y GIF en `entregables/avances/video/`.

- [x] M0. Tokens de movimiento, Lenis y GSAP (solo en navegador), reduced-motion y grabación de video
- [x] M1. Intro de la noren y transición entre páginas
- [x] M2. Héroe a sangre, titular por líneas, 家系 con trazo y paralaje
- [x] M3. Washi rasgado, "Qué es el Iekei", prueba social y bento con la transición hacia `/menu`
- [x] M4. Medidor del tazón en "Cómo se hace", sucursales y noren final de tela
- [x] M5. `/menu` física: encendido, vuelo al pedido, odómetro, indicadores e impresión y corte del ticket
- [x] M6. Revisiones de impeccable y design-taste-frontend
- [x] M7. Pruebas: axe, 360 px, peso, LCP con intro, CLS 0, 60 fps, reduced-motion
- [x] M8. Videos, GIF, capturas de visita y reporte

## Primera versión (pasos 0 a 9, terminada)
Repositorio, Pages, datos, inicio, máquina de tickets, sucursales con JSON-LD, pruebas y lista para el negocio. Capturas en `entregables/avances/antes/`.

## Último paso
**Q1.** QR con la identidad (dis-094): módulos de tinta redondeados que se funden, ojos sumi con centro bermellón, sello 家系 al centro, corrección H, fondo claro y zona de silencio de 4 módulos (`sitio/scripts/qr-tinta.mjs`). Tent card con el QR impreso dentro de un ticket 食券 que sale de la ranura 発券口; calcomanía y tarjeta regeneradas. QR animado en /menu (dis-081, solo escritorio): "Pídelo desde tu celular" se imprime fila por fila en 1.18 s, quieto con movimiento reducido y oculto en celular. Escaneo automático con jsQR (`herramientas/escaneo.mjs`): 120 de 120 lecturas con la URL exacta a 2, 3 y 5 cm y a tamaño real, a 10 y 15 cm, limpio, borroso y deslavado; `entregables/impresos/PRUEBA_ESCANEO.md` tiene la tabla para la prueba con celular. Las URL salen del modo (`impresos.mjs --modo oficial`) y `GUIA_PUBLICAR.md` pide regenerar e imprimir los QR con el dominio final. Los parámetros pasaron a `?ref=` (QR más chicos). Todas las pruebas en orden.

## Sigue
Probar los QR impresos con un celular real y anotarlo en PRUEBA_ESCANEO.md. Pendientes del negocio: WhatsApp, dominio, hoja, GoatCounter, datos legales y fotos reales.

## Capturas más recientes
| Antes y después | QR web en /menu | Animación |
|---|---|---|
| ![impresos](entregables/avances/2026-11-17_paso-QR_antes-despues.png) | ![qr web](entregables/avances/2026-11-17_paso-QR_qr-web_1440.png) | [GIF](entregables/avances/video/2026-11-17_QR_qr_1440.gif) |
