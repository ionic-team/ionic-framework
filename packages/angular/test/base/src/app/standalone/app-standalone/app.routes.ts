import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'test', loadComponent: () => import('../test/test.component').then(m => m.TestComponent) },
      { path: 'back-button', loadComponent: () => import('../back-button/back-button.component').then(m => m.BackButtonComponent) },
    ]
  },
];

