import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'popover', loadComponent: () => import('../popover/popover.component').then(m => m.PopoverComponent) },
      { path: 'test', loadComponent: () => import('../test/test.component').then(m => m.TestComponent) },
      { path: 'router-outlet', loadComponent: () => import('../router-outlet/router-outlet.component').then(m => m.RouterOutletComponent) },
    ]
  },
];

