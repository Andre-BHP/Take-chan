# Reporte del nivel 4 · Take-chan Ramen

Plan: `PLAN_NIVEL_4.md` (P0 a P9). Objetivo: que el día que el dueño diga "sí", publicar el sitio oficial tome menos de una hora. Todo lo que no depende del negocio quedó hecho y probado con datos de ejemplo. Lo que necesita cuentas (Google Sheets, GoatCounter, dominio y WhatsApp real) quedó preparado con variables vacías y pasos escritos. No se creó ninguna cuenta.

## Para publicar el día del sí
1. Llenar `sitio/src/entornos/entorno.oficial.ts`: WhatsApp, dominio y, si se quiere, GoatCounter y la hoja.
2. Poner los datos del negocio: menú, horario, sucursales, fotos y los datos legales del aviso de privacidad.
3. `npm --prefix sitio run build:oficial`: el build se revisa solo y se detiene si falta algo.
4. Subir `sitio/dist/oficial/browser` a cualquier hosting estático.

Detalle en `GUIA_PUBLICAR.md`. Para el dueño, cómo cambiar precios, agotados, horario y avisos desde su celular: `GUIA_EDITAR.md`.

## Qué se hizo
| Paso | Resultado |
|---|---|
| P0 | **Un solo interruptor**, propuesta u oficial (`src/entornos/`). Tres builds: Pages (propuesta), oficial (para llenar) y ensayo oficial (número y dominio falsos). `preparar.mjs` ajusta y revisa cada uno. |
| P1 | **Imagen al compartir** de 1200 × 630 por página y por modo, y **`/links`** estática para TikTok (94 KB). |
| P2 | **Menú, horario y aviso desde una hoja de Google** en CSV, con respaldo en los JSON. Platillo **agotado 売切** y **banda de aviso** con fechas. |
| P3 | **Preguntas frecuentes** (solo las de respuesta real o general) con FAQPage. Revisión de **SEO local**. |
| P4 | **Versión en inglés** (`/en`) con selector ES · EN y hreflang. El diccionario solo se descarga en inglés. |
| P5 | **PWA instalable**: el menú abre sin conexión y avisa al enviar sin señal. |
| P6 | **Impresos con QR** en PDF: tent card de mesa, calcomanía y tarjeta. Cada QR se volvió a leer. |
| P7 | **Estadísticas sin cookies** (GoatCounter por URL), apagadas hasta tener código, y **plantilla de reporte mensual**. |
| P8 | **Aviso de privacidad** (LFPDPPP), **accesibilidad** y **créditos**, en español y en inglés. |
| P9 | **Lighthouse**, recorridos automáticos y guías probadas con el ensayo oficial, sin publicar. |

## Calidad
Registro completo: `entregables/pruebas-nivel4.txt` (corrido con `node herramientas/recorridos.mjs`) y reportes de Lighthouse en `entregables/lighthouse/`.

### Lighthouse (ensayo oficial, en local)
| Página | Celular: rendimiento | Escritorio: rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|---|
| Portada | 77 | 99 | 100 | 100 | 100 |
| Menú | 83 | 99 | 100 | 100 | 100 |
| Portada en inglés | 82 | 99 | 100 | 100 | 100 |
| /links | 100 | 100 | 100 | 100 | 100 |

- **Accesibilidad, buenas prácticas y SEO: 100** en todas, en celular y en escritorio. Rendimiento en escritorio: 99 y 100.
- **Rendimiento en celular, entre 77 y 83: no llega a 95.** Lighthouse lo simula (4G lenta, CPU 4x) y cuenta como camino crítico todo lo que se pidió antes del primer pintado: 6 archivos de fuente (128 KB), el JavaScript de Angular (100 KB) y la foto del héroe. Medido de verdad en Edge con la misma limitación, el LCP queda entre 0.9 y 2.3 s y el CLS por debajo de 0.002 (`pruebas.mjs`, `rendimiento.mjs`).
- **Para llegar a 95 en celular** habría que quitar pesos de fuente (por ejemplo Geist 400 o Shippori 800), retrasar GSAP y la intro, o partir más el JavaScript. Todo eso cambia el diseño aprobado, así que queda como decisión de André.
- **La propuesta en Pages da SEO 63** por el `noindex`, que es intencional. El modo oficial da 100.

### Recorridos automáticos
| Recorrido | Prueba | Resultado |
|---|---|---|
| 1. Armar y enviar un pedido (demo) | `menu-estados.mjs`, `modos.mjs` | en orden |
| 2. Cambiar de idioma | `idiomas.mjs` | en orden |
| 3. Abrir el menú sin red | `pwa.mjs` | en orden |
| 4. Platillo agotado (CSV de prueba) | `hoja.mjs` | en orden |
| 5. Aviso vigente y vencido | `hoja.mjs` | en orden |
| 6. Modo oficial con WhatsApp real simulado | `modos.mjs` (abre `wa.me/5210000000000?text=…`) | en orden |

Además: axe sin violaciones en 11 rutas (incluidas `/en`, `/links` y `/privacidad`), sin desborde a 360 px, portada de 466 KB, movimiento reducido en orden, imágenes al compartir, SEO local y estadísticas.

### Guías probadas sin publicar
- **`GUIA_PUBLICAR.md`, de punta a punta, con el ensayo oficial** (`entorno.prueba-oficial.ts`: número `5210000000000` y dominio `ejemplo.test`):
  - el build pasa su revisión y todas las pruebas de arriba;
  - el build oficial vacío se detiene y pide el dominio;
  - no se publicó nada.
- **`GUIA_EDITAR.md`:** precio, agotado, horario y aviso, probados con `hoja.mjs` interceptando la hoja.

## Lo que necesita al negocio o una cuenta
| Qué | Dónde se pone | Estado |
|---|---|---|
| Número de WhatsApp y dominio | `entorno.oficial.ts` | Vacío |
| Hoja de Google (tres pestañas en CSV) | `entorno.oficial.ts → hoja` | Plantillas en `public/datos-ejemplo/` |
| Código de GoatCounter | `entorno.oficial.ts → goatcounter` | Vacío (apagado) |
| Responsable y contacto ARCO | `negocio.json → legal` | Por confirmar (el build lo advierte) |
| Preguntas de pago, estacionamiento, sin cerdo, alergias y niños | `faq.json` | Ocultas hasta tener respuesta |
| Probar el enlace en WhatsApp y la instalación en un celular | Celular de André | Pendiente (la vista previa está simulada con las etiquetas reales) |

Todo esto está en `entregables/PEDIR_AL_NEGOCIO.md`.

## Herramientas nuevas
- **Pruebas:** `modos.mjs`, `compartir.mjs`, `hoja.mjs`, `seo-local.mjs`, `idiomas.mjs`, `llaves-idioma.mjs`, `pwa.mjs`, `estadisticas.mjs`, `lighthouse.mjs` y `recorridos.mjs` (corre todas).
- **Generadores:**
  - `og.mjs`: imágenes al compartir;
  - `hoja-ejemplo.mjs`: pestañas de ejemplo;
  - `guia-hoja.mjs`: capturas de la guía;
  - `impresos.mjs`: PDF con QR.
