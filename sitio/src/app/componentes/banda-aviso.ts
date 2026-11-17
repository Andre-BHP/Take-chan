import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Hoja } from '../servicios/hoja';

/**
 * Banda de aviso arriba del sitio ("Hoy cerramos a las 15:00"), solo mientras el aviso esté vigente.
 * Se cierra con la ✕ y no vuelve a salir para ese aviso en este navegador.
 */
@Component({
  selector: 'app-banda-aviso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible(); as a) {
      <aside class="banda" aria-label="Aviso del negocio">
        <p>{{ a.texto }}</p>
        <button type="button" (click)="cerrar()" aria-label="Cerrar el aviso">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
      </aside>
    }
  `,
  styles: `
    .banda { display: flex; align-items: center; justify-content: center; gap: var(--e-3); padding: 4px var(--gutter); background: var(--led); color: var(--tinta); }
    p { margin: 0; font: 600 .9375rem/1.35 var(--sans); text-align: center; text-wrap: balance; }
    button { flex: none; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 0; border-radius: 50%; background: none; color: inherit; cursor: pointer; }
    button:hover { background: rgba(26, 23, 20, .1); }
    button:focus-visible { outline: 2px solid var(--tinta); outline-offset: -4px; }
    svg { width: 20px; height: 20px; }
  `,
})
export class BandaAviso {
  private readonly hoja = inject(Hoja);
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly cerrados = signal<string[]>(this.leer());
  protected readonly visible = computed(() => {
    const a = this.hoja.aviso();
    return this.navegador && a && !this.cerrados().includes(this.clave(a)) ? a : null;
  });

  private clave(a: { texto: string; hasta: string }) { return a.texto + '|' + a.hasta; }
  private leer(): string[] {
    if (!this.navegador) return [];
    try { return JSON.parse(localStorage.getItem('take-avisos-cerrados') ?? '[]'); } catch { return []; }
  }
  protected cerrar() {
    const a = this.hoja.aviso();
    if (!a) return;
    this.cerrados.update((c) => [...c, this.clave(a)]);
    try { localStorage.setItem('take-avisos-cerrados', JSON.stringify(this.cerrados())); } catch { /* sin almacenamiento */ }
  }
}
