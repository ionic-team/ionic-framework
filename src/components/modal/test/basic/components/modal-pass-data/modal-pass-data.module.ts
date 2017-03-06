import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalPassData } from './modal-pass-data';

@NgModule({
  declarations: [
    ModalPassData,
  ],
  imports: [
    DeepLinkModule.forChild(ModalPassData)
  ],
  entryComponents: [
    ModalPassData,
  ]
})
export class ModalPassDataModule {}
