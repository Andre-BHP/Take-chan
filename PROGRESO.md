# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 20:23 (hora de Guadalajara)

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
- [ ] N8. Reloj en vivo, TikTok bajo demanda, contraste AA y detalles
- [ ] N9. Guion de fotos para André
- [ ] N10. Pruebas, pulido, videos y reporte

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
**N7.** Menú que vende. Después del primer ramen aparece "¿Le agregas huevo marinado? +$25", con Agregar y No, gracias (en celular flota sobre la barra; en escritorio va en Tu pedido). Cada tecla tiene un botón "i", y mantenerla presionada abre su detalle: la foto crece con View Transition y muestra la descripción, el precio y "Agregar"; se cierra con Esc o tocando fuera, y la presión larga ya no agrega. Interruptor Máquina / Lista: la lista es compacta y sirve para lector de pantalla; la elección se recuerda en el navegador. Los extras (chashu, huevo, fideo, nori) ya no repiten las fotos de los tazones: cada uno tiene su recorte del ingrediente. El sello en el ticket quedó en N4. Recorrido nuevo `herramientas/menu-estados.mjs`: axe sin violaciones en sugerencia, detalle y lista, a 390 y 1440.

## Sigue
N8: reloj vivo, TikTok bajo demanda, etiqueta en el bento, contraste AA, rótulos y estado vacío del pedido.

## Capturas más recientes
| Sugerencia 390 | Detalle 390 | Lista 390 | Detalle 1440 | Video |
|---|---|---|---|---|
| ![sugerencia](entregables/avances/2026-11-16_paso-N7_sugerencia_390.png) | ![detalle](entregables/avances/2026-11-16_paso-N7_detalle_390.png) | ![lista](entregables/avances/2026-11-16_paso-N7_lista_390.png) | ![detalle 1440](entregables/avances/2026-11-16_paso-N7_detalle_1440.png) | [GIF 390](entregables/avances/video/2026-11-16_N7_vende_390.gif) · [MP4 1440](entregables/avances/video/2026-11-16_N7_vende_1440.mp4) |
