import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ModalChatPage } from './modal-chat-page';

@NgModule({
  declarations: [
    ModalChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalChatPage)
  ]
})
export class ModalChatPageModule {}
