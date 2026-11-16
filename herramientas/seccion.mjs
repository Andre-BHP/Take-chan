// Captura de revisión de una sección (no se sube): node herramientas/seccion.mjs <url> <ancho> <selector> <salida.png> [reducir=1] [desplazar=0]
import { chromium } from 'playwright-core';
const [url, ancho, selector, salida, reducir = '1', desplazar = '0'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const w = Number(ancho);
const ctx = await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: reducir === '1' ? 'reduce' : 'no-preference' });
const p = await ctx.newPage();
await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), selector);
await p.waitForTimeout(800);
if (Number(desplazar)) { for (let i = 0; i < 20; i++) { await p.mouse.wheel(0, Number(desplazar) / 20); await p.waitForTimeout(80); } await p.waitForTimeout(1500); await p.screenshot({ path: salida }); }
else await p.locator(selector).screenshot({ path: salida });
await b.close();
