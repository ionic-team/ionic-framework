import { NgModule } from '@angular/core';
import { IonicPageModule } from '../../../../../..';

import { ModalPassData } from './modal-pass-data';
import { SomeComponentProvider } from './provider';

@NgModule({
  declarations: [
    ModalPassData,
  ],
  imports: [
    IonicPageModule.forChild(ModalPassData)
  ],
  providers: [
    SomeComponentProvider
  ]
})
export class ModalPassDataModule {}
