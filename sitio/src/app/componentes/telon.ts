import { ChangeDetectionStrategy, Component, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn } from '@angular/router';

type Fase = 'quieto' | 'cae' | 'abre';

/**
 * Telón de noren entre páginas (dis-101): tres paños de tela bajan escalonados y tapan la vista,
 * la página cambia debajo y los paños se separan hacia los lados. Unos 600 ms en total.
 * No corre en el prerender, en la primera carga, con movimiento reducido ni cuando la navegación
 * usa el elemento compartido (la foto del bento que vuela a su tecla).
 */
@Injectable({ providedIn: 'root' })
export class Telon {
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  readonly fase = signal<Fase>('quieto');
  /** La próxima navegación usa el elemento compartido de View Transitions en lugar del telón. */
  compartido = false;
  private primera = true;

  cerrar(): Promise<boolean> {
    if (!this.navegador || this.primera || this.compartido || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.primera = false;
      return Promise.resolve(true);
    }
    this.fase.set('cae');
    return new Promise((listo) => setTimeout(() => listo(true), 340));
  }

  abrir() {
    if (this.fase() !== 'cae') return;
    this.fase.set('abre');
    setTimeout(() => this.fase() === 'abre' && this.fase.set('quieto'), 380);
  }
}

/** Guardia de todas las rutas: espera a que caiga el telón antes de cambiar de página. */
export const conTelon: CanActivateFn = () => inject(Telon).cerrar();

@Component({
  selector: 'app-telon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[attr.data-fase]': 'telon.fase()' },
  template: `@for (i of [0, 1, 2]; track i) { <span class="pano" [style.--i]="i"></span> }`,
  styles: `
    :host { position: fixed; inset: 0; z-index: 90; display: none; grid-template-columns: repeat(3, 1fr); gap: 6px; pointer-events: none; }
    :host([data-fase='cae']), :host([data-fase='abre']) { display: grid; }
    .pano {
      background:
        repeating-linear-gradient(90deg, rgba(255, 255, 255, .025) 0 2px, transparent 2px 9px),
        linear-gradient(90deg, rgba(0, 0, 0, .28), rgba(255, 255, 255, .04) 35%, rgba(0, 0, 0, .12) 70%, rgba(0, 0, 0, .3)),
        #1e2b45 var(--grano);
      box-shadow: inset 0 18px 20px -16px rgba(0, 0, 0, .7);
      transform: translateY(-101%);
    }
    :host([data-fase='cae']) .pano { animation: cae 220ms var(--ease-in-out) calc(var(--i) * 60ms) forwards; }
    :host([data-fase='abre']) .pano { transform: none; animation: abre 340ms var(--ease-tela) forwards; }
    :host([data-fase='abre']) .pano:nth-child(1) { --lado: -110%; }
    :host([data-fase='abre']) .pano:nth-child(2) { --lado: 0; animation-name: sube; }
    :host([data-fase='abre']) .pano:nth-child(3) { --lado: 110%; }
    @keyframes cae { to { transform: none; } }
    @keyframes abre { to { transform: translateX(var(--lado)) skewY(calc(var(--i) * 2deg - 2deg)); } }
    @keyframes sube { to { transform: translateY(-101%); } }
  `,
})
export class TelonVista {
  protected readonly telon = inject(Telon);
}
