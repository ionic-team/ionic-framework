import { Routes } from '@angular/router';
import { NG_STATUS_CLASSES } from '@angular/forms/signals/compat';
import { provideSignalFormsConfig } from '@angular/forms/signals';

export const routes: Routes = [
  {
    path: 'signal-forms',
    loadComponent: () => import('./signal-forms/signal-forms.component').then(c => c.SignalFormsComponent)
  },
  {
    path: 'signal-forms-status-classes',
    providers: [provideSignalFormsConfig({ classes: NG_STATUS_CLASSES })],
    loadComponent: () => import('./signal-forms/signal-forms.component').then(c => c.SignalFormsComponent)
  },
];
