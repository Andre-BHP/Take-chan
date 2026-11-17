// Prueba de los datos editables desde la hoja (CSV), sobre el ensayo oficial que apunta a public/datos-ejemplo/.
// Cada caso cambia la respuesta de la hoja interceptando la petición; nada sale a internet.
// Uso: node herramientas/hoja.mjs [http://localhost:4344] [paso]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg = 'http://localhost:4344', paso = ''] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const ejemplo = (n) => fs.readFileSync(path.join(raiz, 'sitio/public/datos-ejemplo', n), 'utf8');
const fecha = new Date().toLocaleDateString('sv-SE');
const captura = (n) => path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}_${n}.png`);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (cond, txt) => { console.log((cond ? 'ok    ' : 'FALLA ') + txt); if (!cond) fallas++; };

/** Contexto nuevo (sin caché) con respuestas de la hoja a la medida. */
async function abrir(ruta, hoja = {}, ancho = 1440) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const pedidos = [];
  await ctx.route(/datos-ejemplo\/(\w+)\.csv/, async (r) => {
    const tab = r.request().url().match(/datos-ejemplo\/(\w+)\.csv/)[1];
    pedidos.push(tab);
    const h = hoja[tab];
    if (h === 'falla') return r.abort();
    if (h?.esperar) await new Promise((l) => setTimeout(l, h.esperar));
    return r.fulfill({ status: 200, contentType: 'text/csv; charset=utf-8', body: typeof h === 'string' ? h : ejemplo(tab + '.csv') });
  });
  const p = await ctx.newPage();
  await p.goto(base + ruta, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  return { ctx, p, pedidos };
}
const tecla = (p, nombre) => p.locator('.tecla', { hasText: nombre }).first();

// 1. Hoja de ejemplo: el arroz agotado se apaga con 売切 y no se puede agregar.
{
  const { ctx, p } = await abrir('/menu');
  const arroz = tecla(p, 'Arroz blanco');
  ok(await arroz.isDisabled(), 'arroz agotado: tecla deshabilitada');
  ok((await arroz.locator('.urikire').innerText()).includes('売切'), 'arroz agotado: etiqueta 売切');
  ok((await arroz.getAttribute('aria-label')).includes('agotado'), 'arroz agotado: el lector de pantalla dice "agotado"');
  await arroz.scrollIntoViewIfNeeded();
  if (paso) await p.locator('.categoria', { hasText: 'Arroz blanco' }).screenshot({ path: captura('agotado_1440') });
  await p.getByRole('button', { name: 'Lista' }).click();
  await p.waitForTimeout(300);
  ok(await p.locator('.lista-item', { hasText: 'Arroz blanco' }).locator('.lista-agotado').isVisible(), 'arroz agotado también en la vista de lista');
  await ctx.close();
}
// 2. Cambio de precio desde la hoja: la tecla y el total usan el nuevo.
{
  const menu = ejemplo('menu.csv').replace(/(Iekei clásico,"[^"]*",)165,/, '$1170,');
  const { ctx, p } = await abrir('/menu', { menu });
  ok((await tecla(p, 'Iekei clásico').locator('.led').innerText()).includes('170'), 'precio de la hoja en la tecla ($170)');
  await tecla(p, 'Iekei clásico').click();
  ok((await p.locator('.subtotal').innerText()).includes('170'), 'precio de la hoja en el total');
  await ctx.close();
}
// 3. La hoja falla o tarda más de 3 s: se quedan los JSON.
for (const [caso, menu] of [['falla', 'falla'], ['tarda 5 s', { esperar: 5000 }]]) {
  const { ctx, p } = await abrir('/menu', { menu });
  await p.waitForTimeout(caso === 'falla' ? 0 : 3200);
  ok(!(await tecla(p, 'Arroz blanco').isDisabled()) && (await tecla(p, 'Iekei clásico').locator('.led').innerText()).includes('165'), `hoja ${caso}: se usa el menú del build`);
  await ctx.close();
}
// 4. Copia guardada: la segunda carga no vuelve a pedir la hoja (10 min).
{
  const { ctx, p, pedidos } = await abrir('/menu');
  const antes = pedidos.filter((t) => t === 'menu').length;
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  ok(antes === 1 && pedidos.filter((t) => t === 'menu').length === 1 && (await tecla(p, 'Arroz blanco').isDisabled()), 'segunda carga desde la copia guardada, sin pedir la hoja');
  await ctx.close();
}
// 5. Aviso vigente: banda arriba, se cierra con la ✕ y no vuelve.
{
  const { ctx, p } = await abrir('/', {}, 390);
  const banda = p.locator('app-banda-aviso .banda');
  ok(await banda.isVisible(), 'aviso vigente: banda visible');
  if (paso) await p.screenshot({ path: captura('aviso_390') });
  await p.getByRole('button', { name: 'Cerrar el aviso' }).click();
  await p.waitForTimeout(300);
  ok(!(await banda.isVisible()), 'la ✕ cierra la banda');
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  ok(!(await banda.isVisible()), 'cerrada, no vuelve al recargar');
  await ctx.close();
}
// 6. Aviso vencido o futuro: no se muestra.
for (const [caso, fechas] of [['vencido', '2026-01-01,2026-01-31'], ['futuro', '2099-01-01,2099-01-02']]) {
  const { ctx, p } = await abrir('/', { aviso: `texto,desde,hasta\nAviso de prueba,${fechas}\n` });
  ok(!(await p.locator('app-banda-aviso .banda').isVisible()), `aviso ${caso}: sin banda`);
  await ctx.close();
}
// 7. Horario desde la hoja: domingo cerrado aparece en la ficha.
{
  const horario = ejemplo('horario.csv').replace('tlaquepaque,domingo,12:00,17:00', 'tlaquepaque,domingo,,');
  const { ctx, p } = await abrir('/tlaquepaque', { horario });
  const filas = (await p.locator('table.horario tr').allInnerTexts()).map((t) => t.replace(/\s+/g, ' ').trim());
  ok(filas.some((f) => /Domingo Cerrado/i.test(f)) && filas.some((f) => /Lunes a sábado 12:00 a 17:00/i.test(f)), 'horario de la hoja: ' + filas.join(' | '));
  await ctx.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
