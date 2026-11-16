import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Tazón de ramen Iekei ilustrado (SVG propio): tres hojas de nori, espinaca, panceta y huevo
 * sobre caldo de cerdo con soya. Es una ilustración, no una foto del platillo.
 * Con [vapor]="true" las volutas suben en bucle: el único momento animado de la portada (dis-023).
 */
@Component({
  selector: 'app-tazon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.con-vapor]': 'vapor()' },
  template: `
    <svg viewBox="0 0 440 400" role="img" [attr.aria-label]="etiqueta()">
      <defs>
        <radialGradient id="tz-sombra" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#000" stop-opacity=".55" />
          <stop offset="1" stop-color="#000" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="tz-volumen" x1="0" x2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".18" />
          <stop offset=".45" stop-color="#fff" stop-opacity="0" />
          <stop offset="1" stop-color="#3a2a1e" stop-opacity=".32" />
        </linearGradient>
        <radialGradient id="tz-caldo" cx="45%" cy="40%" r="65%">
          <stop offset="0" stop-color="#c99a68" />
          <stop offset="1" stop-color="#9c6d44" />
        </radialGradient>
      </defs>

      @if (vapor()) {
        <g class="vapor" fill="none" stroke="var(--washi)" stroke-linecap="round" aria-hidden="true">
          <path class="v1" stroke-width="7" d="M172 150c-18-26 16-44-2-72s10-46-4-74" />
          <path class="v2" stroke-width="9" d="M222 142c-20-30 18-48 0-80s12-50-2-78" />
          <path class="v3" stroke-width="6" d="M276 150c-16-24 14-40-2-66s8-42-4-68" />
        </g>
      }

      <ellipse cx="220" cy="378" rx="170" ry="16" fill="url(#tz-sombra)" />
      <path d="M152 350l10 22h116l10-22z" fill="var(--washi-fibra)" />
      <path d="M40 200c8 100 80 160 180 162 100-2 172-62 180-162z" fill="var(--washi)" />
      <path d="M40 200c8 100 80 160 180 162 100-2 172-62 180-162z" fill="url(#tz-volumen)" />
      <path d="M60 258c46 52 274 52 320 0" fill="none" stroke="var(--tinta-2)" stroke-width="3" opacity=".55" />
      <path d="M72 280c42 42 254 42 296 0" fill="none" stroke="var(--tinta-2)" stroke-width="1.5" opacity=".4" />

      <ellipse cx="220" cy="200" rx="180" ry="50" fill="var(--washi-2)" />
      <g class="nori">
        <rect x="104" y="92" width="58" height="124" rx="3" fill="#1d231f" transform="rotate(-12 133 154)" />
        <rect x="150" y="84" width="58" height="128" rx="3" fill="#232a25" transform="rotate(-4 179 148)" />
        <rect x="196" y="90" width="58" height="124" rx="3" fill="#1a1f1b" transform="rotate(5 225 152)" />
        <path d="M118 108l40 8M164 98l40 4M212 104l38 -2" stroke="#36403a" stroke-width="2" opacity=".7" />
      </g>
      <ellipse cx="220" cy="204" rx="164" ry="42" fill="url(#tz-caldo)" />
      <g fill="#dcbb8e" opacity=".75">
        <ellipse cx="300" cy="196" rx="7" ry="3" /><ellipse cx="318" cy="208" rx="4" ry="2" />
        <ellipse cx="236" cy="226" rx="6" ry="2.5" /><ellipse cx="120" cy="196" rx="5" ry="2" />
        <ellipse cx="196" cy="238" rx="4" ry="1.8" /><ellipse cx="340" cy="190" rx="3" ry="1.5" />
      </g>
      <g class="espinaca">
        <path d="M282 182c18-22 54-18 66 2-14 14-50 18-66-2z" fill="#3c4a2e" />
        <path d="M300 174c22-12 46-2 50 14-20 6-40 2-50-14z" fill="#4d5c38" />
        <path d="M306 188c10-4 26-2 34 4" stroke="#2c3622" stroke-width="2" fill="none" />
      </g>
      <g class="panceta" transform="rotate(-8 150 218)">
        <ellipse cx="150" cy="218" rx="60" ry="27" fill="#e1c3a6" />
        <ellipse cx="150" cy="217" rx="52" ry="22" fill="#a56e53" />
        <path d="M112 214c20-8 52-10 76 0M120 226c18-5 44-5 62 1" stroke="#c79478" stroke-width="3" fill="none" stroke-linecap="round" />
      </g>
      <g class="huevo">
        <ellipse cx="282" cy="226" rx="36" ry="21" fill="var(--washi)" />
        <ellipse cx="284" cy="225" rx="19" ry="11" fill="#c88a3a" />
        <ellipse cx="286" cy="224" rx="10" ry="5.5" fill="#b0702a" />
      </g>
    </svg>
  `,
  styles: `
    :host { display: block; }
    svg { width: 100%; height: auto; overflow: visible; }
    .vapor path { opacity: .4; transform-box: fill-box; transform-origin: 50% 100%; filter: blur(1.5px); }
    @media (prefers-reduced-motion: no-preference) {
      .vapor path { opacity: 0; animation: subir 6.4s linear infinite; }
      .vapor .v2 { animation-duration: 7s; animation-delay: -2.6s; }
      .vapor .v3 { animation-duration: 5.6s; animation-delay: -4.4s; }
      @keyframes subir {
        0% { opacity: 0; transform: translateY(24px) scaleY(.85); }
        22% { opacity: .55; }
        65% { opacity: .32; }
        100% { opacity: 0; transform: translateY(-46px) scaleY(1.08) skewX(-4deg); }
      }
    }
  `,
})
export class Tazon {
  readonly vapor = input(false);
  readonly etiqueta = input('Ilustración de un tazón de ramen Iekei con nori, espinaca, panceta y huevo');
}
