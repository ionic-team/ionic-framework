import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'popover', loadComponent: () => import('../popover/popover.component').then(m => m.PopoverComponent) },
    ]
  },
];

