import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ModalChatPage } from './modal-chat-page';

@NgModule({
  declarations: [
    ModalChatPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalChatPage)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalChatPageModule {}
