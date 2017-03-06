import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { Modal } from './modal';

@NgModule({
  declarations: [
    Modal,
  ],
  imports: [
    DeepLinkModule.forChild(Modal)
  ],
  entryComponents: [
    Modal,
  ]
})
export class ModalModule {}
