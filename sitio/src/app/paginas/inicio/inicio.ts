import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SUCURSALES, direccionCorta, pesos, platillo } from '../../servicios/datos';
import { Seo } from '../../servicios/seo';
import { restaurante } from '../../servicios/esquema';
import { Foto } from '../../componentes/foto';
import { Vapor } from '../../componentes/vapor';
import { Noren } from '../../componentes/noren';
import { Estado } from '../../componentes/estado';
import { NotaEjemplo } from '../../componentes/nota-ejemplo';

@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Foto, Vapor, Noren, Estado, NotaEjemplo],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly tlaquepaque = SUCURSALES[0];
  protected readonly sucursales = SUCURSALES;
  protected readonly clasico = platillo('iekei-clasico');
  protected readonly extras = [platillo('iekei-chashu'), platillo('iekei-huevo'), platillo('gyoza')];
  protected readonly direccion = direccionCorta;
  protected readonly pesos = pesos;
  protected readonly pasos = [
    { foto: 'clasico', titulo: 'El caldo', texto: 'Hueso de cerdo hervido a fuego alto hasta que el caldo se vuelve espeso y cremoso.' },
    { foto: 'tare', titulo: 'El tare', texto: 'Una base de salsa de soya va al fondo del tazón: es la que da el sabor salado.' },
    { foto: 'fideo', titulo: 'El fideo', texto: 'Grueso y recto. Se pide firme, normal o suave.' },
    { foto: 'tazon', titulo: 'El tazón', texto: 'Espinaca, tres hojas de nori y chashu. Sabor y grasa al gusto.' },
  ];

  constructor() {
    inject(Seo).establecer({
      titulo: 'Take-chan Ramen · Ramen Iekei en Tlaquepaque',
      descripcion: 'Ramen japonés estilo Iekei en Calz. Córdoba 24, Tlaquepaque. Caldo de cerdo con soya y fideo grueso, hechos en Japón según su ficha. Propuesta no oficial de sitio.',
      ruta: '/',
      esquema: SUCURSALES.map(restaurante).filter((e): e is object => !!e),
    });

    // "Cómo se hace un Iekei" (dis-028): en escritorio la sección queda fija y la pista avanza en horizontal.
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      const seccion = host.nativeElement.querySelector<HTMLElement>('.como');
      const pista = host.nativeElement.querySelector<HTMLElement>('.pista');
      if (!seccion || !pista) return;
      const ancho = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
      let cuadro = 0;
      const medir = () => {
        if (!ancho.matches) {
          seccion.style.removeProperty('--alto');
          pista.style.transform = '';
          return;
        }
        const recorrido = Math.max(0, pista.scrollWidth - innerWidth);
        seccion.style.setProperty('--alto', `${recorrido + innerHeight}px`);
        mover();
      };
      const mover = () => {
        cancelAnimationFrame(cuadro);
        cuadro = requestAnimationFrame(() => {
          if (!ancho.matches) return;
          const recorrido = Math.max(0, pista.scrollWidth - innerWidth);
          const avance = Math.min(1, Math.max(0, -seccion.getBoundingClientRect().top / Math.max(1, seccion.offsetHeight - innerHeight)));
          pista.style.transform = `translate3d(${-avance * recorrido}px, 0, 0)`;
        });
      };
      medir();
      addEventListener('scroll', mover, { passive: true });
      addEventListener('resize', medir);
      ancho.addEventListener('change', medir);
      destruir.onDestroy(() => {
        removeEventListener('scroll', mover);
        removeEventListener('resize', medir);
        ancho.removeEventListener('change', medir);
      });
    });
  }
}
