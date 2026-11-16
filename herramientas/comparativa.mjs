// Comparativa antes/después del rediseño: entregables/avances/comparativa.png
// Uso: node herramientas/comparativa.mjs
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const img = (r) => 'data:image/png;base64,' + fs.readFileSync(path.join(raiz, r)).toString('base64');
const marco = (titulo, archivo, alto) =>
  `<figure><figcaption>${titulo}</figcaption><div class="marco" style="height:${alto}px"><img src="${img(archivo)}"></div></figure>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 2000px; background: #121110; color: #f3eee4; font: 500 22px/1.3 system-ui, sans-serif; padding: 48px; display: grid; gap: 56px; }
  h1 { font-size: 40px; } h2 { font-size: 26px; color: #a59c90; margin-bottom: 16px; }
  .par { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .cuatro { grid-template-columns: repeat(4, 1fr); }
  figcaption { font-size: 20px; margin-bottom: 10px; color: #a59c90; }
  .marco { overflow: hidden; border: 1px solid #37322d; border-radius: 10px; background: #000; }
  .marco img { width: 100%; display: block; }
</style></head><body>
  <h1>Take-chan Ramen · propuesta no oficial · antes y después del rediseño</h1>
  <section><h2>Portada en escritorio (1440 px, primera pantalla)</h2><div class="par">
    ${marco('Antes', 'entregables/avances/antes/inicio_1440.png', 540)}
    ${marco('Después', 'entregables/capturas/inicio_1440.png', 540)}
  </div></section>
  <section><h2>Celular (390 px, primera pantalla): portada y menú</h2><div class="par cuatro">
    ${marco('Antes · portada', 'entregables/avances/antes/inicio_390.png', 820)}
    ${marco('Después · portada', 'entregables/capturas/inicio_390.png', 820)}
    ${marco('Antes · menú', 'entregables/avances/antes/menu_390.png', 820)}
    ${marco('Después · menú', 'entregables/capturas/menu_390.png', 820)}
  </div></section>
  <section><h2>Máquina de tickets en escritorio</h2><div class="par">
    ${marco('Antes', 'entregables/avances/antes/menu_1440.png', 900)}
    ${marco('Después', 'entregables/capturas/menu_1440.png', 900)}
  </div></section>
</body></html>`;
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const p = await b.newPage({ viewport: { width: 2000, height: 1000 } });
await p.setContent(html, { waitUntil: 'load' });
await p.screenshot({ path: path.join(raiz, 'entregables', 'avances', 'comparativa.png'), fullPage: true });
await b.close();
console.log('comparativa.png');
