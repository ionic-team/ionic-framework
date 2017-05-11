import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { PrimaryHeaderPage } from './primary-header-page';


@NgModule({
  imports: [
    IonicPageModule.forChild(PrimaryHeaderPage)
  ],
  declarations: [
    PrimaryHeaderPage
  ],
  entryComponents: [
    PrimaryHeaderPage,
  ]
})
export class PrimaryHeaderPageModule { }
