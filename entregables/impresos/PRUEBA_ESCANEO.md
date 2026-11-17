# Prueba de escaneo de los QR

Modo de los impresos: **propuesta**. Todos los QR son de tinta con la identidad (carta dis-094): corrección de errores H, sello 家系 al centro, ojos sumi con centro bermellón, fondo claro y zona de silencio de 4 módulos.

## Automática (2026-11-17 13:21:20)
Lectura con jsQR simulando la cámara de un celular: vista previa de 1080 px de ancho, a 10 cm (77 px/cm) y a 15 cm (51 px/cm). "Impresión deslavada" = 45 % menos de contraste y desenfoque. **120 de 120 lecturas dan la URL exacta.**

| QR | Tamaño impreso | Distancia | Limpio | Desenfoque leve | Impresión deslavada |
|---|---|---|---|---|---|
| Tent card de mesa (cara de abajo) | 2 cm | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | 2 cm | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | 3 cm | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | 3 cm | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | 5 cm | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | 5 cm | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | **4.6 cm (real)** | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de abajo) | **4.6 cm (real)** | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | 2 cm | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | 2 cm | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | 3 cm | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | 3 cm | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | 5 cm | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | 5 cm | 15 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | **4.6 cm (real)** | 10 cm | lee | lee | lee |
| Tent card de mesa (cara de arriba, girada) | **4.6 cm (real)** | 15 cm | lee | lee | lee |
| Calcomanía | 2 cm | 10 cm | lee | lee | lee |
| Calcomanía | 2 cm | 15 cm | lee | lee | lee |
| Calcomanía | 3 cm | 10 cm | lee | lee | lee |
| Calcomanía | 3 cm | 15 cm | lee | lee | lee |
| Calcomanía | 5 cm | 10 cm | lee | lee | lee |
| Calcomanía | 5 cm | 15 cm | lee | lee | lee |
| Calcomanía | **4.8 cm (real)** | 10 cm | lee | lee | lee |
| Calcomanía | **4.8 cm (real)** | 15 cm | lee | lee | lee |
| Tarjeta de André | 2 cm | 10 cm | lee | lee | lee |
| Tarjeta de André | 2 cm | 15 cm | lee | lee | lee |
| Tarjeta de André | 3 cm | 10 cm | lee | lee | lee |
| Tarjeta de André | 3 cm | 15 cm | lee | lee | lee |
| Tarjeta de André | 5 cm | 10 cm | lee | lee | lee |
| Tarjeta de André | 5 cm | 15 cm | lee | lee | lee |
| Tarjeta de André | **2.9 cm (real)** | 10 cm | lee | lee | lee |
| Tarjeta de André | **2.9 cm (real)** | 15 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | 2 cm | 10 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | 2 cm | 15 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | 3 cm | 10 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | 3 cm | 15 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | 5 cm | 10 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | 5 cm | 15 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | **4.2 cm (real)** | 10 cm | lee | lee | lee |
| QR web «Pídelo desde tu celular» (/menu) | **4.2 cm (real)** | 15 cm | lee | lee | lee |

URLs esperadas:
- Tent card de mesa (cara de abajo): `https://andre-bhp.github.io/Take-chan/menu?ref=mesa`
- Tent card de mesa (cara de arriba, girada): `https://andre-bhp.github.io/Take-chan/menu?ref=mesa`
- Calcomanía: `https://andre-bhp.github.io/Take-chan/links?ref=calco`
- Tarjeta de André: `https://andre-bhp.github.io/Take-chan/?ref=tarjeta`
- QR web «Pídelo desde tu celular» (/menu): `https://andre-bhp.github.io/Take-chan/menu?ref=qr-web`

Un QR de 2 cm a 15 cm de distancia queda en unos 100 px de la vista previa: es el caso límite y solo se usaría en piezas muy chicas. Las piezas reales miden de 2.9 a 4.8 cm.

## Con celular (para André)
Imprimir los PDF a tamaño real (100 %, sin "ajustar a la página") y escanear con la cámara normal del celular, sin app especial, con luz del local.

| Pieza | Celular y sistema | Distancia | ¿Abre la URL correcta? | Notas |
|---|---|---|---|---|
| Tent card (cara de abajo) | | | [ ] | |
| Tent card (cara de arriba) | | | [ ] | |
| Calcomanía | | | [ ] | |
| Tarjeta de André | | | [ ] | |
| QR web en /menu (pantalla de computadora) | | | [ ] | |

Antes de imprimir el lote final en modo oficial, repetir esta prueba con los QR del dominio (`node herramientas/impresos.mjs --modo oficial` y luego `node herramientas/escaneo.mjs`).
