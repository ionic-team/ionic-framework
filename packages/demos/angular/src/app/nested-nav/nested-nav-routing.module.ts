import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NestedNavPageComponent } from './nested-nav.component';

const routes: Routes = [
  {
    path: '',
    component: NestedNavPageComponent,
    children: [
      { path: 'nested-page-one', loadChildren: './nested-page-one/page-one.module#PageOneModule' },
      { path: 'nested-page-two', loadChildren: './nested-page-two/page-two.module#PageTwoModule' },
      { path: 'nested-page-three', loadChildren: './nested-page-three/page-three.module#PageThreeModule' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NestedNavRoutingModule { }
