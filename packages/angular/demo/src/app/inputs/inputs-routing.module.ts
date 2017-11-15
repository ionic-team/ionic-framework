import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InputsTestPageComponent } from './inputs-test-page.component';

const routes: Routes = [
  { path: '', component: InputsTestPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputsRoutingModule { }
