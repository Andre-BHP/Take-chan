import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Noren (のれん) de tela teñida al cierre de la portada: tres paños índigo con 家系ラーメン de lado a lado,
 * separados por cortes. Se mecen con el puntero (con resorte) y, al tocarlos, se abren y llevan al menú,
 * como al entrar a una ramen-ya.
 */
@Component({
  selector: 'app-noren',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.abierta]': 'abierta()' },
  template: `
    <div class="vara" aria-hidden="true"></div>
    <a class="tela" href="menu" (click)="entrar($event)" (pointermove)="mecer($event)" (pointerleave)="soltar($event)" aria-label="Entrar al menú y pedido">
      @for (i of panos; track i) {
        <span class="pano" aria-hidden="true" [style.--i]="i"><span class="letras" lang="ja">家系ラーメン</span></span>
      }
      <span class="pista-tela" aria-hidden="true">Entra al menú</span>
    </a>
  `,
  styles: `
    :host { display: block; padding-inline: var(--gutter); --x: 0; }
    .vara { height: 12px; max-width: 64rem; margin: 0 auto; border-radius: 6px; background: linear-gradient(#6b5442, #2c211a); box-shadow: 0 8px 14px -8px rgba(0, 0, 0, .9); position: relative; z-index: 1; }
    .tela { position: relative; max-width: 62rem; margin: -3px auto 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-decoration: none; color: inherit; }
    .pano {
      position: relative; overflow: hidden; height: clamp(170px, 24vw, 280px);
      /* Algodón teñido de índigo: pliegues suaves con degradados finos */
      background:
        repeating-linear-gradient(90deg, rgba(255, 255, 255, .025) 0 2px, transparent 2px 9px),
        linear-gradient(90deg, rgba(0, 0, 0, .28), rgba(255, 255, 255, .04) 35%, rgba(0, 0, 0, .12) 70%, rgba(0, 0, 0, .3)),
        #1e2b45 var(--grano);
      border-radius: 0 0 var(--r-m) var(--r-m);
      box-shadow: inset 0 18px 20px -16px rgba(0, 0, 0, .7), 0 20px 34px -20px rgba(0, 0, 0, .9);
      transform-origin: 50% 0;
      transform: skewX(calc(var(--x) * -3deg)) rotate(calc(var(--x) * 1.4deg * (var(--i) - 1)));
      transition: transform 700ms var(--ease-tela);
    }
    .letras {
      position: absolute; top: 50%; left: calc(var(--i) * -100% - var(--i) * 8px);
      width: calc(300% + 16px); transform: translateY(-50%);
      text-align: center; color: var(--washi); font: 800 clamp(2rem, 6.6vw, 5rem)/1 var(--mincho); letter-spacing: .14em; white-space: nowrap;
    }
    .pista-tela { position: absolute; left: 50%; bottom: var(--e-3); translate: -50% 0; font: 500 .8125rem/1 var(--sans); color: rgba(243, 238, 228, .7); letter-spacing: .08em; }
    .tela:focus-visible { outline: 2px solid var(--washi); outline-offset: 6px; border-radius: var(--r-m); }
    /* Al tocarla, los paños de los lados se apartan como al entrar al local */
    :host(.abierta) .pano:nth-child(1) { transform: translateX(-30%) rotate(-10deg); transition-duration: var(--t-4); }
    :host(.abierta) .pano:nth-child(2) { transform: translateY(-14%) scaleY(.9); transition-duration: var(--t-4); }
    :host(.abierta) .pano:nth-child(3) { transform: translateX(30%) rotate(10deg); transition-duration: var(--t-4); }
    @media (prefers-reduced-motion: reduce) { .pano { transform: none !important; } }
  `,
})
export class Noren {
  private readonly router = inject(Router);
  protected readonly panos = [0, 1, 2];
  protected readonly abierta = signal(false);

  protected mecer(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.closest('app-noren')?.setAttribute('style', `--x: ${((e.clientX - r.left) / r.width - 0.5).toFixed(3)}`);
  }

  protected soltar(e: PointerEvent) {
    (e.currentTarget as HTMLElement).closest('app-noren')?.setAttribute('style', '--x: 0');
  }

  protected entrar(e: MouseEvent) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.abierta.set(true);
    setTimeout(() => this.router.navigateByUrl('/menu'), reducir ? 0 : 380);
  }
}
