import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ENTORNO } from '../../entornos/entorno';
import { OFICIAL } from '../../entornos/modo';

/**
 * Estadísticas sin cookies con GoatCounter (gratis, sin banner de consentimiento).
 * No carga su script: usa su contador por URL (GET /count), así no entra código de terceros.
 * Solo en modo oficial y con código en el entorno (ENTORNO.goatcounter: "takechan" o una URL completa para pruebas).
 * Eventos: arma-tu-pedido, tecla/<platillo>, ticket-impreso, whatsapp-enviado, como-llegar/<sucursal>.
 * Las visitas desde los QR llegan con ?ref=mesa, ?ref=calco, ?ref=tarjeta o ?ref=qr-web, y GoatCounter las toma como origen (campaña.
 */
@Injectable({ providedIn: 'root' })
export class Estadisticas {
  private readonly doc = inject(DOCUMENT);
  private readonly destino = !ENTORNO.goatcounter ? '' : ENTORNO.goatcounter.startsWith('http') ? ENTORNO.goatcounter : `https://${ENTORNO.goatcounter}.goatcounter.com/count`;
  readonly activas = OFICIAL && !!this.destino && isPlatformBrowser(inject(PLATFORM_ID));
  private primera = true;

  /** Ruta actual sin la base (/Take-chan) y con su consulta, leída del navegador (sirve también en la primera carga). */
  rutaActual() {
    const base = new URL(this.doc.baseURI).pathname.replace(/\/$/, '');
    return (location.pathname.startsWith(base) ? location.pathname.slice(base.length) : location.pathname) + location.search;
  }

  /** Una visita a una página (se llama en cada navegación). */
  vista(ruta = this.rutaActual()) {
    if (!this.activas) return;
    const [p, q = ''] = ruta.split('#')[0].split('?');
    this.enviar({ p, t: this.doc.title, r: this.primera ? this.doc.referrer : '', q: q ? '?' + q : '' });
    this.primera = false;
  }

  /** Un evento (un clic que importa al negocio). */
  evento(nombre: string) {
    if (!this.activas) return;
    this.enviar({ p: nombre, t: nombre, e: 'true' });
  }

  private enviar(datos: Record<string, string>) {
    const url = new URL(this.destino);
    for (const [k, v] of Object.entries({ ...datos, s: String(screen.width), rnd: Math.random().toString(36).slice(2) })) if (v) url.searchParams.set(k, v);
    fetch(url, { mode: 'no-cors', keepalive: true, credentials: 'omit' }).catch(() => {});
  }
}
