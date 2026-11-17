// Recorta (si se pide), aplica el mismo tratamiento de color (gradear.mjs) y convierte las fotos de fuentes-fotos/ a AVIF y WebP en 3 anchos, con color promedio y una miniatura borrosa (LQIP).
// Uso: node herramientas/procesar-fotos.mjs
import sharp from 'sharp';
import { gradearBuffer } from './gradear.mjs';
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
  // Un recorte puede salir de la foto de otro (campo fuente): mismo autor y crédito, otro encuadre.
  const origen = path.join(raiz, 'fuentes-fotos', (f.fuente ?? f.nombre) + '.jpg');
  // Recorte opcional (fracciones del original) para que el tazón llene el cuadro y no quede la mesa clara.
  let fuente = origen;
  if (f.recorte) {
    const m = await sharp(origen).metadata();
    const r = f.recorte;
    fuente = await sharp(origen).extract({ left: Math.round(r.x * m.width), top: Math.round(r.y * m.height), width: Math.round(r.w * m.width), height: Math.round(r.h * m.height) }).toBuffer();
  }
  const meta = await sharp(fuente).metadata();
  const gradeada = await gradearBuffer(fuente);
  for (const w of anchos) {
    const base = sharp(gradeada).resize({ width: Math.min(w, meta.width) });
    const avif = await base.clone().avif({ quality: w > 960 ? 48 : 52, effort: 6 }).toBuffer();
    const webp = await base.clone().webp({ quality: 74 }).toBuffer();
    fs.writeFileSync(path.join(salida, `${f.nombre}-${w}.avif`), avif);
    fs.writeFileSync(path.join(salida, `${f.nombre}-${w}.webp`), webp);
    total += avif.length;
  }
  const { dominant } = await sharp(gradeada).stats();
  const lqip = await sharp(gradeada).resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();
  datos[f.nombre] = {
    ancho: meta.width, alto: meta.height,
    color: '#' + [dominant.r, dominant.g, dominant.b].map((c) => c.toString(16).padStart(2, '0')).join(''),
    lqip: 'data:image/webp;base64,' + lqip.toString('base64'),
    alt: f.alt, autor: f.autor, usuario: f.usuario, id: f.id,
    // De stock (Unsplash) salvo que fotos.json diga stock: false (las fotos propias del local).
    stock: f.stock !== false,
  };
  console.log(f.nombre, meta.width + 'x' + meta.height);
}
fs.writeFileSync(path.join(raiz, 'sitio', 'src', 'datos', 'fotos.json'), JSON.stringify(datos, null, 2));
console.log('AVIF total:', (total / 1024).toFixed(0), 'KB');
