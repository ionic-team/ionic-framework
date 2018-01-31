import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { PopoverPageComponent } from './popover-page.component';

const routes: Routes = [
  { path: '', component: PopoverPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopoverRoutingModule { }
