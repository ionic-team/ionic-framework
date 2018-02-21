import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpeakerListPage } from './speaker-list';

const routes: Routes = [
  { path: '', component: SpeakerListPage}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpeakerListPageRoutingModule { }
