import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Noren (のれん): tela de tres paños con cortes y 家系ラーメン de lado a lado, como en la entrada
 * de una ramen-ya. Los paños se mecen solo al pasar el cursor. Aparece una sola vez.
 */
@Component({
  selector: 'app-noren',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="vara" aria-hidden="true"></div>
    <div class="tela">
      @for (i of panos; track i) {
        <div class="pano" aria-hidden="true"><span lang="ja" [style.--i]="i">家系ラーメン</span></div>
      }
      <p class="solo-lector" lang="ja">家系ラーメン (iekei rāmen)</p>
    </div>
  `,
  styles: `
    :host { display: block; padding-inline: var(--gutter); }
    .vara { height: 10px; max-width: 64rem; margin: 0 auto; border-radius: 5px; background: linear-gradient(#5a4535, #2c211a); box-shadow: 0 6px 12px -6px rgba(0, 0, 0, .8); position: relative; z-index: 1; }
    .tela { max-width: 62rem; margin: -2px auto 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
    .pano {
      position: relative; overflow: hidden; height: clamp(150px, 22vw, 260px);
      background: var(--washi) var(--grano); border-radius: 0 0 var(--r-m) var(--r-m);
      box-shadow: inset 0 16px 18px -14px rgba(0, 0, 0, .45), inset 0 -3px 0 rgba(0, 0, 0, .08), 0 18px 30px -18px rgba(0, 0, 0, .8);
      transform-origin: 50% 0;
      transition: transform 700ms cubic-bezier(.34, 1.4, .5, 1);
    }
    .pano span {
      position: absolute; top: 50%; left: calc(var(--i) * -100% - var(--i) * 6px);
      width: calc(300% + 12px); transform: translateY(-50%);
      text-align: center; color: var(--tinta); font: 800 clamp(1.9rem, 6.4vw, 4.75rem)/1 var(--mincho); letter-spacing: .12em; white-space: nowrap;
    }
    @media (hover: hover) and (prefers-reduced-motion: no-preference) {
      .tela:hover .pano:nth-child(1) { transform: rotate(1.2deg); }
      .tela:hover .pano:nth-child(2) { transform: rotate(-.8deg); transition-delay: 40ms; }
      .tela:hover .pano:nth-child(3) { transform: rotate(1deg); transition-delay: 80ms; }
    }
  `,
})
export class Noren {
  protected readonly panos = [0, 1, 2];
}
