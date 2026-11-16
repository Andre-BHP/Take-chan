import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Cifra que rueda como odómetro al cambiar (dis-069): cada dígito es una columna 0–9 que se desplaza.
 * El texto real va en un span para lectores de pantalla; las columnas son decorativas.
 */
@Component({
  selector: 'app-odometro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="solo-lector">{{ valor() }}</span>
    <span class="cifras" aria-hidden="true">
      @for (c of caracteres(); track $index) {
        @if (c.digito !== null) {
          <span class="columna"><span class="rodillo" [style.transform]="'translateY(' + (-c.digito * 10) + '%)'">@for (n of diez; track n) {<span>{{ n }}</span>}</span></span>
        } @else {
          <span class="signo">{{ c.texto }}</span>
        }
      }
    </span>
  `,
  styles: `
    :host { display: inline-flex; font-variant-numeric: tabular-nums; }
    .cifras { display: inline-flex; }
    .columna { display: inline-block; height: 1.15em; overflow: hidden; line-height: 1.15; }
    .rodillo { display: flex; flex-direction: column; transition: transform var(--t-4) var(--ease-out); }
    .rodillo span, .signo { display: block; height: 1.15em; line-height: 1.15; }
    @media (prefers-reduced-motion: reduce) { .rodillo { transition: none; } }
  `,
})
export class Odometro {
  readonly valor = input.required<string>();
  protected readonly diez = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly caracteres = computed(() =>
    [...this.valor()].map((t) => ({ texto: t, digito: /\d/.test(t) ? Number(t) : null })),
  );
}
