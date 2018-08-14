import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabsComponent } from './tabs.component';

import { CamaroComponent } from './camaro/camaro.component';
import { MustangComponent } from './mustang/mustang.component';
import { ChargerComponent } from './charger/charger.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsComponent,
    children: [
      {
        path: 'mustang',
        outlet: 'tab1',
        component: MustangComponent
      },
      {
        path: 'camaro',
        outlet: 'tab2',
        component: CamaroComponent
      },
      {
        path: 'charger',
        outlet: 'tab3',
        component: ChargerComponent
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
    MustangComponent,
    CamaroComponent,
    ChargerComponent
  ],
  exports: [
    RouterModule
  ]
})
export class TabsRoutingModule { }
