import { ENTORNO } from './entorno';

/** true en el sitio oficial; false en la propuesta (aviso, noindex, datos de ejemplo y WhatsApp de demostración). */
export const OFICIAL = ENTORNO.modo === 'oficial';
export const PROPUESTA = !OFICIAL;
