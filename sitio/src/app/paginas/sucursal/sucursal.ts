import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NEGOCIO, direccionCompleta, sucursal } from '../../servicios/datos';
import { Seo } from '../../servicios/seo';
import { restaurante } from '../../servicios/esquema';
import { Estado } from '../../componentes/estado';
import { Foto } from '../../componentes/foto';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const INDICE = [1, 2, 3, 4, 5, 6, 0];

@Component({
  selector: 'app-sucursal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Estado, Foto],
  templateUrl: './sucursal.html',
  styleUrl: './sucursal.css',
})
export class SucursalPagina {
  protected readonly s = sucursal(inject(ActivatedRoute).snapshot.data['sucursal']);
  protected readonly direccion = direccionCompleta(this.s);
  protected readonly precio = NEGOCIO.precioPorPersona;
  protected readonly semana = INDICE.map((d, i) => {
    const t = this.s.horario.turnos.find((x) => x.dias.includes(d));
    return { dia: DIAS[i], horas: t ? `${t.abre} a ${t.cierra}` : 'Cerrado' };
  });
  protected readonly conEsquema = !!restaurante(this.s);

  constructor() {
    const s = this.s;
    inject(Seo).establecer({
      titulo: `Take-chan Ramen ${s.nombre} · Ramen Iekei${s.confirmada ? '' : ' (por confirmar)'}`,
      descripcion: `Ramen japonés estilo Iekei en ${s.direccion.calle}, ${s.direccion.colonia}, ${s.direccion.ciudad}. Horario, cómo llegar y pedido para recoger.`,
      ruta: `/${s.id}`,
      esquema: restaurante(s) ?? undefined,
    });
  }
}
