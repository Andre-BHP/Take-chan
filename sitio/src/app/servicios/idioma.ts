import { Injectable, inject, isDevMode, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CanActivateFn } from '@angular/router';

export type IdiomaId = 'es' | 'en';

/**
 * Español (en la raíz) o inglés (bajo /en). Los textos se escriben en español en las plantillas y se pasan por t():
 * en inglés se buscan en el diccionario (i18n/en.ts), que solo se descarga en las páginas /en.
 * Lo que no esté en el diccionario (por ejemplo, un platillo nuevo de la hoja) se queda en español.
 */
@Injectable({ providedIn: 'root' })
export class Idioma {
  private readonly doc = inject(DOCUMENT);
  readonly actual = signal<IdiomaId>('es');
  private diccionario: Record<string, string> | null = null;

  /** Texto en el idioma actual (la llave es el texto en español). */
  readonly t = (es: string): string => {
    if (this.actual() === 'es' || !es) return es;
    const en = this.diccionario?.[es];
    if (en === undefined && isDevMode()) console.warn('[idioma] sin traducción:', es);
    return en ?? es;
  };

  /** Ruta en el idioma actual: /menu o /en/menu. */
  readonly r = (ruta: string): string => (this.actual() === 'en' ? '/en' + (ruta === '/' ? '' : ruta) : ruta);

  /** La misma página en el otro idioma (para el selector ES · EN y hreflang). */
  equivalente(url: string, id: IdiomaId): string {
    const [ruta, resto = ''] = url.split(/(?=[?#])/);
    const base = ruta.replace(/^\/en(?=\/|$)/, '') || '/';
    return (id === 'en' ? '/en' + (base === '/' ? '' : base) : base) + resto;
  }

  async usar(id: IdiomaId) {
    if (id === 'en' && !this.diccionario) this.diccionario = (await import('../i18n/en')).EN;
    this.actual.set(id);
    this.doc.documentElement.lang = id === 'en' ? 'en' : 'es-MX';
  }
}

/** Guardia de las rutas: fija el idioma (y carga el diccionario) antes de mostrar la página. */
export const conIdioma = (id: IdiomaId): CanActivateFn => () => inject(Idioma).usar(id).then(() => true);
