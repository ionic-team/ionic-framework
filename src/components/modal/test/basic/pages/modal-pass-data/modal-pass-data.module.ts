import { NgModule } from '@angular/core';
import { DeepLinkModule } from '../../../../../..';

import { ModalPassData } from './modal-pass-data';
import { SomeComponentProvider } from './provider';

@NgModule({
  declarations: [
    ModalPassData,
  ],
  imports: [
    DeepLinkModule.forChild(ModalPassData)
  ],
  providers: [
    SomeComponentProvider
  ]
})
export class ModalPassDataModule {}
