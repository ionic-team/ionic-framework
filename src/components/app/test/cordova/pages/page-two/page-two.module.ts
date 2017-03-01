import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PageTwo } from './page-two';
import { MyModalModule } from '../modal/modal.module';

@NgModule({
  declarations: [
    PageTwo,
  ],
  imports: [
    DeepLinkModule.forChild(PageTwo),
    MyModalModule
  ],
  entryComponents: [
    PageTwo,
  ]
})
export class PageTwoModule {}
