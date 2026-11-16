import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Vapor sobre la foto del héroe. Tres volutas, cada una en su propia capa con desenfoque fijo:
 * solo se animan transform y opacity de la capa (no hay filtro animado ni recálculo de layout).
 * Se pausa cuando el héroe sale de la vista y se queda quieto con prefers-reduced-motion.
 */
@Component({
  selector: 'app-vapor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[class.pausado]': 'pausado()' },
  template: `
    @for (v of volutas; track v.d) {
      <span class="v" [style.left.%]="v.x" [style.--dur]="v.dur" [style.--ret]="v.ret">
        <svg viewBox="0 0 80 400" preserveAspectRatio="none"><path [attr.d]="v.d" [attr.stroke-width]="v.w" /></svg>
      </span>
    }
  `,
  styles: `
    :host { display: block; position: relative; pointer-events: none; }
    .v { position: absolute; bottom: 0; width: 24%; height: 100%; opacity: .14; filter: blur(9px); transform-origin: 50% 100%; will-change: transform, opacity; }
    svg { width: 100%; height: 100%; overflow: visible; }
    path { fill: none; stroke: #fff; stroke-linecap: round; }
    @media (prefers-reduced-motion: no-preference) {
      .v { opacity: 0; animation: subir var(--dur) cubic-bezier(.33, 0, .2, 1) var(--ret) infinite; }
      :host(.pausado) .v { animation-play-state: paused; }
      @keyframes subir {
        0% { opacity: 0; transform: translate3d(0, 10%, 0) scale(.9, .8); }
        25% { opacity: .32; }
        70% { opacity: .16; }
        100% { opacity: 0; transform: translate3d(-6%, -22%, 0) scale(1.15, 1.1); }
      }
    }
  `,
})
export class Vapor {
  protected readonly volutas = [
    { x: 22, w: 26, dur: '8s', ret: '0s', d: 'M40 400c-30-60 40-90 10-160s30-110 0-200' },
    { x: 38, w: 34, dur: '9.5s', ret: '-3.2s', d: 'M40 400c-36-70 44-100 6-180s34-120 4-210' },
    { x: 54, w: 22, dur: '7s', ret: '-5.4s', d: 'M40 400c-26-56 34-86 8-150s26-100 2-190' },
  ];
  protected readonly pausado = signal(false);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      const io = new IntersectionObserver(([e]) => this.pausado.set(!e.isIntersecting));
      io.observe(host);
      destruir.onDestroy(() => io.disconnect());
    });
  }
}
