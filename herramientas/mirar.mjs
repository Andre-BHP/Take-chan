// Captura de revisión (no se sube): node herramientas/mirar.mjs <url> <ancho> <salida.png> [completa=1]
import { chromium } from 'playwright-core';
const [url, ancho, salida, completa = '1'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const w = Number(ancho);
const p = await (await b.newContext({ viewport: { width: w, height: w < 800 ? 844 : 900 }, reducedMotion: 'reduce' })).newPage();
const errores = [];
p.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
p.on('pageerror', (e) => errores.push(e.message));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);
await p.screenshot({ path: salida, fullPage: completa === '1' });
console.log(salida, 'sw', await p.evaluate(() => document.documentElement.scrollWidth), 'alto', await p.evaluate(() => document.documentElement.scrollHeight), errores.length ? 'ERRORES: ' + errores.join(' | ') : '');
await b.close();
