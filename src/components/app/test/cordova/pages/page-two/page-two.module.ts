import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageTwo } from './page-two';

@NgModule({
  declarations: [
    PageTwo,
  ],
  imports: [
    IonicPageModule.forChild(PageTwo)
  ],
  entryComponents: [
    PageTwo,
  ]
})
export class PageTwoModule {}
