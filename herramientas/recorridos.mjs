// Corre todas las pruebas del sitio, una tras otra, y guarda el registro en entregables/pruebas-nivel4.txt.
// Necesita los dos builds servidos: la propuesta en :4333/Take-chan y el ensayo oficial en :4344 (ver modos.mjs).
// Recorridos del plan: pedido demo (menu-estados, modos), idioma (idiomas), sin red (pwa), agotado y aviso (hoja),
// WhatsApp real simulado (modos); además axe, 360 px, peso, LCP, CLS, fps, compartir, SEO local y estadísticas.
// Uso: node herramientas/recorridos.mjs
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = 'http://localhost:4333/Take-chan';
const O = 'http://localhost:4344';
const pruebas = [
  ['Calidad: axe en 11 rutas, 360 px, peso, LCP y movimiento reducido (propuesta)', 'pruebas.mjs', [P + '/']],
  ['CLS y fps a 390 px', 'rendimiento.mjs', [P, '390']],
  ['CLS y fps a 1440 px', 'rendimiento.mjs', [P, '1440']],
  ['Recorrido 1 y 6: modos propuesta y oficial (pedido demo y WhatsApp real simulado)', 'modos.mjs', [P, O]],
  ['Recorrido 1: menú (sugerencia, detalle, lista) con axe', 'menu-estados.mjs', [P, 'recorrido']],
  ['Recorrido 2: cambiar de idioma y sin español suelto en /en', 'idiomas.mjs', [P]],
  ['Recorrido 3: menú sin red (PWA)', 'pwa.mjs', [P, O]],
  ['Recorridos 4 y 5: agotado y aviso vigente y vencido (hoja CSV)', 'hoja.mjs', [O]],
  ['Detalles: reloj, TikTok bajo demanda, horario y pedido vacío', 'detalles.mjs', [P, 'recorrido']],
  ['Compartir y /links (propuesta)', 'compartir.mjs', [P, 'sitio/dist/pages/browser', 'recorrido']],
  ['Compartir y /links (ensayo oficial)', 'compartir.mjs', [O, 'sitio/dist/prueba-oficial/browser', 'recorrido']],
  ['SEO local (propuesta)', 'seo-local.mjs', ['sitio/dist/pages/browser']],
  ['SEO local (ensayo oficial)', 'seo-local.mjs', ['sitio/dist/prueba-oficial/browser']],
  ['Estadísticas sin cookies', 'estadisticas.mjs', [P, O]],
  ['Textos sin traducir', 'llaves-idioma.mjs', []],
];
const registro = [`Pruebas del nivel 4 (${new Date().toLocaleString('sv-SE')})`, ''];
const resumen = [];
for (const [nombre, archivo, args] of pruebas) {
  const r = spawnSync(process.execPath, [path.join(raiz, 'herramientas', archivo), ...args], { cwd: raiz, encoding: 'utf8', timeout: 600000, env: { ...process.env, MSYS_NO_PATHCONV: '1' } });
  const salida = (r.stdout + r.stderr).trim();
  const bien = r.status === 0 && !/FALLA|SCROLL HORIZONTAL|\d+ fallas/.test(salida);
  resumen.push(`${bien ? 'ok   ' : 'FALLA'} ${nombre}`);
  registro.push(`== ${nombre} (${archivo})`, salida, '');
  console.log(`${bien ? 'ok   ' : 'FALLA'} ${nombre}`);
}
// Las capturas de los recorridos no son avances: se borran.
for (const f of fs.readdirSync(path.join(raiz, 'entregables', 'avances'))) if (f.includes('_paso-recorrido_')) fs.rmSync(path.join(raiz, 'entregables', 'avances', f));
fs.writeFileSync(path.join(raiz, 'entregables', 'pruebas-nivel4.txt'), ['Resumen', ...resumen, '', ...registro].join('\n') + '\n');
const fallas = resumen.filter((l) => l.startsWith('FALLA')).length;
console.log(fallas ? `\n${fallas} pruebas con fallas (detalle en entregables/pruebas-nivel4.txt)` : '\nTodas las pruebas en orden (entregables/pruebas-nivel4.txt)');
process.exit(fallas ? 1 : 0);
