import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'signal-forms',
    loadComponent: () => import('./signal-forms/signal-forms.component').then(c => c.SignalFormsComponent)
  },
];
