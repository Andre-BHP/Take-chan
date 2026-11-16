import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Contacto } from '../servicios/contacto';

/** Diálogo del modo demostración: enseña el mensaje de WhatsApp que se habría enviado. */
@Component({
  selector: 'app-aviso-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dialogo aria-labelledby="aviso-titulo" (close)="contacto.aviso.set(null)" (click)="fuera($event)">
      @if (contacto.aviso(); as a) {
        <div class="hoja">
          <h2 id="aviso-titulo" class="t-subtitulo">{{ a.titulo }}</h2>
          <p>{{ a.texto }}</p>
          @if (a.mensaje) {
            <pre class="mensaje" aria-label="Mensaje de WhatsApp">{{ a.mensaje }}</pre>
          }
          <form method="dialog"><button class="boton boton-contorno">Entendido</button></form>
        </div>
      }
    </dialog>
  `,
  styles: `
    dialog { margin: auto; border: 0; padding: 0; background: transparent; color: var(--tinta); max-width: min(30rem, calc(100vw - 32px)); width: 100%; }
    dialog::backdrop { background: rgba(10, 7, 5, .72); }
    .hoja { background: var(--washi) var(--grano); border-radius: var(--r-m); padding: var(--e-4); display: grid; gap: var(--e-3); box-shadow: 0 20px 40px -16px rgba(0, 0, 0, .8); }
    p { color: var(--tinta-2); }
    .mensaje { font: 400 .8125rem/1.6 var(--mono); white-space: pre-wrap; background: var(--washi-2); border-radius: var(--r-s); padding: var(--e-3); max-height: 50vh; overflow: auto; }
    .boton-contorno { color: var(--tinta); border-color: var(--tinta-2); width: 100%; }
    .boton-contorno:hover { border-color: var(--tinta); }
    @media (prefers-reduced-motion: no-preference) {
      dialog[open] .hoja { animation: entra var(--lento) var(--salida); }
      @keyframes entra { from { opacity: 0; transform: translateY(12px); } }
    }
  `,
})
export class AvisoDemo {
  protected readonly contacto = inject(Contacto);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');

  constructor() {
    effect(() => {
      const d = this.dialogo().nativeElement;
      if (this.contacto.aviso() && !d.open) d.showModal();
    });
  }

  protected fuera(e: MouseEvent) {
    if (e.target === this.dialogo().nativeElement) this.dialogo().nativeElement.close();
  }
}
