import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'lazy', loadChildren: () => import('./app-lazy/app.module').then(m => m.AppModule) },
  { path: 'standalone', loadChildren: () => import('./app-standalone/app.routes').then(m => m.routes) }
];
