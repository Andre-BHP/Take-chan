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
import { Movimiento } from '../../servicios/movimiento';

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
    { foto: 'olla', titulo: 'El caldo', texto: 'Hueso de cerdo hervido a fuego alto hasta que el caldo se vuelve espeso y cremoso.' },
    { foto: 'soya', titulo: 'El tare', texto: 'Una base de salsa de soya va al fondo del tazón: es la que da el sabor salado.' },
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
    const movimiento = inject(Movimiento);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      this.animar(host.nativeElement, movimiento, destruir);
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

  /** Paralaje leve de la foto del bento con el puntero (dis-032). */
  protected seguir(e: PointerEvent) {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty('--y', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  }

  /** Paralaje del héroe y apariciones al hacer scroll. Solo en navegador y sin movimiento reducido. */
  private async animar(raiz: HTMLElement, movimiento: Movimiento, destruir: DestroyRef) {
    if (movimiento.reducir) return;
    await new Promise<void>((listo) => (document.readyState === 'complete' ? listo() : addEventListener('load', () => listo(), { once: true })));
    const { gsap } = await movimiento.herramientas();
    const deshacerRevelar = await movimiento.revelar(raiz);
    const ctx = gsap.context(() => {
      const disparo = { trigger: '.heroe', start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.heroe-visual', { yPercent: 18, ease: 'none', scrollTrigger: disparo });
      gsap.to('.heroe-capa', { y: -60, opacity: 0, ease: 'none', scrollTrigger: { ...disparo, end: '70% top' } });
      // Paralaje interno de la foto de "Qué es el Iekei".
      gsap.fromTo('.iekei-foto', { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.iekei-marco', start: 'top bottom', end: 'bottom top', scrub: true } });
      // El borde de washi rasgado se abre con el scroll (dis-047).
      gsap.fromTo('.iekei', { '--rasgado': 0 }, { '--rasgado': 1, ease: 'none', scrollTrigger: { trigger: '.iekei', start: 'top bottom', end: 'top 55%', scrub: true } });
      // Las cifras reales se cuentan solas al entrar (dis-069).
      raiz.querySelectorAll<HTMLElement>('[data-contar]').forEach((el) => {
        const fin = Number(el.dataset['contar']);
        const dec = Number(el.dataset['decimales'] ?? 0);
        const obj = { v: 0 };
        el.textContent = (0).toFixed(dec);
        gsap.to(obj, { v: fin, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => { el.textContent = obj.v.toFixed(dec); } });
      });
    }, raiz);
    destruir.onDestroy(() => { ctx.revert(); deshacerRevelar(); });
  }
}
