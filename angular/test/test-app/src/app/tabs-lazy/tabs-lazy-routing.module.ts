import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsTab3Component } from './tabs-tab3/tabs-tab3.component';

const routes: Routes = [
  {
    path: '',
    component: TabsTab3Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsLazyRoutingModule { }
