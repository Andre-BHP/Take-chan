// Convierte las fotos de fuentes-fotos/ a AVIF y WebP en 3 anchos, con color promedio y una miniatura borrosa (LQIP).
// Uso: node herramientas/procesar-fotos.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lista = JSON.parse(fs.readFileSync(path.join(raiz, 'herramientas', 'fotos.json'), 'utf8'));
const salida = path.join(raiz, 'sitio', 'public', 'fotos');
fs.mkdirSync(salida, { recursive: true });
const anchos = [480, 960, 1600];
const datos = {};
let total = 0;
for (const f of lista) {
  const origen = path.join(raiz, 'fuentes-fotos', f.nombre + '.jpg');
  const meta = await sharp(origen).metadata();
  for (const w of anchos) {
    const base = sharp(origen).resize({ width: Math.min(w, meta.width) }).modulate({ saturation: 1.02 });
    const avif = await base.clone().avif({ quality: w > 960 ? 48 : 52, effort: 6 }).toBuffer();
    const webp = await base.clone().webp({ quality: 74 }).toBuffer();
    fs.writeFileSync(path.join(salida, `${f.nombre}-${w}.avif`), avif);
    fs.writeFileSync(path.join(salida, `${f.nombre}-${w}.webp`), webp);
    total += avif.length;
  }
  const { dominant } = await sharp(origen).stats();
  const lqip = await sharp(origen).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  datos[f.nombre] = {
    ancho: meta.width, alto: meta.height,
    color: '#' + [dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join(''),
    lqip: 'data:image/webp;base64,' + lqip.toString('base64'),
    alt: f.alt, autor: f.autor, usuario: f.usuario, id: f.id,
  };
  console.log(f.nombre, meta.width + 'x' + meta.height);
}
fs.writeFileSync(path.join(raiz, 'sitio', 'src', 'datos', 'fotos.json'), JSON.stringify(datos, null, 2));
console.log('AVIF total:', (total / 1024).toFixed(0), 'KB');
