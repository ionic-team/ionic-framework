import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabsPageComponent } from './tabs.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPageComponent,
    children: [
      {
        path: 'mustang',
        outlet: 'tab1',
        loadChildren: 'app/simple-tabs/mustang/mustang.module#MustangModule'
      },
      {
        path: 'camaro',
        outlet: 'tab2',
        loadChildren: 'app/simple-tabs/camaro/camaro.module#CamaroModule'
      },
      {
        path: 'charger',
        outlet: 'tab3',
        loadChildren: 'app/simple-tabs/charger/charger.module#ChargerModule'
      }
    ]
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TabsRoutingModule { }
