// Hoja de contacto antes y después del tratamiento de color: entregables/avances/2026-11-16_N1_gradeo.png
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gradear } from './gradear.mjs';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fotos = JSON.parse(fs.readFileSync(path.join(raiz, 'herramientas', 'fotos.json'), 'utf8')).map((f) => f.nombre);
const T = 240, H = 300, M = 8;
const capas = [];
for (const [i, n] of fotos.entries()) {
  const o = path.join(raiz, 'fuentes-fotos', n + '.jpg');
  const antes = await sharp(o).resize(T, H, { fit: 'cover' }).toBuffer();
  const despues = await (await gradear(o)).resize(T, H, { fit: 'cover' }).toBuffer();
  capas.push({ input: antes, left: M + i * (T + M), top: M }, { input: despues, left: M + i * (T + M), top: H + 2 * M });
}
await sharp({ create: { width: fotos.length * (T + M) + M, height: 2 * H + 3 * M, channels: 3, background: '#121110' } })
  .composite(capas).png().toFile(path.join(raiz, 'entregables', 'avances', '2026-11-16_N1_gradeo.png'));
console.log('hoja lista:', fotos.length, 'fotos (arriba antes, abajo después)');
