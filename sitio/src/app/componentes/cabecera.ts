import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
        </ul>
      </nav>
    </header>
  `,
  styles: `
    :host { display: block; position: sticky; top: 0; z-index: 30; background: var(--sumi); border-bottom: 1px solid var(--linea); }
    .aviso { text-align: center; font: 500 .75rem/1.3 var(--sans); padding: 5px var(--gutter); color: var(--ceniza); border-bottom: 1px solid var(--linea); }
    .barra { display: flex; align-items: center; justify-content: space-between; gap: var(--e-3); min-height: 56px; }
    .marca { font: 700 1.0625rem/1 var(--mincho); letter-spacing: .04em; text-decoration: none; white-space: nowrap; display: inline-flex; gap: var(--e-2); align-items: center; min-height: 44px; }
    .marca span { font-weight: 800; }
    ul { display: flex; gap: var(--e-1); list-style: none; padding: 0; }
    li a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--e-2); font: 500 .9375rem/1 var(--sans); text-decoration: none; color: var(--ceniza); transition: color var(--rapido) var(--salida); white-space: nowrap; }
    li a:hover { color: var(--washi); }
    li a.activo { color: var(--washi); box-shadow: inset 0 -2px 0 var(--bermellon); }
    @media (max-width: 479px) { .largo { display: none; } }
    @media (max-width: 359px) { .marca { font-size: .9375rem; gap: var(--e-1); } li a { padding: 0 6px; font-size: .875rem; } ul { gap: 0; } }
  `,
})
export class Cabecera {}
