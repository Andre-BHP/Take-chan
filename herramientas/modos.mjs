// Prueba del interruptor de modo (PLAN_NIVEL_4, tabla 1): compara el build de la propuesta con el ensayo del oficial.
// Necesita los dos builds y sus servidores:
//   npm --prefix sitio run build:pages           → node herramientas/estatico.mjs sitio/dist/pages/browser 4333 /Take-chan
//   npm --prefix sitio run build:prueba-oficial  → node herramientas/estatico.mjs sitio/dist/prueba-oficial/browser 4344
// Uso: node herramientas/modos.mjs [http://localhost:4333/Take-chan] [http://localhost:4344]
import { chromium } from 'playwright-core';

const [propuesta = 'http://localhost:4333/Take-chan', oficial = 'http://localhost:4344'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;
const ok = (cond, txt) => { console.log((cond ? 'ok    ' : 'FALLA ') + txt); if (!cond) fallas++; };

async function revisar(base, esOficial) {
  const nombre = esOficial ? 'oficial' : 'propuesta';
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  // window.open se registra en lugar de abrir: la prueba no sale a WhatsApp ni a la red.
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} window.open = (u) => { window.__abierto = String(u); return null; }; });
  const p = await ctx.newPage();
  await ctx.route(/wa\.me|whatsapp\.com/, (r) => r.abort());
  await p.goto(base + '/', { waitUntil: 'networkidle' });

  const aviso = await p.getByText('Propuesta no oficial de sitio para Take-chan Ramen').count();
  ok(esOficial ? aviso === 0 : aviso > 0, `${nombre}: aviso de propuesta ${aviso ? 'presente' : 'ausente'}`);
  const nota = await p.getByText('Propuesta: menú, precios y fotos de ejemplo').count();
  ok(esOficial ? nota === 0 : nota === 1, `${nombre}: nota de ejemplo ${nota}`);
  const robots = await p.locator('meta[name=robots]').getAttribute('content');
  ok(esOficial ? robots === 'index, follow' : robots === 'noindex, nofollow', `${nombre}: robots "${robots}"`);
  const canonica = await p.locator('link[rel=canonical]').getAttribute('href').catch(() => null);
  ok(esOficial ? canonica === 'https://ejemplo.test/' : canonica === null, `${nombre}: canónica ${canonica}`);
  const robotsTxt = await (await p.request.get(base + '/robots.txt')).text();
  ok(esOficial ? /Allow: \/\n\nSitemap: https:\/\/ejemplo\.test\/sitemap\.xml/.test(robotsTxt) : /Disallow: \//.test(robotsTxt), `${nombre}: robots.txt ${JSON.stringify(robotsTxt.trim())}`);
  const sitemap = await p.request.get(base + '/sitemap.xml');
  const sitemapTxt = sitemap.ok() ? await sitemap.text() : '';
  ok(esOficial ? (sitemapTxt.match(/<loc>https:\/\/ejemplo\.test\//g) ?? []).length >= 4 : !sitemapTxt.includes('<urlset'), `${nombre}: sitemap ${sitemapTxt.includes('<urlset') ? (sitemapTxt.match(/<loc>/g) ?? []).length + ' URLs' : 'ausente'}`);
  const rotulos = await p.locator('.rotulo').count();
  ok(rotulos > 0, `${nombre}: rótulos "Imagen ilustrativa" en fotos de stock (${rotulos})`);
  ok((await p.locator('script[src*="goatcounter"]').count()) === 0, `${nombre}: sin estadísticas (sin código configurado)`);

  // WhatsApp: demostración en la propuesta; enlace wa.me con el número del entorno en el oficial.
  await p.goto(base + '/menu', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: /^Agregar Iekei clásico/ }).click();
  await p.getByRole('button', { name: 'Imprimir ticket' }).click();
  await p.waitForTimeout(300);
  const total = await p.locator('.ticket .total span').first().innerText();
  ok(esOficial ? total === 'Total' : total === 'Total de ejemplo', `${nombre}: ticket dice "${total}"`);
  await p.getByRole('button', { name: /Enviar por WhatsApp/ }).click();
  await p.waitForTimeout(200);
  const url = await p.evaluate(() => window.__abierto ?? null);
  if (esOficial) {
    ok(!!url && url.startsWith('https://wa.me/5210000000000?text=') && decodeURIComponent(url).includes('Iekei clásico'), `${nombre}: WhatsApp abre ${url ? url.slice(0, 60) + '…' : 'nada'}`);
  } else {
    ok(url === null && (await p.locator('.burbuja').isVisible()), `${nombre}: WhatsApp en modo demostración (sin abrir nada)`);
  }
  await ctx.close();
}

await revisar(propuesta.replace(/\/$/, ''), false);
await revisar(oficial.replace(/\/$/, ''), true);
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
