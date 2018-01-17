import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentPageComponent } from './content-page.component';

const routes: Routes = [
  { path: '', component: ContentPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
