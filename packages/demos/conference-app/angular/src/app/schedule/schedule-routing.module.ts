import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SchedulePage } from './schedule';

const routes: Routes = [
  { path: '', component: SchedulePage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulePageRoutingModule { }
