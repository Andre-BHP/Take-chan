// Mapas propios de las sucursales a partir de OpenStreetMap (datos © colaboradores de OpenStreetMap, ODbL).
// Descarga una sola vez las calles alrededor de cada punto con Overpass (caché en herramientas/mapas-osm/)
// y dibuja un SVG oscuro con las calles, los nombres de las calles clave y la atribución.
// El pin no va en el SVG: lo pone el componente app-mapa encima, en el centro, para animarlo.
// Uso: node herramientas/mapas.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(raiz, 'herramientas', 'mapas-osm');
const salida = path.join(raiz, 'sitio', 'public', 'mapas');
fs.mkdirSync(cache, { recursive: true });
fs.mkdirSync(salida, { recursive: true });

const ANCHO = 1200, ALTO = 800;
const sucursales = [
  {
    // Esquina de Calzada Córdoba y Avenida Niños Héroes (nodos 1402465625 y 1402465695 de OSM).
    id: 'tlaquepaque', lat: 20.62891, lon: -103.31984, metros: 520,
    etiquetas: ['Calzada Córdoba', 'Avenida Niños Héroes'],
  },
  {
    // Prisciliano Sánchez 1110, estimado por la numeración vecina en OSM (el 800 está en -103.3577). Por confirmar.
    id: 'americana', lat: 20.6731, lon: -103.3640, metros: 520, pegar: true,
    etiquetas: ['Calle Prisciliano Sánchez'],
  },
];

async function descargar(s) {
  const archivo = path.join(cache, s.id + '.json');
  if (fs.existsSync(archivo)) return JSON.parse(fs.readFileSync(archivo, 'utf8'));
  const dLat = (s.metros * 0.75) / 111320, dLon = s.metros / (111320 * Math.cos((s.lat * Math.PI) / 180));
  const caja = [s.lat - dLat, s.lon - dLon, s.lat + dLat, s.lon + dLon].map((n) => n.toFixed(6)).join(',');
  const consulta = `[out:json][timeout:60];(way["highway"](${caja});way["leisure"~"park|garden"](${caja});way["landuse"="grass"](${caja}););out geom tags;`;
  for (let intento = 0, espera = 4000; intento < 6; intento++, espera *= 2) {
    const r = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', headers: { 'User-Agent': 'prototipo-mapas/1.0', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(consulta),
    });
    if (r.ok) {
      const datos = await r.json();
      fs.writeFileSync(archivo, JSON.stringify(datos));
      return datos;
    }
    console.log(s.id, 'Overpass respondió', r.status, '; reintento en', espera / 1000, 's');
    await new Promise((listo) => setTimeout(listo, espera));
  }
  throw new Error('Overpass no respondió para ' + s.id);
}

const clases = {
  grande: ['motorway', 'trunk', 'primary', 'secondary'],
  media: ['tertiary', 'unclassified', 'residential', 'living_street'],
  chica: ['service', 'pedestrian', 'footway', 'path', 'steps', 'cycleway'],
};
const claseDe = (h) => Object.keys(clases).find((k) => clases[k].some((v) => h?.startsWith(v)));

/** Lleva el punto estimado al punto más cercano de la calle (la dirección está sobre ella). */
function pegarACalle(s, datos) {
  const kx = 111320 * Math.cos((s.lat * Math.PI) / 180), ky = 110540;
  let mejor = null, dMejor = Infinity;
  for (const e of datos.elements) {
    if (e.tags?.name !== s.etiquetas[0] || !e.geometry) continue;
    for (let i = 1; i < e.geometry.length; i++) {
      const a = e.geometry[i - 1], b = e.geometry[i];
      const ax = (a.lon - s.lon) * kx, ay = (a.lat - s.lat) * ky, bx = (b.lon - s.lon) * kx, by = (b.lat - s.lat) * ky;
      const l2 = (bx - ax) ** 2 + (by - ay) ** 2 || 1;
      const u = Math.max(0, Math.min(1, -(ax * (bx - ax) + ay * (by - ay)) / l2));
      const x = ax + u * (bx - ax), y = ay + u * (by - ay), d = Math.hypot(x, y);
      if (d < dMejor) { dMejor = d; mejor = { lat: s.lat + y / ky, lon: s.lon + x / kx }; }
    }
  }
  if (mejor) { console.log(s.id, 'punto movido', dMejor.toFixed(0), 'm hasta la calle'); Object.assign(s, mejor); }
}

function dibujar(s, datos) {
  const escala = ANCHO / (2 * s.metros); // px por metro
  const kx = 111320 * Math.cos((s.lat * Math.PI) / 180), ky = 110540;
  const px = (p) => [ANCHO / 2 + (p.lon - s.lon) * kx * escala, ALTO / 2 - (p.lat - s.lat) * ky * escala];
  const f = (n) => Math.round(n * 10) / 10;
  const linea = (g) => g.map(px).map(([x, y], i) => (i ? 'L' : 'M') + f(x) + ' ' + f(y)).join('');

  const capas = { parque: [], chica: [], media: [], grande: [], clave: [] };
  const tramos = {}; // nombre -> geometrías, para la etiqueta
  for (const e of datos.elements) {
    if (!e.geometry) continue;
    const t = e.tags ?? {};
    if (t.leisure || t.landuse) { capas.parque.push(linea(e.geometry) + 'Z'); continue; }
    const c = claseDe(t.highway);
    if (!c) continue;
    const d = linea(e.geometry);
    if (s.etiquetas.includes(t.name)) { capas.clave.push(d); (tramos[t.name] ??= []).push(e.geometry); }
    else capas[c].push(d);
  }

  // Etiqueta de cada calle clave: el tramo más largo cerca del centro, escrito de izquierda a derecha.
  const textos = [];
  s.etiquetas.forEach((nombre, i) => {
    const candidatos = (tramos[nombre] ?? []).map((g) => g.map(px));
    let mejor = null, largoMejor = 0;
    for (const pts of candidatos) {
      const enVista = pts.filter(([x, y]) => x > 40 && x < ANCHO - 40 && y > 40 && y < ALTO - 40);
      let largo = 0;
      for (let k = 1; k < enVista.length; k++) largo += Math.hypot(enVista[k][0] - enVista[k - 1][0], enVista[k][1] - enVista[k - 1][1]);
      if (largo > largoMejor) { largoMejor = largo; mejor = enVista; }
    }
    if (!mejor || largoMejor < 160) return;
    if (mejor[0][0] > mejor[mejor.length - 1][0]) mejor.reverse();
    const id = `${s.id}-c${i}`;
    const d = mejor.map(([x, y], k) => (k ? 'L' : 'M') + f(x) + ' ' + f(y)).join('');
    const corto = nombre.replace(/^(Calle|Avenida) /, (m) => (m.startsWith('Av') ? 'Av. ' : ''));
    textos.push(`<path id="${id}" d="${d}" fill="none"/><text dy="-14"><textPath href="#${id}" startOffset="${i ? '22%' : '62%'}" text-anchor="middle">${corto}</textPath></text>`);
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" preserveAspectRatio="xMidYMid slice">
<rect width="${ANCHO}" height="${ALTO}" fill="#161412"/>
<path fill="#1d2119" d="${capas.parque.join('')}"/>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="#25221f" stroke-width="3" d="${capas.chica.join('')}"/>
<path stroke="#302c28" stroke-width="7" d="${capas.media.join('')}"/>
<path stroke="#3d3833" stroke-width="12" d="${capas.grande.join('')}"/>
<path stroke="#8c8276" stroke-width="12" d="${capas.clave.join('')}"/>
</g>
<g font-family="Segoe UI, system-ui, -apple-system, sans-serif" font-size="22" font-weight="600" letter-spacing="1" fill="#e9e2d6">${textos.join('')}</g>
</svg>
`;
  fs.writeFileSync(path.join(salida, s.id + '.svg'), svg);
  console.log(s.id, (svg.length / 1024).toFixed(1), 'KB,', datos.elements.length, 'elementos,', textos.length, 'etiquetas');
}

for (const s of sucursales) {
  const datos = await descargar(s);
  if (s.pegar) pegarACalle(s, datos);
  dibujar(s, datos);
  console.log(s.id, 'centro', s.lat.toFixed(6), s.lon.toFixed(6));
  await new Promise((listo) => setTimeout(listo, 1500));
}
