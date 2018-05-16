import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CamaroPage } from './camaro.page';

const routes: Routes = [
  { path: '', component: CamaroPage, outlet: 'tab2' }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule, IonicModule]
})
export class CamaroPageRoutingModule { }
