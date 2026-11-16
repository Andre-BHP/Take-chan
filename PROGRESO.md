# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 10:51 (hora de Guadalajara)

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

## Movimiento (2026-11-16)
André: "mejor animación, más transiciones, mejor diseño, mejor todo". Metáfora: entrar a la ramen-ya apartando la noren. Cada paso con video (MP4) y GIF en `entregables/avances/video/`.

- [x] M0. Tokens de movimiento, Lenis y GSAP (solo en navegador), reduced-motion y grabación de video
- [ ] M1. Intro de la noren y transición entre páginas
- [ ] M2. Héroe a sangre, titular por líneas, 家系 con trazo y paralaje
- [ ] M3. Washi rasgado, "Qué es el Iekei", prueba social y bento con la transición hacia `/menu`
- [ ] M4. Medidor del tazón en "Cómo se hace", sucursales y noren final de tela
- [ ] M5. `/menu` física: encendido, vuelo al pedido, odómetro, indicadores e impresión y corte del ticket
- [ ] M6. Revisiones de impeccable y design-taste-frontend
- [ ] M7. Pruebas: axe, 360 px, peso, LCP con intro, CLS 0, 60 fps, reduced-motion
- [ ] M8. Videos, GIF, capturas de visita y reporte

## Primera versión (pasos 0 a 9, terminada)
Repositorio, Pages, datos, inicio, máquina de tickets, sucursales con JSON-LD, pruebas y lista para el negocio. Capturas en `entregables/avances/antes/`.

## Último paso
**M0.** Tokens de movimiento en `DESIGN.md` y `styles.css` (5 duraciones, 3 curvas). Lenis y GSAP con ScrollTrigger y SplitText en `servicios/movimiento.ts`, cargados solo en el navegador después de la carga (no tocan el prerender ni el LCP); con movimiento reducido no se cargan. Herramienta de video `herramientas/video.mjs`: graba cada momento a 1440 y 390 px y saca MP4 y GIF.

## Sigue
M1: intro de la noren (primera visita) y transición entre páginas con la noren.

## Capturas más recientes
| Scroll con Lenis, 390 px (GIF) |
|---|
| <img src="entregables/avances/video/2026-11-16_M0_inicio_390.gif" width="240"> |
