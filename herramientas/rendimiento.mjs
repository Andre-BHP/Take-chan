// Rendimiento del movimiento: CLS, tareas largas (>50 ms) y cuadros por segundo al hacer scroll por la portada.
// Uso: node herramientas/rendimiento.mjs <url-base> [ancho=390]
import { chromium } from 'playwright-core';
const [base, anchoTxt = '390'] = process.argv.slice(2);
const w = Number(anchoTxt);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 } });
const p = await ctx.newPage();
await p.addInitScript(() => {
  window.__cls = 0; window.__largas = []; window.__cuadros = [];
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__largas.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
});
// Con intro (primera visita), como la vería un cliente.
await p.goto(base.replace(/\/$/, '') + '/', { waitUntil: 'load' });
await p.waitForTimeout(2500);
const largasCarga = await p.evaluate(() => window.__largas.length);
await p.evaluate(() => { window.__largas = []; window.__medir = true; const t = (ts) => { window.__cuadros.push(ts); if (window.__medir) requestAnimationFrame(t); }; requestAnimationFrame(t); });
for (let i = 0; i < 60; i++) { await p.mouse.wheel(0, 90); await p.waitForTimeout(50); }
await p.waitForTimeout(800);
const r = await p.evaluate(() => {
  window.__medir = false;
  const c = window.__cuadros; const dif = c.slice(1).map((t, i) => t - c[i]);
  const fps = dif.length ? 1000 / (dif.reduce((a, x) => a + x, 0) / dif.length) : 0;
  const lentos = dif.filter((d) => d > 34).length;
  return { cls: +window.__cls.toFixed(4), largasScroll: window.__largas, fps: Math.round(fps), cuadrosLentos: lentos, cuadros: dif.length };
});
console.log(`${w} px: CLS ${r.cls} · tareas largas en la carga ${largasCarga} · en el scroll ${r.largasScroll.length} ${JSON.stringify(r.largasScroll)} · ${r.fps} fps promedio · ${r.cuadrosLentos} de ${r.cuadros} cuadros de más de 34 ms`);
await b.close();
