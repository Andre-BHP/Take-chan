// Recorrido del menú con axe en cada estado: sugerencia de huevo, detalle de tecla (diálogo) y vista de lista.
// Guarda capturas de revisión en entregables/avances/<fecha>_paso-<paso>_<estado>_<ancho>.png.
// Uso: node herramientas/menu-estados.mjs <url-base> <paso>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg, paso] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const fecha = new Date().toLocaleDateString('sv-SE');
const salida = (estado, w) => path.join(raiz, 'entregables', 'avances', `${fecha}_paso-${paso}_${estado}_${w}.png`);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;

async function revisar(p, nombre) {
  await p.addScriptTag({ content: axe }).catch(() => {});
  const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.impact} ${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`));
  fallas += v.length;
  console.log(`axe ${nombre}:`, v.length ? '\n  ' + v.join('\n  ') : 'sin violaciones');
}

for (const w of [390, 1440]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); if (!sessionStorage.getItem('limpio')) { localStorage.removeItem('take-vista'); sessionStorage.setItem('limpio', '1'); } } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(base + '/menu', { waitUntil: 'networkidle' });

  // 1. Primer ramen: aparece la sugerencia.
  await p.getByRole('button', { name: /^Agregar Iekei clásico/ }).click();
  await p.waitForTimeout(300);
  const sug = p.locator(w < 1100 ? '.sugerencia.flotante' : '.sugerencia.en-panel');
  console.log(w, 'sugerencia visible:', await sug.isVisible());
  await revisar(p, `sugerencia ${w}`);
  await p.screenshot({ path: salida('sugerencia', w) });
  await sug.getByRole('button', { name: 'Agregar' }).click();
  await p.waitForTimeout(200);
  console.log(w, 'huevo en el pedido:', await p.evaluate(() => document.body.innerText.includes('Huevo marinado')), '· sugerencia oculta:', !(await sug.isVisible()));

  // 2. Detalle de una tecla con el botón "i".
  await p.getByRole('button', { name: 'Ver detalle de Gyoza' }).click();
  await p.waitForTimeout(400);
  console.log(w, 'detalle abierto:', await p.locator('dialog.detalle').evaluate((d) => d.open));
  await revisar(p, `detalle ${w}`);
  await p.screenshot({ path: salida('detalle', w) });
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  console.log(w, 'detalle cerrado con Esc:', !(await p.locator('dialog.detalle').evaluate((d) => d.open)));

  // 3. Mantener presionada una tecla abre el detalle y no agrega.
  const tecla = p.getByRole('button', { name: /^Agregar Arroz blanco/ });
  await tecla.scrollIntoViewIfNeeded();
  const caja = await tecla.boundingBox();
  await p.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
  await p.mouse.down(); await p.waitForTimeout(650); await p.mouse.up();
  await p.waitForTimeout(300);
  const abierto = await p.locator('dialog.detalle').evaluate((d) => d.open);
  const arroz = await p.evaluate(() => [...document.querySelectorAll('.lineas .linea-nombre')].some((e) => e.textContent.includes('Arroz')));
  console.log(w, 'presión larga abre detalle:', abierto, '· no agregó arroz:', !arroz);
  if (!abierto || arroz) fallas++;
  await p.keyboard.press('Escape');

  // 4. Vista de lista, recordada al recargar.
  await p.getByRole('button', { name: 'Lista' }).click();
  await p.waitForTimeout(300);
  await revisar(p, `lista ${w}`);
  await p.screenshot({ path: salida('lista', w) });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  const recordada = await p.locator('.lista').isVisible();
  console.log(w, 'lista recordada:', recordada);
  if (!recordada) fallas++;
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(w, 'scrollWidth', sw, sw > w ? 'SCROLL HORIZONTAL' : 'ok');
  if (sw > w) fallas++;
  await ctx.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
