# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 20:49 (hora de Guadalajara)

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
**N10.** Cierre del nivel 3. La revisión de terminado (verificador de design-taste-frontend) encontró y se corrigió: el titular que se salía del héroe en celular, rasgos y acentos cortados por las máscaras de línea, el velo de escritorio, el contraste de los pasos inactivos (50 %), la sugerencia que tapaba el ticket en celular, la foto de la gyoza pedida a menor tamaño y las métricas de las fuentes de respaldo. Pruebas: axe sin violaciones (incluidos los estados del menú), sin scroll a 360, portada de 472 KB, LCP de 0.8 a 2.3 s, CLS de 0.0013 como máximo, 59 a 60 fps y movimiento reducido en orden. Videos finales, capturas de visita, comparativa antes y después, y `entregables/REPORTE_NIVEL_3.md`.

## Sigue
Nivel 4 (`PLAN_NIVEL_4.md`, P0 a P9): todo lo que no depende del negocio para publicar en menos de una hora el día que el dueño diga que sí.

## Capturas más recientes
| Antes y después | Portada 360 | Portada 1440 | Menú 1440 | Videos |
|---|---|---|---|---|
| ![comparativa](entregables/avances/comparativa-nivel3.png) | ![360](entregables/avances/2026-11-16_paso-N10_360.png) | ![1440](entregables/avances/2026-11-16_paso-N10_1440.png) | ![menú](entregables/avances/2026-11-16_paso-N10_menu_1440.png) | [Portada GIF 390](entregables/avances/video/2026-11-16_N10_inicio_390.gif) · [Menú GIF 390](entregables/avances/video/2026-11-16_N10_menu_390.gif) · [Portada MP4 1440](entregables/avances/video/2026-11-16_N10_inicio_1440.mp4) |
