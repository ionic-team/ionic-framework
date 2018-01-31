import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToastPageComponent } from './toast-page.component';

const routes: Routes = [
  { path: '', component: ToastPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToastRoutingModule { }
