import { Idioma } from '../servicios/idioma';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import faqJson from '../../datos/faq.json';
import { SUCURSALES, VERSION_DATOS, direccionCorta } from '../servicios/datos';
import { horarioTexto } from '../servicios/horario';
import { Contacto } from '../servicios/contacto';

interface PreguntaJson { id: string; pregunta: string; respuesta: string | null; respuestaPropuesta?: string; tipo: string; mostrar: boolean }
export interface Pregunta { id: string; pregunta: string; respuesta: string }

/**
 * Preguntas que se muestran: solo las de respuesta real o general (faq.json → mostrar).
 * En modo demostración (propuesta o sin WhatsApp) se usa la respuesta de la propuesta cuando la hay.
 */
export function preguntas(demo: boolean, tr: (es: string) => string = (s) => s, en = false): Pregunta[] {
  const t = SUCURSALES[0];
  const horario = en
    ? horarioTexto(t.horario.turnos, 'en').replace('Every day · ', 'every day, from ')
    : horarioTexto(t.horario.turnos).replace('Todos los días · ', 'todos los días, de ');
  return (faqJson.preguntas as PreguntaJson[])
    .filter((p) => p.mostrar && p.respuesta)
    .map((p) => ({
      id: p.id,
      pregunta: tr(p.pregunta),
      respuesta: tr((demo && p.respuestaPropuesta) || p.respuesta!).replace('{horario}', horario).replace('{direccion}', direccionCorta(t) + (en ? ', at the corner of Niños Héroes' : ', esquina con Niños Héroes')),
    }));
}

/** JSON-LD FAQPage con las mismas preguntas y respuestas que se ven en pantalla. */
export const faqPage = (lista: Pregunta[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: lista.map((p) => ({ '@type': 'Question', name: p.pregunta, acceptedAnswer: { '@type': 'Answer', text: p.respuesta } })),
});

/** Preguntas frecuentes en acordeón nativo (<details>): accesible con teclado y lector de pantalla, sin JavaScript. */
@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="lista">
      @for (p of lista(); track p.id) {
        <details>
          <summary><span>{{ p.pregunta }}</span><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></summary>
          <p>{{ p.respuesta }}</p>
        </details>
      }
    </div>
  `,
  styles: `
    .lista { border-top: 1px solid var(--linea); }
    details { border-bottom: 1px solid var(--linea); }
    summary {
      display: flex; justify-content: space-between; align-items: center; gap: var(--e-3);
      min-height: 64px; padding-block: var(--e-3); cursor: pointer; list-style: none;
      font: 700 clamp(1.125rem, 1rem + .5vw, 1.375rem)/1.3 var(--mincho);
    }
    summary::-webkit-details-marker { display: none; }
    summary:hover span { text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
    summary:focus-visible { outline: 2px solid var(--washi); outline-offset: 4px; border-radius: 2px; }
    svg { flex: none; width: 22px; height: 22px; color: var(--washi-2); transition: transform var(--t-3) var(--ease-out); }
    details[open] svg { transform: rotate(180deg); }
    p { margin: 0 0 var(--e-4); max-width: 62ch; color: var(--washi-2); text-wrap: pretty; }
    @media (prefers-reduced-motion: reduce) { svg { transition: none; } }
  `,
})
export class Faq {
  protected readonly t = inject(Idioma).t;
  protected readonly r = inject(Idioma).r;
  protected readonly idioma = inject(Idioma).actual;
  private readonly contacto = inject(Contacto);
  protected readonly lista = computed(() => (VERSION_DATOS(), preguntas(this.contacto.demo, this.t, this.idioma() === 'en')));
}
