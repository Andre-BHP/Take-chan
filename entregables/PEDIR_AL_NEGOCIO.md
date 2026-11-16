# Qué pedirle a Take-chan Ramen

Lista para la visita. Cada punto dice dónde entra en el sitio. Todo lo que hoy aparece como "por confirmar" sale de aquí.

## 1. Menú vigente con precios
- Nombre, descripción corta y precio de cada platillo: ramen, extras, entradas y bebidas.
- **Los 3 ramen más vendidos**, en orden. El primero ocupa la tarjeta grande del inicio.
- Si ofrecen elegir **firmeza del fideo, intensidad del caldo y cantidad de grasa** (típico del Iekei), y con qué nombres.
- Si sirven **arroz** y qué extras hay (panceta, huevo, fideo extra, nori, espinaca…).
- Dónde entra: `sitio/src/datos/menu.json`. Con precio y `confirmado: true` desaparece el "por confirmar" y el ticket calcula el total.

## 2. Fotos
- Permiso para tomar fotos en el local: tazón (cenital y de lado), panceta, fideo, barra, fachada y la máquina de tickets si tienen.
- O fotos propias en alta resolución.
- No se usan fotos de TikTok ni de directorios sin permiso.
- Dónde entra: los recuadros punteados "Foto real pendiente" del inicio y de cada sucursal.

## 3. Logo y colores
- Logo en vector (SVG, PDF o AI) o la mejor imagen que tengan.
- Su color de marca, si hay. Sustituye al rojo laca de la propuesta (`--laca` en `sitio/src/styles.css`).
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
- Confirmar que TikTok `@take_chan_sensei` es la cuenta oficial y si tienen Instagram.
- Cómo quiere que se describa el origen: hoy dice "según su ficha, el fideo y el caldo se hacen en Japón y se importan".

## 8. Acceso a sus fichas de Google
- Acceso de administrador (o que lo agreguen como administrador) a Google Business Profile de Tlaquepaque.
- Dar de alta la sucursal de la Americana en Google.
- Permite unificar horario, subir el menú y responder reseñas.

---

## Lo que hoy dice "por confirmar" en el sitio
| Dato | Dónde se ve |
|---|---|
| Nombres de platillos (Iekei clásico, panceta extra, huevo marinado, fideo extra, arroz, agua) | Inicio (bento), menú y ticket |
| Todos los precios y el total del ticket | Inicio, menú y ticket |
| Segundo y tercer ramen, entrada y bebida de la casa | Teclas apagadas del menú |
| Elegir fideo, sabor y grasa | Menú, "Al gusto" |
| Pedidos para recoger | Menú y páginas de sucursal |
| Horario (12:00 a 17:00 diario) | Inicio, sucursales, pie |
| Sucursal de la Americana (dirección y horario) | Inicio, `/americana`, pie y pedido |
| WhatsApp, teléfono, Instagram | Pie (el pedido funciona en modo demostración) |
| Fotos | Recuadros punteados |

## Lo que no se usa aunque sea público
- El título de "Presidente de la Asociación Internacional de Ramen" de su TikTok: no está verificado.
- Las calificaciones (4.8 en Google, 3.0 en TripAdvisor): se guardan en `negocio.json` pero no se muestran hasta que el dueño lo apruebe.
