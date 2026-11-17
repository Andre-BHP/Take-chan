// Prueba de las estadísticas (GoatCounter por URL): apagadas en la propuesta; en el ensayo oficial, cada visita y
// cada evento llegan al contador local de prueba (http://localhost:4344/__conteo). Nada sale a internet.
// Uso: node herramientas/estadisticas.mjs [http://localhost:4333/Take-chan] [http://localhost:4344]
import { chromium } from 'playwright-core';
const [propuestaArg = 'http://localhost:4333/Take-chan', oficialArg = 'http://localhost:4344'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (c, t) => { console.log((c ? 'ok    ' : 'FALLA ') + t); if (!c) fallas++; };

async function recorrido(base) {
  // Sin service worker: lo que pide un service worker no pasa por la interceptación de Playwright.
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} window.open = () => null; });
  const conteos = [];
  await ctx.route(/goatcounter|__conteo/, (r) => { const u = new URL(r.request().url()); conteos.push(Object.fromEntries(u.searchParams)); return r.fulfill({ status: 200, body: '' }); });
  const p = await ctx.newPage();
  await p.goto(base + '/menu?ref=mesa', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.getByRole('button', { name: /^Agregar Iekei clásico/ }).click();
  await p.getByRole('button', { name: 'Imprimir ticket' }).click();
  await p.waitForTimeout(300);
  await p.getByRole('button', { name: /Enviar por WhatsApp/ }).click();
  await p.getByRole('link', { name: /Sucursales/ }).first().click();
  await p.waitForTimeout(800);
  await p.goto(base + '/links', { waitUntil: 'networkidle' });
  await p.getByRole('link', { name: /TikTok/ }).click({ modifiers: ['Control'] }).catch(() => {});
  await p.waitForTimeout(500);
  await ctx.close();
  return conteos;
}

const sinNada = await recorrido(propuestaArg.replace(/\/$/, ''));
ok(sinNada.length === 0, `propuesta: sin estadísticas (${sinNada.length} envíos)`);

const c = await recorrido(oficialArg.replace(/\/$/, ''));
const visitas = c.filter((x) => !x.e);
const eventos = c.filter((x) => x.e === 'true').map((x) => x.p);
ok(visitas.some((v) => v.p === '/menu' && v.q === '?ref=mesa'), 'oficial: visita a /menu con la campaña del QR de mesa (ref=mesa)');
ok(visitas.some((v) => v.p === '/' || v.p === ''), 'oficial: visita a la portada al navegar sin recargar');
ok(visitas.some((v) => v.p === '/links'), 'oficial: visita a /links');
for (const e of ['tecla/iekei-clasico', 'ticket-impreso', 'whatsapp-enviado', 'links/tiktok']) ok(eventos.includes(e), `oficial: evento ${e}`);
ok(c.every((x) => !('cookie' in x)), 'oficial: sin cookies ni identificadores en los envíos');
console.log('  envíos:', c.map((x) => (x.e ? 'evento ' : 'visita ') + x.p + (x.q ? ' ' + x.q : '')).join(' | '));
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
