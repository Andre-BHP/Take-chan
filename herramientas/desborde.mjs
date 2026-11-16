// Lista elementos que se salen del ancho de la ventana: node herramientas/desborde.mjs <url> [ancho=360]
import { chromium } from 'playwright-core';
const [url, ancho = '360'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const ctxI = await b.newContext({ viewport: { width: Number(ancho), height: 800 } });
await ctxI.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
const p = await ctxI.newPage();
await p.goto(url, { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const w = document.documentElement.clientWidth;
  return [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > w + 1)
    .slice(0, 15).map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')} → ${Math.round(e.getBoundingClientRect().right)}`).join('\n') + `\nscrollWidth ${document.documentElement.scrollWidth}`;
}));
await b.close();
