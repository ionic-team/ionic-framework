import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { PageFive } from './page-five';

@NgModule({
  declarations: [
    PageFive,
  ],
  imports: [
    IonicPageModule.forChild(PageFive)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageFiveModule {}
