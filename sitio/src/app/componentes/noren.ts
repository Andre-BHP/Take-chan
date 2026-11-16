import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Cortina noren (のれん) como separador: barra de madera y paños con cortes. Decorativa. */
@Component({
  selector: 'app-noren',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 1200 84" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <rect x="0" y="0" width="1200" height="8" fill="var(--madera-canto)" />
      @for (i of panos; track i) {
        <path [attr.d]="pano(i)" fill="var(--madera-veta)" />
        <path [attr.d]="pliegue(i)" stroke="var(--carbon)" stroke-width="2" opacity=".5" fill="none" />
      }
    </svg>
  `,
  styles: `
    :host { display: block; width: 100%; height: clamp(48px, 7vw, 84px); }
    svg { width: 100%; height: 100%; }
  `,
})
export class Noren {
  protected readonly panos = [0, 1, 2, 3, 4];
  private readonly ancho = 1200 / 5;
  protected pano(i: number) {
    const x = i * this.ancho + 3;
    const w = this.ancho - 6;
    return `M${x} 8h${w}v66q${-w / 2} 10 ${-w} 0z`;
  }
  protected pliegue(i: number) {
    const x = i * this.ancho + this.ancho / 2;
    return `M${x - 40} 16v52M${x + 40} 16v52`;
  }
}
