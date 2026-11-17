// Imágenes para la vista previa al compartir (Open Graph y X): 1200 × 630 por página y por modo.
// Se dibujan en Edge con las fuentes, el sello y las fotos tratadas del sitio, y se guardan como JPEG en
// sitio/public/og/<modo>/<página>.jpg. Las de la propuesta dicen "Propuesta no oficial"; las fotos de stock llevan su rótulo.
// Uso: node herramientas/og.mjs
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(raiz, 'sitio', 'public');
// Data URI: una página creada con setContent no puede leer file://.
const tipos = { '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const url = (...p) => `data:${tipos[path.extname(p.at(-1))]};base64,${fs.readFileSync(path.join(pub, ...p)).toString('base64')}`;

const paginas = [
  { nombre: 'inicio', fondo: url('fotos', 'caldo-1600.webp'), titulo: 'Ramen Iekei<br>en Tlaquepaque', frase: 'Caldo y fideo traídos de Japón.', foto: true },
  { nombre: 'menu', fondo: url('fotos', 'heroe-iekei-1600.webp'), titulo: 'Menú y pedido', frase: 'Arma tu ticket como en una ramen-ya de Japón.', foto: true },
  { nombre: 'tlaquepaque', fondo: url('mapas', 'tlaquepaque.svg'), titulo: 'Take-chan<br>Tlaquepaque', frase: 'Calz. Córdoba 24, esquina Niños Héroes.', mapa: true },
  { nombre: 'americana', fondo: url('mapas', 'americana.svg'), titulo: 'Take-chan<br>Americana', frase: 'Prisciliano Sánchez 1110 · por confirmar.', mapa: true },
  { nombre: 'links', fondo: url('fotos', 'fideo-1600.webp'), titulo: 'Take-chan Ramen', frase: 'Menú, pedido, cómo llegar y TikTok.', foto: true },
];

const html = (pg, modo) => `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: S; src: url('${url('fuentes', 'shippori-800.woff2')}'); font-weight: 800; }
@font-face { font-family: G; src: url('${url('fuentes', 'geist-500.woff2')}'); font-weight: 500; }
@font-face { font-family: G; src: url('${url('fuentes', 'geist-600.woff2')}'); font-weight: 600; }
html, body { margin: 0; }
.t { position: relative; width: 1200px; height: 630px; overflow: hidden; background: #121110; color: #f3eee4; }
.f { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: ${pg.mapa ? '50% 50%' : '70% 50%'}; }
.v { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(18,17,16,.96) 0%, rgba(18,17,16,.85) 42%, rgba(18,17,16,.15) 75%, rgba(18,17,16,0) 100%); }
/* En los mapas, el mapa y el pin se corren 300 px a la derecha juntos: el punto queda fuera del velo y sobre su esquina. */
.mapa .f { transform: translateX(300px); }
.pin { position: absolute; left: calc(50% + 300px); top: 50%; translate: -50% -100%; display: grid; justify-items: center; }
.pin span { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 7px; rotate: -4deg; background: #d9381e; color: #f3eee4; font: 800 36px/1 S; box-shadow: 0 0 0 3px #121110; }
.pin i { width: 3px; height: 20px; background: #d9381e; }
.c { position: absolute; left: 72px; top: 64px; bottom: 64px; display: grid; align-content: space-between; width: 640px; }
.s { width: 96px; height: 96px; rotate: -5deg; }
h1 { margin: 0 0 18px; font: 800 76px/1.02 S; letter-spacing: -.01em; }
p { margin: 0; font: 500 30px/1.3 G; color: #e9e2d4; }
.m { margin-top: 26px; font: 600 20px/1 G; letter-spacing: .14em; text-transform: uppercase; color: #bdb4a8; }
.r { position: absolute; right: 20px; top: 20px; padding: 6px 12px; border-radius: 4px; background: rgba(18,17,16,.75); font: 500 16px/1.2 G; }
.o { position: absolute; right: 20px; bottom: 20px; padding: 6px 12px; border-radius: 4px; background: rgba(18,17,16,.75); font: 500 16px/1.2 G; }
.p { position: absolute; left: 72px; top: 64px; translate: 120px 30px; padding: 7px 14px; border: 1px solid rgba(243,238,228,.5); border-radius: 999px; font: 500 18px/1 G; }
</style>
<div class="t${pg.mapa ? ' mapa' : ''}">
  <img class="f" src="${pg.fondo}">
  ${pg.mapa ? '<div class="pin"><span>家</span><i></i></div>' : ''}
  <div class="v"></div>
  <div class="c">
    <img class="s" src="${url('sello-192.webp')}">
    <div><h1>${pg.titulo}</h1><p>${pg.frase}</p><div class="m">Take-chan Ramen · 家系ラーメン</div></div>
  </div>
  ${modo === 'propuesta' ? '<span class="p">Propuesta no oficial</span>' : ''}
  ${pg.foto ? '<span class="r">Imagen ilustrativa</span>' : ''}
  ${pg.mapa ? '<span class="o">© OpenStreetMap</span>' : ''}
</div>`;

const b = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
for (const modo of ['propuesta', 'oficial']) {
  const dir = path.join(pub, 'og', modo);
  fs.mkdirSync(dir, { recursive: true });
  for (const pg of paginas) {
    await p.setContent(html(pg, modo), { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(150);
    const png = await p.locator('.t').screenshot();
    const salida = path.join(dir, `${pg.nombre}.jpg`);
    await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(salida);
    console.log(modo, pg.nombre, (fs.statSync(salida).size / 1024).toFixed(0), 'KB');
  }
}
await b.close();
