# Reporte del movimiento · Take-chan Ramen

Propuesta no oficial. Sitio: https://andre-bhp.github.io/Take-chan/ · Avance y videos: [`PROGRESO.md`](../PROGRESO.md)

## La idea
Entrar a la ramen-ya apartando la noren. Un momento firma por página (la noren al entrar; el ticket que se imprime y se corta en el menú) dentro de un sistema de movimiento con los mismos tiempos y curvas.

## Qué se mueve
- **Intro** de la primera visita y **telón de noren** entre páginas.
- **Portada:** héroe a sangre con titular por líneas y trazo de 家系, paralaje, washi rasgado, prueba social (4.8 en Google con 140 reseñas, datos reales), bento que vuela a su tecla, medidor del tazón, sucursales y noren de tela que lleva al menú.
- **Menú:** máquina que se enciende, teclas que se hunden, miniatura que vuela al pedido, total en odómetro, ticket que sale en tres jalones y se corta.

## Videos
MP4 y GIF de cada momento en [`avances/video/`](avances/video/): intro, transiciones, portada completa (`2026-11-16_M8_inicio_*`), medidor y menú, a 390 y 1440 px.

## Calidad (medida)
axe sin violaciones; sin desborde a 360 px; portada de 417 KB; LCP de 1.8–2.0 s con la intro, 4G lenta y CPU 4x; CLS 0; scroll a 59–60 fps sin tareas largas; con movimiento reducido no hay intro ni animaciones. Detalle en [`pruebas-movimiento.txt`](pruebas-movimiento.txt).

## Decisiones
- El encabezado no se oculta al bajar: el aviso de propuesta no oficial debe quedar fijo.
- La foto que vuela del bento a la tecla solo corre en escritorio; en celular la tecla destino queda fuera de pantalla y se usa el telón.
- "Cómo se hace un Iekei" es un diagrama que se llena por capas, sin fotos.
- No se instaló `animation-vocabulary`.
