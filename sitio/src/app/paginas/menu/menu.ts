import { PROPUESTA } from '../../../entornos/modo';
import { ApplicationRef, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MENU, Platillo, SUCURSALES, direccionCorta, esRamen, pesos, platillo } from '../../servicios/datos';
import { Pedido } from '../../servicios/pedido';
import { Contacto } from '../../servicios/contacto';
import { Seo } from '../../servicios/seo';
import { Foto } from '../../componentes/foto';
import { NotaEjemplo } from '../../componentes/nota-ejemplo';
import { Odometro } from '../../componentes/odometro';
import { Movimiento } from '../../servicios/movimiento';

@Component({
  selector: 'app-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Foto, NotaEjemplo, Odometro],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  protected readonly propuesta = PROPUESTA;
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
  /** Índice de la sección activa, para el punto bermellón que se desliza (dis-044). */
  protected readonly indiceActivo = computed(() => Math.max(0, this.secciones.findIndex((s) => s.id === this.activa())));
  /** La luz de 発券口 parpadea mientras sale el ticket. */
  protected readonly imprimiendo = signal(false);
  /** El ticket se corta al enviarlo por WhatsApp. */
  protected readonly cortado = signal(false);
  /** En celular, "Tu pedido" se abre como hoja inferior. */
  protected readonly hoja = signal(false);
  private get reducir() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly movimiento = inject(Movimiento);
  /** Máquina para la experiencia o lista compacta para leer rápido (se recuerda en este navegador). */
  protected readonly vista = signal<'maquina' | 'lista'>('maquina');
  /** Sugerencia después del primer ramen: "¿Le agregas huevo marinado?". */
  protected readonly huevo = platillo('extra-huevo');
  protected readonly descartada = signal(false);
  protected readonly sugerir = computed(() =>
    !this.descartada() && this.pedido.lineas().some((l) => esRamen(l.platillo)) &&
    !this.pedido.lineas().some((l) => l.platillo.id === 'extra-huevo' || l.platillo.id === 'iekei-huevo'));
  /** Detalle de una tecla (mantener presionada o el botón "i"). */
  protected readonly detalle = signal<Platillo | null>(null);
  protected readonly esRamen = esRamen;
  private readonly dialogo = viewChild<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly app = inject(ApplicationRef);
  private presionLarga: ReturnType<typeof setTimeout> | null = null;
  private fueLarga = false;
  private observador: IntersectionObserver | null = null;
  /** Platillo que llega desde el bento (?ramen=id): su tecla recibe la foto que vuela. */
  protected readonly preseleccion = inject(ActivatedRoute).snapshot.queryParamMap.get('ramen');

  constructor() {
    inject(Seo).establecer({
      titulo: 'Menú y pedido · Take-chan Ramen',
      descripcion: 'Arma tu pedido de ramen Iekei como en una máquina de tickets japonesa y apártalo para recoger en Tlaquepaque.' + (PROPUESTA ? ' Menú y precios de ejemplo.' : ''),
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
      if (id && MENU.categorias.some((c) => c.items.some((p) => p.id === id)) && this.pedido.cantidad(id) === 0) this.pedido.sumar(id);
      try { if (localStorage.getItem('take-vista') === 'lista') this.vista.set('lista'); } catch { /* sin almacenamiento */ }
      const observador = (this.observador = new IntersectionObserver(
        (entradas) => {
          const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (visible) this.activa.set((visible.target as HTMLElement).dataset['seccion']!);
        },
        { rootMargin: '-35% 0px -55% 0px' },
      ));
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
    this.movimiento.irA(destino);
    destino.focus({ preventScroll: true });
    this.activa.set(id);
  }

  protected cambiarVista(v: 'maquina' | 'lista') {
    if (v === this.vista()) return;
    this.vista.set(v);
    try { localStorage.setItem('take-vista', v); } catch { /* sin almacenamiento */ }
    // Las secciones se vuelven a crear: el índice las observa de nuevo.
    setTimeout(() => {
      this.observador?.disconnect();
      this.host.nativeElement.querySelectorAll('[data-seccion]').forEach((s) => this.observador?.observe(s));
    }, 0);
  }

  protected agregarHuevo() {
    this.pedido.sumar('extra-huevo');
    this.descartada.set(true);
  }

  /** Mantener presionada una tecla abre su detalle (y ese toque ya no agrega). */
  protected empezarPresion(p: Platillo, e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.fueLarga = false;
    const tecla = e.currentTarget as HTMLElement;
    this.presionLarga = setTimeout(() => {
      this.fueLarga = true;
      this.abrirDetalle(p, tecla.querySelector<HTMLElement>('.ventana'));
    }, 480);
  }

  protected soltarPresion() {
    if (this.presionLarga) clearTimeout(this.presionLarga);
    this.presionLarga = null;
  }

  /** La foto de la tecla crece hasta el detalle (View Transition); sin soporte o con movimiento reducido, solo aparece. */
  protected abrirDetalle(p: Platillo, origen: HTMLElement | null) {
    const abrir = () => {
      this.detalle.set(p);
      this.app.tick();
      const d = this.dialogo()?.nativeElement;
      if (d && !d.open) d.showModal();
      this.movimiento.pausar();
    };
    const doc = document as Document & { startViewTransition?: (f: () => void) => unknown };
    if (!origen || !doc.startViewTransition || this.reducir) return abrir();
    origen.style.viewTransitionName = 'detalle-foto';
    doc.startViewTransition(() => {
      origen.style.viewTransitionName = '';
      abrir();
    });
  }

  protected cerrarDetalle() {
    this.dialogo()?.nativeElement.close();
  }

  protected alCerrarDetalle() {
    this.detalle.set(null);
    this.movimiento.reanudar();
  }

  /** Clic en el fondo oscuro del diálogo: se cierra. */
  protected clicDialogo(e: MouseEvent) {
    if (e.target === e.currentTarget) this.cerrarDetalle();
  }

  protected agregarDesdeDetalle(p: Platillo) {
    this.pedido.sumar(p.id);
    this.cerrarDetalle();
  }

  /** Índice de la opción elegida de "al gusto", para el marco que se desliza (dis-077). */
  protected indiceGusto(id: string) {
    const o = MENU.alGusto.opciones.find((x) => x.id === id)!;
    return Math.max(0, o.valores.findIndex((v) => v.es === this.pedido.alGusto()[id]));
  }

  /** La tecla se hunde, la miniatura vuela al pedido (FLIP) y el contador rebota (dis-071, dis-059). */
  protected presionar(id: string, e?: Event) {
    if (this.fueLarga) { this.fueLarga = false; return; }
    const primera = this.pedido.piezas() === 0;
    this.pedido.sumar(id);
    this.pulsada.set(id);
    setTimeout(() => this.pulsada() === id && this.pulsada.set(null), 160);
    if (!e || this.reducir) return;
    (navigator as Navigator & { vibrate?: (n: number) => boolean }).vibrate?.(10);
    const tecla = e.currentTarget as HTMLElement;
    const img = tecla.querySelector<HTMLImageElement>('.ventana img');
    const destino = this.host.nativeElement.querySelector<HTMLElement>(matchMedia('(min-width: 1100px)').matches ? '#ticket-titulo' : '.barra-movil') ?? this.host.nativeElement.querySelector<HTMLElement>('#ticket-titulo');
    if (img && destino) {
      const a = img.getBoundingClientRect();
      const b = destino.getBoundingClientRect();
      if (b.bottom > 0 && b.top < innerHeight) {
        const copia = img.cloneNode(true) as HTMLImageElement;
        Object.assign(copia.style, { position: 'fixed', left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px', objectFit: 'cover', borderRadius: '6px', zIndex: '60', pointerEvents: 'none' });
        document.body.appendChild(copia);
        const dx = b.left + b.width / 2 - (a.left + a.width / 2);
        const dy = b.top + b.height / 2 - (a.top + a.height / 2);
        copia.animate(
          [{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(.6)`, opacity: 1, offset: 0.5 }, { transform: `translate(${dx}px, ${dy}px) scale(.18)`, opacity: 0.2 }],
          { duration: 480, easing: 'cubic-bezier(.22, 1, .36, 1)' },
        ).onfinish = () => copia.remove();
      }
    }
    requestAnimationFrame(() => {
      tecla.querySelector('.cuenta')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'cubic-bezier(.33, 1.3, .5, 1)' });
      if (primera) return;
      this.host.nativeElement.querySelector('.barra-movil')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], { duration: 260, easing: 'cubic-bezier(.33, 1.3, .5, 1)' });
    });
  }

  protected abrirHoja(e: Event) {
    e.preventDefault();
    this.hoja.set(true);
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('.cerrar-hoja')?.focus(), 0);
  }

  protected imprimir() {
    // Con el ticket impreso ya no se sugiere nada.
    this.descartada.set(true);
    this.contacto.aviso.set(null);
    this.cortado.set(false);
    this.imprimiendo.set(true);
    setTimeout(() => this.imprimiendo.set(false), this.reducir ? 0 : 1400);
    this.pedido.imprimir();
    setTimeout(() => this.host.nativeElement.querySelector<HTMLElement>('.ticket')?.focus(), 0);
  }

  /** Kanji de la opción elegida de "al gusto" (硬め, 普通…), para el ticket. */
  protected ja(id: string) {
    const o = MENU.alGusto.opciones.find((x) => x.id === id)!;
    return o.valores.find((v) => v.es === this.pedido.alGusto()[id])?.ja ?? '';
  }

  protected enviar() {
    this.cortado.set(true);
    this.contacto.enviarWhatsapp(this.pedido.mensaje());
    setTimeout(() => {
      const b = this.host.nativeElement.querySelector<HTMLElement>('.burbuja');
      if (b && b.getBoundingClientRect().bottom > innerHeight) b.scrollIntoView({ block: 'end', behavior: this.reducir ? 'auto' : 'smooth' });
    }, 0);
  }
}
