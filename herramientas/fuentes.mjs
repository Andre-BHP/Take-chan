// Descarga subconjuntos woff2 de Google Fonts (parámetro text=) para autohospedarlos.
// Uso: node herramientas/fuentes.mjs <carpeta-destino>
import fs from 'node:fs';
import path from 'node:path';
const destino = path.resolve(process.argv[2] ?? 'sitio/public/fuentes');
fs.mkdirSync(destino, { recursive: true });
const latin = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + 'áéíóúÁÉÍÓÚñÑüÜ¿¡·—–“”‘’…°×→←↗✓';
const japones = '家系ラーメン食券機のれん';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';
const fuentes = [
  ['dela-gothic-one', 'Dela+Gothic+One', 400, latin + japones],
  ['zen-kaku-400', 'Zen+Kaku+Gothic+New:wght@400', 400, latin + japones],
  ['zen-kaku-700', 'Zen+Kaku+Gothic+New:wght@700', 700, latin + japones],
  ['martian-mono-400', 'Martian+Mono:wght@400', 400, latin],
  ['martian-mono-500', 'Martian+Mono:wght@500', 500, latin],
];
for (const [nombre, familia, , texto] of fuentes) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${familia}&text=${encodeURIComponent(texto)}`, { headers: { 'user-agent': UA } })).text();
  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error('sin url para ' + nombre + '\n' + css);
  const buf = Buffer.from(await (await fetch(url, { headers: { 'user-agent': UA } })).arrayBuffer());
  fs.writeFileSync(path.join(destino, nombre + '.woff2'), buf);
  console.log(nombre, (buf.length / 1024).toFixed(1) + ' KB');
}
