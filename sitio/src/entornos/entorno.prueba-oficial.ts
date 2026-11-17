import { Entorno } from './tipo';

/**
 * Ensayo del modo oficial con datos falsos (número 5210000000000 y dominio ejemplo.test, reservado).
 * Sirve para probar GUIA_PUBLICAR.md de punta a punta. Nunca se publica.
 */
export const ENTORNO: Entorno = {
  modo: 'oficial',
  whatsapp: '5210000000000',
  dominio: 'https://ejemplo.test',
  publico: '',
  // Contador local de prueba: herramientas/estadisticas.mjs lee lo que llega aquí. Nunca va a goatcounter.com.
  goatcounter: 'http://localhost:4344/__conteo',
  // Ensayo: las pestañas de ejemplo del propio build (public/datos-ejemplo/), con un platillo agotado y un aviso.
  hoja: { menu: 'datos-ejemplo/menu.csv', horario: 'datos-ejemplo/horario.csv', aviso: 'datos-ejemplo/aviso.csv' },
};
