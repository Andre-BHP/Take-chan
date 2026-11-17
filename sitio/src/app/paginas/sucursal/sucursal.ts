import { Estadisticas } from '../../servicios/estadisticas';
import { Idioma } from '../../servicios/idioma';
import { PROPUESTA } from '../../../entornos/modo';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NEGOCIO, direccionCompleta, sucursal, VERSION_DATOS } from '../../servicios/datos';
import { Seo } from '../../servicios/seo';
import { restaurante } from '../../servicios/esquema';
import { Estado } from '../../componentes/estado';
import { Mapa } from '../../componentes/mapa';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const INDICE = [1, 2, 3, 4, 5, 6, 0];
const DAYS_LARGOS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

@Component({
  selector: 'app-sucursal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Estado, Mapa],
  templateUrl: './sucursal.html',
  styleUrl: './sucursal.css',
})
export class SucursalPagina {
  protected readonly est = inject(Estadisticas);
  protected readonly t = inject(Idioma).t;
  protected readonly r = inject(Idioma).r;
  protected readonly idioma = inject(Idioma).actual;
  /** Se lee en la plantilla: si la hoja de Google cambia los datos, la página se vuelve a dibujar. */
  protected readonly version = VERSION_DATOS;
  protected readonly propuesta = PROPUESTA;
  protected readonly s = sucursal(inject(ActivatedRoute).snapshot.data['sucursal']);
  protected readonly direccion = direccionCompleta(this.s);
  protected readonly precio = NEGOCIO.precioPorPersona;
  /** Días seguidos con el mismo horario van en una sola fila ("Todos los días", "Lunes a viernes"). */
  protected readonly semana = computed(() => {
    VERSION_DATOS();
    const ingles = this.idioma() === 'en';
    const dias = INDICE.map((d, i) => {
      const t = this.s.horario.turnos.find((x) => x.dias.includes(d));
      return { dia: (ingles ? DAYS_LARGOS : DIAS)[i], horas: t ? `${t.abre} ${ingles ? 'to' : 'a'} ${t.cierra}` : ingles ? 'Closed' : 'Cerrado' };
    });
    const grupos: { dia: string; horas: string }[] = [];
    for (let i = 0; i < dias.length; ) {
      let j = i;
      while (j + 1 < dias.length && dias[j + 1].horas === dias[i].horas) j++;
      const nombre = j - i === dias.length - 1 ? (ingles ? 'Every day' : 'Todos los días') : j === i ? dias[i].dia : ingles ? `${dias[i].dia} to ${dias[j].dia}` : `${dias[i].dia} a ${dias[j].dia.toLowerCase()}`;
      grupos.push({ dia: nombre, horas: dias[i].horas });
      i = j + 1;
    }
    return grupos;
  });
  protected readonly conEsquema = !!restaurante(this.s);

  constructor() {
    const s = this.s;
    inject(Seo).establecer({
      titulo: `Take-chan Ramen ${s.nombre} · Ramen Iekei${s.confirmada ? '' : this.t(' (por confirmar)')}`,
      descripcion: `${this.t('Ramen japonés estilo Iekei en')} ${s.direccion.calle}, ${s.direccion.colonia}, ${s.direccion.ciudad}. ${this.t('Horario, cómo llegar y pedido para recoger.')}`,
      ruta: `/${s.id}`,
      esquema: restaurante(s) ?? undefined,
    });
  }
}
