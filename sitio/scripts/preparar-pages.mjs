// Ajusta el build de la versión publicada (ng build -c pages) antes de subirlo a GitHub Pages.
// Uso: node scripts/preparar-pages.mjs dist/pages/browser
import fs from 'node:fs';
import path from 'node:path';

const raiz = process.argv[2] ?? 'dist/pages/browser';
const leer = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
const escribir = (f, t) => fs.writeFileSync(path.join(raiz, f), t);
const paginas = (dir = raiz) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? paginas(p) : e.name.endsWith('.html') ? [path.relative(raiz, p)] : [];
  });

// 1. Prototipo no oficial: noindex también en la página de respaldo.
for (const f of paginas()) {
  let t = leer(f);
  if (!t.includes('name="robots"')) t = t.replace('</head>', '<meta name="robots" content="noindex, nofollow"></head>');
  escribir(f, t);
}
// 2. robots.txt que bloquea todo y sin sitemap.
escribir('robots.txt', 'User-agent: *\nDisallow: /\n');
fs.rmSync(path.join(raiz, 'sitemap.xml'), { force: true });
// 3. Rutas desconocidas: GitHub Pages sirve 404.html.
if (fs.existsSync(path.join(raiz, 'index.csr.html'))) fs.copyFileSync(path.join(raiz, 'index.csr.html'), path.join(raiz, '404.html'));
// 4. Sin Jekyll.
escribir('.nojekyll', '');

// 5. Nada de contacto real en lo publicado.
const prohibido = /wa\.me\/52\d|tel:\+?52\d|mailto:/;
const revisar = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return revisar(p);
    return /\.(html|js|css|txt|json)$/.test(e.name) && prohibido.test(fs.readFileSync(p, 'utf8')) ? [p] : [];
  });
const malos = revisar(raiz);
if (malos.length) { console.error('Contacto real encontrado en la versión publicada:', malos); process.exit(1); }
// 6. Cada página prerenderizada lleva el aviso y el noindex.
for (const f of paginas().filter((f) => !/index\.csr|404/.test(f))) {
  const t = leer(f);
  if (!t.includes('Propuesta no oficial de sitio para Take-chan Ramen') || !t.includes('noindex, nofollow')) {
    console.error(`${f}: falta el aviso o el noindex`);
    process.exit(1);
  }
}
console.log('Build de Pages listo y revisado:', paginas().length, 'páginas.');
