// Impresos para el local, en PDF listos para imprimir: tent card de mesa (A5 que se dobla en dos caras A6),
// calcomanía de 10 × 10 cm para la puerta o la caja, y tarjeta de presentación de André para la reunión.
// El QR se genera aquí (corrección de errores M, margen de 4 módulos) y se vuelve a leer de una captura para comprobarlo.
// La página de impresos vive en entregables/impresos/ y no se publica.
// Uso: node herramientas/impresos.mjs [url-base]
//   url-base por omisión: el dominio de entorno.oficial.ts o, si está vacío, la propuesta en GitHub Pages.
import { chromium } from 'playwright-core';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entorno = (n) => fs.readFileSync(path.join(raiz, 'sitio/src/entornos', `entorno.${n}.ts`), 'utf8');
const campo = (t, k) => t.match(new RegExp(`${k}:\\s*'([^']*)'`))?.[1] ?? '';
const dominio = campo(entorno('oficial'), 'dominio');
const base = (process.argv[2] || dominio || campo(entorno('pages'), 'publico')).replace(/\/$/, '');
const propuesta = !process.argv[2] && !dominio;
const salida = path.join(raiz, 'entregables', 'impresos');
fs.mkdirSync(salida, { recursive: true });
const negocio = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/negocio.json'), 'utf8'));
const t = negocio.sucursales[0];
const datos = (f) => `data:${f.endsWith('.webp') ? 'image/webp' : 'font/woff2'};base64,${fs.readFileSync(path.join(raiz, 'sitio/public', f)).toString('base64')}`;
const qr = (url) => QRCode.toString(url, { type: 'svg', errorCorrectionLevel: 'M', margin: 4, color: { dark: '#121110', light: '#ffffff' } });

const urls = {
  mesa: `${base}/menu?utm_source=mesa`,
  calcomania: `${base}/links?utm_source=calcomania`,
  tarjeta: `${base}/?utm_source=tarjeta`,
};
const estilos = `
  @font-face { font-family: S; font-weight: 800; src: url(${datos('fuentes/shippori-800.woff2')}); }
  @font-face { font-family: S; font-weight: 700; src: url(${datos('fuentes/shippori-700.woff2')}); }
  @font-face { font-family: G; font-weight: 500; src: url(${datos('fuentes/geist-500.woff2')}); }
  @font-face { font-family: G; font-weight: 600; src: url(${datos('fuentes/geist-600.woff2')}); }
  * { box-sizing: border-box; margin: 0; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font: 500 10pt/1.35 G, sans-serif; color: #121110; }
  .sello { display: block; }
  .qr svg { display: block; width: 100%; height: auto; }
  .p { font: 600 6.5pt/1.2 G; letter-spacing: .04em; color: #6b6156; }
`;
const cara = (girada) => `
  <section class="cara${girada ? ' girada' : ''}">
    <img class="sello" src="${datos('sello-192.webp')}" alt="">
    <h1>Escanea para ver<br>el menú y pedir</h1>
    <div class="qr">${qrMesa}</div>
    <p class="d">Take-chan Ramen · ${t.direccion.calle}, ${(t.direccion.referencia ?? '').replace(/^./, (c) => c.toLowerCase())}</p>
    ${propuesta ? '<p class="p">PROPUESTA NO OFICIAL</p>' : ''}
  </section>`;
