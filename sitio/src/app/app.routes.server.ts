import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'menu', renderMode: RenderMode.Prerender },
  { path: 'tlaquepaque', renderMode: RenderMode.Prerender },
  { path: 'americana', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender },
];
