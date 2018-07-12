import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ButtonPageComponent } from './button-page.component';

const routes: Routes = [
  { path: '', component: ButtonPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ButtonRoutingModule { }
