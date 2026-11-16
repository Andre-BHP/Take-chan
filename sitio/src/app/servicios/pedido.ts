import { Injectable, computed, signal } from '@angular/core';
import { MENU, Platillo, SUCURSALES, platillo, pesos, sucursal } from './datos';
import { aHora, aMin } from './horario';

export interface Linea { platillo: Platillo; cantidad: number }

/**
 * Estado del pedido de la máquina de tickets (dis-072): platillos, al gusto, sucursal, hora y nombre.
 * No calcula total mientras los precios estén sin confirmar.
 */
@Injectable({ providedIn: 'root' })
export class Pedido {
  readonly cantidades = signal<Record<string, number>>({});
  readonly alGusto = signal<Record<string, string>>(Object.fromEntries(MENU.alGusto.opciones.map((o) => [o.id, o.omision])));
  readonly sucursalId = signal<string>(SUCURSALES[0].id);
  readonly hora = signal<string>('pronto');
  readonly nombre = signal('');
  /** Folio del último ticket impreso (null si no se ha impreso o si cambió el pedido). */
  readonly folio = signal<string | null>(null);

  readonly lineas = computed<Linea[]>(() =>
    Object.entries(this.cantidades())
      .filter(([, n]) => n > 0)
      .map(([id, cantidad]) => ({ platillo: platillo(id), cantidad })),
  );
  readonly piezas = computed(() => this.lineas().reduce((s, l) => s + l.cantidad, 0));
  readonly lleva = computed(() => this.lineas().some((l) => MENU.categorias[0].items.includes(l.platillo)));
  readonly sucursal = computed(() => sucursal(this.sucursalId()));

  /** Total solo si todos los precios están confirmados; si no, null ("por confirmar"). */
  readonly total = computed(() => {
    const ls = this.lineas();
    if (!ls.length || ls.some((l) => l.platillo.precio == null || !l.platillo.confirmado)) return null;
    return ls.reduce((s, l) => s + l.cantidad * (l.platillo.precio ?? 0), 0);
  });

  /** Horas para recoger cada 15 minutos hasta media hora antes del cierre. */
  readonly horas = computed(() => {
    const t = this.sucursal().horario.turnos[0];
    const fin = aMin(t.cierra) - MENU.recoger.margenCierreMinutos;
    const lista: string[] = [];
    for (let m = aMin(t.abre); m <= fin; m += MENU.recoger.cadaMinutos) lista.push(aHora(m));
    return lista;
  });

  cantidad(id: string) {
    return this.cantidades()[id] ?? 0;
  }

  sumar(id: string, n = 1) {
    this.cantidades.update((c) => ({ ...c, [id]: Math.max(0, Math.min(20, (c[id] ?? 0) + n)) }));
    this.folio.set(null);
  }

  vaciar() {
    this.cantidades.set({});
    this.folio.set(null);
  }

  cambiar<T>(s: { set: (v: T) => void }, v: T) {
    s.set(v);
    this.folio.set(null);
  }

  elegirGusto(id: string, valor: string) {
    this.alGusto.update((g) => ({ ...g, [id]: valor }));
    this.folio.set(null);
  }

  imprimir() {
    const ahora = new Date();
    this.folio.set(String((ahora.getHours() * 60 + ahora.getMinutes()) * 7 % 10000).padStart(4, '0'));
  }

  readonly mensaje = computed(() => {
    const s = this.sucursal();
    const gusto = MENU.alGusto.opciones.map((o) => `${o.nombre.toLowerCase()} ${this.alGusto()[o.id].toLowerCase()}`).join(', ');
    const lineas = this.lineas().map((l) => {
      const esRamen = MENU.categorias[0].items.includes(l.platillo);
      return `${l.cantidad} × ${l.platillo.nombre}${esRamen ? ` (${gusto})` : ''}`;
    });
    const total = this.total();
    return [
      'Hola, Take-chan. Quiero apartar este pedido para recoger:',
      '',
      ...lineas,
      '',
      `Sucursal: ${s.nombre} (${s.direccion.calle})`,
      `Hora para recoger: ${this.hora() === 'pronto' ? 'lo antes posible' : this.hora()}`,
      ...(this.nombre().trim() ? [`A nombre de: ${this.nombre().trim()}`] : []),
      `Total: ${total == null ? 'por confirmar' : pesos(total)}`,
      ...(this.folio() ? [`Ticket N.º ${this.folio()}`] : []),
    ].join('\n');
  });
}
