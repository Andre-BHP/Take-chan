import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecera } from './componentes/cabecera';
import { Pie } from './componentes/pie';
import { AvisoDemo } from './componentes/aviso-demo';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Cabecera, Pie, AvisoDemo],
  template: `
    <a class="salto" href="#contenido">Saltar al contenido</a>
    <app-cabecera />
    <main id="contenido" tabindex="-1"><router-outlet /></main>
    <app-pie />
    @defer (on idle) { <app-aviso-demo /> }
  `,
})
export class App {}
