import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { TabThreePageTwo } from './tab-three-page-two';

const routes: Routes = [
  { path: '', component: TabThreePageTwo}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabThreePageTwoRoutingModule { }
