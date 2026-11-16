import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Turno } from '../servicios/datos';
import { Reloj, estado, horarioTexto } from '../servicios/horario';

/**
 * "Abierto ahora · cierra 17:00" calculado con la hora de Guadalajara (dis-039).
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
  readonly turnos = input.required<Turno[]>();
  private readonly reloj = inject(Reloj);
  protected readonly actual = computed(() => {
    const a = this.reloj.ahora();
    return a ? estado(this.turnos(), a) : null;
  });
  protected readonly fijo = computed(() => horarioTexto(this.turnos()));
}
