# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 11:05 (hora de Guadalajara)

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
- [x] M1. Intro de la noren y transición entre páginas
- [x] M2. Héroe a sangre, titular por líneas, 家系 con trazo y paralaje
- [x] M3. Washi rasgado, "Qué es el Iekei", prueba social y bento con la transición hacia `/menu`
- [x] M4. Medidor del tazón en "Cómo se hace", sucursales y noren final de tela
- [ ] M5. `/menu` física: encendido, vuelo al pedido, odómetro, indicadores e impresión y corte del ticket
- [ ] M6. Revisiones de impeccable y design-taste-frontend
- [ ] M7. Pruebas: axe, 360 px, peso, LCP con intro, CLS 0, 60 fps, reduced-motion
- [ ] M8. Videos, GIF, capturas de visita y reporte

## Primera versión (pasos 0 a 9, terminada)
Repositorio, Pages, datos, inicio, máquina de tickets, sucursales con JSON-LD, pruebas y lista para el negocio. Capturas en `entregables/avances/antes/`.

## Último paso
**M4.** "Cómo se hace un Iekei" rehecho como medidor narrativo: un tazón dibujado se llena por capas (caldo, tare, fideo y toppings) mientras pasan los 4 pasos; en escritorio el tazón queda fijo y la sección mide unos 220 vh (sin el hueco negro); en celular los pasos se deslizan en horizontal con el tazón arriba. Se quitaron las fotos de pasos (incluida la de fondo blanco). Sucursales con entrada escalonada, punto de "abierto ahora" que late solo si está abierto, flecha en "Cómo llegar" y foto de calle de Guadalajara para la Americana. Noren final de tela índigo con 家系ラーメン: se mece con el puntero y al tocarla se abre y lleva al menú.

## Sigue
M5: `/menu` física: encendido, vuelo al pedido, odómetro, indicadores deslizantes e impresión y corte del ticket.

## Capturas más recientes
| Portada, 390 px | Portada, 1440 px |
|---|---|
| <img src="entregables/avances/video/2026-11-16_M4_inicio_390.gif" width="220"> | <img src="entregables/avances/video/2026-11-16_M4_inicio_1440.gif" width="420"> |

Videos: [390 px](entregables/avances/video/2026-11-16_M4_inicio_390.mp4) · [1440 px](entregables/avances/video/2026-11-16_M4_inicio_1440.mp4)
