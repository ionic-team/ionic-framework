import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrimaryHeaderPageModule { }
