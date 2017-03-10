import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalPage } from './modal-page';

@NgModule({
  declarations: [
    ModalPage,
  ],
  imports: [
    DeepLinkModule.forChild(ModalPage)
  ]
})
export class ModalPageModule {}
