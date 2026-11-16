import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Cabecera } from './componentes/cabecera';
import { Pie } from './componentes/pie';
import { Movimiento } from './servicios/movimiento';

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
export class App {
  constructor() {
    const movimiento = inject(Movimiento);
    const router = inject(Router);
    afterNextRender(() => {
      // Lenis y GSAP entran cuando la página ya cargó: no compiten con la foto del héroe (LCP).
      const iniciar = () => ('requestIdleCallback' in window ? requestIdleCallback(() => movimiento.iniciarScroll(), { timeout: 1500 }) : setTimeout(() => movimiento.iniciarScroll(), 300));
      if (document.readyState === 'complete') iniciar();
      else addEventListener('load', iniciar, { once: true });
      let primera = true;
      router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
        if (primera) { primera = false; return; }
        movimiento.alNavegar();
      });
    });
  }
}
