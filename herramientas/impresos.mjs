// Impresos para el local, en PDF listos para imprimir: tent card de mesa (A5 que se dobla en dos caras A6),
// calcomanía de 10 × 10 cm para la puerta o la caja, y tarjeta de presentación de André para la reunión.
// Los QR siguen la regla de André (cartas de Gambit): QR de tinta con la identidad (dis-094, sitio/scripts/qr-tinta.mjs),
// corrección H y el sello 家系 al centro; en la tent card, impreso dentro de un ticket 食券 que sale de la máquina (dis-050).
// La URL sale de la configuración del modo:
//   --modo propuesta  → la propuesta en GitHub Pages (entorno.pages.ts → publico)
//   --modo oficial    → el dominio de entorno.oficial.ts (se detiene si está vacío)
//   sin --modo        → oficial si ya hay dominio; si no, propuesta.
// Después corre las pruebas de escaneo (herramientas/escaneo.mjs). La página de impresos queda en entregables/impresos/ y no se publica.
// Uso: node herramientas/impresos.mjs [--modo propuesta|oficial]
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import jsQR from 'jsqr';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svgTinta } from '../sitio/scripts/qr-tinta.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entorno = (n) => fs.readFileSync(path.join(raiz, 'sitio/src/entornos', `entorno.${n}.ts`), 'utf8');
const campo = (t, k) => t.match(new RegExp(`${k}:\\s*'([^']*)'`))?.[1] ?? '';
const arg = process.argv.indexOf('--modo');
const dominio = campo(entorno('oficial'), 'dominio').replace(/\/$/, '');
const modo = arg > 0 ? process.argv[arg + 1] : dominio ? 'oficial' : 'propuesta';
if (modo === 'oficial' && !dominio) { console.error('Falta el dominio en sitio/src/entornos/entorno.oficial.ts (GUIA_PUBLICAR.md, paso 1).'); process.exit(1); }
const base = modo === 'oficial' ? dominio : campo(entorno('pages'), 'publico').replace(/\/$/, '');
const propuesta = modo === 'propuesta';
const salida = path.join(raiz, 'entregables', 'impresos');
fs.mkdirSync(salida, { recursive: true });
const negocio = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/negocio.json'), 'utf8'));
const t = negocio.sucursales[0];
const datos = (f) => `data:${f.endsWith('.webp') ? 'image/webp' : 'font/woff2'};base64,${fs.readFileSync(path.join(raiz, 'sitio/public', f)).toString('base64')}`;
// El sello del centro del QR va en PNG (se ve igual en el navegador y en cualquier visor de SVG).
const selloPng = `data:image/png;base64,${(await sharp(path.join(raiz, 'herramientas/sello-original.png')).resize(256).png().toBuffer()).toString('base64')}`;
// La forma de cada gota de tinta sale de una semilla. Para cada QR se elige la primera semilla cuya versión,
// dibujada por Chrome como el impreso, se lee en todas las condiciones de prueba (2 y 3 cm, a 10 y 15 cm,
// limpio, borroso y deslavado).
const semillas = new Map();
const navegador = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const lienzo = await navegador.newPage({ viewport: { width: 1400, height: 1400 } });
async function semillaLegible(url) {
  for (const semilla of [7, 5, 13, 3, 9, 11, 17, 19]) {
    await lienzo.setContent(`<style>html,body{margin:0}svg{display:block;width:1400px;height:1400px}</style>${svgTinta(url, { sello: selloPng, semilla })}`, { waitUntil: 'load' });
    const grande = await lienzo.locator('svg').screenshot();
    let bien = true;
    for (const cm of [2, 3]) for (const pxcm of [77, 51]) for (const c of [(i) => i, (i) => i.blur(1), (i) => i.linear(0.55, 57.6).blur(0.8)]) {
      if (!bien) break;
      const img = sharp(await sharp(grande).flatten({ background: '#fff' }).resize(Math.round(cm * pxcm)).extend({ top: 40, bottom: 40, left: 40, right: 40, background: '#fff' }).png().toBuffer());
      const { data, info } = await c(img).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      bien = jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data === url;
    }
    if (bien) return semilla;
  }
  return 7;
}
const qr = (url, id, fondo) => svgTinta(url, { sello: selloPng, id, fondo, semilla: semillas.get(url) ?? 7 });

