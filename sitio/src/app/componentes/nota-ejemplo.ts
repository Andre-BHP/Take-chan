import { PROPUESTA } from '../../entornos/modo';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NOTA_EJEMPLO } from '../servicios/datos';

/** La única nota de "datos de ejemplo" de cada página. En modo oficial no aparece. */
@Component({
  selector: 'app-nota-ejemplo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (propuesta) { <p role="note"><span class="sello" lang="ja" aria-hidden="true">例</span>{{ nota }}</p> }`,
  styles: `
    :host { display: block; }
    p { display: flex; gap: var(--e-3); align-items: center; font: 500 .875rem/1.45 var(--sans); color: var(--ceniza); max-width: 60ch; }
    .sello { flex: none; display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; font-size: .875rem; }
  `,
})
export class NotaEjemplo {
  protected readonly nota = NOTA_EJEMPLO;
  protected readonly propuesta = PROPUESTA;
}
