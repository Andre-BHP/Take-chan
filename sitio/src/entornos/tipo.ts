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
  /** Dónde se sirve este build si no hay dominio (la propuesta en GitHub Pages). Solo para las imágenes al compartir. */
  publico: string;
  /** Código de GoatCounter (el "xxx" de xxx.goatcounter.com) o una URL completa de contador. Vacío: sin estadísticas. */
  goatcounter: string;
  /**
   * Pestañas de la hoja de Google publicadas como CSV (Archivo → Compartir → Publicar en la Web → CSV), una URL por pestaña.
   * Vacías: se usan los JSON del build. Formato de cada pestaña: GUIA_EDITAR.md.
   */
  hoja: { menu: string; horario: string; aviso: string };
}
