import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    /**
     * Omit the slash at the beginning
     * so query params are preserved.
     * https://github.com/angular/angular/issues/13315#issuecomment-427254639
     */
    redirectTo: 'lazy'
  },
  { path: 'lazy', loadChildren: () => import('./lazy/app-lazy/app.module').then(m => m.AppModule) },
  { path: 'standalone', loadChildren: () => import('./standalone/app-standalone/app.routes').then(m => m.routes) }
];
