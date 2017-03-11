import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalChatPage } from './modal-chat-page';

@NgModule({
  declarations: [
    ModalChatPage,
  ],
  imports: [
    DeepLinkModule.forChild(ModalChatPage)
  ]
})
export class ModalChatPageModule {}
