import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FullPageModule { }
