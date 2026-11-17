import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Idioma } from '../servicios/idioma';
import { Seo } from '../servicios/seo';
import { Contacto } from '../servicios/contacto';
import { Estadisticas } from '../servicios/estadisticas';
import { NEGOCIO } from '../servicios/datos';
import { FOTOS } from '../componentes/foto';
import { PROPUESTA } from '../../entornos/modo';

/** Texto en los dos idiomas: estas páginas traen el suyo y no engordan el diccionario general. */
type Bi = { es: string; en: string };
const estilos = `
  .legal { padding-block: var(--e-7) var(--e-8); display: grid; gap: var(--e-5); max-width: 48rem; }
  .legal h1 { font: 700 clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)/1.05 var(--mincho); letter-spacing: -.015em; }
  .legal h2 { font: 700 1.375rem/1.25 var(--mincho); margin-top: var(--e-3); }
  .legal p, .legal li { color: var(--washi-2); max-width: 68ch; text-wrap: pretty; }
  .legal ul { display: grid; gap: var(--e-2); padding-left: 1.2em; }
  .legal a { color: var(--washi); text-underline-offset: 3px; }
  .bajada { font-size: 1.125rem; }
  .pendiente { color: var(--led); font-weight: 600; }
  .fecha { font: 500 .875rem/1.4 var(--sans); color: var(--ceniza); }
`;

