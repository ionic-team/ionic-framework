import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupInputsPageComponent } from './group-inputs-page.component';

const routes: Routes = [
  { path: '', component: GroupInputsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupInputsPageRoutingModule { }
