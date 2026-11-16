import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Gsap = typeof import('gsap').gsap;
type ST = typeof import('gsap/ScrollTrigger').ScrollTrigger;
type Split = typeof import('gsap/SplitText').SplitText;
export interface Herramientas { gsap: Gsap; ScrollTrigger: ST; SplitText: Split }

/** Curvas de DESIGN.md para GSAP (equivalentes a --ease-out y --ease-in-out). */
export const CURVA_SALIDA = 'expo.out';
export const CURVA_TELA = 'back.out(1.3)';

/**
 * Sistema de movimiento: Lenis (scroll suave) y GSAP con ScrollTrigger y SplitText.
 * Solo en el navegador y nunca en el prerender. Con prefers-reduced-motion no se carga nada:
 * el contenido ya está visible por defecto y las apariciones se quedan quietas.
 */
@Injectable({ providedIn: 'root' })
export class Movimiento {
  readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  private cargando: Promise<Herramientas> | null = null;
  private lenis: import('lenis').default | null = null;

  get reducir() {
    return !this.navegador || matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** GSAP con sus plugins, cargado una sola vez y de forma diferida. */
  herramientas(): Promise<Herramientas> {
    this.cargando ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]).then(([g, s, t]) => {
      g.gsap.registerPlugin(s.ScrollTrigger, t.SplitText);
      g.gsap.defaults({ ease: CURVA_SALIDA, duration: 0.56 });
      return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger, SplitText: t.SplitText };
    });
    return this.cargando;
  }

  /** Lenis conectado al reloj de GSAP. Se llama una vez desde App. */
  async iniciarScroll() {
    if (this.reducir || this.lenis) return;
    const [{ default: Lenis }, { gsap, ScrollTrigger }] = await Promise.all([import('lenis'), this.herramientas()]);
    this.lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -96 } });
    this.lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => this.lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /** Al cambiar de página: arriba sin animar y medidas nuevas. */
  async alNavegar() {
    if (this.reducir) return;
    this.lenis?.scrollTo(0, { immediate: true });
    const { ScrollTrigger } = await this.herramientas();
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  irA(objetivo: HTMLElement) {
    if (this.lenis) this.lenis.scrollTo(objetivo, { offset: -140 });
    else objetivo.scrollIntoView({ behavior: this.reducir ? 'auto' : 'smooth', block: 'start' });
  }

  /**
   * Apariciones al hacer scroll para los elementos con [data-revelar] dentro de raiz.
   * data-revelar="lineas" divide el texto en líneas con máscara (SplitText).
   */
  async revelar(raiz: HTMLElement): Promise<() => void> {
    if (this.reducir) return () => {};
    const { gsap, ScrollTrigger, SplitText } = await this.herramientas();
    const divisiones: InstanceType<Split>[] = [];
    const ctx = gsap.context(() => {
      raiz.querySelectorAll<HTMLElement>('[data-revelar]').forEach((el) => {
        const tipo = el.dataset['revelar'];
        const disparo = { trigger: el, start: 'top 88%', once: true };
        if (tipo === 'lineas') {
          const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'linea' });
          divisiones.push(s);
          gsap.from(s.lines, { yPercent: 105, duration: 0.9, stagger: 0.08, scrollTrigger: disparo });
        } else if (tipo === 'grupo') {
          gsap.from(el.children, { y: 24, opacity: 0, duration: 0.56, stagger: 0.08, scrollTrigger: disparo });
        } else if (tipo === 'cortina') {
          gsap.from(el, { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'power3.inOut', scrollTrigger: disparo });
        } else {
          gsap.from(el, { y: 24, opacity: 0, duration: 0.56, scrollTrigger: disparo });
        }
      });
    }, raiz);
    ScrollTrigger.refresh();
    return () => {
      divisiones.forEach((s) => s.revert());
      ctx.revert();
    };
  }
}
