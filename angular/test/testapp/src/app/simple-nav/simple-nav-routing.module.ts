import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SimpleNavPageComponent } from './simple-nav.component';

const routes: Routes = [
  {
    path: '',
    component: SimpleNavPageComponent,
    children: [
      { path: 'page-one', loadChildren: './page-one/page-one.module#PageOneModule' },
      { path: 'page-two', loadChildren: './page-two/page-two.module#PageTwoModule' },
      { path: 'page-three/:paramOne/:paramTwo', loadChildren: './page-three/page-three.module#PageThreeModule', data: { isProd: true} }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), IonicModule],
  exports: [RouterModule, IonicModule]
})
export class SimpleNavRoutingModule { }
