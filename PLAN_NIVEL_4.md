# Take-chan, nivel 4: listo para ser el sitio real

Plan de Arthemis, 2026-11-16. **Se hace después de terminar `PLAN_NIVEL_3.md` (N0 a N10).** El nivel 3 deja el diseño de primer nivel; el nivel 4 resuelve todo lo que **no depende del negocio**, para que el día que el dueño diga "sí" baste cambiar unos datos y publicar.

Lo que sí depende del negocio (menú y precios reales, logo, horario, la Americana, fotos reales, WhatsApp, dominio y cuentas) sigue en `entregables/PEDIR_AL_NEGOCIO.md`. Todo lo de este plan queda **preparado y probado con datos de ejemplo**.

---

## 1. Un solo interruptor: modo propuesta o modo oficial

`src/entornos/` con `MODO = 'propuesta' | 'oficial'` (por variable de build). Hoy es `propuesta`. Ese interruptor decide:

| Cosa | Propuesta | Oficial |
|---|---|---|
| Aviso "Propuesta no oficial" y nota de ejemplo | Sí | No |
| `noindex` y `robots.txt` con `Disallow: /` | Sí | `index` y `robots.txt` con el sitemap |
| WhatsApp | Modo demo (muestra el mensaje) | Abre `wa.me/<número>` con el mensaje |
| Rótulos "Imagen ilustrativa" | Sí | Solo en fotos que sigan siendo de stock (marcadas en `fotos.json`) |
| Estadísticas | Apagadas | Encendidas si hay un ID configurado |
| `sitemap.xml` y URL canónica | No | Sí, con el dominio configurado |

Prueba: un build en cada modo y un test que verifique la tabla. `GUIA_PUBLICAR.md` dice exactamente qué cambiar (número, dominio, `MODO`) y cómo publicar.

---

## 2. Que el dueño lo edite sin programador

- **Fuente de datos editable:** una hoja de Google publicada como CSV (sin backend), con pestañas para menú, horario y aviso:
  - **Menú:** categoría, nombre, descripción, precio, foto y disponible (sí o no).
  - **Horario:** por sucursal y por día.
  - **Aviso:** texto, desde y hasta, por ejemplo "Hoy cerramos a las 15:00".
- **Cómo la usa el sitio:**
  - al cargar, lee el CSV (con tiempo de espera de 3 s y caché de 10 min en `localStorage`);
  - si falla, usa los JSON del build;
  - el prerender sigue usando los JSON, así que el SEO no depende de la hoja.
- **Hoy no hay hoja** (necesita una cuenta de Google, la del negocio o la de André). Prepara todo con un CSV de ejemplo en `public/datos-ejemplo/` y la variable `HOJA_URL` vacía.
- `GUIA_EDITAR.md`, para el dueño: cómo cambiar un precio, marcar un platillo como agotado o poner un aviso de cierre. Con capturas, sin palabras técnicas.
- **Banda de aviso** arriba del sitio cuando hay un aviso vigente (por ejemplo, días festivos). Se cierra con una ✕ y respeta la fecha "hasta".
- **Platillo agotado:** la tecla de la máquina se apaga, con la etiqueta 売切 "Agotado", como en Japón.

---

## 3. Compartir y encontrar

1. **Vista previa al compartir (Open Graph y Twitter):**
   - Imagen de 1200 × 630 por página, generada en el build con una foto tratada, el sello hanko, el nombre y la frase.
   - Título y descripción por página.
   - **Probar cómo se ve el enlace en WhatsApp** (es por donde más se va a compartir) y en X y Facebook, y guardar capturas de las vistas previas.
2. **`/links` para la biografía de TikTok:** página corta con el sello, "Ramen Iekei en Tlaquepaque", estado abierto o cerrado, y botones grandes: Menú y pedido, Cómo llegar a cada sucursal, Google Maps y TikTok. Ligera (menos de 150 KB) y con su propia vista previa.
3. **Preguntas frecuentes** en la portada (acordeón accesible) y JSON-LD `FAQPage`:
   - Solo las que **ya tienen respuesta real o general**: ¿qué es Iekei?, ¿cómo pido?, ¿qué es "al gusto"?, ¿dónde están?, ¿horario? y ¿hacen pedidos para llevar? (por WhatsApp, en modo oficial).
   - Las que dependen del negocio (formas de pago, estacionamiento, opción sin cerdo, alérgenos, niños) quedan **en `faq.json` con `confirmado: false` y no se muestran** hasta tener respuesta. Agrégalas a `PEDIR_AL_NEGOCIO.md`.
   - **Alérgenos genéricos del estilo Iekei** (cerdo, trigo, huevo, soya) sí se pueden indicar como "lleva normalmente", sin afirmar nada del platillo específico.
4. **Versión en inglés** (Tlaquepaque recibe turistas):
   - Rutas `/en`, `/en/menu`, etc., prerenderizadas, con un selector ES · EN en el encabezado y `hreflang` en ambas.
   - Textos en un diccionario; el japonés se queda igual.
   - Traducción natural, no literal ("Build your order", "Ticket machine", "First time? Get the classic").
5. **SEO local** con `seo-local`: revisar `Restaurant` y `FAQPage`, `sitemap.xml` (solo en modo oficial) y coherencia de nombre, dirección y horario en todo el sitio.

---

## 4. App ligera y fuera de línea

- **PWA:** `manifest.webmanifest` (nombre, colores sumi y bermellón, íconos del hanko en 192, 512 y maskable) y el service worker de Angular (`@angular/service-worker`).
- **El menú abre sin internet** (caché de `/menu`, fotos y datos); el pedido se arma sin conexión y al enviar avisa si no hay red.
- Probar "Agregar a pantalla de inicio" en Android (Edge con emulación) y documentarlo.

---

## 5. Impresos para el local

En `entregables/impresos/`, en PDF listos para imprimir, generados con Playwright (`page.pdf`) desde una página interna `/impresos` que no se enlaza ni se indexa:
1. **Tent card para mesa** (A6, doblez): sello, "Escanea para ver el menú y pedir", QR a `/menu?utm_source=mesa` y las sucursales.
2. **Calcomanía para la puerta o la caja** (10 × 10 cm): QR a `/links`.
3. **Tarjeta de visita para André** (para la reunión): "Propuesta de sitio para Take-chan Ramen" y un QR al sitio.

QR generado en el build (librería `qrcode`), con margen y corrección de errores M. Probarlo con la cámara del celular, a partir de una captura.

---

## 6. Medir resultados (sin cookies)

- Integración con **GoatCounter** (gratis, sin cookies y sin banner de consentimiento), o Plausible si el negocio lo paga.
- **Eventos:** "Arma tu pedido", tecla presionada, ticket impreso, WhatsApp enviado, "Cómo llegar" por sucursal, `/links` por botón y visitas desde el QR de mesa (`utm_source=mesa`).
- **Apagado en modo propuesta.** Necesita que André cree la cuenta: deja la variable `GOATCOUNTER_ID` vacía y los pasos en `GUIA_PUBLICAR.md`.
- **Plantilla de reporte mensual** en `entregables/REPORTE_MENSUAL_PLANTILLA.md` (visitas, pedidos iniciados y enviados, sucursal más buscada y origen: TikTok, Google o QR). Es lo que André le enseña al dueño para cobrar mantenimiento.

---

## 7. Legal y confianza

- **Aviso de privacidad** (`/privacidad`), conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares:
  - **Modo propuesta:** "Este prototipo no guarda ni envía datos; el nombre del pedido solo se usa para armar el mensaje en tu dispositivo".
  - **Modo oficial:** plantilla con responsable (por confirmar), finalidad (preparar tu pedido), datos (nombre opcional y lo que escribas en WhatsApp), derechos ARCO y medio de contacto (por confirmar).
- **Accesibilidad:** página corta `/accesibilidad` con el compromiso (WCAG 2.2 AA), lo probado y cómo reportar un problema.
- **Créditos:** fotos de Unsplash y mapas de OpenStreetMap (ya existen; mover a una página `/creditos` y dejar en el pie solo el enlace).

---

## 8. Calidad final

- Lighthouse en celular y escritorio, las 4 categorías en **95 o más**. Guardar los reportes en `entregables/lighthouse/`.
- **Pruebas automáticas** (Playwright) de los recorridos:
  1. armar y enviar un pedido (demo);
  2. cambiar de idioma;
  3. abrir el menú sin red;
  4. un platillo agotado (CSV de prueba);
  5. aviso vigente y vencido;
  6. modo oficial con WhatsApp real simulado (que el `href` sea correcto).
- axe en todas las rutas (incluidas `/en`, `/links` y `/privacidad`), sin desborde a 360, reduced-motion, LCP de menos de 2.5 s y CLS de 0.
- **`GUIA_PUBLICAR.md` probado de punta a punta:** un build en modo oficial con datos falsos de prueba (número `521XXXXXXXXXX`, dominio `ejemplo.test`) que pase todas las pruebas, **sin publicarlo**.

---

## 9. Orden de trabajo

Cada paso con push, `PROGRESO.md`, capturas y GIF, como siempre.

| Paso | Qué |
|---|---|
| **P0** | Interruptor de modo, propuesta u oficial (1) |
| **P1** | Vista previa al compartir y `/links` (3.1 y 3.2) |
| **P2** | Datos editables desde CSV, aviso y agotado (2) |
| **P3** | Preguntas frecuentes y SEO local (3.3 y 3.5) |
| **P4** | Versión en inglés (3.4) |
| **P5** | PWA y modo sin conexión (4) |
| **P6** | Impresos con QR (5) |
| **P7** | Estadísticas preparadas y plantilla de reporte (6) |
| **P8** | Privacidad, accesibilidad y créditos (7) |
| **P9** | Calidad final, guías probadas y reporte (8) |

## 10. Criterio de terminado
- El día que el dueño acepte, publicar el sitio oficial toma menos de una hora: número de WhatsApp, dominio, `MODO=oficial` y sus datos en la hoja.
- El dueño puede cambiar un precio desde su celular sin llamar a André.
- Al compartir el enlace por WhatsApp se ve una tarjeta bonita, no un enlace pelón.
- Un turista puede pedir en inglés y alguien sin señal puede ver el menú.
