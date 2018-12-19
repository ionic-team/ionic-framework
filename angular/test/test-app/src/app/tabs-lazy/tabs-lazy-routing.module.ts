import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsTab3Component } from './tabs-tab3/tabs-tab3.component';
import { TabsTab3NestedComponent } from './tabs-tab3-nested/tabs-tab3-nested.component';

const routes: Routes = [
  {
    path: '',
    component: TabsTab3Component
  },
  {
    path: 'nested',
    component: TabsTab3NestedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsLazyRoutingModule { }
