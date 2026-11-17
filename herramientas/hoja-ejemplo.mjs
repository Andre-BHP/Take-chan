// Pestañas de ejemplo de la hoja de Google (menú, horario y aviso) en CSV, generadas desde los JSON del sitio.
// Sirven de plantilla para crear la hoja real y para probar la carga (el ensayo oficial las usa).
// En el ejemplo, el arroz está agotado y hay un aviso vigente, para ver la tecla 売切 y la banda.
// Uso: node herramientas/hoja-ejemplo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const menu = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/menu.json'), 'utf8'));
const negocio = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/negocio.json'), 'utf8'));
const salida = path.join(raiz, 'sitio/public/datos-ejemplo');
fs.mkdirSync(salida, { recursive: true });
const csv = (filas) => filas.map((f) => f.map((v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v)).join(',')).join('\n') + '\n';
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

fs.writeFileSync(path.join(salida, 'menu.csv'), csv([
  ['categoria', 'id', 'nombre', 'descripcion', 'precio', 'foto', 'disponible'],
  ...menu.categorias.flatMap((c) => c.items.map((p) => [c.nombre, p.id, p.nombre, p.desc, p.precio ?? '', p.foto ?? '', p.id === 'arroz' ? 'no' : 'sí'])),
]));
fs.writeFileSync(path.join(salida, 'horario.csv'), csv([
  ['sucursal', 'dia', 'abre', 'cierra'],
  ...negocio.sucursales.filter((s) => s.confirmada).flatMap((s) => DIAS.map((d, i) => {
    const t = s.horario.turnos.find((x) => x.dias.includes(i));
    return [s.id, d, t?.abre ?? '', t?.cierra ?? ''];
  })),
]));
fs.writeFileSync(path.join(salida, 'aviso.csv'), csv([
  ['texto', 'desde', 'hasta'],
  ['Aviso de ejemplo: el viernes 12 de diciembre cerramos a las 15:00.', '2026-11-01', '2026-12-12'],
]));
console.log('listo:', fs.readdirSync(salida).join(', '));
