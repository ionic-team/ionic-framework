import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'test', loadComponent: () => import('../test/test.component').then(m => m.TestComponent) },
<<<<<<< HEAD
=======
      { path: 'router-outlet', loadComponent: () => import('../router-outlet/router-outlet.component').then(m => m.RouterOutletComponent) },
      { path: 'router-link', loadComponent: () => import('../router-link/router-link.component').then(m => m.RouterLinkComponent) },
>>>>>>> 1f4f1e15fe (feat(angular): add standalone)
    ]
  },
];

