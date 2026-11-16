import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Cortina noren (のれん) como separador: barra de madera y paños de tela oscura con 家系ラーメン,
 * un carácter por paño, como en la entrada de una ramen-ya. Decorativa: el término ya está en el texto.
 */
@Component({
  selector: 'app-noren',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <div class="barra"></div>
    <div class="panos" lang="ja">
      @for (c of letras; track $index) { <span class="pano">{{ c }}</span> }
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; overflow: hidden; }
    .barra { height: 8px; background: var(--madera-veta); box-shadow: 0 1px 0 var(--borde), 0 4px 8px -2px rgba(0, 0, 0, .6); position: relative; z-index: 1; }
    .panos { display: grid; grid-template-columns: repeat(6, 1fr); gap: 3px; padding-inline: 3px; }
    .pano {
      display: grid; place-items: center;
      height: clamp(64px, 9vw, 112px);
      background: var(--madera-canto) var(--fibra);
      border: 1px solid var(--borde); border-top: 0;
      border-radius: 0 0 6px 6px;
      font: 400 clamp(1.5rem, 3.6vw, 3rem)/1 var(--display);
      color: var(--washi);
      box-shadow: inset 0 10px 12px -8px rgba(0, 0, 0, .8);
    }
  `,
})
export class Noren {
  protected readonly letras = [...'家系ラーメン'];
}
