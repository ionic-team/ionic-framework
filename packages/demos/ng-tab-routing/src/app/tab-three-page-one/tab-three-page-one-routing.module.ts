import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabThreePageOne } from './tab-three-page-one';

const routes: Routes = [
  { path: '', component: TabThreePageOne}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabThreePageOneRoutingModule { }
