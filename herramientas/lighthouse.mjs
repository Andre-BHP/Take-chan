// Lighthouse en celular y escritorio (rendimiento, accesibilidad, buenas prácticas y SEO), con Edge.
// Guarda los reportes HTML y JSON en entregables/lighthouse/<nombre>-<página>-<formato>.{html,json} y un resumen.
// Uso: node herramientas/lighthouse.mjs <url-base> <nombre> [rutas separadas por coma]
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [baseArg, nombre, rutasArg = '/,/menu,/en,/links'] = process.argv.slice(2);
const base = baseArg.replace(/\/$/, '');
const salida = path.join(raiz, 'entregables', 'lighthouse');
fs.mkdirSync(salida, { recursive: true });
const chrome = await chromeLauncher.launch({ chromePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', chromeFlags: ['--headless=new', '--no-first-run'] });
const filas = [];
for (const ruta of rutasArg.split(',')) {
  for (const formato of ['movil', 'escritorio']) {
    const config = formato === 'escritorio'
      ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : { extends: 'lighthouse:default' };
    const r = await lighthouse(base + ruta, { port: chrome.port, output: ['html', 'json'], onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error' }, config);
    const slug = `${nombre}-${ruta === '/' ? 'inicio' : ruta.slice(1).replace(/\//g, '-')}-${formato}`;
    fs.writeFileSync(path.join(salida, slug + '.html'), r.report[0]);
    fs.writeFileSync(path.join(salida, slug + '.json'), r.report[1]);
    const c = r.lhr.categories;
    const p = (k) => Math.round(c[k].score * 100);
    const fallidas = Object.values(r.lhr.audits).filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode === 'binary').map((a) => a.id);
    filas.push({ ruta, formato, rend: p('performance'), acc: p('accessibility'), bp: p('best-practices'), seo: p('seo'), fallidas });
    console.log(`${ruta.padEnd(10)} ${formato.padEnd(10)} rendimiento ${p('performance')} · accesibilidad ${p('accessibility')} · buenas prácticas ${p('best-practices')} · SEO ${p('seo')}${fallidas.length ? '  [' + fallidas.join(', ') + ']' : ''}`);
  }
}
await chrome.kill();
const md = [`# Lighthouse · ${nombre} (${new Date().toLocaleString('sv-SE')})`, '', `Base: ${base}. Edge sin interfaz. Celular con la emulación de Lighthouse (4G lenta, CPU 4x); escritorio sin limitar.`, '', '| Página | Formato | Rendimiento | Accesibilidad | Buenas prácticas | SEO | Auditorías que no pasan |', '|---|---|---|---|---|---|---|',
  ...filas.map((f) => `| ${f.ruta} | ${f.formato} | ${f.rend} | ${f.acc} | ${f.bp} | ${f.seo} | ${f.fallidas.join(', ') || '—'} |`)].join('\n');
fs.writeFileSync(path.join(salida, `${nombre}-resumen.md`), md + '\n');
const bajo = filas.filter((f) => Math.min(f.rend, f.acc, f.bp, f.seo) < 95);
console.log(bajo.length ? `\n${bajo.length} medición(es) con alguna categoría bajo 95` : '\nTodas las categorías en 95 o más');
