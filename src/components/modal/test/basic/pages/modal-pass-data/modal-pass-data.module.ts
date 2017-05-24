import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModalPassDataModule {}
