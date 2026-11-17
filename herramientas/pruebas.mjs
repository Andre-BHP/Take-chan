// Pruebas de calidad: axe (390 y 1440), scroll horizontal (360), peso y LCP de la portada en celular, movimiento reducido.
// Uso: node herramientas/pruebas.mjs <url-base>   (por ejemplo http://localhost:4331/SENSEI)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const base = process.argv[2].replace(/\/$/, '');
const rutas = ['/', '/menu', '/tlaquepaque', '/americana', '/en', '/en/menu', '/en/tlaquepaque', '/links', '/privacidad', '/en/accesibilidad', '/creditos'];
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
let fallas = 0;

for (const ruta of rutas) {
  for (const w of [390, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    const p = await ctx.newPage();
    await p.goto(base + ruta, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axe });
    const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map((x) => `${x.impact} ${x.id} (${x.nodes.length}): ${x.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`));
    fallas += v.length;
    console.log(`axe ${ruta} ${w}:`, v.length ? '\n  ' + v.join('\n  ') : 'sin violaciones');
    await ctx.close();
  }
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(base + ruta, { waitUntil: 'networkidle' });
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  if (sw > 360) fallas++;
  console.log(`360 px ${ruta}: scrollWidth ${sw}`, sw > 360 ? 'SCROLL HORIZONTAL' : 'ok');
  await ctx.close();
}

// Peso y LCP de la portada: celular con CPU 4x más lenta y red 4G lenta.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0;
  cdp.on('Network.loadingFinished', (e) => (bytes += e.encodedDataLength));
  await p.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const lcp = await p.evaluate(() => window.__lcp);
  const kb = bytes / 1024;
  if (kb > 500 || lcp > 2500) fallas++;
  console.log(`portada: ${kb.toFixed(0)} KB transferidos (límite 500), LCP ${lcp.toFixed(0)} ms con 4G lenta y CPU 4x (límite 2500)`);
  await ctx.close();
}

// Movimiento: el vapor se anima normalmente y se detiene con prefers-reduced-motion.
for (const modo of ['no-preference', 'reduce']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: modo });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  await p.goto(base + '/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const v = document.querySelector('app-vapor .v');
    const animadas = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations === Infinity).length;
    return { animacion: v ? getComputedStyle(v).animationName : 'sin vapor', opacidad: v ? getComputedStyle(v).opacity : '-', bucles: animadas };
  });
  console.log(`movimiento ${modo}:`, JSON.stringify(r));
  if (modo === 'reduce' && r.bucles > 0) fallas++;
  await ctx.close();
}
await b.close();
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
