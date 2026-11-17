# El sitio como app (PWA) y sin conexión

## Qué hace
- **Se instala en el celular** como app ("Agregar a pantalla de inicio"): ícono del sello, pantalla completa y fondo sumi. Tiene un atajo directo a "Menú y pedido".
- **El menú abre sin internet:** después de la primera visita, `/menu` (y `/en/menu`) abre sin señal y el pedido se arma igual. Las fotos ya vistas se guardan; las que nunca se abrieron muestran su color de fondo hasta que vuelva la señal.
- **Al enviar sin señal**, en el sitio oficial avisa: "Sin conexión: tu pedido quedó listo. Envíalo cuando vuelva la señal." No intenta abrir WhatsApp.
- **Con conexión no cambia nada:** cada página llega del servidor (prerenderizada, buena para Google). El service worker se registra 5 s después de que la página queda lista, para no competir con la carga de la portada.

## Cómo se instala (para el cliente)
- **Android (Chrome o Edge):** abrir el sitio → menú ⋮ → "Instalar app" o "Agregar a pantalla de inicio".
- **iPhone (Safari):** botón Compartir → "Agregar a inicio".

## Cómo se probó
`herramientas/pwa.mjs`, en Edge con un perfil normal (en incógnito Chrome nunca ofrece instalar), sobre la propuesta y el ensayo oficial:
1. El manifest carga sin errores (`Page.getAppManifest`).
2. El service worker queda activo con su caché.
3. Chrome no reporta ningún error de instalabilidad (`Page.getInstallabilityErrors`): el sitio es instalable.
4. Sin red, `/menu` abre con sus 11 teclas, el pedido se arma ($165) y `/en/menu` también abre.
5. En el ensayo oficial, al enviar sin red aparece el aviso y no se abre WhatsApp.

Lo que no se puede probar sin un celular físico: el diálogo de instalación de Android y el ícono en la pantalla de inicio. Conviene hacerlo en la visita.

## Archivos
- `sitio/ngsw-config.json`: qué se guarda (la app al instalar; fotos, mapas e íconos al verlos; la hoja de Google con prioridad a la red).
- `sitio/public/manifest.webmanifest` y `sitio/public/iconos/`: el sello sobre sumi en 192 y 512 px, y una versión *maskable* con margen de seguridad.
- `sitio/scripts/preparar.mjs`: recalcula los hashes de `ngsw.json` de los archivos que toca después del build, para que el service worker no los rechace.
