import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabOnePageTwo } from './tab-one-page-two';

const routes: Routes = [
  { path: '', component: TabOnePageTwo}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabOnePageTwoRoutingModule { }
