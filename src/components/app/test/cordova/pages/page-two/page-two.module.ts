import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PageTwo } from './page-two';

@NgModule({
  declarations: [
    PageTwo,
  ],
  imports: [
    DeepLinkModule.forChild(PageTwo)
  ],
  entryComponents: [
    PageTwo,
  ]
})
export class PageTwoModule {}
