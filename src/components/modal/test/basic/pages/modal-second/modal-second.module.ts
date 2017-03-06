import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalSecondPage } from './modal-second';

@NgModule({
  declarations: [
    ModalSecondPage,
  ],
  imports: [
    DeepLinkModule.forChild(ModalSecondPage)
  ],
  entryComponents: [
    ModalSecondPage,
  ]
})
export class ModalSecondPageModule {}
