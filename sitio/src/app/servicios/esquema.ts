import { NEGOCIO, Sucursal } from './datos';
import { BASE } from './seo';

const DIAS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * JSON-LD Restaurant de una sucursal, con los mismos datos que se ven en pantalla (dis-091).
 * Solo se genera para sucursales confirmadas: no se afirma en datos estructurados lo que no está verificado.
 * Sin teléfono ni coordenadas: no son públicos.
 */
export function restaurante(s: Sucursal): object | null {
  if (!s.confirmada || !s.direccion.confirmado) return null;
  const p = NEGOCIO.precioPorPersona;
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${BASE}/${s.id}#restaurante`,
    name: `${NEGOCIO.nombre.valor} ${s.nombre}`,
    url: `${BASE}/${s.id}`,
    servesCuisine: ['Ramen', 'Japonesa'],
    description: `${NEGOCIO.estilo.valor}.`,
    priceRange: `$${p.min} a $${p.max} ${p.moneda} por persona`,
    currenciesAccepted: 'MXN',
    acceptsReservations: false,
    hasMenu: `${BASE}/menu`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.direccion.calle,
      addressLocality: s.direccion.ciudad,
      addressRegion: s.direccion.estado,
      postalCode: s.direccion.cp ?? undefined,
      addressCountry: 'MX',
    },
    openingHoursSpecification: s.horario.turnos.map((t) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: t.dias.map((d) => DIAS[d]),
      opens: t.abre,
      closes: t.cierra,
    })),
    sameAs: NEGOCIO.redes.tiktok.confirmado ? [NEGOCIO.redes.tiktok.url] : [],
  };
}
