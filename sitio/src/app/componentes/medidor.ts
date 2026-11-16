import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Movimiento } from '../servicios/movimiento';

// Geometría del tazón visto desde arriba (centro 200,200; interior de radio 168). Se calcula una vez, también en el prerender.
const C = 200;
const f = (n: number) => Math.round(n * 10) / 10;
const punto = (r: number, grados: number) => {
  const a = (grados * Math.PI) / 180;
  return [f(C + r * Math.cos(a)), f(C + r * Math.sin(a))];
};

/** Fideos: arcos paralelos que siguen la curva del tazón, con una ondulación leve (son rectos y gruesos, no rizados). */
const FIDEOS = Array.from({ length: 13 }, (_, i) => {
  const r = 70 + i * 7.2;
  const desde = 100 + (i % 4) * 5, hasta = 206 - (i % 3) * 6;
  const pts: string[] = [];
  for (let g = desde; g <= hasta; g += 4) {
    const [x, y] = punto(r + 1.8 * Math.sin((g + i * 41) / 8), g);
    pts.push((pts.length ? 'L' : 'M') + x + ' ' + y);
  }
  return pts.join('');
});

/** Remolino del tare: espiral de tres vueltas desde el centro. */
const ESPIRAL = (() => {
  const pts: string[] = [];
  for (let g = 0; g <= 1080; g += 8) {
    const [x, y] = punto(8 + (g / 1080) * 146, g - 90);
    pts.push((pts.length ? 'L' : 'M') + x + ' ' + y);
  }
  return pts.join('');
})();

/** Gotas de grasa sobre el caldo (posiciones fijas, sin azar en cada carga). */
const GOTAS = [
  [146, 214, 12], [118, 252, 6], [232, 168, 9], [206, 132, 5], [168, 176, 4], [262, 150, 6], [100, 196, 7],
  [228, 226, 4], [180, 244, 8], [140, 160, 3.5], [250, 196, 5], [212, 268, 3], [96, 230, 3], [160, 120, 6],
].map(([x, y, r]) => ({ x, y, r }));

/**
 * "Cómo se hace un Iekei": el tazón visto desde arriba se arma por capas mientras se leen los cuatro pasos.
 * El caldo se derrama del centro afuera, el tare entra en remolino, los fideos se trazan y los toppings caen.
 * Es una ilustración del estilo, no el platillo de Take-chan. Sin JavaScript o con movimiento reducido, sale completo.
 */
