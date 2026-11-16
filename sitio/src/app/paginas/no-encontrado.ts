import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../servicios/seo';

@Component({
  selector: 'app-no-encontrado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="envoltura">
      <h1 class="t-titulo">Esta página no existe</h1>
      <p class="tenue">Puede que el enlace esté mal escrito o que la página todavía no esté en la propuesta.</p>
      <a class="boton boton-secundario" routerLink="/">Volver al inicio</a>
    </section>
  `,
  styles: `section { padding-block: var(--e-8); display: grid; gap: var(--e-4); justify-items: start; }`,
})
export class NoEncontrado {
  constructor() {
    inject(Seo).establecer({ titulo: 'Página no encontrada · Take-chan Ramen', descripcion: 'Esta página no existe.', ruta: '/404' });
  }
}
