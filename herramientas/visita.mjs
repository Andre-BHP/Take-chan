// Capturas para la visita (dis-020): pantallas de 390x844 montadas en un celular sobre fondo de la paleta.
// Uso: node herramientas/visita.mjs <url-base>
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const base = process.argv[2].replace(/\/$/, '');
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const salida = path.join(raiz, 'entregables', 'capturas-visita');
fs.mkdirSync(salida, { recursive: true });
const fuente = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(raiz, 'sitio', 'public', 'fuentes', f)).toString('base64');
const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });

async function pantalla(preparar) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  // Hora fija de la captura: 13:20 en Guadalajara, para mostrar el estado "abierto ahora".
  await p.clock.setFixedTime(new Date('2026-11-14T19:20:00Z'));
  await preparar(p);
  await p.waitForTimeout(400);
  const buf = await p.screenshot();
  await ctx.close();
  return buf.toString('base64');
}

const escenas = [
  ['1_portada', 'Portada', 'Abierto ahora con la hora de Guadalajara, el tazón con vapor y un solo botón: Arma tu pedido.', (p) => p.goto(base + '/', { waitUntil: 'networkidle' })],
  ['2_maquina-de-tickets', 'Máquina de tickets', 'El menú se pide como en una ramen-ya de Japón: tecla por tecla.', async (p) => {
    await p.goto(base + '/menu?ramen=iekei-clasico', { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    await p.getByRole('button', { name: /Agregar Gyoza/ }).click();
    await p.evaluate(() => { const s = document.querySelector('#cat-ramen'); scrollTo(0, s.getBoundingClientRect().top + scrollY - 190); });
  }],
  ['3_ticket-armado', 'Ticket armado', 'Sucursal, hora para recoger y el ticket listo para WhatsApp.', async (p) => {
    await p.goto(base + '/menu?ramen=iekei-clasico', { waitUntil: 'networkidle' });
    await p.waitForTimeout(300);
    await p.getByRole('button', { name: /Agregar Gyoza/ }).click();
    await p.getByRole('button', { name: /Agregar Té verde/ }).click();
    await p.selectOption('select', '13:30');
    await p.getByRole('button', { name: 'Imprimir ticket' }).click();
    await p.waitForTimeout(300);
    await p.evaluate(() => { const t = document.querySelector('.salida'); scrollTo(0, t.getBoundingClientRect().top + scrollY - 330); });
  }],
];

for (const [archivo, titulo, texto, preparar] of escenas) {
  const img = await pantalla(preparar);
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
    @font-face { font-family: D; src: url(${fuente('dela-gothic-one.woff2')}); }
    @font-face { font-family: Z; src: url(${fuente('zen-kaku-400.woff2')}); }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1080px; height: 1350px; overflow: hidden; display: grid; grid-template-rows: auto 1fr; justify-items: center; align-items: center; padding-top: 32px;
      background: radial-gradient(60% 45% at 50% 42%, #3a2a20 0%, #1d1612 60%, #120e0b 100%); color: #f0e7d8; font-family: Z, sans-serif; }
    .barra { position: absolute; left: 0; right: 0; bottom: 0; height: 260px; background: linear-gradient(#2c211a, #1a130f); box-shadow: 0 -2px 0 #3e3027; }
    .escena { position: relative; display: grid; justify-items: center; gap: 36px; }
    .telefono { width: 430px; height: 884px; border-radius: 64px; padding: 20px; background: #0b0807;
      box-shadow: 0 0 0 2px #3e3027, 0 50px 90px -30px rgba(0,0,0,.85), 0 0 140px -20px rgba(194,47,40,.18); position: relative; }
    .telefono img { width: 390px; height: 844px; border-radius: 46px; display: block; }
    .isla { position: absolute; top: 34px; left: 50%; translate: -50%; width: 110px; height: 30px; border-radius: 20px; background: #000; }
    .pie { text-align: center; display: grid; gap: 10px; }
    h1 { font: 400 44px/1 D, sans-serif; letter-spacing: -.01em; }
    p { font-size: 22px; color: #bcae9c; max-width: 34ch; }
    .aviso { font-size: 17px; color: #bcae9c; text-align: center; }
  </style></head><body><div class="barra"></div><p class="aviso">Propuesta no oficial de sitio para Take-chan Ramen</p>
  <div class="escena"><div class="telefono"><img src="data:image/png;base64,${img}" alt=""></div>
  <div class="pie"><h1>${titulo}</h1><p>${texto}</p></div></div></body></html>`;
  const ctx = await b.newContext({ viewport: { width: 1080, height: 1350 } });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(salida, archivo + '.png') });
  await ctx.close();
  console.log(archivo + '.png');
}
await b.close();
