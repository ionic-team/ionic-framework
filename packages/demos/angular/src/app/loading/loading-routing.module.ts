import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { LoadingPageComponent } from './loading-page.component';

const routes: Routes = [
  { path: '', component: LoadingPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoadingRoutingModule { }
