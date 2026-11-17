// Video del movimiento con Playwright (recordVideo) y GIF con ffmpeg.
// Uso: node herramientas/video.mjs <url-base> <paso> <escena: intro|transicion|social|ritmo|medidor|sucursales|inicio|menu|vende|qr|navegar> [anchos=1440,390] [reducir=0]
// Salida: entregables/avances/video/AAAA-MM-DD_<paso>_<escena>_<ancho>.mp4 y .gif (MP4 se ve en GitHub desde el celular)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const [base, paso, escena, anchosTxt = '1440,390', reducir = '0'] = process.argv.slice(2);
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'entregables', 'avances', 'video');
fs.mkdirSync(salida, { recursive: true });
const fecha = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
const url = (r) => base.replace(/\/$/, '') + r;
const espera = (p, ms) => p.waitForTimeout(ms);
async function deslizar(p, total, pasos = 40, ms = 120) {
  for (let i = 0; i < pasos; i++) { await p.mouse.wheel(0, total / pasos); await espera(p, ms); }
}
const escenas = {
  async intro(p) { await p.goto(url('/'), { waitUntil: 'commit' }); await espera(p, 1800); },
  async transicion(p) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 1200);
    const celda = p.locator('.bento .celda').nth(2); await celda.scrollIntoViewIfNeeded(); await espera(p, 900);
    await celda.click(); await espera(p, 1500);
    await p.getByRole('link', { name: /Sucursales/ }).first().click(); await espera(p, 1600);
    await p.getByRole('link', { name: /Take-chan Ramen, inicio/ }).click(); await espera(p, 1400);
  },
  async social(p) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 1500);
    await p.evaluate(() => document.querySelector('.social').scrollIntoView({ block: 'center' })); await espera(p, 2200);
  },
  async ritmo(p) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 1500);
    await p.evaluate(() => document.querySelector('.iekei').scrollIntoView({ block: 'start' })); await espera(p, 900);
    await deslizar(p, 3600, 45, 110); await espera(p, 600);
  },
  async medidor(p) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 1500);
    await p.evaluate(() => document.querySelector('.como').scrollIntoView({ block: 'start' })); await espera(p, 1200);
    await deslizar(p, 1600, 20, 120);
    const lista = p.locator('app-medidor .pasos');
    if (await lista.evaluate((el) => el.scrollWidth > el.clientWidth)) {
      await p.evaluate(() => document.querySelector('.como').scrollIntoView({ block: 'start' })); await espera(p, 600);
      for (let i = 1; i <= 3; i++) { await lista.evaluate((el, i) => el.scrollTo({ left: el.clientWidth * 0.85 * i, behavior: 'smooth' }), i); await espera(p, 900); }
    }
    await espera(p, 600);
  },
  async sucursales(p) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 1200);
    await p.evaluate(() => document.querySelector('#sucursales').scrollIntoView({ block: 'start' })); await espera(p, 1600);
    await p.getByRole('link', { name: /Ver sucursal Tlaquepaque/ }).click(); await espera(p, 1800);
  },
  async inicio(p) { await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 2600); await deslizar(p, 5200, 70, 110); await espera(p, 800); },
  async menu(p, w) {
    await p.goto(url('/menu?ramen=iekei-clasico'), { waitUntil: 'load' }); await espera(p, 1800);
    await p.getByRole('button', { name: /Agregar Gyoza/ }).click(); await espera(p, 700);
    await p.getByRole('button', { name: /Agregar Té verde/ }).click(); await espera(p, 900);
    await p.getByRole('radio', { name: /Firme/ }).check(); await espera(p, 600);
    if (w < 1100) { await p.locator('#ticket').scrollIntoViewIfNeeded(); await espera(p, 600); }
    await p.getByRole('button', { name: 'Imprimir ticket' }).click(); await espera(p, 2200);
    await p.locator('.salida').scrollIntoViewIfNeeded(); await espera(p, 500);
    await p.getByRole('button', { name: /Enviar por WhatsApp/ }).click(); await espera(p, 2000);
  },
  async vende(p, w) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); localStorage.removeItem('take-vista'); } catch (e) {} });
    await p.goto(url('/menu'), { waitUntil: 'load' }); await espera(p, 1600);
    await p.getByRole('button', { name: /^Agregar Iekei clásico/ }).click(); await espera(p, 1400);
    await p.locator(w < 1100 ? '.sugerencia.flotante' : '.sugerencia.en-panel').getByRole('button', { name: 'Agregar' }).click(); await espera(p, 900);
    const t = p.getByRole('button', { name: /^Agregar Gyoza/ }); await t.scrollIntoViewIfNeeded(); await espera(p, 500);
    const c = await t.boundingBox(); await p.mouse.move(c.x + c.width / 2, c.y + c.height / 2); await p.mouse.down(); await espera(p, 650); await p.mouse.up(); await espera(p, 1500);
    await p.keyboard.press('Escape'); await espera(p, 600);
    await p.getByRole('button', { name: 'Lista' }).scrollIntoViewIfNeeded(); await p.getByRole('button', { name: 'Lista' }).click(); await espera(p, 1400);
  },
  async qr(p) {
    await p.addInitScript(() => { try { sessionStorage.setItem('take-intro', '1'); } catch (e) {} });
    await p.goto(url('/menu'), { waitUntil: 'commit' }); await espera(p, 3200);
  },
  async navegar(p) {
    await p.goto(url('/'), { waitUntil: 'load' }); await espera(p, 2400);
    await p.locator('.bento .celda').nth(2).scrollIntoViewIfNeeded(); await espera(p, 900);
    await p.locator('.bento .celda').nth(2).click(); await espera(p, 2200);
    await p.getByRole('link', { name: /Sucursales/ }).first().click(); await espera(p, 2200);
  },
};
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
for (const w of anchosTxt.split(',').map(Number)) {
  const h = w < 800 ? 844 : 900;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reducir === '1' ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  // Grabación con el screencast de CDP (sin el ffmpeg propio de Playwright).
  const cdp = await ctx.newCDPSession(p);
  const cuadros = [];
  cdp.on('Page.screencastFrame', async (f) => {
    cuadros.push({ t: f.metadata.timestamp, datos: Buffer.from(f.data, 'base64') });
    await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: w, maxHeight: h, everyNthFrame: 1 });
  await escenas[escena](p, w);
  await cdp.send('Page.stopScreencast');
  await ctx.close();
  const nombre = `${fecha}_${paso}_${escena}${reducir === '1' ? '-reducido' : ''}_${w}`;
  const tmp = path.join(salida, '_cuadros');
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp);
  const lista = [];
  cuadros.forEach((c, i) => {
    const archivo = path.join(tmp, String(i).padStart(5, '0') + '.jpg');
    fs.writeFileSync(archivo, c.datos);
    const dur = i + 1 < cuadros.length ? Math.max(0.016, cuadros[i + 1].t - c.t) : 0.5;
    lista.push(`file '${archivo.split(path.sep).join('/')}'`, `duration ${dur.toFixed(3)}`);
  });
  lista.push(`file '${path.join(tmp, String(cuadros.length - 1).padStart(5, '0') + '.jpg').split(path.sep).join('/')}'`);
  fs.writeFileSync(path.join(tmp, 'lista.txt'), lista.join(String.fromCharCode(10)));
  const mp4 = path.join(salida, nombre + '.mp4');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'lista.txt'), '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p', '-c:v', 'libx264', '-crf', '24', '-movflags', '+faststart', mp4]);
  const gif = path.join(salida, nombre + '.gif');
  const ancho = w < 800 ? 300 : 640;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-vf', `fps=8,scale=${ancho}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`, gif]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(nombre, cuadros.length + ' cuadros,', (fs.statSync(mp4).size / 1024).toFixed(0) + ' KB mp4,', (fs.statSync(gif).size / 1024).toFixed(0) + ' KB gif');
}
await b.close();