export const URLS = {
  mesa: `${base}/menu?ref=mesa`,
  calcomania: `${base}/links?ref=calco`,
  tarjeta: `${base}/?ref=tarjeta`,
};
for (const u of Object.values(URLS)) semillas.set(u, await semillaLegible(u));
console.log('semillas:', Object.fromEntries([...semillas].map(([u, s]) => [u.split('ref=')[1], s])));
await navegador.close();
const estilos = `
  @font-face { font-family: S; font-weight: 800; src: url(${datos('fuentes/shippori-800.woff2')}); }
  @font-face { font-family: S; font-weight: 700; src: url(${datos('fuentes/shippori-700.woff2')}); }
  @font-face { font-family: G; font-weight: 500; src: url(${datos('fuentes/geist-500.woff2')}); }
  @font-face { font-family: G; font-weight: 600; src: url(${datos('fuentes/geist-600.woff2')}); }
  @font-face { font-family: M; font-weight: 500; src: url(${datos('fuentes/geist-mono-500.woff2')}); }
  * { box-sizing: border-box; margin: 0; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font: 500 10pt/1.35 G, sans-serif; color: #121110; }
  .sello { display: block; }
  .qr svg { display: block; width: 100%; height: auto; }
  .p { font: 600 6.5pt/1.2 G; letter-spacing: .04em; color: #6b6156; }
`;

// Cara de la tent card: el ticket 食券 sale de la ranura 発券口 de la máquina con el QR impreso.
const cara = (girada) => `
  <section class="cara${girada ? ' girada' : ''}">
    <h1>Escanea para ver<br>el menú y pedir</h1>
    <div class="ranura"><span>発券口</span></div>
    <div class="ticket">
      <p class="ticket-marca"><span>食券</span> TAKE-CHAN RAMEN</p>
      <div class="qr">${qr(URLS.mesa, girada ? 'qa' : 'qb', '#fbf9f4')}</div>
      <p class="ticket-pie"><span>Menú y pedido</span><span>${propuesta ? 'Propuesta' : 'Mesa'}</span></p>
    </div>
    <p class="d">${t.direccion.calle}, ${(t.direccion.referencia ?? '').replace(/^./, (c) => c.toLowerCase())}${propuesta ? ' · <span class="p">PROPUESTA NO OFICIAL</span>' : ''}</p>
  </section>`;

