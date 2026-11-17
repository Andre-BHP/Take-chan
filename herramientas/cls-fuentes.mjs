// Revisión de CLS (no se sube a avances): lista qué elementos se recorren al cargar la portada a 390 px.
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
for (let k = 0; k < 3; k++) {
const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
const p = await ctx.newPage();
await p.addInitScript(() => { window.__s = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__s.push([Math.round(e.startTime), +e.value.toFixed(4), e.sources.map((s) => { const n = s.node; const el = n?.nodeType === 3 ? n.parentElement : n; return (el?.tagName || '') + '.' + (el?.getAttribute?.('class') || '') + (n?.nodeType === 3 ? '(' + n.textContent.slice(0, 16) + ')' : '') + ' ' + JSON.stringify([Math.round(s.previousRect.y), Math.round(s.currentRect.y), Math.round(s.previousRect.height), Math.round(s.currentRect.height)]); })]); }).observe({ type: 'layout-shift', buffered: true }); });
await p.goto('http://localhost:4333/Take-chan/', { waitUntil: 'load' });
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() => window.__s)));
await ctx.close();
}
await b.close();
