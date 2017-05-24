import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';
import { AnotherPage } from './another-page';


@NgModule({
  imports: [
    IonicPageModule.forChild(AnotherPage)
  ],
  declarations: [
    AnotherPage
  ],
  entryComponents: [
    AnotherPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnotherPageModule { }
