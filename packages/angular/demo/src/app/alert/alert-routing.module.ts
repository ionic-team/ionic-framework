import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertPageComponent } from './alert-page.component';

const routes: Routes = [
  { path: '', component: AlertPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertRoutingModule { }
