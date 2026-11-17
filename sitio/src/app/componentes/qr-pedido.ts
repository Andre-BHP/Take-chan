import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import qrJson from '../../datos/qr.json';
import { Idioma } from '../servicios/idioma';

interface DatosQr { url: string; n: number; bits: string }
const QR = qrJson as Record<'es' | 'en', DatosQr>;
const ZONA = 4;

/** Mismo generador con semilla que scripts/qr-tinta.mjs: las gotas salen igual que en los impresos. */
function azar(semilla: number) {
  let s = semilla >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const enOjo = (n: number, x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
const ladoSello = (n: number) => { const l = Math.round(n * 0.21); return l % 2 ? l : l + 1; };

/** Trazos de tinta por fila (para imprimirlas una por una), ojos y hueco del sello, desde la matriz compacta. */
function trazos({ n, bits }: DatosQr, semilla = 7) {
  const crudo = atob(bits);
  const bit = (i: number) => (crudo.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  const r = azar(semilla);
  const l = ladoSello(n), h0 = (n - l) / 2, h1 = h0 + l;
  const f = (v: number) => Math.round(v * 100) / 100;
  const filas: string[] = [];
  for (let y = 0; y < n; y++) {
    let d = '';
    for (let x = 0; x < n; x++) {
      if (!bit(y * n + x) || enOjo(n, x, y)) continue;
      if (x >= h0 - 0.5 && x < h1 + 0.5 && y >= h0 - 0.5 && y < h1 + 0.5) continue;
      // En pantalla, esquinas un poco menos redondas que en papel: más superficie, mejor lectura con la cámara.
      const rr = 0.14 + r() * 0.04, k = 1 - 2 * rr;
      d += `M${f(x + rr)} ${y}h${f(k)}a${f(rr)} ${f(rr)} 0 0 1 ${f(rr)} ${f(rr)}v${f(k)}a${f(rr)} ${f(rr)} 0 0 1 ${f(-rr)} ${f(rr)}h${f(-k)}a${f(rr)} ${f(rr)} 0 0 1 ${f(-rr)} ${f(-rr)}v${f(-k)}a${f(rr)} ${f(rr)} 0 0 1 ${f(rr)} ${f(-rr)}z`;
    }
    filas.push(d);
  }
  const ojos = [[0, 0], [n - 7, 0], [0, n - 7]].map(([x, y]) => ({
    fila: y,
    marco: `M${x + 1.6} ${y}h3.8a1.6 1.6 0 0 1 1.6 1.6v3.8a1.6 1.6 0 0 1-1.6 1.6h-3.8a1.6 1.6 0 0 1-1.6-1.6v-3.8a1.6 1.6 0 0 1 1.6-1.6zM${x + 1.9} ${y + 1}a.9 .9 0 0 0-.9 .9v3.2a.9 .9 0 0 0 .9 .9h3.2a.9 .9 0 0 0 .9-.9v-3.2a.9 .9 0 0 0-.9-.9z`,
    cx: x + 2, cy: y + 2,
  }));
  return { lado: n + ZONA * 2, filas, ojos, hueco: { x: h0, lado: l } };
}

/**
 * "Pídelo desde tu celular" (carta dis-081, sin Three.js): en escritorio, el QR del menú se imprime fila por fila
 * como un ticket de la máquina (menos de 1.2 s) y queda escaneable. Con movimiento reducido aparece quieto.
 * En celular no se muestra (ya están en el celular). Se dibuja solo en el navegador: el prerender guarda su lugar.
 */
@Component({
  selector: 'app-qr-pedido',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.imprime]': 'imprime()' },
  template: `
    <div class="qr-pedido">
      <div class="papel">
        @if (q(); as d) {
          <svg [attr.viewBox]="'0 0 ' + d.lado + ' ' + d.lado" role="img" [attr.aria-label]="t('Código QR que abre este menú en tu celular')">
            <rect [attr.width]="d.lado" [attr.height]="d.lado" fill="#fbf9f4" />
            <g transform="translate(4 4)">
              @for (fila of d.filas; track $index) { <path class="fila" [attr.d]="fila" [style.--i]="$index" /> }
              @for (o of d.ojos; track o.cx) {
                <path class="fila ojo" fill-rule="evenodd" [attr.d]="o.marco" [style.--i]="o.fila + 3" />
                <rect class="fila centro" [attr.x]="o.cx" [attr.y]="o.cy" width="3" height="3" rx=".8" [style.--i]="o.fila + 3" />
              }
              <image class="sello" href="sello-96.webp" [attr.x]="d.hueco.x + .4" [attr.y]="d.hueco.x + .4" [attr.width]="d.hueco.lado - .8" [attr.height]="d.hueco.lado - .8" />
            </g>
          </svg>
        }
      </div>
      <p class="qr-texto"><strong>{{ t('Pídelo desde tu celular') }}</strong>{{ t('Escanéalo con la cámara y se abre este menú.') }}</p>
    </div>
  `,
  styles: `
    :host { display: none; }
    @media (min-width: 900px) { :host { display: block; } }
    .qr-pedido { display: grid; grid-template-columns: 9.5rem minmax(0, 13rem); gap: var(--e-3); align-items: center; }
    .papel {
      aspect-ratio: 1; padding: 6px; background: #fbf9f4; border-radius: 3px;
      box-shadow: 0 14px 30px -14px rgba(0, 0, 0, .9);
      -webkit-mask: radial-gradient(5px at 50% calc(100% + 1px), #0000 98%, #000) 50% / 12px 100% repeat-x;
      mask: radial-gradient(5px at 50% calc(100% + 1px), #0000 98%, #000) 50% / 12px 100% repeat-x;
    }
    svg { display: block; width: 100%; height: 100%; }
    .fila { fill: #121110; }
    .centro { fill: #b52c15; }
    .sello { transform-box: fill-box; transform-origin: 50% 50%; rotate: -5deg; }
    .qr-texto { display: grid; gap: var(--e-1); font: 500 .875rem/1.4 var(--sans); color: var(--washi-2); }
    .qr-texto strong { font: 700 1.0625rem/1.25 var(--mincho); color: var(--washi); }
    /* La máquina imprime el QR fila por fila (41 filas en ~0.9 s) y al final cae el sello: menos de 1.2 s. */
    @media (prefers-reduced-motion: no-preference) {
      :host(:not(.imprime)) .fila, :host(:not(.imprime)) .sello { opacity: 0; }
      :host(.imprime) .fila { animation: fila 140ms steps(2) calc(var(--i) * 20ms) both; }
      :host(.imprime) .sello { animation: estampa 260ms cubic-bezier(.3, 1.4, .5, 1) 920ms both; }
      @keyframes fila { from { opacity: 0; } }
      @keyframes estampa { from { opacity: 0; scale: 1.4; } }
    }
  `,
})
export class QrPedido {
  protected readonly t = inject(Idioma).t;
  private readonly idioma = inject(Idioma).actual;
  private readonly listo = signal(false);
  protected readonly imprime = signal(false);
  protected readonly q = computed(() => (this.listo() ? trazos(QR[this.idioma()]) : null));

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      if (!matchMedia('(min-width: 900px)').matches) return;
      this.listo.set(true);
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        this.imprime.set(true);
        io.disconnect();
      }, { threshold: 0.6 });
      io.observe(host);
      destruir.onDestroy(() => io.disconnect());
    });
  }
}
