// Prueba del QR animado del sitio ("Pídelo desde tu celular", carta dis-081):
// - en escritorio se imprime fila por fila en menos de 1.2 s y al final queda escaneable (se guarda para escaneo.mjs);
// - con movimiento reducido aparece quieto y completo;
// - en celular no se muestra; en /en/menu apunta a /en/menu.
// Uso: node herramientas/qr-web.mjs [http://localhost:4333/Take-chan] [paso]
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import jsQR from 'jsqr';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg = 'http://localhost:4333/Take-chan', paso = ''] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const qr = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/qr.json'), 'utf8'));
const fecha = new Date().toLocaleDateString('sv-SE');
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (c, t) => { console.log((c ? 'ok    ' : 'FALLA ') + t); if (!c) fallas++; };
const leer = async (png) => {
  const { data, info } = await sharp(png).flatten({ background: '#ffffff' }).extend({ top: 30, bottom: 30, left: 30, right: 30, background: '#ffffff' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null;
};

for (const [movimiento, ruta, url] of [['no-preference', '/menu', qr.es.url], ['reduce', '/menu', qr.es.url], ['no-preference', '/en/menu', qr.en.url]]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: movimiento });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(base + ruta, { waitUntil: 'networkidle' });
  const svg = p.locator('app-qr-pedido svg');
  await svg.waitFor({ timeout: 5000 });
  // Animaciones declaradas en el QR (Web Animations API): cuántas y cuánto tarda la última en terminar.
  const anim = await svg.evaluate((s) => {
    const a = s.getAnimations({ subtree: true });
    return { n: a.length, fin: Math.max(0, ...a.map((x) => { const t = x.effect.getTiming(); return (t.delay ?? 0) + (Number(t.duration) || 0); })) };
  });
  if (movimiento === 'reduce') ok(anim.n === 0, `${ruta}: con movimiento reducido no hay animación (${anim.n})`);
  else if (ruta === '/menu') ok(anim.n > 40 && anim.fin <= 1200, `${ruta}: se imprime fila por fila (${anim.n} animaciones, termina a los ${Math.round(anim.fin)} ms)`);
  await p.waitForTimeout(1300);
  const leido = await leer(await svg.screenshot());
  ok(leido === url, `${ruta} (${movimiento === 'reduce' ? 'movimiento reducido, quieto' : 'animado, ya impreso'}): QR leído ${leido ?? 'nada'}`);
  if (movimiento === 'no-preference' && ruta === '/menu') {
    fs.writeFileSync(path.join(raiz, 'entregables', 'impresos', 'web-menu.qr0.png'), await svg.screenshot());
    if (paso) await p.locator('section.cabeza').screenshot({ path: path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}_qr-web_1440.png`) });
  }
  await ctx.close();
}
// Celular: no se muestra.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(base + '/menu', { waitUntil: 'networkidle' });
  ok(!(await p.locator('app-qr-pedido').isVisible()) && (await p.locator('app-qr-pedido svg').count()) === 0, 'celular: no se muestra ni se dibuja');
  await ctx.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
