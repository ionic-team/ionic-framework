import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TabsPageComponent } from './tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsPageComponent,
    children: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule, IonicModule]
})
export class TabsRoutingModule { }
