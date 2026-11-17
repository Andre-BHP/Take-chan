// Revisión de SEO local sobre un build: JSON-LD (Restaurant y FAQPage), coherencia de nombre, dirección y horario
// entre páginas, y sitemap solo en modo oficial. Lee los HTML prerenderizados; no abre navegador.
// Uso: node herramientas/seo-local.mjs sitio/dist/<config>/browser
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = path.resolve(raiz, process.argv[2] ?? 'sitio/dist/pages/browser');
const negocio = JSON.parse(fs.readFileSync(path.join(raiz, 'sitio/src/datos/negocio.json'), 'utf8'));
let fallas = 0;
const ok = (c, t) => { console.log((c ? 'ok    ' : 'FALLA ') + t); if (!c) fallas++; };
const leer = (r) => fs.readFileSync(path.join(build, r === '/' ? 'index.html' : r.slice(1) + '/index.html'), 'utf8');
const texto = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const esquemas = (h) => [...h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const oficial = leer('/').includes('index, follow');
console.log(`Build ${path.relative(raiz, build)} (modo ${oficial ? 'oficial' : 'propuesta'})`);

const t = negocio.sucursales[0];
const inicio = leer('/');
const ld = esquemas(inicio);
const rest = ld.find((e) => e['@type'] === 'Restaurant');
const faq = ld.find((e) => e['@type'] === 'FAQPage');
ok(rest && rest.name && rest.address?.streetAddress === t.direccion.calle && rest.address?.postalCode === t.direccion.cp && rest.servesCuisine && rest.priceRange && rest.hasMenu && rest.image, 'Restaurant de Tlaquepaque con nombre, dirección, CP, cocina, precios, menú e imagen');
ok(rest?.openingHoursSpecification?.length && rest.openingHoursSpecification.every((o) => o.opens && o.closes && o.dayOfWeek.length), 'Restaurant con horario por días');
ok(!ld.some((e) => e['@type'] === 'Restaurant' && /americana/i.test(e.name)), 'sin Restaurant de la Americana (por confirmar)');
ok(!rest?.telephone && !rest?.geo, 'sin teléfono ni coordenadas en el esquema (no son públicos)');
const visibles = texto(inicio);
ok(faq && faq.mainEntity.length >= 5 && faq.mainEntity.every((q) => visibles.includes(q.name) && visibles.includes(q.acceptedAnswer.text)), `FAQPage con ${faq?.mainEntity.length ?? 0} preguntas, iguales a las visibles`);
ok(faq && !faq.mainEntity.some((q) => /pago|estacionamiento|sin cerdo|niños/i.test(q.name)), 'FAQPage sin las preguntas que dependen del negocio');

// Coherencia de nombre, dirección y horario (NAP) entre páginas.
for (const r of ['/', '/menu', '/tlaquepaque', '/americana', '/links']) {
  const v = texto(leer(r));
  ok(v.includes('Take-chan'), `${r}: nombre Take-chan`);
  if (r !== '/links' && r !== '/menu') ok(v.includes(t.direccion.calle), `${r}: dirección "${t.direccion.calle}"`);
}
const sucursal = texto(leer('/tlaquepaque'));
ok(sucursal.includes(`${t.horario.turnos[0].abre} a ${t.horario.turnos[0].cierra}`) && sucursal.includes(t.direccion.cp) && sucursal.includes('Niños Héroes'), 'ficha de Tlaquepaque: horario, CP y referencia iguales al esquema');
const restSucursal = esquemas(leer('/tlaquepaque')).find((e) => e['@type'] === 'Restaurant');
ok(restSucursal && JSON.stringify(restSucursal.address) === JSON.stringify(rest.address), 'mismo Restaurant (dirección) en la portada y en la ficha');

// Sitemap e índice según el modo.
const sitemap = fs.existsSync(path.join(build, 'sitemap.xml'));
ok(oficial ? sitemap : !sitemap, `sitemap.xml ${sitemap ? 'presente' : 'ausente'} (${oficial ? 'oficial' : 'propuesta'})`);
console.log(fallas ? `\n${fallas} fallas` : '\nTodo en orden');
process.exit(fallas ? 1 : 0);
