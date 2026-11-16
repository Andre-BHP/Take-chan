import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
const raiz = path.resolve(process.argv[2]); const puerto = Number(process.argv[3] || 4300);
// Prefijo opcional para imitar GitHub Pages (por ejemplo /Arleth).
const prefijo = process.argv[4] || '';
const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.avif': 'image/avif', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.json': 'application/json' };
http.createServer((q, r) => {
  let ruta = decodeURIComponent(q.url.split('?')[0]);
  if (prefijo) {
    if (!ruta.startsWith(prefijo)) { r.writeHead(404); return r.end('fuera del prefijo'); }
    ruta = ruta.slice(prefijo.length) || '/';
  }
  let f = path.join(raiz, ruta);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { if (path.extname(f)) { r.writeHead(404); return r.end('no existe'); } f = path.join(raiz, 'index.csr.html'); }
  const comprimir = /\.(html|js|css|json|svg)$/.test(f) && /gzip/.test(q.headers['accept-encoding'] || '');
  r.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'application/octet-stream', 'cache-control': /\.(js|css|avif|webp|woff2?)$/.test(f) ? 'max-age=31536000' : 'no-cache', ...(comprimir ? { 'content-encoding': 'gzip' } : {}) });
  const flujo = fs.createReadStream(f);
  (comprimir ? flujo.pipe(zlib.createGzip()) : flujo).pipe(r);
}).listen(puerto, () => console.log('listo ' + puerto));
