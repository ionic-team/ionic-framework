import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasicInputsPageComponent } from './basic-inputs-page.component';

const routes: Routes = [
  { path: '', component: BasicInputsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BasicInputsPageRoutingModule { }
