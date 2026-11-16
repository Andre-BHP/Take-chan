import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NEGOCIO, SUCURSALES, direccionCompleta } from '../servicios/datos';
import { horarioTexto } from '../servicios/horario';
import { Noren } from './noren';

/** Pie que demuestra que el negocio es real (dis-052), con los mismos datos que el JSON-LD (dis-091). */
@Component({
  selector: 'app-pie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Noren],
  template: `
    <app-noren />
    <footer>
      <div class="envoltura rejilla">
        <div class="firma">
          <p class="marca">TAKE-CHAN<br />RAMEN</p>
          <p class="tenue">Ramen japonés estilo Iekei. <span lang="ja">家系ラーメン</span></p>
          <p class="t-dato tenue">De {{ precio.min }} a {{ precio.max }} MXN por persona</p>
        </div>
        @for (s of sucursales; track s.id) {
          <div>
            <h2 class="t-subtitulo">
              <a [routerLink]="'/' + s.id">{{ s.nombre }}</a>
            </h2>
            @if (!s.confirmada) { <p><span class="por-confirmar">sucursal por confirmar</span></p> }
            <p class="t-dato">{{ direccion(s) }}</p>
            @if (s.direccion.referencia) { <p class="t-dato tenue">{{ s.direccion.referencia }}</p> }
            <p class="t-dato">{{ horario(s) }}</p>
            <p><a class="enlace" [href]="s.mapa" target="_blank" rel="noopener">Abrir en Google Maps<span class="solo-lector"> (se abre en otra pestaña)</span></a></p>
          </div>
        }
        <div>
          <h2 class="t-subtitulo">Redes</h2>
          <p><a class="enlace" [href]="tiktok.url" target="_blank" rel="noopener">TikTok {{ tiktok.usuario }}<span class="solo-lector"> (se abre en otra pestaña)</span></a></p>
          <p class="t-dato tenue">WhatsApp, teléfono e Instagram: por confirmar</p>
        </div>
      </div>
      <div class="envoltura legal">
        <p>Propuesta no oficial hecha por un estudiante para enseñársela al negocio. No es el sitio de Take-chan Ramen, no recibe pedidos y no tiene datos de contacto reales. La marca pertenece a su dueño. Las ilustraciones no son fotos de sus platillos.</p>
      </div>
    </footer>
  `,
  styles: `
    :host { display: block; margin-top: var(--e-8); }
    footer { background: var(--madera); border-top: 1px solid var(--borde); padding-block: var(--e-7) var(--e-5); }
    .rejilla { display: grid; gap: var(--e-6) var(--e-5); grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); }
    .rejilla > div { display: grid; gap: var(--e-2); align-content: start; }
    .marca { font: 400 2rem/.9 var(--display); }
    h2 a { text-decoration: none; }
    h2 a:hover { text-decoration: underline; }
    .enlace { color: var(--texto); font-weight: 700; }
    .legal { margin-top: var(--e-7); padding-top: var(--e-4); border-top: 1px solid var(--borde); color: var(--texto-tenue); font-size: .8125rem; max-width: var(--ancho); }
    .legal p { max-width: 70ch; }
  `,
})
export class Pie {
  protected readonly sucursales = SUCURSALES;
  protected readonly precio = NEGOCIO.precioPorPersona;
  protected readonly tiktok = NEGOCIO.redes.tiktok;
  protected readonly direccion = direccionCompleta;
  protected horario(s: (typeof SUCURSALES)[number]) {
    return horarioTexto(s.horario.turnos);
  }
}
