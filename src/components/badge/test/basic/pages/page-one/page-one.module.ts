import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageOne } from './page-one';

@NgModule({
  declarations: [
    PageOne,
  ],
  imports: [
    IonicPageModule.forChild(PageOne),
  ],
  entryComponents: [
    PageOne,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PageOneModule {}
