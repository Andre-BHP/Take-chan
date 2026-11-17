// Matriz del QR "Pídelo desde tu celular" (carta dis-081) para la configuración del build: el QR del sitio apunta a
// /menu (y /en/menu) en el dominio de ese modo. Escribe src/datos/qr.json con la matriz compacta (bits en base64):
// el componente app-qr-pedido dibuja los trazos de tinta igual que qr-tinta.mjs y los anima.
// Uso: node scripts/qr-datos.mjs <config>   (pages, oficial, prueba-oficial; sin config: pages)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matriz } from './qr-tinta.mjs';

const sitio = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = process.argv[2] ?? 'pages';
const archivo = path.join(sitio, 'src', 'entornos', config === 'local' ? 'entorno.ts' : `entorno.${config}.ts`);
const fuente = fs.readFileSync(archivo, 'utf8');
const campo = (k) => fuente.match(new RegExp(`${k}:\\s*'([^']*)'`))?.[1] ?? '';
const paginas = fs.readFileSync(path.join(sitio, 'src', 'entornos', 'entorno.pages.ts'), 'utf8').match(/publico:\s*'([^']*)'/)?.[1] ?? '';
// Sin dominio ni URL pública (desarrollo local o el oficial todavía vacío), el QR apunta a la propuesta.
const raiz = (campo('dominio') || campo('publico') || paginas).replace(/\/$/, '');
const salida = {};
for (const [idioma, ruta] of [['es', '/menu'], ['en', '/en/menu']]) {
  const url = `${raiz}${ruta}?ref=qr-web`;
  const m = matriz(url);
  const bytes = Buffer.alloc(Math.ceil(m.bits.length / 8));
  m.bits.forEach((b, i) => { if (b) bytes[i >> 3] |= 1 << (7 - (i & 7)); });
  salida[idioma] = { url, n: m.n, bits: bytes.toString('base64') };
}
fs.writeFileSync(path.join(sitio, 'src', 'datos', 'qr.json'), JSON.stringify(salida));
console.log(`qr.json (${config}): ${salida.es.url} · ${salida.es.n}×${salida.es.n} módulos`);
