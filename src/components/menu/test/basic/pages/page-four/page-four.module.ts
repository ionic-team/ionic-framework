import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PageFour } from './page-four';

@NgModule({
  declarations: [
    PageFour,
  ],
  imports: [
    DeepLinkModule.forChild(PageFour)
  ]
})
export class PageFourModule {}
