/**
 * Un solo interruptor para todo el sitio: modo propuesta (prototipo no oficial) u oficial (el sitio del negocio).
 * Cada build toma su archivo de entorno (angular.json → fileReplacements). Qué cambia en cada modo: GUIA_PUBLICAR.md.
 */
export type Modo = 'propuesta' | 'oficial';

export interface Entorno {
  modo: Modo;
  /** WhatsApp de pedidos con lada de país, solo dígitos (por ejemplo 5213312345678). Vacío: modo demostración. */
  whatsapp: string;
  /** Dominio público sin diagonal final (https://take-chan.mx). Da la URL canónica y el sitemap. */
  dominio: string;
  /** Código de GoatCounter (el "xxx" de xxx.goatcounter.com). Vacío: sin estadísticas. */
  goatcounter: string;
  /** URL de la hoja de Google publicada como CSV. Vacío: se usan los JSON del build. */
  hojaUrl: string;
}
