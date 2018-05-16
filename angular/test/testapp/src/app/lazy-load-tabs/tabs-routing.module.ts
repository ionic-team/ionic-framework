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
        loadChildren: './mustang/mustang.module#MustangModule'
      },
      {
        path: 'camaro',
        outlet: 'tab2',
        loadChildren: './camaro/camaro.module#CamaroModule'
      },
      {
        path: 'charger',
        outlet: 'tab3',
        loadChildren: './charger/charger.module#ChargerModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/lazy-load-tabs/tabs/(tab1:mustang)'
  }
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
