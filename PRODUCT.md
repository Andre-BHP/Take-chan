# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Angular 22 standalone con signals y prerender (SSG, `outputMode: static`), CSS propio sin librerías de UI. Mismo modelo que el proyecto Arleth. Publicado en GitHub Pages (`/SENSEI/`).

## Users
- **Principal:** quien descubre Take-chan Ramen en TikTok o en Maps y abre el sitio en el celular, casi siempre el mismo día, para saber qué pedir, si está abierto y cómo llegar.
- **Secundario:** el dueño del negocio, que verá el prototipo en el celular de André durante una visita en persona y debe reconocer su negocio en él.

## Product Purpose
Propuesta no oficial de sitio para Take-chan Ramen, un ramen estilo Iekei en Tlaquepaque que hoy no tiene sitio, menú público ni forma de pedir. Éxito: el visitante sabe en segundos qué es el Iekei, si el local está abierto, cómo llegar y cómo armar un pedido; el dueño ve su negocio ordenado y quiere el sitio.

## Positioning
Ramen Iekei (caldo de cerdo con soya, fideo grueso), con fideo y caldo hechos en Japón e importados según su ficha. El pedido se arma como en una máquina de tickets (食券機) de una ramen-ya japonesa.

## Operating Context
- Se abre en celular, a la hora de la comida; el local abre solo de 12:00 a 17:00.
- La demo se enseña en persona, en el teléfono de André.
- Pedido por WhatsApp en modo demostración: se muestra el mensaje, no se envía.

## Capabilities and Constraints
- Prototipo no oficial: aviso fijo, `noindex`, `robots.txt` con `Disallow: /`, sin teléfono ni correo reales.
- Todo dato no confirmado lleva `confirmado: false` en `src/datos/` y se muestra "por confirmar".
- Calidad: axe sin violaciones, sin scroll horizontal en 360 px, portada de menos de 500 KB, LCP de menos de 2.5 s en celular, `prefers-reduced-motion` respetado.
- Sin fotos propias todavía: el diseño se sostiene con ilustración SVG propia y tipografía, con huecos preparados para fotos.

## Brand Commitments
- Nombre: Take-chan Ramen (TAKE-CHAN RAMEN en Google). TikTok `@take_chan_sensei`.
- No hay logo ni colores públicos; si el negocio los da, sustituyen al acento propuesto.
- Japonés solo correcto y con sentido (家系ラーメン, 食券, のれん); nada de tipografías caricaturescas ni estereotipos.

## Evidence on Hand
- Dirección de Tlaquepaque, horario 12:00 a 17:00 (Google y TikTok), rango de 100 a 200 MXN por persona, 4.8 en Google. Fuente: `entregables/fuentes.md`.
- No existen: menú, precios, nombres de platillos, fotos propias, logo, teléfono, WhatsApp. No se inventan.
- La sucursal de la Americana (Prisciliano Sánchez 1110) está por confirmar.
- El título de "Presidente de la Asociación Internacional de Ramen" no está verificado y no se usa.

## Product Principles
1. Lo que no está confirmado se ve como "por confirmar", nunca como real.
2. Primero lo útil hoy: abierto ahora, dónde está, qué pedir.
3. Un pedido que se arma en segundos y sale como un ticket listo para WhatsApp.
4. Respeto a la cultura del ramen japonés sin disfrazarlo.

## Accessibility & Inclusion
WCAG 2.1 AA, verificado con axe en 390 y 1440 px. Movimiento reducido respetado.
