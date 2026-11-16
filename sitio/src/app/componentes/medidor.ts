import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * "Cómo se hace un Iekei" como medidor narrativo (dis-070, dis-001, dis-028): un tazón dibujado se llena
 * por capas (caldo, tare, fideo y toppings) mientras se leen los cuatro pasos. Es un diagrama, no una foto de
 * comida. Sin JavaScript o con movimiento reducido, el tazón aparece completo.
 */
@Component({
  selector: 'app-medidor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-paso]': 'paso()' },
  template: `
    <div class="tazon-fijo">
      <svg viewBox="0 0 320 260" role="img" aria-label="Diagrama de un tazón de ramen Iekei que se llena por capas">
        <defs>
          <clipPath id="md-interior"><path d="M24 92h272c-6 92-62 144-136 144S30 184 24 92z" /></clipPath>
        </defs>
        <g clip-path="url(#md-interior)">
          <rect class="capa caldo" x="0" y="96" width="320" height="170" />
          <path class="capa tare" d="M0 150c60-14 110 14 160 0s110-14 160 0v120H0z" />
          <g class="capa fideo">
            @for (y of [118, 128, 138, 148]; track y) { <path [attr.d]="'M54 ' + y + 'c40 -10 80 10 120 0s70 -10 96 0'" /> }
          </g>
        </g>
        <g class="capa toppings">
          <rect class="nori" x="196" y="40" width="34" height="66" rx="2" transform="rotate(8 213 73)" />
          <rect class="nori" x="222" y="36" width="34" height="68" rx="2" transform="rotate(14 239 70)" />
          <rect class="nori" x="246" y="42" width="32" height="64" rx="2" transform="rotate(20 262 74)" />
          <path class="espinaca" d="M70 104c14-22 50-24 64-4-16 14-48 18-64 4z" />
          <ellipse class="chashu" cx="140" cy="108" rx="40" ry="16" />
          <ellipse class="chashu-borde" cx="140" cy="108" rx="40" ry="16" />
        </g>
        <ellipse class="borde" cx="160" cy="92" rx="136" ry="16" />
        <path class="cuerpo" d="M24 92c6 92 62 144 136 144s130-52 136-144" />
        <path class="pie" d="M120 236l6 14h68l6-14" />
      </svg>
      <p class="leyenda t-dato" aria-hidden="true">{{ paso() }} / 4</p>
    </div>
    <ol class="pasos" tabindex="0" aria-label="Pasos para hacer un Iekei">
      @for (p of pasos; track p.titulo; let i = $index) {
        <li class="paso" [class.activo]="paso() === i + 1" [attr.data-i]="i + 1">
          <span class="numero t-dato">{{ i + 1 }} / 4</span>
          <h3 class="t-titulo">{{ p.titulo }}</h3>
          <p>{{ p.texto }}</p>
        </li>
      }
    </ol>
  `,
  styleUrl: './medidor.css',
})
export class Medidor {
  protected readonly pasos = [
    { titulo: 'El caldo', texto: 'Hueso de cerdo hervido a fuego alto hasta que el caldo se vuelve espeso, cremoso y casi blanco.' },
    { titulo: 'El tare', texto: 'Una base de salsa de soya va al fondo del tazón: le da el color y el sabor salado.' },
    { titulo: 'El fideo', texto: 'Grueso y recto, para que el caldo se le pegue. Se pide firme, normal o suave.' },
    { titulo: 'El tazón', texto: 'Espinaca, tres hojas de nori y chashu. El sabor y la grasa, al gusto.' },
  ];
  /** Paso visible: 4 (completo) en el prerender y con movimiento reducido. */
  protected readonly paso = signal(4);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const horizontal = matchMedia('(max-width: 899px)').matches;
      const lista = host.querySelector<HTMLElement>('.pasos');
      this.paso.set(1);
      const io = new IntersectionObserver(
        (entradas) => {
          const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) this.paso.set(Number((visible.target as HTMLElement).dataset['i']));
        },
        horizontal ? { root: lista, threshold: [0.6] } : { rootMargin: '-45% 0px -45% 0px' },
      );
      host.querySelectorAll('.paso').forEach((p) => io.observe(p));
      destruir.onDestroy(() => io.disconnect());
    });
  }
}
