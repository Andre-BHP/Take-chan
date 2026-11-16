import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

/** Dominio de ejemplo (.test, reservado). Se cambia solo si el negocio autoriza publicar el sitio. */
export const BASE = 'https://take-chan-ramen.test';

/**
 * Título, descripción, canónico y JSON-LD de cada página.
 * Prototipo no oficial: siempre noindex, en local y en Pages.
 */
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly doc = inject(DOCUMENT);
  private readonly titulo = inject(Title);
  private readonly meta = inject(Meta);

  establecer(opc: { titulo: string; descripcion: string; ruta: string; esquema?: object | object[] }) {
    const url = `${BASE}${opc.ruta}`;
    this.titulo.setTitle(opc.titulo);
    this.meta.updateTag({ name: 'description', content: opc.descripcion });
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });
    this.meta.updateTag({ property: 'og:title', content: opc.titulo });
    this.meta.updateTag({ property: 'og:description', content: opc.descripcion });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_MX' });

    let canonico = this.doc.head.querySelector<HTMLLinkElement>('link[rel=canonical]');
    if (!canonico) {
      canonico = this.doc.createElement('link');
      canonico.rel = 'canonical';
      this.doc.head.appendChild(canonico);
    }
    canonico.href = url;

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
