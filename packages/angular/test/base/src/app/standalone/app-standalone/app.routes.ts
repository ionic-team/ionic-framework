import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'test', loadComponent: () => import('../test/test.component').then(m => m.TestComponent) },
      { path: 'modal', loadComponent: () => import('../modal/modal.component').then(m => m.ModalComponent) },
    ]
  },
];

