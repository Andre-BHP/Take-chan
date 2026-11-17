import { Idioma } from '../servicios/idioma';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Turno, VERSION_DATOS } from '../servicios/datos';
import { Reloj, estado, horarioTexto } from '../servicios/horario';

/**
 * "Abierto ahora · cierra en 2 h 13 min", calculado con la hora de Guadalajara y al día cada minuto (dis-039).
 * En el prerender (sin hora) muestra el horario fijo.
 */
@Component({
  selector: 'app-estado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (actual(); as e) {
      <span class="estado t-dato" [class.abierto]="e.abierto">{{ e.texto }}</span>
    } @else {
      <span class="estado t-dato">{{ fijo() }}</span>
    }
  `,
  styles: `:host { display: inline-flex; }`,
})
export class Estado {
  protected readonly t = inject(Idioma).t;
  protected readonly r = inject(Idioma).r;
  protected readonly idioma = inject(Idioma).actual;
  readonly turnos = input.required<Turno[]>();
  private readonly reloj = inject(Reloj);
  protected readonly actual = computed(() => {
    VERSION_DATOS();
    const a = this.reloj.ahora();
    return a ? estado(this.turnos(), a, this.idioma()) : null;
  });
  protected readonly fijo = computed(() => (VERSION_DATOS(), horarioTexto(this.turnos(), this.idioma())));
}
