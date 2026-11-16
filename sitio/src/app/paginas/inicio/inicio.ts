import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NEGOCIO, SUCURSALES, direccionCorta, platillo } from '../../servicios/datos';
import { Seo } from '../../servicios/seo';
import { Tazon } from '../../componentes/tazon';
import { Noren } from '../../componentes/noren';
import { Estado } from '../../componentes/estado';
import { HuecoFoto } from '../../componentes/hueco-foto';

@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Tazon, Noren, Estado, HuecoFoto],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly tlaquepaque = SUCURSALES[0];
  protected readonly sucursales = SUCURSALES;
  protected readonly origen = NEGOCIO.origen;
  protected readonly clasico = platillo('iekei-clasico');
  protected readonly panceta = platillo('panceta');
  protected readonly huevo = platillo('huevo');
  protected readonly fideo = platillo('fideo-extra');
  protected readonly direccion = direccionCorta;

  constructor() {
    inject(Seo).establecer({
      titulo: 'Take-chan Ramen · Ramen Iekei en Tlaquepaque',
      descripcion: 'Ramen japonés estilo Iekei en Calz. Córdoba 24, Tlaquepaque. Caldo de cerdo con soya y fideo grueso, hechos en Japón según su ficha. Propuesta no oficial de sitio.',
      ruta: '/',
    });
  }
}
