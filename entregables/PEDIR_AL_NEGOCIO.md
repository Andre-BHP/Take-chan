# Qué pedirle a Take-chan Ramen

Lista para la visita. Cada punto dice dónde entra en el sitio. Todo lo que hoy aparece como "por confirmar" sale de aquí.

## 1. Menú vigente con precios
- Nombre, descripción corta y precio de cada platillo: ramen, extras, entradas y bebidas.
- **Los 3 ramen más vendidos**, en orden. El primero ocupa la tarjeta grande del inicio.
- Si ofrecen elegir **firmeza del fideo, intensidad del caldo y cantidad de grasa** (típico del Iekei), y con qué nombres.
- Si sirven **arroz** y qué extras hay (panceta, huevo, fideo extra, nori, espinaca…).
- Dónde entra: `sitio/src/datos/menu.json`. Con precio y `confirmado: true` desaparece el "por confirmar" y el ticket calcula el total.

## 2. Fotos
- Permiso para tomar fotos en el local. El guion de 12 tomas (formato, hora, sin flash, mesa limpia) está en `entregables/GUION_FOTOS.md`.
- O fotos propias en alta resolución.
- No se usan fotos de TikTok ni de directorios sin permiso.
- Dónde entra: hoy todas las fotos son de Unsplash con el rótulo "Imagen ilustrativa" (héroe, bento, teclas del menú, "Qué es el Iekei" y la pausa a sangre). Se reemplazan una por una con `herramientas/procesar-fotos.mjs`, que les da el mismo tratamiento de color.
- Las sucursales ya no usan fotos: llevan mapas propios hechos con OpenStreetMap. Con la foto de la fachada (toma 9), se puede poner junto al mapa.

## 3. Logo y colores
- Logo en vector (SVG, PDF o AI) o la mejor imagen que tengan.
- **Logo de propuesta:** mientras tanto, el sitio usa un sello hanko bermellón con 家系, hecho para la propuesta (`herramientas/sello.mjs`). Aparece en el favicon, la esquina del héroe, el pie y estampado en el ticket. No es su logo y se cambia por el suyo si existe.
- Su color de marca, si hay. Sustituye al bermellón de la propuesta (`--bermellon` en `sitio/src/styles.css`).
- Si el nombre se escribe con kanji o kana, cómo exactamente.

## 4. Horario real por sucursal
- Horario de cada sucursal y días de descanso.
- Hoy Google y TikTok dicen 12:00 a 17:00 todos los días, pero TripAdvisor muestra otro. Conviene unificarlo en todas las fichas.
- Dónde entra: `negocio.json` → `sucursales[].horario`. Alimenta el "Abierto ahora", las páginas de sucursal y el JSON-LD.

## 5. WhatsApp de pedidos
- Número para pedidos y si aceptan **pedidos para recoger** (y con cuánta anticipación).
- Dónde entra: `negocio.json` → `contacto.whatsapp`. Con número, el botón "Enviar por WhatsApp" deja el modo demostración (solo en la versión del negocio, no en esta demo pública).

## 6. Confirmar la sucursal de la Americana
- ¿Sigue abierta en Prisciliano Sánchez 1110? Código postal, cruces y horario.
- Dónde entra: `negocio.json` → `sucursales[1]` con `confirmada: true`. Entonces `/americana` pierde el aviso y gana su JSON-LD.

## 7. Permiso para usar la marca
- Autorización por escrito (basta un mensaje) para usar el nombre Take-chan Ramen y, después, publicar el sitio en un dominio suyo.
- Confirmar que TikTok `@take_chan_sensei` es la cuenta oficial y si tienen Instagram. La portada ofrece cargar sus videos (solo al tocar), así que conviene confirmarlo antes de publicar.
- Cómo quiere que se describa el origen: hoy dice "según su ficha, el fideo y el caldo se hacen en Japón y se importan".

## 8. Acceso a sus fichas de Google
- Acceso de administrador (o que lo agreguen como administrador) a Google Business Profile de Tlaquepaque.
- Dar de alta la sucursal de la Americana en Google.
- Permite unificar horario, subir el menú y responder reseñas.

---

## Lo que hoy es de ejemplo en el sitio
Cada página lo dice una sola vez: "Propuesta: menú, precios y fotos de ejemplo hasta que Take-chan confirme los suyos".

| Dato | Dónde se ve |
|---|---|
| Menú completo (Iekei clásico, con chashu, con huevo, picante, extras, gyoza, arroz, té) y sus precios | Portada (bento), máquina de tickets y ticket |
| Elegir fideo, sabor y grasa (硬め, 普通, 柔らかめ…) | Hoja "al gusto" del menú |
| Pedidos para recoger por WhatsApp | Menú y páginas de sucursal (modo demostración) |
| Fotos (Unsplash, rotuladas "Imagen ilustrativa") | Todo el sitio; créditos en `entregables/fotos-creditos.md` |
| Sucursal Americana (dirección y horario) | Única marca "por confirmar"; sin horario ni estado abierto/cerrado |
| Horario de Tlaquepaque (12:00 a 17:00 diario) | Se muestra como real porque coinciden Google y TikTok; conviene confirmarlo |
| Sugerencia "¿Le agregas huevo marinado? +$25" | Menú, después del primer ramen; precio de ejemplo |
| Ubicación de la Americana en el mapa | Aproximada, estimada por la numeración de Prisciliano Sánchez en OpenStreetMap |
| Sello hanko 家系 | Logo de propuesta (ver punto 3) |

## Lo que no se usa aunque sea público
- El título de "Presidente de la Asociación Internacional de Ramen" de su TikTok: no está verificado.
- La calificación de TripAdvisor (3.0). En la portada sí se muestra el 4.8 de Google con 140 reseñas, que es público; si el dueño prefiere no mostrarlo, se quita.
