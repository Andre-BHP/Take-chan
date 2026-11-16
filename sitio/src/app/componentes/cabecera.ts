import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

/** Aviso fijo de prototipo y navegación. El logo lleva al inicio (dis-091). */
@Component({
  selector: 'app-cabecera',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header>
      <p class="aviso" role="note">Propuesta no oficial de sitio para Take-chan Ramen</p>
      <nav class="envoltura barra" aria-label="Principal">
        <a class="marca" routerLink="/" aria-label="Take-chan Ramen, inicio"><span lang="ja" aria-hidden="true">家系</span> TAKE-CHAN</a>
        <ul>
          <li><a routerLink="/menu" routerLinkActive="activo" ariaCurrentWhenActive="page">Menú<span class="largo">&nbsp;y pedido</span></a></li>
          <li><a routerLink="/" fragment="sucursales">Sucursales</a></li>
          <li class="indicador" aria-hidden="true"></li>
        </ul>
      </nav>
    </header>
  `,
  styles: `
    :host { view-transition-name: cabecera; display: block; position: sticky; top: 0; z-index: 30; background: var(--sumi); border-bottom: 1px solid var(--linea); }
    .aviso { text-align: center; font: 500 .75rem/1.3 var(--sans); padding: 5px var(--gutter); color: var(--ceniza); border-bottom: 1px solid var(--linea); }
    .barra { display: flex; align-items: center; justify-content: space-between; gap: var(--e-3); min-height: 56px; }
    .marca { font: 700 1.0625rem/1 var(--mincho); letter-spacing: .04em; text-decoration: none; white-space: nowrap; display: inline-flex; gap: var(--e-2); align-items: center; min-height: 44px; }
    .marca span { font-weight: 800; }
    ul { display: flex; gap: var(--e-1); list-style: none; padding: 0; }
    li a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--e-2); font: 500 .9375rem/1 var(--sans); text-decoration: none; color: var(--ceniza); transition: color var(--rapido) var(--salida); white-space: nowrap; }
    li a:hover { color: var(--washi); }
    li a.activo { color: var(--washi); }
    ul { position: relative; }
    /* Subrayado bermellón que se desliza al enlace activo (dis-077). */
    .indicador { position: absolute; left: 0; bottom: 0; height: 2px; width: 1px; background: var(--bermellon); transform-origin: 0 0; transform: translateX(var(--x, 0)) scaleX(var(--w, 0)); opacity: var(--o, 0); pointer-events: none; transition: transform var(--t-3) var(--ease-out), opacity var(--t-2) var(--ease-out); }
    @media (max-width: 479px) { .largo { display: none; } }
    @media (max-width: 359px) { .marca { font-size: .9375rem; gap: var(--e-1); } li a { padding: 0 6px; font-size: .875rem; } ul { gap: 0; } }
  `,
})
export class Cabecera {
  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const router = inject(Router);
    afterNextRender(() => {
      const medir = () => requestAnimationFrame(() => {
        const ul = host.querySelector<HTMLElement>('ul');
        const activo = host.querySelector<HTMLElement>('li a.activo');
        if (!ul) return;
        ul.style.setProperty('--o', activo ? '1' : '0');
        if (activo) {
          ul.style.setProperty('--x', activo.offsetLeft + 'px');
          ul.style.setProperty('--w', String(activo.offsetWidth));
        }
      });
      medir();
      router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(medir);
      addEventListener('resize', medir);
    });
  }
}