/** Aviso de privacidad (Ley Federal de Protección de Datos Personales en Posesión de los Particulares). */
@Component({
  selector: 'app-privacidad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="legal envoltura">
      <h1>{{ x({ es: 'Aviso de privacidad', en: 'Privacy notice' }) }}</h1>
      @if (propuesta) {
        <p class="bajada">{{ x({ es: 'Este prototipo no guarda ni envía datos. El nombre que escribas en el pedido solo se usa para armar el mensaje en tu dispositivo.', en: 'This prototype neither stores nor sends any data. The name you type in your order is only used to put the message together on your device.' }) }}</p>
        <h2>{{ x({ es: 'Lo que se guarda en tu navegador', en: 'What is kept in your browser' }) }}</h2>
        <ul>
          <li>{{ x({ es: 'Si viste la intro, para no repetirla en la misma visita.', en: 'Whether you saw the intro, so it doesn’t repeat during the same visit.' }) }}</li>
          <li>{{ x({ es: 'Si prefieres el menú como máquina o como lista, y los avisos que cerraste.', en: 'Whether you prefer the menu as a machine or a list, and the notices you closed.' }) }}</li>
          <li>{{ x({ es: 'Una copia del menú para abrirlo sin conexión.', en: 'A copy of the menu so it opens offline.' }) }}</li>
        </ul>
        <p>{{ x({ es: 'Nada de esto sale de tu dispositivo y puedes borrarlo desde la configuración de tu navegador. No hay cookies ni estadísticas.', en: 'None of this leaves your device, and you can delete it from your browser settings. There are no cookies and no analytics.' }) }}</p>
        <h2>{{ x({ es: 'Servicios de otros', en: 'Third-party services' }) }}</h2>
        <p>{{ x({ es: 'Los videos de TikTok solo se cargan si tocas el botón; desde ese momento aplica la política de TikTok. Los botones de Google Maps abren Google Maps.', en: 'TikTok videos only load if you tap the button; from then on, TikTok’s policy applies. The Google Maps buttons open Google Maps.' }) }}</p>
      } @else {
        <p class="bajada">{{ x({ es: 'Cómo trata Take-chan Ramen los datos que compartes al pedir desde este sitio, conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.', en: 'How Take-chan Ramen handles the data you share when ordering through this site, under Mexico’s Federal Law on the Protection of Personal Data Held by Private Parties.' }) }}</p>
        <h2>{{ x({ es: 'Responsable', en: 'Data controller' }) }}</h2>
        <p>{{ responsable() }}</p>
        <h2>{{ x({ es: 'Para qué usamos tus datos', en: 'What we use your data for' }) }}</h2>
        <p>{{ x({ es: 'Únicamente para preparar tu pedido y avisarte cuando esté listo.', en: 'Only to prepare your order and let you know when it’s ready.' }) }}</p>
        <h2>{{ x({ es: 'Qué datos', en: 'Which data' }) }}</h2>
        <p>{{ x({ es: 'El nombre para el pedido (opcional) y lo que escribas en WhatsApp. El sitio no los recibe ni los guarda: el pedido se envía desde tu WhatsApp al nuestro.', en: 'The name for the order (optional) and whatever you write on WhatsApp. The website doesn’t receive or store them: the order goes from your WhatsApp to ours.' }) }}</p>
        @if (estadisticas) {
          <h2>{{ x({ es: 'Estadísticas', en: 'Analytics' }) }}</h2>
          <p>{{ x({ es: 'Contamos visitas y clics con GoatCounter, sin cookies y sin datos personales, para saber qué páginas sirven.', en: 'We count visits and clicks with GoatCounter, without cookies or personal data, to learn which pages help.' }) }}</p>
        }
        <h2>{{ x({ es: 'Tus derechos (ARCO)', en: 'Your rights (ARCO)' }) }}</h2>
        <p>{{ x({ es: 'Puedes pedir acceder, rectificar, cancelar u oponerte al uso de tus datos, y revocar tu consentimiento:', en: 'You may request access, rectification, cancellation or opposition to the use of your data, and withdraw your consent:' }) }} {{ contactoArco() }}</p>
        <h2>{{ x({ es: 'Cambios a este aviso', en: 'Changes to this notice' }) }}</h2>
        <p>{{ x({ es: 'Cualquier cambio se publica en esta página.', en: 'Any change will be published on this page.' }) }}</p>
      }
      <p class="fecha">{{ x({ es: 'Última actualización: 16 de noviembre de 2026.', en: 'Last updated: November 16, 2026.' }) }}</p>
      <p><a [routerLink]="r('/accesibilidad')">{{ x({ es: 'Accesibilidad', en: 'Accessibility' }) }}</a> · <a [routerLink]="r('/creditos')">{{ x({ es: 'Créditos', en: 'Credits' }) }}</a></p>
    </article>
  `,
  styles: estilos,
})
export class Privacidad {
  private readonly idioma = inject(Idioma);
  protected readonly r = this.idioma.r;
  protected readonly propuesta = PROPUESTA;
  protected readonly estadisticas = inject(Estadisticas).activas;
  private readonly legal = (NEGOCIO as unknown as { legal?: { responsable: string | null; domicilio: string | null; contactoArco: string | null } }).legal ?? { responsable: null, domicilio: null, contactoArco: null };
  protected x = (b: Bi) => (this.idioma.actual() === 'en' ? b.en : b.es);
  protected readonly responsable = computed(() =>
    this.legal.responsable ? `${this.legal.responsable}${this.legal.domicilio ? ', ' + this.legal.domicilio : ''}.` : this.x({ es: 'Por confirmar: nombre y domicilio del negocio (GUIA_PUBLICAR.md).', en: 'To be confirmed: business name and address.' }));
  protected readonly contactoArco = computed(() => this.legal.contactoArco ?? this.x({ es: 'medio de contacto por confirmar.', en: 'contact method to be confirmed.' }));

  constructor() {
    inject(Seo).establecer({ titulo: this.x({ es: 'Aviso de privacidad', en: 'Privacy notice' }) + ' · Take-chan Ramen', descripcion: this.x({ es: 'Qué datos se usan al pedir en Take-chan Ramen y para qué.', en: 'What data is used when ordering at Take-chan Ramen, and why.' }), ruta: '/privacidad' });
  }
}

/** Declaración de accesibilidad: el compromiso, lo que se probó y cómo reportar un problema. */
@Component({
  selector: 'app-accesibilidad',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="legal envoltura">
      <h1>{{ x({ es: 'Accesibilidad', en: 'Accessibility' }) }}</h1>
      <p class="bajada">{{ x({ es: 'Queremos que cualquier persona pueda ver el menú, pedir y llegar. Este sitio busca cumplir las pautas WCAG 2.2 en nivel AA.', en: 'We want everyone to be able to see the menu, order and find us. This site aims to meet WCAG 2.2 level AA.' }) }}</p>
      <h2>{{ x({ es: 'Lo que se probó', en: 'What was tested' }) }}</h2>
      <ul>
        <li>{{ x({ es: 'Revisión automática (axe) de todas las páginas, en celular y escritorio, sin errores.', en: 'Automated review (axe) of every page, on phone and desktop, with no errors.' }) }}</li>
        <li>{{ x({ es: 'Todo se usa con teclado: el menú, el pedido, el detalle de cada platillo y las preguntas frecuentes.', en: 'Everything works with a keyboard: the menu, the order, each dish’s details and the FAQ.' }) }}</li>
        <li>{{ x({ es: 'Vista de lista del menú, pensada para lectores de pantalla y para leer rápido.', en: 'A list view of the menu, designed for screen readers and quick reading.' }) }}</li>
        <li>{{ x({ es: 'Contraste de texto AA, desde 320 px de ancho y con zoom.', en: 'AA text contrast, from 320 px wide and with zoom.' }) }}</li>
        <li>{{ x({ es: 'Si tu dispositivo pide reducir el movimiento, las animaciones se detienen.', en: 'If your device asks for reduced motion, the animations stop.' }) }}</li>
      </ul>
      <h2>{{ x({ es: 'Lo que todavía no está bien', en: 'Known limitations' }) }}</h2>
      <ul>
        <li>{{ x({ es: 'Los videos de TikTok dependen de TikTok y no siempre tienen subtítulos.', en: 'TikTok videos depend on TikTok and don’t always have captions.' }) }}</li>
        <li>{{ x({ es: 'Los mapas son imágenes; la dirección completa está siempre en texto junto a ellos.', en: 'The maps are images; the full address is always written next to them.' }) }}</li>
      </ul>
      <h2>{{ x({ es: 'Si algo no te funciona', en: 'If something doesn’t work for you' }) }}</h2>
      <p>{{ reportar() }}</p>
      <p class="fecha">{{ x({ es: 'Última revisión: 16 de noviembre de 2026.', en: 'Last reviewed: November 16, 2026.' }) }}</p>
      <p><a [routerLink]="r('/privacidad')">{{ x({ es: 'Aviso de privacidad', en: 'Privacy notice' }) }}</a> · <a [routerLink]="r('/creditos')">{{ x({ es: 'Créditos', en: 'Credits' }) }}</a></p>
    </article>
  `,
  styles: estilos,
})
export class Accesibilidad {
  private readonly idioma = inject(Idioma);
  protected readonly r = this.idioma.r;
  private readonly demo = inject(Contacto).demo;
  protected x = (b: Bi) => (this.idioma.actual() === 'en' ? b.en : b.es);
  protected readonly reportar = computed(() =>
    PROPUESTA || this.demo
      ? this.x({ es: 'Cuéntaselo a quien te compartió esta propuesta, por el mismo medio. Dinos qué página, qué intentabas hacer y con qué dispositivo.', en: 'Tell the person who shared this proposal with you, through the same channel. Say which page, what you were trying to do and on which device.' })
      : this.x({ es: 'Escríbenos por WhatsApp o dínoslo en el local. Dinos qué página, qué intentabas hacer y con qué dispositivo, y te ayudamos a pedir mientras lo arreglamos.', en: 'Message us on WhatsApp or tell us at the restaurant. Say which page, what you were trying to do and on which device, and we’ll help you order while we fix it.' }));

