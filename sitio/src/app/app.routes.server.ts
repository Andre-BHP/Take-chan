import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  ...['', 'menu', 'tlaquepaque', 'americana', 'privacidad', 'accesibilidad', 'creditos'].flatMap((p) => [
    { path: p, renderMode: RenderMode.Prerender },
    { path: p ? `en/${p}` : 'en', renderMode: RenderMode.Prerender },
  ] as ServerRoute[]),
  { path: '**', renderMode: RenderMode.Prerender },
];
