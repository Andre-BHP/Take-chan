import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio) },
  { path: '**', loadComponent: () => import('./paginas/no-encontrado').then((m) => m.NoEncontrado) },
];
