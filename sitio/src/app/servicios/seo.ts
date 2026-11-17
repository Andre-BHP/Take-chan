import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ENTORNO } from '../../entornos/entorno';
import { OFICIAL } from '../../entornos/modo';
import { Idioma } from './idioma';

/** Dominio público del entorno; en la propuesta, uno de ejemplo (.test, reservado) solo para el JSON-LD. */
export const BASE = ENTORNO.dominio || 'https://take-chan-ramen.test';
/** Raíz absoluta para las imágenes al compartir (WhatsApp y X las piden con dominio). */
const PUBLICO = ENTORNO.dominio || ENTORNO.publico;
/** Imagen de 1200 × 630 de cada página (herramientas/og.mjs), con su versión de propuesta u oficial. */
const IMAGENES: Record<string, string> = { '/': 'inicio', '/menu': 'menu', '/tlaquepaque': 'tlaquepaque', '/americana': 'americana', '/links': 'links' };

/**
 * Título, descripción, canónico y JSON-LD de cada página.
 * Propuesta: noindex y sin URL canónica. Oficial: index y canónica con el dominio del entorno.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly doc = inject(DOCUMENT);
  private readonly titulo = inject(Title);
  private readonly meta = inject(Meta);
  private readonly idioma = inject(Idioma);

  establecer(opc: { titulo: string; descripcion: string; ruta: string; esquema?: object | object[] }) {
    // opc.ruta es la ruta en español; en inglés la página vive bajo /en.
    const en = this.idioma.actual() === 'en';
    const rutaEn = '/en' + (opc.ruta === '/' ? '' : opc.ruta);
    const url = `${BASE}${en ? rutaEn : opc.ruta}`;
    this.titulo.setTitle(opc.titulo);
    this.meta.updateTag({ name: 'description', content: opc.descripcion });
    this.meta.updateTag({ name: 'robots', content: OFICIAL ? 'index, follow' : 'noindex, nofollow' });
    this.meta.updateTag({ property: 'og:title', content: opc.titulo });
    this.meta.updateTag({ property: 'og:description', content: opc.descripcion });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: en ? 'en_US' : 'es_MX' });
    this.meta.updateTag({ property: 'og:locale:alternate', content: en ? 'es_MX' : 'en_US' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Take-chan Ramen' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: opc.titulo });
    this.meta.updateTag({ name: 'twitter:description', content: opc.descripcion });
    const imagen = `${PUBLICO}/og/${OFICIAL ? 'oficial' : 'propuesta'}/${IMAGENES[opc.ruta] ?? 'inicio'}.jpg`;
    if (PUBLICO) {
      this.meta.updateTag({ property: 'og:image', content: imagen });
      this.meta.updateTag({ property: 'og:image:width', content: '1200' });
      this.meta.updateTag({ property: 'og:image:height', content: '630' });
      this.meta.updateTag({ property: 'og:image:alt', content: opc.titulo });
      this.meta.updateTag({ name: 'twitter:image', content: imagen });
    }

    let canonico = this.doc.head.querySelector<HTMLLinkElement>('link[rel=canonical]');
    if (OFICIAL) {
      if (!canonico) {
        canonico = this.doc.createElement('link');
        canonico.rel = 'canonical';
        this.doc.head.appendChild(canonico);
      }
      canonico.href = url;
      this.meta.updateTag({ property: 'og:url', content: url });
    } else {
      canonico?.remove();
    }

    // hreflang: la misma página en español, en inglés y la de omisión (español).
    this.doc.head.querySelectorAll('link[rel=alternate][hreflang]').forEach((l) => l.remove());
    const raiz = OFICIAL ? BASE : PUBLICO;
    if (raiz && opc.ruta !== '/404') {
      for (const [lengua, ruta] of [['es-MX', opc.ruta], ['en', rutaEn], ['x-default', opc.ruta]]) {
        const l = this.doc.createElement('link');
        l.rel = 'alternate';
        l.setAttribute('hreflang', lengua);
        l.href = `${raiz}${ruta}`;
        this.doc.head.appendChild(l);
      }
    }

    this.doc.head.querySelectorAll('script[data-esquema]').forEach((s) => s.remove());
    const esquemas = opc.esquema ? (Array.isArray(opc.esquema) ? opc.esquema : [opc.esquema]) : [];
    for (const e of esquemas) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-esquema', '');
      script.textContent = JSON.stringify(e);
      this.doc.head.appendChild(script);
    }
  }
}
