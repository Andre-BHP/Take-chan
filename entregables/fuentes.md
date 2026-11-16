# Fuentes leídas (paso 1)

Fecha: 2026-11-15.

## Lo confirmado y lo que no
| Dato | Estado | Fuente |
|---|---|---|
| Ramen japonés estilo Iekei (caldo de cerdo con soya, fideo grueso) | Confirmado | Directorios y TikTok |
| Fideo y caldo hechos en Japón e importados | Según su ficha de TripAdvisor | Auditoría de HERA |
| Tlaquepaque: Calz. Córdoba 24, Super Manzana El Álamo, 45560, esquina Niños Héroes | Confirmado | Google (vía Restaurant Guru), TripAdvisor, TikTok |
| Horario de 12:00 a 17:00 todos los días | Probable (Google y TikTok coinciden; TripAdvisor muestra otro) | Auditoría |
| Americana: Prisciliano Sánchez 1110 | Por confirmar (solo un video de TikTok) | Auditoría |
| Precio de 100 a 200 MXN por persona | Rango público | Restaurant Guru |
| TikTok `@take_chan_sensei` | Cuenta que etiquetan los creadores | Auditoría |
| Teléfono, WhatsApp, correo, menú, precios, logo, fotos | No existen públicamente | Auditoría |
| Elogios: el caldo y la panceta | Etiquetas de reseñas | Restaurant Guru |
| Título "Presidente de la Asociación Internacional de Ramen" | No verificado: no se usa | TikTok |

## Lo que se toma de cada fuente
- **Auditoría de HERA:** los tres problemas (no hay forma de pedir, el horario no coincide, no hay menú). El sitio responde a los tres: pedido en modo demo, horario único con "abierto ahora" y menú en texto con huecos por confirmar.
- **Plan de HERA:** estructura (inicio, menú, una página por sucursal), JSON-LD `Restaurant` por sucursal, `priceRange` y lista de lo que hay que pedir al negocio.
- **Consulta de Arthemis:** la demo se enseña en persona, en el celular de André. Por eso las capturas de visita van en mockup de celular y el sitio se diseña primero para 360 a 390 px.
- **Arleth (Boca del Cielo):** Angular 22 con prerender, `outputMode: static`, configuración `pages` con `baseHref`, `preparar-pages.mjs` (noindex, robots, revisión de contacto real), horario con "abierto ahora", carrito de WhatsApp en modo demo y `herramientas/` (axe, capturas, servidor estático).

## Cartas de Gambit
Leídas con `motor/gambit.py ver`: dis-019, dis-023, dis-050, dis-009, dis-006, dis-005, dis-090, dis-054, dis-051, dis-040, dis-044, dis-072, dis-059, dis-073, dis-039, dis-052, dis-091 y dis-020. Cómo se aplica cada una: `DESIGN.md`.
