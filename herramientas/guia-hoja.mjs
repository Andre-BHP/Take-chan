// Capturas para GUIA_EDITAR.md: las tres pestañas de ejemplo dibujadas como tabla (cómo se ve la hoja).
// Es una representación de los CSV de ejemplo, no una captura de Google Sheets.
// Uso: node herramientas/guia-hoja.mjs
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leer = (n) => fs.readFileSync(path.join(raiz, 'sitio/public/datos-ejemplo', n), 'utf8');
const filas = (t) => t.trim().split('\n').map((l) => l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"'))).map((f) => (f.at(-1) === '' ? f.slice(0, -1) : f));
const resaltar = { menu: (f) => f[1] === 'arroz', horario: () => false, aviso: () => true };
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const p = await b.newPage({ viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1 });
for (const tab of ['menu', 'horario', 'aviso']) {
  const [cabeza, ...resto] = filas(leer(tab + '.csv')).map((f) => f.filter((_, i, a) => i < a.length));
  const letras = cabeza.map((_, i) => String.fromCharCode(65 + i));
  await p.setContent(`<!doctype html><meta charset="utf-8"><style>
    body { margin: 0; padding: 16px; background: #fff; font: 13px/1.3 system-ui, 'Segoe UI', sans-serif; color: #202124; }
    .pestanas { display: flex; gap: 2px; margin-top: 8px; } .pestanas span { padding: 6px 14px; background: #f1f3f4; border-radius: 0 0 6px 6px; color: #5f6368; } .pestanas .activa { background: #fff; color: #188038; font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,.25); }
    table { border-collapse: collapse; } th, td { border: 1px solid #e0e0e0; padding: 5px 8px; max-width: 360px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    th { background: #f8f9fa; color: #5f6368; font-weight: 500; text-align: center; } td.n { background: #f8f9fa; color: #5f6368; text-align: center; width: 28px; }
    tr.cabeza td:not(.n) { font-weight: 700; background: #fef7e0; } tr.marca td:not(.n) { background: #e6f4ea; }
  </style>
  <table><tr><th></th>${letras.map((l) => `<th>${l}</th>`).join('')}</tr>
  <tr class="cabeza"><td class="n">1</td>${cabeza.map((c) => `<td>${c}</td>`).join('')}</tr>
  ${resto.map((f, i) => `<tr class="${resaltar[tab](f) ? 'marca' : ''}"><td class="n">${i + 2}</td>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}
  </table>
  <div class="pestanas">${['menu', 'horario', 'aviso'].map((t) => `<span class="${t === tab ? 'activa' : ''}">${t}</span>`).join('')}</div>`);
  const caja = await p.evaluate(() => { const r = document.body.getBoundingClientRect(); const t = document.querySelector('table').getBoundingClientRect(); return { w: Math.ceil(Math.max(t.width + 32, 420)), h: Math.ceil(document.querySelector('.pestanas').getBoundingClientRect().bottom + 16) }; });
  await p.screenshot({ path: path.join(raiz, 'entregables/guias', `hoja-${tab}.png`), clip: { x: 0, y: 0, width: Math.min(caja.w, 1200), height: caja.h } });
  console.log('hoja-' + tab + '.png');
}
await b.close();