const qrMesa = await qr(urls.mesa);
const paginas = {
  'tent-card-mesa': {
    ancho: '148mm', alto: '210mm',
    html: `<style>${estilos}
      .hoja { width: 148mm; height: 210mm; display: grid; grid-template-rows: 1fr 1fr; }
      .cara { position: relative; display: grid; justify-items: center; align-content: center; gap: 3.2mm; padding: 7mm 10mm; background: #f3eee4; text-align: center; }
      .cara.girada { transform: rotate(180deg); border-bottom: .2mm dashed #b5a998; }
      .cara .sello { width: 15mm; height: 15mm; rotate: -5deg; }
      h1 { font: 800 15pt/1.1 S; }
      .cara .qr { width: 44mm; }
      .d { font-size: 7.5pt; color: #3b352f; }
    </style><div class="hoja">${cara(true)}${cara(false)}</div>`,
  },
  'calcomania-10x10': {
    ancho: '100mm', alto: '100mm',
    html: `<style>${estilos}
      .c { width: 100mm; height: 100mm; border-radius: 6mm; background: #121110; color: #f3eee4; display: grid; grid-template-columns: 1fr 48mm; align-items: center; gap: 5mm; padding: 8mm; }
      .c .sello { width: 18mm; height: 18mm; rotate: -5deg; margin-bottom: 4mm; }
      h1 { font: 800 14pt/1.05 S; margin-bottom: 2mm; white-space: nowrap; }
      .c p { font-size: 8pt; color: #e9e2d4; }
      .c .qr { width: 48mm; border-radius: 2.5mm; overflow: hidden; }
      .c .p { color: #bdb4a8; margin-top: 3mm; }
    </style><div class="c"><div><img class="sello" src="${datos('sello-192.webp')}" alt=""><h1>Take-chan<br>Ramen</h1><p>Menú, pedido y cómo llegar</p>${propuesta ? '<p class="p">PROPUESTA NO OFICIAL</p>' : ''}</div><div class="qr">${await qr(urls.calcomania)}</div></div>`,
  },
  'tarjeta-andre': {
    ancho: '85mm', alto: '55mm',
    html: `<style>${estilos}
      .t { width: 85mm; height: 55mm; background: #121110; color: #f3eee4; display: grid; grid-template-columns: 1fr 27mm; gap: 4mm; align-items: center; padding: 6mm; }
      .t .sello { width: 10mm; height: 10mm; rotate: -5deg; margin-bottom: 3mm; }
      h1 { font: 700 10.5pt/1.15 S; margin-bottom: 2mm; }
      .t p { font-size: 6.8pt; color: #e9e2d4; }
      .t .nombre { font: 600 8pt/1.3 G; color: #f3eee4; margin-top: 3mm; }
      .t .qr { width: 27mm; border-radius: 1.5mm; overflow: hidden; }
    </style><div class="t"><div><img class="sello" src="${datos('sello-192.webp')}" alt=""><h1>Propuesta de sitio para Take-chan Ramen</h1><p>Escanea para verla en tu celular.</p><p class="nombre">André Heredia</p></div><div class="qr">${await qr(urls.tarjeta)}</div></div>`,
  },
};

// Página de impresos (no se publica): las tres piezas juntas para revisarlas en pantalla.
fs.writeFileSync(path.join(salida, 'impresos.html'), `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Impresos · Take-chan</title><style>body{margin:0;padding:24px;background:#555;display:grid;gap:24px;justify-items:start}</style>` + Object.values(paginas).map((p) => `<div style="width:${p.ancho};height:${p.alto};background:#fff">${p.html}</div>`).join(''));

const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const pg = await b.newPage({ deviceScaleFactor: 3 });
let fallas = 0;
for (const [nombre, p] of Object.entries(paginas)) {
  await pg.setContent(`<!doctype html><meta charset="utf-8"><style>@page { size: ${p.ancho} ${p.alto}; margin: 0; }</style>${p.html}`, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: path.join(salida, `${nombre}.pdf`), width: p.ancho, height: p.alto, printBackground: true, pageRanges: '1' });
  // Comprobación como la haría una cámara: captura de la pieza y lectura del QR.
  const png = await pg.locator('body > div').first().screenshot();
  fs.writeFileSync(path.join(salida, `${nombre}.png`), png);
  const leer = async (img) => {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? 'nada';
  };
  const esperado = nombre.startsWith('tent') ? urls.mesa : nombre.startsWith('calco') ? urls.calcomania : urls.tarjeta;
  let lecturas;
  if (nombre.startsWith('tent')) {
    // Dos caras: la de abajo derecha y la de arriba girada (al doblar, las dos quedan derechas).
    const m = await sharp(png).metadata();
    const mitad = Math.floor(m.height / 2);
    lecturas = [await leer(sharp(png).extract({ left: 0, top: mitad, width: m.width, height: m.height - mitad })), await leer(sharp(png).extract({ left: 0, top: 0, width: m.width, height: mitad }).rotate(180))];
  } else lecturas = [await leer(sharp(png))];
  const bien = lecturas.every((l) => l === esperado);
  if (!bien) fallas++;
  console.log(`${bien ? 'ok   ' : 'FALLA'} ${nombre}.pdf · QR leído: ${lecturas.join(' y ')}`);
}
await b.close();
console.log(propuesta ? `\nQR hacia la propuesta (${base}). Con el dominio en entorno.oficial.ts, vuelve a correr esto antes de imprimir.` : `\nQR hacia ${base}.`);
process.exit(fallas ? 1 : 0);
