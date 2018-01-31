import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { TabsPage } from './tabs-page';

import { TabOnePageOne } from '../tab-one-page-one/tab-one-page-one';
import { TabOnePageTwo } from '../tab-one-page-two/tab-one-page-two';
import { TabOnePageThree } from '../tab-one-page-three/tab-one-page-three';

import { TabTwoPageOne } from '../tab-two-page-one/tab-two-page-one';
import { TabTwoPageTwo } from '../tab-two-page-two/tab-two-page-two';
import { TabTwoPageThree } from '../tab-two-page-three/tab-two-page-three';

import { TabThreePageOne } from '../tab-three-page-one/tab-three-page-one';
import { TabThreePageTwo } from '../tab-three-page-two/tab-three-page-two';
import { TabThreePageThree } from '../tab-three-page-three/tab-three-page-three';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'one',
        component: TabOnePageOne,
        outlet: 'tab-one'
      },
      {
        path: 'two',
        component: TabOnePageTwo,
        outlet: 'tab-one'
      },
      {
        path: 'three',
        component: TabOnePageThree,
        outlet: 'tab-one'
      },
      {
        path: 'one',
        component: TabTwoPageOne,
        outlet: 'tab-two'
      },
      {
        path: 'two',
        component: TabTwoPageTwo,
        outlet: 'tab-two'
      },
      {
        path: 'three',
        component: TabTwoPageThree,
        outlet: 'tab-two'
      },
      {
        path: 'one',
        component: TabThreePageOne,
        outlet: 'tab-three'
      },
      {
        path: 'two',
        component: TabThreePageTwo,
        outlet: 'tab-three'
      },
      {
        path: 'three',
        component: TabThreePageThree,
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
