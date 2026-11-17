import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ENTORNO } from '../../entornos/entorno';
import { PROPUESTA } from '../../entornos/modo';

export interface AvisoDemo { titulo: string; texto: string; mensaje?: string }

/**
 * Todo contacto sale por aquí. En modo propuesta, o mientras el entorno no tenga número, nada se envía:
 * se muestra el mensaje que se habría mandado. En modo oficial con número, abre WhatsApp con el pedido.
 */
@Injectable({ providedIn: 'root' })
export class Contacto {
  private readonly numero = ENTORNO.whatsapp.replace(/\D/g, '');
  readonly demo = PROPUESTA || !this.numero;
  private readonly navegador = isPlatformBrowser(inject(PLATFORM_ID));
  readonly aviso = signal<AvisoDemo | null>(null);

  /** Enlace de WhatsApp con el mensaje ya escrito (vacío en modo demostración). */
  enlaceWhatsapp(mensaje: string) {
    return this.demo ? '' : `https://wa.me/${this.numero}?text=${encodeURIComponent(mensaje)}`;
  }

  enviarWhatsapp(mensaje: string) {
    if (this.demo) {
      this.aviso.set({
        titulo: 'Modo demostración',
        texto: 'Este es el mensaje que le llegaría a Take-chan por WhatsApp. No se envió nada: el negocio todavía no tiene un WhatsApp de pedidos publicado.',
        mensaje,
      });
      return;
    }
    if (this.navegador) window.open(this.enlaceWhatsapp(mensaje), '_blank', 'noopener');
  }
}
