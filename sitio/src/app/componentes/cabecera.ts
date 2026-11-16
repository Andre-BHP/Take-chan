import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/** Aviso fijo de prototipo y navegación. El logo lleva al inicio (dis-091). */
@Component({
  selector: 'app-cabecera',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <p class="aviso" role="note">Propuesta no oficial de sitio para Take-chan Ramen</p>
    <nav class="envoltura barra" aria-label="Principal">
      <a class="marca" routerLink="/" aria-label="Take-chan Ramen, inicio">TAKE-CHAN<span> RAMEN</span></a>
      <ul>
        <li><a routerLink="/menu" routerLinkActive="activo" ariaCurrentWhenActive="page">Menú</a></li>
        <li><a routerLink="/" fragment="sucursales">Sucursales</a></li>
      </ul>
    </nav>
  `,
  styles: `
    :host { display: block; position: sticky; top: 0; z-index: 20; background: color-mix(in srgb, var(--carbon) 94%, transparent); border-bottom: 1px solid var(--borde); }
    .aviso { background: var(--madera); border-bottom: 1px solid var(--borde); text-align: center; font: 500 .75rem/1.3 var(--sans); padding: 6px var(--gutter); letter-spacing: .01em; }
    .barra { display: flex; align-items: center; justify-content: space-between; gap: var(--e-3); min-height: 52px; }
    .marca { font: 400 1.125rem/1 var(--display); letter-spacing: -.01em; text-decoration: none; white-space: nowrap; }
    .marca span { color: var(--texto-tenue); }
    ul { display: flex; gap: var(--e-1); list-style: none; padding: 0; }
    li a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 var(--e-2); font-weight: 700; font-size: .9375rem; text-decoration: none; color: var(--texto-tenue); transition: color var(--rapido) var(--salida); }
    li a:hover { color: var(--texto); }
    li a.activo { color: var(--texto); box-shadow: inset 0 -2px 0 var(--laca); }
    @media (max-width: 400px) { .marca span { display: none; } }
  `,
})
export class Cabecera {}
