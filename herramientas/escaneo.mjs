// Pruebas de escaneo de todos los QR (impresos y web) con jsQR, simulando la cámara de un celular:
// vista previa de 1080 px de ancho; a 10 cm cubre unos 14 cm (77 px/cm) y a 15 cm unos 21 cm (51 px/cm).
// Cada QR se prueba impreso a 2, 3 y 5 cm y a su tamaño real, limpio, con desenfoque leve y con impresión
// deslavada (bajo contraste y desenfoque). Todos deben leer la URL exacta.
// Escribe entregables/impresos/PRUEBA_ESCANEO.md con los resultados y un espacio para la prueba con celular.
// Uso: node herramientas/escaneo.mjs   (después de impresos.mjs y, para el QR web, de qr-web.mjs)
import sharp from 'sharp';
import jsQR from 'jsqr';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(raiz, 'entregables', 'impresos');
const { modo, urls, tamanos } = JSON.parse(fs.readFileSync(path.join(dir, 'urls.json'), 'utf8'));
const qrWeb = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/qr.json'), 'utf8'));
const piezas = [
  { nombre: 'Tent card de mesa (cara de abajo)', archivo: 'tent-card-mesa.qr1.png', url: urls.mesa, cm: tamanos['tent-card-mesa'] },
  { nombre: 'Tent card de mesa (cara de arriba, girada)', archivo: 'tent-card-mesa.qr0.png', url: urls.mesa, cm: tamanos['tent-card-mesa'] },
  { nombre: 'Calcomanía', archivo: 'calcomania-10x10.qr0.png', url: urls.calcomania, cm: tamanos['calcomania-10x10'] },
  { nombre: 'Tarjeta de André', archivo: 'tarjeta-andre.qr0.png', url: urls.tarjeta, cm: tamanos['tarjeta-andre'] },
  { nombre: 'QR web «Pídelo desde tu celular» (/menu)', archivo: 'web-menu.qr0.png', url: qrWeb.es.url, cm: 4.2 },
].filter((p) => fs.existsSync(path.join(dir, p.archivo)));

const distancias = [['10 cm', 77], ['15 cm', 51]];
const condiciones = [
  ['limpio', (i) => i],
  ['desenfoque leve', (i) => i.blur(1)],
  ['impresión deslavada', (i) => i.linear(0.55, 128 * 0.45).blur(0.8)],
];
async function lee(png, px, cond) {
  let img = sharp(png).flatten({ background: '#ffffff' }).resize(Math.round(px));
  // Margen blanco alrededor, como el resto de la foto.
  img = sharp(await img.extend({ top: 40, bottom: 40, left: 40, right: 40, background: '#ffffff' }).png().toBuffer());
  const { data, info } = await cond(img).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null;
}

const filas = [];
let fallas = 0, total = 0;
for (const p of piezas) {
  const png = fs.readFileSync(path.join(dir, p.archivo));
  for (const cm of [2, 3, 5, p.cm]) {
    for (const [dist, pxcm] of distancias) {
      const res = [];
      for (const [nombre, cond] of condiciones) {
        const leido = await lee(png, cm * pxcm, cond);
        const bien = leido === p.url;
        total++; if (!bien) fallas++;
        res.push(bien ? 'lee' : leido ? 'otra URL' : 'no lee');
      }
      filas.push(`| ${p.nombre} | ${cm === p.cm ? `**${cm} cm (real)**` : cm + ' cm'} | ${dist} | ${res.join(' | ')} |`);
    }
  }
  console.log(`${p.nombre}: ${p.url}`);
}
const md = `# Prueba de escaneo de los QR

Modo de los impresos: **${modo}**. Todos los QR son de tinta con la identidad (carta dis-094): corrección de errores H, sello 家系 al centro, ojos sumi con centro bermellón, fondo claro y zona de silencio de 4 módulos.

## Automática (${new Date().toLocaleString('sv-SE')})
Lectura con jsQR simulando la cámara de un celular: vista previa de 1080 px de ancho, a 10 cm (77 px/cm) y a 15 cm (51 px/cm). "Impresión deslavada" = 45 % menos de contraste y desenfoque. **${total - fallas} de ${total} lecturas dan la URL exacta.**

| QR | Tamaño impreso | Distancia | Limpio | Desenfoque leve | Impresión deslavada |
|---|---|---|---|---|---|
${filas.join('\n')}

URLs esperadas:
${piezas.map((p) => `- ${p.nombre}: \`${p.url}\``).join('\n')}

Un QR de 2 cm a 15 cm de distancia queda en unos 100 px de la vista previa: es el caso límite y solo se usaría en piezas muy chicas. Las piezas reales miden de ${Math.min(...piezas.map((p) => p.cm))} a ${Math.max(...piezas.map((p) => p.cm))} cm.

## Con celular (para André)
Imprimir los PDF a tamaño real (100 %, sin "ajustar a la página") y escanear con la cámara normal del celular, sin app especial, con luz del local.

| Pieza | Celular y sistema | Distancia | ¿Abre la URL correcta? | Notas |
|---|---|---|---|---|
| Tent card (cara de abajo) | | | [ ] | |
| Tent card (cara de arriba) | | | [ ] | |
| Calcomanía | | | [ ] | |
| Tarjeta de André | | | [ ] | |
| QR web en /menu (pantalla de computadora) | | | [ ] | |

Antes de imprimir el lote final en modo oficial, repetir esta prueba con los QR del dominio (\`node herramientas/impresos.mjs --modo oficial\` y luego \`node herramientas/escaneo.mjs\`).
`;
fs.writeFileSync(path.join(dir, 'PRUEBA_ESCANEO.md'), md);
console.log(`\n${total - fallas} de ${total} lecturas correctas → entregables/impresos/PRUEBA_ESCANEO.md`);
process.exit(fallas ? 1 : 0);
