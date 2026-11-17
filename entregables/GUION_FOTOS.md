# Guion de fotos para la visita a Take-chan Ramen

Con estas 12 tomas el sitio deja de ser una propuesta con fotos de ejemplo y parece el sitio del negocio. Cada una reemplaza una foto de Unsplash, que hoy va rotulada "Imagen ilustrativa".

## Antes de empezar
- **Pide permiso** al dueño o al encargado antes de sacar el celular. Si alguien sale en cuadro, también a esa persona.
- **Hora:** llega poco antes de las 12:00, al abrir. La luz natural de la entrada es la mejor y todavía no hay clientes.
- **Sin flash.** Si está oscuro, acércate a la ventana o a la luz de la barra.
- **Limpia la mesa** antes de cada toma: servilletas, popotes, gotas de caldo y celulares fuera.
- **Lente:** el normal (1x) del celular. El gran angular deforma el tazón.
- **Formato:** saca cada toma en vertical (para celular y TikTok) y en horizontal (para escritorio). Si solo da tiempo para uno, el que dice la tabla.
- **Calidad:** la máxima del celular, sin filtros. El tratamiento de color (`herramientas/gradear.mjs`) se aplica después, igual para todas.
- **Rápido con el tazón:** el ramen se enfría y el fideo se infla. Primero las tomas 1 a 4 con el mismo tazón, en menos de 3 minutos. Después te lo comes.

## Las 12 tomas

| # | Toma | Formato | Cómo | Dónde entra |
|---|---|---|---|---|
| 1 | Iekei clásico desde arriba | Horizontal y vertical | Celular paralelo a la mesa, el tazón al centro y entero, con un poco de mesa alrededor. Las 3 hojas de nori atrás. | Bento "Iekei clásico" y la tecla del menú |
| 2 | El mismo tazón a 45° | Horizontal | A la altura de la cara de quien come. Que se vea el brillo de la grasa sobre el caldo. | Héroe de la portada |
| 3 | Fideos al aire con palillos | Vertical | Alguien levanta el fideo grueso; enfoca el fideo y deja el fondo borroso. | Pausa a sangre de la portada y "Fideo extra" |
| 4 | Vapor a contraluz | Vertical | Con la luz de la ventana detrás del tazón recién servido. Varias fotos seguidas: el vapor cambia. | "Qué es el Iekei" |
| 5 | La máquina de tickets (o la caja, si no hay) | Vertical | De frente, completa, con las teclas legibles. | Página del menú: referencia de la máquina |
| 6 | La barra | Horizontal | Desde una esquina, con los bancos y la cocina al fondo. Sin clientes o de espaldas. | Ficha de Tlaquepaque |
| 7 | La cocina con el caldo hirviendo | Horizontal | Solo si lo permiten. La olla grande con el caldo; nada de rostros sin permiso. | "Cómo se hace un Iekei" (paso 1) |
| 8 | La noren o la entrada | Vertical | De frente, desde la banqueta, a la altura de los ojos. | Fin de la portada (noren) |
| 9 | La fachada de día | Horizontal | Desde la acera de enfrente, que se lea el letrero. Espera a que no pase un coche. | Tarjeta de Tlaquepaque |
| 10 | La esquina de Calz. Córdoba y Niños Héroes | Horizontal | Con el local y el letrero de la calle, para que se reconozca al llegar. | Página de Tlaquepaque, junto al mapa |
| 11 | Un detalle de la mesa | Vertical | La soya, el ajo, los palillos o el pimiento: lo que tengan en la mesa. Muy de cerca. | Detalles del menú y del ticket |
| 12 | El dueño o el cocinero | Vertical | **Solo con su permiso, de preferencia por escrito.** Trabajando, no posando. | "Qué es el Iekei" o la ficha de la sucursal |

Si tienen Iekei con chashu extra, con huevo, picante, gyoza o arroz a la mano, una foto desde arriba de cada uno (como la toma 1) reemplaza las teclas del menú.

## Después de la visita
1. Pasa las fotos a `fuentes-fotos/` con el nombre de la toma (por ejemplo, `clasico-arriba.jpg`).
2. Agrégalas a `herramientas/fotos.json` con `"autor": "Take-chan Ramen"` y sin enlace de Unsplash.
3. Corre `node herramientas/procesar-fotos.mjs`: aplica el mismo tratamiento de color y genera AVIF y WebP.
4. Cambia la foto en la página o en `sitio/src/datos/menu.json`, y quítale el rótulo "Imagen ilustrativa" solo a las que son del local.
5. Borra de `entregables/fotos-creditos.md` las de Unsplash que ya no se usen.

## Lo que no se hace
- No usar fotos de su TikTok ni de Google Maps sin permiso, aunque sean públicas.
- No retocar el platillo para que se vea distinto de como lo sirven.
- No fotografiar a clientes.