const paginas = {
  'tent-card-mesa': {
    ancho: '148mm', alto: '210mm', qrCm: 4.6,
    html: `<style>${estilos}
      .hoja { width: 148mm; height: 210mm; display: grid; grid-template-rows: 1fr 1fr; }
      .cara { position: relative; display: grid; justify-items: center; align-content: center; gap: 0; padding: 6mm 12mm; background: #121110; color: #f3eee4; text-align: center; }
      .cara.girada { transform: rotate(180deg); border-bottom: .2mm dashed #4a4440; }
      h1 { font: 800 14pt/1.1 S; margin-bottom: 8mm; }
      .ranura { width: 64mm; height: 4mm; border-radius: 2mm; background: #0b0a09; box-shadow: 0 0 0 1.2mm #2e2f31, 0 0 0 1.5mm #4a4c4f; position: relative; z-index: 1; }
      .ranura span { position: absolute; left: 50%; top: -5.4mm; translate: -50% 0; font: 700 6pt/1 S; color: #bdb4a8; letter-spacing: .1em; }
      .ticket { width: 52mm; margin-top: -1.2mm; padding: 3.5mm 3mm 5mm; background: #fbf9f4; color: #1a1714; display: grid; gap: 2mm;
        -webkit-mask: radial-gradient(1.6mm at 50% calc(100% + .3mm), #0000 98%, #000) 50% / 3.6mm 100% repeat-x; mask: radial-gradient(1.6mm at 50% calc(100% + .3mm), #0000 98%, #000) 50% / 3.6mm 100% repeat-x; }
      .ticket-marca { font: 800 8pt/1 S; letter-spacing: .04em; text-align: left; }
      .ticket .qr { width: 46mm; margin: 0 auto; }
      .ticket-pie { display: flex; justify-content: space-between; font: 500 6pt/1 M; color: #5c544b; border-top: .25mm dashed #5c544b; padding-top: 1.6mm; }
      .d { margin-top: 4mm; font-size: 7pt; color: #e9e2d4; }
      .cara .p { color: #bdb4a8; }
    </style><div class="hoja">${cara(true)}${cara(false)}</div>`,
  },
  'calcomania-10x10': {
    ancho: '100mm', alto: '100mm', qrCm: 4.8,
    html: `<style>${estilos}
      .c { width: 100mm; height: 100mm; border-radius: 6mm; background: #121110; color: #f3eee4; display: grid; grid-template-columns: 1fr 48mm; align-items: center; gap: 5mm; padding: 8mm; }
      .c .sello { width: 18mm; height: 18mm; rotate: -5deg; margin-bottom: 4mm; }
      h1 { font: 800 14pt/1.05 S; margin-bottom: 2mm; white-space: nowrap; }
      .c p { font-size: 8pt; color: #e9e2d4; }
      /* Margen claro extra: las esquinas redondeadas no deben comerse la zona de silencio junto a los ojos. */
      .c .qr { width: 48mm; border-radius: 2.5mm; overflow: hidden; background: #f3eee4; padding: 1.4mm; }
      .c .p { color: #bdb4a8; margin-top: 3mm; }
    </style><div class="c"><div><img class="sello" src="${datos('sello-192.webp')}" alt=""><h1>Take-chan<br>Ramen</h1><p>Menú, pedido y cómo llegar</p>${propuesta ? '<p class="p">PROPUESTA NO OFICIAL</p>' : ''}</div><div class="qr">${qr(URLS.calcomania, 'qc')}</div></div>`,
  },
  'tarjeta-andre': {
    ancho: '85mm', alto: '55mm', qrCm: 2.9,
    html: `<style>${estilos}
      .t { width: 85mm; height: 55mm; background: #121110; color: #f3eee4; display: grid; grid-template-columns: 1fr 29mm; gap: 4mm; align-items: center; padding: 5mm 5mm 5mm 6mm; }
      .t .sello { width: 10mm; height: 10mm; rotate: -5deg; margin-bottom: 3mm; }
      h1 { font: 700 10.5pt/1.15 S; margin-bottom: 2mm; }
      .t p { font-size: 6.8pt; color: #e9e2d4; }
      .t .nombre { font: 600 8pt/1.3 G; color: #f3eee4; margin-top: 3mm; }
      .t .qr { width: 29mm; border-radius: 1.5mm; overflow: hidden; background: #f3eee4; padding: .9mm; }
    </style><div class="t"><div><img class="sello" src="${datos('sello-192.webp')}" alt=""><h1>Propuesta de sitio para Take-chan Ramen</h1><p>Escanea para verla en tu celular.</p><p class="nombre">André Heredia</p></div><div class="qr">${qr(URLS.tarjeta, 'qt')}</div></div>`,
  },
};

// Página de impresos (no se publica): las tres piezas juntas para revisarlas en pantalla.
fs.writeFileSync(path.join(salida, 'impresos.html'), `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>Impresos · Take-chan</title><style>body{margin:0;padding:24px;background:#555;display:grid;gap:24px;justify-items:start}</style>` + Object.values(paginas).map((p) => `<div style="width:${p.ancho};height:${p.alto};background:#fff">${p.html}</div>`).join(''));

const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const pg = await b.newPage({ deviceScaleFactor: 4 });
for (const [nombre, p] of Object.entries(paginas)) {
  await pg.setContent(`<!doctype html><meta charset="utf-8"><style>@page { size: ${p.ancho} ${p.alto}; margin: 0; }</style>${p.html}`, { waitUntil: 'load' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.pdf({ path: path.join(salida, `${nombre}.pdf`), width: p.ancho, height: p.alto, printBackground: true, pageRanges: '1' });
  // Captura de la pieza (para revisarla y para las pruebas de escaneo) y del QR solo, a su tamaño impreso.
  fs.writeFileSync(path.join(salida, `${nombre}.png`), await pg.locator('body > div').first().screenshot());
  const qrs = pg.locator('.qr svg');
  for (let i = 0; i < (await qrs.count()); i++) fs.writeFileSync(path.join(salida, `${nombre}.qr${i}.png`), await qrs.nth(i).screenshot());
  console.log(`${nombre}.pdf (QR de ${p.qrCm} cm)`);
}
await b.close();
fs.writeFileSync(path.join(salida, 'urls.json'), JSON.stringify({ modo, base, urls: URLS, tamanos: Object.fromEntries(Object.entries(paginas).map(([n, p]) => [n, p.qrCm])) }, null, 2));
console.log(`\nModo ${modo}: QR hacia ${base}.${propuesta ? ' Al pasar a oficial: node herramientas/impresos.mjs --modo oficial (GUIA_PUBLICAR.md).' : ''}`);
