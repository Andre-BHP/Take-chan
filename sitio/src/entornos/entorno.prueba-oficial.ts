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
  goatcounter: '',
  hojaUrl: '',
};
