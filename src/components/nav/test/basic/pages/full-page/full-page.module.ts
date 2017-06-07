import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { FullPage } from './full-page';


@NgModule({
  imports: [
    IonicPageModule.forChild(FullPage)
  ],
  declarations: [
    FullPage
  ],
  entryComponents: [
    FullPage,
  ]
})
export class FullPageModule { }
