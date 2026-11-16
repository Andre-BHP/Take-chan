import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio) },
  { path: 'menu', loadComponent: () => import('./paginas/menu/menu').then((m) => m.Menu) },
  { path: 'tlaquepaque', data: { sucursal: 'tlaquepaque' }, loadComponent: () => import('./paginas/sucursal/sucursal').then((m) => m.SucursalPagina) },
  { path: 'americana', data: { sucursal: 'americana' }, loadComponent: () => import('./paginas/sucursal/sucursal').then((m) => m.SucursalPagina) },
  { path: '**', loadComponent: () => import('./paginas/no-encontrado').then((m) => m.NoEncontrado) },
];
