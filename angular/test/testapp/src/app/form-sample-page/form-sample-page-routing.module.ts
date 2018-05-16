import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormSamplePageComponent } from './form-sample-page.component';

const routes: Routes = [
  { path: '', component: FormSamplePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormSamplePageRoutingModule { }
