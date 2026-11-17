import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { Cabecera } from './componentes/cabecera';
import { Pie } from './componentes/pie';
import { Movimiento } from './servicios/movimiento';
import { Telon, TelonVista } from './componentes/telon';
import { BandaAviso } from './componentes/banda-aviso';
import { Hoja } from './servicios/hoja';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Cabecera, Pie, TelonVista, BandaAviso],
  template: `
    <a class="salto" href="#contenido">Saltar al contenido</a>
    <app-banda-aviso />
    <app-cabecera />
    <main id="contenido" tabindex="-1"><router-outlet /></main>
    <app-pie />
    <app-telon />
  `,
})
export class App {
  constructor() {
    const movimiento = inject(Movimiento);
    const router = inject(Router);
    const telon = inject(Telon);
    const hoja = inject(Hoja);
    // Las anclas (#sucursales) quedan debajo del encabezado fijo, no tapadas por él.
    inject(ViewportScroller).setOffset([0, 100]);
    afterNextRender(() => {
      // Menú, horario y aviso desde la hoja de Google, si el entorno la tiene (si falla, se quedan los JSON).
      hoja.cargar();
      // Lenis y GSAP entran cuando la página ya cargó: no compiten con la foto del héroe (LCP).
      const iniciar = () => ('requestIdleCallback' in window ? requestIdleCallback(() => movimiento.iniciarScroll(), { timeout: 1500 }) : setTimeout(() => movimiento.iniciarScroll(), 300));
      if (document.readyState === 'complete') iniciar();
      else addEventListener('load', iniciar, { once: true });
      let primera = true;
      let atras = false;
      router.events.pipe(filter((e): e is NavigationStart => e instanceof NavigationStart)).subscribe((e) => (atras = e.navigationTrigger === 'popstate'));
      router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
        telon.abrir();
        if (primera) { primera = false; return; }
        if (atras) movimiento.sincronizar();
        else movimiento.alNavegar();
      });
    });
  }
}
