import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabTwoPageThree } from './tab-two-page-three';

const routes: Routes = [
  { path: '', component: TabTwoPageThree}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabTwoPageThreeRoutingModule { }
