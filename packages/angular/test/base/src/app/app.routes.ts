import { Routes } from '@angular/router';
import { AppLandingComponent } from './app-landing/app-landing.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AppLandingComponent
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
