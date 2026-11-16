import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecera } from './componentes/cabecera';
import { Pie } from './componentes/pie';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Cabecera, Pie],
  template: `
    <a class="salto" href="#contenido">Saltar al contenido</a>
    <app-cabecera />
    <main id="contenido" tabindex="-1"><router-outlet /></main>
    <app-pie />
  `,
})
export class App {}
