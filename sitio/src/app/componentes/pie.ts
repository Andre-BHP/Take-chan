import { Idioma } from '../servicios/idioma';
import { PROPUESTA } from '../../entornos/modo';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NEGOCIO, SUCURSALES, VERSION_DATOS, direccionCorta } from '../servicios/datos';
import { horarioTexto } from '../servicios/horario';
import { FOTOS } from './foto';

/** Pie compacto que demuestra que el negocio es real (dis-052), con los mismos datos que el JSON-LD (dis-091). */
@Component({
  selector: 'app-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @let datos = version();
    <footer>
      <div class="envoltura rejilla">
        <div class="firma">
          <p class="marca"><img class="sello" src="sello-96.webp" srcset="sello-96.webp 96w, sello-192.webp 192w" sizes="48px" width="48" height="48" alt="" /><span><span lang="ja">家系</span> TAKE-CHAN RAMEN</span></p>
          <p class="tenue">{{ t('Ramen japonés estilo Iekei.') }} {{ t('De') }} {{ precio.min }} {{ t('a') }} {{ precio.max }} {{ t('MXN por persona') }}.</p>
          <p><a class="enlace" [href]="tiktok.url" target="_blank" rel="noopener">TikTok {{ tiktok.usuario }}<span class="solo-lector">{{ t(' (se abre en otra pestaña)') }}</span></a></p>
        </div>
        @for (s of sucursales; track s.id) {
          <div>
            <p class="t-subtitulo"><a [routerLink]="r('/' + s.id)">{{ s.nombre }}</a>@if (!s.confirmada) { <span class="marca-tentativa">{{ t('por confirmar') }}</span> }</p>
            <p class="t-pequeno tenue">{{ direccion(s) }}</p>
            <p class="t-dato tenue">{{ s.confirmada ? horario(s) : t('Horario pendiente') }}</p>
            <p><a class="enlace" [href]="s.mapa" target="_blank" rel="noopener">{{ t('Mapa') }}<span class="solo-lector"> {{ t('de') }} {{ s.nombre }} {{ t('en Google Maps (se abre en otra pestaña)') }}</span></a></p>
          </div>
        }
      </div>
      <div class="envoltura legal">
        @if (propuesta) {
          <p>{{ t('Propuesta no oficial hecha por un estudiante para enseñársela al negocio. No es el sitio de Take-chan Ramen, no recibe pedidos y no tiene datos de contacto reales. La marca pertenece a su dueño.') }}</p>
        } @else {
          <p>Take-chan Ramen · {{ t('Ramen Iekei en Tlaquepaque, Jalisco.') }}</p>
        }
        <p>{{ t('Imágenes ilustrativas de') }} <a href="https://unsplash.com/license" target="_blank" rel="noopener">Unsplash</a>{{ t(', no son platillos ni locales de Take-chan:') }}
          @for (a of autores; track a.usuario; let ultimo = $last) {
            <a [href]="'https://unsplash.com/@' + a.usuario" target="_blank" rel="noopener">{{ a.autor }}</a>{{ ultimo ? '.' : ', ' }}
          }
        </p>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; }
    footer { border-top: 1px solid var(--linea); padding-block: var(--e-7) var(--e-5); background: var(--sumi-2); }
    .rejilla { display: grid; gap: var(--e-5); grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); }
    .rejilla > div { display: grid; gap: var(--e-1); align-content: start; }
    .marca { display: flex; align-items: center; gap: var(--e-3); font: 700 1.25rem/1.2 var(--mincho); letter-spacing: .03em; }
    .sello { width: 48px; height: 48px; rotate: -4deg; flex: none; }
    .t-subtitulo { display: flex; gap: var(--e-2); align-items: center; flex-wrap: wrap; }
    .t-subtitulo a { text-decoration: none; }
    .t-subtitulo a:hover { text-decoration: underline; }
    .marca-tentativa { color: var(--ceniza); }
    .legal { margin-top: var(--e-6); padding-top: var(--e-4); border-top: 1px solid var(--linea); display: grid; gap: var(--e-2); color: var(--ceniza); font-size: .8125rem; }
    .legal p { max-width: 80ch; }
    .legal a { color: var(--ceniza); }
  `,
})
export class Pie {
  protected readonly t = inject(Idioma).t;
  protected readonly r = inject(Idioma).r;
  protected readonly idioma = inject(Idioma).actual;
  protected readonly version = VERSION_DATOS;
  protected readonly propuesta = PROPUESTA;
  protected readonly sucursales = SUCURSALES;
  protected readonly precio = NEGOCIO.precioPorPersona;
  protected readonly tiktok = NEGOCIO.redes.tiktok;
  protected readonly direccion = direccionCorta;
  protected readonly autores = [...new Map(Object.values(FOTOS).map((f) => [f.usuario, f])).values()];
  protected horario(s: (typeof SUCURSALES)[number]) {
    return horarioTexto(s.horario.turnos, this.idioma());
  }
}
