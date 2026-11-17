import { Idioma } from '../servicios/idioma';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, input, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Mapa propio de una sucursal, dibujado con datos de OpenStreetMap (herramientas/mapas.mjs).
 * El sello bermellón marca el punto, en el centro exacto del mapa, y cae una vez al entrar en vista.
 * Con movimiento reducido el sello ya está en su lugar.
 */
@Component({
  selector: 'app-mapa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-pin]': 'pin()' },
  template: `
    <img [src]="'mapas/' + sucursal() + '.svg'" [alt]="alt()" width="1200" height="800" [attr.loading]="prioridad() ? 'eager' : 'lazy'" decoding="async" />
    <span class="pin" aria-hidden="true"><span class="sello" lang="ja">家</span><span class="punta"></span></span>
    <span class="sombra" aria-hidden="true"></span>
    @if (aproximada()) { <span class="aprox">{{ t('Ubicación aproximada') }}</span> }
    <a class="osm" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap<span class="solo-lector">{{ t(' (se abre en otra pestaña)') }}</span></a>
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; background: #161412; }
    img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .pin { position: absolute; left: 50%; top: 50%; z-index: 2; display: grid; justify-items: center; translate: -50% -100%; }
    .sello {
      display: grid; place-items: center; width: 2.75rem; aspect-ratio: 1; border-radius: 5px; rotate: -4deg;
      background: var(--bermellon); color: var(--washi); font: 800 1.5rem/1 var(--mincho);
      box-shadow: 0 0 0 2px var(--sumi), 0 10px 18px -6px rgba(0, 0, 0, .8);
    }
    .punta { width: 2px; height: 14px; background: var(--bermellon); }
    .sombra { position: absolute; left: 50%; top: 50%; z-index: 1; width: 22px; height: 7px; translate: -50% -50%; border-radius: 50%; background: rgba(0, 0, 0, .65); filter: blur(2px); }
    .aprox, .osm {
      position: absolute; z-index: 3; padding: 3px 8px; border-radius: var(--r-s);
      background: rgba(18, 17, 16, .78); color: var(--washi); font: 500 .6875rem/1.4 var(--sans);
    }
    .aprox { left: var(--e-2); top: var(--e-2); }
    .osm { right: var(--e-2); bottom: var(--e-2); text-decoration: none; }
    .osm:hover { text-decoration: underline; }
    @media (prefers-reduced-motion: no-preference) {
      :host([data-pin='espera']) .pin, :host([data-pin='espera']) .sombra { opacity: 0; }
      :host([data-pin='cae']) .pin { animation: cae 640ms cubic-bezier(.33, 1.3, .5, 1) both; }
      :host([data-pin='cae']) .sombra { animation: sombra 640ms cubic-bezier(.33, 1.3, .5, 1) both; }
      @keyframes cae {
        0% { opacity: 0; transform: translateY(-48px); }
        45% { opacity: 1; transform: translateY(0) scale(1.08, .9); }
        70% { transform: translateY(-6px) scale(.98, 1.03); }
        100% { opacity: 1; transform: none; }
      }
      @keyframes sombra { 0% { opacity: 0; scale: .3; } 45%, 100% { opacity: 1; scale: 1; } }
    }
  `,
})
export class Mapa {
  protected readonly t = inject(Idioma).t;
  protected readonly r = inject(Idioma).r;
  protected readonly idioma = inject(Idioma).actual;
  readonly sucursal = input.required<string>();
  readonly alt = input.required<string>();
  readonly aproximada = input(false);
  readonly prioridad = input(false);
  /** quieto: sin animación (prerender o movimiento reducido); espera: fuera de vista; cae: ya entró. */
  protected readonly pin = signal<'quieto' | 'espera' | 'cae'>('quieto');

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = host.getBoundingClientRect();
      const enVista = r.top < innerHeight && r.bottom > 0;
      this.pin.set(enVista ? 'cae' : 'espera');
      if (enVista) return;
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        this.pin.set('cae');
        io.disconnect();
      }, { threshold: 0.5 });
      io.observe(host);
      destruir.onDestroy(() => io.disconnect());
    });
  }
}
