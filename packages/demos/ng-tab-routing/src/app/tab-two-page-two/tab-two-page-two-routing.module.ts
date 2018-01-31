import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { TabTwoPageTwo } from './tab-two-page-two';

const routes: Routes = [
  { path: '', component: TabTwoPageTwo}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabTwoPageTwoRoutingModule { }
