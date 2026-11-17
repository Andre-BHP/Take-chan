# Guía para publicar el sitio oficial de Take-chan Ramen

Para el día que el dueño diga que sí. Con los datos en la mano, toma menos de una hora.

El sitio tiene **un solo interruptor**: el modo, `propuesta` u `oficial`. Cada build toma su archivo de `sitio/src/entornos/`:

| Archivo | Para qué | Modo |
|---|---|---|
| `entorno.pages.ts` | La propuesta en GitHub Pages (la que se le enseña al dueño) | propuesta |
| `entorno.oficial.ts` | **El sitio real.** Se llena en el paso 1 | oficial |
| `entorno.prueba-oficial.ts` | Ensayo con datos falsos (número `5210000000000`, dominio `ejemplo.test`). Nunca se publica | oficial |
| `entorno.ts` | Desarrollo local | propuesta |

## Qué cambia con el modo

| Cosa | Propuesta | Oficial |
|---|---|---|
| Aviso "Propuesta no oficial" y nota de ejemplo | Sí | No |
| `noindex` y `robots.txt` | `noindex`, `Disallow: /` | `index`, `robots.txt` con el sitemap |
| WhatsApp | Modo demostración (muestra el mensaje) | Abre `wa.me/<número>` con el pedido escrito |
| Rótulos "Imagen ilustrativa" | En todas las fotos | Solo en las fotos que sigan siendo de stock (`herramientas/fotos.json` → `"stock": false` en las propias) |
| "Total de ejemplo", "Ticket de demostración" | Sí | "Total" y "Se confirma por WhatsApp al enviarlo." |
| Estadísticas | Apagadas | Encendidas si hay código de GoatCounter |
| `sitemap.xml` y URL canónica | No | Sí, con el dominio |

`herramientas/modos.mjs` comprueba esta tabla en los dos builds.

## Paso 1. Llenar el entorno oficial
En `sitio/src/entornos/entorno.oficial.ts`:

```ts
export const ENTORNO: Entorno = {
  modo: 'oficial',
  whatsapp: '5213312345678',      // lada de país 52 + 1 + 10 dígitos, solo números
  dominio: 'https://take-chan.mx', // sin diagonal al final
  goatcounter: '',                 // opcional: el "xxx" de xxx.goatcounter.com
  hojaUrl: '',                     // opcional: la hoja de Google publicada como CSV
};
```

Sin número, el pedido sigue en modo demostración. Sin dominio, el build se detiene con un aviso.

## Paso 2. Poner los datos del negocio
Lo que el dueño confirme (`entregables/PEDIR_AL_NEGOCIO.md`) va en:
- `sitio/src/datos/menu.json`: menú y precios.
- `sitio/src/datos/negocio.json`: horario, sucursales (la Americana con `confirmada: true` si sigue abierta) y redes.
- `herramientas/fotos.json`: sus fotos con `"stock": false`, procesadas con `node herramientas/procesar-fotos.mjs`.

## Paso 3. Construir y revisar

```bash
npm --prefix sitio run build:oficial
```

El build termina con `Build "oficial" (modo oficial) listo y revisado`. Si algo falta (dominio, una página con el aviso de propuesta o con `noindex`, sin URL canónica), se detiene y dice qué.

Antes de publicar, en local:

```bash
node herramientas/estatico.mjs sitio/dist/oficial/browser 4344
```

Abre http://localhost:4344, arma un pedido y toca "Enviar por WhatsApp": debe abrir WhatsApp con el pedido escrito y el número del negocio.

## Paso 4. Publicar
La carpeta que se sube es `sitio/dist/oficial/browser` (sitio estático, sin servidor). Sirve cualquier hosting estático; se recomienda el del negocio, a su nombre:
- **GitHub Pages con dominio propio:** un repositorio del negocio, la carpeta en la rama `gh-pages`, y en *Settings → Pages* el dominio. En el DNS del dominio, un registro `CNAME` a `<usuario>.github.io`.
- **Cloudflare Pages o Netlify:** arrastrar la carpeta o conectar el repositorio con el comando `npm --prefix sitio run build:oficial` y la carpeta de salida `sitio/dist/oficial/browser`.

## Paso 5. Después de publicar
- Abrir el dominio en el celular y compartir el enlace por WhatsApp para ver la tarjeta.
- Dar de alta el sitio en Google Search Console con el `sitemap.xml`.
- Poner el enlace en la ficha de Google Maps y en la biografía de TikTok.
- La propuesta en GitHub Pages se puede borrar o dejar; sigue con `noindex`.
