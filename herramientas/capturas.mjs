// Capturas de página completa de todas las rutas a 360, 390 y 1440 px: entregables/capturas/<ruta>_<ancho>.png
// Uso: node herramientas/capturas.mjs <url-base>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base = process.argv[2].replace(/\/$/, '');
const salida = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'entregables', 'capturas');
fs.mkdirSync(salida, { recursive: true });
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
for (const ruta of ['/', '/menu', '/tlaquepaque', '/americana']) {
  for (const w of [360, 390, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 800 : 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    const p = await ctx.newPage();
    await p.goto(base + ruta, { waitUntil: 'networkidle' });
      await p.evaluate(async () => {
    document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); }
    const listas = () => [...document.images].every((i) => i.complete && i.naturalWidth > 0);
    for (let n = 0; n < 60 && !listas(); n++) await new Promise((r) => setTimeout(r, 100));
    scrollTo(0, 0);
  });
  await p.waitForLoadState('networkidle');
  await p.waitForTimeout(300);
    const nombre = `${ruta === '/' ? 'inicio' : ruta.slice(1)}_${w}.png`;
    await p.screenshot({ path: path.join(salida, nombre), fullPage: true });
    console.log(nombre);
    await ctx.close();
  }
}
await b.close();
