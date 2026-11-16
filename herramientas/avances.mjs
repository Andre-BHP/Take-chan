// Capturas de avance para PROGRESO.md: entregables/avances/AAAA-MM-DD_paso-N_<ancho>.png (360 y 1440 px).
// Uso: node herramientas/avances.mjs <url-base> <paso> [ruta=/]
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const [base, paso, ruta = '/'] = process.argv.slice(2);
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fecha = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
const sufijo = ruta === '/' ? '' : '_' + ruta.replace(/\W+/g, '');
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
for (const w of [360, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 780 : 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base.replace(/\/$/, '') + ruta, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '* { content-visibility: visible !important; }' });
    await p.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
    scrollTo(0, 0);
  });
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(400);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  const archivo = path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}${sufijo}_${w}.png`);
  await p.screenshot({ path: archivo, fullPage: true });
  console.log(path.basename(archivo), 'scrollWidth', sw, sw > w ? 'SCROLL HORIZONTAL' : 'ok');
  await ctx.close();
}
await b.close();
