// QR con la identidad de Take-chan (carta dis-094, adaptada): módulos como puntos de tinta redondeados con textura
// leve de pincel, los tres ojos en sumi con el centro bermellón y el sello hanko 家系 al centro.
// Corrección de errores H (aguanta hasta 30 % de daño, así que el sello no rompe la lectura), fondo washi,
// contraste alto y zona de silencio de 4 módulos. Lo usan los impresos, las pruebas de escaneo y el sitio
// (scripts/qr-datos.mjs guarda la matriz para el QR animado de la carta dis-081).
import QRCode from 'qrcode';

export const COLORES = { fondo: '#f3eee4', tinta: '#121110', ojo: '#b52c15' };
const ZONA = 4;

/** Matriz del QR con corrección H: lado n y bits (1 = módulo oscuro), fila por fila. */
export function matriz(url) {
  const q = QRCode.create(url, { errorCorrectionLevel: 'H' });
  return { n: q.modules.size, bits: Array.from(q.modules.data, (b) => (b ? 1 : 0)) };
}

/** Lado del hueco central para el sello (impar, cerca del 21 % del QR). */
export const ladoSello = (n) => { const l = Math.round(n * 0.21); return l % 2 ? l : l + 1; };

/** ¿El módulo (x, y) pertenece a uno de los tres ojos? */
export const enOjo = (n, x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);

/** Generador pseudoaleatorio con semilla: el mismo QR sale igual en cada build. */
function azar(semilla) {
  let s = semilla >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/**
 * Trazos del QR en unidades de módulo (sin la zona de silencio): un path por fila con puntos de tinta,
 * más los ojos. Devuelve { filas, ojos, hueco } para dibujarlos como SVG o animarlos por filas.
 */
export function trazos({ n, bits }, semilla = 7) {
  const r = azar(semilla);
  const l = ladoSello(n), h0 = (n - l) / 2, h1 = h0 + l;
  const filas = [];
  for (let y = 0; y < n; y++) {
    let d = '';
    for (let x = 0; x < n; x++) {
      if (!bits[y * n + x] || enOjo(n, x, y)) continue;
      // El hueco del sello (con un margen de medio módulo alrededor) queda limpio.
      if (x >= h0 - 0.5 && x < h1 + 0.5 && y >= h0 - 0.5 && y < h1 + 0.5) continue;
      // Cuadro muy redondeado (radio cerca de un tercio): cubre ~90 % del módulo, como uno normal,
      // y se lee como gota de tinta. Un círculo cubre solo 72 % y pierde lectura con desenfoque.
      const f = (v) => Math.round(v * 100) / 100;
      const s = 1, rr = 0.2 + r() * 0.05, x0 = x, y0 = y, l = s - 2 * rr;
      d += `M${f(x0 + rr)} ${f(y0)}h${f(l)}a${f(rr)} ${f(rr)} 0 0 1 ${f(rr)} ${f(rr)}v${f(l)}a${f(rr)} ${f(rr)} 0 0 1 ${f(-rr)} ${f(rr)}h${f(-l)}a${f(rr)} ${f(rr)} 0 0 1 ${f(-rr)} ${f(-rr)}v${f(-l)}a${f(rr)} ${f(rr)} 0 0 1 ${f(rr)} ${f(-rr)}z`;
    }
    filas.push(d);
  }
  const ojos = [[0, 0], [n - 7, 0], [0, n - 7]].map(([x, y]) => ({
    marco: `M${x + 1.6} ${y}h3.8a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6h-3.8a1.6 1.6 0 0 1-1.6-1.6v-3.8a1.6 1.6 0 0 1 1.6-1.6zM${x + 1.9} ${y + 1}a.9 .9 0 0 0-.9 .9v3.2a.9 .9 0 0 0 .9 .9h3.2a.9 .9 0 0 0 .9-.9v-3.2a.9 .9 0 0 0-.9-.9z`,
    centro: { x: x + 2, y: y + 2 },
  }));
  return { filas, ojos, hueco: { x: h0, y: h0, lado: l } };
}

/**
 * SVG completo del QR de tinta, listo para imprimir o incrustar.
 * sello: data URI o URL de la imagen del sello; textura: false para un trazo limpio (pantallas muy chicas);
 * fondo: el color del papel donde va impreso (siempre claro, para el contraste).
 */
export function svgTinta(url, { sello = '', textura = true, semilla = 7, id = 'qr', fondo = COLORES.fondo } = {}) {
  const m = matriz(url);
  const { filas, ojos, hueco } = trazos(m, semilla);
  const lado = m.n + ZONA * 2;
  const filtro = textura
    ? `<filter id="${id}-pincel" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="${semilla}" result="r"/><feDisplacementMap in="SourceGraphic" in2="r" scale="0.1" xChannelSelector="R" yChannelSelector="G"/></filter>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${lado} ${lado}" role="img" aria-label="Código QR"><defs>${filtro}</defs>
<rect width="${lado}" height="${lado}" fill="${fondo}"/>
<g transform="translate(${ZONA} ${ZONA})">
<g fill="${COLORES.tinta}"${textura ? ` filter="url(#${id}-pincel)"` : ''}><path d="${filas.join('')}"/>${ojos.map((o) => `<path fill-rule="evenodd" d="${o.marco}"/>`).join('')}</g>
${ojos.map((o) => `<rect x="${o.centro.x}" y="${o.centro.y}" width="3" height="3" rx=".8" fill="${COLORES.ojo}"/>`).join('')}
${sello ? `<image href="${sello}" x="${hueco.x + 0.4}" y="${hueco.y + 0.4}" width="${hueco.lado - 0.8}" height="${hueco.lado - 0.8}" transform="rotate(-5 ${hueco.x + hueco.lado / 2} ${hueco.y + hueco.lado / 2})"/>` : ''}
</g></svg>`;
}
