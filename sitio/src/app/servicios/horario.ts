import { Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Turno } from './datos';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

export interface Ahora { dia: number; minutos: number }

export function ahoraEnGuadalajara(): Ahora {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const v = (t: string) => partes.find((p) => p.type === t)?.value ?? '0';
  const dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday'));
  return { dia, minutos: Number(v('hour')) * 60 + Number(v('minute')) };
}

export const aMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
export const aHora = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export interface Estado { abierto: boolean; texto: string }

/** Hora local de Guadalajara, solo en el navegador; en el prerender es null. */
@Injectable({ providedIn: 'root' })
export class Reloj {
  readonly ahora = signal<Ahora | null>(null);
  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      afterNextRender(() => {
        this.ahora.set(ahoraEnGuadalajara());
        // Cambia justo al empezar cada minuto, para que "cierra en 2 h 13 min" no se atrase.
        setTimeout(() => {
          this.ahora.set(ahoraEnGuadalajara());
          setInterval(() => this.ahora.set(ahoraEnGuadalajara()), 60_000);
        }, 60_000 - (Date.now() % 60_000) + 50);
      });
    }
  }
}

const turnoDe = (turnos: Turno[], dia: number) => turnos.find((t) => t.dias.includes(dia));

/** Tiempo que falta en palabras cortas: "2 h 13 min", "45 min", "1 h". */
export function falta(min: number): string {
  const h = Math.floor(min / 60), m = min % 60;
  return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ') || 'menos de 1 min';
}

/** "Abierto ahora · cierra en 2 h 13 min" o "Cerrado · abre mañana a las 12:00". */
export function estado(turnos: Turno[], a: Ahora): Estado {
  const hoy = turnoDe(turnos, a.dia);
  if (hoy && a.minutos >= aMin(hoy.abre) && a.minutos < aMin(hoy.cierra)) {
    return { abierto: true, texto: `Abierto ahora · cierra en ${falta(aMin(hoy.cierra) - a.minutos)}` };
  }
  if (hoy && a.minutos < aMin(hoy.abre)) return { abierto: false, texto: `Cerrado · abre hoy a las ${hoy.abre}` };
  for (let i = 1; i <= 7; i++) {
    const d = (a.dia + i) % 7;
    const t = turnoDe(turnos, d);
    if (t) return { abierto: false, texto: `Cerrado · abre ${i === 1 ? 'mañana' : 'el ' + DIAS[d]} a las ${t.abre}` };
  }
  return { abierto: false, texto: 'Cerrado' };
}

/** Texto fijo del horario, igual en el prerender y en el navegador. */
export function horarioTexto(turnos: Turno[]): string {
  return turnos
    .map((t) => `${t.dias.length === 7 ? 'Todos los días' : t.dias.map((d) => DIAS[d]).join(', ')} · ${t.abre} a ${t.cierra}`)
    .join(' / ');
}
