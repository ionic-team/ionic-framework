import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'popover', loadComponent: () => import('../popover/popover.component').then(m => m.PopoverComponent) },
      { path: 'modal', loadComponent: () => import('../modal/modal.component').then(m => m.ModalComponent) },
      { path: 'router-outlet', loadComponent: () => import('../router-outlet/router-outlet.component').then(m => m.RouterOutletComponent) },
      { path: 'back-button', loadComponent: () => import('../back-button/back-button.component').then(m => m.BackButtonComponent) },
      { path: 'nav', loadComponent: () => import('../nav/nav.component').then(m => m.NavComponent) },
    ]
  },
];

