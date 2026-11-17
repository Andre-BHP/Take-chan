import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ENTORNO } from '../../entornos/entorno';
import { AVISO_JSON, Aviso, Categoria, MENU, Platillo, SUCURSALES, Turno, VERSION_DATOS, reindexar } from './datos';

const ESPERA_MS = 3000;
const CACHE_MS = 10 * 60 * 1000;
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** CSV sencillo (RFC 4180): comas, comillas dobles y saltos de línea dentro de comillas. */
export function leerCsv(texto: string): Record<string, string>[] {
  const filas: string[][] = [];
  let fila: string[] = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') comillas = false;
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }
  const [cabeza, ...resto] = filas.filter((f) => f.some((v) => v.trim()));
  if (!cabeza) return [];
  const claves = cabeza.map((c) => c.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''));
  return resto.map((f) => Object.fromEntries(claves.map((k, i) => [k, (f[i] ?? '').trim()])));
}

const no = (v: string) => /^(no|agotado|false|0|n)$/i.test(v);
const dia = (v: string) => {
  const n = Number(v);
  if (v !== '' && Number.isInteger(n) && n >= 0 && n <= 6) return n;
  return DIAS.indexOf(v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace('miercoles', 'miércoles').replace('sabado', 'sábado'));
};
const hora = (v: string) => (/^\d{1,2}:\d{2}$/.test(v) ? v.padStart(5, '0') : '');

/**
 * Datos editables desde una hoja de Google publicada como CSV (pestañas de menú, horario y aviso).
 * Solo en el navegador: el prerender y el SEO usan los JSON del build. Si la hoja tarda más de 3 s
 * o falla, se usa la última copia guardada (10 min) o se quedan los JSON.
 */
@Injectable({ providedIn: 'root' })
export class Hoja {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  /** Aviso vigente (de la hoja o de negocio.json), o null. */
  readonly aviso = signal<Aviso | null>(null);
  /** De dónde salió cada pestaña: hoja, copia, json. Para pruebas y para la guía. */
  readonly origen = signal<Record<string, string>>({});

  constructor() {
    this.aviso.set(vigente(AVISO_JSON));
  }

  async cargar() {
    if (!this.navegador) return;
    const { menu, horario, aviso } = ENTORNO.hoja;
    await Promise.all([
      menu && this.pestana('menu', menu, (f) => aplicarMenu(f)),
      horario && this.pestana('horario', horario, (f) => aplicarHorario(f)),
      aviso && this.pestana('aviso', aviso, (f) => this.aviso.set(vigente(f.map((x) => ({ texto: x['texto'], desde: x['desde'], hasta: x['hasta'] }))))),
    ]);
  }

  private async pestana(nombre: string, url: string, aplicar: (filas: Record<string, string>[]) => void) {
    const clave = 'take-hoja:' + url;
    let guardada: { t: number; texto: string } | null = null;
    try { guardada = JSON.parse(localStorage.getItem(clave) ?? 'null'); } catch { /* sin almacenamiento */ }
    let texto = guardada && Date.now() - guardada.t < CACHE_MS ? guardada.texto : null;
    let origen = texto ? 'copia' : 'hoja';
    if (!texto) {
      try {
        const ctl = new AbortController();
        const reloj = setTimeout(() => ctl.abort(), ESPERA_MS);
        const r = await fetch(new URL(url, document.baseURI).href, { signal: ctl.signal, cache: 'no-store' });
        clearTimeout(reloj);
        if (!r.ok) throw new Error(String(r.status));
        texto = await r.text();
        try { localStorage.setItem(clave, JSON.stringify({ t: Date.now(), texto })); } catch { /* sin almacenamiento */ }
      } catch {
        texto = guardada?.texto ?? null;
        origen = texto ? 'copia' : 'json';
      }
    }
    if (texto) {
      try {
        const filas = leerCsv(texto);
        if (filas.length) { aplicar(filas); VERSION_DATOS.update((v) => v + 1); }
        else origen = 'json';
      } catch { origen = 'json'; }
    }
    this.origen.update((o) => ({ ...o, [nombre]: origen }));
  }
}

/** El primer aviso vigente ahora (hora de Guadalajara, UTC−6), o null. */
function vigente(avisos: Aviso[]): Aviso | null {
  const ahora = Date.now();
  const fecha = (v: string, fin: boolean) => (v ? Date.parse(v.trim().replace(' ', 'T') + (v.includes(':') ? ':00' : fin ? 'T23:59:59' : 'T00:00:00') + '-06:00') : NaN);
  return avisos.find((a) => a.texto && !(fecha(a.desde, false) > ahora) && !(fecha(a.hasta, true) < ahora)) ?? null;
}

/** Menú de la hoja: categoría, id, nombre, descripción, precio, foto y disponible. Respeta el orden de la hoja. */
function aplicarMenu(filas: Record<string, string>[]) {
  const existentes = new Map(MENU.categorias.flatMap((c) => c.items).map((p) => [p.id, p]));
  const categorias: Categoria[] = [];
  for (const f of filas) {
    const nombreCat = f['categoria'];
    const id = f['id'] || f['nombre'].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-');
    if (!nombreCat || !f['nombre']) continue;
    let cat = categorias.find((c) => c.id === nombreCat || c.nombre === nombreCat);
    if (!cat) {
      const previa = MENU.categorias.find((c) => c.id === nombreCat || c.nombre.toLowerCase() === nombreCat.toLowerCase());
      cat = previa ? { ...previa, items: [] } : { id: nombreCat.toLowerCase().replace(/[^a-z0-9]+/g, '-'), nombre: nombreCat, ja: '', items: [] };
      categorias.push(cat);
    }
    const p: Platillo = existentes.get(id) ?? { id, nombre: '', desc: '', precio: null, confirmado: false, foto: null };
    const precio = Number(String(f['precio'] ?? '').replace(/[$,\s]/g, ''));
    Object.assign(p, {
      nombre: f['nombre'],
      desc: f['descripcion'] ?? p.desc,
      precio: Number.isFinite(precio) && f['precio'] ? precio : p.precio,
      foto: f['foto'] === undefined ? p.foto : f['foto'] || null,
      disponible: !no(f['disponible'] ?? ''),
    });
    cat.items.push(p);
  }
  if (!categorias.length) return;
  MENU.categorias.splice(0, MENU.categorias.length, ...categorias);
  reindexar();
}

/** Horario de la hoja: sucursal, día, abre y cierra (vacío = cerrado). Junta los días con el mismo horario. */
function aplicarHorario(filas: Record<string, string>[]) {
  for (const s of SUCURSALES) {
    const propias = filas.filter((f) => (f['sucursal'] ?? '').toLowerCase().includes(s.id));
    if (!propias.length) continue;
    const turnos: Turno[] = [];
    for (const f of propias) {
      const d = dia(f['dia'] ?? '');
      const abre = hora(f['abre'] ?? ''), cierra = hora(f['cierra'] ?? '');
      if (d < 0 || !abre || !cierra) continue;
      const igual = turnos.find((t) => t.abre === abre && t.cierra === cierra);
      if (igual) igual.dias.push(d); else turnos.push({ dias: [d], abre, cierra });
    }
    s.horario.turnos.splice(0, s.horario.turnos.length, ...turnos);
  }
}
