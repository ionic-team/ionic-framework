import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabsPageComponent } from './tabs.component';

import { CamaroPage } from './camaro/camaro.page';
import { MustangPage } from './mustang/mustang.page';
import { ChargerPage } from './charger/charger.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPageComponent,
    children: [
      {
        path: 'mustang',
        outlet: 'tab1',
        component: MustangPage
      },
      {
        path: 'camaro',
        outlet: 'tab2',
        component: CamaroPage
      },
      {
        path: 'charger',
        outlet: 'tab3',
        component: ChargerPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/simple-tabs/tabs/(tab1:mustang)'
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    IonicModule
  ],
  declarations: [
    MustangPage,
    CamaroPage,
    ChargerPage
  ],
  exports: [
    RouterModule
  ]
})
export class TabsRoutingModule { }
