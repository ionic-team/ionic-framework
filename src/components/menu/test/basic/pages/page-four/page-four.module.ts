import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageFour } from './page-four';

@NgModule({
  declarations: [
    PageFour,
  ],
  imports: [
    IonicPageModule.forChild(PageFour)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageFourModule {}
