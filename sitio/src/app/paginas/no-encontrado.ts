import { Idioma } from '../servicios/idioma';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../servicios/seo';

@Component({
  selector: 'app-no-encontrado',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="envoltura">
      <h1 class="t-titulo">{{ t('Esta página no existe') }}</h1>
      <p class="tenue">{{ t('Puede que el enlace esté mal escrito o que la página ya no exista.') }}</p>
      <a class="boton boton-contorno" [routerLink]="r('/')">{{ t('Volver al inicio') }}</a>
    </section>
  `,
  styles: `section { padding-block: var(--e-8); display: grid; gap: var(--e-4); justify-items: start; }`,
})
export class NoEncontrado {
  protected readonly t = inject(Idioma).t;
  protected readonly r = inject(Idioma).r;
  protected readonly idioma = inject(Idioma).actual;
  constructor() {
    inject(Seo).establecer({ titulo: this.t('Página no encontrada') + ' · Take-chan Ramen', descripcion: this.t('Esta página no existe.'), ruta: '/404' });
  }
}