  constructor() {
    inject(Seo).establecer({ titulo: this.x({ es: 'Accesibilidad', en: 'Accessibility' }) + ' · Take-chan Ramen', descripcion: this.x({ es: 'Compromiso de accesibilidad del sitio de Take-chan Ramen.', en: 'Accessibility statement for the Take-chan Ramen website.' }), ruta: '/accesibilidad' });
  }
}

/** Créditos: fotos de Unsplash por autor, mapas de OpenStreetMap, fuentes y el sello. */
@Component({
  selector: 'app-creditos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <article class="legal envoltura">
      <h1>{{ x({ es: 'Créditos', en: 'Credits' }) }}</h1>
      <h2>{{ x({ es: 'Fotos', en: 'Photos' }) }}</h2>
      <p>{{ x({ es: 'Las fotos con el rótulo «Imagen ilustrativa» son de Unsplash (licencia de Unsplash) y no son platillos ni locales de Take-chan:', en: 'Photos labeled “Illustrative image” come from Unsplash (Unsplash License) and are not Take-chan dishes or premises:' }) }}</p>
      <ul>
        @for (f of fotos; track f.id) {
          <li>{{ idioma.actual() === 'en' ? 'Photo' : f.alt }} · <a [href]="'https://unsplash.com/photos/' + f.id" target="_blank" rel="noopener">{{ f.autor }}<span class="solo-lector">{{ x({ es: ' (se abre en otra pestaña)', en: ' (opens in a new tab)' }) }}</span></a></li>
        }
      </ul>
      <h2>{{ x({ es: 'Mapas', en: 'Maps' }) }}</h2>
      <p>{{ x({ es: 'Los mapas de las sucursales se dibujaron con datos de', en: 'The location maps were drawn with data from' }) }} <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© {{ x({ es: 'colaboradores de OpenStreetMap', en: 'OpenStreetMap contributors' }) }}</a>{{ x({ es: ', con licencia ODbL.', en: ', licensed under the ODbL.' }) }}</p>
      <h2>{{ x({ es: 'Tipografías', en: 'Typefaces' }) }}</h2>
      <p>Shippori Mincho B1 (FONTDASU) · Geist (Vercel). {{ x({ es: 'Ambas con licencia SIL Open Font License.', en: 'Both under the SIL Open Font License.' }) }}</p>
      <h2>{{ x({ es: 'Sello', en: 'Seal' }) }}</h2>
      <p>{{ propuesta ? x({ es: 'El sello 家系 se hizo para esta propuesta y no es el logo del negocio.', en: 'The 家系 seal was made for this proposal and is not the restaurant’s logo.' }) : x({ es: 'Sello 家系 de Take-chan Ramen.', en: 'Take-chan Ramen’s 家系 seal.' }) }}</p>
      <p><a [routerLink]="r('/privacidad')">{{ x({ es: 'Aviso de privacidad', en: 'Privacy notice' }) }}</a> · <a [routerLink]="r('/accesibilidad')">{{ x({ es: 'Accesibilidad', en: 'Accessibility' }) }}</a></p>
    </article>
  `,
  styles: estilos,
})
export class Creditos {
  protected readonly idioma = inject(Idioma);
  protected readonly r = this.idioma.r;
  protected readonly propuesta = PROPUESTA;
  /** Una línea por foto de Unsplash (los recortes comparten la foto original). */
  protected readonly fotos = [...new Map(Object.values(FOTOS).filter((f) => f.stock !== false).map((f) => [f.id, f])).values()];
  protected x = (b: Bi) => (this.idioma.actual() === 'en' ? b.en : b.es);

  constructor() {
    inject(Seo).establecer({ titulo: this.x({ es: 'Créditos', en: 'Credits' }) + ' · Take-chan Ramen', descripcion: this.x({ es: 'Fotos, mapas y tipografías del sitio de Take-chan Ramen.', en: 'Photos, maps and typefaces used on the Take-chan Ramen website.' }), ruta: '/creditos' });
  }
}
