import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import fotosJson from '../../datos/fotos.json';

interface FotoDatos { ancho: number; alto: number; color: string; lqip: string; alt: string; autor: string; usuario: string; id: string }
export const FOTOS = fotosJson as Record<string, FotoDatos>;

/**
 * Foto de ejemplo de Unsplash (AVIF y WebP en 3 anchos). Mientras carga se ve su color promedio
 * y una miniatura borrosa (dis-025). Lleva siempre el rótulo "Imagen ilustrativa",
 * y encima la viñeta y el grano comunes (el color se trata antes, en herramientas/gradear.mjs).
 */
@Component({
  selector: 'app-foto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[style.--color]': 'datos().color', '[style.--lqip]': 'fondo()' },
  template: `
    <picture>
      <source type="image/avif" [attr.srcset]="srcset('avif')" [attr.sizes]="sizes()" />
      <img [src]="'fotos/' + nombre() + '-960.webp'" [attr.srcset]="srcset('webp')" [attr.sizes]="sizes()"
        [alt]="alt() ?? datos().alt" [width]="datos().ancho" [height]="datos().alto"
        [attr.loading]="prioridad() ? 'eager' : 'lazy'" [attr.fetchpriority]="prioridad() ? 'high' : null" decoding="async" />
    </picture>
    @if (rotulo()) { <span class="rotulo">Imagen ilustrativa</span> }
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; background: var(--color) var(--lqip) center / cover no-repeat; }
    picture, img { display: block; width: 100%; height: 100%; }
    img { object-fit: cover; object-position: var(--enfoque, 50% 50%); }
    /* Misma mirada para todas las fotos: viñeta suave y grano fino de película (PNG de 2 KB en mosaico). */
    :host::after {
      content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
      background: url('./grano.png') 0 0 / 96px 96px;
      mix-blend-mode: overlay; opacity: .55;
    }
    :host::before {
      content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
      background: radial-gradient(ellipse at 50% 45%, transparent 58%, rgba(10, 8, 6, .3) 100%);
    }
    .rotulo {
      /* Siempre arriba a la derecha: abajo van los textos de las tarjetas y del héroe. */
      position: absolute; right: var(--e-2); top: var(--e-2); z-index: 2;
      padding: 3px 8px; border-radius: var(--r-s);
      background: rgba(18, 17, 16, .72); color: var(--washi);
      font: 500 .6875rem/1.4 var(--sans); letter-spacing: .01em; pointer-events: none;
    }
  `,
})
export class Foto {
  readonly nombre = input.required<string>();
  readonly sizes = input('100vw');
  readonly prioridad = input(false);
  readonly rotulo = input(true);
  readonly alt = input<string | undefined>(undefined);
  protected readonly datos = computed(() => FOTOS[this.nombre()]);
  protected readonly fondo = computed(() => `url(${this.datos().lqip})`);
  protected srcset(formato: string) {
    return [480, 960, 1600].map((w) => `fotos/${this.nombre()}-${w}.${formato} ${w}w`).join(', ');
  }
}