@Component({
  selector: 'app-medidor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.p1]': 'visto()', '[class.p2]': 'paso() >= 2', '[class.p3]': 'paso() >= 3', '[class.p4]': 'paso() >= 4' },
  template: `
    <div class="tazon-fijo">
      <div class="lienzo">
        <svg viewBox="0 0 400 400" role="img" aria-label="Ilustración de un tazón de ramen Iekei visto desde arriba que se arma por capas: caldo, tare, fideo y toppings">
          <defs>
            <radialGradient id="md-ceramica" cx="42%" cy="38%" r="70%"><stop offset="0" stop-color="#34302c" /><stop offset=".7" stop-color="#1f1c1a" /><stop offset="1" stop-color="#121110" /></radialGradient>
            <radialGradient id="md-caldo" cx="46%" cy="44%" r="60%"><stop offset="0" stop-color="#efd6ad" /><stop offset=".6" stop-color="#dcb684" /><stop offset="1" stop-color="#b98a55" /></radialGradient>
            <radialGradient id="md-gota" cx="38%" cy="34%" r="70%"><stop offset="0" stop-color="#fffaf0" stop-opacity="1" /><stop offset=".4" stop-color="#f8dca6" stop-opacity=".75" /><stop offset="1" stop-color="#d9a45c" stop-opacity="0" /></radialGradient>
            <radialGradient id="md-yema" cx="45%" cy="42%" r="62%"><stop offset="0" stop-color="#ffb43a" /><stop offset=".7" stop-color="#e5832b" /><stop offset="1" stop-color="#b85a1d" /></radialGradient>
            <radialGradient id="md-chashu" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#d9a28a" /><stop offset=".75" stop-color="#b47a5c" /><stop offset="1" stop-color="#7c4a33" /></radialGradient>
            <filter id="md-textura" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="ruido" />
              <feColorMatrix in="ruido" type="saturate" values="0" result="gris" />
              <feComponentTransfer in="gris" result="suave"><feFuncA type="linear" slope=".18" /></feComponentTransfer>
              <feComposite in="suave" in2="SourceGraphic" operator="in" result="grano" />
              <feBlend in="grano" in2="SourceGraphic" mode="multiply" />
            </filter>
            <filter id="md-difuso"><feGaussianBlur stdDeviation="7" /></filter>
            <clipPath id="md-interior"><circle cx="200" cy="200" r="168" /></clipPath>
          </defs>

          <!-- Tazón -->
          <circle cx="200" cy="200" r="198" fill="url(#md-ceramica)" />
          <circle cx="200" cy="200" r="184" fill="none" stroke="rgba(243,238,228,.07)" stroke-width="10" />
          <circle cx="200" cy="200" r="170" fill="#0c0b0a" />

          <g clip-path="url(#md-interior)">
            <!-- 1. Caldo con gotas de grasa -->
            <g class="capa caldo"><circle cx="200" cy="200" r="168" fill="url(#md-caldo)" filter="url(#md-textura)" /></g>
            <g class="capa gotas">@for (g of gotas; track $index) { <circle [attr.cx]="g.x" [attr.cy]="g.y" [attr.r]="g.r" fill="url(#md-gota)" /> }</g>
            <!-- 2. Tare: el caldo se oscurece en remolino -->
            <circle class="capa tono" cx="200" cy="200" r="168" fill="#8a5a33" />
            <path class="capa remolino" [attr.d]="espiral" pathLength="1" fill="none" stroke="#7a4522" stroke-width="22" stroke-linecap="round" filter="url(#md-difuso)" />
            <!-- 3. Fideos: cada uno con su sombra y su brillo -->
            <g class="capa fideos" fill="none" stroke-linecap="round">
              @for (d of fideos; track $index) {
                <path [attr.d]="d" pathLength="1" class="fideo-sombra" [style.--i]="$index" />
                <path [attr.d]="d" pathLength="1" class="fideo" [style.--i]="$index" />
              }
            </g>
          </g>

          <!-- 4. Toppings: espinaca, chashu, medio huevo y tres hojas de nori de pie en el borde -->
          <g class="capa top" style="--i: 0">
            <!-- Espinaca cocida: un montón compacto y oscuro, no hojas sueltas -->
            <g class="espinaca">
              <path d="M84 146c-6-26 14-50 40-50 14-14 40-10 48 8 18 6 22 30 8 42 2 20-20 32-38 24-14 12-38 10-48-4-16 0-24-8-10-20z" fill="#1d321a" />
              <path d="M98 140c-2-18 12-32 30-30 10-10 28-6 32 6 12 4 14 20 4 28 0 14-16 20-28 14-10 8-26 6-32-4-10-2-12-8-6-14z" fill="#2a4624" />
              <path d="M112 132c4-10 18-14 26-6 10-2 16 8 10 16-4 8-16 10-24 4-8 2-14-6-12-14z" fill="#36592d" />
              <path d="M100 150c16 6 34 6 50-2M108 120c10-4 22-4 34 2M126 106c6 8 8 20 4 32" stroke="#4f7442" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7" />
            </g>
          </g>
          <g class="capa top" style="--i: 1">
            <g transform="rotate(-18 292 262)">
              <ellipse cx="292" cy="262" rx="58" ry="44" fill="#5a3424" />
              <ellipse cx="292" cy="262" rx="54" ry="40" fill="url(#md-chashu)" />
              <ellipse cx="292" cy="262" rx="50" ry="36" fill="none" stroke="#f0dcc4" stroke-width="5" opacity=".75" />
              <path d="M262 252c18 6 40 4 58-6M258 270c22 8 46 6 66-6M276 236c10 4 22 4 34-2" stroke="#efd2b8" stroke-width="2" fill="none" opacity=".55" />
            </g>
            <g transform="rotate(12 252 304)">
              <ellipse cx="252" cy="304" rx="50" ry="38" fill="#5a3424" />
              <ellipse cx="252" cy="304" rx="46" ry="34" fill="url(#md-chashu)" />
              <ellipse cx="252" cy="304" rx="42" ry="30" fill="none" stroke="#f0dcc4" stroke-width="4.5" opacity=".75" />
              <path d="M224 298c18 6 38 4 54-6M230 316c16 4 30 2 42-6" stroke="#efd2b8" stroke-width="2" fill="none" opacity=".55" />
            </g>
          </g>
          <g class="capa top" style="--i: 2">
            <g transform="rotate(-8 168 318)">
              <ellipse cx="168" cy="318" rx="38" ry="29" fill="#c7995f" />
              <ellipse cx="168" cy="318" rx="35" ry="26" fill="#f4ecdc" />
              <ellipse cx="172" cy="316" rx="19" ry="15" fill="url(#md-yema)" />
              <ellipse cx="166" cy="311" rx="6" ry="3.5" fill="#ffe2a6" opacity=".7" />
            </g>
          </g>
          <g class="capa top nori" style="--i: 3">
            <rect x="258" y="22" width="40" height="92" rx="2" transform="rotate(26 278 68)" fill="#101612" stroke="#26322a" stroke-width="1" />
            <rect x="290" y="50" width="40" height="92" rx="2" transform="rotate(46 310 96)" fill="#151d18" stroke="#26322a" stroke-width="1" />
            <rect x="312" y="88" width="40" height="92" rx="2" transform="rotate(66 332 134)" fill="#121a15" stroke="#26322a" stroke-width="1" />
          </g>
        </svg>
      </div>
      <p class="leyenda t-dato" aria-hidden="true">
        {{ kanji[paso() - 1] }} · {{ pasos[paso() - 1].titulo }}<span class="desliza"> · desliza los pasos<svg viewBox="0 0 24 24" focusable="false"><path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
      </p>
      <p class="aviso-ilustracion">Ilustración del estilo</p>
    </div>
    <ol class="pasos" tabindex="0" aria-label="Pasos para hacer un Iekei">
      @for (p of pasos; track p.titulo; let i = $index) {
        <li class="paso" [class.activo]="paso() === i + 1" [attr.data-i]="i + 1">
          <span class="numero" lang="ja" aria-hidden="true">{{ kanji[i] }}</span>
          <div class="paso-texto">
            <h3 class="t-titulo"><span class="solo-lector">Paso {{ i + 1 }}: </span>{{ p.titulo }}</h3>
            <p>{{ p.texto }}</p>
          </div>
        </li>
      }
    </ol>
  `,
  styleUrl: './medidor.css',
})
export class Medidor {
  protected readonly pasos = [
    { titulo: 'El caldo', texto: 'Hueso de cerdo hervido a fuego alto hasta que el caldo se vuelve espeso, cremoso y casi blanco.' },
    { titulo: 'El tare', texto: 'Una base de salsa de soya va al fondo del tazón: le da el color y el sabor salado.' },
    { titulo: 'El fideo', texto: 'Grueso y recto, para que el caldo se le pegue. Se pide firme, normal o suave.' },
    { titulo: 'El tazón', texto: 'Espinaca, tres hojas de nori de pie en el borde, chashu y medio huevo marinado.' },
  ];
  protected readonly kanji = ['一', '二', '三', '四'];
  protected readonly fideos = FIDEOS;
  protected readonly espiral = ESPIRAL;
  protected readonly gotas = GOTAS;
  /** Paso visible: 4 (completo) en el prerender y con movimiento reducido. */
  protected readonly paso = signal(4);
  /** El caldo se sirve cuando la sección entra en vista. */
  protected readonly visto = signal(true);

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destruir = inject(DestroyRef);
    const movimiento = inject(Movimiento);
    afterNextRender(async () => {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const horizontal = matchMedia('(max-width: 899px)').matches;
      const lista = host.querySelector<HTMLElement>('.pasos');
      this.paso.set(1);
      this.visto.set(false);
      const servir = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        this.visto.set(true);
        servir.disconnect();
      }, { threshold: 0.3 });
      servir.observe(host.querySelector('.lienzo')!);
      destruir.onDestroy(() => servir.disconnect());
      if (horizontal && lista) {
        // Celular: el paso avanza con el scroll vertical y la tira de pasos se sincroniza; deslizarla sigue funcionando.
        const { ScrollTrigger } = await movimiento.herramientas();
        const st = ScrollTrigger.create({
          trigger: host, start: 'top 70%', end: 'bottom 40%',
          onUpdate: (s) => {
            const n = 1 + Math.floor(s.progress * 3.99);
            if (n === this.paso()) return;
            this.paso.set(n);
            const tarjeta = host.querySelector<HTMLElement>('.paso[data-i="' + n + '"]');
            if (tarjeta) lista.scrollTo({ left: tarjeta.offsetLeft - 16, behavior: 'smooth' });
          },
        });
        destruir.onDestroy(() => st.kill());
      }
      const io = new IntersectionObserver(
        (entradas) => {
          const visible = entradas.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) this.paso.set(Number((visible.target as HTMLElement).dataset['i']));
        },
        horizontal ? { root: lista, threshold: [0.6] } : { rootMargin: '-45% 0px -45% 0px' },
      );
      host.querySelectorAll('.paso').forEach((p) => io.observe(p));
      destruir.onDestroy(() => io.disconnect());
    });
  }
}
