import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Vapor sobre la foto del héroe: el único momento animado de la portada (dis-023).
 * Tres volutas de humo difuso que suben despacio y se desvanecen; solo transform y opacity.
 * Con prefers-reduced-motion quedan quietas y tenues.
 */
@Component({
  selector: 'app-vapor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMax meet">
      <defs>
        <filter id="vp-difuso" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="9" /></filter>
        <linearGradient id="vp-desvanece" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset=".25" stop-color="#fff" stop-opacity=".9" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
      </defs>
      <g filter="url(#vp-difuso)" fill="none" stroke="url(#vp-desvanece)" stroke-linecap="round">
        <path class="v v1" stroke-width="26" d="M120 400c-30-60 40-90 10-160s30-110 0-200" />
        <path class="v v2" stroke-width="34" d="M165 400c-36-70 44-100 6-180s34-120 4-210" />
        <path class="v v3" stroke-width="22" d="M205 400c-26-56 34-86 8-150s26-100 2-190" />
      </g>
    </svg>
  `,
  styles: `
    :host { display: block; pointer-events: none; }
    svg { width: 100%; height: 100%; overflow: visible; }
    .v { opacity: .14; transform-box: fill-box; transform-origin: 50% 100%; }
    @media (prefers-reduced-motion: no-preference) {
      .v { opacity: 0; animation: subir 8s cubic-bezier(.33, 0, .2, 1) infinite; will-change: transform, opacity; }
      .v2 { animation-duration: 9.5s; animation-delay: -3.2s; }
      .v3 { animation-duration: 7s; animation-delay: -5.4s; }
      @keyframes subir {
        0% { opacity: 0; transform: translate3d(0, 40px, 0) scale(.9, .8); }
        25% { opacity: .32; }
        70% { opacity: .16; }
        100% { opacity: 0; transform: translate3d(-14px, -90px, 0) scale(1.15, 1.1); }
      }
    }
  `,
})
export class Vapor {}
