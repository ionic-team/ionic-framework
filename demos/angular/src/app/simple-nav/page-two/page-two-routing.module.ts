import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageTwo } from './page-two';

const routes: Routes = [
  {
    path: '',
    component: PageTwo,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageTwoRoutingModule { }
