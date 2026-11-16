import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ENTORNO } from '../../entornos/entorno';
import { NEGOCIO } from './datos';

export interface AvisoDemo { titulo: string; texto: string; mensaje?: string }

/**
 * Todo contacto sale por aquí. En la versión publicada, o mientras el negocio no dé un WhatsApp,
 * nada se envía: se muestra el mensaje que se habría mandado.
 */
@Injectable({ providedIn: 'root' })
export class Contacto {
  private readonly numero = NEGOCIO.contacto.whatsapp.valor;
  readonly demo = ENTORNO.modoDemo || !this.numero;
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  readonly aviso = signal<AvisoDemo | null>(null);

  enviarWhatsapp(mensaje: string) {
    if (this.demo || !this.numero) {
      this.aviso.set({
        titulo: 'Modo demostración',
        texto: 'Este es el mensaje que le llegaría a Take-chan por WhatsApp. No se envió nada: el negocio todavía no tiene un WhatsApp de pedidos publicado.',
        mensaje,
      });
      return;
    }
    if (this.navegador) window.open(`https://wa.me/52${this.numero}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
  }
}
