import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { PageTwo } from './page-two';
import { ModalPageModule } from '../modal/modal.module';

@NgModule({
  declarations: [
    PageTwo,
  ],
  imports: [
    DeepLinkModule.forChild(PageTwo),
    ModalPageModule
  ],
  entryComponents: [
    PageTwo,
  ]
})
export class PageTwoModule {}
