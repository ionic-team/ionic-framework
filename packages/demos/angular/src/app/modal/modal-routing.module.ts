import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPageComponent } from './modal-page.component';

const routes: Routes = [
  { path: '', component: ModalPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModalRoutingModule { }
