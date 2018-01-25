import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs-page';

import { TabOnePageOne } from '../tab-one-page-one/tab-one-page-one';
import { TabTwoPageOne } from '../tab-two-page-one/tab-two-page-one';
import { TabThreePageOne } from '../tab-three-page-one/tab-three-page-one';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tabOne',
        component: TabOnePageOne,
        outlet: 'tab-one'
      },
      {
        path: 'tabTwo',
        component: TabTwoPageOne,
        outlet: 'tab-two'
      },
      {
        path: 'tabThree',
        component: TabThreePageOne,
        outlet: 'tab-three'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
