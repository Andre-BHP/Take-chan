// Ajusta y revisa un build antes de publicarlo, según su modo (src/entornos/entorno.<config>.ts).
//   propuesta (pages): noindex en todo, robots.txt con Disallow: /, sin sitemap, aviso en cada página y nada de contacto real.
//   oficial (oficial, prueba-oficial): index, robots.txt con el sitemap, sitemap.xml con el dominio y sin el aviso de propuesta.
// Uso: node scripts/preparar.mjs dist/<config>/browser <config>
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generarLinks } from './links.mjs';

const [raiz = 'dist/pages/browser', config = 'pages'] = process.argv.slice(2);
const sitio = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fuente = fs.readFileSync(path.join(sitio, 'src', 'entornos', `entorno.${config}.ts`), 'utf8');
const campo = (n) => fuente.match(new RegExp(`${n}:\\s*'([^']*)'`))?.[1] ?? '';
const modo = campo('modo');
const dominio = campo('dominio').replace(/\/$/, '');
const falla = (m) => { console.error(`[${config}] ${m}`); process.exit(1); };
if (modo !== 'propuesta' && modo !== 'oficial') falla(`modo desconocido: "${modo}"`);

const leer = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
const escribir = (f, t) => fs.writeFileSync(path.join(raiz, f), t);
const paginas = (dir = raiz) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? paginas(p) : e.name.endsWith('.html') ? [path.relative(raiz, p).replaceAll('\\', '/')] : [];
  });
/** Páginas públicas (sin la página de respaldo, la 404 ni las internas que no se indexan). */
const publicas = () => paginas().filter((f) => !/index\.csr|404|impresos/.test(f));
const ruta = (f) => '/' + f.replace(/(^|\/)index\.html$/, '').replace(/\.html$/, '');

// Rutas desconocidas: GitHub Pages (y la mayoría de los hostings estáticos) sirven 404.html.
if (fs.existsSync(path.join(raiz, 'index.csr.html'))) fs.copyFileSync(path.join(raiz, 'index.csr.html'), path.join(raiz, '404.html'));
escribir('.nojekyll', '');
// /links: página estática y ligera para la biografía de TikTok (scripts/links.mjs).
generarLinks({ raiz, modo, dominio, publico: campo('publico') });
const AVISO = 'Propuesta no oficial de sitio para Take-chan Ramen';

if (modo === 'propuesta') {
  // 1. noindex también en la página de respaldo.
  for (const f of paginas()) {
    const t = leer(f);
    if (!t.includes('name="robots"')) escribir(f, t.replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>'));
  }
  // 2. robots.txt que bloquea todo y sin sitemap.
  escribir('robots.txt', 'User-agent: *\nDisallow: /\n');
  fs.rmSync(path.join(raiz, 'sitemap.xml'), { force: true });
  // 3. Nada de contacto real en lo publicado.
  const prohibido = /wa\.me\/52\d|tel:\+?52\d|mailto:/;
  const revisar = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return revisar(p);
      return /\.(html|js|css|txt|json)$/.test(e.name) && prohibido.test(fs.readFileSync(p, 'utf8')) ? [p] : [];
    });
  const malos = revisar(raiz);
  if (malos.length) falla('contacto real encontrado en la versión publicada: ' + malos.join(', '));
  // 4. Cada página prerenderizada lleva el aviso y el noindex.
  for (const f of publicas()) {
    const t = leer(f);
    if (!t.includes(AVISO) || !t.includes('noindex, nofollow')) falla(`${f}: falta el aviso o el noindex`);
  }
} else {
  if (!/^https:\/\/[^/]+$/.test(dominio)) falla('falta el dominio en el entorno (https://… sin diagonal final). Ver GUIA_PUBLICAR.md, paso 1.');
  // 1. La página de respaldo no se indexa; las demás sí.
  for (const f of paginas()) {
    let t = leer(f);
    if (/index\.csr|404/.test(f) && !t.includes('name="robots"')) t = t.replace('</head>', '<meta name="robots" content="noindex"></head>');
    escribir(f, t);
  }
  // 2. Sitemap con el dominio y robots.txt que lo anuncia.
  const urls = publicas().map((f) => `  <url><loc>${dominio}${ruta(f) === '/' ? '/' : ruta(f)}</loc></url>`);
  escribir('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  escribir('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${dominio}/sitemap.xml\n`);
  // 3. Sin rastros de la propuesta y con canónica e index en cada página pública.
  for (const f of publicas()) {
    const t = leer(f);
    if (t.includes(AVISO)) falla(`${f}: todavía lleva el aviso de propuesta`);
    if (t.includes('noindex')) falla(`${f}: todavía lleva noindex`);
    if (!t.includes(`rel="canonical" href="${dominio}`)) falla(`${f}: falta la URL canónica con ${dominio}`);
  }
}
// El service worker comprueba cada archivo con el hash de ngsw.json: los que se tocaron aquí se vuelven a calcular.
const ngsw = path.join(raiz, 'ngsw.json');
if (fs.existsSync(ngsw)) {
  const m = JSON.parse(fs.readFileSync(ngsw, 'utf8'));
  const prefijo = (fs.readFileSync(path.join(raiz, 'index.html'), 'utf8').match(/<base href="([^"]*)"/)?.[1] ?? '/');
  let cambiados = 0;
  for (const url of Object.keys(m.hashTable)) {
    const f = path.join(raiz, url.slice(prefijo.length));
    if (!fs.existsSync(f)) continue;
    const h = crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
    if (h !== m.hashTable[url]) { m.hashTable[url] = h; cambiados++; }
  }
  fs.writeFileSync(ngsw, JSON.stringify(m, null, 2));
  if (cambiados) console.log(`ngsw.json: ${cambiados} hash(es) actualizados`);
}
console.log(`Build "${config}" (modo ${modo}) listo y revisado: ${publicas().length} páginas públicas.`);
