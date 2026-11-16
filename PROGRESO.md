# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 17:03 (hora de Guadalajara)

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
**N5.** Héroe más legible y con más carácter: titular en 2 líneas ("Ramen Iekei / en Tlaquepaque.", hasta 88 px), "Take-chan Ramen" chico encima, la bajada "Caldo y fideo traídos de Japón." en sans, 家系 más alto en escritorio y velo de abajo hacia arriba en celular. La intro saluda "いらっしゃいませ · Bienvenido" cuando se abre la noren. El LCP alto venía de las 6 fuentes precargadas, que esta versión de Edge trata como bloqueantes (el primer pintado esperaba 2.3 s). Sin las precargas: LCP de 2.28 s con 4G lenta y CPU 4x. Las medidas del héroe ya no dependen de la fuente (CLS de 0.003 de 320 a 1440 px). axe limpio, sin scroll a 360, portada de 446 KB.

## Sigue
N6: ritmo editorial (títulos más grandes con kanji vertical, sección propia para el 4.8 y una pausa a sangre).

## Capturas más recientes
| 360 | 1440 | Saludo | Video |
|---|---|---|---|
| ![360](entregables/avances/2026-11-16_paso-N5_360.png) | ![1440](entregables/avances/2026-11-16_paso-N5_1440.png) | ![saludo](entregables/avances/2026-11-16_paso-N5_saludo_390.png) | [GIF 390](entregables/avances/video/2026-11-16_N5_intro_390.gif) · [MP4 1440](entregables/avances/video/2026-11-16_N5_intro_1440.mp4) |
