// Descarga subconjuntos woff2 de Google Fonts (parámetro text=) para autohospedarlos.
// Uso: node herramientas/fuentes.mjs <carpeta-destino>
import fs from 'node:fs';
import path from 'node:path';
const destino = path.resolve(process.argv[2] ?? 'sitio/public/fuentes');
fs.mkdirSync(destino, { recursive: true });
const latin = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + 'áéíóúÁÉÍÓÚñÑüÜ¿¡·—–“”‘’…°×→←↗✓';
const japones = '家系ラーメン食券機硬め普通柔らかめ濃いめ薄め多め少なめのれん朱竹';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const fuentes = [
  ['shippori-700', 'Shippori+Mincho+B1:wght@700', 700, latin + japones],
  ['shippori-800', 'Shippori+Mincho+B1:wght@800', 800, latin + japones],
  ['geist-400', 'Geist:wght@400', 400, latin],
  ['geist-500', 'Geist:wght@500', 500, latin],
  ['geist-600', 'Geist:wght@600', 600, latin],
  ['geist-mono-500', 'Geist+Mono:wght@500', 500, latin],
];
for (const [nombre, familia, , texto] of fuentes) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${familia}&text=${encodeURIComponent(texto)}`, { headers: { 'user-agent': UA } })).text();
  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error('sin url para ' + nombre + '\n' + css);
  const buf = Buffer.from(await (await fetch(url, { headers: { 'user-agent': UA } })).arrayBuffer());
  fs.writeFileSync(path.join(destino, nombre + '.woff2'), buf);
  console.log(nombre, (buf.length / 1024).toFixed(1) + ' KB');
}
