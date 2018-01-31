import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { NavPageComponent } from './nav.component';

const routes: Routes = [
  { path: '', component: NavPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavRoutingModule { }
