import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NEGOCIO, SUCURSALES, direccionCorta, pesos, platillo } from '../../servicios/datos';
import { Seo } from '../../servicios/seo';
import { restaurante } from '../../servicios/esquema';
import { Foto } from '../../componentes/foto';
import { Mapa } from '../../componentes/mapa';
import { Vapor } from '../../componentes/vapor';
import { Noren } from '../../componentes/noren';
import { Estado } from '../../componentes/estado';
import { NotaEjemplo } from '../../componentes/nota-ejemplo';
import { Medidor } from '../../componentes/medidor';
import { Movimiento } from '../../servicios/movimiento';
import { Telon } from '../../componentes/telon';

@Component({
  selector: 'app-inicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Foto, Mapa, Vapor, Noren, Estado, NotaEjemplo, Medidor],
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

  constructor() {
    inject(Seo).establecer({
      titulo: 'Take-chan Ramen · Ramen Iekei en Tlaquepaque',
      descripcion: 'Ramen japonés estilo Iekei en Calz. Córdoba 24, Tlaquepaque. Caldo de cerdo con soya y fideo grueso, hechos en Japón según su ficha. Propuesta no oficial de sitio.',
      ruta: '/',
      esquema: SUCURSALES.map(restaurante).filter((e): e is object => !!e),
    });

    const movimiento = inject(Movimiento);
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destruir = inject(DestroyRef);
    afterNextRender(() => {
      this.animar(host.nativeElement, movimiento, destruir);
    });
  }

  private readonly telon = inject(Telon);

  /** Escritorio: la foto de la tarjeta tocada vuela y se convierte en su tecla en /menu (dis-034). */
  protected volar(e: PointerEvent, id: string) {
    if (!matchMedia('(min-width: 1100px)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches || !('startViewTransition' in document)) return;
    const foto = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('app-foto');
    if (!foto) return;
    foto.style.setProperty('view-transition-name', 'plato-' + id);
    this.telon.compartido = true;
  }

  /** TikTok con fachada: el embed oficial solo se carga al tocar (sin cookies de terceros antes). */
  protected readonly tiktok = NEGOCIO.redes.tiktok;
  protected readonly tiktokId = NEGOCIO.redes.tiktok.usuario.replace('@', '');
  protected readonly tiktokCargado = signal(false);
  protected cargarTiktok() {
    this.tiktokCargado.set(true);
    setTimeout(() => {
      const s = document.createElement('script');
      s.src = 'https://www.tiktok.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    }, 0);
  }

  /** Estrella de cinco puntas (24 × 24). */
  protected readonly estrella = 'M12 2.6l2.82 6.06 6.64.72-4.95 4.5 1.37 6.54L12 17.1l-5.88 3.32 1.37-6.54-4.95-4.5 6.64-.72z';

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
      // Pausa a sangre: paralaje lento de la foto.
      gsap.fromTo('.pausa-foto', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.pausa', start: 'top bottom', end: 'bottom top', scrub: true } });
      // El borde de washi rasgado se abre con el scroll (dis-047).
      gsap.fromTo('.iekei', { '--rasgado': 0 }, { '--rasgado': 1, ease: 'none', scrollTrigger: { trigger: '.iekei', start: 'top bottom', end: 'top 55%', scrub: true } });
      // Las cifras reales se cuentan solas al entrar (dis-069).
      raiz.querySelectorAll<HTMLElement>('[data-contar]').forEach((el) => {
        const fin = Number(el.dataset['contar']);
        const dec = Number(el.dataset['decimales'] ?? 0);
        el.style.display = 'inline-block';
        el.style.minWidth = el.offsetWidth + 'px';
        el.setAttribute('aria-hidden', 'true');
        el.insertAdjacentHTML('afterend', '<span class="solo-lector">' + el.dataset['contar'] + '</span>');
        const desde = Number(el.dataset['desde'] ?? 0);
        const obj = { v: desde };
        el.textContent = desde.toFixed(dec);
        gsap.to(obj, { v: fin, duration: 0.56, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => { el.textContent = obj.v.toFixed(dec); el.closest<HTMLElement>('.social')?.style.setProperty('--llenado', String(obj.v / 5)); } });
      });
    }, raiz);
    destruir.onDestroy(() => { ctx.revert(); deshacerRevelar(); });
  }
}
