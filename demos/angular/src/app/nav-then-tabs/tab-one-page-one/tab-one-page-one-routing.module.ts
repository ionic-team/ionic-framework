import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabOnePageOne } from './tab-one-page-one';

const routes: Routes = [
  { path: '', component: TabOnePageOne}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabOnePageOneRoutingModule { }
