// Prueba de la versión en inglés: selector ES · EN, navegación dentro de /en, lang y que no quede español suelto.
// Uso: node herramientas/idiomas.mjs [http://localhost:4333/Take-chan] [paso]
import { chromium } from 'playwright-core';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg = 'http://localhost:4333/Take-chan', paso = ''] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const fecha = new Date().toLocaleDateString('sv-SE');
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (c, t) => { console.log((c ? 'ok    ' : 'FALLA ') + t); if (!c) fallas++; };

// Lo que puede quedar en español en inglés: nombres propios, direcciones, el aviso fijo de la propuesta y el mensaje al local.
const permitidos = [/Propuesta no oficial de sitio para Take-chan Ramen/g, /Calz\. Córdoba 24[^.·\n]*/g, /Prisciliano Sánchez 1110[^.·\n]*/g, /Super Manzana El Álamo/g, /Niños Héroes/g, /San Pedro Tlaquepaque/g, /Americana/g, /Tlaquepaque/g, /Hola, Take-chan[\s\S]*/g];
const espanol = /\b(el|la|los|las|del|que|para|con|una|pedido|sucursal|cómo|horario|también|aquí)\b/i;

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
const p = await ctx.newPage();
await p.goto(base + '/', { waitUntil: 'networkidle' });
const diccionario = [];
p.on('request', (r) => { if (/chunk-.*\.js/.test(r.url())) diccionario.push(r.url()); });
ok((await p.locator('html').getAttribute('lang')) === 'es-MX', 'portada en español: lang es-MX');

// Selector EN: misma página en inglés, sin recargar.
await p.getByRole('link', { name: /^EN/ }).click();
await p.waitForURL(/\/en\/?$/);
await p.waitForTimeout(500);
ok((await p.locator('html').getAttribute('lang')) === 'en', 'al tocar EN: /en con lang en');
ok((await p.locator('h1').innerText()).includes('Iekei ramen'), 'titular en inglés: ' + (await p.locator('h1').innerText()).replace(/\s+/g, ' '));
await p.getByRole('link', { name: 'Build your order' }).first().click();
await p.waitForURL(/\/en\/menu/);
await p.waitForTimeout(500);
ok((await p.locator('h1').innerText()) === 'Menu & order', 'Build your order lleva a /en/menu');
await p.getByRole('link', { name: /^ES/ }).click();
await p.waitForURL(/\/menu$/);
await p.waitForTimeout(400);
ok(!p.url().includes('/en') && (await p.locator('h1').innerText()) === 'Menú y pedido', 'al tocar ES: /menu en español');
await ctx.close();

// Sin español suelto en las páginas en inglés (carga directa, como llega un turista).
for (const ruta of ['/en', '/en/menu', '/en/tlaquepaque', '/en/americana', '/en/privacidad', '/en/accesibilidad', '/en/creditos']) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await c.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const pg = await c.newPage();
  await pg.goto(base + ruta, { waitUntil: 'networkidle' });
  await pg.waitForTimeout(400);
  if (ruta === '/en/menu') { await pg.getByRole('button', { name: /^Add Classic Iekei/ }).click(); await pg.getByRole('button', { name: 'Print ticket' }).click(); await pg.waitForTimeout(300); }
  let texto = await pg.evaluate(() => [...document.querySelectorAll('body *:not(script):not(style)')].filter((e) => e.children.length === 0 && e.closest('[lang="ja"]') === null && getComputedStyle(e).display !== 'none').map((e) => e.textContent.trim()).filter(Boolean).join('\n'));
  for (const r of permitidos) texto = texto.replace(r, '');
  const restos = texto.split('\n').filter((l) => espanol.test(l));
  ok(restos.length === 0, `${ruta}: sin español suelto${restos.length ? ' → ' + restos.slice(0, 4).join(' | ') : ''}`);
  if (paso && ruta === '/en') await pg.screenshot({ path: path.join(raiz, 'entregables/avances', `${fecha}_paso-${paso}_en_1440.png`) });
  await c.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
