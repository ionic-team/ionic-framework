import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VirtualScrollPageComponent } from './virtual-scroll-page.component';

const routes: Routes = [
  { path: '', component: VirtualScrollPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualScrollRoutingModule { }
