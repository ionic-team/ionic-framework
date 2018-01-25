import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageOne } from './page-one';

const routes: Routes = [
  { path: '', component: PageOne}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageOneRoutingModule { }
