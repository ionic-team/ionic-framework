import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ChargerPage } from './charger.page';

const routes: Routes = [
  { path: '', component: ChargerPage, outlet: 'tab3' }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule, IonicModule]
})
export class ChargerPageRoutingModule { }
