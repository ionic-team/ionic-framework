import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'lazy', loadChildren: () => import('./app-lazy/app.module').then(m => m.AppModule)  }
];

