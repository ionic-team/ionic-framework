import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowHideWhenComponent } from './show-hide-when-page.component';

const routes: Routes = [
  { path: '', component: ShowHideWhenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowHideWhenRoutingModule { }
