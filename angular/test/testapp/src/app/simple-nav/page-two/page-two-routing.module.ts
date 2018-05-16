import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PageTwo } from './page-two';

const routes: Routes = [
  {
    path: '',
    component: PageTwo,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule, IonicModule]
})
export class PageTwoRoutingModule { }
