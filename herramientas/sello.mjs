// Sello hanko de la propuesta: cuadrado bermellón con 家系 en blanco (estilo 白文, los trazos quedan sin tinta),
// borde irregular y tinta con poros. Se dibuja en Edge con la fuente real (Shippori Mincho 800) y se guarda como raster:
// sitio/public/sello-*.webp y .png, favicon-32.png y apple-touch-icon.png. Es el logo de propuesta, no el del negocio.
// Uso: node herramientas/sello.mjs
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fuente = pathToFileURL(path.join(raiz, 'sitio', 'public', 'fuentes', 'shippori-800.woff2')).href;
const publico = path.join(raiz, 'sitio', 'public');

const html = (poros) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: S; src: url('${fuente}') format('woff2'); font-weight: 800; }
html, body { margin: 0; background: transparent; }
svg { display: block; }
</style>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="borde" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="11" result="r" />
      <feDisplacementMap in="SourceGraphic" in2="r" scale="${poros ? 12 : 6}" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="poros" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="4" result="r" />
      <feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  22 0 0 0 ${poros ? -14.9 : -15.6}" />
    </filter>
    <filter id="manchas" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="2" seed="21" result="r" />
      <feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  16 0 0 0 ${poros ? -11.2 : -13}" />
    </filter>
    <mask id="tinta">
      <g filter="url(#borde)">
        <rect x="40" y="40" width="432" height="432" rx="22" fill="#fff" />
        <text x="256" y="236" text-anchor="middle" font-family="S" font-weight="800" font-size="196" fill="#000">家</text>
        <text x="256" y="436" text-anchor="middle" font-family="S" font-weight="800" font-size="196" fill="#000">系</text>
      </g>
      <rect width="512" height="512" fill="#000" filter="url(#poros)" />
      <rect width="512" height="512" fill="#000" filter="url(#manchas)" />
    </mask>
  </defs>
  <rect width="512" height="512" fill="#d9381e" mask="url(#tinta)" />
</svg>`;

const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const p = await b.newPage({ viewport: { width: 512, height: 512 } });
async function dibujar(poros) {
  await p.setContent(html(poros));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  return p.locator('svg').screenshot({ omitBackground: true });
}
// Con poros y borde más gastado para el ticket y el pie; más limpio para tamaños chicos (favicon).
const gastado = await dibujar(true);
const limpio = await dibujar(false);
await b.close();

fs.writeFileSync(path.join(raiz, 'herramientas', 'sello-original.png'), gastado);
for (const w of [96, 192]) {
  await sharp(gastado).resize(w).webp({ quality: 86, alphaQuality: 90 }).toFile(path.join(publico, `sello-${w}.webp`));
}
await sharp(limpio).resize(32).png().toFile(path.join(publico, 'favicon-32.png'));
// Ícono de inicio en iPhone: el sello sobre sumi, sin transparencia.
await sharp({ create: { width: 180, height: 180, channels: 4, background: '#121110' } })
  .composite([{ input: await sharp(limpio).resize(150).toBuffer(), left: 15, top: 15 }]).png().toFile(path.join(publico, 'apple-touch-icon.png'));
for (const f of ['sello-96.webp', 'sello-192.webp', 'favicon-32.png', 'apple-touch-icon.png']) {
  console.log(f, (fs.statSync(path.join(publico, f)).size / 1024).toFixed(1), 'KB');
}
