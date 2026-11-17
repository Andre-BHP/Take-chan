// Revisión de N8: reloj vivo con hora fija, fachada de TikTok (sin pedir nada a TikTok antes del clic),
// horario agrupado de la sucursal, estado vacío del pedido y etiqueta del bento. Uso: node herramientas/detalles.mjs <url-base> <paso>
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg, paso] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const fecha = new Date().toLocaleDateString('sv-SE');
const salida = (n) => path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}_${n}.png`);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (cond, txt) => { console.log((cond ? 'ok   ' : 'FALLA ') + txt); if (!cond) fallas++; };

// Reloj: miércoles 14:47 en Guadalajara (20:47 UTC).
{
  // Sin service worker: lo que pasa por él no aparece en los eventos de la página.
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.clock.install({ time: new Date('2026-11-18T20:47:00Z') });
  const pedidosTiktok = [];
  p.on('request', (r) => { if (/tiktok/.test(r.url())) pedidosTiktok.push(r.url()); });
  await p.route(/tiktok\.com/, (r) => r.abort());
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.clock.runFor(1500);
  const t1 = await p.locator('.heroe-estado').innerText();
  ok(/cierra en 2 h 13 min/.test(t1), 'reloj a las 14:47: ' + t1.trim());
  await p.clock.runFor(61_000);
  const t2 = await p.locator('.heroe-estado').innerText();
  ok(/cierra en 2 h 12 min/.test(t2), 'un minuto después: ' + t2.trim());
  ok(pedidosTiktok.length === 0, 'sin pedidos a TikTok antes del clic (' + pedidosTiktok.length + ')');
  const fachada = p.locator('.tiktok-fachada');
  await fachada.scrollIntoViewIfNeeded();
  await p.locator('.tiktok').screenshot({ path: salida('tiktok_1440') });
  await fachada.click();
  await p.waitForTimeout(300);
  ok(await p.locator('blockquote.tiktok-embed').count() === 1, 'al tocar aparece el embed oficial');
  ok(pedidosTiktok.some((u) => u.includes('embed.js')), 'y se pide embed.js de TikTok');
  // Etiqueta del bento con el puntero.
  const celda = p.locator('.bento .celda').nth(1);
  await celda.scrollIntoViewIfNeeded();
  const c = await celda.boundingBox();
  await p.mouse.move(c.x + c.width * 0.6, c.y + c.height * 0.4);
  await p.waitForTimeout(400);
  ok(await p.locator('.bento .celda').nth(1).locator('.ver-menu').evaluate((e) => getComputedStyle(e).opacity === '1'), 'etiqueta "Ver en el menú" visible al pasar el puntero');
  await p.locator('.pedir').screenshot({ path: salida('bento_1440') });
  // Cerrado: 20:30.
  await p.clock.setFixedTime(new Date('2026-11-19T02:30:00Z'));
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const t3 = await p.locator('.heroe-estado').innerText();
  ok(/abre mañana a las 12:00/.test(t3), 'cerrado a las 20:30: ' + t3.trim());
  await ctx.close();
}
// Horario de la sucursal y estado vacío del pedido.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(base + '/tlaquepaque', { waitUntil: 'networkidle' });
  const filas = await p.locator('table.horario tr').allInnerTexts();
  ok(filas.length === 1 && /Todos los días/.test(filas[0]), 'horario en una fila: ' + filas.join(' | ').replace(/\s+/g, ' '));
  await p.goto(base + '/menu', { waitUntil: 'networkidle' });
  const vacio = p.locator('.panel .vacio');
  await vacio.scrollIntoViewIfNeeded();
  ok(await vacio.isVisible(), 'estado vacío con la mini máquina');
  await p.locator('.panel').screenshot({ path: salida('vacio_390') });
  await ctx.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
