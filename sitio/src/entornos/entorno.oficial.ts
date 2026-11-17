import { Entorno } from './tipo';

/**
 * Sitio oficial de Take-chan Ramen. Se llena el día que el negocio acepte (GUIA_PUBLICAR.md, paso 1).
 * Mientras whatsapp esté vacío, el pedido sigue en modo demostración; sin dominio, el build se detiene.
 */
export const ENTORNO: Entorno = {
  modo: 'oficial',
  whatsapp: '',
  dominio: '',
  publico: '',
  goatcounter: '',
  hojaUrl: '',
};
