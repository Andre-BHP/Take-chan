import { PROPUESTA } from '../../entornos/modo';
import { Injectable, computed, signal } from '@angular/core';
import { MENU, Platillo, SUCURSALES, VERSION_DATOS, agotado, esRamen, platillo, pesos, sucursal } from './datos';
import { aHora, aMin } from './horario';

export interface Linea { platillo: Platillo; cantidad: number }

/**
 * Estado de la máquina de tickets (dis-072): platillos, al gusto, sucursal, hora y nombre.
 * Los precios son de ejemplo; el total también.
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

  readonly lineas = computed<Linea[]>(() => {
    VERSION_DATOS();
    return Object.entries(this.cantidades())
      .filter(([id, n]) => n > 0 && platillo(id))
      .map(([id, cantidad]) => ({ platillo: platillo(id), cantidad }));
  });
  readonly piezas = computed(() => this.lineas().reduce((s, l) => s + l.cantidad, 0));
  readonly lleva = computed(() => this.lineas().some((l) => esRamen(l.platillo)));
  readonly sucursal = computed(() => sucursal(this.sucursalId()));
  readonly total = computed(() => this.lineas().reduce((s, l) => s + l.cantidad * (l.platillo.precio ?? 0), 0));

  /** Horas para recoger cada 15 minutos hasta media hora antes del cierre. */
  readonly horas = computed(() => {
    VERSION_DATOS();
    const t = this.sucursal().horario.turnos[0];
    if (!t) return [];
    const fin = aMin(t.cierra) - MENU.recoger.margenCierreMinutos;
    const lista: string[] = [];
    for (let m = aMin(t.abre); m <= fin; m += MENU.recoger.cadaMinutos) lista.push(aHora(m));
    return lista;
  });

  cantidad(id: string) {
    return this.cantidades()[id] ?? 0;
  }

  sumar(id: string, n = 1) {
    if (n > 0 && agotado(platillo(id))) return;
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
    this.folio.set(String(((ahora.getHours() * 60 + ahora.getMinutes()) * 7) % 10000).padStart(4, '0'));
  }

  /** "fideo firme, sabor normal, grasa poca" */
  readonly gustoTexto = computed(() =>
    MENU.alGusto.opciones.map((o) => o.nombre.toLowerCase() + ' ' + this.alGusto()[o.id].toLowerCase()).join(', '),
  );

  readonly mensaje = computed(() => {
    const s = this.sucursal();
    const lineas = this.lineas().map(
      (l) => l.cantidad + ' × ' + l.platillo.nombre + (esRamen(l.platillo) ? ' (' + this.gustoTexto() + ')' : ''),
    );
    return [
      'Hola, Take-chan. Quiero apartar este pedido para recoger:',
      '',
      ...lineas,
      '',
      'Sucursal: ' + s.nombre + ' (' + s.direccion.calle + ')',
      'Hora para recoger: ' + (this.hora() === 'pronto' ? 'lo antes posible' : this.hora()),
      ...(this.nombre().trim() ? ['A nombre de: ' + this.nombre().trim()] : []),
      (PROPUESTA ? 'Total de ejemplo: ' : 'Total: ') + pesos(this.total()),
      ...(this.folio() ? ['Ticket N.º ' + this.folio()] : []),
    ].join('\n');
  });
}
