import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabThreePageThree } from './tab-three-page-three';

const routes: Routes = [
  { path: '', component: TabThreePageThree}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabThreePageThreeRoutingModule { }
