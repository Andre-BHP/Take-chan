import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Lugar reservado para una foto real que se tomará en el local. Nunca se rellena con fotos de TikTok. */
@Component({
  selector: 'app-hueco-foto',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h3l2-2.5h6L17 7h3v12H4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
    <span>{{ texto() }}</span>
  `,
  styles: `
    :host {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--e-2);
      min-height: 120px; padding: var(--e-3); text-align: center;
      border: 1.5px dashed currentColor; border-radius: var(--r-s);
      font: 400 .6875rem/1.5 var(--mono); color: var(--texto-tenue);
    }
    svg { width: 24px; height: 24px; }
  `,
})
export class HuecoFoto {
  readonly texto = input('Foto real pendiente: se toma en el local');
}
