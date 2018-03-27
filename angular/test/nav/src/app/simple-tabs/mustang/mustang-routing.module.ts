import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MustangPage } from './mustang.page';

const routes: Routes = [
  { path: '', component: MustangPage, outlet: 'tab1' }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule, IonicModule]
})
export class MustangPageRoutingModule { }
