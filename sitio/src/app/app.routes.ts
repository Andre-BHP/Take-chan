import { Routes } from '@angular/router';
import { conTelon } from './componentes/telon';
import { IdiomaId, conIdioma } from './servicios/idioma';

/** Las mismas páginas en español (raíz) y en inglés (/en): cambian solo los textos (servicios/idioma.ts). */
const paginas = (id: IdiomaId): Routes => [
  { path: '', canActivate: [conIdioma(id), conTelon], loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio) },
  { path: 'menu', canActivate: [conIdioma(id), conTelon], loadComponent: () => import('./paginas/menu/menu').then((m) => m.Menu) },
  { path: 'tlaquepaque', canActivate: [conIdioma(id), conTelon], data: { sucursal: 'tlaquepaque' }, loadComponent: () => import('./paginas/sucursal/sucursal').then((m) => m.SucursalPagina) },
  { path: 'americana', canActivate: [conIdioma(id), conTelon], data: { sucursal: 'americana' }, loadComponent: () => import('./paginas/sucursal/sucursal').then((m) => m.SucursalPagina) },
];

export const routes: Routes = [
  { path: 'en', children: [...paginas('en'), { path: '**', canActivate: [conIdioma('en'), conTelon], loadComponent: () => import('./paginas/no-encontrado').then((m) => m.NoEncontrado) }] },
  ...paginas('es'),
  { path: '**', canActivate: [conIdioma('es'), conTelon], loadComponent: () => import('./paginas/no-encontrado').then((m) => m.NoEncontrado) },
];
