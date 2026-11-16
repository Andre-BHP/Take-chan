import { Routes } from '@angular/router';
import { conTelon } from './componentes/telon';

export const routes: Routes = [
  { path: '', canActivate: [conTelon], loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio) },
  { path: 'menu', canActivate: [conTelon], loadComponent: () => import('./paginas/menu/menu').then((m) => m.Menu) },
  { path: 'tlaquepaque', canActivate: [conTelon], data: { sucursal: 'tlaquepaque' }, loadComponent: () => import('./paginas/sucursal/sucursal').then((m) => m.SucursalPagina) },
  { path: 'americana', canActivate: [conTelon], data: { sucursal: 'americana' }, loadComponent: () => import('./paginas/sucursal/sucursal').then((m) => m.SucursalPagina) },
  { path: '**', canActivate: [conTelon], loadComponent: () => import('./paginas/no-encontrado').then((m) => m.NoEncontrado) },
];
