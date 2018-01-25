import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageThree } from './page-three';

const routes: Routes = [
  { path: '', component: PageThree }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageThreeRoutingModule { }
