// Revisión de la vista previa al compartir y de /links.
// - Cada página lleva og:title, og:description, og:image (absoluta, 1200 × 630, menos de 300 KB) y twitter:card.
// - /links pesa menos de 150 KB transferidos en celular y no tiene violaciones de axe.
// - Dibuja una tarjeta de vista previa con las etiquetas reales (simulación genérica, no la de WhatsApp).
// Uso: node herramientas/compartir.mjs <url-base> <carpeta-del-build> <paso>
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg, buildArg, paso] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const build = path.resolve(raiz, buildArg);
const fecha = new Date().toLocaleDateString('sv-SE');
let fallas = 0;
const ok = (cond, txt) => { console.log((cond ? 'ok    ' : 'FALLA ') + txt); if (!cond) fallas++; };

const rutas = ['/', '/menu', '/tlaquepaque', '/americana', '/links'];
const tarjetas = [];
for (const r of rutas) {
  const html = fs.readFileSync(path.join(build, r === '/' ? 'index.html' : r.slice(1) + '/index.html'), 'utf8');
  const meta = (k) => html.match(new RegExp(`<meta (?:property|name)="${k}" content="([^"]*)"`))?.[1] ?? '';
  const img = meta('og:image');
  const local = path.join(build, img.replace(/^https?:\/\/[^/]+(\/Take-chan)?\//, ''));
  const existe = fs.existsSync(local);
  const dims = existe ? await sharp(local).metadata() : {};
  const kb = existe ? fs.statSync(local).size / 1024 : 0;
  ok(meta('og:title') && meta('og:description') && /^https:\/\//.test(img) && meta('twitter:card') === 'summary_large_image', `${r}: etiquetas completas (${meta('og:title')})`);
  ok(existe && dims.width === 1200 && dims.height === 630 && kb < 300, `${r}: imagen ${path.basename(path.dirname(local))}/${path.basename(local)} ${dims.width}×${dims.height}, ${kb.toFixed(0)} KB`);
  tarjetas.push({ titulo: meta('og:title'), desc: meta('og:description'), img: existe ? `data:image/jpeg;base64,${fs.readFileSync(local).toString('base64')}` : '', host: new URL(img || 'https://sin-imagen').host });
}

const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
// Peso y axe de /links en celular.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  let bytes = 0;
  cdp.on('Network.loadingFinished', (e) => (bytes += e.encodedDataLength));
  await p.goto(base + '/links', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  ok(bytes / 1024 < 150, `/links pesa ${(bytes / 1024).toFixed(0)} KB (límite 150)`);
  ok(!(await p.evaluate(() => document.documentElement.classList.contains('con-intro'))), '/links abre sin la intro');
  await p.addScriptTag({ content: axe });
  const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => x.id));
  ok(v.length === 0, `/links axe: ${v.length ? v.join(', ') : 'sin violaciones'}`);
  await p.screenshot({ path: path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}_links_390.png`) });
  await ctx.close();
}
// Tarjetas de vista previa (simulación con las etiquetas reales).
{
  const p = await b.newPage({ viewport: { width: 1100, height: 900 } });
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 24px; background: #e9e6df; font: 14px/1.35 system-ui, sans-serif; display: grid; grid-template-columns: repeat(2, 500px); gap: 20px; }
    .c { background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
    .c img { display: block; width: 100%; aspect-ratio: 1200 / 630; object-fit: cover; }
    .t { padding: 10px 12px 12px; } .h { color: #666; font-size: 12px; text-transform: lowercase; } .n { font-weight: 600; margin: 2px 0; } .d { color: #444; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    h1 { grid-column: 1 / -1; margin: 0; font-size: 15px; color: #333; }
  </style><h1>Simulación de vista previa con las etiquetas reales de cada página (no es la app de WhatsApp)</h1>` +
    tarjetas.map((t) => `<div class="c"><img src="${t.img}"><div class="t"><div class="h">${t.host}</div><div class="n">${t.titulo}</div><div class="d">${t.desc}</div></div></div>`).join(''));
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}_vista-previa.png`), fullPage: true });
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
