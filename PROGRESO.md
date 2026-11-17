# Progreso · Take-chan Ramen (propuesta no oficial)

- **Pages:** https://andre-bhp.github.io/Take-chan/
- **Repositorio:** https://github.com/Andre-BHP/Take-chan
- **Última subida:** 2026-11-16 21:48 (hora de Guadalajara)

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
- [ ] P9. Calidad final, guías probadas y reporte

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
**P8.** Aviso de privacidad (`/privacidad`), conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares. En la propuesta dice que el prototipo no guarda ni envía datos y explica qué queda en el navegador. En oficial es la plantilla con responsable, finalidad (preparar tu pedido), datos (nombre opcional y lo que escribas en WhatsApp), estadísticas sin cookies si están encendidas y derechos ARCO; el responsable y el contacto salen de `negocio.json → legal` y el build avisa si siguen por confirmar (agregado a `PEDIR_AL_NEGOCIO.md`). Página de accesibilidad (`/accesibilidad`): compromiso WCAG 2.2 AA, lo probado, las limitaciones conocidas y cómo reportar. Créditos (`/creditos`): fotos de Unsplash por autor, mapas © OpenStreetMap (ODbL), tipografías y sello; en el pie quedan una línea y los enlaces. Las tres páginas existen en español y en inglés. Además, la precarga se limitó al menú y se retrasó 3 s: la portada bajó de 491 a 466 KB. axe limpio en 11 rutas y sin español suelto en las páginas en inglés.

## Sigue
P9: calidad final (Lighthouse 95 o más, recorridos automáticos), guías probadas de punta a punta sin publicar y reporte del nivel 4.

## Capturas más recientes
| Privacidad (360) | Accesibilidad (360) | Créditos (360) |
|---|---|---|
| ![privacidad](entregables/avances/2026-11-16_paso-P8_privacidad_360.png) | ![accesibilidad](entregables/avances/2026-11-16_paso-P8_accesibilidad_360.png) | ![créditos](entregables/avances/2026-11-16_paso-P8_creditos_360.png) |
