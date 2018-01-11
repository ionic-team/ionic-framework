import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecondPageComponent } from './second-page.component';

const routes: Routes = [
  { path: '', component: SecondPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecondPageRoutingModule { }
