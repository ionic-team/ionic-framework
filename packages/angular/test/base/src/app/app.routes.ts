import { Routes } from '@angular/router';

export const routes: Routes = [
  /**
   * Has to load lazily. The lazy app bootstraps from this same route table, and
   * eagerly pulling in a standalone component races its custom element
   * registration against the lazy loader's.
   */
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./app-landing/app-landing.component').then(c => c.AppLandingComponent)
  },
  {
    path: 'lazy',
    loadChildren: () => import('./lazy/app-lazy/app.module').then(m => m.AppModule)
  },
  {
    path: 'standalone',
    loadChildren: () => import('./standalone/app-standalone/app.routes').then(m => m.routes)
  }
];
