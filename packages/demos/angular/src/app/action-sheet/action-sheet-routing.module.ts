import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@danbucholtz/ng-router';

import { ActionSheetPageComponent } from './action-sheet-page.component';

const routes: Routes = [
  { path: '', component: ActionSheetPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionSheetRoutingModule { }
