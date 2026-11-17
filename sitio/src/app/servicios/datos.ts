import { signal } from '@angular/core';
import negocioJson from '../../datos/negocio.json';
import menuJson from '../../datos/menu.json';

export interface Turno { dias: number[]; abre: string; cierra: string }

export interface Direccion {
  calle: string;
  colonia: string;
  referencia: string | null;
  cp: string | null;
  ciudad: string;
  estado: string;
  confirmado: boolean;
}

export interface Sucursal {
  id: 'tlaquepaque' | 'americana';
  nombre: string;
  confirmada: boolean;
  direccion: Direccion;
  horario: { turnos: Turno[]; confirmado: boolean; nota: string };
  mapa: string;
}

interface Dato<T> { valor: T; confirmado: boolean; nota?: string }

interface Negocio {
  nombre: Dato<string>;
  estilo: Dato<string>;
  origen: Dato<string>;
  precioPorPersona: { min: number; max: number; moneda: string; confirmado: boolean };
  redes: { tiktok: { usuario: string; url: string; confirmado: boolean } };
  contacto: { whatsapp: Dato<string | null>; telefono: Dato<string | null>; correo: Dato<string | null> };
  sucursales: Sucursal[];
  avisos: Aviso[];
}

export interface Platillo {
  id: string;
  nombre: string;
  desc: string;
  precio: number | null;
  confirmado: boolean;
  foto: string | null;
  protagonista?: boolean;
  /** false: agotado hoy (la tecla se apaga con 売切). Sale de la hoja; en los JSON no se usa. */
  disponible?: boolean;
}

/** Aviso temporal ("Hoy cerramos a las 15:00"), con fechas desde y hasta (AAAA-MM-DD o AAAA-MM-DD HH:MM). */
export interface Aviso { texto: string; desde: string; hasta: string }

export interface Categoria { id: string; nombre: string; ja: string; items: Platillo[] }

export interface ValorAlGusto { ja: string; es: string }
export interface OpcionAlGusto { id: string; nombre: string; valores: ValorAlGusto[]; omision: string }

interface Menu {
  categorias: Categoria[];
  alGusto: { nota: string; confirmado: boolean; opciones: OpcionAlGusto[] };
  recoger: { nota: string; confirmado: boolean; cadaMinutos: number; margenCierreMinutos: number };
}

export const NEGOCIO = negocioJson as unknown as Negocio;
export const MENU = menuJson as unknown as Menu;

export const SUCURSALES = NEGOCIO.sucursales;
export const sucursal = (id: string) => SUCURSALES.find((s) => s.id === id)!;

/**
 * Sube cada vez que la hoja de Google cambia el menú, el horario o el aviso (servicios/hoja.ts).
 * Las plantillas y los cálculos que dependen de esos datos la leen para volver a dibujarse.
 */
export const VERSION_DATOS = signal(0);
export const AVISO_JSON = NEGOCIO.avisos ?? [];

let porId = new Map(MENU.categorias.flatMap((c) => c.items).map((p) => [p.id, p]));
/** Después de cambiar el menú: vuelve a indexar los platillos por id. */
export function reindexar() {
  porId = new Map(MENU.categorias.flatMap((c) => c.items).map((p) => [p.id, p]));
}
export const platillo = (id: string) => porId.get(id)!;
export const agotado = (p: Platillo | undefined) => p?.disponible === false;
export const esRamen = (p: Platillo) => MENU.categorias[0].items.includes(p);

/** Dirección en una línea, sin los campos vacíos. */
export const direccionCorta = (s: Sucursal) => [s.direccion.calle, s.direccion.colonia].filter(Boolean).join(', ');
export const direccionCompleta = (s: Sucursal) =>
  [s.direccion.calle, s.direccion.colonia, s.direccion.cp, s.direccion.ciudad, s.direccion.estado].filter(Boolean).join(', ');

/** Precio en pesos (de ejemplo mientras el negocio no confirme el suyo). */
export const pesos = (v: number | null) => (v == null ? '' : '$' + v.toLocaleString('es-MX'));

/** La nota única de cada página (CLAUDE.md, "Datos de ejemplo"). */
export const NOTA_EJEMPLO = 'Propuesta: menú, precios y fotos de ejemplo hasta que Take-chan confirme los suyos.';
