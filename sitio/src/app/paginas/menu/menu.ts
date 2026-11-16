import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MENU, SUCURSALES, direccionCorta, pesos } from '../../servicios/datos';
import { Pedido } from '../../servicios/pedido';
import { Contacto } from '../../servicios/contacto';
import { Seo } from '../../servicios/seo';
import { Foto } from '../../componentes/foto';
import { NotaEjemplo } from '../../componentes/nota-ejemplo';

@Component({
  selector: 'app-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Foto, NotaEjemplo],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  protected readonly pedido = inject(Pedido);
  protected readonly contacto = inject(Contacto);
  protected readonly menu = MENU;
  protected readonly sucursales = SUCURSALES;
  protected readonly direccion = direccionCorta;
  protected readonly pesos = pesos;
  protected readonly secciones = [
    ...MENU.categorias.map((c) => ({ id: c.id, nombre: c.nombre })),
    { id: 'al-gusto', nombre: 'Al gusto' },
  ];
  /** Sección visible, para el índice que sigue el scroll (dis-044). */
  protected readonly activa = signal(this.secciones[0].id);
  /** Tecla recién presionada: se hunde aunque se use el teclado (dis-059). */
  protected readonly pulsada = signal<string | null>(null);
  /** En celular, la barra inferior se esconde cuando el panel del pedido ya está a la vista. */
  protected readonly panelVisible = signal(false);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    inject(Seo).establecer({
      titulo: 'Menú y pedido · Take-chan Ramen',
      descripcion: 'Arma tu pedido de ramen Iekei como en una máquina de tickets japonesa y apártalo para recoger en Tlaquepaque. Menú y precios de ejemplo.',
      ruta: '/menu',
    });
    const ruta = inject(ActivatedRoute);
    const destruir = inject(DestroyRef);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    // En celular el índice es horizontal: la pestaña activa se desliza a la vista sin mover la página.
    effect(() => {
      const id = this.activa();
      const lista = this.host.nativeElement.querySelector<HTMLElement>('.indice ul');
      const a = lista?.querySelector<HTMLElement>(`a[href$="#cat-${id}"]`);
      if (!lista || !a || lista.scrollWidth <= lista.clientWidth) return;
      lista.scrollTo({ left: a.offsetLeft - lista.clientWidth / 2 + a.offsetWidth / 2, behavior: 'smooth' });
    });
    afterNextRender(() => {
      const id = ruta.snapshot.queryParamMap.get('ramen');
      if (id && MENU.categorias[0].items.some((p) => p.id === id) && this.pedido.cantidad(id) === 0) this.pedido.sumar(id);
      const observador = new IntersectionObserver(
        (entradas) => {
          const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (visible) this.activa.set((visible.target as HTMLElement).dataset['seccion']!);
        },
        { rootMargin: '-35% 0px -55% 0px' },
      );
      this.host.nativeElement.querySelectorAll('[data-seccion]').forEach((s) => observador.observe(s));
      const panel = new IntersectionObserver(([e]) => this.panelVisible.set(e.isIntersecting), { rootMargin: '0px 0px -120px 0px' });
      const elPanel = this.host.nativeElement.querySelector('#ticket');
      if (elPanel) panel.observe(elPanel);
      destruir.onDestroy(() => { observador.disconnect(); panel.disconnect(); });
    });
  }

  protected ir(e: Event, id: string) {
    e.preventDefault();
    const destino = this.host.nativeElement.querySelector<HTMLElement>(`#cat-${id}`);
    if (!destino) return;
    destino.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    destino.focus({ preventScroll: true });
    this.activa.set(id);
  }

  protected presionar(id: string) {
    this.pedido.sumar(id);
    this.pulsada.set(id);
    setTimeout(() => this.pulsada() === id && this.pulsada.set(null), 160);
  }

  protected imprimir() {
    this.contacto.aviso.set(null);
    this.pedido.imprimir();
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('.ticket')?.focus(), 0);
  }

  /** Kanji de la opción elegida de "al gusto" (硬め, 普通…), para el ticket. */
  protected ja(id: string) {
    const o = MENU.alGusto.opciones.find((x) => x.id === id)!;
    return o.valores.find((v) => v.es === this.pedido.alGusto()[id])?.ja ?? '';
  }

  protected enviar() {
    this.contacto.enviarWhatsapp(this.pedido.mensaje());
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('.burbuja')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 0);
  }
}
