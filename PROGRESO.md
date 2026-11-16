# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 16:30 (hora de Guadalajara)

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
- [ ] N3. "Cómo se hace un Iekei": tazón visto desde arriba y pasos 一二三四
- [ ] N4. Sello hanko de la propuesta
- [ ] N5. Héroe legible y saludo いらっしゃいませ
- [ ] N6. Ritmo editorial: títulos, 4.8 con sección propia y pausa a sangre
- [ ] N7. Menú que vende: sugerencia, detalle de tecla y vista de lista
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
**N2.** Mapas propios con datos de OpenStreetMap (`herramientas/mapas.mjs`): calles en tonos de sumi, las calles clave en claro con su nombre y "© OpenStreetMap" con enlace. Tlaquepaque marca la esquina real de Calzada Córdoba y Niños Héroes, sacada de los nodos de OSM. La Americana va como "Ubicación aproximada", estimada por la numeración vecina de Prisciliano Sánchez. El sello 家 en bermellón cae una vez al entrar en vista (quieto con movimiento reducido). Reemplazan las fotos en las tarjetas de la portada y en la cabeza de cada sucursal; la foto de la barra se quitó. axe limpio, sin scroll a 360, portada de 415 KB.

## Sigue
N3: "Cómo se hace un Iekei" con el tazón visto desde arriba y los pasos 一二三四.

## Capturas más recientes
| Tlaquepaque 360 | Tlaquepaque 1440 | Americana 1440 | Video |
|---|---|---|---|
| ![360](entregables/avances/2026-11-16_paso-N2_tlaquepaque_360.png) | ![1440](entregables/avances/2026-11-16_paso-N2_tlaquepaque_1440.png) | ![Americana](entregables/avances/2026-11-16_paso-N2_americana_1440.png) | [GIF 390](entregables/avances/video/2026-11-16_N2_sucursales_390.gif) · [MP4 1440](entregables/avances/video/2026-11-16_N2_sucursales_1440.mp4) |
