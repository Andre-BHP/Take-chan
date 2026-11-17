// Lista los textos que pasan por t() (literales en plantillas y código, más los datos: menú, preguntas y pasos)
// y dice cuáles faltan en el diccionario inglés (sitio/src/app/i18n/en.ts).
// Uso: node herramientas/llaves-idioma.mjs [--json]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = path.join(raiz, 'sitio/src/app');
const archivos = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? archivos(path.join(d, e.name)) : /\.(ts|html)$/.test(e.name) && !d.includes('i18n') ? [path.join(d, e.name)] : []));
const llaves = new Set();
const literal = /\bt\(\s*'((?:[^'\\]|\\.)*)'\s*\)/g;
const ternario = /\bt\(\s*[\w.()]+\s*\?\s*'((?:[^'\\]|\\.)*)'\s*:\s*'((?:[^'\\]|\\.)*)'\s*\)/g;
for (const f of archivos(app)) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(literal)) llaves.add(m[1].replace(/\\'/g, "'"));
  for (const m of t.matchAll(ternario)) { llaves.add(m[1]); llaves.add(m[2]); }
}
const menu = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/menu.json'), 'utf8'));
for (const c of menu.categorias) { llaves.add(c.nombre); for (const p of c.items) { llaves.add(p.nombre); llaves.add(p.desc); } }
llaves.add(menu.alGusto.nota);
for (const o of menu.alGusto.opciones) { llaves.add(o.nombre); for (const v of o.valores) llaves.add(v.es); }
const faq = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/faq.json'), 'utf8'));
for (const p of faq.preguntas.filter((x) => x.mostrar)) { llaves.add(p.pregunta); llaves.add(p.respuesta); if (p.respuestaPropuesta) llaves.add(p.respuestaPropuesta); }
const negocio = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/negocio.json'), 'utf8'));
for (const s of negocio.sucursales) if (s.direccion.referencia) llaves.add(s.direccion.referencia);
const medidor = fs.readFileSync(path.join(app, 'componentes/medidor.ts'), 'utf8');
for (const m of medidor.matchAll(/\{ titulo: '([^']*)', texto: '([^']*)' \}/g)) { llaves.add(m[1]); llaves.add(m[2]); }
const datos = fs.readFileSync(path.join(app, 'servicios/datos.ts'), 'utf8');
llaves.add(datos.match(/NOTA_EJEMPLO = '([^']*)'/)[1]);
const aviso = fs.readFileSync(path.join(raiz, 'sitio/public/datos-ejemplo/aviso.csv'), 'utf8').split('\n')[1]?.split(',')[0];
if (aviso) llaves.add(aviso);
llaves.delete('');
const dicFile = path.join(app, 'i18n/en.ts');
const dic = fs.existsSync(dicFile) ? fs.readFileSync(dicFile, 'utf8') : '';
const tiene = (k) => dic.includes(JSON.stringify(k) + ':');
const faltan = [...llaves].filter((k) => !tiene(k));
if (process.argv.includes('--json')) console.log(JSON.stringify([...llaves], null, 1));
else { console.log(llaves.size, 'textos;', faltan.length, 'sin traducir'); faltan.forEach((k) => console.log('  ' + JSON.stringify(k))); }
process.exit(faltan.length && !process.argv.includes('--json') ? 1 : 0);
