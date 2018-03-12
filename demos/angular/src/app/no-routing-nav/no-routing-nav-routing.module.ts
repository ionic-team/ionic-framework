import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoRoutingNavPageComponent } from './no-routing-nav.component';

const routes: Routes = [
  { path: '', component: NoRoutingNavPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoRoutingNavRoutingModule { }
