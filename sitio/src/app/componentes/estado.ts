import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Turno } from '../servicios/datos';
import { Reloj, estado, horarioTexto } from '../servicios/horario';

/**
 * "Abierto ahora · cierra 17:00" calculado con la hora de Guadalajara.
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
    @if (!confirmado()) { <span class="por-confirmar">horario por confirmar</span> }
  `,
  styles: `:host { display: inline-flex; flex-wrap: wrap; align-items: center; gap: var(--e-2) var(--e-3); }`,
})
export class Estado {
  readonly turnos = input.required<Turno[]>();
  readonly confirmado = input(false);
  private readonly reloj = inject(Reloj);
  protected readonly actual = computed(() => {
    const a = this.reloj.ahora();
    return a ? estado(this.turnos(), a) : null;
  });
  protected readonly fijo = computed(() => horarioTexto(this.turnos()));
}
